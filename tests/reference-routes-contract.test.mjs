import assert from "node:assert/strict";
import { test } from "node:test";

const evalBase = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const publicBase = process.env.PREVIEW_URL || "http://localhost:3118";
const routeBase = process.env.REFERENCE_ROUTE_BASE || evalBase;

async function get(base, path) {
  return fetch(new URL(path, base));
}

test("public series and growing-method indexes expose localized routes", async () => {
  for (const locale of ["en", "zh"]) {
    const series = await get(routeBase, `/${locale}/products/series`);
    assert.equal(series.status, 200, `${locale} series index`);
    const seriesHtml = await series.text();
    assert.match(seriesHtml, new RegExp(`<html[^>]*lang="${locale === "zh" ? "zh-CN" : "en"}`));
    assert.match(seriesHtml, new RegExp(`href="/${locale}/products/series/water-soluble"`));

    const methods = await get(routeBase, `/${locale}/solutions`);
    assert.equal(methods.status, 200, `${locale} methods index`);
    const methodsHtml = await methods.text();
    assert.match(methodsHtml, new RegExp(`href="/${locale}/solutions/greenhouse"`));
  }
});

test("known series detail has products and invalid series remains 404", async () => {
  const response = await get(routeBase, "/en/products/series/water-soluble");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Products in this series|本系列产品/);
  assert.match(html, /canonical/);
  assert.equal((await get(routeBase, "/en/products/series/unknown-series")).status, 404);
});

test("preview locale can read the new routes while production keeps it closed", async () => {
  assert.equal((await get(publicBase, "/he/products/series")).status, 404);
  assert.equal((await get(evalBase, "/he/products/series")).status, 200);
  assert.equal((await get(evalBase, "/he/solutions")).status, 200);
});
