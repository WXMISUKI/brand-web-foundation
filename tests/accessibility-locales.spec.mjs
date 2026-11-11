import { test, expect } from 'playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage and contact meet automated accessibility rules across locales', async ({ page }) => {
  test.setTimeout(300000);
  const findings = [];
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['en','he','nl','fr','it','es','pt','el','zh','ro','ru','th','tr']) {
      for (const path of ['', '/contact']) {
        await page.goto(`http://localhost:3125/${locale}${path}`, { waitUntil: 'networkidle' });
        const report = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
        for (const violation of report.violations) findings.push({ locale, width, path: path || '/', rule: violation.id, targets: violation.nodes.map(node => node.target) });
      }
    }
  }
  expect(findings).toEqual([]);
});
