import { candidateCopyRepair, candidateMediaAltRepair } from "./official-candidate-copy.mjs";

// Caller owns the transaction. Lock and compare the complete preview snapshot
// before writing; any mismatch aborts the caller's entire batch.
export async function applyCandidateTextRepair(client, candidate, snapshot) {
  const result = await client.query(`SELECT p.id, p.slug, p.source_url AS "sourceUrl", p.review_status AS "reviewStatus", p.claims_verified AS "claimsVerified", l.name, l.intro
    FROM products p JOIN products_locales l ON l._parent_id=p.id AND l._locale='en'
    WHERE p.id=$1 FOR UPDATE OF p,l`, [snapshot.id]);
  const row = result.rows[0];
  const keys = ["id", "slug", "sourceUrl", "reviewStatus", "claimsVerified", "name", "intro"];
  if (result.rowCount !== 1 || keys.some(key => row[key] !== snapshot[key]) || row.sourceUrl !== candidate.sourceUrl || row.slug !== `official-${candidate.sourceUrl.match(/\/(\d+)\.html$/)?.[1]}` || row.reviewStatus !== "owner-review" || row.claimsVerified !== false) {
    throw new Error(`Candidate changed since preview: ${snapshot.slug}`);
  }
  const changes = candidateCopyRepair(candidate, row);
  if (!Object.keys(changes).length) return { slug: row.slug, changes: {} };
  const updated = await client.query(`UPDATE products_locales SET name=$1, intro=$2
    WHERE _parent_id=$3 AND _locale='en' AND name IS NOT DISTINCT FROM $4 AND intro IS NOT DISTINCT FROM $5 RETURNING name,intro`,
    [changes.name ?? row.name, changes.intro ?? row.intro, row.id, row.name, row.intro]);
  if (updated.rowCount !== 1) throw new Error(`Candidate update conflict: ${row.slug}`);
  await client.query("UPDATE products SET updated_at=now() WHERE id=$1", [row.id]);
  return { id: row.id, slug: row.slug, changes, before: { name: row.name, intro: row.intro }, after: updated.rows[0] };
}

export async function applyCandidateMediaAltRepair(client, candidate, snapshot) {
  const result = await client.query(`SELECT p.id, p.slug, p.source_url AS "sourceUrl", p.review_status AS "reviewStatus", p.claims_verified AS "claimsVerified", p.image_id AS "mediaId", m.alt
    FROM products p JOIN media md ON md.id=p.image_id
    JOIN media_locales m ON m._parent_id=md.id AND m._locale='en'
    WHERE p.id=$1 FOR UPDATE OF p,md,m`, [snapshot.id]);
  const row = result.rows[0];
  if (!row || row.id !== snapshot.id || row.slug !== snapshot.slug || row.sourceUrl !== candidate.sourceUrl || row.reviewStatus !== "owner-review" || row.claimsVerified !== false || row.mediaId !== snapshot.mediaId || row.alt !== snapshot.alt) {
    throw new Error(`Candidate media changed since preview: ${snapshot.slug}`);
  }
  const usage = await client.query("SELECT count(*)::integer AS count FROM products WHERE image_id=$1", [row.mediaId]);
  if (usage.rows[0].count !== 1) throw new Error(`Candidate media is shared: ${snapshot.slug}`);
  const nextAlt = candidateMediaAltRepair(candidate, row.alt);
  if (nextAlt === null) return { slug: row.slug, changed: false };
  const updated = await client.query(`UPDATE media_locales SET alt=$1 WHERE _parent_id=$2 AND _locale='en' AND alt IS NOT DISTINCT FROM $3 RETURNING alt`, [nextAlt, row.mediaId, row.alt]);
  if (updated.rowCount !== 1) throw new Error(`Candidate media alt conflict: ${row.slug}`);
  await client.query("UPDATE media SET updated_at=now() WHERE id=$1", [row.mediaId]);
  return { slug: row.slug, id: row.id, mediaId: row.mediaId, changed: true, before: row.alt, after: updated.rows[0].alt };
}

export async function rollbackCandidateTextRepair(client, candidate, change) {
  const result = await client.query(`SELECT p.id, p.slug, p.source_url AS "sourceUrl", l.name, l.intro
    FROM products p JOIN products_locales l ON l._parent_id=p.id AND l._locale='en'
    WHERE p.id=$1 FOR UPDATE OF p,l`, [change.id]);
  const row = result.rows[0];
  if (!row || row.slug !== change.slug || row.sourceUrl !== candidate.sourceUrl || row.name !== change.after.name || row.intro !== change.after.intro) {
    throw new Error(`Candidate text changed since repair: ${change.slug}`);
  }
  const updated = await client.query(`UPDATE products_locales SET name=$1,intro=$2
    WHERE _parent_id=$3 AND _locale='en' AND name IS NOT DISTINCT FROM $4 AND intro IS NOT DISTINCT FROM $5 RETURNING name,intro`,
    [change.before.name, change.before.intro, row.id, row.name, row.intro]);
  if (updated.rowCount !== 1) throw new Error(`Candidate text rollback conflict: ${change.slug}`);
  await client.query("UPDATE products SET updated_at=now() WHERE id=$1", [row.id]);
  return { slug: change.slug, restored: updated.rows[0] };
}

export async function rollbackCandidateMediaAltRepair(client, change) {
  if (!change.media?.changed) return { slug: change.slug, restored: false };
  const result = await client.query(`SELECT p.slug, p.image_id AS "mediaId", m.alt FROM products p
    JOIN media_locales m ON m._parent_id=p.image_id AND m._locale='en' WHERE p.id=$1 FOR UPDATE OF p,m`, [change.id]);
  const row = result.rows[0];
  if (!row || row.slug !== change.slug || row.mediaId !== change.media.mediaId || row.alt !== change.media.after) throw new Error(`Candidate media changed since repair: ${change.slug}`);
  const updated = await client.query("UPDATE media_locales SET alt=$1 WHERE _parent_id=$2 AND _locale='en' AND alt IS NOT DISTINCT FROM $3 RETURNING alt", [change.media.before, row.mediaId, row.alt]);
  if (updated.rowCount !== 1) throw new Error(`Candidate media rollback conflict: ${change.slug}`);
  await client.query("UPDATE media SET updated_at=now() WHERE id=$1", [row.mediaId]);
  return { slug: change.slug, restored: true };
}
