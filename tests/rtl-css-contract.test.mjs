import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

test("RTL CSS contract covers shared layouts and directional decoration", async () => {
  const css = await readFile(new URL("../src/app/styles.css", import.meta.url), "utf8");
  for (const selector of [":dir(rtl) body", ":dir(rtl) .product-detail-layout", ":dir(rtl) .faq-layout", ":dir(rtl) .contact-layout", ":dir(rtl) .crop-guide-nav", ":dir(rtl) .mobile-menu nav"]) {
    assert.ok(css.includes(selector), `missing RTL selector: ${selector}`);
  }
  assert.match(css, /:dir\(rtl\) \.detail-banner[^{]*\{[^}]*linear-gradient\(270deg/);
  assert.match(css, /:dir\(rtl\) \.faq-list summary::after[^{]*\{[^}]*float: left/);
});
