import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const phase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-localizations-phase1.json"), "utf8"));
const phase2 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-localizations-phase2.json"), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-localizations-phase3.json"), "utf8"));
const phase1Locales = ["es", "fr", "pt", "ru"];
const phase2Locales = ["it", "tr", "th"];
const phase3Locales = ["nl", "ro", "el", "he"];
const locales = [...phase1Locales, ...phase2Locales, ...phase3Locales];
const fields = ["nav", "overview", "stages", "stagesText", "nutrition", "products", "browse", "resources", "resourcesText"];
const configuredLocales = ["en", "zh", "es", "fr", "pt", "ru", "it", "tr", "th", "nl", "ro", "el", "he"];
const errors = [];

for (const [name, phase, expectedLocales] of [["phase1", phase1, phase1Locales], ["phase2", phase2, phase2Locales], ["phase3", phase3, phase3Locales]]) {
  if (phase.schemaVersion !== 1) errors.push(`${name}.schemaVersion must be 1`);
  if (phase.reviewStatus !== "approved") errors.push(`${name}.reviewStatus must be approved`);
  if (phase.source?.kind !== "authorized-example") errors.push(`${name}.source.kind must be authorized-example`);
  if (JSON.stringify(phase.source?.locales) !== JSON.stringify(["en", "zh"])) errors.push(`${name}.source.locales must declare en and zh`);
  if (!phase.source?.note?.includes("crop-guide-staging.json")) errors.push(`${name}.source.note must identify crop-guide-staging.json`);
  if (JSON.stringify(phase.locales) !== JSON.stringify(expectedLocales)) errors.push(`${name}.locales mismatch`);
}
for (const record of source.records) for (const locale of locales) {
  const localized = { ...(phase1.records?.[record.slug]?.[locale] ?? {}), ...(phase2.records?.[record.slug]?.[locale] ?? {}), ...(phase3.records?.[record.slug]?.[locale] ?? {}) };
  if (!localized || !Array.isArray(localized.sections) || localized.sections.length !== 5) errors.push(`${record.slug}/${locale} requires five sections`);
  for (const field of fields) if (typeof localized?.[field] !== "string" || !localized[field].trim()) errors.push(`${record.slug}/${locale}/${field} is required`);
  for (const key of ["slug", "status", "reviewStatus", "claimsVerified"]) if (localized?.[key] !== undefined) errors.push(`${record.slug}/${locale} must not redefine ${key}`);
  if (locale === "he" && /<[^>]+>|\bdir(?:ection)?\b/i.test(JSON.stringify(localized))) errors.push(`${record.slug}/he must contain text only; RTL belongs to the locale shell`);
}
const missingLocales = configuredLocales.filter(locale => !["en", "zh", ...locales].includes(locale));
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors, authoredLocales: ["en", "zh", ...locales], missingLocales }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, authoredLocales: ["en", "zh", ...locales], missingLocales, records: source.records.length }, null, 2));
}
