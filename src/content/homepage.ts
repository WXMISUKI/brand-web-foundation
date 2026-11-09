import "server-only";
import { getAppPayload } from "../lib/payload";
import { cache } from "react";

import { sampleHeroSlides, type HeroSlide } from "../data/hero-slides";
import { heroMedia } from "../data/hero-media";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { localizedText } from "../lib/localized-text";

const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
export type FeaturedCard = { id: string; title: string | null; description: string | null; actionLabel: string | null; actionPath: string | null; image: { src: string; alt: string | null } | null; sample: boolean };
export const getFeaturedCards = cache(async (locale: CatalogPageLocale): Promise<FeaturedCard[]> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return [];
  if (source !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const payload = await getAppPayload();
  const result = await payload.findGlobal({ slug: "homepage", locale, fallbackLocale: "en", depth: 1, overrideAccess: false });
  const rows = Array.isArray(result.featured) ? result.featured : [];
  return rows.flatMap((value, index) => {
    const row = object(value); if (!row) return [];
    const media = object(row.image), src = text(media?.url);
    return [{ id: text(row.id) ?? String(index), title: text(row.title), description: text(row.description), actionLabel: text(row.actionLabel), actionPath: text(row.actionPath), image: src ? { src, alt: localizedText(media?.alt, locale) } : null, sample: false }];
  });
});
export const getHeroSlides = cache(async (locale: CatalogPageLocale): Promise<HeroSlide[]> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return sampleHeroSlides(locale);
  if (source !== "payload") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const payload = await getAppPayload();
  const result = await payload.findGlobal({ slug: "homepage", locale, fallbackLocale: "en", depth: 1, overrideAccess: false });
  const rows = Array.isArray(result.slides) ? result.slides : [];
  if (!rows.length) return sampleHeroSlides(locale);
  const slides = rows.flatMap(value => {
    const row = object(value);
    if (!row) return [];
    const image = text(object(row.image)?.url);
    return [{ eyebrow: text(row.eyebrow), title: text(row.title), description: text(row.description), actionLabel: text(row.actionLabel), actionPath: text(row.actionPath), image: image ?? heroMedia[0].image, sampleText: false, sampleImage: !image }];
  });
  return slides.length ? slides : sampleHeroSlides(locale);
});
