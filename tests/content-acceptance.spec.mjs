import { test, expect } from 'playwright/test';

const base = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';
const locales = ['en', 'he', 'nl', 'fr', 'it', 'es', 'pt', 'el', 'zh', 'ro', 'ru', 'th', 'tr'];

test('unavailable subscription and application entries are hidden', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of locales) {
      await page.goto(`${base}/${locale}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.home-newsletter')).toHaveCount(0);
      const contact = page.locator('.contact-callout');
      const button = contact.locator('a');
      await expect(button).toHaveAttribute('href', /^mailto:[^@]+@[^@]+/);
      await expect(button).toBeVisible();
      await button.focus();
      await expect(button).toBeFocused();
      const box = await button.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(48);
      expect(box.width).toBeLessThanOrEqual(width - 20);
      await expect(contact.locator('.home-newsletter-input')).toHaveCount(0);
      await expect(page.locator('a[href*="#newsletter-title"]')).toHaveCount(0);
      await expect(page.locator('a[href*="#mobile-tools"], a[href*="#web-tools"]')).toHaveCount(0);
    }
  }
});

test('Spanish crop navigation opens crop links', async ({ page }) => {
  await page.setViewportSize({ width: 1910, height: 900 });
  await page.goto(`${base}/es`, { waitUntil: 'domcontentloaded' });
  const menu = page.locator('details.navigation-menu').filter({ has: page.locator('.navigation-panel--crops') });
  await menu.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(menu.locator('a[href="/es/solutions/corn"]')).toBeVisible();
  await expect(menu.locator('a[href="/es/about"]')).toHaveCount(0);
});

test('crop cards use distinct available images across languages', async ({ page }) => {
  for (const locale of ['en', 'zh', 'he', 'es']) {
    await page.goto(`${base}/${locale}`, { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.interest-card-image');
    const images = await cards.evaluateAll(nodes => nodes.map(node => node.style.getPropertyValue('--card-image')));
    expect(images.length).toBeGreaterThan(20);
    expect(new Set(images).size).toBe(images.length);
    expect(images.every(Boolean)).toBe(true);
    await expect(page.locator('.interest-image-credit')).toHaveCount(0);
    const urls = images.map(value => value.match(/url\(["']?(.+?)["']?\)/)?.[1]);
    for (const url of urls) expect((await page.request.get(new URL(url, base).href)).ok()).toBeTruthy();
  }
});

test('Chinese company name is consistent on key sample pages', async ({ page }) => {
  for (const path of ['', '/about', '/contact', '/faq']) {
    await page.goto(`${base}/zh${path}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).not.toContainText('安徽康母');
    await expect(page.locator('body')).toContainText('安徽康坶');
    await expect(page).not.toHaveTitle(/安徽康母/);
  }
});

for (const [name, width] of [['desktop', 1280], ['mobile', 390]]) {
  test(`Chinese header visual baseline: ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/zh/about`, { waitUntil: 'networkidle' });
    await expect(page.locator('header.header')).toHaveScreenshot(`header-zh-${name}.png`, { animations: 'disabled' });
  });
}
