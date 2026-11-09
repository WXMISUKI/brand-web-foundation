import assert from "node:assert/strict";
import { test } from "node:test";

// Start a sample-data development server with CMS_EVAL=1 at PREVIEW_EVAL_URL.
const base = process.env.PREVIEW_EVAL_URL || "http://localhost:3123";
const get = async (path, expected = 200) => {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, expected, `${path}: unexpected status`);
  return response.text();
};

test("French preview links connect the home page, solutions and tools", async () => {
  const english = await get("/en");
  assert.ok([...english.matchAll(/<a\b[^>]*>/gi)].some(([tag]) => /href="\/fr"/i.test(tag) && /hreflang="fr"/i.test(tag)), "French language link missing");
  const home = await get("/fr");
  assert.match(home, /<html[^>]*lang="fr"/);
  assert.match(home, /<meta name="robots" content="index, follow"/);
  for (const path of ["/fr/products", "/fr/solutions/fruit-trees", "/fr/smart-farming", "/fr/insights", "/fr/cases", "/fr/news"]) {
    assert.ok(home.includes(`href="${path}"`), `missing homepage link ${path}`);
    await get(path);
  }
  const solution = await get("/fr/solutions/fruit-trees");
  assert.match(solution, /href="\/fr"/);
  assert.match(solution, /id="crop-stages"/);
  await get("/fr/solutions/not-a-solution", 404);
});
