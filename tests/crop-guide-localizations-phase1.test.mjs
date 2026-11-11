import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const phase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-localizations-phase1.json"), "utf8"));
const locales = ["es", "fr", "pt", "ru"];
const fields = ["nav", "overview", "stages", "stagesText", "nutrition", "products", "browse", "resources", "resourcesText"];

test("crop guide phase-one translations cover all fields for three guides", () => {
  assert.deepEqual(phase1.locales, locales);
  for (const record of source.records) for (const locale of locales) {
    const translated = phase1.records[record.slug]?.[locale];
    assert.equal(translated.sections.length, 5);
    for (const field of fields) assert.ok(typeof translated[field] === "string" && translated[field].trim(), `${record.slug}/${locale}/${field}`);
    for (const section of translated.sections) assert.ok(section.trim());
  }
});

test("crop guide phase-one translations preserve source, section and safety boundaries", () => {
  assert.equal(phase1.schemaVersion, 1);
  assert.equal(phase1.reviewStatus, "approved");
  assert.equal(phase1.source.kind, "authorized-example");
  assert.deepEqual(phase1.source.locales, ["en", "zh"]);
  assert.match(phase1.source.note, /crop-guide-staging\.json/);
  for (const record of source.records) for (const locale of locales) {
    const translated = phase1.records[record.slug][locale];
    assert.equal(translated.slug, undefined);
    assert.equal(translated.status, undefined);
    assert.equal(translated.reviewStatus, undefined);
    assert.doesNotMatch(JSON.stringify(translated), /claimsVerified|kg\/ha|施肥量/i);
  }
});
