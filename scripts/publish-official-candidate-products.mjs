import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config.ts";

if (process.env.PUBLISH_OFFICIAL_CANDIDATES_CONFIRM !== "YES") throw new Error("Set PUBLISH_OFFICIAL_CANDIDATES_CONFIRM=YES to publish official candidate products.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = JSON.parse(await fs.readFile(path.join(root, "src/data/official-site-product-candidates.json"), "utf8"));
const payload = await getPayload({ config });
const locales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];
const mergedCandidateIds = new Set([754923, 754921, 754926, 754931, 754932, 754918, 754919]);
const mediaIds = new Map();

const categoryFor = (candidate) => candidate.sourceUrl.includes("/56968") || candidate.sourceUrl.includes("/56969") ? "compound" : "water-soluble";
const englishName = (name) => `KOMU product · ${name}`;
const safeIntro = (name) => `The official KOMU product center lists ${name}. Model, packaging, technical values and claims remain subject to formal review.`;
const safeIntroZh = (name) => `原官网产品中心列出“${name}”。型号、包装、技术参数和 claims 仍以正式审核资料为准。`;

async function findOrCreateMedia(candidate) {
  const filename = path.basename(new URL(candidate.imageUrl).pathname);
  if (mediaIds.has(filename)) return mediaIds.get(filename);
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0, overrideAccess: true });
  if (existing.totalDocs) { mediaIds.set(filename, existing.docs[0].id); return existing.docs[0].id; }
  const response = await fetch(candidate.imageUrl, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${candidate.imageUrl}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const name = { en: englishName(candidate.name), zh: candidate.name };
  const media = await payload.create({ collection: "media", data: { alt: name }, file: { data: bytes, mimetype: response.headers.get("content-type") || "image/jpeg", name: filename, size: bytes.length }, overrideAccess: true });
  mediaIds.set(filename, media.id);
  return media.id;
}

const categories = await payload.find({ collection: "categories", pagination: false, depth: 0, overrideAccess: true });
const categoryIds = new Map(categories.docs.map(category => [category.slug, category.id]));
const created = [];
const skipped = [];

for (const candidate of candidates.products) {
  const id = Number(candidate.sourceUrl.match(/display\/(\d+)\.html/)?.[1]);
  if (mergedCandidateIds.has(id)) { skipped.push({ id, reason: "merged-into-existing-flbook-product" }); continue; }
  const slug = `official-${id}`;
  const existing = await payload.find({ collection: "products", where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true });
  if (existing.totalDocs) { skipped.push({ id, reason: "already-present" }); continue; }
  const category = categoryIds.get(categoryFor(candidate));
  if (!category) throw new Error(`Missing category for ${candidate.name}`);
  const image = await findOrCreateMedia(candidate);
  const en = englishName(candidate.name);
  const name = Object.fromEntries(locales.map(locale => [locale, locale === "zh" ? candidate.name : en]));
  const intro = Object.fromEntries(locales.map(locale => [locale === "zh" ? "zh" : locale, locale === "zh" ? safeIntroZh(candidate.name) : safeIntro(candidate.name)]));
  await payload.create({ collection: "products", data: {
    slug, category, name, intro, image,
    sourceUrl: candidate.sourceUrl,
    sourceNote: `Official website candidate extracted from ${candidate.sourceUrl}; published with safe descriptive copy only. Technical claims, model, packaging and final translations remain owner-review.`,
    reviewStatus: "owner-review", assetStatus: "owner-supplied", claimsVerified: false,
  }, locale: "all", overrideAccess: true });
  created.push({ id, slug, name: candidate.name, sourceUrl: candidate.sourceUrl });
}

console.log(JSON.stringify({ ok: true, candidates: candidates.count, created: created.length, skipped: skipped.length, createdRows: created, skippedRows: skipped }, null, 2));
process.exit(0);
