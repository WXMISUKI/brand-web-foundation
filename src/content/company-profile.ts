import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";

import { siteContact } from "../data/site-contact";
import type { CatalogLocale } from "./catalog";
import { localizedText } from "../lib/localized-text";
import { companyDescriptionForDisplay, focusDescriptionForDisplay, correctKnownCompanyName } from "../data/company-public-copy.mjs";
import companyPreview from "../data/company-preview.json";

type CompanyImage = { src: string; alt: string | null };
export type CompanyContact = { companyName: string | null; email: string | null; whatsapp: string | null; address: string | null };
type FocusArea = { id: string; title: string | null; description: string | null };
type Milestone = FocusArea & { period: string | null; image: CompanyImage | null };
export type CompanyProfile = { source: "sample" | "payload"; title: string | null; summary: string | null; description: string | null; banner: CompanyImage | null; contact: CompanyContact; focusAreas: FocusArea[]; milestones: Milestone[] };
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const image = (value: unknown, locale: CatalogLocale): CompanyImage | null => { const media = object(value), src = text(media?.url); return src ? { src, alt: localizedText(media?.alt, locale) } : null; };
const rows = (value: unknown): Record<string, unknown>[] => Array.isArray(value) ? value.map(object).filter((row): row is Record<string, unknown> => row !== null) : [];
const defaultFocusAreas = (locale: CatalogLocale): FocusArea[] => (locale === "zh"
  ? [["植物营养", "探索植物营养产品与应用资料。"], ["产品品质", "了解产品包装和技术资料。"], ["种植支持", "按作物和种植方式浏览产品应用。"]]
  : [["Plant nutrition", "Explore plant nutrition products and application information."], ["Product quality", "Find product packaging and technical information."], ["Grower support", "Explore products by crop and growing practice."]]).map(([title, description], index) => ({ id: String(index), title, description }));

export const getCompanyProfile = cache(async (locale: CatalogLocale): Promise<CompanyProfile> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") {
    const preview = companyPreview[locale];
    return { source, title: preview.title, summary: preview.summary, description: companyDescriptionForDisplay(locale, preview.description), banner: null, contact: { companyName: locale === "zh" ? siteContact.companyName.zh : siteContact.companyName.en, email: siteContact.email, whatsapp: siteContact.whatsapp, address: siteContact.address }, focusAreas: preview.focusAreas.map((area, index) => ({ id: String(index), title: area.title, description: focusDescriptionForDisplay(locale, index, area.description) })), milestones: [] };
  }
  if (source !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const payload = await getAppPayload();
  const result = await payload.findGlobal({ slug: "company-profile", locale, fallbackLocale: "en", depth: 1, overrideAccess: false });
  const fallbackFocus = defaultFocusAreas(locale);
  const focusRows = rows(result.focusAreas).map((row, index) => ({ id: text(row.id) ?? String(index), title: localizedText(row.title, locale), description: focusDescriptionForDisplay(locale, index, localizedText(row.description, locale)) }));
  const focusAreas = fallbackFocus.map((fallback, index) => ({ id: focusRows[index]?.id ?? fallback.id, title: focusRows[index]?.title ?? fallback.title, description: focusRows[index]?.description ?? fallback.description }));
  return { source, title: text(result.title), summary: text(result.summary), description: companyDescriptionForDisplay(locale, text(result.description)), banner: image(result.banner, locale), contact: { companyName: correctKnownCompanyName(text(result.legalName)) ?? (locale === "zh" ? siteContact.companyName.zh : siteContact.companyName.en), email: text(result.email) ?? siteContact.email, whatsapp: text(result.whatsapp) ?? siteContact.whatsapp, address: text(result.address) ?? siteContact.address }, focusAreas, milestones: rows(result.milestones).map((row, index) => ({ id: text(row.id) ?? String(index), period: text(row.period), title: localizedText(row.title, locale), description: localizedText(row.description, locale), image: image(row.image, locale) })) };
});
