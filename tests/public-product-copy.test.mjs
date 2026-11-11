import { test } from "node:test";
import assert from "node:assert/strict";
import { publicProductDetail, publicProductIntro } from "../src/lib/public-content.ts";
import flbook from "../src/data/flbook-import.json" with { type: "json" };
import p1 from "../src/data/flbook-localizations-phase1.json" with { type: "json" };
import p2 from "../src/data/flbook-localizations-phase2-it.json" with { type: "json" };
import p3 from "../src/data/flbook-localizations-phase3-tr.json" with { type: "json" };
import p4 from "../src/data/flbook-localizations-phase4-th.json" with { type: "json" };
import p5 from "../src/data/flbook-localizations-phase5-nl.json" with { type: "json" };
import p6 from "../src/data/flbook-localizations-phase6-ro.json" with { type: "json" };
import p7 from "../src/data/flbook-localizations-phase7-el.json" with { type: "json" };
import p8 from "../src/data/flbook-localizations-phase8-he.json" with { type: "json" };

test("known imported source-review templates become buyer-facing contact text", () => {
  const chinese = "原官网产品中心列出“大量元素水溶肥”。型号、包装、技术参数和 claims 仍以正式审核资料为准。";
  const english = "The official KOMU product center lists 大量元素水溶肥. Model, packaging, technical values and claims remain subject to formal review.";
  const currentEnglish = "This product is listed in the official KOMU product center. Contact us for current product information.";
  assert.equal(publicProductIntro(chinese, "zh"), "请联系我们了解产品详情和最新技术资料。");
  assert.equal(publicProductIntro(english, "es"), "Contacte con el equipo de KOMU para obtener información actualizada sobre el producto.");
  assert.equal(publicProductIntro(currentEnglish, "en"), "Contact the KOMU team for current product information.");
});

test("known historical English details are cleaned without changing facts or editor changes", () => {
  const details = [
    ["1000 mL pack shown in the source page; confirm current packaging.", "1000 mL pack"],
    ["50 kg pack shown in the source page; confirm current packaging.", "50 kg pack"],
    ["Approximately 10 kg is shown in the source page; confirm current packaging.", "Approximately 10 kg"],
    ["Approximately 20 kg is shown in the source page; confirm current packaging.", "Approximately 20 kg"],
    ["10 kg pack shown in the source page; confirm current packaging.", "10 kg pack"],
    ["Water-soluble NPK with trace elements; 120-60-400+TE follows the source page and needs current-sheet confirmation.", "120-60-400+TE"],
    ["Water-soluble NPK with trace elements; 200-150-200+TE follows the source page and needs current-sheet confirmation.", "200-150-200+TE"],
  ];
  for (const [old, fact] of details) {
    const updated = publicProductDetail(old, "en");
    assert.match(updated, new RegExp(fact.replaceAll("+", "\\+")));
    assert.doesNotMatch(updated, /source page|needs current-sheet/i);
    assert.doesNotMatch(publicProductDetail(old, "fr"), /source page|needs current-sheet/i);
    assert.equal(publicProductDetail(old + " Editor update.", "en"), old + " Editor update.");
  }
  assert.equal(publicProductDetail(null, "en"), null);
});

test("known Chinese product details exclude source references and preserve later edits", () => {
  const examples = ["来源页显示约 20KG；当前包装请确认。", "来源页定位为膨果和促进着色；作物、时期和用量请确认。", "含微量元素的水溶 NPK；120-60-400+TE 来自来源页，需以最新资料确认。"];
  for (const old of examples) {
    assert.doesNotMatch(publicProductDetail(old, "zh"), /来源页/);
    assert.equal(publicProductDetail(old + " 后续编辑", "zh"), old + " 后续编辑");
  }
});

test("customized product introductions are preserved", () => {
  const edited = "This is a description maintained by the product editor.";
  assert.equal(publicProductIntro(edited, "en"), edited);
  const newItem = "The official KOMU product center lists a custom item. Model, packaging, technical values and claims remain subject to formal review.";
  assert.equal(publicProductIntro(newItem, "en"), newItem);
});

test("all ten known brochure introductions omit internal provenance wording", () => {
  assert.equal(flbook.products.length, 10);
  for (const product of flbook.products) {
    const updated = publicProductIntro(product.englishIntro, "en");
    assert.doesNotMatch(updated, /brochure page|source[ -]page|await review/i, product.slug);
    assert.equal(publicProductIntro(product.englishIntro + " Editor update.", "en"), product.englishIntro + " Editor update.");
  }
});

test("known Chinese and localized brochure introductions become direct descriptions", () => {
  for (const product of flbook.products) {
    const cleaned = publicProductIntro(product.intro, "zh");
    assert.doesNotMatch(cleaned, /画册|原官网|来源页/, product.slug);
    assert.equal(publicProductIntro(product.intro + " 新内容", "zh"), product.intro + " 新内容");
  }
  let count = 0;
  for (const phase of [p1,p2,p3,p4,p5,p6,p7,p8]) for (const [slug, translations] of Object.entries(phase.products)) for (const [locale, item] of Object.entries(translations)) {
    const cleaned = publicProductIntro(item.intro, locale);
    assert.ok(cleaned.startsWith(item.name), `${locale}/${slug}`);
    assert.ok(!cleaned.includes(item.intro), `${locale}/${slug}`);
    assert.equal(publicProductIntro(item.intro + " Edited.", locale), item.intro + " Edited.");
    count++;
  }
  assert.equal(count, 110);
});
