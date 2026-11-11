import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-staging.json"), "utf8"));
const phase2 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "crop-guide-localizations-phase2.json"), "utf8"));
const locales = ["it", "tr", "th"];
const fields = ["nav", "overview", "stages", "stagesText", "nutrition", "products", "browse", "resources", "resourcesText"];

test("crop guide phase-two translations cover all fields for three guides", () => {
  assert.deepEqual(phase2.locales, locales);
  for (const record of source.records) for (const locale of locales) {
    const translated = phase2.records[record.slug]?.[locale];
    assert.equal(translated.sections.length, 5);
    for (const field of fields) assert.ok(typeof translated[field] === "string" && translated[field].trim(), `${record.slug}/${locale}/${field}`);
    for (const section of translated.sections) assert.ok(section.trim());
  }
});

test("crop guide phase-two translations preserve source, section and safety boundaries", () => {
  assert.equal(phase2.schemaVersion, 1);
  assert.equal(phase2.reviewStatus, "approved");
  assert.equal(phase2.source.kind, "authorized-example");
  assert.deepEqual(phase2.source.locales, ["en", "zh"]);
  assert.match(phase2.source.note, /crop-guide-staging\.json/);
  for (const record of source.records) for (const locale of locales) {
    const translated = phase2.records[record.slug][locale];
    assert.equal(translated.slug, undefined);
    assert.equal(translated.status, undefined);
    assert.equal(translated.reviewStatus, undefined);
    assert.doesNotMatch(JSON.stringify(translated), /claimsVerified|kg\/ha|施肥量/i);
  }
});
