import { insightPageNumber } from "./insight-search";
import type { LocaleCode } from "../i18n/locales";

export const newsPageNumber = insightPageNumber;
export function newsPagePath(locale: LocaleCode, page: number, query = "", basePath = `/${locale}/news`, kind: "all" | "news" | "event" = "all") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (kind !== "all") params.set("type", kind);
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return `${basePath}${search ? `?${search}` : ""}`;
}
