import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase4 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase4-th.json", import.meta.url), "utf8"));

test("Thai phase-four FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase4.locales, ["th"]);
  assert.equal(Object.keys(phase4.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase4.products[product.slug]?.th;
    assert.ok(localized?.name && localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase4.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase4.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
  assert.deepEqual(Object.keys(phase4.categoryNames).sort(), ["compound", "medium-elements", "water-soluble"]);
});

test("Thai phase-four translations keep the source review boundary", () => {
  for (const localized of Object.values(phase4.products).map(product => product.th)) {
    assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
  }
});
