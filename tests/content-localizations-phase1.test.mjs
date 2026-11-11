import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const phase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-localizations-phase1.json"), "utf8"));
const locales = ["es", "fr", "pt", "ru"];

test("content phase-one translations cover all nine news, insights and cases records", () => {
  assert.deepEqual(phase1.locales, locales);
  for (const type of ["news", "insights", "cases"]) {
    assert.equal(Object.keys(phase1.records[type]).length, source.records[type].length);
    for (const record of source.records[type]) for (const locale of locales) {
      const translated = phase1.records[type][record.slug]?.[locale];
      assert.ok(translated?.title?.trim(), `${type}/${record.slug}/${locale} title`);
      assert.ok(translated?.summary?.trim(), `${type}/${record.slug}/${locale} summary`);
      assert.ok(translated?.body?.trim(), `${type}/${record.slug}/${locale} body`);
      if (type === "insights") assert.ok(translated.author?.trim(), `${type}/${record.slug}/${locale} author`);
    }
  }
});

test("content phase-one translations preserve metadata and review boundaries", () => {
  assert.equal(phase1.schemaVersion, 1);
  assert.equal(phase1.reviewStatus, "approved");
  assert.equal(phase1.source.kind, "authorized-example");
  assert.deepEqual(phase1.source.locales, ["en", "zh"]);
  assert.match(phase1.source.note, /content-staging\.json/);
  for (const type of ["news", "insights", "cases"]) for (const record of source.records[type]) for (const locale of locales) {
    const translated = phase1.records[type][record.slug][locale];
    assert.equal(translated.slug, undefined);
    assert.equal(translated.kind, undefined);
    assert.equal(translated.topics, undefined);
    assert.equal(translated.publishedOn, undefined);
    assert.equal(translated.image, undefined);
    assert.equal(translated.assetStatus, undefined);
    assert.equal(translated.claimsVerified, undefined);
  }
});
