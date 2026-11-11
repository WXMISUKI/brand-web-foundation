import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { applyCandidateMediaAltRepair, applyCandidateTextRepair, rollbackCandidateMediaAltRepair, rollbackCandidateTextRepair } from "../src/lib/official-candidate-write.mjs";

// Only run against a newly created, dedicated test database.
const url = process.env.CANDIDATE_TEST_DATABASE_URL;
test("preview reads localized values and protects shared media", { skip: !url }, async () => {
  const parsed = new URL(url);
  assert.equal(parsed.pathname, "/candidate_copy_test", "Use the dedicated candidate_copy_test database");
  const require = createRequire(import.meta.url);
  const { Client } = createRequire(require.resolve("@payloadcms/db-postgres"))("pg");
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    const existing = await client.query("SELECT count(*)::integer AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p','v','m','S')");
    assert.equal(existing.rows[0].count, 0, "Refusing to modify a nonempty database");
    await client.query(`CREATE TABLE media (id integer PRIMARY KEY, updated_at timestamptz DEFAULT now());
      CREATE TABLE products (id integer PRIMARY KEY, slug text, source_url text, review_status text, claims_verified boolean, image_id integer REFERENCES media(id), updated_at timestamptz DEFAULT now());
      CREATE TABLE products_locales (_parent_id integer, _locale text, name text, intro text);
      CREATE TABLE media_locales (_parent_id integer REFERENCES media(id), _locale text, alt text);
      CREATE TABLE articles (id integer PRIMARY KEY, image_id integer REFERENCES media(id))`);
    const name = "大量元素水溶肥";
    const oldName = `KOMU product · ${name}`;
    const oldAlt = JSON.stringify({ en: oldName, zh: name });
    await client.query("INSERT INTO media (id) VALUES (11)");
    await client.query("INSERT INTO products (id,slug,source_url,review_status,claims_verified,image_id) VALUES ($1,$2,$3,$4,$5,$6)", [1,"official-569693","http://m.zgkomu.cn/display/569693.html","owner-review",false,11]);
    await client.query("INSERT INTO products_locales VALUES ($1,$2,$3,$4)", [1,"en",oldName,"Staff edited intro"]);
    await client.query("INSERT INTO media_locales VALUES ($1,$2,$3)", [11,"en",oldAlt]);
    const runPreview = () => {
      const result = spawnSync(process.execPath, ["scripts/preview-official-candidate-copy-repair.mjs"], { cwd: process.cwd(), env: { ...process.env, DATABASE_URL: url }, encoding: "utf8" });
      assert.equal(result.status, 0, result.stderr);
      return JSON.parse(result.stdout).plan.find(item => item.slug === "official-569693");
    };
    const first = runPreview();
    assert.deepEqual(first.changes, { name: "KOMU water-soluble fertilizer · source reference 569693" });
    assert.equal(first.media.status, "change");
    const candidate = { name, sourceUrl: "http://m.zgkomu.cn/display/569693.html" };
    const snapshot = { id: 1, slug: "official-569693", sourceUrl: candidate.sourceUrl, reviewStatus: "owner-review", claimsVerified: false, name: oldName, intro: "Staff edited intro" };
    const editor = new Client({ connectionString: url });
    await editor.connect();
    try {
      await editor.query("BEGIN");
      await editor.query("UPDATE products_locales SET intro='Concurrent edit' WHERE _parent_id=1 AND _locale='en'");
      await client.query("BEGIN");
      const pending = applyCandidateTextRepair(client, candidate, snapshot);
      await editor.query("COMMIT");
      await assert.rejects(pending, /changed since preview/);
      await client.query("ROLLBACK");
      assert.equal((await client.query("SELECT intro FROM products_locales WHERE _parent_id=1 AND _locale='en'")).rows[0].intro,"Concurrent edit");
      await client.query("UPDATE products_locales SET intro='Staff edited intro' WHERE _parent_id=1 AND _locale='en'");
    } finally {
      await editor.end();
    }
    await client.query("BEGIN");
    const applied = await applyCandidateTextRepair(client, candidate, snapshot);
    assert.equal(applied.after.name, first.changes.name);
    assert.equal(applied.after.intro, "Staff edited intro");
    const altApplied = await applyCandidateMediaAltRepair(client,candidate,{id:1,slug:"official-569693",sourceUrl:candidate.sourceUrl,reviewStatus:"owner-review",claimsVerified:false,mediaId:11,alt:oldAlt});
    assert.equal(altApplied.after,"KOMU water-soluble fertilizer · source reference 569693");
    await client.query("COMMIT");
    const committed = { id:1,slug:"official-569693",text:applied,media:altApplied };
    await client.query("BEGIN");
    assert.equal((await rollbackCandidateTextRepair(client,candidate,committed.text)).restored.name,oldName);
    assert.equal((await rollbackCandidateMediaAltRepair(client,committed)).restored,true);
    await client.query("COMMIT");
    assert.equal((await client.query("SELECT name FROM products_locales WHERE _parent_id=1")).rows[0].name,oldName);
    assert.equal((await client.query("SELECT alt FROM media_locales WHERE _parent_id=11")).rows[0].alt,oldAlt);
    await client.query("UPDATE products_locales SET intro='New staff edit' WHERE _parent_id=1");
    await client.query("BEGIN");
    await assert.rejects(applyCandidateTextRepair(client, candidate, snapshot), /changed since preview/);
    await client.query("ROLLBACK");
    await client.query("BEGIN");
    await assert.rejects(rollbackCandidateTextRepair(client,candidate,committed.text),/changed since repair/);
    await client.query("ROLLBACK");
    await client.query("UPDATE products_locales SET intro='Staff edited intro' WHERE _parent_id=1");
    await client.query("INSERT INTO articles VALUES (1,11)");
    assert.equal(runPreview().media.status, "conflict");
    await client.query("DELETE FROM articles WHERE id=1");
    await client.query("INSERT INTO products (id,slug,source_url,review_status,claims_verified,image_id) VALUES ($1,$2,$3,$4,$5,$6)", [2,"other","other","owner-review",false,11]);
    assert.equal(runPreview().media.status, "conflict");
    const current = await client.query("SELECT name, intro FROM products_locales WHERE _parent_id=1 AND _locale='en'");
    assert.deepEqual(current.rows[0], { name: oldName, intro: "Staff edited intro" });
  } finally {
    await client.end();
  }
});
