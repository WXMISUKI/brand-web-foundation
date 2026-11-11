import assert from "node:assert/strict";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";
import { caseMessages } from "../src/i18n/case-messages.ts";
import { insightMessages } from "../src/i18n/insight-messages.ts";
import { insightTopics } from "../src/i18n/insight-topics.ts";
import { navigationDetail } from "../src/i18n/navigation-detail.ts";
import { newsMessages } from "../src/i18n/news-messages.ts";
import { referenceRouteMessages } from "../src/i18n/reference-route-messages.ts";
import { searchMessages } from "../src/i18n/search-messages.ts";

const codes = locales.map(({ code }) => code);
const maps = { caseMessages, insightMessages, insightTopics, navigationDetail, newsMessages, referenceRouteMessages, searchMessages };

test("content UI dictionaries have authored entries for every configured locale", () => {
  for (const [name, messages] of Object.entries(maps)) {
    assert.deepEqual(Object.keys(messages).sort(), [...codes].sort(), `${name} locale coverage`);
    const sourceKeys = Object.keys(messages.en).sort();
    for (const code of codes) {
      assert.deepEqual(Object.keys(messages[code]).sort(), sourceKeys, `${name}/${code} key coverage`);
      if (code !== "en") assert.notEqual(messages[code], messages.en, `${name}/${code} must not reuse the English object`);
    }
  }
});
