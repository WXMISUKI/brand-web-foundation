import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase6 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase6-ro.json", import.meta.url), "utf8"));

test("Romanian phase-six company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase6.locales, ["ro"]);
  const company = phase6.company.ro;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  assert.ok(company.focusAreas.every(area => area.title && area.description));
  for (const group of faqSeeds) {
    const translated = phase6.faq[group.slug].ro;
    assert.ok(translated.name);
    for (const question of group.questions) assert.ok(translated.questions[question.slug]?.question && translated.questions[question.slug]?.answer);
  }
});

test("Romanian core translations preserve contact channels and legal company identity", () => {
  const answers = Object.values(phase6.faq).flatMap(group => Object.values(group.ro.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase6.company.ro.legalName, undefined);
});
