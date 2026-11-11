import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { companySeeds, faqSeeds } from "../scripts/payload-seeds.mjs";

const phase8 = JSON.parse(fs.readFileSync(new URL("../src/data/core-page-localizations-phase8-he.json", import.meta.url), "utf8"));

test("Hebrew phase-eight company and FAQ copy covers every core field", () => {
  assert.deepEqual(phase8.locales, ["he"]);
  const company = phase8.company.he;
  assert.ok(company.title && company.summary && company.description && company.address);
  assert.equal(company.focusAreas.length, companySeeds.en.focusAreas.length);
  assert.ok(company.focusAreas.every(area => area.title && area.description));
  for (const group of faqSeeds) {
    const translated = phase8.faq[group.slug].he;
    assert.ok(translated.name);
    for (const question of group.questions) assert.ok(translated.questions[question.slug]?.question && translated.questions[question.slug]?.answer);
  }
});

test("Hebrew core translations preserve legal identity, contacts, and RTL boundary", () => {
  const answers = Object.values(phase8.faq).flatMap(group => Object.values(group.he.questions).map(item => item.answer));
  assert.ok(answers.some(answer => answer.includes("leon@kowloonglobaltrading.com")));
  assert.ok(answers.some(answer => answer.includes("+852 9074 0009")));
  assert.ok(answers.some(answer => answer.includes("Anhui Kangmu International Fertilizer Co., Ltd.")));
  assert.equal(phase8.company.he.legalName, undefined);
  assert.equal(phase8.company.he.dir, undefined);
  assert.equal(phase8.company.he.direction, undefined);
  assert.doesNotMatch(JSON.stringify(phase8.company.he), /<[^>]+>/);
});
