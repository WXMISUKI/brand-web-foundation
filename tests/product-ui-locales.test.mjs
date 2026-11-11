import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";
import { catalogMessages } from "../src/i18n/catalog-messages.ts";
import { productDetailMessages } from "../src/i18n/product-detail-messages.ts";

test("product catalog and detail interface copy is authored for every public locale", () => {
  for (const { code } of locales) {
    assert.ok(catalogMessages[code].title.trim());
    assert.ok(catalogMessages[code].search.trim());
    assert.ok(catalogMessages[code].details.trim());
    assert.ok(productDetailMessages[code].banner.trim());
    assert.ok(productDetailMessages[code].specs.trim());
    assert.ok(productDetailMessages[code].quote.trim());
    if (code !== "en") {
      assert.notEqual(catalogMessages[code].title, catalogMessages.en.title, `${code} catalog title fell back to English`);
      assert.notEqual(productDetailMessages[code].banner, productDetailMessages.en.banner, `${code} product banner fell back to English`);
    }
  }
});
