import { locales, type LocaleCode } from "./locales.ts";

/** Complete a partial UI map without pretending the fallback is translated. */
export function completeLocaleMap<T>(source: Partial<Record<LocaleCode, T>>, fallback: LocaleCode = "en"): Record<LocaleCode, T> {
  const fallbackValue = source[fallback];
  if (fallbackValue === undefined) throw new Error(`Missing fallback locale: ${fallback}`);
  return Object.fromEntries(locales.map(({ code }) => [code, source[code] ?? fallbackValue])) as Record<LocaleCode, T>;
}

/** Sample content can use a stable source language until an owner translation is approved. */
export function contentLocale(locale: LocaleCode): "en" | "zh" {
  return locale === "zh" ? "zh" : "en";
}

export function hasApprovedFrontend(locale: LocaleCode): boolean {
  return locales.some(item => item.code === locale);
}
