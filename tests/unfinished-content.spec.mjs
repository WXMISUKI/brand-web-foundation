import { test, expect } from 'playwright/test';
const base = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';
const locales = ['en', 'he', 'nl', 'fr', 'it', 'es', 'pt', 'el', 'zh', 'ro', 'ru', 'th', 'tr'];

test('unfinished sustainability entry is hidden and direct links stay usable', async ({ page }) => {
  test.setTimeout(120000);
  for (const locale of locales) {
    await page.goto(`${base}/${locale}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`a[href="/${locale}/sustainability"]`)).toHaveCount(0);
    const response = await page.goto(`${base}/${locale}/sustainability`, { waitUntil: 'domcontentloaded' });
    expect(response.status()).toBe(200);
    await expect(page.locator('main h1')).not.toBeEmpty();
    await expect(page.locator('main .sustainability-intro')).not.toBeEmpty();
    await expect(page.locator('.sustainability-grid')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/等待业主|专题预览|await owner|TOPIC PREVIEW/i);
  }
});

test('sample FAQ uses localised questions and meaningful answers', async ({ page }) => {
  test.setTimeout(120000);
  for (const locale of locales) {
    await page.goto(`${base}/${locale}/faq`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.faq-categories button')).toHaveCount(3);
    const first = page.locator('.faq-list details').first();
    await expect(first.locator('summary')).not.toBeEmpty();
    await first.locator('summary').click();
    await expect(first.locator('.news-body')).not.toBeEmpty();
    await expect(first.locator('.news-body')).not.toContainText(/等待业主|await owner/i);
  }
});
