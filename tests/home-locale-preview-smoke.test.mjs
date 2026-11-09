import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";

test("CMS_EVAL exposes the homepage for all configured locales", async () => {
  for (const locale of locales) {
    const response = await fetch(new URL(`/${locale.code}`, previewBase));
    assert.equal(response.status, 200, locale.code);
    const html = await response.text();
    assert.match(html, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
    assert.match(html, new RegExp(`<html[^>]*dir="${locale.direction}"`));
    assert.match(html, /<meta name="robots" content="index, follow"/);
    assert.match(html, new RegExp(`href="/${locale.code}/products`));
  }
});

test("homepage preview remains closed outside CMS_EVAL", async () => {
  assert.equal((await fetch(new URL("/he", publicBase))).status, 404);
});
