import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { faqSeeds, companySeeds } from "../scripts/payload-seeds.mjs";

const source = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase1.json", import.meta.url), "utf8"));

test("phase-one company and FAQ copy covers Spanish, French, Portuguese and Russian", () => {
  assert.deepEqual(source.locales, ["es", "fr", "pt", "ru"]);
  for (const locale of source.locales) {
    const company = source.company[locale];
    assert.ok(company.title && company.summary && company.description && company.address);
    assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
    assert.ok(company.focusAreas.every(area => area.title && area.description));

    for (const group of faqSeeds) {
      const translatedGroup = source.faq[group.slug][locale];
      assert.ok(translatedGroup.name);
      for (const question of group.questions) {
        assert.ok(translatedGroup.questions[question.slug]?.question);
        assert.ok(translatedGroup.questions[question.slug]?.answer);
      }
    }
  }
});

test("localized company source does not overwrite legal name or contact channels", () => {
  for (const locale of source.locales) {
    assert.equal(source.company[locale].email, undefined);
    assert.equal(source.company[locale].whatsapp, undefined);
    assert.equal(source.company[locale].legalName, undefined);
  }
});

test("translated FAQ keeps legal names and contact values intact", () => {
  for (const locale of source.locales) {
    const productContact = source.faq.products[locale].questions.documentation.answer;
    const distributorContact = source.faq.orders[locale].questions.distributor.answer;
    assert.match(productContact, /leon@kowloonglobaltrading\.com/);
    assert.match(productContact, /\+852 9074 0009/);
    assert.match(distributorContact, /Anhui Kangmu International Fertilizer Co\., Ltd\./);
  }
});
