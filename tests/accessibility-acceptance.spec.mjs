import { test, expect } from 'playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const [viewport, width] of [['mobile', 390], ['desktop', 1280]]) {
  test(`Chinese key pages pass automated accessibility checks: ${viewport}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/zh', '/zh/about', '/zh/contact']) {
      await page.goto(`http://localhost:3125${path}`, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) })), path).toEqual([]);
    }
  });
}
