import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";

import type { CatalogLocale } from "./catalog";

export type FaqGroup = { id: string; name: string | null; questions: Array<{ id: string; question: string | null; answer: string | null }> };
export type FaqContentData = { source: "sample" | "payload"; groups: FaqGroup[] };
export function filterFaqContent(data: FaqContentData, query: string): FaqContentData {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return data;
  return { ...data, groups: data.groups.map(group => ({ ...group, questions: group.questions.filter(item => `${item.question ?? ""} ${item.answer ?? ""}`.toLocaleLowerCase().includes(term)) })).filter(group => group.questions.length > 0) };
}
const sample = [
  { id: "products", en: "Product information", zh: "产品信息", questions: [{ en: "Where can I find product specifications?", zh: "在哪里可以查看产品规格？" }, { en: "How can I request product documentation?", zh: "如何获取产品资料？" }] },
  { id: "applications", en: "Growing applications", zh: "种植应用", questions: [{ en: "How do I choose products for a growing application?", zh: "如何为种植场景选择产品？" }, { en: "Where can I find application guidance?", zh: "在哪里可以查看应用指导？" }] },
  { id: "orders", en: "Purchasing and support", zh: "采购与服务", questions: [{ en: "How can I make a product enquiry?", zh: "如何咨询产品？" }, { en: "How can I find a local distributor?", zh: "如何查询当地经销商？" }] },
] as const;
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const key = (value: unknown): string | null => typeof value === "string" || typeof value === "number" ? String(value) : null;

export const getFaqContent = cache(async (locale: CatalogLocale): Promise<FaqContentData> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return { source, groups: sample.map(group => ({ id: group.id, name: locale === "en" || locale === "zh" ? group[locale] : null, questions: group.questions.map((item, index) => ({ id: `${group.id}-${index}`, question: locale === "en" || locale === "zh" ? item[locale] : null, answer: locale === "en" ? "This is a sample answer. Product and service details await owner confirmation." : locale === "zh" ? "此处为示例回答，具体产品及服务信息等待业主确认。" : null })) })) };
  if (source !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const payload = await getAppPayload();
  const [categoryResult, questionResult] = await Promise.all([
    payload.find({ collection: "faq-groups", locale, fallbackLocale: "en", depth: 0, overrideAccess: false, pagination: false, sort: ["sortOrder", "id"] }),
    payload.find({ collection: "faqs", locale, fallbackLocale: "en", depth: 0, overrideAccess: false, pagination: false, sort: ["sortOrder", "id"] }),
  ]);
  const groups = categoryResult.docs.flatMap(value => { const item = object(value), id = key(item?.id); return id ? [{ id, name: text(item?.name), questions: [] as FaqGroup["questions"] }] : []; });
  const byId = new Map(groups.map(group => [group.id, group]));
  for (const value of questionResult.docs) {
    const item = object(value), id = key(item?.id), groupId = key(item?.group);
    const group = groupId ? byId.get(groupId) : undefined;
    if (id && group) group.questions.push({ id, question: text(item?.question), answer: text(item?.answer) });
  }
  return { source, groups };
});
