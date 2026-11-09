import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { companySeeds, faqSeeds, homepageSeedMedia, homepageSeeds } from "./payload-seeds.mjs";

if (process.env.IMPORT_CONFIRM !== "YES") throw new Error("Import is write-enabled. Set IMPORT_CONFIRM=YES to continue.");
if (process.env.IMPORT_EMPTY_DB !== "YES") throw new Error("Import expects an empty target. Set IMPORT_EMPTY_DB=YES after checking the target database.");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stagingRoot = path.join(root, ".local", "flbook-payload-staging");
const source = JSON.parse(await fs.readFile(path.join(stagingRoot, "flbook-payload-import.json"), "utf8"));
const contentSource = JSON.parse(await fs.readFile(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const cropSource = JSON.parse(await fs.readFile(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const categoryNames = {
  "water-soluble": { en: "Water-soluble", zh: "水溶肥" },
  "medium-elements": { en: "Secondary nutrients", zh: "中量元素" },
  compound: { en: "Compound fertilizer", zh: "复合肥" },
};
const contentCollections = [
  { key: "news", collection: "news", items: contentSource.records.news },
  { key: "insights", collection: "insights", items: contentSource.records.insights },
  { key: "cases", collection: "cases", items: contentSource.records.cases },
];
const plainTextToRichText = value => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: String(value || "").replace(/\r\n?/g, "\n").split("\n").map(line => ({ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, textStyle: "", children: line ? [{ type: "text", version: 1, text: line, detail: 0, format: 0, mode: "normal", style: "" }] : [] })) } });

process.env.CATALOG_SOURCE = "payload";
process.env.CROP_GUIDE_SOURCE = "payload";
process.env.NODE_ENV = process.env.NODE_ENV || "production";
const require = createRequire(import.meta.url);
const nextEnv = require("@next/env");
if (!nextEnv.default) nextEnv.default = nextEnv;
const { getPayload } = await import("payload");
const config = (await import(pathToFileURL(path.join(root, "src", "payload.config.ts")).href)).default;
const payload = await getPayload({ config });

const collectionCount = async collection => (await payload.find({ collection, pagination: false, overrideAccess: true, limit: 1 })).totalDocs;
for (const collection of ["media", "categories", "products", "crop-guides", "news", "insights", "cases", "faq-groups", "faqs", "inquiries"]) {
  if (await collectionCount(collection) !== 0) throw new Error(`Target collection is not empty: ${collection}`);
}

const createMedia = async (filePath, alt) => {
  const data = await fs.readFile(filePath);
  const mimetype = path.extname(filePath).toLowerCase() === ".png" ? "image/png" : "image/webp";
  return payload.create({ collection: "media", data: { alt }, file: { data, mimetype, name: path.basename(filePath), size: data.length }, overrideAccess: true });
};

try {
  const categoryIds = new Map();
  for (const slug of source.categories) {
    const names = categoryNames[slug];
    const created = await payload.create({ collection: "categories", data: { slug, name: names.en }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "categories", id: created.id, data: { name: names.zh }, locale: "zh", overrideAccess: true });
    categoryIds.set(slug, created.id);
  }

  for (const product of source.products) {
    const media = await createMedia(path.join(stagingRoot, product.media.file), product.media.alt);
    const created = await payload.create({ collection: "products", data: {
      slug: product.slug,
      category: categoryIds.get(product.categorySlug),
      name: product.locales.en.name,
      intro: product.locales.en.intro,
      image: media.id,
      sourceUrl: product.provenance.sourceUrl,
      sourcePages: product.provenance.viewerPages.map(page => ({ page })),
      sourceRelatedPages: (product.relatedPages ?? []).map(({ page, role, note }) => ({ page, role, note })),
      sourcePreviewPath: product.sourcePreviewPath,
      sourceDetailPreviewPath: product.sourceDetailPreviewPath,
      sourceNote: product.provenance.sourceNote,
      reviewStatus: product.review.status,
      assetStatus: product.assetStatus ?? (product.review.placeholder ? "generated-placeholder" : "pending"),
      claimsVerified: product.review.claimsVerified,
      specifications: (product.specifications ?? []).map(({ locales: _locales, ...spec }) => spec),
    }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "products", id: created.id, data: { name: product.locales.zh.name, intro: product.locales.zh.intro, specifications: (product.specifications ?? []).map(({ locales, ...spec }) => ({ ...spec, label: locales?.zh ?? spec.label })) }, locale: "zh", overrideAccess: true });
  }

  for (const guide of cropSource.records) {
    const en = guide.locales.en;
    const created = await payload.create({ collection: "crop-guides", data: {
      slug: guide.slug, status: cropSource.reviewStatus, nav: en.nav, overview: en.overview, stages: en.stages, stagesText: en.stagesText,
      nutrition: en.nutrition, products: en.products, browse: en.browse, resources: en.resources, resourcesText: en.resourcesText,
      sections: en.sections.map((title, index) => ({ key: `section-${index + 1}`, title })),
    }, locale: "en", overrideAccess: true });
    const zh = guide.locales.zh;
    await payload.update({ collection: "crop-guides", id: created.id, data: {
      nav: zh.nav, overview: zh.overview, stages: zh.stages, stagesText: zh.stagesText, nutrition: zh.nutrition, products: zh.products,
      browse: zh.browse, resources: zh.resources, resourcesText: zh.resourcesText,
      sections: zh.sections.map((title, index) => ({ key: `section-${index + 1}`, title })),
    }, locale: "zh", overrideAccess: true });
  }

  for (const group of contentCollections) {
    for (const item of group.items) {
      const media = await createMedia(path.join(root, "public", item.image.slice(1)), { en: item.locales.en.title, zh: item.locales.zh.title });
      const enData = { slug: item.slug, title: item.locales.en.title, summary: item.locales.en.summary, body: item.locales.en.body ?? "", richBody: plainTextToRichText(item.locales.en.body ?? ""), publishedOn: item.publishedOn, image: media.id };
      if (group.key === "news") enData.kind = item.kind ?? "news";
      if (group.key === "insights") { enData.author = item.locales.en.author; enData.topics = (item.topics ?? []).map(slug => ({ slug })); }
      const created = await payload.create({ collection: group.collection, data: enData, locale: "en", overrideAccess: true });
      const zhData = { title: item.locales.zh.title, summary: item.locales.zh.summary, body: item.locales.zh.body ?? "", richBody: plainTextToRichText(item.locales.zh.body ?? "") };
      if (group.key === "insights") zhData.author = item.locales.zh.author;
      await payload.update({ collection: group.collection, id: created.id, data: zhData, locale: "zh", overrideAccess: true });
    }
  }

  const seedMediaIds = new Map();
  for (const media of homepageSeedMedia) seedMediaIds.set(media.key, (await createMedia(path.join(root, media.path), media.alt)).id);
  const localized = (en, zh) => ({ en, zh });
  const homepageData = {
    slides: homepageSeeds.en.slides.map((enSlide, index) => {
      const zhSlide = homepageSeeds.zh.slides[index];
      return { eyebrow: localized(enSlide.eyebrow, zhSlide.eyebrow), title: localized(enSlide.title, zhSlide.title), description: localized(enSlide.description, zhSlide.description), actionLabel: localized(enSlide.actionLabel, zhSlide.actionLabel), actionPath: enSlide.actionPath, image: seedMediaIds.get(enSlide.imageKey) };
    }),
    featured: homepageSeeds.en.featured.map((enCard, index) => {
      const zhCard = homepageSeeds.zh.featured[index];
      return { title: localized(enCard.title, zhCard.title), description: localized(enCard.description, zhCard.description), actionLabel: localized(enCard.actionLabel, zhCard.actionLabel), actionPath: enCard.actionPath, image: seedMediaIds.get(enCard.imageKey) };
    }),
  };
  await payload.updateGlobal({ slug: "homepage", data: homepageData, locale: "all", overrideAccess: true });
  const companyData = {
    title: { en: companySeeds.en.title, zh: companySeeds.zh.title },
    summary: { en: companySeeds.en.summary, zh: companySeeds.zh.summary },
    description: { en: companySeeds.en.description, zh: companySeeds.zh.description },
    legalName: { en: companySeeds.en.legalName, zh: companySeeds.zh.legalName },
    email: companySeeds.en.email,
    whatsapp: companySeeds.en.whatsapp,
    address: { en: companySeeds.en.address, zh: companySeeds.zh.address },
    banner: seedMediaIds.get("company-banner"),
    focusAreas: companySeeds.en.focusAreas.map((enArea, index) => {
      const zhArea = companySeeds.zh.focusAreas[index];
      return { title: { en: enArea.title, zh: zhArea?.title ?? enArea.title }, description: { en: enArea.description, zh: zhArea?.description ?? enArea.description } };
    }),
    milestones: [],
  };
  await payload.updateGlobal({ slug: "company-profile", data: companyData, locale: "all", overrideAccess: true });

  for (const group of faqSeeds) {
    const createdGroup = await payload.create({ collection: "faq-groups", data: { slug: group.slug, name: group.name.en, sortOrder: faqSeeds.indexOf(group) }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "faq-groups", id: createdGroup.id, data: { name: group.name.zh }, locale: "zh", overrideAccess: true });
    for (const question of group.questions) {
      const created = await payload.create({ collection: "faqs", data: { group: createdGroup.id, question: question.question.en, answer: question.answer.en, sortOrder: group.questions.indexOf(question) }, locale: "en", overrideAccess: true });
      await payload.update({ collection: "faqs", id: created.id, data: { question: question.question.zh, answer: question.answer.zh }, locale: "zh", overrideAccess: true });
    }
  }

  console.log(JSON.stringify({ ok: true, imported: { categories: source.categories.length, products: source.products.length, cropGuides: cropSource.records.length, news: contentSource.records.news.length, insights: contentSource.records.insights.length, cases: contentSource.records.cases.length, homepage: 1, companyProfile: 1, faqGroups: faqSeeds.length, faqs: faqSeeds.reduce((total, group) => total + group.questions.length, 0), media: source.products.length + Object.keys(contentSource.records).reduce((total, key) => total + contentSource.records[key].length, 0) + homepageSeedMedia.length }, target: process.env.PAYLOAD_DATABASE || "sqlite" }, null, 2));
} finally {
  if (payload?.destroy) await payload.destroy();
}
