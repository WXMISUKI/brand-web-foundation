import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase3-tr.json", import.meta.url), "utf8"));

test("Turkish phase-three FLBOOK translations cover every product and specification label", () => {
  assert.deepEqual(phase3.locales, ["tr"]);
  assert.equal(Object.keys(phase3.products).length, source.products.length);
  for (const product of source.products) {
    const localized = phase3.products[product.slug]?.tr;
    assert.ok(localized?.name && localized?.intro.includes(String(product.sourcePages[0])));
    assert.notEqual(localized.name, product.englishDisplayName);
    for (const spec of product.specifications) assert.ok(phase3.specificationLabels[spec.id]);
  }
  assert.deepEqual(Object.keys(phase3.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
});
