import { test } from 'node:test';
import assert from 'node:assert/strict';
import { officialProductDisplayName } from '../src/data/official-product-display-names.ts';
import candidates from '../src/data/official-site-product-candidates.json' with { type: 'json' };

test('legacy candidate names receive locale labels while custom CMS names stay intact', () => {
  const locales = ['he','nl','fr','it','es','pt','el','ro','ru','th','tr'];
  const excluded = new Set(['754923','754921','754926','754931','754932','754918','754919']);
  for (const candidate of candidates.products.filter(item => !excluded.has(item.sourceUrl.match(/\/(\d+)\.html$/)[1]))) {
    const slug = `official-${candidate.sourceUrl.match(/\/(\d+)\.html$/)[1]}`;
    const legacy = `KOMU product · ${candidate.name}`;
    for (const locale of locales) {
      const name = officialProductDisplayName(locale, slug, legacy);
      assert.doesNotMatch(name, /[\u4e00-\u9fff]/u, `${locale}/${slug}`);
      assert.equal(officialProductDisplayName(locale, slug, legacy + ' edited'), legacy + ' edited');
      const formula = candidate.name.match(/\d+(?:-\d+){2}(?:\+TE)?/)?.[0];
      if (formula) assert.ok(name.includes(formula), slug);
    }
    assert.equal(officialProductDisplayName('en', slug, legacy), legacy);
    assert.equal(officialProductDisplayName('zh', slug, candidate.name), candidate.name);
  }
  assert.equal(officialProductDisplayName('fr', 'official-unknown', 'custom'), 'custom');
});
