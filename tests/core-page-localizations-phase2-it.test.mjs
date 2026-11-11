import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase2 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase2-it.json", import.meta.url), "utf8"));

test("Italian phase-two company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase2.locales, ["it"]);
  const company = phase2.company.it;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  assert.ok(company.focusAreas.every(area => area.title && area.description));
  for (const group of faqSeeds) {
    const translated = phase2.faq[group.slug].it;
    assert.ok(translated.name);
    for (const question of group.questions) {
      assert.ok(translated.questions[question.slug]?.question);
      assert.ok(translated.questions[question.slug]?.answer);
    }
  }
});

test("Italian core translations preserve legal name and contact channels", () => {
  const answers = Object.values(phase2.faq).flatMap(group => Object.values(group.it.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase2.company.it.legalName, undefined);
});
