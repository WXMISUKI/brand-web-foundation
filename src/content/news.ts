import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";

import type { CatalogLocale } from "./catalog";
import { asRichText, plainTextToRichText } from "./rich-text";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { newsSamples } from "../data/news-samples";
import { localizedText } from "../lib/localized-text";

export type NewsItem = { slug: string; kind: "news" | "event"; title: string | null; summary: string | null; body: string | null; richBody: SerializedEditorState | null; publishedOn: string | null; image: { src: string; alt: string | null } | null };
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const mapNews = (value: unknown, locale: CatalogLocale): NewsItem[] => {
  const item = object(value), image = object(item?.image);
  const slug = text(item?.slug), src = text(image?.url);
  return slug ? [{ slug, kind: item?.kind === "event" ? ("event" as const) : ("news" as const), title: text(item?.title), summary: text(item?.summary), body: text(item?.body), richBody: asRichText(item?.richBody), publishedOn: text(item?.publishedOn), image: src ? { src, alt: localizedText(image?.alt, locale) } : null }] : [];
};
const source = () => {
  const value = process.env.CATALOG_SOURCE || "sample";
  if (value !== "sample" && value !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${value}`);
  return value;
};
const samples = (locale: CatalogLocale): NewsItem[] => newsSamples.map(item => { const body = locale === "zh" ? item.bodyZh : item.bodyEn; return { slug: item.slug, kind: item.kind === "event" ? ("event" as const) : ("news" as const), title: locale === "en" ? item.en : locale === "zh" ? item.zh : null, summary: locale === "en" ? item.summaryEn : locale === "zh" ? item.summaryZh : null, body, richBody: body ? plainTextToRichText(body) : null, publishedOn: item.publishedOn, image: { src: item.image, alt: null } }; });

export const getNewsPage = cache(async (locale: CatalogLocale, page: number, limit: number, query = "", kind: "all" | "news" | "event" = "all") => {
  if (source() === "sample") {
    const keyword = query.trim().toLocaleLowerCase();
    const matches = samples(locale).filter(item => (kind === "all" || item.kind === kind) && `${item.title ?? ""} ${item.summary ?? ""}`.toLocaleLowerCase().includes(keyword));
    return { items: matches.slice((page - 1) * limit, page * limit), totalPages: Math.ceil(matches.length / limit), totalDocs: matches.length };
  }
  const payload = await getAppPayload();
  const keyword = query.trim();
  const result = await payload.find({ collection: "news", locale, fallbackLocale: "en", depth: 1, overrideAccess: false, sort: ["-publishedOn", "-id"], page, limit, ...(keyword || kind !== "all" ? { where: { ...(kind !== "all" ? { kind: { equals: kind } } : {}), ...(keyword ? { or: [{ title: { contains: keyword } }, { summary: { contains: keyword } }, { body: { contains: keyword } }] } : {}) } } : {}) });
  return { items: result.docs.flatMap(item => mapNews(item, locale)), totalPages: result.totalPages, totalDocs: result.totalDocs };
});

export const getNewsItem = cache(async (locale: CatalogLocale, slug: string): Promise<NewsItem | null> => {
  if (source() === "sample") return samples(locale).find(item => item.slug === slug) ?? null;
  const payload = await getAppPayload();
  const result = await payload.find({ collection: "news", locale, fallbackLocale: "en", depth: 1, overrideAccess: false, where: { slug: { equals: slug } }, limit: 1 });
  return result.docs.flatMap(item => mapNews(item, locale))[0] ?? null;
});
