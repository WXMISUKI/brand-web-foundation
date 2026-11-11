import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import { locales } from "../src/i18n/locales.ts";

const root = new URL("../", import.meta.url);
const sources = {
  resourceMessages: "src/components/product-resources.tsx",
  sustainabilityMessages: "src/components/sustainability-content.tsx",
  homeCompanyFocusMessages: "src/components/home-company-focus.tsx",
  homeCompanyStoryMessages: "src/components/home-company-story.tsx",
  homeNewsletterMessages: "src/components/home-newsletter.tsx",
  inquiryFormCopy: "src/components/inquiry-form.tsx",
  productEnquiryMessages: "src/components/product-enquiry-preview.tsx",
  contactInquiryMessages: "src/i18n/contact-inquiry-messages.ts",
  smartFarmingMessages: "src/i18n/smart-farming-messages.ts",
  solutionPageMessages: "src/i18n/solution-page-messages.ts",
  caseCarouselMessages: "src/i18n/case-carousel-messages.ts",
  homeEditorialMessages: "src/i18n/home-editorial-messages.ts",
  homeFeaturedMessages: "src/i18n/home-featured-messages.ts",
  desktopQuickLinks: "src/components/desktop-quick-links.tsx",
  mobileQuickLinks: "src/components/mobile-quick-links.tsx",
  practiceMenuGroups: "src/components/practice-menu-groups.tsx",
  productInsights: "src/components/product-insights.tsx",
  productInformationMessages: "src/i18n/product-information-messages.ts",
  sharedUiMessages: "src/i18n/shared-ui-messages.ts",
};

test("component locale maps have authored entries for all configured locales", () => {
  const codes = locales.map(locale => locale.code);
  for (const [name, relativePath] of Object.entries(sources)) {
    const source = fs.readFileSync(new URL(relativePath, root), "utf8");
    const authored = [...source.matchAll(/^\s{2}([a-z]{2}):\s*\{/gm)].map(match => match[1]);
    assert.deepEqual([...new Set(authored)].sort(), [...codes].sort(), `${name} locale keys`);
  }
});
