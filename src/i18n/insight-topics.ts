import type { CatalogPageLocale } from "./catalog-messages";
import { completeLocaleMap } from "./locale-fallback";

export const insightTopics: Record<CatalogPageLocale, Record<string, string>> = completeLocaleMap<Record<string, string>>({
  en: { "plant-nutrition": "Plant nutrition", "growing-practices": "Growing practices", "crop-guides": "Crop guides", "product-knowledge": "Product knowledge" },
  zh: { "plant-nutrition": "植物营养", "growing-practices": "种植方法", "crop-guides": "作物指南", "product-knowledge": "产品知识" },
  fr: { "plant-nutrition": "Nutrition végétale", "growing-practices": "Pratiques culturales", "crop-guides": "Guides des cultures", "product-knowledge": "Connaissance des produits" },
  es: { "plant-nutrition": "Nutrición vegetal", "growing-practices": "Prácticas de cultivo", "crop-guides": "Guías de cultivos", "product-knowledge": "Conocimiento de productos" },
});

export const topicLabel = (locale: CatalogPageLocale, slug: string) => insightTopics[locale][slug] ?? slug;
