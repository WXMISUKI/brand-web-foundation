import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";

import type { CatalogLocale } from "./catalog";
import { correctKnownCompanyName } from "../data/company-public-copy.mjs";
import faqPreview from "../data/faq-preview.json";

export type FaqGroup = { id: string; name: string | null; questions: Array<{ id: string; question: string | null; answer: string | null }> };
export type FaqContentData = { source: "sample" | "payload"; groups: FaqGroup[] };
export function filterFaqContent(data: FaqContentData, query: string): FaqContentData {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return data;
  return { ...data, groups: data.groups.map(group => ({ ...group, questions: group.questions.filter(item => `${item.question ?? ""} ${item.answer ?? ""}`.toLocaleLowerCase().includes(term)) })).filter(group => group.questions.length > 0) };
}
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const key = (value: unknown): string | null => typeof value === "string" || typeof value === "number" ? String(value) : null;

export const getFaqContent = cache(async (locale: CatalogLocale): Promise<FaqContentData> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return { source, groups: faqPreview[locale] };
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
    if (id && group) group.questions.push({ id, question: text(item?.question), answer: correctKnownCompanyName(text(item?.answer)) });
  }
  return { source, groups };
});
