import "server-only";
import { cache } from "react";
import { products } from "../data/products";
import { englishProducts } from "../data/english-samples";
import { englishCategories, productCategories } from "../data/categories";
import type { Catalog, CatalogCategory, CatalogLocale, CatalogProduct, CatalogOverviewData, CatalogResults } from "./catalog";
import { publicProductDetail, publicProductIntro } from "../lib/public-content";

function sampleCategories(locale: CatalogLocale): CatalogCategory[] {
  return productCategories.map(item => ({ slug: item.id, name: locale === "en" ? englishCategories[item.id] : locale === "zh" ? item.name : null }));
}

function sampleCatalog(locale: CatalogLocale): Catalog {
  const categories = sampleCategories(locale);
  return {
    source: "sample",
    categories,
    products: products.map((item) => {
      const translated = englishProducts.find(product => product.slug === item.slug)?.translation;
      const sampleLocale = locale === "en" || locale === "zh" ? locale : null;
      const details = sampleLocale ? item.details?.[sampleLocale] : undefined;
      return {
        slug: item.slug,
        category: categories.find(category => category.slug === item.categoryId) ?? null,
        name: locale === "en" ? translated?.name ?? null : locale === "zh" ? item.name : null,
        intro: publicProductIntro(locale === "en" ? translated?.intro ?? null : locale === "zh" ? item.intro : null, locale),
        media: item.media?.src ? { src: item.media.src, alt: sampleLocale ? item.media.alt[sampleLocale] ?? null : null } : null,
        details: { materials: publicProductDetail(details?.materials, locale), packaging: publicProductDetail(details?.packaging, locale), uses: publicProductDetail(details?.uses, locale), instructions: publicProductDetail(details?.instructions, locale) },
        specifications: (item.specifications ?? []).map(spec => ({ id: spec.id, label: sampleLocale ? spec.label[sampleLocale] ?? null : null, unit: spec.unit ?? null, typical: spec.typical ?? null, minimum: spec.minimum ?? null, maximum: spec.maximum ?? null })),
        provenance: {
          sourcePages: item.sourcePages ?? [],
          sourceRelatedPages: (item.sourceRelatedPages ?? []).map(page => ({ ...page, note: page.note ?? null })),
          sourceDetailPreviewPath: item.sourceDetailPreviewPath ?? null,
          sourcePreviewPath: item.sourcePreviewPath ?? null,
          sourceUrl: item.sourceUrl ?? null,
          sourceNote: item.sourceNote ?? null,
          reviewStatus: item.reviewStatus ?? null,
          assetStatus: item.assetStatus ?? null,
          claimsVerified: item.claimsVerified ?? null,
        },
      };
    }),
  };
}

export const getSiteCategories = cache(async (locale: CatalogLocale): Promise<CatalogCategory[]> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return sampleCategories(locale);
  if (source === "payload") return (await import("./catalog")).getCatalogCategories(locale);
  throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
});

/** Source choice is explicit: an unavailable CMS must never silently display sample data. */
export const getSiteCatalog = cache(async (locale: CatalogLocale): Promise<Catalog> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return sampleCatalog(locale);
  if (source === "payload") return (await import("./catalog")).getCatalog(locale);
  throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
});

export const getSiteHighlights = cache(async (locale: CatalogLocale, limit: number, excludeSlug?: string): Promise<{ source: Catalog["source"]; products: CatalogProduct[] }> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return { source, products: sampleCatalog(locale).products.filter(item => item.slug !== excludeSlug).slice(0, limit) };
  if (source === "payload") return { source, products: await (await import("./catalog")).getCatalogHighlights(locale, limit, excludeSlug) };
  throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
});

export const getSiteProduct = cache(async (locale: CatalogLocale, slug: string): Promise<CatalogProduct | null> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "sample") return sampleCatalog(locale).products.find(item => item.slug === slug) ?? null;
  if (source === "payload") return (await import("./catalog")).getCatalogProduct(locale, slug);
  throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
});

export const getSiteCatalogOverview = cache(async (locale: CatalogLocale): Promise<CatalogOverviewData> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "payload") return (await import("./catalog")).getCatalogOverview(locale);
  if (source !== "sample") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const catalog = sampleCatalog(locale);
  return { source, featured: catalog.products[0] ?? null, categories: catalog.categories.map(category => { const products = catalog.products.filter(item => item.category?.slug === category.slug); return { ...category, count: products.length, products: products.slice(0, 3) }; }) };
});

export const getSiteCatalogResults = cache(async (locale: CatalogLocale, category: string, query: string, page: number, limit: number): Promise<CatalogResults> => {
  const source = process.env.CATALOG_SOURCE || "sample";
  if (source === "payload") return (await import("./catalog")).getCatalogResults(locale, category, query, page, limit);
  if (source !== "sample") throw new Error(`Unsupported CATALOG_SOURCE: ${source}`);
  const term = query.toLocaleLowerCase();
  const products = sampleCatalog(locale).products.filter(item => (!category || item.category?.slug === category) && (!term || `${item.name ?? ""} ${item.intro ?? ""}`.toLocaleLowerCase().includes(term)));
  return { products: products.slice((page - 1) * limit, page * limit), totalDocs: products.length, totalPages: Math.ceil(products.length / limit) };
});
