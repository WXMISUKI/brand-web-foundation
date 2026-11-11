import { test } from 'node:test';
import assert from 'node:assert/strict';
import { legacyFeaturedDescription, featuredDescriptionForDisplay } from '../src/data/homepage-public-copy.mjs';

test('known outdated product-count copy is replaced in all supported locales', () => {
  assert.equal(Object.keys(legacyFeaturedDescription).length, 13);
  for (const [locale, old] of Object.entries(legacyFeaturedDescription)) {
    assert.notEqual(featuredDescriptionForDisplay(locale, old), old, locale);
  }
  assert.equal(featuredDescriptionForDisplay('zh', '网站编辑的新介绍'), '网站编辑的新介绍');
  assert.equal(featuredDescriptionForDisplay('zh', null), null);
});
