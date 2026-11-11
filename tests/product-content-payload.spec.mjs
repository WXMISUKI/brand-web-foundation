import { test, expect } from 'playwright/test';
const base = process.env.PRODUCT_FIXTURE_URL || 'http://localhost:3127';

test('isolated Payload product pages clean historical copy and keep API protected', async ({ page, request }) => {
  expect((await request.get(`${base}/api/products`)).status()).toBe(403);
  await page.goto(`${base}/fr/products/official-569683`, { waitUntil:'domcontentloaded' });
  await expect(page.locator('main h1')).toHaveText('KOMU · Engrais composé 15-5-20 · 569683');
  await expect(page.locator('.detail-intro')).not.toContainText(/official KOMU product center|formal review|复合肥料/i);
  await page.goto(`${base}/en/products/qa-suspended`, { waitUntil:'domcontentloaded' });
  await expect(page.locator('.detail-intro')).toContainText('120-60-400+TE');
  await expect(page.locator('.detail-facts')).toContainText('10 kg');
  for (const selector of ['.detail-intro', '.detail-facts']) await expect(page.locator(selector)).not.toContainText(/source[ -]page|brochure page|needs current-sheet|await review/i);
});
