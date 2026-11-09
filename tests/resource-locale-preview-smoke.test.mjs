import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const previewBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";
const kind = process.env.PREVIEW_RESOURCE_PATH || "smart-farming";
const paths = {
  "smart-farming": "smart-farming",
  sustainability: "sustainability",
  "sds-request": "sds-request",
  "quality-assurance": "quality-assurance",
};
assert.ok(paths[kind], `unsupported resource preview path: ${kind}`);

test(`CMS_EVAL exposes ${kind} for all configured locales`, async () => {
  for (const locale of locales) {
    const response = await fetch(new URL(`/${locale.code}/${paths[kind]}`, previewBase));
    assert.equal(response.status, 200, `${locale.code}/${paths[kind]}`);
    const html = await response.text();
    assert.match(html, new RegExp(`<html[^>]*lang="${locale.htmlLang}"`));
    assert.match(html, new RegExp(`<html[^>]*dir="${locale.direction}"`));
    assert.match(html, /<meta name="robots" content="index, follow"/);
    if (kind === "sds-request") assert.match(html, /<fieldset disabled/);
  }
});

test("resource preview remains closed outside CMS_EVAL", async () => {
  assert.equal((await fetch(new URL(`/he/${paths[kind]}`, publicBase))).status, 404, kind);
});
