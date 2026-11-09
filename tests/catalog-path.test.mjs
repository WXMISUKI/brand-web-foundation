import { test } from "node:test";
import assert from "node:assert/strict";
import { catalogHref } from "../src/data/catalog-path.ts";
import { locales } from "../src/i18n/locales.ts";

test("catalog links preserve locale, filters, pagination and anchor", () => {
  for (const { code } of locales) {
    const result = new URL(catalogHref(code, "crop & soil", "钙 nitrate", true, 2), "https://example.invalid");
    assert.equal(result.pathname, `/${code}/products`);
    assert.equal(result.searchParams.get("category"), "crop & soil");
    assert.equal(result.searchParams.get("q"), "钙 nitrate");
    assert.equal(result.searchParams.get("page"), "2");
    assert.equal(result.hash, "#catalog-results");
  }
  assert.equal(catalogHref("en", "", "", false, 1), "/en/products");
});
