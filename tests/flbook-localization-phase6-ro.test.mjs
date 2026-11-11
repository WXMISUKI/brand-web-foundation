import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase6 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase6-ro.json", import.meta.url), "utf8"));

test("Romanian phase-six FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase6.locales, ["ro"]);
  assert.equal(Object.keys(phase6.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase6.products[product.slug]?.ro;
    assert.ok(localized?.name && localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase6.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase6.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
  assert.deepEqual(Object.keys(phase6.categoryNames).sort(), ["compound", "medium-elements", "water-soluble"]);
});

test("Romanian phase-six translations keep the source review boundary", () => {
  for (const localized of Object.values(phase6.products).map(product => product.ro)) {
    assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
  }
});
