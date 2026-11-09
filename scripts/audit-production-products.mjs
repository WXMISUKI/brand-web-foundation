import { getPayload } from "payload";
import config from "../src/payload.config.ts";

const payload = await getPayload({ config });
const locales = ["en", "zh"];
const byLocale = new Map();
for (const locale of locales) {
  const result = await payload.find({ collection: "products", locale, pagination: false, depth: 0, overrideAccess: true, user: { id: "production-audit", email: "production-audit@example.com" } });
  byLocale.set(locale, result.docs);
}

const en = byLocale.get("en") ?? [];
const zh = byLocale.get("zh") ?? [];
const zhBySlug = new Map(zh.map(item => [item.slug, item]));
const rows = en.map(item => {
  const counterpart = zhBySlug.get(item.slug);
  const detailFields = ["materials", "packaging", "uses", "instructions"];
  const missingEn = detailFields.filter(field => !String(item[field] ?? "").trim());
  const missingZh = detailFields.filter(field => !String(counterpart?.[field] ?? "").trim());
  return {
    slug: item.slug,
    catalogKind: item.slug.startsWith("official-") ? "official-candidate" : "flbook",
    id: item.id,
    sourcePages: Array.isArray(item.sourcePages) ? item.sourcePages.map(page => page.page ?? page).filter(Boolean) : [],
    specifications: Array.isArray(item.specifications) ? item.specifications.length : 0,
    reviewStatus: item.reviewStatus ?? null,
    claimsVerified: item.claimsVerified ?? null,
    assetStatus: item.assetStatus ?? null,
    missingEn,
    missingZh,
    missingCounterpart: !counterpart,
  };
});
const flbookRows = rows.filter(row => row.catalogKind === "flbook");
const officialCandidateRows = rows.filter(row => row.catalogKind === "official-candidate");
const missing = flbookRows.filter(row => row.missingCounterpart || row.missingEn.length || row.missingZh.length || !row.sourcePages.length || row.reviewStatus !== "approved" || row.claimsVerified !== true);
console.log(JSON.stringify({ ok: missing.length === 0, productCount: rows.length, flbookProductCount: flbookRows.length, officialCandidateCount: officialCandidateRows.length, missingCount: missing.length, rows, missing }, null, 2));
process.exit(0);
