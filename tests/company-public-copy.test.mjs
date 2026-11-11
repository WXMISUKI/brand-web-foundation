import { test } from "node:test";
import assert from "node:assert/strict";
import legacy from "../src/data/company-legacy-copy.mjs";
import { companyDescriptionForDisplay, focusDescriptionForDisplay, correctKnownCompanyName } from "../src/data/company-public-copy.mjs";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

test("legacy source and review wording is replaced in all 13 company locales", () => {
  assert.equal(Object.keys(legacy).length, 13);
  for (const [locale, old] of Object.entries(legacy)) {
    assert.notEqual(companyDescriptionForDisplay(locale, old.description), old.description, `${locale} description`);
    old.focusAreas.forEach((value, index) => {
      assert.notEqual(focusDescriptionForDisplay(locale, index, value), value, `${locale} focus ${index}`);
    });
  }
  assert.doesNotMatch(companyDescriptionForDisplay("zh", legacy.zh.description), /原官网|待核验|来源页面/);
  assert.doesNotMatch(focusDescriptionForDisplay("en", 2, legacy.en.focusAreas[2]), /official site|owner.review/i);
});

test("later CMS edits remain unchanged", () => {
  const edited = "A custom description written by the site editor.";
  assert.equal(companyDescriptionForDisplay("en", edited), edited);
  assert.equal(focusDescriptionForDisplay("en", 0, edited), edited);
  assert.equal(companyDescriptionForDisplay("zh", null), null);
});

test("current public copy and seed data use the confirmed Chinese company name", () => {
  const visit = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) return visit(file);
    if (!/\.(?:ts|tsx|mjs|json)$/.test(file) || file.endsWith("company-legacy-copy.mjs") || file.endsWith("company-name-legacy.mjs")) return [];
    return [file];
  });
  for (const file of [...visit("src"), "scripts/payload-seeds.mjs"]) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /安徽康母/, file);
  }
  assert.match(companyDescriptionForDisplay("zh", legacy.zh.description), /安徽康坶/);
});

test("only known legacy CMS values receive a display correction", () => {
  const legacyValues = ["安徽康母国际化肥股份有限公司", "了解安徽康母国际化肥股份有限公司与康姆产品系列。", "请通过邮箱或 WhatsApp 联系安徽康母国际化肥股份有限公司，并说明所在市场和渠道情况。"];
  for (const value of legacyValues) assert.equal(correctKnownCompanyName(value), value.replace("安徽康母", "安徽康坶"));
  assert.equal(correctKnownCompanyName("自定义安徽康母说明"), "自定义安徽康母说明");
  assert.equal(correctKnownCompanyName(null), null);
});
