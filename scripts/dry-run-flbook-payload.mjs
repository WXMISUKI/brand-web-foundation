import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { companySeeds, faqSeeds, homepageSeedMedia, homepageSeeds } from "./payload-seeds.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const importPath = path.join(root, ".local", "flbook-payload-staging", "flbook-payload-import.json");
const source = JSON.parse(await fs.readFile(importPath, "utf8"));
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
const tempRoot = path.join(root, ".local", "flbook-payload-dry-run");
const workdir = path.join(tempRoot, "workspace");
const reportPath = path.join(root, ".local", "flbook-payload-dry-run-report.json");
const previousCwd = process.cwd();
let payload;
const plainTextToRichText = value => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: String(value || "").replace(/\r\n?/g, "\n").split("\n").map(line => ({ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, textStyle: "", children: line ? [{ type: "text", version: 1, text: line, detail: 0, format: 0, mode: "normal", style: "" }] : [] })) } });

const locales = source.locales ?? ["en", "zh"];
const report = { ok: false, products: source.products.length, content: { news: contentSource.records.news.length, insights: contentSource.records.insights.length, cases: contentSource.records.cases.length }, cropGuides: cropSource.records.length, media: 0, categories: 0, globals: { homepage: false, companyProfile: false }, faqGroups: 0, faqs: 0, locales, checks: [], error: null, cleanupPending: false };
const check = (name, pass, details = undefined) => { report.checks.push({ name, pass, ...(details ? { details } : {}) }); if (!pass) throw new Error(`dry-run check failed: ${name}`); };

try {
  await fs.rm(tempRoot, { recursive: true, force: true });
  await fs.mkdir(workdir, { recursive: true });
  process.env.NODE_ENV = "development";
  process.env.PAYLOAD_SECRET = "flbook-dry-run-secret-20261108-32-chars-minimum";
  process.env.PAYLOAD_DATABASE = "sqlite";
  process.env.PAYLOAD_SQLITE_URL = `file:${path.join(workdir, "payload.sqlite")}`;
  process.env.CATALOG_SOURCE = "payload";
  process.chdir(workdir);
  // Payload 3.92 imports @next/env through a default ESM binding. Under tsx
  // the CJS package exposes only named exports, so make the default explicit
  // in the shared require cache before loading Payload.
  const require = createRequire(import.meta.url);
  const nextEnv = require("@next/env");
  if (!nextEnv.default) nextEnv.default = nextEnv;
  const { getPayload } = await import("payload");
  const config = (await import(pathToFileURL(path.join(root, "src", "payload.config.ts")).href)).default;
  payload = await getPayload({ config });

  const categoryIds = new Map();
  for (const category of source.categories) {
    const { slug, locales: names } = category;
    const created = await payload.create({ collection: "categories", data: { slug, name: names.en }, locale: "en", overrideAccess: true });
    for (const [locale, name] of Object.entries(names)) {
      if (locale === "en") continue;
      await payload.update({ collection: "categories", id: created.id, data: { name }, locale, overrideAccess: true });
    }
    categoryIds.set(slug, created.id);
  }
  report.categories = categoryIds.size;
  check("three mapped categories created", categoryIds.size === 3, { categories: [...categoryIds.keys()] });

  const createMedia = async (mediaPath, alt) => {
    const data = await fs.readFile(mediaPath);
    const media = await payload.create({ collection: "media", data: { alt: alt.en }, locale: "en", file: { data, mimetype: "image/webp", name: path.basename(mediaPath), size: data.length }, overrideAccess: true });
    for (const [locale, localizedAlt] of Object.entries(alt)) {
      if (locale === "en" || !localizedAlt) continue;
      await payload.update({ collection: "media", id: media.id, data: { alt: localizedAlt }, locale, overrideAccess: true });
    }
    report.media += 1;
    return media.id;
  };

  for (const product of source.products) {
    const mediaPath = path.join(path.dirname(importPath), product.media.file);
    const mediaId = await createMedia(mediaPath, product.media.alt);
    const created = await payload.create({ collection: "products", data: {
      slug: product.slug,
      category: categoryIds.get(product.categorySlug),
      name: product.locales.en.name,
      intro: product.locales.en.intro,
      image: mediaId,
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
        specifications: (product.specifications ?? []).map(({ locales: labels, ...spec }) => ({ ...spec, label: labels?.[locale] ?? spec.label })),
      }, locale, overrideAccess: true });
    }
  }
  check("ten products created", (await payload.find({ collection: "products", locale: "en", pagination: false, depth: 1, overrideAccess: true })).totalDocs === 10);
  check("ten product media records created", report.media === 10);

  const en = await payload.find({ collection: "products", locale: "en", pagination: false, depth: 1, overrideAccess: true });
  const zh = await payload.find({ collection: "products", locale: "zh", pagination: false, depth: 1, overrideAccess: true });
  const adminEn = await payload.find({ collection: "products", locale: "en", pagination: false, depth: 1, overrideAccess: true, user: { id: "dry-run-admin", email: "dry-run@example.com" } });
  check("English localized names readable", en.docs.every(item => typeof item.name === "string" && item.name.length > 0));
  check("Chinese localized names readable", zh.docs.every(item => typeof item.name === "string" && item.name.length > 0));
  for (const locale of locales.filter(locale => !["en", "zh"].includes(locale))) {
    const localized = await payload.find({ collection: "products", locale, fallbackLocale: false, pagination: false, depth: 1, overrideAccess: true });
    check(`${locale} product names and descriptions readable`, localized.totalDocs === source.products.length && localized.docs.every(item => typeof item.name === "string" && item.name.length > 0 && typeof item.intro === "string" && item.intro.length > 0));
    const productsBySlug = new Map(localized.docs.map(item => [item.slug, item]));
    const missingLabels = source.products.flatMap(product => (product.specifications ?? []).filter((spec, index) => {
      const localizedProduct = productsBySlug.get(product.slug);
      return !localizedProduct?.specifications?.[index]?.label;
    }).map(spec => `${product.slug}/${spec.id}`));
    check(`${locale} product specification labels readable`, missingLabels.length === 0, { missingLabels });
    const changedValues = source.products.flatMap(product => {
      const localizedProduct = productsBySlug.get(product.slug);
      return (product.specifications ?? []).filter((spec, index) => {
        const row = localizedProduct?.specifications?.[index];
        return !row || row.unit !== spec.unit || (row.typical ?? undefined) !== (spec.typical ?? undefined) || (row.minimum ?? undefined) !== (spec.minimum ?? undefined) || (row.maximum ?? undefined) !== (spec.maximum ?? undefined);
      }).map(spec => `${product.slug}/${spec.id}`);
    });
    check(`${locale} specification values and units unchanged`, changedValues.length === 0, { changedValues });
    const localizedCategories = await payload.find({ collection: "categories", locale, fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
    check(`${locale} product categories readable`, localizedCategories.totalDocs === source.categories.length && localizedCategories.docs.every(item => typeof item.name === "string" && item.name.length > 0));
  }
  check("relationships and media populated", en.docs.every(item => item.category && item.image));
  check("all generated media are WebP", en.docs.every(item => typeof item.image === "object" && item.image?.mimeType === "image/webp"));
  const expectedSpecificationCount = source.products.reduce((total, product) => total + (product.specifications?.length ?? 0), 0);
  const actualSpecificationCount = en.docs.reduce((total, product) => total + (Array.isArray(product.specifications) ? product.specifications.length : 0), 0);
  check("source technical specifications are preserved", actualSpecificationCount === expectedSpecificationCount && en.docs.every(item => Array.isArray(item.specifications)), { expectedSpecificationCount, actualSpecificationCount });
  const provenanceFailures = adminEn.docs.filter(item => !(Array.isArray(item.sourcePages) && item.sourcePages.length > 0 && typeof item.sourcePreviewPath === "string" && item.sourcePreviewPath.startsWith("/images/flbook-pages/") && item.sourceUrl === source.source.url && ["owner-review", "approved"].includes(item.reviewStatus) && ["generated-placeholder", "owner-supplied", "authorized-example", "pending"].includes(item.assetStatus))).map(item => ({ slug: item.slug, sourcePages: item.sourcePages, sourcePreviewPath: item.sourcePreviewPath, sourceUrl: item.sourceUrl, reviewStatus: item.reviewStatus, assetStatus: item.assetStatus }));
  check("source pages, previews and review metadata preserved", provenanceFailures.length === 0, { failures: provenanceFailures });
  const relatedSummary = adminEn.docs.map(item => ({ slug: item.slug, pages: item.sourceRelatedPages }));
  check("excluded adjacent brochure pages remain traceable", adminEn.docs.filter(item => Array.isArray(item.sourceRelatedPages) && item.sourceRelatedPages.length > 0).length === 5 && adminEn.docs.filter(item => Array.isArray(item.sourceRelatedPages) && item.sourceRelatedPages.length > 0 && item.sourceRelatedPages.every(related => related.role === "excluded-candidate" && Number.isInteger(related.page))).length === 5, { relatedSummary });
  check("single-page product provenance crops are readable", en.docs.filter(item => typeof item.sourceDetailPreviewPath === "string" && item.sourceDetailPreviewPath.includes("/images/flbook-pages/page-")).length === 10);

  for (const guide of cropSource.records) {
    const enData = guide.locales.en;
    const created = await payload.create({ collection: "crop-guides", data: {
      slug: guide.slug,
      status: cropSource.reviewStatus,
      nav: enData.nav,
      overview: enData.overview,
      stages: enData.stages,
      stagesText: enData.stagesText,
      nutrition: enData.nutrition,
      products: enData.products,
      browse: enData.browse,
      resources: enData.resources,
      resourcesText: enData.resourcesText,
      sections: enData.sections.map((title, index) => ({ key: `section-${index + 1}`, title })),
    }, locale: "en", overrideAccess: true });
    const zhData = guide.locales.zh;
    const sectionIds = created.sections?.map(section => section.id) ?? [];
    await payload.update({ collection: "crop-guides", id: created.id, data: {
      nav: zhData.nav,
      overview: zhData.overview,
      stages: zhData.stages,
      stagesText: zhData.stagesText,
      nutrition: zhData.nutrition,
      products: zhData.products,
      browse: zhData.browse,
      resources: zhData.resources,
      resourcesText: zhData.resourcesText,
      sections: zhData.sections.map((title, index) => ({ id: sectionIds[index], key: `section-${index + 1}`, title })),
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
  const cropEn = await payload.find({ collection: "crop-guides", locale: "en", pagination: false, depth: 0, overrideAccess: true });
  const cropZh = await payload.find({ collection: "crop-guides", locale: "zh", pagination: false, depth: 0, overrideAccess: true });
  check("crop guide English records and sections readable", cropEn.totalDocs === cropSource.records.length && cropEn.docs.every(item => typeof item.nav === "string" && Array.isArray(item.sections) && item.sections.length === 5));
  check("crop guide Chinese records and sections readable", cropZh.totalDocs === cropSource.records.length && cropZh.docs.every(item => typeof item.nav === "string" && Array.isArray(item.sections) && item.sections.length === 5));
  for (const locale of cropGuideLocales) {
    const localizedCrop = await payload.find({ collection: "crop-guides", locale, fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
    check(`${locale} crop guide localized fields readable`, localizedCrop.totalDocs === cropSource.records.length && localizedCrop.docs.every(item => typeof item.nav === "string" && typeof item.overview === "string" && typeof item.stages === "string" && typeof item.stagesText === "string" && typeof item.nutrition === "string" && typeof item.products === "string" && typeof item.browse === "string" && typeof item.resources === "string" && typeof item.resourcesText === "string" && Array.isArray(item.sections) && item.sections.length === 5 && item.sections.every(section => typeof section.title === "string" && section.title.length > 0)));
  }

  const contentCollections = [
    { key: "news", collection: "news", items: contentSource.records.news, hasAuthor: false },
    { key: "insights", collection: "insights", items: contentSource.records.insights, hasAuthor: true },
    { key: "cases", collection: "cases", items: contentSource.records.cases, hasAuthor: false },
  ];
  for (const group of contentCollections) {
    for (const item of group.items) {
      const mediaPath = path.join(root, "public", item.image.slice(1));
      const alt = { en: item.locales.en.title, zh: item.locales.zh.title };
      const mediaId = await createMedia(mediaPath, alt);
      const enData = { slug: item.slug, kind: item.kind ?? "news", topics: item.topics?.map(slug => ({ slug })) ?? [], title: item.locales.en.title, summary: item.locales.en.summary, body: item.locales.en.body ?? "", richBody: plainTextToRichText(item.locales.en.body ?? ""), publishedOn: item.publishedOn, image: mediaId };
      if (group.hasAuthor) enData.author = item.locales.en.author;
      const created = await payload.create({ collection: group.collection, data: enData, locale: "en", overrideAccess: true });
      const zhData = { title: item.locales.zh.title, summary: item.locales.zh.summary, body: item.locales.zh.body ?? "", richBody: plainTextToRichText(item.locales.zh.body ?? "") };
      if (group.hasAuthor) zhData.author = item.locales.zh.author;
      await payload.update({ collection: group.collection, id: created.id, data: zhData, locale: "zh", overrideAccess: true });
      for (const locale of contentLocales) {
        const localized = contentLocalizations[group.key]?.[item.slug]?.[locale];
        if (!localized?.title || !localized.summary || !localized.body || (group.hasAuthor && !localized.author)) throw new Error(`Missing ${locale} content translation: ${group.key}/${item.slug}`);
        const localizedData = { title: localized.title, summary: localized.summary, body: localized.body, richBody: plainTextToRichText(localized.body) };
        if (group.hasAuthor) localizedData.author = localized.author;
        await payload.update({ collection: group.collection, id: created.id, data: localizedData, locale, overrideAccess: true });
      }
    }
    const enContent = await payload.find({ collection: group.collection, locale: "en", pagination: false, depth: 1, overrideAccess: true });
    const zhContent = await payload.find({ collection: group.collection, locale: "zh", pagination: false, depth: 1, overrideAccess: true });
    check(`${group.key} English records readable`, enContent.totalDocs === group.items.length && enContent.docs.every(item => typeof item.title === "string" && item.title.length > 0 && typeof item.body === "string" && item.body.length > 0 && (group.key !== "news" || item.kind === "news" || item.kind === "event") && (group.key !== "insights" || Array.isArray(item.topics) && item.topics.length > 0)));
    check(`${group.key} Chinese records readable`, zhContent.totalDocs === group.items.length && zhContent.docs.every(item => typeof item.title === "string" && item.title.length > 0 && typeof item.body === "string" && item.body.length > 0));
    for (const locale of contentLocales) {
      const localizedContent = await payload.find({ collection: group.collection, locale, fallbackLocale: false, pagination: false, depth: 1, overrideAccess: true });
      check(`${group.key} ${locale} localized records readable`, localizedContent.totalDocs === group.items.length && localizedContent.docs.every(item => typeof item.title === "string" && item.title.length > 0 && typeof item.summary === "string" && item.summary.length > 0 && typeof item.body === "string" && item.body.length > 0 && item.richBody?.root?.children?.length > 0 && (!group.hasAuthor || typeof item.author === "string" && item.author.length > 0)));
    }
  }

  const seedMediaIds = new Map();
  for (const media of homepageSeedMedia) seedMediaIds.set(media.key, await createMedia(path.join(root, media.path), media.alt));
  const homepageLocales = Object.keys(homepageSeeds);
  const homepageLocalized = (kind, index, field) => Object.fromEntries(homepageLocales.map(locale => [locale, homepageSeeds[locale][kind][index][field]]));
  const homepageData = {
    slides: homepageSeeds.en.slides.map((enSlide, index) => {
      return { eyebrow: homepageLocalized("slides", index, "eyebrow"), title: homepageLocalized("slides", index, "title"), description: homepageLocalized("slides", index, "description"), actionLabel: homepageLocalized("slides", index, "actionLabel"), actionPath: enSlide.actionPath, image: seedMediaIds.get(enSlide.imageKey) };
    }),
    featured: homepageSeeds.en.featured.map((enCard, index) => {
      return { title: homepageLocalized("featured", index, "title"), description: homepageLocalized("featured", index, "description"), actionLabel: homepageLocalized("featured", index, "actionLabel"), actionPath: enCard.actionPath, image: seedMediaIds.get(enCard.imageKey) };
    }),
  };
  await payload.updateGlobal({ slug: "homepage", data: homepageData, locale: "all", overrideAccess: true });
  const companyLocaleData = Object.fromEntries(["en", "zh", ...coreLocales].map(locale => [locale, companySeeds[locale] ?? coreCompany[locale]]));
  const localizedCompanyField = field => Object.fromEntries(Object.entries(companyLocaleData).map(([locale, company]) => [locale, company[field]]));
  const companyData = {
    title: localizedCompanyField("title"), summary: localizedCompanyField("summary"), description: localizedCompanyField("description"),
    legalName: Object.fromEntries(Object.keys(companyLocaleData).map(locale => [locale, locale === "zh" ? companySeeds.zh.legalName : companySeeds.en.legalName])),
    email: companySeeds.en.email, whatsapp: companySeeds.en.whatsapp, address: localizedCompanyField("address"),
    banner: seedMediaIds.get("company-banner"),
    focusAreas: companySeeds.en.focusAreas.map((_area, index) => ({
      title: Object.fromEntries(Object.entries(companyLocaleData).map(([locale, company]) => [locale, company.focusAreas[index].title])),
      description: Object.fromEntries(Object.entries(companyLocaleData).map(([locale, company]) => [locale, company.focusAreas[index].description])),
    })), milestones: [],
  };
  await payload.updateGlobal({ slug: "company-profile", data: companyData, locale: "all", overrideAccess: true });
  report.globals.homepage = true;
  report.globals.companyProfile = true;
  const homepageByLocale = {};
  for (const locale of homepageLocales) homepageByLocale[locale] = await payload.findGlobal({ slug: "homepage", locale, fallbackLocale: false, depth: 1, overrideAccess: true });
  const homepageEn = homepageByLocale.en;
  const homepageZh = homepageByLocale.zh;
  const companyEn = await payload.findGlobal({ slug: "company-profile", locale: "en", fallbackLocale: false, depth: 1, overrideAccess: true });
  const homepageSummary = Object.fromEntries(homepageLocales.map(locale => [locale, homepageByLocale[locale].slides?.map(slide => ({ title: slide.title, description: slide.description }))]));
  const homepageRowsReadable = rows => Array.isArray(rows) && rows.length === 3 && rows.every(row => typeof row?.title === "string" && row.title.length > 0 && typeof row?.description === "string" && row.description.length > 0 && typeof row?.actionPath === "string" && /^\/(?!\/)(?!(?:en|zh|he|nl|fr|it|es|pt|el|ro|ru|th|tr)(?:\/|$))/.test(row.actionPath) && row?.image);
  check("homepage global seeds are readable in all authored locales", homepageLocales.every(locale => homepageRowsReadable(homepageByLocale[locale].slides) && homepageRowsReadable(homepageByLocale[locale].featured)), { homepageSummary });
  check("company profile global seed is readable", Boolean(typeof companyEn.title === "string" && Array.isArray(companyEn.focusAreas) && companyEn.focusAreas.length === 3 && companyEn.banner));
  for (const locale of coreLocales) {
    const localizedCompany = await payload.findGlobal({ slug: "company-profile", locale, fallbackLocale: false, depth: 1, overrideAccess: true });
    check(`${locale} company profile localized fields readable`, typeof localizedCompany.title === "string" && typeof localizedCompany.summary === "string" && typeof localizedCompany.description === "string" && localizedCompany.focusAreas?.every(area => typeof area.title === "string" && typeof area.description === "string"));
  }

  for (const group of faqSeeds) {
    const createdGroup = await payload.create({ collection: "faq-groups", data: { slug: group.slug, name: group.name.en, sortOrder: faqSeeds.indexOf(group) }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "faq-groups", id: createdGroup.id, data: { name: group.name.zh }, locale: "zh", overrideAccess: true });
    for (const locale of coreLocales) {
      const translatedGroup = coreFaq[group.slug][locale];
      await payload.update({ collection: "faq-groups", id: createdGroup.id, data: { name: translatedGroup.name }, locale, overrideAccess: true });
    }
    report.faqGroups += 1;
    for (const question of group.questions) {
      const created = await payload.create({ collection: "faqs", data: { group: createdGroup.id, question: question.question.en, answer: question.answer.en, sortOrder: group.questions.indexOf(question) }, locale: "en", overrideAccess: true });
      await payload.update({ collection: "faqs", id: created.id, data: { question: question.question.zh, answer: question.answer.zh }, locale: "zh", overrideAccess: true });
      for (const locale of coreLocales) {
        const translated = coreFaq[group.slug][locale].questions[question.slug];
        await payload.update({ collection: "faqs", id: created.id, data: { question: translated.question, answer: translated.answer }, locale, overrideAccess: true });
      }
      report.faqs += 1;
    }
  }
  const faqGroups = await payload.find({ collection: "faq-groups", locale: "en", fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
  const faqs = await payload.find({ collection: "faqs", locale: "zh", fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
  check("FAQ groups and questions are readable in both locales", faqGroups.totalDocs === faqSeeds.length && faqs.totalDocs === report.faqs && faqs.docs.every(item => typeof item.question === "string" && typeof item.answer === "string"));
  for (const locale of coreLocales) {
    const localizedGroups = await payload.find({ collection: "faq-groups", locale, fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
    const localizedFaqs = await payload.find({ collection: "faqs", locale, fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
    check(`${locale} FAQ groups and answers readable`, localizedGroups.totalDocs === faqSeeds.length && localizedFaqs.totalDocs === report.faqs && localizedFaqs.docs.every(item => typeof item.question === "string" && typeof item.answer === "string"));
  }
  const inquiries = await payload.find({ collection: "inquiries", pagination: false, depth: 0, overrideAccess: true });
  check("inquiry collection is ready and empty by default", inquiries.totalDocs === 0);
  check("all product, content and seed media created", report.media === 23, { products: 10, content: 9, homepageAndCompany: 4 });
  report.ok = true;
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
} finally {
  try { if (payload?.db?.destroy) await payload.db.destroy(); } catch { /* cleanup continues */ }
  try { if (payload?.destroy) await payload.destroy(); } catch { /* cleanup continues */ }
  try { if (payload?.db?.client?.close) await payload.db.client.close(); } catch { /* cleanup continues */ }
  process.chdir(previousCwd);
  let cleaned = false;
  await new Promise(resolve => setTimeout(resolve, 400));
  try { await fs.rm(tempRoot, { recursive: true, force: true, maxRetries: 8, retryDelay: 300 }); cleaned = true; } catch { /* the follow-up cleanup command can remove a locked workspace */ }
  report.cleanupPending = !cleaned;
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ ...report, report: path.relative(root, reportPath) }, null, 2));
process.exit(report.ok ? 0 : 1);
