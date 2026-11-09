import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";
import { type Where } from "payload";
import { insightSamples } from "../data/insights";
import type { CatalogLocale } from "./catalog";
import { asRichText, plainTextToRichText } from "./rich-text";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { localizedText } from "../lib/localized-text";

export type Insight = { slug: string; topics: string[]; title: string | null; summary: string | null; body: string | null; richBody: SerializedEditorState | null; author: string | null; publishedOn: string | null; image: { src: string; alt: string | null } | null; sample: boolean };
export type InsightPage = { items: Insight[]; page: number; totalPages: number; totalDocs: number };
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const source = () => {
  const value = process.env.CATALOG_SOURCE || "sample";
  if (value !== "sample" && value !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${value}`);
  return value;
};
const samples = (locale: CatalogLocale): Insight[] => insightSamples.map(item => { const body = locale === "zh" ? item.bodyZh : item.bodyEn; return { slug: item.slug, topics: item.topics, title: locale === "en" || locale === "zh" ? item[locale] : null, summary: locale === "en" ? item.summaryEn : locale === "zh" ? item.summaryZh : null, body, richBody: body ? plainTextToRichText(body) : null, author: locale === "en" ? item.authorEn : locale === "zh" ? item.authorZh : null, publishedOn: item.publishedOn, image: { src: item.image, alt: null }, sample: true }; });
const mapInsight = (value: unknown, locale: CatalogLocale): Insight[] => {
  const item = object(value), image = object(item?.image);
  const slug = text(item?.slug), src = text(image?.url);
  const topics = Array.isArray(item?.topics) ? item.topics.filter((topic): topic is string => typeof topic === "string" && Boolean(topic.trim())) : [];
  return slug ? [{ slug, topics, title: text(item?.title), summary: text(item?.summary), body: text(item?.body), richBody: asRichText(item?.richBody), author: text(item?.author), publishedOn: text(item?.publishedOn), image: src ? { src, alt: localizedText(image?.alt, locale) } : null, sample: false }] : [];
};

export const getInsightPage = cache(async (locale: CatalogLocale, query: string, author: string, page: number, limit: number, topic = ""): Promise<InsightPage> => {
  const keyword = query.trim(), authorKeyword = author.trim();
  if (source() === "sample") {
    const matches = samples(locale).filter(item => {
      const topicMatch = !topic || item.topics.includes(topic);
      return topicMatch && [item.title, item.summary, item.body].some(value => (value ?? "").toLocaleLowerCase().includes(keyword.toLocaleLowerCase())) && (item.author ?? "").toLocaleLowerCase().includes(authorKeyword.toLocaleLowerCase());
    });
    return { items: matches.slice((page - 1) * limit, page * limit), page, totalPages: Math.ceil(matches.length / limit), totalDocs: matches.length };
  }
  const payload = await getAppPayload();
  const conditions: Where[] = [];
  if (keyword) conditions.push({ or: [{ title: { contains: keyword } }, { summary: { contains: keyword } }, { body: { contains: keyword } }] });
  if (authorKeyword) conditions.push({ author: { contains: authorKeyword } });
  // `topics` is a Payload array of objects (`[{ slug: string }]`). Querying
  // the array field itself with `contains` is rejected by the Postgres adapter
  // at runtime. Target the nested scalar instead so the public topic filter
  // remains a normal database query and keeps pagination accurate.
  if (topic) conditions.push({ "topics.slug": { equals: topic } });
  const result = await payload.find({ collection: "insights", locale, fallbackLocale: "en", depth: 1, overrideAccess: false, sort: ["-publishedOn", "-id"], limit, page, ...(conditions.length ? { where: { and: conditions } } : {}) });
  return { items: result.docs.flatMap(item => mapInsight(item, locale)), page, totalPages: result.totalPages, totalDocs: result.totalDocs };
});

export const getInsight = cache(async (locale: CatalogLocale, slug: string): Promise<Insight | null> => {
  if (source() === "sample") return samples(locale).find(item => item.slug === slug) ?? null;
  const payload = await getAppPayload();
  const result = await payload.find({ collection: "insights", locale, fallbackLocale: "en", depth: 1, overrideAccess: false, where: { slug: { equals: slug } }, limit: 1 });
  return result.docs.flatMap(item => mapInsight(item, locale))[0] ?? null;
});
