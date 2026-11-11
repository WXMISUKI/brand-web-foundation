import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-staging.json"), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "content-localizations-phase3.json"), "utf8"));
const locales = ["nl", "ro", "el", "he"];

test("content phase-three translations cover all nine records for Dutch, Romanian, Greek and Hebrew", () => {
  assert.deepEqual(phase3.locales, locales);
  for (const type of ["news", "insights", "cases"]) {
    assert.equal(Object.keys(phase3.records[type]).length, source.records[type].length);
    for (const record of source.records[type]) for (const locale of locales) {
      const translated = phase3.records[type][record.slug]?.[locale];
      assert.ok(translated?.title?.trim(), `${type}/${record.slug}/${locale} title`);
      assert.ok(translated?.summary?.trim(), `${type}/${record.slug}/${locale} summary`);
      assert.ok(translated?.body?.trim(), `${type}/${record.slug}/${locale} body`);
      if (type === "insights") assert.ok(translated.author?.trim(), `${type}/${record.slug}/${locale} author`);
      if (locale === "he") assert.doesNotMatch(JSON.stringify(translated), /<[^>]+>|\bdir(?:ection)?\b/i);
    }
  }
});

test("content phase-three translations preserve metadata and RTL review boundary", () => {
  assert.equal(phase3.schemaVersion, 1);
  assert.equal(phase3.reviewStatus, "approved");
  assert.equal(phase3.source.kind, "authorized-example");
  assert.deepEqual(phase3.source.locales, ["en", "zh"]);
  assert.match(phase3.source.note, /content-staging\.json/);
  assert.equal(phase3.dir, undefined);
  assert.equal(phase3.direction, undefined);
  for (const type of ["news", "insights", "cases"]) for (const record of source.records[type]) for (const locale of locales) {
    const translated = phase3.records[type][record.slug][locale];
    for (const key of ["slug", "kind", "topics", "publishedOn", "image", "assetStatus", "claimsVerified"]) assert.equal(translated[key], undefined);
  }
});
