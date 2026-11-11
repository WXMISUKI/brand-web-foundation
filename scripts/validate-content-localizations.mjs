import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const phase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-localizations-phase1.json"), "utf8"));
const phase2 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-localizations-phase2.json"), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-localizations-phase3.json"), "utf8"));
const phase1Locales = ["es", "fr", "pt", "ru"];
const phase2Locales = ["it", "tr", "th"];
const phase3Locales = ["nl", "ro", "el", "he"];
const locales = [...phase1Locales, ...phase2Locales, ...phase3Locales];
const configuredLocales = ["en", "zh", "es", "fr", "pt", "ru", "it", "tr", "th", "nl", "ro", "el", "he"];
const errors = [];

for (const [name, phase, expectedLocales] of [["phase1", phase1, phase1Locales], ["phase2", phase2, phase2Locales], ["phase3", phase3, phase3Locales]]) {
  if (phase.schemaVersion !== 1) errors.push(`${name}.schemaVersion must be 1`);
  if (phase.reviewStatus !== "approved") errors.push(`${name}.reviewStatus must be approved`);
  if (phase.source?.kind !== "authorized-example") errors.push(`${name}.source.kind must be authorized-example`);
  if (JSON.stringify(phase.source?.locales) !== JSON.stringify(["en", "zh"])) errors.push(`${name}.source.locales must declare en and zh`);
  if (!phase.source?.note?.includes("content-staging.json")) errors.push(`${name}.source.note must identify content-staging.json`);
  if (JSON.stringify(phase.locales) !== JSON.stringify(expectedLocales)) errors.push(`${name}.locales mismatch`);
}

for (const type of ["news", "insights", "cases"]) {
  const records = source.records?.[type] ?? [];
  const localizedRecords = Object.fromEntries(records.map(record => [record.slug, { ...(phase1.records?.[type]?.[record.slug] ?? {}), ...(phase2.records?.[type]?.[record.slug] ?? {}), ...(phase3.records?.[type]?.[record.slug] ?? {}) }]));
  if (Object.keys(localizedRecords).length !== records.length) errors.push(`${type} localization count must match staging`);
  for (const record of records) for (const locale of locales) {
    const localized = localizedRecords[record.slug]?.[locale];
    if (!localized?.title?.trim() || !localized.summary?.trim() || !localized.body?.trim()) errors.push(`${type}/${record.slug}/${locale} requires title, summary and body`);
    if (type === "insights" && !localized?.author?.trim()) errors.push(`${type}/${record.slug}/${locale} requires author`);
    if (locale === "he" && /<[^>]+>|\bdir(?:ection)?\b/i.test(JSON.stringify(localized))) errors.push(`${type}/${record.slug}/he must contain text only; RTL belongs to the locale shell`);
    for (const key of ["slug", "kind", "topics", "publishedOn", "image", "assetStatus", "claimsVerified"]) if (localized && localized[key] !== undefined) errors.push(`${type}/${record.slug}/${locale} must not redefine ${key}`);
  }
}

const missingLocales = configuredLocales.filter(locale => !["en", "zh", ...locales].includes(locale));
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors, authoredLocales: ["en", "zh", ...locales], missingLocales }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, authoredLocales: ["en", "zh", ...locales], missingLocales, counts: { news: 3, insights: 3, cases: 3 } }, null, 2));
}
