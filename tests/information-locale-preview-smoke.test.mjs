import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";
const pageKind = process.env.PREVIEW_INFORMATION_PATH || "faq";
assert.ok(["faq", "contact", "search"].includes(pageKind), `unsupported information preview path: ${pageKind}`);

test(`released ${pageKind} pages expose all configured locales`, async () => {
  for (const locale of locales) {
    const path = pageKind === "search" ? "search?q=nutrition" : pageKind;
    const response = await fetch(new URL(`/${locale.code}/${path}`, previewBase));
    assert.equal(response.status, 200, `${locale.code}/${path}`);
    const html = await response.text();
    assert.match(html, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
    assert.match(html, new RegExp(`<html[^>]*dir="${locale.direction}"`));
    assert.match(html, /<meta name="robots" content="index, follow"/);
  }
});

test("released information pages remain open on the public instance", async () => {
  assert.equal((await fetch(new URL(`/he/${pageKind}`, publicBase))).status, 200, pageKind);
});
