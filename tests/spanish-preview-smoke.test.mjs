import assert from "node:assert/strict";
import { test } from "node:test";

// Start a sample-data development server with CMS_EVAL=1 at PREVIEW_EVAL_URL.
const base = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const get = async (path, expected = 200) => {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, expected, `${path}: unexpected status`);
  return response.text();
};

test("Spanish preview connects implemented page types", async () => {
  const english = await get("/en");
  assert.ok([...english.matchAll(/<a\b[^>]*>/gi)].some(([tag]) => /href="\/es"/i.test(tag) && /hreflang="es"/i.test(tag)));
  const home = await get("/es");
  assert.match(home, /<html[^>]*lang="es"/);
  assert.match(home, /<meta name="robots" content="index, follow"/);
  for (const path of ["/es/products", "/es/solutions/vegetables", "/es/smart-farming", "/es/insights", "/es/cases", "/es/news", "/es/search", "/es/sustainability"]) {
    assert.ok(home.includes(`href="${path}"`), `missing homepage link ${path}`);
    await get(path);
  }
  await get("/es/solutions/not-a-solution", 404);
});
