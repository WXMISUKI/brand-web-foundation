import type { LocaleCode } from "../i18n/locales";
export function casePath(locale: LocaleCode, query: string, page = 1, basePath = `/${locale}/cases`) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return `${basePath}${search ? `?${search}` : ""}`;
}
