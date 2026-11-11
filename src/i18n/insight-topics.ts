import type { CatalogPageLocale } from "./catalog-messages";
import { completeLocaleMap } from "./locale-fallback.ts";

export const insightTopics: Record<CatalogPageLocale, Record<string, string>> = completeLocaleMap<Record<string, string>>({
  en: { "plant-nutrition": "Plant nutrition", "growing-practices": "Growing practices", "crop-guides": "Crop guides", "product-knowledge": "Product knowledge" },
  zh: { "plant-nutrition": "植物营养", "growing-practices": "种植方法", "crop-guides": "作物指南", "product-knowledge": "产品知识" },
  fr: { "plant-nutrition": "Nutrition végétale", "growing-practices": "Pratiques culturales", "crop-guides": "Guides des cultures", "product-knowledge": "Connaissance des produits" },
  es: { "plant-nutrition": "Nutrición vegetal", "growing-practices": "Prácticas de cultivo", "crop-guides": "Guías de cultivos", "product-knowledge": "Conocimiento de productos" },
  pt: { "plant-nutrition": "Nutrição vegetal", "growing-practices": "Práticas de cultivo", "crop-guides": "Guias de culturas", "product-knowledge": "Conhecimento de produtos" },
  ru: { "plant-nutrition": "Питание растений", "growing-practices": "Методы выращивания", "crop-guides": "Руководства по культурам", "product-knowledge": "Знания о продуктах" },
  it: { "plant-nutrition": "Nutrizione delle piante", "growing-practices": "Pratiche di coltivazione", "crop-guides": "Guide alle colture", "product-knowledge": "Conoscenza dei prodotti" },
  tr: { "plant-nutrition": "Bitki besleme", "growing-practices": "Yetiştirme uygulamaları", "crop-guides": "Bitki rehberleri", "product-knowledge": "Ürün bilgisi" },
  th: { "plant-nutrition": "โภชนาการพืช", "growing-practices": "แนวทางการปลูก", "crop-guides": "คู่มือพืช", "product-knowledge": "ความรู้ผลิตภัณฑ์" },
  nl: { "plant-nutrition": "Plantenvoeding", "growing-practices": "Teeltpraktijken", "crop-guides": "Teeltgidsen", "product-knowledge": "Productkennis" },
  ro: { "plant-nutrition": "Nutriția plantelor", "growing-practices": "Practici de cultivare", "crop-guides": "Ghiduri de culturi", "product-knowledge": "Cunoștințe despre produse" },
  el: { "plant-nutrition": "Θρέψη φυτών", "growing-practices": "Πρακτικές καλλιέργειας", "crop-guides": "Οδηγοί καλλιεργειών", "product-knowledge": "Γνώση προϊόντων" },
  he: { "plant-nutrition": "תזונת צמחים", "growing-practices": "שיטות גידול", "crop-guides": "מדריכי גידולים", "product-knowledge": "ידע על מוצרים" },
});

export const topicLabel = (locale: CatalogPageLocale, slug: string) => insightTopics[locale][slug] ?? slug;
