import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { candidateMediaAltRepair, planCandidateCopyRepairs } from "../src/lib/official-candidate-copy.mjs";

// Read-only preview; it cannot apply changes. Run against an explicitly selected
// database and never log its connection string.
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const require = createRequire(import.meta.url);
const adapterRequire = createRequire(require.resolve("@payloadcms/db-postgres"));
const { Client } = adapterRequire("pg");
const source = JSON.parse(await fs.readFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const mergedIds = new Set([754923, 754921, 754926, 754931, 754932, 754918, 754919]);
const candidates = source.products.filter(candidate => {
  const id = Number(candidate.sourceUrl.match(/\/display\/(\d+)\.html$/)?.[1]);
  return !mergedIds.has(id);
});
if (candidates.length !== 21 || new Set(candidates.map(candidate => candidate.sourceUrl)).size !== 21) throw new Error("Unexpected candidate inventory");
const client = new Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
  const { rows } = await client.query(`SELECT p.id, p.slug, p.source_url AS "sourceUrl", p.review_status AS "reviewStatus", p.claims_verified AS "claimsVerified", p.image_id AS "mediaId", l.name, l.intro, m.alt,
      (SELECT count(*)::integer FROM products linked WHERE linked.image_id = p.image_id) AS "productMediaUses"
    FROM products p JOIN products_locales l ON l._parent_id = p.id AND l._locale = 'en'
    LEFT JOIN media_locales m ON m._parent_id = p.image_id AND m._locale = 'en'
    WHERE p.slug = ANY($1::text[])`, [candidates.map(candidate => `official-${candidate.sourceUrl.match(/\/(\d+)\.html$/)[1]}`)]);
  // Discover every direct FK to media, so newly added content types are not silently missed.
  const references = await client.query(`SELECT ns.nspname AS schema_name, rel.relname AS table_name, attr.attname AS column_name
    FROM pg_constraint fk JOIN pg_class rel ON rel.oid=fk.conrelid JOIN pg_namespace ns ON ns.oid=rel.relnamespace
    JOIN pg_attribute attr ON attr.attrelid=fk.conrelid AND attr.attnum=fk.conkey[1]
    WHERE fk.contype='f' AND fk.confrelid='public.media'::regclass AND array_length(fk.conkey,1)=1 AND ns.nspname='public'`);
  if (!references.rows.some(ref => ref.table_name === "products" && ref.column_name === "image_id")) throw new Error("Product media foreign key missing");
  const ids = [...new Set(rows.map(row => row.mediaId).filter(id => id != null))];
  const externalUses = new Set();
  const quote = value => `"${value.replaceAll('"', '""')}"`;
  for (const ref of references.rows) {
    if ((ref.table_name === "products" && ref.column_name === "image_id") || ref.table_name === "media_locales") continue;
    const column = quote(ref.column_name);
    const found = await client.query(`SELECT DISTINCT ${column} AS id FROM ${quote(ref.schema_name)}.${quote(ref.table_name)} WHERE ${column} = ANY($1::integer[])`, [ids]);
    for (const entry of found.rows) externalUses.add(entry.id);
  }
  const plan = planCandidateCopyRepairs(candidates, rows).map(item => {
    if (item.status === "missing" || item.status === "conflict") return item;
    const row = rows.find(value => value.slug === item.slug);
    const candidate = candidates.find(value => value.sourceUrl === row.sourceUrl);
    const newAlt = candidateMediaAltRepair(candidate, row.alt);
    const conflict = row.productMediaUses !== 1 || externalUses.has(row.mediaId);
    return { ...item, media: { id: row.mediaId, status: conflict ? "conflict" : newAlt === null ? "preserved" : "change", ...(newAlt === null || conflict ? {} : { alt: newAlt }) } };
  });
  await client.query("ROLLBACK");
  console.log(JSON.stringify({ mode: "read-only-preview", candidates: candidates.length, plan }, null, 2));
} finally {
  await client.end();
}
