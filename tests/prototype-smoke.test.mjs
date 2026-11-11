import assert from "node:assert/strict";
import { test } from "node:test";

// Run against a separately started local preview. These expectations cover the
// owner-review brochure-linked demonstration content and its public routes.
const base = process.env.PREVIEW_URL || "http://localhost:3000";

async function page(path, status = 200) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, status, `${path} returned ${response.status}`);
  return response.text();
}

function visibleText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

test("product resources are reachable and the request form remains disabled", async () => {
  for (const locale of ["en", "zh"]) {
    const request = await page(`/${locale}/sds-request`);
    assert.match(request, /<fieldset disabled="?"?>/);
    assert.match(request, new RegExp(`href="/${locale}/quality-assurance"`));
    const quality = await page(`/${locale}/quality-assurance`);
    assert.match(quality, new RegExp(`href="/${locale}/sds-request"`));
  }
});

test("deployment health route reports a liveness response", async () => {
  const response = await fetch(new URL("/api/health", base));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, "fertilizer-guide");
});

test("deployment readiness route checks database and media dependencies", async () => {
  const response = await fetch(new URL("/api/ready", base));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body, {
    ok: true,
    service: "fertilizer-guide",
    checks: { database: true, media: true },
  });
});

test("public home pages identify their language and are indexable", async () => {
  for (const [path, lang] of [["/zh", "zh-CN"], ["/en", "en"]]) {
    const html = await page(path);
    assert.match(html, new RegExp(`<html[^>]*lang="${lang}"`));
    assert.match(html, /<meta name="robots" content="index, follow"/);
  }
  const home = await page("/en");
  assert.equal((home.match(/href="\/en\/products\/(?!series(?:\/|"))[^\"]+"/g) ?? []).length, 10);
});

test("root and legacy Chinese URLs redirect with query parameters", async () => {
  const root = await fetch(new URL("/", base), { redirect: "manual" });
  assert.equal(root.status, 307);
  assert.equal(root.headers.get("location"), "/en");
  const legacy = await fetch(new URL("/products?category=water-soluble&q=sample", base), { redirect: "manual" });
  assert.equal(legacy.status, 307);
  assert.equal(legacy.headers.get("location"), "/zh/products?category=water-soluble&q=sample");
});

test("category filters and language links preserve the selected category", async () => {
  const zh = await page("/zh/products?category=water-soluble");
  assert.match(visibleText(zh), /找到\s*16\s*条产品/);
  assert.match(zh, /href="\/en\/products\?category=water-soluble"/);
  const en = await page("/en/products?category=water-soluble");
  assert.match(visibleText(en), /16\s*products found/);
  assert.match(en, /href="\/zh\/products\?category=water-soluble"/);
});

test("search uses current-language product text", async () => {
  const matching = visibleText(await page("/en/products?q=water-soluble"));
  const count = Number(matching.match(/(\d+)\s*products found/)?.[1] ?? 0);
  assert.ok(count >= 18, `expected published FLBOOK plus official candidate products, got ${count}`);
  const noMatch = visibleText(await page(`/en/products?q=${encodeURIComponent("unmatchedxyz")}`));
  assert.match(noMatch, /No matching products found/);
});

test("FLBOOK product detail supports direct access, counterpart language and public source preview", async () => {
  const slug = "medium-element-granular-draft";
  const zh = await page(`/zh/products/${slug}`);
  assert.match(visibleText(zh), /非水溶中量元素肥料/);
  assert.match(zh, new RegExp(`href="/en/products/${slug}"`));
  const en = await page(`/en/products/${slug}`);
  assert.match(visibleText(en), /Non-water-soluble secondary/);
  assert.match(en, new RegExp(`href="/zh/products/${slug}"`));
  assert.match(visibleText(en), /Brochure pages:\s*6, 7/);
  assert.match(en, /src="\/images\/flbook-pages\/page-06-product\.jpg"/);
  assert.match(visibleText(en), /transcribed from the owner-provided brochure link/);
  assert.doesNotMatch(visibleText(en), /Related brochure pages|excluded-candidate/);
  const suspended = await page("/en/products/suspended-fertilizer-120-60-400-draft");
  assert.match(visibleText(suspended), /120-60-400\+TE/);
  assert.match(visibleText(suspended), /Brochure pages:\s*14, 15/);
  assert.match(suspended, /src="\/images\/flbook-pages\/page-14-product\.jpg"/);
  const compound = await page("/en/products/organic-inorganic-compound-draft");
  assert.doesNotMatch(visibleText(compound), /Related brochure pages|excluded-candidate/);
  assert.match(visibleText(compound), /Brochure pages:\s*22/);
  assert.match(compound, /src="\/images\/flbook-pages\/page-22-product\.jpg"/);
});

test("anonymous Payload products endpoint is disabled while public pages remain available", async () => {
  const response = await fetch(new URL("/api/products?locale=en&limit=1", base));
  assert.ok([401, 403, 404, 405, 501].includes(response.status), `unexpected public products endpoint status ${response.status}`);
  await page("/en/products", 200);
});

test("unknown products and solutions return 404 in both languages", async () => {
  for (const path of ["/zh/products/not-a-product", "/en/products/not-a-product", "/zh/solutions/not-a-solution", "/en/solutions/not-a-solution"]) {
    await page(path, 404);
  }
});

test("knowledge search preserves filters across languages and supports direct article access", async () => {
  const html = await page("/en/insights?q=nutrition&author=Alice");
  assert.match(html, /href="\/zh\/insights\?q=nutrition&amp;author=Alice"/);
  assert.match(visibleText(html), /No articles match your search/);
  assert.match(visibleText(await page("/en/insights/plant-nutrition")), /Plant nutrition by growth stage/);
  await page("/en/insights/not-an-article", 404);
});

test("knowledge center preserves reference-style topic filters", async () => {
  const html = await page("/en/insights?topic=crop-guides");
  assert.match(visibleText(html), /Growing practices/);
  assert.doesNotMatch(html, /href="\/en\/insights\/plant-nutrition"/);
  assert.match(html, /href="\/en\/insights\?topic=crop-guides"/);
});

test("news pages keep the reference content banner and localized article links", async () => {
  const html = await page("/en/news");
  assert.match(html, /class="insight-banner"/);
  assert.match(html, /href="\/en\/news\/nutrition-showcase"/);
  const detail = await page("/en/news/nutrition-showcase");
  assert.match(detail, /class="insight-banner"/);
  assert.match(visibleText(detail), /KOMU plant nutrition across growth stages/);
});

test("news page preserves the reference News/Events filter", async () => {
  const events = await page("/en/news?type=event");
  assert.match(visibleText(events), /Planning crop nutrition with growers/);
  assert.doesNotMatch(visibleText(events), /KOMU plant nutrition across growth stages/);
  assert.match(events, /href="\/en\/news\?type=event"/);
});

test("FAQ keeps the reference banner, category rail and expandable questions", async () => {
  const html = await page("/en/faq");
  assert.match(html, /class="faq-banner"/);
  assert.match(visibleText(html), /Product information/);
  assert.match(visibleText(html), /Where can I find product specifications\?/);
  assert.match(html, /faq-list/);
});

test("smart farming has locale counterparts and practical tool routes", async () => {
  const en = await page("/en/smart-farming");
  assert.match(en, /href="\/zh\/smart-farming"/);
  assert.match(visibleText(en), /Use the product catalogue, crop guides and source pages/);
  const zh = await page("/zh/smart-farming");
  assert.match(zh, /href="\/en\/smart-farming"/);
  assert.match(visibleText(zh), /产品目录、作物指南和来源页/);
});

test("localized public pages preserve language, counterparts and reject unsupported locales", async () => {
  for (const section of ["about", "contact", "faq", "news", "insights", "smart-farming"]) {
    for (const [locale, other, lang] of [["en", "zh", "en"], ["zh", "en", "zh-CN"]]) {
      const html = await page(`/${locale}/${section}`);
      assert.match(html, new RegExp(`<html[^>]*lang="${lang}"`));
      assert.match(html, new RegExp(`href="/${other}/${section}"`));
      assert.match(html, /<meta name="robots" content="index, follow"/);
    }
  }
  await page("/xx/insights", 404);
});

test("language menu exposes all owner-approved locale counterparts", async () => {
  const html = await page("/en/products?category=water-soluble");
  assert.match(html, /href="\/zh\/products\?category=water-soluble"/);
  assert.match(html, /href="\/fr(?:\/|\?|\")/);
  assert.match(html, /href="\/he(?:\/|\?|\")/);
});

test("news pagination preserves the page when switching languages", async () => {
  const html = await page("/en/news?page=2");
  assert.match(html, /href="\/zh\/news\?page=2"/);
  assert.match(visibleText(html), /Page 2 of 1/);
  assert.match(html, /href="\/en\/news"/);
  const filtered = await page("/en/news?q=example&page=2");
  assert.match(filtered, /href="\/zh\/news\?q=example&amp;page=2"/);
  assert.match(filtered, /href="\/en\/news\?q=example"/);
});

test("product pagination preserves filters and page across languages", async () => {
  const html = await page("/en/products?category=water-soluble&q=test&page=2");
  assert.match(html, /href="\/zh\/products\?category=water-soluble&amp;q=test&amp;page=2"/);
  assert.match(visibleText(html), /Page 2 of 1/);
  assert.match(html, /href="\/en\/products\?category=water-soluble&amp;q=test#catalog-results"/);
});

test("case examples support search, localized detail and missing pages", async () => {
  const list = await page("/en/cases?q=orchard");
  assert.match(visibleText(list), /Orchard nutrition planning/);
  assert.doesNotMatch(visibleText(list), /Protected cultivation planning/);
  assert.match(list, /href="\/zh\/cases\?q=orchard"/);
  const detail = await page("/en/cases/fruit-growing");
  assert.match(visibleText(detail), /Orchard nutrition planning/);
  assert.match(detail, /href="\/zh\/cases\/fruit-growing"/);
  await page("/zh/cases/not-a-case", 404);
});

test("site search combines current-language examples and preserves the keyword", async () => {
  const html = await page("/en/search?q=nutrition");
  assert.match(html, /href="\/en\/products\/medium-element-granular-draft"/);
  assert.match(html, /href="\/en\/insights\/plant-nutrition"/);
  assert.match(html, /href="\/zh\/search\?q=nutrition"/);
  assert.match(visibleText(await page("/en/search?q=unmatchedxyz")), /No matching content found/);
});

test("contact page exposes direct routes and records authorized inquiries", async () => {
  for (const locale of ["en", "zh"]) {
    const html = await page(`/${locale}/contact`);
    assert.match(html, /mailto:leon@kowloonglobaltrading\.com/);
    assert.match(html, /https:\/\/wa\.me\/85290740009/);
  }
  const inquiry = await fetch(new URL("/api/inquiries", base), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "Smoke test", email: "smoke@example.test", message: "Authorized inquiry acceptance test", consent: true }) });
  assert.equal(inquiry.status, 201);
  const body = await inquiry.json();
  assert.equal(body.ok, true);
  assert.equal(typeof body.id, "number");
});
