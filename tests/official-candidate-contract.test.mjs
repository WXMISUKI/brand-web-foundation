import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));

test("official candidate inventory remains unpublished and source-traceable", () => {
  assert.equal(source.count, 28);
  assert.equal(source.products.length, 28);
  const duplicateNames = new Map();
  for (const product of source.products) {
    assert.match(product.sourceUrl, /^http:\/\/m\.zgkomu\.cn\/display\/\d+\.html$/);
    assert.match(product.imageUrl, /^http:\/\/m\.zgkomu\.cn\/u\/.+\/image\/.+\.(?:jpg|png)$/);
    assert.equal(product.reviewStatus, "owner-review");
    assert.equal(product.published, false);
    duplicateNames.set(product.name, (duplicateNames.get(product.name) ?? 0) + 1);
  }
  assert.equal([...duplicateNames.values()].filter(count => count > 1).length, 3);
});
