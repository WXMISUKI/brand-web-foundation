import assert from "node:assert/strict";
import { test } from "node:test";
import { heroHref } from "../src/data/hero-link.ts";

test("homepage action links stay within the chosen language", () => {
  assert.equal(heroHref("en", "/products?category=water"), "/en/products?category=water");
  assert.equal(heroHref("zh", "/#applications"), "/zh/#applications");
  assert.equal(heroHref("en", "//example.com"), null);
  assert.equal(heroHref("en", "/\\example.com"), null);
  assert.equal(heroHref("zh", "/en/products"), null);
  assert.equal(heroHref("en", "/fr/products"), null);
  assert.equal(heroHref("en", "/HE?x=1"), null);
  assert.equal(heroHref("fr", "/products?category=water"), "/fr/products?category=water");
  assert.equal(heroHref("es", "/products"), "/es/products");
  assert.equal(heroHref("es", "/about"), "/es/about");
  assert.equal(heroHref("es", "/solutions/greenhouse"), "/es/solutions/greenhouse");
  assert.equal(heroHref("es", "/smart-farming"), "/es/smart-farming");
  assert.equal(heroHref("es", "/search"), "/es/search");
  assert.equal(heroHref("es", "/not-open"), null);
});
