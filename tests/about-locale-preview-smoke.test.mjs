import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";

test("released about pages expose all configured locales with correct direction metadata", async () => {
  for (const locale of locales) {
    const response = await fetch(new URL(`/${locale.code}/about`, previewBase));
    assert.equal(response.status, 200, `${locale.code}/about`);
    const html = await response.text();
    assert.match(html, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`), `${locale.code} lang`);
    assert.match(html, new RegExp(`<html[^>]*dir="${locale.direction}"`), `${locale.code} dir`);
    assert.match(html, /<meta name="robots" content="index, follow"/);
    assert.match(html, new RegExp(`href="/${locale.code}/contact"`), `${locale.code} contact link`);
    if (locale.code === "he") {
      assert.match(html, /href="\/nl\/about"/, "preview language link for Dutch");
      assert.match(html, /href="\/tr\/about"/, "preview language link for Turkish");
    }
  }
});

test("released about pages remain open on public and evaluation instances", async () => {
  assert.equal((await fetch(new URL("/he/about", publicBase))).status, 200);
  assert.equal((await fetch(new URL("/he", previewBase))).status, 200);
  assert.equal((await fetch(new URL("/he/products", previewBase))).status, 200);
});
