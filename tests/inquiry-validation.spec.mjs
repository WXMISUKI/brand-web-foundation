import { test, expect } from 'playwright/test';
import { DatabaseSync } from 'node:sqlite';

test('valid inquiry is accepted by the isolated local database', async ({ request }) => {
  const response = await request.post('http://localhost:3125/api/inquiries', {
    data: { name: 'Local test', email: 'local@example.test', message: 'Isolated inquiry acceptance test', consent: true },
  });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(typeof body.id).toBe('number');
  const db = new DatabaseSync('.local/inquiry-acceptance.sqlite', { readOnly: true });
  try {
    const record = db.prepare('SELECT name, email, message, consent, status FROM inquiries WHERE id = ?').get(body.id);
    expect(record).toMatchObject({ name: 'Local test', email: 'local@example.test', message: 'Isolated inquiry acceptance test', consent: 1, status: 'new' });
  } finally {
    db.close();
  }
});

test('invalid inquiry JSON shapes receive a client error without saving data', async ({ request }) => {
  for (const value of [null, [], 'text', 1, true, {}]) {
    const response = await request.post('http://localhost:3125/api/inquiries', { data: JSON.stringify(value), headers: { 'Content-Type': 'application/json' } });
    expect(response.status(), `body ${JSON.stringify(value)}`).toBe(400);
    expect((await response.json()).ok).toBe(false);
  }
  const badJson = await request.post('http://localhost:3125/api/inquiries', { data: '{', headers: { 'Content-Type': 'application/json' } });
  expect(badJson.status()).toBe(400);
});

test('contact form records the submitted inquiry in the isolated database', async ({ page }) => {
  await page.goto('http://localhost:3125/en/contact', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
  const form = page.locator('.inquiry-form');
  await form.locator('[name=name]').fill('Browser test');
  await form.locator('[name=email]').fill('browser@example.test');
  await form.locator('[name=country]').fill('Test market');
  await form.locator('[name=message]').fill('Isolated browser inquiry');
  await form.locator('[name=consent]').check();
  const [response] = await Promise.all([page.waitForResponse(r => r.url().endsWith('/api/inquiries') && r.request().method() === 'POST'), form.locator('button').click()]);
  expect(response.status()).toBe(201);
  const result = await response.json();
  await expect(form.locator('[role=status]')).toContainText('recorded');
  await expect(form.locator('[name=name]')).toHaveValue('');
  const db = new DatabaseSync('.local/inquiry-acceptance.sqlite', { readOnly: true });
  try {
    const row = db.prepare('SELECT name, email, country, message, locale, source_path, consent, status FROM inquiries WHERE id = ?').get(result.id);
    expect(row).toMatchObject({ name: 'Browser test', email: 'browser@example.test', country: 'Test market', message: 'Isolated browser inquiry', locale: 'en', source_path: '/en/contact', consent: 1, status: 'new' });
  } finally { db.close(); }
});

test('repeated submission while a request is pending creates only one request', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/inquiries', async route => {
    requests++;
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.fulfill({ status: 201, contentType: 'application/json', body: '{"ok":true,"id":1}' });
  });
  await page.goto('http://localhost:3125/en/contact', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
  const form = page.locator('.inquiry-form');
  await form.locator('[name=name]').fill('Local test');
  await form.locator('[name=email]').fill('test@example.test');
  await form.locator('[name=message]').fill('Local validation');
  await form.locator('[name=consent]').check();
  await form.evaluate(node => { node.requestSubmit(); node.requestSubmit(); });
  await expect(form.locator('[role=status]')).toContainText('recorded');
  expect(requests).toBe(1);
});

test('fields cannot be edited during submission and are restored after failure', async ({ page }) => {
  await page.route('**/api/inquiries', async route => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await route.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' });
  });
  await page.goto('http://localhost:3125/en/contact', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
  const form = page.locator('.inquiry-form');
  await form.locator('[name=name]').fill('Local test');
  await form.locator('[name=email]').fill('test@example.test');
  await form.locator('[name=message]').fill('Local validation');
  await form.locator('[name=consent]').check();
  await form.locator('button').click();
  await expect(form.locator('[name=message]')).toBeDisabled();
  await expect(form.locator('[role=status]')).toContainText('could not confirm');
  await expect(form.locator('[name=message]')).toBeEnabled();
  await expect(form.locator('[name=message]')).toHaveValue('Local validation');
});

for (const outcome of ['network failure', 'timeout', 'server failure', 'invalid success', 'success']) {
  test(`inquiry form handles ${outcome}`, async ({ page }) => {
    if (outcome === 'timeout') await page.addInitScript(() => {
      const original = window.setTimeout;
      window.setTimeout = (handler, delay, ...args) => original(handler, delay === 30000 ? 100 : delay, ...args);
    });
    await page.route('**/api/inquiries', async route => {
      if (outcome === 'network failure') return route.abort('failed');
      if (outcome === 'timeout') { await new Promise(resolve => setTimeout(resolve, 1500)); return route.abort('failed').catch(() => {}); }
      return route.fulfill({ status: outcome === 'success' ? 201 : outcome === 'invalid success' ? 200 : 503, contentType: 'application/json', body: outcome === 'invalid success' ? '{"ok":false}' : '{"ok":true,"id":1}' });
    });
    await page.goto('http://localhost:3125/en/contact', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true');
    const form = page.locator('.inquiry-form');
    await form.locator('[name=name]').fill('Local test');
    await form.locator('[name=email]').fill('test@example.test');
    await form.locator('[name=message]').fill('Local validation');
    await form.locator('[name=consent]').check();
    await form.locator('button').click();
    await expect(form.locator('[role=status]')).toContainText(outcome === 'success' ? 'recorded' : 'could not confirm');
    await expect(form.locator('button')).toBeEnabled();
    await expect(form.locator('[name=name]')).toHaveValue(outcome === 'success' ? '' : 'Local test');
  });
}

test('all public locales show an actionable error without clearing the form', async ({ page }) => {
  test.setTimeout(180000);
  await page.route('**/api/inquiries', route => route.abort('failed'));
  for (const locale of ['en', 'he', 'nl', 'fr', 'it', 'es', 'pt', 'el', 'zh', 'ro', 'ru', 'th', 'tr']) {
    await page.goto(`http://localhost:3125/${locale}/contact`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.header')).toHaveAttribute('data-scroll-ready', 'true', { timeout: 30000 });
    const form = page.locator('.inquiry-form');
    await form.locator('[name=name]').fill('Local test');
    await form.locator('[name=email]').fill('test@example.test');
    await form.locator('[name=message]').fill('Local validation');
    await form.locator('[name=consent]').check();
    await form.locator('button').click();
    await expect(form.locator('[role=status]'), locale).toContainText(/whatsapp/i);
    await expect(form.locator('[name=message]'), locale).toHaveValue('Local validation');
    await expect(form.locator('button'), locale).toBeEnabled();
  }
});
