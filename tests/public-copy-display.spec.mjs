import { test, expect } from "playwright/test";

const base = (process.env.PUBLIC_BASE_URL || "http://localhost:3118").replace(/\/$/, "");

test("company page uses direct descriptions without review-workflow wording", async ({ page }) => {
  await page.goto(`${base}/zh/about`, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".company-description")).not.toContainText(/原官网|来源页面|待核验|owner.review/i);
  await expect(page.locator(".about-theme-grid")).not.toContainText(/原官网|待审核|owner.review|技术 claims/i);
});

test("public product and solution pages omit internal review notes", async ({ page }) => {
  for (const locale of ["en", "zh"]) {
    for (const route of ["/products/series", "/solutions"]) {
      await page.goto(`${base}/${locale}${route}`, { waitUntil: "domcontentloaded" });
      await expect(page.locator(".reference-review-note")).toHaveCount(0);
      await expect(page.locator(".reference-index-banner > small")).toHaveCount(0);
    }
    await page.goto(`${base}/${locale}/products`, { waitUntil: "domcontentloaded" });
    const product = page.locator(`a[href^="/${locale}/products/"]`).filter({ has: page.locator(".product-visual") }).first();
    await product.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/products/[^/?#]+`), { timeout: 30000 });
    await expect(page.locator(".detail-intro")).toBeVisible({ timeout: 30000 });
    await expect(page.locator(".detail-intro")).not.toContainText(/owner-provided|业主提供|原官网|owner.review/i);
  }
});
