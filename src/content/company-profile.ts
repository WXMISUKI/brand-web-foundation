import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";

import { siteContact } from "../data/site-contact";
import type { CatalogLocale } from "./catalog";
import { localizedText } from "../lib/localized-text";

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
  ? [["植物营养", "基于业主提供画册整理的产品与应用资料库。"], ["产品品质", "围绕来源页、包装和技术资料组织产品信息。"], ["种植支持", "按作物和种植方式整理产品应用入口。"]]
  : [["Plant nutrition", "A practical product and application library built from the owner-provided brochure."], ["Product quality", "Product information is organized around source pages, packaging and technical documents."], ["Grower support", "Crop and growing practice routes help buyers find the right product information."]]).map(([title, description], index) => ({ id: String(index), title, description }));

export const getCompanyProfile = cache(async (locale: CatalogLocale): Promise<CompanyProfile> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return { source, title: locale === "en" ? "About Anhui Kangmu" : locale === "zh" ? "关于安徽康母" : null, summary: locale === "en" ? "Anhui Kangmu International Fertilizer Co., Ltd. · KOMU plant nutrition" : locale === "zh" ? "安徽康母国际化肥股份有限公司 · 康姆植物营养" : null, description: locale === "en" ? "Anhui Kangmu International Fertilizer Co., Ltd. presents the KOMU plant nutrition collection for growers, buyers and distribution partners." : locale === "zh" ? "安徽康母国际化肥股份有限公司围绕康姆植物营养产品，为种植者、采购商和渠道伙伴提供产品与应用资料。" : null, banner: null, contact: { companyName: locale === "zh" ? siteContact.companyName.zh : siteContact.companyName.en, email: siteContact.email, whatsapp: siteContact.whatsapp, address: siteContact.address }, focusAreas: (locale === "en" ? ["Plant nutrition", "Product quality", "Grower support"] : locale === "zh" ? ["植物营养", "产品品质", "种植支持"] : []).map((title, index) => ({ id: String(index), title, description: locale === "en" ? "A practical product and application library built from the owner-provided brochure." : "基于业主提供画册整理的产品与应用资料库。" })), milestones: [] };
  if (source !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const payload = await getAppPayload();
  const result = await payload.findGlobal({ slug: "company-profile", locale, fallbackLocale: "en", depth: 1, overrideAccess: false });
  const fallbackFocus = defaultFocusAreas(locale);
  const focusRows = rows(result.focusAreas).map((row, index) => ({ id: text(row.id) ?? String(index), title: localizedText(row.title, locale), description: localizedText(row.description, locale) }));
  const focusAreas = fallbackFocus.map((fallback, index) => ({ id: focusRows[index]?.id ?? fallback.id, title: focusRows[index]?.title ?? fallback.title, description: focusRows[index]?.description ?? fallback.description }));
  return { source, title: text(result.title), summary: text(result.summary), description: text(result.description), banner: image(result.banner, locale), contact: { companyName: text(result.legalName) ?? (locale === "zh" ? siteContact.companyName.zh : siteContact.companyName.en), email: text(result.email) ?? siteContact.email, whatsapp: text(result.whatsapp) ?? siteContact.whatsapp, address: text(result.address) ?? siteContact.address }, focusAreas, milestones: rows(result.milestones).map((row, index) => ({ id: text(row.id) ?? String(index), period: text(row.period), title: localizedText(row.title, locale), description: localizedText(row.description, locale), image: image(row.image, locale) })) };
});
