import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { candidateMediaAltRepair, planCandidateCopyRepairs } from "../src/lib/official-candidate-copy.mjs";
import { applyCandidateMediaAltRepair, applyCandidateTextRepair } from "../src/lib/official-candidate-write.mjs";

const isolatedMode = process.env.OFFICIAL_CANDIDATE_COPY_ISOLATED_TEST === "YES";
const productionMode = process.env.OFFICIAL_CANDIDATE_COPY_PRODUCTION_CONFIRM === "YES";
if (!isolatedMode && !productionMode) throw new Error("Set the isolated-test or explicit production confirmation gate.");
const testTarget = new URL(process.env.DATABASE_URL || "postgresql://invalid/invalid");
const localTarget = testTarget.pathname === "/candidate_copy_test" && ["127.0.0.1", "localhost", "[::1]"].includes(testTarget.hostname) && testTarget.port === "55439";
if (isolatedMode && !localTarget) throw new Error("Isolated mode only supports candidate_copy_test on port 55439.");
if (productionMode && (localTarget || !process.env.OFFICIAL_CANDIDATE_COPY_PRODUCTION_TARGET)) throw new Error("Production mode requires a non-local target and OFFICIAL_CANDIDATE_COPY_PRODUCTION_TARGET.");
if (process.env.OFFICIAL_CANDIDATE_COPY_CONFIRM !== "YES") throw new Error("Set OFFICIAL_CANDIDATE_COPY_CONFIRM=YES to apply this targeted repair.");
if (process.env.OFFICIAL_CANDIDATE_COPY_EDIT_FREEZE !== "CONFIRMED") throw new Error("Confirm the candidate editing freeze before running the write operation.");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const backup = process.env.OFFICIAL_CANDIDATE_COPY_BACKUP;
if (!backup || !(await fs.stat(backup).catch(() => null))?.isFile()) throw new Error("Set OFFICIAL_CANDIDATE_COPY_BACKUP to an existing database backup file.");
const requestedJournalPath = path.resolve(process.env.OFFICIAL_CANDIDATE_COPY_JOURNAL || `.local/backups/official-copy-repair-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
const requestedCommitPath = `${requestedJournalPath}.committed`;
if (await fs.stat(requestedJournalPath).catch(() => null)) throw new Error("Refusing to overwrite an existing candidate repair journal.");
if (await fs.stat(requestedCommitPath).catch(() => null)) throw new Error("Refusing to reuse an existing candidate repair commit marker.");

const require = createRequire(import.meta.url);
const { Client } = createRequire(require.resolve("@payloadcms/db-postgres"))("pg");
const source = JSON.parse(await fs.readFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const mergedIds = new Set([754923, 754921, 754926, 754931, 754932, 754918, 754919]);
const candidates = source.products.filter(candidate => !mergedIds.has(Number(candidate.sourceUrl.match(/\/(\d+)\.html$/)?.[1])));
if (candidates.length !== 21 || new Set(candidates.map(candidate => candidate.sourceUrl)).size !== 21) throw new Error("Unexpected official candidate inventory");

const client = new Client({ connectionString: process.env.DATABASE_URL });
let committed = false;
let commitAttempted = false;
let journalPath;
let journal;
try {
  await client.connect();
  await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
  const { rows } = await client.query(`SELECT p.id, p.slug, p.source_url AS "sourceUrl", p.review_status AS "reviewStatus", p.claims_verified AS "claimsVerified", p.image_id AS "mediaId", l.name, l.intro, m.alt,
      (SELECT count(*)::integer FROM products linked WHERE linked.image_id=p.image_id) AS "productMediaUses"
    FROM products p JOIN products_locales l ON l._parent_id=p.id AND l._locale='en'
    LEFT JOIN media_locales m ON m._parent_id=p.image_id AND m._locale='en'
    WHERE p.slug=ANY($1::text[])`, [candidates.map(candidate => `official-${candidate.sourceUrl.match(/\/(\d+)\.html$/)[1]}`)]);
  const plans = planCandidateCopyRepairs(candidates, rows);
  if (plans.length !== 21 || plans.some(plan => plan.status === "missing" || plan.status === "conflict")) throw new Error("Candidate inventory has missing or conflicting records; no changes applied");

  const references = await client.query(`SELECT ns.nspname AS schema_name, rel.relname AS table_name, attr.attname AS column_name
    FROM pg_constraint fk JOIN pg_class rel ON rel.oid=fk.conrelid JOIN pg_namespace ns ON ns.oid=rel.relnamespace
    JOIN pg_attribute attr ON attr.attrelid=fk.conrelid AND attr.attnum=fk.conkey[1]
    WHERE fk.contype='f' AND fk.confrelid='public.media'::regclass AND array_length(fk.conkey,1)=1 AND ns.nspname='public'`);
  const mediaIds = [...new Set(rows.map(row => row.mediaId).filter(id => id != null))];
  const quote = value => `"${value.replaceAll('"', '""')}"`;
  const occupiedMedia = new Set();
  for (const ref of references.rows) {
    if (ref.table_name === "products" || ref.table_name === "media_locales") continue;
    const check = await client.query(`SELECT DISTINCT ${quote(ref.column_name)} AS id FROM ${quote(ref.schema_name)}.${quote(ref.table_name)} WHERE ${quote(ref.column_name)}=ANY($1::integer[])`, [mediaIds]);
    for (const item of check.rows) occupiedMedia.add(item.id);
  }
  await client.query("SELECT id FROM media WHERE id=ANY($1::integer[]) ORDER BY id FOR UPDATE", [mediaIds]);
  const textPlans = new Map(plans.map(plan => [plan.slug, plan]));
  const preview = rows.map(row => {
    const candidate = candidates.find(item => item.sourceUrl === row.sourceUrl);
    const plan = textPlans.get(row.slug);
    const alt = candidateMediaAltRepair(candidate, row.alt);
    const mediaConflict = row.productMediaUses !== 1 || occupiedMedia.has(row.mediaId);
    return { slug: row.slug, id: row.id, text: plan.changes, media: { id: row.mediaId, status: mediaConflict ? "conflict" : alt === null ? "preserved" : "change", ...(mediaConflict || alt === null ? {} : { alt }) } };
  });
  if (preview.some(row => row.media.status === "conflict")) throw new Error("Candidate media has another database reference; no changes applied");

  const serialized = JSON.stringify(preview);
  const backupBytes = await fs.readFile(backup);
  journal = {
    status: "prepared",
    createdAt: new Date().toISOString(),
    backup: path.resolve(backup),
    backupSha256: crypto.createHash("sha256").update(backupBytes).digest("hex"),
    planSha256: crypto.createHash("sha256").update(serialized).digest("hex"),
    changes: [],
  };
  journalPath = requestedJournalPath;
  await fs.mkdir(path.dirname(journalPath), { recursive: true });
  for (const row of preview) {
    const candidate = candidates.find(item => item.sourceUrl === rows.find(value => value.slug === row.slug).sourceUrl);
    const snapshot = rows.find(value => value.slug === row.slug);
    const textChange = await applyCandidateTextRepair(client, candidate, snapshot);
    const mediaChange = row.media.status === "change" ? await applyCandidateMediaAltRepair(client, candidate, { id: row.id, slug: row.slug, sourceUrl: snapshot.sourceUrl, reviewStatus: snapshot.reviewStatus, claimsVerified: snapshot.claimsVerified, mediaId: row.media.id, alt: snapshot.alt }) : { slug: row.slug, changed: false };
    journal.changes.push({ id: row.id, slug: row.slug, text: textChange, media: mediaChange });
  }

  const verify = await client.query(`SELECT p.slug, l.name, l.intro, m.alt FROM products p
    JOIN products_locales l ON l._parent_id=p.id AND l._locale='en'
    LEFT JOIN media_locales m ON m._parent_id=p.image_id AND m._locale='en'
    WHERE p.slug=ANY($1::text[])`, [preview.map(item => item.slug)]);
  if (verify.rowCount !== 21) throw new Error("Post-write verification count mismatch");
  for (const row of verify.rows) {
    const change = journal.changes.find(item => item.slug === row.slug);
    const original = rows.find(item => item.slug === row.slug);
    const expectedName = change.text.changes.name ?? original.name;
    const expectedIntro = change.text.changes.intro ?? original.intro;
    const expectedAlt = change.media.changed ? change.media.after : original.alt;
    if (row.name !== expectedName || row.intro !== expectedIntro || row.alt !== expectedAlt) throw new Error(`Post-write verification failed: ${row.slug}`);
  }
  const journalBytes = `${JSON.stringify(journal, null, 2)}\n`;
  const journalSha256 = crypto.createHash("sha256").update(journalBytes).digest("hex");
  const handle = await fs.open(journalPath, "wx", 0o600);
  try { await handle.writeFile(journalBytes); await handle.sync(); } finally { await handle.close(); }
  commitAttempted = true;
  await client.query("COMMIT");
  committed = true;
  const commitPath = `${journalPath}.committed`;
  await fs.writeFile(commitPath, `${JSON.stringify({ committedAt: new Date().toISOString(), planSha256: journal.planSha256, journalSha256 })}\n`, { flag: "wx", mode: 0o600 });
  console.log(JSON.stringify({ ok: true, committed, products: verify.rowCount, changed: journal.changes.filter(item => Object.keys(item.text.changes).length || item.media.changed).length, journalPath, commitMarker: commitPath, planSha256: journal.planSha256 }, null, 2));
} catch (error) {
  let rolledBack = false;
  if (!committed) rolledBack = await client.query("ROLLBACK").then(() => true).catch(() => false);
  if (!committed && journalPath && journal) {
    const status = commitAttempted || !rolledBack ? "unknown" : "aborted";
    await fs.writeFile(`${journalPath}.${status}`, `${JSON.stringify({ status, recordedAt: new Date().toISOString(), reason: error instanceof Error ? error.message : String(error), planSha256: journal.planSha256 })}\n`, { flag: "wx" }).catch(() => {});
  }
  throw error;
} finally {
  await client.end();
}
