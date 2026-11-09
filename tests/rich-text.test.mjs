import assert from "node:assert/strict";
import { test } from "node:test";
import { indexRichBody, plainTextToRichText, readLegacyBody } from "../src/content/rich-text.ts";
import { richInternalHref } from "../src/data/rich-link.ts";

test("legacy multiline text becomes editable paragraphs without losing text", () => {
  const doc = readLegacyBody({ doc: { body: "First line\n\n中文内容", richBody: null } });
  assert.deepEqual(doc.richBody.root.children.map(paragraph => paragraph.children[0]?.text ?? ""), ["First line", "", "中文内容"]);
});

test("rich text updates its search index and explicit clearing removes old text", () => {
  const richBody = plainTextToRichText("Example body\n中文内容");
  const updated = indexRichBody({ data: { richBody }, operation: "update" });
  assert.match(updated.body, /Example body/);
  assert.match(updated.body, /中文内容/);
  assert.equal(indexRichBody({ data: { richBody: null }, operation: "update" }).body, "");
});

test("legacy create preserves text when rich text is absent", () => {
  const result = indexRichBody({ data: { body: "Legacy", richBody: null }, operation: "create" });
  assert.equal(result.body, "Legacy");
});

test("internal links use localized public routes and ignore missing targets", () => {
  assert.equal(richInternalHref("en", "products", { slug: "alpha beta" }), "/en/products/alpha%20beta");
  assert.equal(richInternalHref("zh", "categories", { slug: "fertilizer" }), "/zh/products?category=fertilizer");
  assert.equal(richInternalHref("zh", "news", { slug: "update" }), "/zh/news/update");
  assert.equal(richInternalHref("es", "news", { slug: "update" }), "/es/news/update");
  assert.equal(richInternalHref("es", "insights", { slug: "topic" }), "/es/insights/topic");
  assert.equal(richInternalHref("es", "cases", { slug: "story" }), "/es/cases/story");
  assert.equal(richInternalHref("en", "users", { slug: "admin" }), null);
  assert.equal(richInternalHref("en", "products", 123), null);
});
