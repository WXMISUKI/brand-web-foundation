import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-import.json"), "utf8"));
const blockers = [];
const expectedCount = 10;
const compoundSlug = "organic-inorganic-compound-draft";

if (source.products.length !== expectedCount) blockers.push(`expected ${expectedCount} product drafts, got ${source.products.length}`);
for (const product of source.products) {
  const prefix = product.slug;
  if (!product.displayName || !product.englishDisplayName || !product.intro || !product.englishIntro) blockers.push(`${prefix}: bilingual name/intro incomplete`);
  if (!Array.isArray(product.sourcePages) || !product.sourcePages.length || !product.sourcePreviewPath) blockers.push(`${prefix}: source provenance incomplete`);
  if (product.contentStatus !== "approved") blockers.push(`${prefix}: contentStatus must be approved after owner review`);
  if (product.claimsVerified !== true) blockers.push(`${prefix}: claimsVerified must be true after source-backed owner approval`);
  if (product.slug !== compoundSlug && (!Array.isArray(product.specifications) || product.specifications.length === 0)) blockers.push(`${prefix}: source-backed specifications are missing`);
}

const gateBlockers = [...blockers];
const report = {
  ready: gateBlockers.length === 0,
  productCount: source.products.length,
  specificationRows: source.products.reduce((total, product) => total + (product.specifications?.length ?? 0), 0),
  ownerReviewCount: source.products.filter(product => product.contentStatus === "owner-review").length,
  claimsVerifiedCount: source.products.filter(product => product.claimsVerified === true).length,
  warnings: ["Localized CMS content is Codex self-reviewed and production-backfilled; professional mother-tongue/legal/agronomic certification is not evidenced."],
  blockers: gateBlockers,
};
console.log(JSON.stringify(report, null, 2));
if (!report.ready) process.exitCode = 1;
