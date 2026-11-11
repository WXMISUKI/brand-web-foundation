import assert from "node:assert/strict";
import { test } from "node:test";
import { featuredMediaForLocale } from "../src/data/featured-media.mjs";
import { heroMediaForLocale } from "../src/data/hero-media-locale.mjs";
import { englishSolutionImages, solutionImages } from "../src/data/section-media.ts";
import { solutions } from "../src/data/solutions.ts";

test("English featured cards replace only the two known embedded-text banners", () => {
  const old = { src: "/api/media/file/hero-01.jpg", alt: "original" };
  assert.deepEqual(featuredMediaForLocale("en", old), { src: "/images/official-site/company-products.jpg", alt: "KOMU product display" });
  assert.equal(featuredMediaForLocale("en", { src: "/api/media/file/hero-02.jpg?v=1", alt: "original" }).src, "/images/third-party/commons-wheat-texas.webp");
  assert.equal(featuredMediaForLocale("zh", old), old);
  const edited = { src: "/api/media/file/custom-hero-01.jpg", alt: "edited" };
  assert.equal(featuredMediaForLocale("en", edited), edited);
  assert.equal(featuredMediaForLocale("en", null), null);
});

test("English hero replaces the exact Chinese technology banner and leaves Chinese media unchanged", () => {
  const banner = "/images/official-site/technology.jpg";
  assert.equal(heroMediaForLocale("en", banner), "/images/third-party/commons-wheat-texas.webp");
  assert.equal(heroMediaForLocale("zh", banner), banner);
  assert.equal(heroMediaForLocale("en", "/images/official-site/company-research.jpg"), "/images/official-site/company-research.jpg");
});

test("English solution scenes cover every route without changing non-English source mapping", () => {
  for (const solution of solutions) {
    assert.ok(englishSolutionImages[solution.slug], `missing English scene for ${solution.slug}`);
    assert.ok(solutionImages[solution.slug], `missing source scene for ${solution.slug}`);
  }
  assert.match(englishSolutionImages.greenhouse, /illustrative\/greenhouse-scene-v1\.webp$/);
  assert.match(englishSolutionImages.fertigation, /illustrative\/fertigation-scene-v1\.webp$/);
  assert.match(englishSolutionImages.corn, /illustrative\/corn-field-v2\.webp$/);
  assert.match(englishSolutionImages["sugar-beet"], /illustrative\/sugar-beet-field-v2\.webp$/);
  assert.match(englishSolutionImages.garlic, /illustrative\/garlic-field-v2\.webp$/);
  assert.notEqual(englishSolutionImages["sugar-beet"], englishSolutionImages.garlic);
  assert.notEqual(englishSolutionImages.greenhouse, solutionImages.greenhouse);
  assert.equal(solutionImages.greenhouse, "/images/official-site/hero-02.jpg");
});
