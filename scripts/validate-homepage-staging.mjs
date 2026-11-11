import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "src", "data", "homepage-staging.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const phase1Path = path.join(root, "src", "data", "homepage-localizations-phase1.json");
const phase1 = JSON.parse(fs.readFileSync(phase1Path, "utf8"));
const phase2Path = path.join(root, "src", "data", "homepage-localizations-phase2.json");
const phase2 = JSON.parse(fs.readFileSync(phase2Path, "utf8"));
const phase3Path = path.join(root, "src", "data", "homepage-localizations-phase3.json");
const phase3 = JSON.parse(fs.readFileSync(phase3Path, "utf8"));
const errors = [];
const requiredLocales = ["en", "zh"];
const localizedLocales = ["es", "fr", "pt", "ru"];
const phase2Locales = ["it", "tr", "th"];
const phase3Locales = ["nl", "ro", "el", "he"];
const configuredLocales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];
const mediaKeys = new Set((source.media ?? []).map(item => item?.key).filter(Boolean));
const requiredPath = value => typeof value === "string" && /^\/(?!\/)[^?#\s]+/.test(value) && !value.includes("//") && !/^\/(?:en|zh|he|nl|fr|it|es|pt|el|ro|ru|th|tr)(?:\/|$)/.test(value);
const checkLocaleRows = (kind, rows, locales = requiredLocales) => {
  for (const locale of locales) {
    if (!Array.isArray(rows?.[locale]) || rows[locale].length !== 3) errors.push(`${kind}.${locale} must contain exactly three rows`);
    for (const [index, row] of (rows?.[locale] ?? []).entries()) {
      for (const field of kind === "slides" ? ["eyebrow", "title", "description", "actionLabel"] : ["title", "description", "actionLabel"]) {
        if (typeof row?.[field] !== "string" || !row[field].trim()) errors.push(`${kind}.${locale}[${index}].${field} is required`);
      }
      if (!requiredPath(row?.actionPath)) errors.push(`${kind}.${locale}[${index}].actionPath must be a locale-free site-relative path`);
      if (!mediaKeys.has(row?.imageKey)) errors.push(`${kind}.${locale}[${index}].imageKey is unknown`);
    }
  }
};

if (source.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (source.reviewStatus !== "approved") errors.push("reviewStatus must be approved");
if (source.source?.kind !== "authorized-example") errors.push("source.kind must be authorized-example");
if (JSON.stringify(source.source?.locales) !== JSON.stringify(requiredLocales)) errors.push("source.locales must declare en and zh only");
if (!source.source?.note?.includes("Only en and zh are authored")) errors.push("source.note must declare missing locale boundary");
if (!Array.isArray(source.media) || source.media.length < 3) errors.push("media must contain homepage media");
for (const [index, item] of (source.media ?? []).entries()) {
  if (!item?.key || !item?.path || !item.path.startsWith("public/")) errors.push(`media[${index}] requires a public path and key`);
  if (!fs.existsSync(path.join(root, item.path))) errors.push(`media[${index}] file is missing: ${item.path}`);
  for (const locale of requiredLocales) if (typeof item?.alt?.[locale] !== "string" || !item.alt[locale].trim()) errors.push(`media[${index}].alt.${locale} is required`);
  if (item?.assetStatus !== "authorized-example") errors.push(`media[${index}].assetStatus must be authorized-example`);
}
checkLocaleRows("slides", source.slides);
checkLocaleRows("featured", source.featured);
if (phase1.schemaVersion !== 1) errors.push("phase1.schemaVersion must be 1");
if (phase1.reviewStatus !== "approved") errors.push("phase1.reviewStatus must be approved");
if (phase1.source?.kind !== "authorized-example") errors.push("phase1.source.kind must be authorized-example");
if (JSON.stringify(phase1.source?.locales) !== JSON.stringify(requiredLocales)) errors.push("phase1.source.locales must declare en and zh source locales");
if (!phase1.source?.note?.includes("existing homepage-staging.json")) errors.push("phase1.source.note must identify homepage-staging.json as the source");
if (JSON.stringify(phase1.locales) !== JSON.stringify(localizedLocales)) errors.push("phase1.locales must declare es, fr, pt and ru");
checkLocaleRows("phase1.slides", phase1.slides, localizedLocales);
checkLocaleRows("phase1.featured", phase1.featured, localizedLocales);
for (const locale of localizedLocales) {
  for (const [index, row] of (phase1.slides[locale] ?? []).entries()) {
    if (row.actionPath !== source.slides.en[index]?.actionPath || row.imageKey !== source.slides.en[index]?.imageKey) errors.push(`phase1.slides.${locale}[${index}] must preserve actionPath and imageKey`);
  }
  for (const [index, row] of (phase1.featured[locale] ?? []).entries()) {
    if (row.actionPath !== source.featured.en[index]?.actionPath || row.imageKey !== source.featured.en[index]?.imageKey) errors.push(`phase1.featured.${locale}[${index}] must preserve actionPath and imageKey`);
  }
}
if (phase2.schemaVersion !== 1) errors.push("phase2.schemaVersion must be 1");
if (phase2.reviewStatus !== "approved") errors.push("phase2.reviewStatus must be approved");
if (phase2.source?.kind !== "authorized-example") errors.push("phase2.source.kind must be authorized-example");
if (JSON.stringify(phase2.source?.locales) !== JSON.stringify(requiredLocales)) errors.push("phase2.source.locales must declare en and zh source locales");
if (!phase2.source?.note?.includes("existing homepage-staging.json")) errors.push("phase2.source.note must identify homepage-staging.json as the source");
if (JSON.stringify(phase2.locales) !== JSON.stringify(phase2Locales)) errors.push("phase2.locales must declare it, tr and th");
checkLocaleRows("phase2.slides", phase2.slides, phase2Locales);
checkLocaleRows("phase2.featured", phase2.featured, phase2Locales);
for (const locale of phase2Locales) {
  for (const [index, row] of (phase2.slides[locale] ?? []).entries()) {
    if (row.actionPath !== source.slides.en[index]?.actionPath || row.imageKey !== source.slides.en[index]?.imageKey) errors.push(`phase2.slides.${locale}[${index}] must preserve actionPath and imageKey`);
  }
  for (const [index, row] of (phase2.featured[locale] ?? []).entries()) {
    if (row.actionPath !== source.featured.en[index]?.actionPath || row.imageKey !== source.featured.en[index]?.imageKey) errors.push(`phase2.featured.${locale}[${index}] must preserve actionPath and imageKey`);
  }
}
if (phase3.schemaVersion !== 1) errors.push("phase3.schemaVersion must be 1");
if (phase3.reviewStatus !== "approved") errors.push("phase3.reviewStatus must be approved");
if (phase3.source?.kind !== "authorized-example") errors.push("phase3.source.kind must be authorized-example");
if (JSON.stringify(phase3.source?.locales) !== JSON.stringify(requiredLocales)) errors.push("phase3.source.locales must declare en and zh source locales");
if (!phase3.source?.note?.includes("existing homepage-staging.json")) errors.push("phase3.source.note must identify homepage-staging.json as the source");
if (JSON.stringify(phase3.locales) !== JSON.stringify(phase3Locales)) errors.push("phase3.locales must declare nl, ro, el and he");
if (phase3.dir !== undefined || phase3.direction !== undefined) errors.push("phase3 must keep RTL direction in the locale shell");
checkLocaleRows("phase3.slides", phase3.slides, phase3Locales);
checkLocaleRows("phase3.featured", phase3.featured, phase3Locales);
for (const locale of phase3Locales) {
  for (const [index, row] of (phase3.slides[locale] ?? []).entries()) {
    if (row.actionPath !== source.slides.en[index]?.actionPath || row.imageKey !== source.slides.en[index]?.imageKey) errors.push(`phase3.slides.${locale}[${index}] must preserve actionPath and imageKey`);
    if (locale === "he" && /<[^>]+>/.test(JSON.stringify(row))) errors.push(`phase3.slides.he[${index}] must not contain HTML`);
  }
  for (const [index, row] of (phase3.featured[locale] ?? []).entries()) {
    if (row.actionPath !== source.featured.en[index]?.actionPath || row.imageKey !== source.featured.en[index]?.imageKey) errors.push(`phase3.featured.${locale}[${index}] must preserve actionPath and imageKey`);
    if (locale === "he" && /<[^>]+>/.test(JSON.stringify(row))) errors.push(`phase3.featured.he[${index}] must not contain HTML`);
  }
}
const authoredLocalizedLocales = [...localizedLocales, ...phase2Locales, ...phase3Locales];
const missingLocales = configuredLocales.filter(locale => !requiredLocales.includes(locale) && !authoredLocalizedLocales.includes(locale));
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors, authoredLocales: [...requiredLocales, ...authoredLocalizedLocales], missingLocales }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, reviewStatus: source.reviewStatus, authoredLocales: [...requiredLocales, ...authoredLocalizedLocales], missingLocales, slides: 3, featured: 3, media: source.media.length }, null, 2));
}
