import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "homepage-staging.json"), "utf8"));

test("homepage staging keeps the approved en/zh contract", () => {
  assert.equal(source.schemaVersion, 1);
  assert.equal(source.reviewStatus, "approved");
  assert.deepEqual(source.source.locales, ["en", "zh"]);
  assert.equal(source.slides.en.length, 3);
  assert.equal(source.slides.zh.length, 3);
  assert.equal(source.featured.en.length, 3);
  assert.equal(source.featured.zh.length, 3);
});

test("homepage paths are locale-free and media keys resolve", () => {
  const mediaKeys = new Set(source.media.map(item => item.key));
  for (const group of [source.slides, source.featured]) for (const locale of ["en", "zh"]) for (const row of group[locale]) {
    assert.match(row.actionPath, /^\/(?!\/)/);
    assert.doesNotMatch(row.actionPath, /^\/(?:en|zh|he|nl|fr|it|es|pt|el|ro|ru|th|tr)(?:\/|$)/);
    assert.ok(mediaKeys.has(row.imageKey));
  }
});

test("homepage staging declares untranslated locales instead of pretending coverage", () => {
  assert.match(source.source.note, /Only en and zh are authored/);
  assert.deepEqual(Object.keys(source.slides).sort(), ["en", "zh"]);
  assert.deepEqual(Object.keys(source.featured).sort(), ["en", "zh"]);
  for (const item of source.media) for (const locale of ["en", "zh"]) assert.ok(item.alt[locale]);
});
