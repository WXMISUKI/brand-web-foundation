import { test, expect } from "playwright/test";

const base = (process.env.PUBLIC_BASE_URL || "http://localhost:3118").replace(/\/$/, "");
const locales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];

test("only the working contact entry is shown on desktop and mobile", async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [390, 1910]) {
    await page.setViewportSize({ width, height: 873 });
    for (const locale of locales) {
      await page.goto(`${base}/${locale}`, { waitUntil: "domcontentloaded" });
      const nav = page.locator(width < 761 ? ".mobile-quick-links" : ".desktop-quick-links");
      await expect(nav).toBeVisible();
      await expect(nav.locator(":scope > *"), `${locale} ${width}px`).toHaveCount(1);
      await expect(nav.locator(":scope > a")).toHaveAttribute("href", `/${locale}/contact`);
    }
  }
});
