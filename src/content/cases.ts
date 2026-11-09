import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";
import { type Where } from "payload";
import { caseSamples } from "../data/case-samples";
import type { CatalogLocale } from "./catalog";
import { asRichText, plainTextToRichText } from "./rich-text";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { localizedText } from "../lib/localized-text";

export type CaseItem = { slug: string; title: string | null; summary: string | null; body: string | null; richBody: SerializedEditorState | null; image: { src: string; alt: string | null } | null; sample: boolean };
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const source = () => {
  const value = process.env.CATALOG_SOURCE || "sample";
  if (value !== "sample" && value !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${value}`);
  return value;
};
const samples = (locale: CatalogLocale): CaseItem[] => caseSamples.map(item => { const body = locale === "zh" ? item.bodyZh : item.bodyEn; return { slug: item.slug, title: locale === "en" || locale === "zh" ? item[locale] : null, summary: locale === "en" ? item.summaryEn : locale === "zh" ? item.summaryZh : null, body, richBody: body ? plainTextToRichText(body) : null, image: { src: item.image, alt: null }, sample: true }; });
const mapCase = (value: unknown, locale: CatalogLocale): CaseItem[] => {
  const item = object(value), image = object(item?.image), slug = text(item?.slug), src = text(image?.url);
  return slug ? [{ slug, title: text(item?.title), summary: text(item?.summary), body: text(item?.body), richBody: asRichText(item?.richBody), image: src ? { src, alt: localizedText(image?.alt, locale) } : null, sample: false }] : [];
};

export const getCasePage = cache(async (locale: CatalogLocale, query: string, page: number, limit: number) => {
  const keyword = query.trim();
  if (source() === "sample") {
    const matches = samples(locale).filter(item => (item.title ?? "").toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
    return { items: matches.slice((page - 1) * limit, page * limit), totalPages: Math.ceil(matches.length / limit), totalDocs: matches.length };
  }
  const payload = await getAppPayload();
  const where: Where | undefined = keyword ? { or: [{ title: { contains: keyword } }, { summary: { contains: keyword } }, { body: { contains: keyword } }] } : undefined;
  const result = await payload.find({ collection: "cases", locale, fallbackLocale: "en", depth: 1, overrideAccess: false, sort: ["-publishedOn", "-id"], page, limit, ...(where ? { where } : {}) });
  return { items: result.docs.flatMap(item => mapCase(item, locale)), totalPages: result.totalPages, totalDocs: result.totalDocs };
});

export const getCase = cache(async (locale: CatalogLocale, slug: string): Promise<CaseItem | null> => {
  if (source() === "sample") return samples(locale).find(item => item.slug === slug) ?? null;
  const payload = await getAppPayload();
  const result = await payload.find({ collection: "cases", locale, fallbackLocale: "en", depth: 1, overrideAccess: false, where: { slug: { equals: slug } }, limit: 1 });
  return result.docs.flatMap(item => mapCase(item, locale))[0] ?? null;
});
