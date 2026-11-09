/** Configured content languages; a code in this list does not imply that its frontend is ready. */
export const locales = [
  { code: "en", label: "English", htmlLang: "en", direction: "ltr" },
  { code: "he", label: "עברית", htmlLang: "he", direction: "rtl" },
  { code: "nl", label: "Nederlands", htmlLang: "nl", direction: "ltr" },
  { code: "fr", label: "Français", htmlLang: "fr", direction: "ltr" },
  { code: "it", label: "Italiano", htmlLang: "it", direction: "ltr" },
  { code: "es", label: "Español", htmlLang: "es", direction: "ltr" },
  { code: "pt", label: "Português", htmlLang: "pt", direction: "ltr" },
  { code: "el", label: "Ελληνικά", htmlLang: "el", direction: "ltr" },
  { code: "zh", label: "简体中文", htmlLang: "zh-CN", direction: "ltr" },
  { code: "ro", label: "Română", htmlLang: "ro", direction: "ltr" },
  { code: "ru", label: "Русский", htmlLang: "ru", direction: "ltr" },
  { code: "th", label: "ไทย", htmlLang: "th", direction: "ltr" },
  { code: "tr", label: "Türkçe", htmlLang: "tr", direction: "ltr" },
] as const;

export type LocaleCode = (typeof locales)[number]["code"];
export const defaultLocale: LocaleCode = "en";
/** All configured locales are public after the owner-approved release decision. */
export const publicLocales = locales.map(locale => locale.code) as readonly LocaleCode[];
export type PublicLocale = (typeof publicLocales)[number];
export function isPublicLocale(code: string): code is PublicLocale { return (publicLocales as readonly string[]).includes(code); }
export function getLocale(code: string) { return locales.find(locale => locale.code === code); }
