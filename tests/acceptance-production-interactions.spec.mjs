import { test } from "playwright/test";

const base = (process.env.PUBLIC_BASE_URL || "https://www.kowloonglobaltrading.com").replace(/\/$/, "");

test("production key interactions and RTL boundary", async ({ browser }) => {
  test.setTimeout(120000);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const consoleMessages = [];
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(message.text()); });

  await page.goto(`${base}/en`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator('[data-scroll-ready="true"]').waitFor({ state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  const mobileMenu = page.locator("details.mobile-menu:visible");
  await mobileMenu.locator("summary").first().click();
  if (!(await mobileMenu.evaluate((element) => element.open))) throw new Error("mobile menu did not open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  if (await mobileMenu.evaluate((element) => element.open)) throw new Error(`Escape did not close mobile menu: ${JSON.stringify(await page.evaluate(() => ({ active: document.activeElement?.textContent, open: document.querySelector("details.mobile-menu")?.open, width: innerWidth })))}`);

  const languageMenu = page.locator(".mobile-header-tools .language-menu");
  await languageMenu.locator("summary").click();
  if ((await languageMenu.locator("li").count()) < 13) throw new Error("language menu does not expose all public locales");
  await page.keyboard.press("Escape");

  await page.goto(`${base}/en/faq`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const faqItem = page.locator("main details").first();
  if (!(await faqItem.count())) throw new Error("FAQ details not found");
  await faqItem.locator("summary").click();
  if (!(await faqItem.evaluate((element) => element.open))) throw new Error("FAQ item did not expand");

  await page.goto(`${base}/en/products`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if ((await page.locator('a[href^="/en/products/"]').count()) < 1) throw new Error("product detail entry missing");

  await page.goto(`${base}/he`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const rtl = await page.locator("html").evaluate((element) => ({ lang: element.lang, dir: element.dir, width: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
  if (rtl.lang !== "he" || rtl.dir !== "rtl" || rtl.width > 390 || rtl.bodyWidth > 390) throw new Error(`RTL boundary failed: ${JSON.stringify(rtl)}`);

  if (consoleMessages.length) throw new Error(`console warnings/errors: ${consoleMessages.join(" | ")}`);
  await context.close();
});
