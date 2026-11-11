import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const phase2 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-localizations-phase2.json"), "utf8"));
const locales = ["it", "tr", "th"];

test("content phase-two translations cover all nine records for Italian, Turkish and Thai", () => {
  assert.deepEqual(phase2.locales, locales);
  for (const type of ["news", "insights", "cases"]) {
    assert.equal(Object.keys(phase2.records[type]).length, source.records[type].length);
    for (const record of source.records[type]) for (const locale of locales) {
      const translated = phase2.records[type][record.slug]?.[locale];
      assert.ok(translated?.title?.trim(), `${type}/${record.slug}/${locale} title`);
      assert.ok(translated?.summary?.trim(), `${type}/${record.slug}/${locale} summary`);
      assert.ok(translated?.body?.trim(), `${type}/${record.slug}/${locale} body`);
      if (type === "insights") assert.ok(translated.author?.trim(), `${type}/${record.slug}/${locale} author`);
    }
  }
});

test("content phase-two translations preserve metadata and review boundaries", () => {
  assert.equal(phase2.schemaVersion, 1);
  assert.equal(phase2.reviewStatus, "approved");
  assert.equal(phase2.source.kind, "authorized-example");
  assert.deepEqual(phase2.source.locales, ["en", "zh"]);
  assert.match(phase2.source.note, /content-staging\.json/);
  for (const type of ["news", "insights", "cases"]) for (const record of source.records[type]) for (const locale of locales) {
    const translated = phase2.records[type][record.slug][locale];
    for (const key of ["slug", "kind", "topics", "publishedOn", "image", "assetStatus", "claimsVerified"]) assert.equal(translated[key], undefined);
  }
});
