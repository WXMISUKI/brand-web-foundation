import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const errors = [];
if (source.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (!["owner-review", "approved"].includes(source.reviewStatus)) errors.push("reviewStatus must be owner-review or approved");
if (!Array.isArray(source.records) || source.records.length !== 3) errors.push("expected three representative crop guides");
for (const [index, record] of (source.records ?? []).entries()) {
  const prefix = `records[${index}]`;
  if (!record.slug) errors.push(`${prefix}.slug is required`);
  for (const locale of ["en", "zh"]) {
    const item = record.locales?.[locale];
    if (!item) { errors.push(`${prefix}.locales.${locale} is required`); continue; }
    if (!Array.isArray(item.sections) || item.sections.length !== 5) errors.push(`${prefix}.locales.${locale}.sections must contain five labels`);
    for (const field of ["nav", "overview", "stages", "stagesText", "nutrition", "products", "browse", "resources", "resourcesText"]) {
      if (typeof item[field] !== "string" || !item[field].trim()) errors.push(`${prefix}.locales.${locale}.${field} is required`);
    }
  }
}
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, records: source.records.length, locales: ["en", "zh"], status: source.reviewStatus }, null, 2));
}
