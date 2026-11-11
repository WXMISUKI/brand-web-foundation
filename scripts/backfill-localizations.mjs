import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async relative => JSON.parse(await fs.readFile(path.join(root, relative), "utf8"));
const plainTextToRichText = value => ({ root: { type: "root", version: 1, direction: null, format: "", indent: 0, children: String(value || "").replace(/\r\n?/g, "\n").split("\n").map(line => ({ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, textStyle: "", children: line ? [{ type: "text", version: 1, text: line, detail: 0, format: 0, mode: "normal", style: "" }] : [] })) } });
const text = value => typeof value === "string" ? value.trim() : "";
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const sameText = (a, b) => text(a).replace(/\n{3,}/g, "\n\n") === text(b).replace(/\n{3,}/g, "\n\n");

const flbook = await readJson(".local/flbook-payload-staging/flbook-payload-import.json");
const contentSource = await readJson("src/data/content-staging.json");
const cropSource = await readJson("src/data/crop-guide-staging.json");
const contentPhases = await Promise.all([1, 2, 3].map(index => readJson(`src/data/content-localizations-phase${index}.json`)));
const cropPhases = await Promise.all([1, 2, 3].map(index => readJson(`src/data/crop-guide-localizations-phase${index}.json`)));
const corePhases = await Promise.all([
  readJson("src/data/core-page-localizations-phase1.json"),
  readJson("src/data/core-page-localizations-phase2-it.json"),
  readJson("src/data/core-page-localizations-phase3-tr.json"),
  readJson("src/data/core-page-localizations-phase4-th.json"),
  readJson("src/data/core-page-localizations-phase5-nl.json"),
  readJson("src/data/core-page-localizations-phase6-ro.json"),
  readJson("src/data/core-page-localizations-phase7-el.json"),
  readJson("src/data/core-page-localizations-phase8-he.json"),
]);
const homepagePhases = await Promise.all([1, 2, 3].map(index => readJson(`src/data/homepage-localizations-phase${index}.json`)));
const { faqSeeds } = await import(pathToFileURL(path.join(root, "scripts", "payload-seeds.mjs")).href);
const locales = [...new Set(flbook.locales)].filter(locale => locale !== "en" && locale !== "zh");
const mode = process.env.TRANSLATION_BACKFILL_MODE || "preview";
const writeEnabled = mode === "write";
if (!new Set(["preview", "write"]).has(mode)) throw new Error("TRANSLATION_BACKFILL_MODE must be preview or write");
if (writeEnabled) {
  for (const [key, expected] of [["TRANSLATION_BACKFILL_CONFIRM", "YES"], ["TRANSLATION_BACKFILL_TARGET", "YES"], ["TRANSLATION_BACKFILL_EDIT_FREEZE", "CONFIRMED"]]) {
    if (process.env[key] !== expected) throw new Error(`${key}=${expected} is required for write mode`);
  }
}

const mergeByLocale = (sources, selector) => Object.assign({}, ...sources.map(source => selector(source) ?? {}));
const contentTranslations = Object.fromEntries(["news", "insights", "cases"].map(type => [type, Object.fromEntries(contentSource.records[type].map(item => [item.slug, mergeByLocale(contentPhases, source => source.records[type]?.[item.slug])]))]));
const cropTranslations = Object.fromEntries(cropSource.records.map(item => [item.slug, mergeByLocale(cropPhases, source => source.records[item.slug])]));
const companyTranslations = mergeByLocale(corePhases, source => source.company);
const faqByGroup = Object.fromEntries(Object.keys(corePhases[0].faq).map(groupSlug => [groupSlug, mergeByLocale(corePhases, source => source.faq[groupSlug])]));
const homepageTranslations = {
  slides: Object.fromEntries(locales.map(locale => [locale, homepagePhases.flatMap(source => source.slides?.[locale] ?? [])])),
  featured: Object.fromEntries(locales.map(locale => [locale, homepagePhases.flatMap(source => source.featured?.[locale] ?? [])])),
};

process.env.CATALOG_SOURCE = "payload";
process.env.CROP_GUIDE_SOURCE = "payload";
process.env.NODE_ENV = process.env.NODE_ENV || "production";
const require = createRequire(import.meta.url);
const nextEnv = require("@next/env");
if (!nextEnv.default) nextEnv.default = nextEnv;
const { getPayload } = await import("payload");
const config = (await import(pathToFileURL(path.join(root, "src", "payload.config.ts")).href)).default;
const payload = await getPayload({ config });
const journal = { schemaVersion: 1, mode, target: process.env.TRANSLATION_BACKFILL_TARGET || "local", startedAt: new Date().toISOString(), locales, fills: [], unchanged: [], conflicts: [], missing: [], updates: [] };

const record = (bucket, item) => journal[bucket].push(item);
const planField = ({ scope, id, locale, field, current, expected }) => {
  if (!text(expected) && typeof expected !== "object") {
    record("missing", { scope, id, locale, field, reason: "translation source is empty" });
    return "missing";
  }
  if (text(current) === "" && text(expected) !== "") {
    record("fills", { scope, id, locale, field, before: current ?? null, after: expected });
    return "fill";
  }
  if ((field === "body" ? sameText(current, expected) : same(current, expected))) {
    record("unchanged", { scope, id, locale, field });
    return "unchanged";
  }
  record("conflicts", { scope, id, locale, field, current: current ?? null, expected });
  return "conflict";
};
const mustHave = (value, message) => { if (!value) throw new Error(message); return value; };

const canUpdate = async ({ collection, id, locale, data, checks }) => {
  if (!Object.keys(data).length) return false;
  if (!writeEnabled) return true;
  const latest = await payload.findByID({ collection, id, locale, fallbackLocale: false, depth: 0, overrideAccess: true });
  if (!latest) throw new Error(`Missing ${collection}/${id} during write recheck`);
  for (const check of checks) {
    const current = latest[check.field];
    if (!text(current) && !Array.isArray(current)) continue;
    if (!same(current, check.before)) throw new Error(`Concurrent change detected: ${collection}/${id}/${locale}/${check.field}`);
  }
  await payload.update({ collection, id, data, locale, overrideAccess: true });
  journal.updates.push({ collection, id, locale, fields: Object.keys(data) });
  return true;
};
const localizedDocs = async (collection, locale) => (await payload.find({ collection, locale, fallbackLocale: false, pagination: false, depth: 1, overrideAccess: true })).docs;

try {
  const categoryDocs = Object.fromEntries((await localizedDocs("categories", "en")).map(doc => [doc.slug, doc]));
  for (const category of flbook.categories) {
    const doc = mustHave(categoryDocs[category.slug], `Missing category ${category.slug}`);
    for (const locale of locales) {
      const current = (await localizedDocs("categories", locale)).find(item => item.id === doc.id);
      const expected = category.locales[locale];
      const decision = planField({ scope: "category", id: category.slug, locale, field: "name", current: current?.name, expected });
      if (decision === "fill") await canUpdate({ collection: "categories", id: doc.id, locale, data: { name: expected }, checks: [{ field: "name", before: current?.name ?? null }] });
    }
  }

  const productDocs = Object.fromEntries((await localizedDocs("products", "en")).map(doc => [doc.slug, doc]));
  for (const product of flbook.products) {
    const doc = mustHave(productDocs[product.slug], `Missing product ${product.slug}`);
    for (const locale of locales) {
      const current = (await localizedDocs("products", locale)).find(item => item.id === doc.id);
      const expected = mustHave(product.locales[locale], `Missing product translation ${product.slug}/${locale}`);
      const data = {};
      const checks = [];
      if (planField({ scope: "product", id: product.slug, locale, field: "name", current: current?.name, expected: expected.name }) === "fill") { data.name = expected.name; checks.push({ field: "name", before: current?.name ?? null }); }
      if (planField({ scope: "product", id: product.slug, locale, field: "intro", current: current?.intro, expected: expected.intro }) === "fill") { data.intro = expected.intro; checks.push({ field: "intro", before: current?.intro ?? null }); }
      const expectedSpecs = product.specifications.map(spec => {
        const { locales: localizedLabels, ...base } = spec;
        return { ...base, label: localizedLabels?.[locale] ?? base.label };
      });
      const currentSpecs = Array.isArray(current?.specifications) ? current.specifications : [];
      const mergedSpecs = expectedSpecs.map((spec, index) => {
        const currentSpec = currentSpecs[index] ?? {};
        const result = { ...currentSpec };
        const decision = planField({ scope: "product", id: product.slug, locale, field: `specifications[${index}].label`, current: currentSpec.label, expected: spec.label });
        if (decision === "fill") result.label = spec.label;
        return result;
      });
      if (currentSpecs.length === 0 && mergedSpecs.length > 0) { data.specifications = mergedSpecs; checks.push({ field: "specifications", before: currentSpecs }); }
      else if (mergedSpecs.some((spec, index) => !same(spec.label, currentSpecs[index]?.label))) { data.specifications = mergedSpecs; checks.push({ field: "specifications", before: currentSpecs }); }
      await canUpdate({ collection: "products", id: doc.id, locale, data, checks });
    }
  }

  for (const group of [{ key: "news", collection: "news", items: contentSource.records.news }, { key: "insights", collection: "insights", items: contentSource.records.insights }, { key: "cases", collection: "cases", items: contentSource.records.cases }]) {
    const docs = Object.fromEntries((await localizedDocs(group.collection, "en")).map(doc => [doc.slug, doc]));
    for (const item of group.items) {
      const doc = mustHave(docs[item.slug], `Missing ${group.key} ${item.slug}`);
      for (const locale of locales) {
        const current = (await localizedDocs(group.collection, locale)).find(candidate => candidate.id === doc.id);
        const expected = mustHave(contentTranslations[group.key][item.slug]?.[locale], `Missing ${group.key} translation ${item.slug}/${locale}`);
        const data = {}; const checks = [];
        for (const field of ["title", "summary", "body"]) if (planField({ scope: group.key, id: item.slug, locale, field, current: current?.[field], expected: expected[field] }) === "fill") { data[field] = expected[field]; checks.push({ field, before: current?.[field] ?? null }); }
        if (!current?.richBody && text(expected.body)) { data.richBody = plainTextToRichText(expected.body); checks.push({ field: "richBody", before: current?.richBody ?? null }); }
        if (group.key === "insights" && planField({ scope: group.key, id: item.slug, locale, field: "author", current: current?.author, expected: expected.author }) === "fill") { data.author = expected.author; checks.push({ field: "author", before: current?.author ?? null }); }
        await canUpdate({ collection: group.collection, id: doc.id, locale, data, checks });
      }
    }
  }

  const cropDocs = Object.fromEntries((await localizedDocs("crop-guides", "en")).map(doc => [doc.slug, doc]));
  for (const item of cropSource.records) {
    const doc = mustHave(cropDocs[item.slug], `Missing crop guide ${item.slug}`);
    for (const locale of locales) {
      const current = (await localizedDocs("crop-guides", locale)).find(candidate => candidate.id === doc.id);
      const expected = mustHave(cropTranslations[item.slug]?.[locale], `Missing crop translation ${item.slug}/${locale}`);
      const data = {}; const checks = [];
      for (const field of ["nav", "overview", "stages", "stagesText", "nutrition", "products", "browse", "resources", "resourcesText"]) if (planField({ scope: "crop-guide", id: item.slug, locale, field, current: current?.[field], expected: expected[field] }) === "fill") { data[field] = expected[field]; checks.push({ field, before: current?.[field] ?? null }); }
      const currentSections = Array.isArray(current?.sections) ? current.sections : [];
      const expectedSections = expected.sections.map((_title, index) => ({ ...(currentSections[index] ?? { key: `section-${index + 1}` }), title: currentSections[index]?.title ?? "" }));
      let sectionChanged = false;
      for (let index = 0; index < expectedSections.length; index++) {
        if (planField({ scope: "crop-guide", id: item.slug, locale, field: `sections[${index}].title`, current: currentSections[index]?.title, expected: expected.sections[index] }) === "fill") { expectedSections[index].title = expected.sections[index]; sectionChanged = true; }
      }
      if (sectionChanged) { data.sections = expectedSections; checks.push({ field: "sections", before: currentSections }); }
      await canUpdate({ collection: "crop-guides", id: doc.id, locale, data, checks });
    }
  }

  const faqGroupsEn = await localizedDocs("faq-groups", "en");
  const faqGroupsBySlug = Object.fromEntries(faqGroupsEn.map(group => [group.slug, group]));
  const faqsEn = await localizedDocs("faqs", "en");
  for (const seedGroup of faqSeeds) {
    const groupDoc = mustHave(faqGroupsBySlug[seedGroup.slug], `Missing FAQ group ${seedGroup.slug}`);
    for (const locale of locales) {
      const currentGroup = (await localizedDocs("faq-groups", locale)).find(item => item.id === groupDoc.id);
      const expectedGroup = mustHave(faqByGroup[seedGroup.slug]?.[locale], `Missing FAQ group translation ${seedGroup.slug}/${locale}`);
      const groupDecision = planField({ scope: "faq-group", id: seedGroup.slug, locale, field: "name", current: currentGroup?.name, expected: expectedGroup.name });
      if (groupDecision === "fill") await canUpdate({ collection: "faq-groups", id: groupDoc.id, locale, data: { name: expectedGroup.name }, checks: [{ field: "name", before: currentGroup?.name ?? null }] });
      const currentFaqs = await localizedDocs("faqs", locale);
      const englishFaqs = faqsEn.filter(item => item.group === groupDoc.id || item.group?.id === groupDoc.id).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      for (const seedQuestion of seedGroup.questions) {
        const faqDoc = mustHave(englishFaqs[seedGroup.questions.indexOf(seedQuestion)], `Missing FAQ ${seedGroup.slug}/${seedQuestion.slug}`);
        const current = currentFaqs.find(item => item.id === faqDoc.id);
        const expected = mustHave(expectedGroup.questions?.[seedQuestion.slug], `Missing FAQ translation ${seedGroup.slug}/${seedQuestion.slug}/${locale}`);
        const data = {}; const checks = [];
        if (planField({ scope: "faq", id: `${seedGroup.slug}/${seedQuestion.slug}`, locale, field: "question", current: current?.question, expected: expected.question }) === "fill") { data.question = expected.question; checks.push({ field: "question", before: current?.question ?? null }); }
        if (planField({ scope: "faq", id: `${seedGroup.slug}/${seedQuestion.slug}`, locale, field: "answer", current: current?.answer, expected: expected.answer }) === "fill") { data.answer = expected.answer; checks.push({ field: "answer", before: current?.answer ?? null }); }
        await canUpdate({ collection: "faqs", id: faqDoc.id, locale, data, checks });
      }
    }
  }

  const currentCompanyByLocale = Object.fromEntries(await Promise.all(locales.map(async locale => [locale, await payload.findGlobal({ slug: "company-profile", locale, fallbackLocale: false, depth: 0, overrideAccess: true })])));
  for (const locale of locales) {
    const current = currentCompanyByLocale[locale]; const expected = mustHave(companyTranslations[locale], `Missing company translation ${locale}`); const data = {}; const checks = [];
    for (const field of ["title", "summary", "description", "address"]) if (planField({ scope: "company-profile", id: "company-profile", locale, field, current: current?.[field], expected: expected[field] }) === "fill") { data[field] = expected[field]; checks.push({ field, before: current?.[field] ?? null }); }
    const currentAreas = Array.isArray(current?.focusAreas) ? current.focusAreas : [];
    const expectedAreas = (expected.focusAreas ?? []).map((area, index) => ({ ...(currentAreas[index] ?? {}), title: currentAreas[index]?.title ?? "", description: currentAreas[index]?.description ?? "" }));
    let areaChanged = false;
    for (let index = 0; index < expectedAreas.length; index++) {
      if (planField({ scope: "company-profile", id: "company-profile", locale, field: `focusAreas[${index}].title`, current: currentAreas[index]?.title, expected: expected.focusAreas[index].title }) === "fill") { expectedAreas[index].title = expected.focusAreas[index].title; areaChanged = true; }
      if (planField({ scope: "company-profile", id: "company-profile", locale, field: `focusAreas[${index}].description`, current: currentAreas[index]?.description, expected: expected.focusAreas[index].description }) === "fill") { expectedAreas[index].description = expected.focusAreas[index].description; areaChanged = true; }
    }
    if (areaChanged) { data.focusAreas = expectedAreas; checks.push({ field: "focusAreas", before: currentAreas }); }
    if (writeEnabled && Object.keys(data).length) {
      for (const check of checks) if (!same(current?.[check.field], check.before)) throw new Error(`Concurrent change detected: company-profile/${locale}/${check.field}`);
      await payload.updateGlobal({ slug: "company-profile", data, locale, overrideAccess: true });
      journal.updates.push({ global: "company-profile", locale, fields: Object.keys(data) });
    }
  }

  const currentHomepageByLocale = Object.fromEntries(await Promise.all(locales.map(async locale => [locale, await payload.findGlobal({ slug: "homepage", locale, fallbackLocale: false, depth: 0, overrideAccess: true })])));
  for (const locale of locales) {
    const current = currentHomepageByLocale[locale]; const data = {}; const checks = [];
    for (const kind of ["slides", "featured"]) {
      const expectedItems = homepageTranslations[kind][locale]; const currentItems = Array.isArray(current?.[kind]) ? current[kind] : [];
      const merged = expectedItems.map((expected, index) => ({ ...(currentItems[index] ?? {}), actionPath: currentItems[index]?.actionPath ?? expected.actionPath, image: currentItems[index]?.image ?? undefined }));
      let changed = false;
      const fields = kind === "slides" ? ["eyebrow", "title", "description", "actionLabel"] : ["title", "description", "actionLabel"];
      for (let index = 0; index < expectedItems.length; index++) for (const field of fields) if (planField({ scope: "homepage", id: `${kind}[${index}]`, locale, field, current: currentItems[index]?.[field], expected: expectedItems[index]?.[field] }) === "fill") { merged[index][field] = expectedItems[index][field]; changed = true; }
      if (changed) { data[kind] = merged; checks.push({ field: kind, before: currentItems }); }
    }
    if (writeEnabled && Object.keys(data).length) {
      for (const check of checks) if (!same(current?.[check.field], check.before)) throw new Error(`Concurrent change detected: homepage/${locale}/${check.field}`);
      await payload.updateGlobal({ slug: "homepage", data, locale, overrideAccess: true });
      journal.updates.push({ global: "homepage", locale, fields: Object.keys(data) });
    }
  }

  journal.finishedAt = new Date().toISOString();
  journal.ok = journal.missing.length === 0;
  journal.summary = { locales: locales.length, fills: journal.fills.length, unchanged: journal.unchanged.length, conflicts: journal.conflicts.length, missing: journal.missing.length, updates: journal.updates.length };
  const output = process.env.TRANSLATION_BACKFILL_JOURNAL || path.join(root, ".local", `translation-backfill-${mode}-${Date.now()}.json`);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(journal, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ ...journal.summary, ok: journal.ok, mode, journalPath: output }, null, 2));
  if (!journal.ok) process.exitCode = 2;
} finally {
  if (payload?.destroy) await payload.destroy();
}
