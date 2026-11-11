import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staging = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-staging.json"), "utf8"));
const phase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-localizations-phase1.json"), "utf8"));
const locales = ["es", "fr", "pt", "ru"];

test("homepage phase-one translations cover six entries for Spanish, French, Portuguese and Russian", () => {
  assert.deepEqual(phase1.locales, locales);
  for (const locale of locales) {
    assert.equal(phase1.slides[locale].length, 3);
    assert.equal(phase1.featured[locale].length, 3);
    for (const [index, row] of phase1.slides[locale].entries()) {
      for (const field of ["eyebrow", "title", "description", "actionLabel"]) assert.ok(row[field]?.trim(), `${locale}.slides[${index}].${field}`);
      assert.equal(row.actionPath, staging.slides.en[index].actionPath);
      assert.equal(row.imageKey, staging.slides.en[index].imageKey);
      assert.notEqual(row.title, staging.slides.en[index].title);
    }
    for (const [index, row] of phase1.featured[locale].entries()) {
      for (const field of ["title", "description", "actionLabel"]) assert.ok(row[field]?.trim(), `${locale}.featured[${index}].${field}`);
      assert.equal(row.actionPath, staging.featured.en[index].actionPath);
      assert.equal(row.imageKey, staging.featured.en[index].imageKey);
      assert.notEqual(row.title, staging.featured.en[index].title);
    }
  }
});

test("homepage phase-one translations preserve source and review boundaries", () => {
  assert.equal(phase1.schemaVersion, 1);
  assert.equal(phase1.reviewStatus, "approved");
  assert.equal(phase1.source.kind, "authorized-example");
  assert.deepEqual(phase1.source.locales, ["en", "zh"]);
  assert.match(phase1.source.note, /AI|Codex|source|review/i);
  for (const locale of locales) {
    for (const row of [...phase1.slides[locale], ...phase1.featured[locale]]) {
      assert.equal(typeof row.actionPath, "string");
      assert.equal(typeof row.imageKey, "string");
      assert.equal(row.reviewStatus, undefined);
      assert.equal(row.claimsVerified, undefined);
    }
  }
});
