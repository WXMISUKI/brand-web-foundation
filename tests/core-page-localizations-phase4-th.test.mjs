import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase4 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase4-th.json", import.meta.url), "utf8"));

test("Thai phase-four company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase4.locales, ["th"]);
  const company = phase4.company.th;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  assert.ok(company.focusAreas.every(area => area.title && area.description));
  for (const group of faqSeeds) {
    const translated = phase4.faq[group.slug].th;
    assert.ok(translated.name);
    for (const question of group.questions) assert.ok(translated.questions[question.slug]?.question && translated.questions[question.slug]?.answer);
  }
});

test("Thai core translations preserve contact channels and legal company identity", () => {
  const answers = Object.values(phase4.faq).flatMap(group => Object.values(group.th.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase4.company.th.legalName, undefined);
});
