import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { candidateCopyRepair, candidateMediaAltRepair } from "../src/lib/official-candidate-copy.mjs";
import { rollbackCandidateTextRepair, rollbackCandidateMediaAltRepair } from "../src/lib/official-candidate-write.mjs";

const target = new URL(process.env.DATABASE_URL || "postgresql://invalid/invalid");
const isolatedMode = process.env.OFFICIAL_CANDIDATE_COPY_ISOLATED_TEST === "YES";
const productionMode = process.env.OFFICIAL_CANDIDATE_COPY_PRODUCTION_CONFIRM === "YES";
const localTarget = target.pathname === "/candidate_copy_test" && ["127.0.0.1", "localhost", "[::1]"].includes(target.hostname) && target.port === "55439";
if (!isolatedMode && !productionMode) throw new Error("Set the isolated-test or explicit production confirmation gate");
if (isolatedMode && !localTarget) throw new Error("Isolated rollback only supports candidate_copy_test on port 55439");
if (productionMode && (localTarget || !process.env.OFFICIAL_CANDIDATE_COPY_PRODUCTION_TARGET)) throw new Error("Production rollback requires a non-local target and OFFICIAL_CANDIDATE_COPY_PRODUCTION_TARGET");
if (process.env.OFFICIAL_CANDIDATE_COPY_EDIT_FREEZE !== "CONFIRMED" || process.env.OFFICIAL_CANDIDATE_ROLLBACK_CONFIRM !== "YES") throw new Error("Editing freeze and rollback confirmation are required");
const journalPath = process.env.OFFICIAL_CANDIDATE_COPY_JOURNAL;
if (!journalPath) throw new Error("Journal path is required");
const journalBytes = await fs.readFile(journalPath);
const journal = JSON.parse(journalBytes.toString("utf8"));
const marker = JSON.parse(await fs.readFile(`${journalPath}.committed`, "utf8"));
if (journal.status !== "prepared" || marker.planSha256 !== journal.planSha256 || marker.journalSha256 !== crypto.createHash("sha256").update(journalBytes).digest("hex") || !Array.isArray(journal.changes) || journal.changes.length !== 21) throw new Error("Invalid or uncommitted journal");
const source = JSON.parse(await fs.readFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const bySlug = new Map(source.products.map(c => [`official-${c.sourceUrl.match(/\/(\d+)\.html$/)?.[1]}`, c]));
if (new Set(journal.changes.map(item => item.slug)).size !== 21 || new Set(journal.changes.map(item => item.id)).size !== 21) throw new Error("Duplicate journal entries");
for (const item of journal.changes) {
  const candidate = bySlug.get(item.slug);
  if (!candidate || !Number.isInteger(item.id) || item.text?.slug !== item.slug) throw new Error("Invalid candidate journal entry");
  if (Object.keys(item.text.changes).length) {
    const expected = candidateCopyRepair(candidate, item.text.before);
    if (item.text.id !== item.id || JSON.stringify(expected) !== JSON.stringify(item.text.changes) || item.text.after.name !== (expected.name ?? item.text.before.name) || item.text.after.intro !== (expected.intro ?? item.text.before.intro)) throw new Error("Invalid text journal entry");
  }
  if (item.media?.changed && (item.media.id !== item.id || item.media.slug !== item.slug || candidateMediaAltRepair(candidate, item.media.before) !== item.media.after)) throw new Error("Invalid media journal entry");
}
const require = createRequire(import.meta.url);
const { Client } = createRequire(require.resolve("@payloadcms/db-postgres"))("pg");
const db = new Client({ connectionString: process.env.DATABASE_URL });
try {
  await db.connect();
  await db.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
  for (const item of journal.changes) {
    if (Object.keys(item.text.changes).length) await rollbackCandidateTextRepair(db, bySlug.get(item.slug), item.text);
    if (item.media.changed) await rollbackCandidateMediaAltRepair(db, item);
  }
  await db.query("COMMIT");
  console.log(JSON.stringify({ ok: true, restored: journal.changes.length }));
} catch (error) {
  await db.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await db.end();
}
