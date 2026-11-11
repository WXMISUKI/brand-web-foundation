import { test, expect } from 'playwright/test';

const base = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';

test('key pages fit desktop and mobile and load visible images', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['zh', 'en', 'he', 'es']) {
      for (const route of ['', '/about', '/contact', '/solutions']) {
        const response = await page.goto(`${base}/${locale}${route}`, { waitUntil: 'domcontentloaded' });
        expect(response.status(), `${locale}${route}`).toBe(200);
        const sizes = await page.evaluate(() => ({ viewport: innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
        expect(sizes.html, `${locale}${route} at ${width}`).toBeLessThanOrEqual(sizes.viewport);
        expect(sizes.body, `${locale}${route} at ${width}`).toBeLessThanOrEqual(sizes.viewport);
        const link = page.locator('.contact-callout-button');
        const box = await link.boundingBox();
        expect(box.width).toBeLessThanOrEqual(width);
        expect(box.height).toBeGreaterThanOrEqual(48);
        const broken = await page.locator('img').evaluateAll(images => images.filter(img => {
          const r = img.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.top < innerHeight && img.complete && !img.naturalWidth;
        }).map(img => img.currentSrc));
        expect(broken, `${locale}${route} at ${width}`).toEqual([]);
      }
    }
  }
});
