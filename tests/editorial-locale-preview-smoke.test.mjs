import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";
const kind = process.env.PREVIEW_EDITORIAL_PATH || "news";
const entries = {
  news: { list: "news", detail: "news/nutrition-showcase" },
  insights: { list: "insights", detail: "insights/plant-nutrition" },
  cases: { list: "cases", detail: "cases/fruit-growing" },
};
assert.ok(entries[kind], `unsupported editorial preview path: ${kind}`);

test(`released ${kind} list and detail expose all configured locales`, async () => {
  for (const locale of locales) {
    for (const path of [entries[kind].list, entries[kind].detail]) {
      const response = await fetch(new URL(`/${locale.code}/${path}`, previewBase));
      assert.equal(response.status, 200, `${locale.code}/${path}`);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
      assert.match(html, new RegExp(`<html[^>]*dir="${locale.direction}"`));
      assert.match(html, /<meta name="robots" content="index, follow"/);
    }
  }
});

test("released editorial pages remain open on the public instance", async () => {
  assert.equal((await fetch(new URL(`/he/${entries[kind].list}`, publicBase))).status, 200, kind);
});
