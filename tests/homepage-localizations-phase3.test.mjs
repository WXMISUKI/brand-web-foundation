import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staging = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-staging.json"), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-localizations-phase3.json"), "utf8"));
const locales = ["nl", "ro", "el", "he"];

test("homepage phase-three translations cover six entries for Dutch, Romanian, Greek and Hebrew", () => {
  assert.deepEqual(phase3.locales, locales);
  for (const locale of locales) {
    assert.equal(phase3.slides[locale].length, 3);
    assert.equal(phase3.featured[locale].length, 3);
    for (const [index, row] of phase3.slides[locale].entries()) {
      for (const field of ["eyebrow", "title", "description", "actionLabel"]) assert.ok(row[field]?.trim(), `${locale}.slides[${index}].${field}`);
      assert.equal(row.actionPath, staging.slides.en[index].actionPath);
      assert.equal(row.imageKey, staging.slides.en[index].imageKey);
      assert.notEqual(row.title, staging.slides.en[index].title);
    }
    for (const [index, row] of phase3.featured[locale].entries()) {
      for (const field of ["title", "description", "actionLabel"]) assert.ok(row[field]?.trim(), `${locale}.featured[${index}].${field}`);
      assert.equal(row.actionPath, staging.featured.en[index].actionPath);
      assert.equal(row.imageKey, staging.featured.en[index].imageKey);
      assert.notEqual(row.title, staging.featured.en[index].title);
    }
  }
});

test("homepage phase-three translations preserve source and review boundaries", () => {
  assert.equal(phase3.schemaVersion, 1);
  assert.equal(phase3.reviewStatus, "approved");
  assert.equal(phase3.source.kind, "authorized-example");
  assert.deepEqual(phase3.source.locales, ["en", "zh"]);
  assert.match(phase3.source.note, /homepage-staging\.json/);
  assert.equal(phase3.dir, undefined);
  assert.equal(phase3.direction, undefined);
  for (const locale of locales) for (const row of [...phase3.slides[locale], ...phase3.featured[locale]]) {
    assert.equal(row.reviewStatus, undefined);
    assert.equal(row.claimsVerified, undefined);
    if (locale === "he") assert.doesNotMatch(JSON.stringify(row), /<[^>]+>/);
  }
});
