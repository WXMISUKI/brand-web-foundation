import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPayload } from "payload";
import config from "../src/payload.config.ts";

if (process.env.PRODUCTION_OFFICIAL_MEDIA_CONFIRM !== "YES") {
  throw new Error("Set PRODUCTION_OFFICIAL_MEDIA_CONFIRM=YES for this targeted production media repair.");
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const flbook = JSON.parse(await fs.readFile(path.join(root, "src/data/flbook-import.json"), "utf8"));
const content = JSON.parse(await fs.readFile(path.join(root, "src/data/content-staging.json"), "utf8"));
const payload = await getPayload({ config });
const mediaIds = new Map();

const mimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
};

async function ensureMedia(relativePath, alt) {
  if (mediaIds.has(relativePath)) return mediaIds.get(relativePath);
  const absolute = path.join(root, "public", relativePath.replace(/^\//, ""));
  const filename = path.basename(absolute);
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0, overrideAccess: true });
  if (existing.totalDocs > 0) {
    mediaIds.set(relativePath, existing.docs[0].id);
    return existing.docs[0].id;
  }
  const data = await fs.readFile(absolute);
  const created = await payload.create({
    collection: "media",
    data: { alt },
    file: { data, mimetype: mimeType(absolute), name: filename, size: data.length },
    overrideAccess: true,
  });
  mediaIds.set(relativePath, created.id);
  return created.id;
}

const updated = { products: [], homepage: false, companyProfile: false, content: [] };

for (const draft of flbook.products.filter((item) => item.officialImageSource)) {
  const found = await payload.find({ collection: "products", where: { slug: { equals: draft.slug } }, locale: "en", limit: 1, depth: 0, overrideAccess: true });
  if (found.totalDocs !== 1) throw new Error(`${draft.slug}: expected exactly one product`);
  const mediaId = await ensureMedia(draft.imagePath, {
    en: `${draft.englishDisplayName}, official product image; text sourced from owner-provided FLBOOK pages ${draft.sourcePages.join(", ")}`,
    zh: `${draft.displayName}，图片来自官方产品页，文字来源于业主提供的 FLBOOK 第 ${draft.sourcePages.join("、")} 页`,
  });
  await payload.update({ collection: "products", id: found.docs[0].id, data: { image: mediaId, sourceNote: draft.sourceNote }, locale: "all", overrideAccess: true });
  updated.products.push({ slug: draft.slug, media: path.basename(draft.imagePath), officialImageSource: draft.officialImageSource });
}

const homepage = await payload.findGlobal({ slug: "homepage", locale: "all", depth: 0, overrideAccess: true });
if (homepage?.slides?.length && homepage?.featured?.length) {
  const heroPaths = ["/images/official-site/hero-01.jpg", "/images/official-site/hero-02.jpg", "/images/official-site/hero-03.jpg"];
  const heroIds = [];
  for (const [index, relativePath] of heroPaths.entries()) heroIds[index] = await ensureMedia(relativePath, { en: `Official KOMU crop nutrition banner ${index + 1}`, zh: `康姆官方作物营养横幅 ${index + 1}` });
  const companyBannerId = await ensureMedia("/images/official-site/company-products.jpg", { en: "Official KOMU product display", zh: "康姆官方产品展示" });
  const slides = homepage.slides.map((slide, index) => ({ ...slide, image: heroIds[index % heroIds.length] }));
  const featured = homepage.featured.map((card, index) => ({ ...card, image: index === 2 ? companyBannerId : heroIds[index % heroIds.length] }));
  await payload.updateGlobal({ slug: "homepage", data: { slides, featured }, locale: "all", overrideAccess: true });
  updated.homepage = true;
}

const company = await payload.findGlobal({ slug: "company-profile", locale: "all", depth: 0, overrideAccess: true });
if (company) {
  const banner = await ensureMedia("/images/official-site/company-products.jpg", { en: "Official KOMU product display", zh: "康姆官方产品展示" });
  await payload.updateGlobal({ slug: "company-profile", data: { banner }, locale: "all", overrideAccess: true });
  updated.companyProfile = true;
}

for (const [collection, records] of Object.entries(content.records ?? {})) {
  for (const record of records) {
    if (!record.image) continue;
    const found = await payload.find({ collection, where: { slug: { equals: record.slug } }, locale: "en", limit: 1, depth: 0, overrideAccess: true });
    if (found.totalDocs !== 1) continue;
    const mediaId = await ensureMedia(record.image, { en: record.locales.en.title, zh: record.locales.zh.title });
    await payload.update({ collection, id: found.docs[0].id, data: { image: mediaId }, locale: "all", overrideAccess: true });
    updated.content.push({ collection, slug: record.slug, media: path.basename(record.image) });
  }
}

console.log(JSON.stringify({ ok: true, updated }, null, 2));
process.exit(0);
