import { locales, publicLocales } from "../src/i18n/locales.ts";
import { localeReleaseReadiness } from "../src/i18n/release-readiness.ts";

const codes = locales.map(item => item.code);
const errors = [];
if (locales.length !== 13) errors.push(`expected 13 configured locales, got ${locales.length}`);
if (publicLocales.length !== locales.length) errors.push(`all configured locales must be public after approved release; got ${publicLocales.join(",")}`);
if (Object.keys(localeReleaseReadiness).sort().join(",") !== codes.slice().sort().join(",")) errors.push("locale release readiness must cover every configured locale");
for (const code of codes) {
  const readiness = localeReleaseReadiness[code];
  const isPublic = publicLocales.includes(code);
  if (!readiness || readiness.noindex !== false || readiness.inquiryEnabled !== true) errors.push(`${code} must be indexable with inquiry enabled after approved release`);
  if (readiness.release !== (isPublic ? "public" : "preview")) errors.push(`${code} release status does not match publicLocales`);
  if (readiness.content !== (isPublic ? "production" : "draft")) errors.push(`${code} content status does not match release status`);
}
for (const code of ["en", "zh", "fr", "es", "he", "nl", "it", "pt", "el", "ro", "ru", "th", "tr"]) {
  if (!codes.includes(code)) errors.push(`missing configured locale: ${code}`);
}
const messageMaps = [
  ["about-messages.ts", "aboutMessages"],
  ["case-messages.ts", "caseMessages"],
  ["catalog-messages.ts", "catalogMessages"],
  ["contact-messages.ts", "contactMessages"],
  ["faq-messages.ts", "faqMessages"],
  ["footer-messages.ts", "footerMessages"],
  ["hero-messages.ts", "heroMessages"],
  ["home-product-messages.ts", "homeProductMessages"],
  ["insight-messages.ts", "insightMessages"],
  ["navigation-detail.ts", "navigationDetail"],
  ["news-messages.ts", "newsMessages"],
  ["product-detail-messages.ts", "productDetailMessages"],
  ["search-messages.ts", "searchMessages"],
];
for (const [file, exportName] of messageMaps) {
  const module = await import(new URL(`../src/i18n/${file}`, import.meta.url));
  const keys = Object.keys(module[exportName] ?? {}).sort();
  if (keys.join(",") !== codes.slice().sort().join(",")) errors.push(`${exportName} must expose all configured locale keys`);
}
if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, configured: codes, public: publicLocales, readiness: localeReleaseReadiness, aboutPreview: codes.filter(code => !publicLocales.includes(code)) }, null, 2));
}
