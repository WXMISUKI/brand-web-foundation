import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { companySeeds, faqSeeds, homepageSeedMedia, homepageSeeds } from "./payload-seeds.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const importPath = path.join(root, ".local", "flbook-payload-staging", "flbook-payload-import.json");
const source = JSON.parse(await fs.readFile(importPath, "utf8"));
const contentSource = JSON.parse(await fs.readFile(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const cropSource = JSON.parse(await fs.readFile(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const tempRoot = path.join(root, ".local", "flbook-payload-dry-run");
const workdir = path.join(tempRoot, "workspace");
const reportPath = path.join(root, ".local", "flbook-payload-dry-run-report.json");
const previousCwd = process.cwd();
let payload;
const categoryNames = {
  "water-soluble": { en: "Water-soluble", zh: "水溶肥" },
  "medium-elements": { en: "Secondary nutrients", zh: "中量元素" },
  compound: { en: "Compound fertilizer", zh: "复合肥" },
};
const plainTextToRichText = value => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: String(value || "").replace(/\r\n?/g, "\n").split("\n").map(line => ({ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, textStyle: "", children: line ? [{ type: "text", version: 1, text: line, detail: 0, format: 0, mode: "normal", style: "" }] : [] })) } });

const report = { ok: false, products: source.products.length, content: { news: contentSource.records.news.length, insights: contentSource.records.insights.length, cases: contentSource.records.cases.length }, cropGuides: cropSource.records.length, media: 0, categories: 0, globals: { homepage: false, companyProfile: false }, faqGroups: 0, faqs: 0, locales: ["en", "zh"], checks: [], error: null, cleanupPending: false };
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
  for (const slug of source.categories) {
    const names = categoryNames[slug];
    const created = await payload.create({ collection: "categories", data: { slug, name: names.en }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "categories", id: created.id, data: { name: names.zh }, locale: "zh", overrideAccess: true });
    categoryIds.set(slug, created.id);
  }
  report.categories = categoryIds.size;
  check("three mapped categories created", categoryIds.size === 3, { categories: [...categoryIds.keys()] });

  const createMedia = async (mediaPath, alt) => {
    const data = await fs.readFile(mediaPath);
    const media = await payload.create({ collection: "media", data: { alt }, file: { data, mimetype: "image/webp", name: path.basename(mediaPath), size: data.length }, overrideAccess: true });
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
    await payload.update({ collection: "products", id: created.id, data: { name: product.locales.zh.name, intro: product.locales.zh.intro, specifications: (product.specifications ?? []).map(({ locales, ...spec }) => ({ ...spec, label: locales?.zh ?? spec.label })) }, locale: "zh", overrideAccess: true });
  }
  check("ten products created", (await payload.find({ collection: "products", locale: "en", pagination: false, depth: 1, overrideAccess: true })).totalDocs === 10);
  check("ten product media records created", report.media === 10);

  const en = await payload.find({ collection: "products", locale: "en", pagination: false, depth: 1, overrideAccess: true });
  const zh = await payload.find({ collection: "products", locale: "zh", pagination: false, depth: 1, overrideAccess: true });
  const adminEn = await payload.find({ collection: "products", locale: "en", pagination: false, depth: 1, overrideAccess: true, user: { id: "dry-run-admin", email: "dry-run@example.com" } });
  check("English localized names readable", en.docs.every(item => typeof item.name === "string" && item.name.length > 0));
  check("Chinese localized names readable", zh.docs.every(item => typeof item.name === "string" && item.name.length > 0));
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
      sections: zhData.sections.map((title, index) => ({ key: `section-${index + 1}`, title })),
    }, locale: "zh", overrideAccess: true });
  }
  const cropEn = await payload.find({ collection: "crop-guides", locale: "en", pagination: false, depth: 0, overrideAccess: true });
  const cropZh = await payload.find({ collection: "crop-guides", locale: "zh", pagination: false, depth: 0, overrideAccess: true });
  check("crop guide English records and sections readable", cropEn.totalDocs === cropSource.records.length && cropEn.docs.every(item => typeof item.nav === "string" && Array.isArray(item.sections) && item.sections.length === 5));
  check("crop guide Chinese records and sections readable", cropZh.totalDocs === cropSource.records.length && cropZh.docs.every(item => typeof item.nav === "string" && Array.isArray(item.sections) && item.sections.length === 5));

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
    }
    const enContent = await payload.find({ collection: group.collection, locale: "en", pagination: false, depth: 1, overrideAccess: true });
    const zhContent = await payload.find({ collection: group.collection, locale: "zh", pagination: false, depth: 1, overrideAccess: true });
    check(`${group.key} English records readable`, enContent.totalDocs === group.items.length && enContent.docs.every(item => typeof item.title === "string" && item.title.length > 0 && typeof item.body === "string" && item.body.length > 0 && (group.key !== "news" || item.kind === "news" || item.kind === "event") && (group.key !== "insights" || Array.isArray(item.topics) && item.topics.length > 0)));
    check(`${group.key} Chinese records readable`, zhContent.totalDocs === group.items.length && zhContent.docs.every(item => typeof item.title === "string" && item.title.length > 0 && typeof item.body === "string" && item.body.length > 0));
  }

  const seedMediaIds = new Map();
  for (const media of homepageSeedMedia) seedMediaIds.set(media.key, await createMedia(path.join(root, media.path), media.alt));
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
  await payload.updateGlobal({ slug: "company-profile", data: { ...companySeeds.en, banner: seedMediaIds.get("company-banner"), milestones: [] }, locale: "en", overrideAccess: true });
  await payload.updateGlobal({ slug: "company-profile", data: { ...companySeeds.zh, banner: seedMediaIds.get("company-banner"), milestones: [] }, locale: "zh", overrideAccess: true });
  report.globals.homepage = true;
  report.globals.companyProfile = true;
  const homepageEn = await payload.findGlobal({ slug: "homepage", locale: "en", fallbackLocale: false, depth: 1, overrideAccess: true });
  const homepageZh = await payload.findGlobal({ slug: "homepage", locale: "zh", fallbackLocale: false, depth: 1, overrideAccess: true });
  const companyEn = await payload.findGlobal({ slug: "company-profile", locale: "en", fallbackLocale: false, depth: 1, overrideAccess: true });
  const homepageSummary = { en: homepageEn.slides?.map(slide => ({ title: slide.title, description: slide.description })), zh: homepageZh.slides?.map(slide => ({ title: slide.title, description: slide.description })) };
  check("homepage global seeds are readable in both locales", Array.isArray(homepageEn.slides) && homepageEn.slides.length === 3 && homepageEn.slides.every(slide => typeof slide.title === "string" && slide.title.length > 0 && typeof slide.description === "string" && slide.description.length > 0) && Array.isArray(homepageZh.slides) && homepageZh.slides.length === 3 && homepageZh.slides.every(slide => typeof slide.title === "string" && slide.title.length > 0 && typeof slide.description === "string" && slide.description.length > 0), { homepageSummary });
  check("company profile global seed is readable", Boolean(typeof companyEn.title === "string" && Array.isArray(companyEn.focusAreas) && companyEn.focusAreas.length === 3 && companyEn.banner));

  for (const group of faqSeeds) {
    const createdGroup = await payload.create({ collection: "faq-groups", data: { slug: group.slug, name: group.name.en, sortOrder: faqSeeds.indexOf(group) }, locale: "en", overrideAccess: true });
    await payload.update({ collection: "faq-groups", id: createdGroup.id, data: { name: group.name.zh }, locale: "zh", overrideAccess: true });
    report.faqGroups += 1;
    for (const question of group.questions) {
      const created = await payload.create({ collection: "faqs", data: { group: createdGroup.id, question: question.question.en, answer: question.answer.en, sortOrder: group.questions.indexOf(question) }, locale: "en", overrideAccess: true });
      await payload.update({ collection: "faqs", id: created.id, data: { question: question.question.zh, answer: question.answer.zh }, locale: "zh", overrideAccess: true });
      report.faqs += 1;
    }
  }
  const faqGroups = await payload.find({ collection: "faq-groups", locale: "en", fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
  const faqs = await payload.find({ collection: "faqs", locale: "zh", fallbackLocale: false, pagination: false, depth: 0, overrideAccess: true });
  check("FAQ groups and questions are readable in both locales", faqGroups.totalDocs === faqSeeds.length && faqs.totalDocs === report.faqs && faqs.docs.every(item => typeof item.question === "string" && typeof item.answer === "string"));
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
