import { test, expect } from "playwright/test";

const base = (process.env.PUBLIC_BASE_URL || "http://localhost:3123").replace(/\/$/, "");

for (const scenario of [
  { locale: "en", width: 1280, height: 720 },
  { locale: "en", width: 390, height: 844 },
  { locale: "he", width: 390, height: 844 },
]) {
  test(`header collapses and restores at ${scenario.locale} ${scenario.width}px`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: scenario.width, height: scenario.height });
    const errors = [];
    page.on("console", (message) => { if (["error", "warning"].includes(message.type())) errors.push(message.text()); });
    await page.goto(`${base}/${scenario.locale}`, { waitUntil: "domcontentloaded" });
    const header = page.locator("header.header");
    const brand = page.locator("header.header .brand");
    await expect(header).toHaveAttribute("data-scroll-ready", "true");
    await expect(header).toHaveAttribute("data-scroll-state", "expanded");
    await page.evaluate(() => window.scrollTo(0, 120));
    await expect(header).toHaveAttribute("data-scroll-state", "collapsed");
    await expect(brand).toHaveCSS("visibility", "hidden");
    await expect(brand).toHaveCSS("opacity", "0");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute("data-scroll-state", "expanded");
    await expect(brand).toHaveCSS("visibility", "visible");
    await expect(brand).toHaveCSS("opacity", "1");
    const geometry = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, viewport: window.innerWidth }));
    expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
    expect(geometry.bodyWidth).toBeLessThanOrEqual(geometry.viewport);
    expect(errors).toEqual([]);
  });
}
