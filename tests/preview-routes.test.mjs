import assert from "node:assert/strict";
import { test } from "node:test";
import { hasPreviewCounterpart, isPreviewRoute } from "../src/i18n/preview-routes.ts";

test("preview counterparts accept implemented routes and preserve route boundaries", () => {
  for (const path of ["/en", "/zh?x=1", "/fr/products?category=water", "/en/solutions/greenhouse", "/zh/sustainability", "/en/search?q=plant"]) {
    assert.equal(hasPreviewCounterpart(path), true, path);
  }
  for (const path of ["/en/cms-preview", "/en/products-extra", "/he/products", "//example.com", "/en\\products"]) {
    assert.equal(hasPreviewCounterpart(path), false, path);
  }
  assert.equal(isPreviewRoute("/products/one"), true);
  assert.equal(isPreviewRoute("/not-open"), false);
});
