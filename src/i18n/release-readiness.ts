import { locales, publicLocales, type LocaleCode } from "./locales.ts";

export type LocaleReleaseStatus = "public" | "preview";
export type LocaleContentStatus = "production" | "draft";

/** Release gate metadata for the owner-approved public language release. */
export const localeReleaseReadiness: Record<LocaleCode, {
  release: LocaleReleaseStatus;
  content: LocaleContentStatus;
  noindex: boolean;
  inquiryEnabled: boolean;
}> = Object.fromEntries(locales.map(locale => {
  const isPublic = (publicLocales as readonly string[]).includes(locale.code);
  return [locale.code, { release: isPublic ? "public" : "preview", content: isPublic ? "production" : "draft", noindex: false, inquiryEnabled: true }];
})) as Record<LocaleCode, { release: LocaleReleaseStatus; content: LocaleContentStatus; noindex: boolean; inquiryEnabled: boolean }>;

export const localeReleaseCodes = Object.keys(localeReleaseReadiness) as LocaleCode[];
