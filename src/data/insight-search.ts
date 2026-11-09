import type { LocaleCode } from "../i18n/locales.ts";
export function insightSearchPath(locale: LocaleCode, query: string, author: string, topic = "", page = 1, basePath = `/${locale}/insights`) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (author) params.set("author", author);
  if (topic) params.set("topic", topic);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return basePath + (search ? '?' + search : '');
}

export function insightPageNumber(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) return 1;
  return Number(value);
}
