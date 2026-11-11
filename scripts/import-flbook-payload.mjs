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
const contentPhase1 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "content-localizations-phase1.json"), "utf8"));
const contentPhase2 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "content-localizations-phase2.json"), "utf8"));
const contentPhase3 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "content-localizations-phase3.json"), "utf8"));
const cropSource = JSON.parse(await fs.readFile(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const cropPhase1 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "crop-guide-localizations-phase1.json"), "utf8"));
const cropPhase2 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "crop-guide-localizations-phase2.json"), "utf8"));
const cropPhase3 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "crop-guide-localizations-phase3.json"), "utf8"));
const corePhase1 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase1.json"), "utf8"));
const corePhase2 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase2-it.json"), "utf8"));
const corePhase3 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase3-tr.json"), "utf8"));
const corePhase4 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase4-th.json"), "utf8"));
const corePhase5 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase5-nl.json"), "utf8"));
const corePhase6 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase6-ro.json"), "utf8"));
const corePhase7 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase7-el.json"), "utf8"));
const corePhase8 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "core-page-localizations-phase8-he.json"), "utf8"));
const coreSources = [corePhase1, corePhase2, corePhase3, corePhase4, corePhase5, corePhase6, corePhase7, corePhase8];
const coreLocales = [...new Set(coreSources.flatMap(source => source.locales))];
const coreCompany = Object.assign({}, ...coreSources.map(source => source.company));
const coreFaq = Object.fromEntries(Object.keys(corePhase1.faq).map(slug => [slug, Object.assign({}, ...coreSources.map(source => source.faq[slug] ?? {}))]));
const contentLocales = [...contentPhase1.locales, ...contentPhase2.locales, ...contentPhase3.locales];
const contentLocalizations = Object.fromEntries(["news", "insights", "cases"].map(type => [type, Object.fromEntries(contentSource.records[type].map(record => [record.slug, { ...(contentPhase1.records[type]?.[record.slug] ?? {}), ...(contentPhase2.records[type]?.[record.slug] ?? {}), ...(contentPhase3.records[type]?.[record.slug] ?? {}) }]))]));
const cropGuideLocales = [...cropPhase1.locales, ...cropPhase2.locales, ...cropPhase3.locales];
const cropGuideLocalizations = Object.fromEntries(cropSource.records.map(record => [record.slug, { ...(cropPhase1.records[record.slug] ?? {}), ...(cropPhase2.records[record.slug] ?? {}), ...(cropPhase3.records[record.slug] ?? {}) }]));
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
  const media = await payload.create({ collection: "media", data: { alt: alt.en }, locale: "en", file: { data, mimetype, name: path.basename(filePath), size: data.length }, overrideAccess: true });
  for (const [locale, localizedAlt] of Object.entries(alt)) {
    if (locale === "en" || !localizedAlt) continue;
    await payload.update({ collection: "media", id: media.id, data: { alt: localizedAlt }, locale, overrideAccess: true });
  }
  return media;
};

try {
  const categoryIds = new Map();
  for (const category of source.categories) {
    const slug = category.slug;
    const names = category.locales;
    const created = await payload.create({ collection: "categories", data: { slug, name: names.en }, locale: "en", overrideAccess: true });
    for (const [locale, name] of Object.entries(names)) {
      if (locale === "en") continue;
      await payload.update({ collection: "categories", id: created.id, data: { name }, locale, overrideAccess: true });
    }
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
    for (const [locale, localized] of Object.entries(product.locales)) {
      if (locale === "en") continue;
      await payload.update({ collection: "products", id: created.id, data: {
        name: localized.name,
        intro: localized.intro,
        specifications: (product.specifications ?? []).map(({ locales, ...spec }) => ({ ...spec, label: locales?.[locale] ?? spec.label })),
      }, locale, overrideAccess: true });
    }
  }

  for (const guide of cropSource.records) {
    const en = guide.locales.en;
    const created = await payload.create({ collection: "crop-guides", data: {
      slug: guide.slug, status: cropSource.reviewStatus, nav: en.nav, overview: en.overview, stages: en.stages, stagesText: en.stagesText,
      nutrition: en.nutrition, products: en.products, browse: en.browse, resources: en.resources, resourcesText: en.resourcesText,
      sections: en.sections.map((title, index) => ({ key: `section-${index + 1}`, title })),
    }, locale: "en", overrideAccess: true });
    const zh = guide.locales.zh;
    const sectionIds = created.sections?.map(section => section.id) ?? [];
    await payload.update({ collection: "crop-guides", id: created.id, data: {
      nav: zh.nav, overview: zh.overview, stages: zh.stages, stagesText: zh.stagesText, nutrition: zh.nutrition, products: zh.products,
      browse: zh.browse, resources: zh.resources, resourcesText: zh.resourcesText,
      sections: zh.sections.map((title, index) => ({ id: sectionIds[index], key: `section-${index + 1}`, title })),
    }, locale: "zh", overrideAccess: true });
    for (const locale of cropGuideLocales) {
      const localized = cropGuideLocalizations[guide.slug]?.[locale];
      if (!localized?.sections || localized.sections.length !== 5 || !localized.nav || !localized.overview || !localized.stages || !localized.stagesText || !localized.nutrition || !localized.products || !localized.browse || !localized.resources || !localized.resourcesText) throw new Error(`Missing ${locale} crop guide translation: ${guide.slug}`);
      await payload.update({ collection: "crop-guides", id: created.id, data: {
        nav: localized.nav, overview: localized.overview, stages: localized.stages, stagesText: localized.stagesText,
        nutrition: localized.nutrition, products: localized.products, browse: localized.browse, resources: localized.resources, resourcesText: localized.resourcesText,
        sections: localized.sections.map((title, index) => ({ id: sectionIds[index], key: `section-${index + 1}`, title })),
      }, locale, overrideAccess: true });
    }
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
      for (const locale of contentLocales) {
        const localized = contentLocalizations[group.key]?.[item.slug]?.[locale];
        if (!localized?.title || !localized.summary || !localized.body || (group.key === "insights" && !localized.author)) throw new Error(`Missing ${locale} content translation: ${group.key}/${item.slug}`);
        const localizedData = { title: localized.title, summary: localized.summary, body: localized.body, richBody: plainTextToRichText(localized.body) };
        if (group.key === "insights") localizedData.author = localized.author;
        await payload.update({ collection: group.collection, id: created.id, data: localizedData, locale, overrideAccess: true });
      }
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
  const companyLocaleData = Object.fromEntries(["en", "zh", ...coreLocales].map(locale => [locale, companySeeds[locale] ?? coreCompany[locale]]));
  const localizedField = field => Object.fromEntries(Object.entries(companyLocaleData).map(([locale, data]) => [locale, data[field]]));
  const companyData = {
    title: localizedField("title"),
    summary: localizedField("summary"),
    description: localizedField("description"),
    legalName: Object.fromEntries(Object.keys(companyLocaleData).map(locale => [locale, locale === "zh" ? companySeeds.zh.legalName : companySeeds.en.legalName])),
    email: companySeeds.en.email,
    whatsapp: companySeeds.en.whatsapp,
    address: localizedField("address"),
    banner: seedMediaIds.get("company-banner"),
    focusAreas: companySeeds.en.focusAreas.map((_enArea, index) => ({
      title: Object.fromEntries(Object.entries(companyLocaleData).map(([locale, data]) => [locale, data.focusAreas[index].title])),
      description: Object.fromEntries(Object.entries(companyLocaleData).map(([locale, data]) => [locale, data.focusAreas[index].description])),
    })),
    milestones: [],
  };
  await payload.updateGlobal({ slug: "company-profile", data: companyData, locale: "all", overrideAccess: true });

  for (const group of faqSeeds) {
    const createdGroup = await payload.create({ collection: "faq-groups", data: { slug: group.slug, name: group.name.en, sortOrder: faqSeeds.indexOf(group) }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "faq-groups", id: createdGroup.id, data: { name: group.name.zh }, locale: "zh", overrideAccess: true });
    for (const locale of coreLocales) {
      const translatedGroup = coreFaq[group.slug][locale];
      if (!translatedGroup?.name) throw new Error(`Missing ${locale} FAQ group translation: ${group.slug}`);
      await payload.update({ collection: "faq-groups", id: createdGroup.id, data: { name: translatedGroup.name }, locale, overrideAccess: true });
    }
    for (const question of group.questions) {
      const created = await payload.create({ collection: "faqs", data: { group: createdGroup.id, question: question.question.en, answer: question.answer.en, sortOrder: group.questions.indexOf(question) }, locale: "en", overrideAccess: true });
      await payload.update({ collection: "faqs", id: created.id, data: { question: question.question.zh, answer: question.answer.zh }, locale: "zh", overrideAccess: true });
      for (const locale of coreLocales) {
        const translatedGroup = coreFaq[group.slug][locale];
        const translatedQuestion = translatedGroup.questions[question.slug];
        if (!translatedGroup.name || !translatedQuestion?.question || !translatedQuestion?.answer) throw new Error(`Missing ${locale} FAQ translation: ${group.slug}/${question.slug}`);
        await payload.update({ collection: "faqs", id: created.id, data: { question: translatedQuestion.question, answer: translatedQuestion.answer }, locale, overrideAccess: true });
      }
    }
  }

  console.log(JSON.stringify({ ok: true, imported: { categories: source.categories.length, products: source.products.length, cropGuides: cropSource.records.length, news: contentSource.records.news.length, insights: contentSource.records.insights.length, cases: contentSource.records.cases.length, homepage: 1, companyProfile: 1, faqGroups: faqSeeds.length, faqs: faqSeeds.reduce((total, group) => total + group.questions.length, 0), media: source.products.length + Object.keys(contentSource.records).reduce((total, key) => total + contentSource.records[key].length, 0) + homepageSeedMedia.length }, target: process.env.PAYLOAD_DATABASE || "sqlite" }, null, 2));
} finally {
  if (payload?.destroy) await payload.destroy();
}
