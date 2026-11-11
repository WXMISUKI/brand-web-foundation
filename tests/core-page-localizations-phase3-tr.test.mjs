import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase3 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase3-tr.json", import.meta.url), "utf8"));

test("Turkish phase-three company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase3.locales, ["tr"]);
  const company = phase3.company.tr;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  for (const group of faqSeeds) {
    const translated = phase3.faq[group.slug].tr;
    assert.ok(translated.name);
    for (const question of group.questions) assert.ok(translated.questions[question.slug]?.question && translated.questions[question.slug]?.answer);
  }
});

test("Turkish core translations preserve contact channels and legal company identity", () => {
  const answers = Object.values(phase3.faq).flatMap(group => Object.values(group.tr.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase3.company.tr.legalName, undefined);
});
