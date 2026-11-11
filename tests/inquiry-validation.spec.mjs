import { test, expect } from 'playwright/test';

test('invalid inquiry JSON shapes receive a client error without saving data', async ({ request }) => {
  for (const value of [null, [], 'text', 1, true, {}]) {
    const response = await request.post('http://localhost:3125/api/inquiries', { data: JSON.stringify(value), headers: { 'Content-Type': 'application/json' } });
    expect(response.status(), `body ${JSON.stringify(value)}`).toBe(400);
    expect((await response.json()).ok).toBe(false);
  }
  const badJson = await request.post('http://localhost:3125/api/inquiries', { data: '{', headers: { 'Content-Type': 'application/json' } });
  expect(badJson.status()).toBe(400);
});
