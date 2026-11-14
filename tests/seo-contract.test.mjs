import assert from "node:assert/strict";
import { test } from "node:test";

const base = process.env.PREVIEW_URL || "http://localhost:3000";

async function get(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return response.text();
}

test("prelaunch crawler controls and sitemap are published", async () => {
  const robots = await get("/robots.txt");
  assert.match(robots, /Allow:\s*\//);
  assert.match(robots, /Sitemap:\s*https:\/\/www\.kowloonglobaltrading\.com\/sitemap\.xml/);
  const sitemap = await get("/sitemap.xml");
  assert.match(sitemap, /https:\/\/www\.kowloonglobaltrading\.com\/en/);
  assert.match(sitemap, /https:\/\/www\.kowloonglobaltrading\.com\/zh/);
});
test("public locale pages expose current-path canonical and are indexable", async () => {
  for (const path of [
    "/en", "/en/about", "/en/contact", "/en/faq", "/en/search?q=nutrition",
    "/en/news", "/en/news/nutrition-showcase", "/en/insights", "/en/insights/plant-nutrition",
    "/en/cases", "/en/cases/fruit-growing", "/en/products", "/en/products/series",
    "/en/products/series/water-soluble", "/en/products/suspended-fertilizer-120-60-400-draft",
    "/en/solutions", "/en/solutions/greenhouse", "/zh", "/zh/about", "/zh/contact",
    "/zh/products/series", "/zh/solutions", "/fr", "/es", "/he",
  ]) {
    const html = await get(path);
    assert.match(html, /<meta name="robots" content="index, follow"/);
    const normalizedPath = new URL(path, "https://www.kowloonglobaltrading.com").pathname;
    const canonical = `https://www.kowloonglobaltrading.com${normalizedPath}`;
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical.replaceAll("/", "\\/")}"`));
    const suffix = normalizedPath.replace(/^\/(?:en|he|nl|fr|it|es|pt|el|zh|ro|ru|th|tr)/, "");
    assert.match(html, new RegExp(`<link rel="alternate" hrefLang="en" href="https://www\\.kowloonglobaltrading\\.com/en${suffix.replaceAll("/", "\\/")}"`));
    assert.match(html, new RegExp(`<link rel="alternate" hrefLang="zh-CN" href="https://www\\.kowloonglobaltrading\\.com/zh${suffix.replaceAll("/", "\\/")}"`));
    for (const code of ["he", "nl", "fr", "it", "es", "pt", "el", "ro", "ru", "th", "tr"]) {
      assert.match(html, new RegExp(`<link rel="alternate" hrefLang="${code === "zh" ? "zh-CN" : code}" href="https://www\\.kowloonglobaltrading\\.com/${code}${suffix.replaceAll("/", "\\/")}"`));
    }
    assert.match(html, /<link rel="alternate" hrefLang="x-default"/);
  }
});

test("public image alt values are localized strings rather than serialized maps", async () => {
  for (const path of ["/en", "/en/news", "/en/insights", "/en/cases", "/zh"]) {
    const html = await get(path);
    assert.doesNotMatch(html, /alt="[^\"]*(?:&quot;en&quot;|&quot;zh&quot;|\[object Object\])/);
  }
});

test("product review metadata stays behind the authenticated API boundary", async () => {
  const api = await fetch(new URL("/api/products?limit=1", base));
  assert.equal(api.status, 403);
  const html = await get("/en/products/medium-element-granular-draft");
  assert.doesNotMatch(html, /reviewStatus|assetStatus|claimsVerified/);
});
