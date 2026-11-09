import type { LocaleCode } from "../i18n/locales.ts";

/** Build a language-specific catalog URL without losing active filters. */
export function catalogHref(locale: LocaleCode, category: string, query: string, anchor = false, page = 1, basePath = `/${locale}/products`): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const suffix = params.toString();
  return `${basePath}${suffix ? `?${suffix}` : ""}${anchor ? "#catalog-results" : ""}`;
}
