import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";
import { caseMessages } from "../src/i18n/case-messages.ts";
import { footerMessages } from "../src/i18n/footer-messages.ts";
import { heroMessages } from "../src/i18n/hero-messages.ts";
import { homeProductMessages } from "../src/i18n/home-product-messages.ts";
import { insightMessages } from "../src/i18n/insight-messages.ts";
import { insightTopics } from "../src/i18n/insight-topics.ts";
import { navigationDetail } from "../src/i18n/navigation-detail.ts";
import { newsMessages } from "../src/i18n/news-messages.ts";
import { referenceRouteMessages } from "../src/i18n/reference-route-messages.ts";
import { searchMessages } from "../src/i18n/search-messages.ts";

const dictionaries = {
  caseMessages,
  footerMessages,
  heroMessages,
  homeProductMessages,
  insightMessages,
  insightTopics,
  navigationDetail,
  newsMessages,
  referenceRouteMessages,
  searchMessages,
};

test("public UI dictionaries have authored entries for every configured locale", () => {
  const codes = locales.map(locale => locale.code);
  for (const [name, dictionary] of Object.entries(dictionaries)) {
    assert.deepEqual(Object.keys(dictionary).sort(), [...codes].sort(), `${name} locale keys`);
    for (const code of codes) {
      assert.ok(dictionary[code], `${name}/${code} entry`);
      if (code !== "en") assert.notStrictEqual(dictionary[code], dictionary.en, `${name}/${code} must not reuse English fallback object`);
    }
  }
});
