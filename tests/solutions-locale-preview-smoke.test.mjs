import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";

test("CMS_EVAL exposes growing solutions and crop guides for all configured locales", async () => {
  for (const locale of locales) {
    for (const slug of ["fruit-trees", "greenhouse"]) {
      const response = await fetch(new URL(`/${locale.code}/solutions/${slug}`, previewBase));
      assert.equal(response.status, 200, `${locale.code}/solutions/${slug}`);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
      assert.match(html, new RegExp(`<html[^>]*dir="${locale.direction}"`));
      assert.match(html, /<meta name="robots" content="index, follow"/);
      assert.match(html, new RegExp(`href="/${locale.code}/products"`));
    }
  }
});

test("solutions preview remains closed outside CMS_EVAL", async () => {
  assert.equal((await fetch(new URL("/he/solutions/fruit-trees", publicBase))).status, 404);
});
