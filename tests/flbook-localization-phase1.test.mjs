import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-import.json", import.meta.url), "utf8"));
const phase1 = JSON.parse(fs.readFileSync(new URL("../src/data/flbook-localizations-phase1.json", import.meta.url), "utf8"));

test("phase-one FLBOOK translations cover source text and spec labels without changing values", () => {
  assert.deepEqual(phase1.locales, ["es", "fr", "pt", "ru"]);
  assert.equal(Object.keys(phase1.products).length, source.products.length);

  for (const product of source.products) {
    const localized = phase1.products[product.slug];
    for (const locale of phase1.locales) {
      assert.ok(localized[locale].name);
      assert.ok(localized[locale].intro.includes(String(product.sourcePages[0])));
      assert.notEqual(localized[locale].name, product.englishDisplayName);
    }
    for (const spec of product.specifications) {
      for (const locale of phase1.locales) assert.ok(phase1.specificationLabels[spec.id]?.[locale], `${product.slug}/${spec.id}/${locale}`);
    }
  }
});

test("phase-one translations contain no commercial or numerical fields", () => {
  for (const product of Object.values(phase1.products)) {
    for (const localized of Object.values(product)) {
      assert.deepEqual(Object.keys(localized).sort(), ["intro", "name"]);
    }
  }
  assert.deepEqual(Object.keys(phase1.specificationLabels).sort(), [...new Set(source.products.flatMap(product => product.specifications.map(spec => spec.id)))].sort());
});
