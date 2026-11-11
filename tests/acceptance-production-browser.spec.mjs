import { test } from "playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const base = (process.env.PUBLIC_BASE_URL || "https://www.kowloonglobaltrading.com").replace(/\/$/, "");
const runId = process.env.ACCEPTANCE_RUN_ID || new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = process.env.ACCEPTANCE_OUTPUT_DIR || `output/acceptance/${runId}`;
const locales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];
const keyRoutes = ["", "/about", "/products", "/products/series", "/solutions", "/contact", "/faq", "/search?q=nutrition", "/news", "/insights", "/smart-farming", "/sustainability", "/quality-assurance", "/sds-request"];
const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 844 },
  { name: "desktop-1280", width: 1280, height: 720 },
  { name: "desktop-1440", width: 1440, height: 900 },
];
const screenshotKeys = new Set([
  "en||mobile-390",
  "zh||mobile-390",
  "he||mobile-390",
  "en|/products|desktop-1280",
  "he|/contact|mobile-390",
  "zh|/solutions|tablet-768",
  "en|/sds-request|desktop-1440",
]);
const placeholderMarkers = ["译文暂未提供", "Information unavailable", "Translation pending", "await review"];
const fastScope = process.env.ACCEPTANCE_SCOPE === "fast";
const results = [];

function shouldVisit(locale, route, viewport) {
  if (fastScope) return ["en", "zh", "he"].includes(locale) && ["", "/products", "/contact", "/news"].includes(route) && ["mobile-390", "desktop-1280"].includes(viewport.name);
  if (route === "") return true;
  if (["en", "zh", "he"].includes(locale)) return ["mobile-390", "desktop-1280"].includes(viewport.name);
  return viewport.name === "mobile-390" && ["/products", "/contact"].includes(route);
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(700);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(200, window.innerHeight - 80)) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const pending = [...document.images].filter((image) => {
        const rect = image.getBoundingClientRect();
        return rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth && (!image.complete || image.naturalWidth === 0);
      });
      if (!pending.length) break;
      await Promise.all(pending.map((image) => new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
        setTimeout(resolve, 10000);
      })));
    }
  });
  await page.waitForTimeout(1200);
}

function overlap(a, b) {
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return x * y;
}

test("production locale and component browser acceptance matrix", async ({ browser }) => {
  test.setTimeout(20 * 60 * 1000);
  const context = await browser.newContext();
  await mkdir(outputDir, { recursive: true });
  for (const locale of locales) {
    for (const route of keyRoutes) {
      for (const viewport of viewports) {
        if (!shouldVisit(locale, route, viewport)) continue;
        const page = await context.newPage();
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const consoleMessages = [];
        const failedRequests = [];
        page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push({ type: message.type(), text: message.text() }); });
        page.on("requestfailed", (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? "failed" }));
        const path = `/${locale}${route}`;
        const started = Date.now();
        let row = { locale, route: path, viewport: viewport.name, width: viewport.width, height: viewport.height, status: null, lang: null, dir: null, scrollWidth: null, bodyScrollWidth: null, brokenImages: [], placeholderMarkers: [], outOfViewport: [], overlapPairs: [], consoleMessages, failedRequests, screenshot: null, durationMs: null, error: null };
        try {
          let response = null;
          let navigationError = null;
          for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
              response = await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
              navigationError = null;
              break;
            } catch (error) {
              navigationError = error;
              await page.waitForTimeout(500 * (attempt + 1));
            }
          }
          if (navigationError && !response) throw navigationError;
          row.status = response?.status() ?? null;
          await settle(page);
          row = { ...row, ...(await page.evaluate(({ placeholderMarkers }) => {
            const visible = (element) => { const style = getComputedStyle(element); const rect = element.getBoundingClientRect(); return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0; };
            const rectData = (element) => { const rect = element.getBoundingClientRect(); return { tag: element.tagName.toLowerCase(), className: String(element.className || "").slice(0, 100), left: Math.round(rect.left), top: Math.round(rect.top), right: Math.round(rect.right), bottom: Math.round(rect.bottom), width: Math.round(rect.width), height: Math.round(rect.height) }; };
            const viewport = { width: window.innerWidth, height: window.innerHeight };
            const insideHorizontalScroll = (element) => {
              let parent = element.parentElement;
              while (parent) {
                const style = getComputedStyle(parent);
                if (["auto", "scroll", "hidden"].includes(style.overflowX) && parent.scrollWidth > parent.clientWidth + 2) return true;
                parent = parent.parentElement;
              }
              return false;
            };
            const outOfViewport = [...document.querySelectorAll("body *")].filter(visible).filter((element) => !element.matches(".inquiry-honeypot") && !element.closest("details:not([open])") && !element.closest("[hidden],[aria-hidden='true']") && !insideHorizontalScroll(element)).map(rectData).filter((rect) => rect.left < -2 || rect.right > viewport.width + 2).slice(0, 30);
            const groups = ["header > *", "main > *", "footer > *", ".hero-controls > *", ".mobile-bottom-bar > *"].flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible));
            const overlapPairs = [];
            for (let i = 0; i < groups.length; i += 1) for (let j = i + 1; j < groups.length; j += 1) {
              const a = groups[i].getBoundingClientRect(); const b = groups[j].getBoundingClientRect();
              const contained = (a.left >= b.left && a.right <= b.right && a.top >= b.top && a.bottom <= b.bottom) || (b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom);
              if (!contained && Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) > 4) overlapPairs.push([rectData(groups[i]), rectData(groups[j])]);
            }
            return {
              lang: document.documentElement.lang,
              dir: document.documentElement.dir,
              scrollWidth: document.documentElement.scrollWidth,
              bodyScrollWidth: document.body.scrollWidth,
              brokenImages: [...document.images].filter((image) => {
                const rect = image.getBoundingClientRect();
                const style = getComputedStyle(image);
                const visibleInViewport = style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0 && rect.bottom >= 0 && rect.top <= viewport.height && rect.right >= 0 && rect.left <= viewport.width;
                return visibleInViewport && (!image.complete || image.naturalWidth === 0);
              }).map((image) => image.currentSrc || image.src),
              placeholderMarkers: placeholderMarkers.filter((marker) => document.body.innerText.includes(marker)),
              outOfViewport,
              overlapPairs,
            };
          }, { placeholderMarkers })), };
          if (screenshotKeys.has(`${locale}|${route}|${viewport.name}`)) {
            const safeRoute = route.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "home";
            const pathName = `${outputDir}/${locale}-${safeRoute}-${viewport.name}.png`;
            await page.screenshot({ path: pathName, fullPage: false });
            row.screenshot = pathName;
          }
          const expectedLang = locale === "zh" ? "zh-CN" : locale;
          const expectedDir = locale === "he" ? "rtl" : "ltr";
          if (row.status !== 200) row.error = `expected 200, got ${row.status}`;
          else if (row.lang !== expectedLang || row.dir !== expectedDir) row.error = `lang/dir mismatch: ${row.lang}/${row.dir}`;
          else if (row.scrollWidth > viewport.width || row.bodyScrollWidth > viewport.width) row.error = "root/body horizontal overflow";
          else if (row.brokenImages.length) row.error = `broken images: ${row.brokenImages.length}`;
          else if (row.placeholderMarkers.length) row.error = `placeholder markers: ${row.placeholderMarkers.join(",")}`;
          else if (row.outOfViewport.length) row.error = `out of viewport elements: ${row.outOfViewport.length}`;
          else if (process.env.ENFORCE_GEOMETRY === "1" && row.overlapPairs.length) row.error = `unexpected overlap pairs: ${row.overlapPairs.length}`;
          else if (consoleMessages.length) row.error = `console messages: ${consoleMessages.length}`;
          else if (failedRequests.length) row.error = `failed requests: ${failedRequests.length}`;
        } catch (error) {
          row.error = `${error?.name ?? "browser failure"}: ${error?.message ?? ""}`.trim();
        }
        row.durationMs = Date.now() - started;
        results.push(row);
        await page.close();
      }
    }
  }
  await context.close();
  const summary = { runId, base, total: results.length, passed: results.filter((row) => !row.error).length, failed: results.filter((row) => row.error).length, results };
  await writeFile(`${outputDir}/browser-matrix.json`, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify({ runId, total: summary.total, passed: summary.passed, failed: summary.failed, screenshots: results.filter((row) => row.screenshot).map((row) => row.screenshot) }, null, 2));
  if (summary.failed) throw new Error(`production browser acceptance failed: ${summary.failed}/${summary.total}`);
});
