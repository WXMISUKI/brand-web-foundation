import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase5 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase5-nl.json", import.meta.url), "utf8"));

test("Dutch phase-five company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase5.locales, ["nl"]);
  const company = phase5.company.nl;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  assert.ok(company.focusAreas.every(area => area.title && area.description));
  for (const group of faqSeeds) {
    const translated = phase5.faq[group.slug].nl;
    assert.ok(translated.name);
    for (const question of group.questions) assert.ok(translated.questions[question.slug]?.question && translated.questions[question.slug]?.answer);
  }
});

test("Dutch core translations preserve contact channels and legal company identity", () => {
  const answers = Object.values(phase5.faq).flatMap(group => Object.values(group.nl.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase5.company.nl.legalName, undefined);
});
