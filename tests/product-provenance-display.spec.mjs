import { test, expect } from 'playwright/test';
import flbook from '../src/data/flbook-import.json' with { type: 'json' };
const base = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';
const forbidden = /画册|原官网|来源页|brochure[ -]page|source[ -]page|brochure[ -]linked|owner.provided/i;

test('sample product cards and details avoid provenance language', async ({ page }) => {
  test.setTimeout(120000);
  for (const locale of ['zh', 'en']) {
    await page.goto(`${base}/${locale}`, { waitUntil:'domcontentloaded' });
    const summaries = await page.locator('.home-product-card p').allTextContents();
    expect(summaries.length).toBe(10);
    for (const summary of summaries) expect(summary).not.toMatch(forbidden);
    const images = await page.locator('.home-product-card img').evaluateAll(nodes => nodes.map(node => node.alt));
    for (const alt of images) expect(alt).not.toMatch(forbidden);
    await page.goto(`${base}/${locale}/products`, { waitUntil:'domcontentloaded' });
    await expect(page.locator('.catalog-overview')).not.toContainText(forbidden);
    for (const product of flbook.products) {
      await page.goto(`${base}/${locale}/products/${product.slug}`, { waitUntil:'domcontentloaded' });
      await expect(page.locator('main')).not.toContainText(forbidden);
      await expect(page.locator('.detail-intro h1')).not.toBeEmpty();
    }
  }
});
