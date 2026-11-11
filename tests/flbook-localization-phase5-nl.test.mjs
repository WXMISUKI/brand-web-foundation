import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase5 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase5-nl.json", import.meta.url), "utf8"));

test("Dutch phase-five FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase5.locales, ["nl"]);
  assert.equal(Object.keys(phase5.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase5.products[product.slug]?.nl;
    assert.ok(localized?.name && localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase5.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase5.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
  assert.deepEqual(Object.keys(phase5.categoryNames).sort(), ["compound", "medium-elements", "water-soluble"]);
});

test("Dutch phase-five translations keep the source review boundary", () => {
  for (const localized of Object.values(phase5.products).map(product => product.nl)) {
    assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
  }
});
