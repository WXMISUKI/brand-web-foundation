import { test, expect } from 'playwright/test';
const base = (process.env.PUBLIC_BASE_URL || 'http://localhost:3125').replace(/\/$/, '');
test.beforeEach(async ({ page }) => {
  await page.route('**/*', route => ['GET', 'HEAD'].includes(route.request().method()) ? route.continue() : route.abort());
});

test('contact form recovers from errors and clears after a successful response', async ({ page }) => {
  let outcome = 'network';
  await page.route('**/api/inquiries', route => outcome === 'network'
    ? route.abort('failed')
    : route.fulfill({ status: outcome === 'success' ? 201 : 503, contentType: 'application/json', body: '{"ok":true,"id":1}' }));
  await page.goto(`${base}/en/contact`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
  const form = page.locator('.inquiry-form');
  await form.locator('[name=name]').fill('Isolated browser test');
  await form.locator('[name=email]').fill('test@example.test');
  await form.locator('[name=message]').fill('Isolated browser test');
  await form.locator('[name=consent]').check();
  for (outcome of ['network', 'server', 'success']) {
    await form.locator('button').click();
    await expect(form.locator('[role=status]')).toContainText(outcome === 'success' ? 'recorded' : 'could not confirm');
    await expect(form.locator('button')).toBeEnabled();
    await expect(form.locator('[name=name]')).toHaveValue(outcome === 'success' ? '' : 'Isolated browser test');
  }
});

for (const width of [390, 1280]) {
  test(`homepage carousels and interest tabs work at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${base}/en`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
    const hero = page.locator('.hero');
    const count = hero.locator('.hero-slide-count');
    const initial = await count.textContent();
    await hero.locator('.hero-next').click();
    await expect(count).not.toHaveText(initial);
    await hero.locator('.hero-previous').click();
    await expect(count).toHaveText(initial);
    const toggle = hero.locator('.hero-play');
    const previousLabel = await toggle.getAttribute('aria-label');
    await toggle.click();
    await expect(toggle).not.toHaveAttribute('aria-label', previousLabel);
    const tabs = page.locator('.interest .switches button');
    for (const tab of await tabs.all()) {
      await tab.click();
      await expect(tab).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('.interest-grid').locator('a, .interest-empty').first()).toBeVisible();
    }
    const dots = page.locator('.case-carousel-dots button');
    expect(await dots.count()).toBeGreaterThan(1);
    await dots.nth(1).click();
    await expect(dots.nth(1)).toHaveAttribute('aria-pressed', 'true');
  });

  test(`FAQ, news, insights and case searches work at ${width}px`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/en/faq`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
    const categories = page.locator('.faq-categories button');
    expect(await categories.count()).toBeGreaterThan(1);
    await categories.nth(1).click();
    await expect(categories.nth(1)).toHaveAttribute('aria-pressed', 'true');
    const detail = page.locator('.faq-list details').first();
    await detail.locator('summary').click();
    await expect(detail).toHaveAttribute('open', '');
    await detail.locator('summary').click();
    await expect(detail).not.toHaveAttribute('open', '');
    await page.locator('#faq-query').fill('unmatchedxyz');
    await page.locator('.faq-search button').click();
    await expect(page).toHaveURL(/q=unmatchedxyz/);
    await page.goto(`${base}/en/news`, { waitUntil: 'domcontentloaded' });
    await page.locator('.news-type-tabs a[href*="type=event"]').click();
    await expect(page).toHaveURL(/type=event/);
    await page.locator('#news-query').fill('unmatchedxyz');
    await page.locator('.case-search button').click();
    await expect(page).toHaveURL(/q=unmatchedxyz/);
    await page.goto(`${base}/en/insights`, { waitUntil: 'domcontentloaded' });
    await page.locator('.insight-topics a[href*="topic="]').first().click();
    await expect(page).toHaveURL(/topic=/);
    await page.locator('#insight-query').fill('unmatchedxyz');
    await page.locator('.insight-search button').click();
    await expect(page).toHaveURL(/q=unmatchedxyz/);
    await page.goto(`${base}/en/cases`, { waitUntil: 'domcontentloaded' });
    await page.locator('#case-query').fill('unmatchedxyz');
    await page.locator('.case-search button').click();
    await expect(page).toHaveURL(/q=unmatchedxyz/);
  });
}

test('localized product and editorial search controls operate across all public locales', async ({ page }) => {
  test.setTimeout(360000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ['en', 'he', 'nl', 'fr', 'it', 'es', 'pt', 'el', 'zh', 'ro', 'ru', 'th', 'tr']) {
    await page.goto(`${base}/${locale}/products`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
    const filter = page.locator('.catalog-filters a[href*="category="]').first();
    const category = new URL(await filter.getAttribute('href'), base).searchParams.get('category');
    await filter.click();
    await expect(page, `${locale} category`).toHaveURL(new RegExp(`category=${category}`));
    await page.locator('#product-search').fill('unmatchedxyz');
    await page.locator('.catalog-search button').click();
    await expect(page, `${locale} product query`).toHaveURL(/q=unmatchedxyz/);
    for (const [section, input, form] of [
      ['faq', '#faq-query', '.faq-search'],
      ['news', '#news-query', '.case-search'],
      ['insights', '#insight-query', '.insight-search'],
      ['cases', '#case-query', '.case-search'],
    ]) {
      await page.goto(`${base}/${locale}/${section}`, { waitUntil: 'domcontentloaded' });
      await page.locator(input).fill('unmatchedxyz');
      await page.locator(`${form} button[type=submit]`).click();
      await expect(page, `${locale} ${section} query`).toHaveURL(/q=unmatchedxyz/);
    }
  }
});

for (const width of [390, 1280]) {
  test(`shared navigation, homepage and FAQ respond in all locales at ${width}px`, async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const locale of ['en', 'he', 'nl', 'fr', 'it', 'es', 'pt', 'el', 'zh', 'ro', 'ru', 'th', 'tr']) {
      await page.goto(`${base}/${locale}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.header'), locale).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
      const desktop = page.locator('.header .nav .navigation-menu:visible').first();
      const menu = await desktop.count() ? desktop : page.locator('.header .mobile-menu:visible');
      await menu.locator(':scope > summary').click();
      await expect(menu, `${locale} menu`).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(menu, `${locale} Escape`).not.toHaveAttribute('open', '');
      const count = page.locator('.hero-slide-count');
      const initial = await count.textContent();
      await page.locator('.hero-next').click();
      await expect(count, `${locale} carousel`).not.toHaveText(initial);
      const tab = page.locator('.interest .switches button').nth(1);
      await tab.click();
      await expect(tab, `${locale} interest tab`).toHaveAttribute('aria-pressed', 'true');
      await page.goto(`${base}/${locale}/faq`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
      const detail = page.locator('.faq-list details').first();
      await detail.locator('summary').click();
      await expect(detail, `${locale} FAQ`).toHaveAttribute('open', '');
    }
  });
}
