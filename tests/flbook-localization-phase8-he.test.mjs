import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase8 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase8-he.json", import.meta.url), "utf8"));

test("Hebrew phase-eight FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase8.locales, ["he"]);
  assert.equal(Object.keys(phase8.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase8.products[product.slug]?.he;
    assert.ok(localized?.name && localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase8.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase8.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
  assert.deepEqual(Object.keys(phase8.categoryNames).sort(), ["compound", "medium-elements", "water-soluble"]);
});

test("Hebrew phase-eight translations keep review and RTL content boundaries", () => {
  for (const localized of Object.values(phase8.products).map(product => product.he)) {
    assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
    assert.equal(typeof localized.name, "string");
    assert.equal(typeof localized.intro, "string");
    assert.doesNotMatch(`${localized.name}${localized.intro}`, /<[^>]+>/);
  }
  assert.equal(phase8.dir, undefined);
  assert.equal(phase8.direction, undefined);
});
