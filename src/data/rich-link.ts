/** Resolve only public collection links; an unavailable document has no link. */
import type { LocaleCode } from "../i18n/locales.ts";
export function richInternalHref(locale: LocaleCode, relation: string | undefined, value: unknown): string | null {
  if (!value || typeof value !== "object" || !("slug" in value) || typeof value.slug !== "string" || !value.slug.trim()) return null;
  const slug = encodeURIComponent(value.slug);
  if (relation === "categories") return `/${locale}/products?category=${slug}`;
  if (relation === "products" || relation === "insights" || relation === "cases" || relation === "news") return `/${locale}/${relation}/${slug}`;
  return null;
}
