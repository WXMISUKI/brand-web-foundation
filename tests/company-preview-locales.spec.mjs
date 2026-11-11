import { test, expect } from 'playwright/test';
import { checkContentFields } from '../scripts/content-quality-rules.mjs';
const base = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';
const locales = ['en','zh','he','nl','fr','it','es','pt','el','ro','ru','th','tr'];

test('company preview is localized and excludes known internal copy', async ({ page }) => {
  test.setTimeout(120000);
  for (const locale of locales) {
    await page.goto(`${base}/${locale}/about`, { waitUntil: 'domcontentloaded' });
    const description = page.locator('.company-description');
    await expect(description).not.toBeEmpty();
    const texts = await page.locator('.company-description, .about-theme-grid p').allTextContents();
    expect(texts.length, locale).toBe(4);
    expect(checkContentFields(texts.map((value, index) => ({ path: `${locale}.${index}`, value })))).toEqual([]);
    if (locale !== 'zh') expect(texts.join('')).not.toContain('安徽康母');
  }
});
