import { test, expect } from 'playwright/test';

test('visible desktop navigation never overlaps the brand', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [1024, 1100, 1280, 1440, 1910]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['en','he','nl','fr','it','es','pt','el','zh','ro','ru','th','tr']) {
      await page.goto(`${process.env.LOCAL_REVIEW_URL || 'http://localhost:3125'}/${locale}`, { waitUntil: 'domcontentloaded' });
      const overlaps = await page.evaluate(() => {
        const brand = document.querySelector('.header .brand');
        if (!brand) return ['missing brand'];
        const a = brand.getBoundingClientRect();
        return [...document.querySelectorAll('.header .nav > a, .header .nav > details > summary, .header .nav > form, .header .nav > .language-menu')].filter(element => {
          const b = element.getBoundingClientRect(), style = getComputedStyle(element);
          return style.display !== 'none' && b.width > 0 && b.height > 0 && Math.min(a.right,b.right) > Math.max(a.left,b.left)+2 && Math.min(a.bottom,b.bottom) > Math.max(a.top,b.top)+2;
        }).map(element => element.textContent.trim().slice(0, 50));
      });
      expect(overlaps, `${locale} at ${width}px`).toEqual([]);
    }
  }
});
