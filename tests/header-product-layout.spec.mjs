import { test, expect } from 'playwright/test';
const baseURL = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';

test('desktop menus open on click, not hover, and remain open while entering the panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/en`, { waitUntil: 'domcontentloaded' });
  for (const menu of await page.locator('.nav .navigation-menu').all()) {
    const summary = menu.locator('summary');
    await summary.hover();
    await expect(menu).not.toHaveAttribute('open', '');
    await summary.click();
    await expect(menu).toHaveAttribute('open', '');
    const box = await menu.locator('.navigation-panel').boundingBox();
    const trigger = await summary.boundingBox();
    await page.mouse.move(Math.max(box.x + 5, Math.min(trigger.x + trigger.width / 2, box.x + box.width - 5)), box.y + 10, { steps: 15 });
    await expect(menu).toHaveAttribute('open', '');
    await page.mouse.move(700, 700);
    await summary.click();
    await expect(menu).not.toHaveAttribute('open', '');
    await page.mouse.move(700, 700);
  }
});

test('tall product images stay inside their visual container', async ({ page }) => {
  await page.goto(`${baseURL}/en/products/series/medium-elements`);
  const dimensions = await page.evaluate(async () => {
    const visual = document.querySelector('.product-visual');
    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="1500"></svg>';
    visual.replaceChildren(image);
    await image.decode();
    const a = visual.getBoundingClientRect(), b = image.getBoundingClientRect();
    return { top: b.top - a.top, bottom: a.bottom - b.bottom };
  });
  expect(dimensions.top).toBeGreaterThanOrEqual(-1);
  expect(dimensions.bottom).toBeGreaterThanOrEqual(-1);
});

test('menus support click switching, keyboard, and language selection', async ({ page }) => {
  await page.setViewportSize({ width: 1910, height: 900 });
  for (const locale of ['en', 'he', 'es']) {
    await page.goto(`${baseURL}/${locale}`, { waitUntil: 'domcontentloaded' });
    const menus = page.locator('.nav .navigation-menu');
    await menus.nth(0).locator('summary').click();
    await expect(menus.nth(0)).toHaveAttribute('open', '');
    await menus.nth(1).locator('summary').click();
    await expect(menus.nth(1)).toHaveAttribute('open', '');
    await expect(menus.nth(0)).not.toHaveAttribute('open', '');
    await page.mouse.move(700, 700);
    const summary = menus.nth(0).locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(menus.nth(0)).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(menus.nth(0)).not.toHaveAttribute('open', '');
    await expect(summary).toBeFocused();
    const language = page.locator('.nav .language-menu');
    await language.locator('summary').click();
    await expect(language).toHaveAttribute('open', '');
    await expect(language.locator('ul a').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(language).not.toHaveAttribute('open', '');
  }
});

test('product images remain contained across layouts and screen sizes', async ({ page }) => {
  for (const width of [390, 768, 1280, 1910]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/en', '/en/products', '/en/products/series/medium-elements', '/he/products']) {
      await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true');
      const results = await page.locator('.product-visual').evaluateAll(async visuals => {
        return Promise.all(visuals.map(async visual => {
          const image = document.createElement('img');
          image.className = 'product-image';
          image.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="1500"></svg>';
          visual.replaceChildren(image);
          await image.decode();
          const a = visual.getBoundingClientRect(), b = image.getBoundingClientRect();
          return { top: b.top - a.top, bottom: a.bottom - b.bottom, left: b.left - a.left, right: a.right - b.right };
        }));
      });
      expect(results.length, `${path} at ${width}px product visuals`).toBeGreaterThan(0);
      for (const result of results) for (const distance of Object.values(result)) expect(distance, `${path} at ${width}px`).toBeGreaterThanOrEqual(-1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${path} at ${width}px horizontal overflow`).toBeLessThanOrEqual(1);
    }
  }
});

test('source product image fits and mobile menu remains usable', async ({ page }) => {
  for (const width of [390, 1910]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/en/products/series/medium-elements`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true');
    const result = await page.locator('.product-visual').first().evaluate(async visual => {
      const image = document.createElement('img');
      image.className = 'product-image';
      image.src = '/images/flbook-pages/page-20-product.jpg';
      visual.replaceChildren(image);
      await image.decode();
      const a = visual.getBoundingClientRect(), b = image.getBoundingClientRect();
      return { top: b.top - a.top, bottom: a.bottom - b.bottom, left: b.left - a.left, right: a.right - b.right, loaded: image.naturalWidth > 0 };
    });
    expect(result.loaded).toBe(true);
    for (const side of ['top', 'bottom', 'left', 'right']) expect(result[side], `${side} at ${width}px`).toBeGreaterThanOrEqual(-1);
    if (width === 390) {
      const menu = page.locator('.header .mobile-menu');
      await menu.locator(':scope > summary').click();
      await expect(menu).toHaveAttribute('open', '');
      await expect(menu.locator('nav a').first()).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(menu).not.toHaveAttribute('open', '');
    }
  }
});
