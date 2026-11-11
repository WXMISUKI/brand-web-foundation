import { test, expect } from 'playwright/test';
import { readFile } from 'node:fs/promises';

test('admin locale control is hidden until its locale is available', async ({ page }) => {
  const css = await readFile('src/app/(payload)/admin-locale.css', 'utf8');
  await page.setContent(`<style>${css}</style><button class="popup-button"><div class="localizer-button"><span>undefined</span></div></button>`);
  const button = page.locator('button');
  await expect(button).toBeHidden();
  await page.locator('.localizer-button').evaluate(node => { node.dataset.locale = 'en'; node.textContent = '英语'; });
  await expect(button).toBeVisible();
  await expect(button).toContainText('英语');
});
