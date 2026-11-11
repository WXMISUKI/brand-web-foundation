import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";
const slug = "medium-element-granular-draft";

test("released product catalog and detail expose all configured locales", async () => {
  for (const locale of locales) {
    const catalogResponse = await fetch(new URL(`/${locale.code}/products`, previewBase));
    assert.equal(catalogResponse.status, 200, `${locale.code}/products`);
    const catalog = await catalogResponse.text();
    assert.match(catalog, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
    assert.match(catalog, new RegExp(`<html[^>]*dir="${locale.direction}"`));
    assert.match(catalog, /<meta name="robots" content="index, follow"/);

    const detailResponse = await fetch(new URL(`/${locale.code}/products/${slug}`, previewBase));
    assert.equal(detailResponse.status, 200, `${locale.code}/products/${slug}`);
    const detail = await detailResponse.text();
    assert.match(detail, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
    assert.match(detail, new RegExp(`href="/${locale.code}/contact"`));
  }
});

test("released product pages remain open on the public instance", async () => {
  assert.equal((await fetch(new URL("/he/products", publicBase))).status, 200);
  assert.equal((await fetch(new URL(`/en/products/${slug}`, publicBase))).status, 200);
});
