import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-localizations-phase3.json"), "utf8"));
const locales = ["nl", "ro", "el", "he"];
const fields = ["nav", "overview", "stages", "stagesText", "nutrition", "products", "browse", "resources", "resourcesText"];

test("crop guide phase-three translations cover all fields for three guides", () => {
  assert.deepEqual(phase3.locales, locales);
  for (const record of source.records) for (const locale of locales) {
    const translated = phase3.records[record.slug]?.[locale];
    assert.equal(translated.sections.length, 5);
    for (const field of fields) assert.ok(typeof translated[field] === "string" && translated[field].trim(), `${record.slug}/${locale}/${field}`);
    for (const section of translated.sections) assert.ok(section.trim());
    if (locale === "he") assert.doesNotMatch(JSON.stringify(translated), /<[^>]+>|\bdir(?:ection)?\b/i);
  }
});

test("crop guide phase-three translations preserve source and RTL safety boundaries", () => {
  assert.equal(phase3.schemaVersion, 1);
  assert.equal(phase3.reviewStatus, "approved");
  assert.equal(phase3.source.kind, "authorized-example");
  assert.deepEqual(phase3.source.locales, ["en", "zh"]);
  assert.match(phase3.source.note, /crop-guide-staging\.json/);
  assert.equal(phase3.dir, undefined);
  assert.equal(phase3.direction, undefined);
  for (const record of source.records) for (const locale of locales) {
    const translated = phase3.records[record.slug][locale];
    assert.equal(translated.slug, undefined);
    assert.equal(translated.status, undefined);
    assert.equal(translated.reviewStatus, undefined);
    assert.doesNotMatch(JSON.stringify(translated), /claimsVerified|kg\/ha|施肥量/i);
  }
});
