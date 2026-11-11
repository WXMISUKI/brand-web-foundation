import "server-only";
import { getAppPayload } from "../lib/payload";
import { type Where } from "payload";
import { cache } from "react";
import type { LocaleCode } from "../i18n/locales";
import { localizedText } from "../lib/localized-text";
import { publicProductDetail, publicProductIntro } from "../lib/public-content";
import { officialProductDisplayName } from "../data/official-product-display-names";
import { canonicalProductSlug, productAliasSlugs, publicProductAliasSlugs, uniqueSourceMedia, type ProductSourceMedia } from "../data/catalog-product-groups";

export type CatalogLocale = LocaleCode;
export type CatalogCategory = { slug: string; name: string | null };
export type CatalogProduct = {
  slug: string;
  category: CatalogCategory | null;
  name: string | null;
  intro: string | null;
  media: { src: string; alt: string | null } | null;
  sourceMedia?: ProductSourceMedia[];
  details: { materials: string | null; packaging: string | null; uses: string | null; instructions: string | null };
  specifications: Array<{ id: string; label: string | null; unit: string | null; typical: string | null; minimum: string | null; maximum: string | null }>;
  provenance: { sourcePages: number[]; sourceRelatedPages: Array<{ page: number; role: string; note: string | null }>; sourcePreviewPath: string | null; sourceDetailPreviewPath: string | null; sourceUrl: string | null; sourceNote: string | null; reviewStatus: string | null; assetStatus: string | null; claimsVerified: boolean | null };
};
export type Catalog = { source: "sample" | "payload"; categories: CatalogCategory[]; products: CatalogProduct[] };
export type CatalogOverviewData = { source: Catalog["source"]; categories: Array<CatalogCategory & { count: number; products: CatalogProduct[] }>; featured: CatalogProduct | null };
export type CatalogResults = { products: CatalogProduct[]; totalDocs: number; totalPages: number };

const record = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const text = (value: unknown): string | null => typeof value === "string" && value.trim() ? value : null;
const category = (value: unknown): CatalogCategory | null => {
  const item = record(value);
  const slug = text(item?.slug);
  return slug ? { slug, name: text(item?.name) } : null;
};

function product(value: unknown, locale: CatalogLocale): CatalogProduct | null {
  const item = record(value);
  const slug = text(item?.slug);
  if (!item || !slug) return null;
  const image = record(item.image);
  const src = text(image?.url);
  const rows = Array.isArray(item.specifications) ? item.specifications : [];
  const sourcePages = Array.isArray(item.sourcePages)
    ? item.sourcePages.flatMap((value) => {
        const page = record(value)?.page ?? value;
        return typeof page === "number" && Number.isInteger(page) && page > 0 ? [page] : [];
      })
    : [];
  const sourceRelatedPages = Array.isArray(item.sourceRelatedPages)
    ? item.sourceRelatedPages.flatMap((value) => {
        const related = record(value);
        const page = related?.page;
        const role = text(related?.role);
        return typeof page === "number" && Number.isInteger(page) && page > 0 && role ? [{ page, role, note: text(related?.note) }] : [];
      })
    : [];
  return {
    slug, category: category(item.category), name: officialProductDisplayName(locale, slug, text(item.name)), intro: publicProductIntro(item.intro, locale),
    media: src ? { src, alt: localizedText(image?.alt, locale) } : null,
    sourceMedia: src ? [{ src, alt: localizedText(image?.alt, locale), sourceUrl: text(item.sourceUrl) }] : [],
    details: { materials: publicProductDetail(item.materials, locale), packaging: publicProductDetail(item.packaging, locale), uses: publicProductDetail(item.uses, locale), instructions: publicProductDetail(item.instructions, locale) },
    specifications: rows.flatMap((value, index) => {
      const row = record(value);
      return row ? [{ id: text(row.id) ?? `row-${index}`, label: text(row.label), unit: text(row.unit), typical: text(row.typical), minimum: text(row.minimum), maximum: text(row.maximum) }] : [];
    }),
    provenance: {
      sourcePages,
      sourceRelatedPages,
      sourcePreviewPath: text(item.sourcePreviewPath),
      sourceDetailPreviewPath: text(item.sourceDetailPreviewPath),
      sourceUrl: text(item.sourceUrl),
      sourceNote: text(item.sourceNote),
      reviewStatus: text(item.reviewStatus),
      assetStatus: text(item.assetStatus),
      claimsVerified: typeof item.claimsVerified === "boolean" ? item.claimsVerified : null,
    },
  };
}

/** Read a bounded set for homepage and detail navigation. */
export const getCatalogHighlights = cache(async (locale: CatalogLocale, limit: number, excludeSlug?: string): Promise<CatalogProduct[]> => {
  const payload = await getAppPayload();
  const conditions: Where[] = [{ slug: { not_in: publicProductAliasSlugs } }];
  if (excludeSlug) conditions.push({ slug: { not_equals: excludeSlug } });
  const result = await payload.find({ collection: "products", locale, fallbackLocale: "en", depth: 1, overrideAccess: true, sort: ["-createdAt", "-id"], limit, where: { and: conditions } });
  return result.docs.flatMap(item => { const mapped = product(item, locale); return mapped ? [mapped] : []; });
});

export const getCatalogProduct = cache(async (locale: CatalogLocale, slug: string): Promise<CatalogProduct | null> => {
  const payload = await getAppPayload();
  const canonicalSlug = canonicalProductSlug(slug);
  const result = await payload.find({ collection: "products", locale, fallbackLocale: "en", depth: 1, overrideAccess: true, where: { slug: { equals: canonicalSlug } }, limit: 1 });
  const primary = result.docs.map(item => product(item, locale)).find(item => item !== null);
  if (!primary) return null;
  const aliases = productAliasSlugs(canonicalSlug);
  if (!aliases.length) return primary;
  const variants = await payload.find({ collection: "products", locale, fallbackLocale: "en", depth: 1, overrideAccess: true, where: { slug: { in: aliases } }, limit: aliases.length });
  const sourceMedia = variants.docs
    .map(item => product(item, locale))
    .filter((item): item is CatalogProduct => item !== null && item.name === primary.name)
    .flatMap(item => item.sourceMedia ?? []);
  return { ...primary, sourceMedia: uniqueSourceMedia([...(primary.sourceMedia ?? []), ...sourceMedia]) };
});

export const getCatalogOverview = cache(async (locale: CatalogLocale): Promise<CatalogOverviewData> => {
  const payload = await getAppPayload();
  const [categoryResult, featured] = await Promise.all([
    payload.find({ collection: "categories", locale, fallbackLocale: "en", pagination: false, depth: 0, overrideAccess: false }),
    getCatalogHighlights(locale, 1),
  ]);
  const categories = await Promise.all(categoryResult.docs.map(async value => {
    const item = record(value), mapped = category(value), id = item?.id;
    if (!mapped || (typeof id !== "number" && typeof id !== "string")) return null;
    const result = await payload.find({ collection: "products", locale, fallbackLocale: "en", depth: 1, overrideAccess: true, where: { and: [{ category: { equals: id } }, { slug: { not_in: publicProductAliasSlugs } }] }, sort: ["-createdAt", "-id"], limit: 3 });
    return { ...mapped, count: result.totalDocs, products: result.docs.flatMap(entry => { const found = product(entry, locale); return found ? [found] : []; }) };
  }));
  return { source: "payload", featured: featured[0] ?? null, categories: categories.filter(item => item !== null) };
});

export const getCatalogResults = cache(async (locale: CatalogLocale, categorySlug: string, query: string, page: number, limit: number): Promise<CatalogResults> => {
  const payload = await getAppPayload();
  const conditions: Where[] = [];
  if (categorySlug) {
    const categoryResult = await payload.find({ collection: "categories", locale, fallbackLocale: "en", depth: 0, overrideAccess: false, where: { slug: { equals: categorySlug } }, limit: 1 });
    const id = record(categoryResult.docs[0])?.id;
    if (typeof id !== "number" && typeof id !== "string") return { products: [], totalDocs: 0, totalPages: 0 };
    conditions.push({ category: { equals: id } });
  }
  if (query) conditions.push({ or: [{ name: { contains: query } }, { intro: { contains: query } }] });
  conditions.push({ slug: { not_in: publicProductAliasSlugs } });
  const result = await payload.find({ collection: "products", locale, fallbackLocale: "en", depth: 1, overrideAccess: true, sort: ["-createdAt", "-id"], limit, page, where: { and: conditions } });
  return { products: result.docs.flatMap(entry => { const found = product(entry, locale); return found ? [found] : []; }), totalDocs: result.totalDocs, totalPages: result.totalPages };
});

/** Read categories without fetching the product catalog. */
export const getCatalogCategories = cache(async (locale: CatalogLocale): Promise<CatalogCategory[]> => {
  const payload = await getAppPayload();
  const result = await payload.find({ collection: "categories", locale, fallbackLocale: "en", pagination: false, depth: 0, overrideAccess: false });
  return result.docs.flatMap((item) => { const mapped = category(item); return mapped ? [mapped] : []; });
});

/** Read published data in the requested language without silently falling back to another language. */
export async function getCatalog(locale: CatalogLocale): Promise<Catalog> {
  const payload = await getAppPayload();
  const [categories, productResult] = await Promise.all([
    getCatalogCategories(locale),
    payload.find({ collection: "products", locale, fallbackLocale: "en", pagination: false, depth: 1, overrideAccess: true, where: { slug: { not_in: publicProductAliasSlugs } } }),
  ]);
  return {
    source: "payload",
    categories,
    products: productResult.docs.flatMap((item) => { const mapped = product(item, locale); return mapped ? [mapped] : []; }),
  };
}
