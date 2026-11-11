import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase2 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase2-it.json", import.meta.url), "utf8"));

test("Italian phase-two FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase2.locales, ["it"]);
  assert.equal(Object.keys(phase2.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase2.products[product.slug]?.it;
    assert.ok(localized?.name);
    assert.ok(localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase2.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase2.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
  assert.deepEqual(Object.keys(phase2.categoryNames).sort(), ["compound", "medium-elements", "water-soluble"]);
});

test("Italian phase-two translations keep the source review boundary", () => {
  for (const localized of Object.values(phase2.products).map(product => product.it)) {
    assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
  }
});
