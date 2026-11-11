import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase7 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase7-el.json", import.meta.url), "utf8"));

test("Greek phase-seven company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase7.locales, ["el"]);
  const company = phase7.company.el;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  assert.ok(company.focusAreas.every(area => area.title && area.description));
  for (const group of faqSeeds) {
    const translated = phase7.faq[group.slug].el;
    assert.ok(translated.name);
    for (const question of group.questions) assert.ok(translated.questions[question.slug]?.question && translated.questions[question.slug]?.answer);
  }
});

test("Greek core translations preserve contact channels and legal company identity", () => {
  const answers = Object.values(phase7.faq).flatMap(group => Object.values(group.el.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase7.company.el.legalName, undefined);
});
