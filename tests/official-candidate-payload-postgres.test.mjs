import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import sharp from "sharp";
import { applyCandidateMediaAltRepair, applyCandidateTextRepair } from "../src/lib/official-candidate-write.mjs";

const url = process.env.CANDIDATE_TEST_DATABASE_URL;
test("Payload PostgreSQL adapter reads repaired localized candidate copy", { skip: !url }, async () => {
  assert.equal(new URL(url).pathname,"/candidate_copy_test");
  process.env.NODE_ENV = "production";
  process.env.PAYLOAD_DATABASE = "postgres";
  process.env.DATABASE_URL = url;
  process.env.PAYLOAD_SECRET = "isolated-candidate-copy-payload-secret-32";
  process.env.PAYLOAD_MEDIA_DIR = `${process.cwd()}/.local/candidate-copy-payload-test-media`;
  const require = createRequire(import.meta.url);
  const { Client } = createRequire(require.resolve("@payloadcms/db-postgres"))("pg");
  const admin = new Client({ connectionString:url });
  await admin.connect();
  let payload;
  try {
    const tables = await admin.query("SELECT count(*)::integer AS n FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p','v','m','S')");
    assert.equal(tables.rows[0].n,0,"Refusing nonempty database");
    const { getPayload } = await import("payload");
    const config = (await import("../src/payload.config.ts")).default;
    payload = await getPayload({ config });
    const { migrations } = await import("../src/migrations/index.ts");
    await payload.db.migrate({ migrations });
    const category = await payload.create({collection:"categories",data:{slug:"water-soluble",name:"Water-soluble"},locale:"en",overrideAccess:true});
    await payload.update({collection:"categories",id:category.id,data:{name:"水溶肥"},locale:"zh",overrideAccess:true});
    const bytes = await sharp({create:{width:1,height:1,channels:3,background:"white"}}).jpeg().toBuffer();
    const legacyAlt = JSON.stringify({en:"KOMU product · 大量元素水溶肥",zh:"大量元素水溶肥"});
    const media = await payload.create({collection:"media",data:{alt:legacyAlt},locale:"en",file:{data:bytes,mimetype:"image/jpeg",name:"isolated-test.jpg",size:bytes.length},overrideAccess:true});
    await payload.update({collection:"media",id:media.id,data:{alt:"大量元素水溶肥"},locale:"zh",overrideAccess:true});
    const candidate = {name:"大量元素水溶肥",sourceUrl:"http://m.zgkomu.cn/display/569693.html"};
    const product = await payload.create({collection:"products",data:{slug:"official-569693",category:category.id,image:media.id,name:"KOMU product · 大量元素水溶肥",intro:"Staff edit",sourceUrl:candidate.sourceUrl,reviewStatus:"owner-review",claimsVerified:false},locale:"en",overrideAccess:true});
    await payload.update({collection:"products",id:product.id,data:{name:candidate.name,intro:"员工简介"},locale:"zh",overrideAccess:true});
    const before = await payload.findByID({collection:"products",id:product.id,locale:"en",fallbackLocale:false,depth:1,overrideAccess:true});
    const altBefore = await payload.findByID({collection:"media",id:media.id,locale:"en",fallbackLocale:false,depth:0,overrideAccess:true});
    const snapshot = {id:product.id,slug:product.slug,sourceUrl:candidate.sourceUrl,reviewStatus:"owner-review",claimsVerified:false,name:before.name,intro:before.intro};
    await admin.query("BEGIN");
    const text = await applyCandidateTextRepair(admin,candidate,snapshot);
    const mediaChange = await applyCandidateMediaAltRepair(admin,candidate,{id:product.id,slug:product.slug,sourceUrl:candidate.sourceUrl,reviewStatus:"owner-review",claimsVerified:false,mediaId:media.id,alt:altBefore.alt});
    await admin.query("COMMIT");
    const after = await payload.findByID({collection:"products",id:product.id,locale:"en",fallbackLocale:false,depth:1,overrideAccess:true});
    const afterZh = await payload.findByID({collection:"products",id:product.id,locale:"zh",fallbackLocale:false,depth:1,overrideAccess:true});
    const mediaEn = await payload.findByID({collection:"media",id:media.id,locale:"en",fallbackLocale:false,depth:0,overrideAccess:true});
    const mediaZh = await payload.findByID({collection:"media",id:media.id,locale:"zh",fallbackLocale:false,depth:0,overrideAccess:true});
    assert.equal(after.name,"KOMU water-soluble fertilizer · source reference 569693");
    assert.equal(after.intro,"Staff edit");
    assert.equal(afterZh.name,"大量元素水溶肥");
    assert.equal(afterZh.intro,"员工简介");
    assert.equal(mediaEn.alt,"KOMU water-soluble fertilizer · source reference 569693");
    assert.equal(mediaZh.alt,"大量元素水溶肥");
    assert.equal(text.after.intro,"Staff edit");
    assert.equal(mediaChange.changed,true);
  } finally {
    // Payload 3.93 retains a checked-out connection during adapter initialization;
    // destroy() clears adapter state but does not close the node-postgres pool.
    const pool = payload?.db?.pool;
    if (pool) {
      const idleClients = new Set(pool._idle.map(entry => entry.client));
      for (const connection of pool._clients) if (!idleClients.has(connection)) connection.release();
      await pool.end();
    }
    if (payload?.destroy) await payload.destroy();
    await admin.end();
  }
});
