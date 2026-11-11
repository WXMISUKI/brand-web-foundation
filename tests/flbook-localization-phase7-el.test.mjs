import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase7 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase7-el.json", import.meta.url), "utf8"));

test("Greek phase-seven FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase7.locales, ["el"]);
  assert.equal(Object.keys(phase7.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase7.products[product.slug]?.el;
    assert.ok(localized?.name && localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase7.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase7.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
  assert.deepEqual(Object.keys(phase7.categoryNames).sort(), ["compound", "medium-elements", "water-soluble"]);
});

test("Greek phase-seven translations keep the source review boundary", () => {
  for (const localized of Object.values(phase7.products).map(product => product.el)) {
    assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
  }
});
