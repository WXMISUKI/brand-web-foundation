import legacyCompanyCopy from '../src/data/company-legacy-copy.mjs';

// Check public-facing content only. Internal provenance fields are deliberately excluded.
const legacyCompanyValues = new Set(Object.values(legacyCompanyCopy).flatMap(value => [value.description, ...value.focusAreas]));
const rules = [
  { id: 'company-name-typo', pattern: /安徽康母/ },
  { id: 'internal-editorial-language', pattern: /原官网|来源页面提到|owner.review gate|claims verified/i },
  { id: 'product-review-template', pattern: /^(?:This product is listed in the official KOMU product center\. Contact us for current product information\.|The official KOMU product center lists .+\. Model, packaging, technical values and claims remain subject to formal review\.)$|Formula and claims await review\.?|Specifications await review\.?/i },
];

export function checkContentFields(fields) {
  const findings = [];
  for (const { path, value } of fields) {
    if (typeof value !== 'string') continue;
    for (const rule of rules) if (rule.pattern.test(value)) findings.push({ path, rule: rule.id });
    if (legacyCompanyValues.has(value) && !rules.some(rule => rule.pattern.test(value))) findings.push({ path, rule: 'known-legacy-company-copy' });
  }
  return findings;
}
