import { test, expect } from "playwright/test";

const base = (process.env.PUBLIC_BASE_URL || "http://localhost:3118").replace(/\/$/, "");

async function openLanguageMenu(page) {
  await expect(page.locator("header.header")).toHaveAttribute("data-scroll-ready", "true", { timeout: 30000 });
  const direct = page.locator(".nav.right .language-menu:visible, .mobile-header-tools .language-menu:visible").first();
  if (await direct.count()) {
    await direct.locator(":scope > summary").click();
    return direct;
  }
  const mobile = page.locator(".mobile-menu:visible").first();
  await mobile.locator(":scope > summary").click();
  const nested = mobile.locator(".language-menu-mobile");
  await nested.locator(":scope > summary").scrollIntoViewIfNeeded();
  await nested.locator(":scope > summary").click();
  return nested;
}

for (const width of [320, 390, 768, 1280, 1910]) {
  test(`language switching remains usable across RTL at ${width}px`, async ({ page }) => {
    test.setTimeout(60000);
    const consoleErrors = [];
    page.on("console", message => { if (["warning", "error"].includes(message.type())) consoleErrors.push(message.text()); });
    await page.setViewportSize({ width, height: 873 });
    await page.goto(`${base}/it`, { waitUntil: "domcontentloaded" });
    let menu = await openLanguageMenu(page);
    await menu.locator('a[hreflang="he"]').click();
    await page.waitForURL(/\/he(?:\/|$)/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    menu = await openLanguageMenu(page);
    const english = menu.locator('a[hreflang="en"]');
    await english.scrollIntoViewIfNeeded();
    const geometry = await english.evaluate((element) => {
      const link = element.getBoundingClientRect();
      const panel = element.closest("ul").getBoundingClientRect();
      return { linkLeft: link.left, linkRight: link.right, panelLeft: panel.left, panelRight: panel.right, viewport: innerWidth };
    });
    expect(geometry.panelLeft, "language panel left edge").toBeGreaterThanOrEqual(-1);
    expect(geometry.panelRight, "language panel right edge").toBeLessThanOrEqual(geometry.viewport + 1);
    expect(geometry.linkLeft, "English link left edge").toBeGreaterThanOrEqual(-1);
    expect(geometry.linkRight, "English link right edge").toBeLessThanOrEqual(geometry.viewport + 1);
    await english.click();
    await page.waitForURL(/\/en(?:\/|$)/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    expect(consoleErrors).toEqual([]);
  });
}

test("every public language can return to English on mobile and desktop", async ({ page }) => {
  test.setTimeout(180000);
  const consoleErrors = [];
  page.on("console", message => { if (["warning", "error"].includes(message.type())) consoleErrors.push(message.text()); });
  const locales = ["he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];
  for (const width of [390, 1910]) {
    await page.setViewportSize({ width, height: 873 });
    for (const locale of locales) {
      await page.goto(`${base}/${locale}`, { waitUntil: "domcontentloaded" });
      const menu = await openLanguageMenu(page);
      const english = menu.locator('a[hreflang="en"]');
      await english.scrollIntoViewIfNeeded();
      const box = await english.boundingBox();
      expect(box, `${locale} ${width}px English link`).not.toBeNull();
      expect(box.x, `${locale} ${width}px left edge`).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width, `${locale} ${width}px right edge`).toBeLessThanOrEqual(width + 1);
      await english.click();
      await page.waitForURL(/\/en(?:\/|$)/);
    }
  }
  expect(consoleErrors).toEqual([]);
});
