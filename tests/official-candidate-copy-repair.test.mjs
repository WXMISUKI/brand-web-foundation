import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import { candidateCopyRepair, candidateEnglishCopy, candidateMediaAltRepair, planCandidateCopyRepairs } from "../src/lib/official-candidate-copy.mjs";

test("repairs only the known imported English values and preserves edits", () => {
  const candidate = { name: "大量元素水溶肥", sourceUrl: "http://m.zgkomu.cn/display/569693.html" };
  const oldName = `KOMU product · ${candidate.name}`;
  const oldIntro = `The official KOMU product center lists ${candidate.name}. Model, packaging, technical values and claims remain subject to formal review.`;
  const result = candidateCopyRepair(candidate, { name: oldName, intro: oldIntro });
  assert.deepEqual(result, { name: "KOMU water-soluble fertilizer · source reference 569693", intro: "This product is listed in the official KOMU product center. Contact us for current product information." });
  assert.deepEqual(candidateCopyRepair(candidate, { name: "Edited by staff", intro: "Reviewed introduction" }), {});
  assert.deepEqual(candidateCopyRepair(candidate, { name: oldName, intro: "Reviewed introduction" }), { name: result.name });
});

test("rejects invalid source references rather than inventing identifiers", () => {
  assert.throws(() => candidateCopyRepair({ name: "示例", sourceUrl: "https://example.com/123" }, { name: "KOMU product · 示例" }));
});

test("known display aliases retain the same English label for source-image grouping", () => {
  const candidate = id => ({ name: "复合肥料16-16-16", sourceUrl: `http://m.zgkomu.cn/display/${id}.html` });
  assert.equal(candidateEnglishCopy(candidate(569687)).name, candidateEnglishCopy(candidate(569688)).name);
  assert.equal(candidateEnglishCopy(candidate(569693)).name, candidateEnglishCopy(candidate(569692)).name);
});

test("all source candidates have English fallback copy without Chinese characters", () => {
  const inventory = JSON.parse(fs.readFileSync(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
  for (const candidate of inventory.products) {
    const copy = candidateEnglishCopy(candidate);
    assert.doesNotMatch(`${copy.name} ${copy.intro}`, /\p{Script=Han}/u);
  }
});

test("repair planning identifies absent, edited and mismatched records without changing them", () => {
  const candidate = { name: "大量元素水溶肥", sourceUrl: "http://m.zgkomu.cn/display/569693.html" };
  const oldName = `KOMU product · ${candidate.name}`;
  const record = { id: 12, slug: "official-569693", sourceUrl: candidate.sourceUrl, reviewStatus: "owner-review", claimsVerified: false, name: oldName, intro: "Staff edit" };
  const [planned] = planCandidateCopyRepairs([candidate], [record]);
  assert.equal(planned.status, "change");
  assert.deepEqual(planned.changes, { name: "KOMU water-soluble fertilizer · source reference 569693" });
  assert.equal(planCandidateCopyRepairs([candidate], [])[0].status, "missing");
  assert.equal(planCandidateCopyRepairs([candidate], [{ ...record, sourceUrl: "other" }])[0].status, "conflict");
  assert.equal(planCandidateCopyRepairs([candidate], [{ ...record, reviewStatus: "approved" }])[0].status, "conflict");
  assert.equal(planCandidateCopyRepairs([candidate], [record, record])[0].status, "conflict");
  assert.equal(planCandidateCopyRepairs([candidate], [{ ...record, name: "Staff name" }])[0].status, "preserved");
});

test("media alt repair recognises only the exact historical serialized value", () => {
  const candidate = { name: "大量元素水溶肥", sourceUrl: "http://m.zgkomu.cn/display/569693.html" };
  const oldAlt = JSON.stringify({ en: `KOMU product · ${candidate.name}`, zh: candidate.name });
  assert.equal(candidateMediaAltRepair(candidate, oldAlt), "KOMU water-soluble fertilizer · source reference 569693");
  assert.equal(candidateMediaAltRepair(candidate, "Edited by staff"), null);
});
