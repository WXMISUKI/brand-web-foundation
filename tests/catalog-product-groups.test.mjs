import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { canonicalProductSlug, productAliasSlugs, uniqueSourceMedia } from "../src/data/catalog-product-groups.ts";

const candidates = JSON.parse(fs.readFileSync(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const candidateById = new Map(candidates.products.map(item => [item.sourceUrl.match(/display\/(\d+)\.html/)?.[1], item]));

test("same-name official source records share one catalog slug and retain both images", () => {
  const duplicateGroups = [
    { canonical: "official-569687", alias: "official-569688" },
    { canonical: "official-569693", alias: "official-569692" },
  ];

  for (const { canonical, alias } of duplicateGroups) {
    assert.equal(canonicalProductSlug(alias), canonical);
    assert.deepEqual(productAliasSlugs(canonical), [alias]);
    assert.equal(candidateById.get(canonical.slice("official-".length)).name, candidateById.get(alias.slice("official-".length)).name);
    assert.notEqual(candidateById.get(canonical.slice("official-".length)).imageUrl, candidateById.get(alias.slice("official-".length)).imageUrl);

    const media = uniqueSourceMedia([
      { src: candidateById.get(canonical.slice("official-".length)).imageUrl, alt: "primary", sourceUrl: candidateById.get(canonical.slice("official-".length)).sourceUrl },
      { src: candidateById.get(alias.slice("official-".length)).imageUrl, alt: "alternate", sourceUrl: candidateById.get(alias.slice("official-".length)).sourceUrl },
      { src: candidateById.get(alias.slice("official-".length)).imageUrl, alt: "duplicate", sourceUrl: candidateById.get(alias.slice("official-".length)).sourceUrl },
    ]);

    assert.equal(media.length, 2);
    assert.equal(media[1].sourceUrl, candidateById.get(alias.slice("official-".length)).sourceUrl);
  }
});

test("distinct packages and products remain separate catalog items", () => {
  assert.equal(canonicalProductSlug("official-754922"), "official-754922");
  assert.deepEqual(productAliasSlugs("official-754922"), []);
  assert.equal(candidateById.get("754921").name, candidateById.get("754922").name);
  assert.notEqual(candidateById.get("754921").imageUrl, candidateById.get("754922").imageUrl);
});
