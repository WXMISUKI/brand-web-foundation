import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const errors = [];
if (source.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (!["owner-review", "approved"].includes(source.reviewStatus)) errors.push("reviewStatus must be owner-review or approved");
for (const type of ["news", "insights", "cases"]) {
  const records = source.records?.[type];
  if (!Array.isArray(records) || records.length !== 3) errors.push(`${type} must contain three staging records`);
  const slugs = new Set();
  for (const [index, record] of (records ?? []).entries()) {
    if (!record.slug || slugs.has(record.slug)) errors.push(`${type}[${index}].slug must be unique`);
    slugs.add(record.slug);
    if (type === "news" && !["news", "event"].includes(record.kind)) errors.push(`${type}[${index}].kind must be news or event`);
    if (!record.locales?.en?.title || !record.locales?.zh?.title) errors.push(`${type}[${index}] requires en and zh titles`);
    if (!record.locales?.en?.body || !record.locales?.zh?.body) errors.push(`${type}[${index}] requires en and zh body text for rich-text staging`);
    if (type === "insights" && (!Array.isArray(record.topics) || record.topics.length === 0 || record.topics.some(topic => typeof topic !== "string" || !topic.trim()))) errors.push(`${type}[${index}].topics must contain at least one topic slug`);
    if (!record.image?.startsWith("/images/")) errors.push(`${type}[${index}].image must use a local public asset`);
    if (!["generated-placeholder", "owner-supplied", "authorized-example", "pending"].includes(record.assetStatus)) errors.push(`${type}[${index}].assetStatus is invalid`);
    if (!fs.existsSync(path.join(root, "public", record.image.slice(1)))) errors.push(`${type}[${index}] image is missing: ${record.image}`);
  }
}
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, reviewStatus: source.reviewStatus, counts: Object.fromEntries(Object.entries(source.records).map(([key, value]) => [key, value.length])) }, null, 2));
}
