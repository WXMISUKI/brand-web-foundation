import fs from "node:fs";
import { getPayload } from "payload";
import config from "../src/payload.config.ts";

if (process.env.PRODUCTION_REPAIR_CONFIRM !== "YES") throw new Error("Set PRODUCTION_REPAIR_CONFIRM=YES for this targeted production metadata repair.");

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const payload = await getPayload({ config });
const updated = [];

for (const product of source.products) {
  const found = await payload.find({ collection: "products", where: { slug: { equals: product.slug } }, locale: "en", limit: 1, overrideAccess: true });
  if (found.totalDocs !== 1) throw new Error(`${product.slug}: expected exactly one production product`);
  const data = {
    sourceUrl: source.source.url,
    sourcePages: product.sourcePages.map(page => ({ page })),
    sourceRelatedPages: (product.sourceRelatedPages ?? []).map(({ page, role, note }) => ({ page, role, note })),
    sourcePreviewPath: product.sourcePreviewPath,
    sourceDetailPreviewPath: product.sourceDetailPreviewPath,
    sourceNote: product.sourceNote,
    reviewStatus: product.contentStatus,
    assetStatus: product.imageStatus,
    claimsVerified: product.claimsVerified,
  };
  await payload.update({ collection: "products", id: found.docs[0].id, data, locale: "en", overrideAccess: true });
  updated.push({ slug: product.slug, id: found.docs[0].id, reviewStatus: data.reviewStatus, assetStatus: data.assetStatus, claimsVerified: data.claimsVerified });
}

console.log(JSON.stringify({ ok: true, updated }, null, 2));
process.exit(0);
