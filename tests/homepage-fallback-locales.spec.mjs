import { test, expect } from 'playwright/test';
import { readFile } from 'node:fs/promises';

const base = process.env.LOCAL_REVIEW_URL || 'http://localhost:3125';
const files = ['homepage-staging.json', 'homepage-localizations-phase1.json', 'homepage-localizations-phase2.json', 'homepage-localizations-phase3.json'];

test('homepage fallback displays the selected language and public-facing copy', async ({ page }) => {
  test.setTimeout(120000);
  const sources = await Promise.all(files.map(file => readFile(new URL(`../src/data/${file}`, import.meta.url), 'utf8').then(JSON.parse)));
  for (const source of sources) {
    for (const [locale, slides] of Object.entries(source.slides)) {
      await page.goto(`${base}/${locale}`, { waitUntil: 'domcontentloaded' });
      const hero = page.locator('.hero');
      await hero.locator('.hero-play').focus();
      for (const [index, slide] of slides.entries()) {
        await expect(hero.locator('h1')).toHaveText(slide.title);
        await expect(hero.locator('.hero-content p')).toHaveText(slide.description);
        if (index < slides.length - 1) await hero.locator('.hero-next').click();
      }
      const cards = page.locator('.home-feature-card');
      await expect(cards).toHaveCount(3);
      const images = await cards.locator('img').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
      expect(new Set(images).size).toBe(3);
      for (const src of images) expect((await page.request.get(new URL(src, base).href)).ok()).toBeTruthy();
      for (const [index, card] of source.featured[locale].entries()) {
        await expect(cards.nth(index).locator('h2')).toHaveText(card.title);
        await expect(cards.nth(index).locator('p')).toHaveText(card.description);
      }
    }
  }
});
