import type { LocaleCode } from "./locales.ts";

export type CatalogUiLocale = LocaleCode;
export type CatalogPageLocale = LocaleCode;
import { completeLocaleMap } from "./locale-fallback.ts";

export const catalogMessages = completeLocaleMap({
  en: { title:"Product catalog", intro:"Explore the KOMU plant nutrition collection and brochure-linked product pages.", featured:"Featured product", empty:"No product available.", browse:"Browse products in this category.", productsLabel:"Products:", viewProducts:"View products", products:"Products", sampleProducts:"Products", categories:"Product categories", all:"All", search:"Search products", searchSample:"Search products", placeholder:"Product name or description", submit:"Search", note:"Search uses the current language; keywords are not translated when switching languages.", details:"View details", missing:"Product description unavailable.", noMatch:"No matching products found on this page.", clear:"Clear search and filters", pagination:"Product pages", previous:"Previous", next:"Next", page:"Page", of:"of" },
  zh: { title:"产品中心", intro:"浏览康姆植物营养产品系列与画册关联产品页面。", featured:"精选产品", empty:"暂无产品。", browse:"浏览此分类中的产品。", productsLabel:"产品：", viewProducts:"查看产品", products:"产品", sampleProducts:"产品", categories:"产品类别", all:"全部", search:"搜索产品", searchSample:"搜索产品", placeholder:"产品名称或简介", submit:"搜索", note:"搜索当前语言的名称和简介；切换语言时关键词不会自动翻译。", details:"了解详情", missing:"产品简介暂未提供。", noMatch:"此页没有匹配的产品。", clear:"清除搜索与筛选", pagination:"产品分页", previous:"上一页", next:"下一页", page:"第", of:"页 / 共" },
  fr: { title:"Catalogue de produits", intro:"Découvrez les catégories et produits de nutrition végétale. Contenu à confirmer.", featured:"Produit à la une", empty:"Aucun produit disponible.", browse:"Découvrez les produits de cette catégorie.", productsLabel:"Produits :", viewProducts:"Voir les produits", products:"Produits", sampleProducts:"Produits d’exemple", categories:"Catégories de produits", all:"Tous", search:"Rechercher des produits", searchSample:"Rechercher des produits d’exemple", placeholder:"Nom ou description du produit", submit:"Rechercher", note:"La recherche utilise la langue courante ; les mots-clés ne sont pas traduits lors du changement de langue.", details:"Voir les détails", missing:"Description ou traduction du produit à compléter.", noMatch:"Aucun produit correspondant sur cette page.", clear:"Effacer la recherche et les filtres", pagination:"Pages de produits", previous:"Précédent", next:"Suivant", page:"Page", of:"sur" },
  es: { title:"Catálogo de productos", intro:"Explore las categorías y productos de nutrición vegetal. Información pendiente de confirmar.", featured:"Producto destacado", empty:"No hay productos disponibles.", browse:"Explore los productos de esta categoría.", productsLabel:"Productos:", viewProducts:"Ver productos", products:"Productos", sampleProducts:"Productos de ejemplo", categories:"Categorías de productos", all:"Todos", search:"Buscar productos", searchSample:"Buscar productos de ejemplo", placeholder:"Nombre o descripción del producto", submit:"Buscar", note:"La búsqueda utiliza el idioma actual; las palabras clave no se traducen al cambiar de idioma.", details:"Ver detalles", missing:"Descripción o traducción del producto pendiente.", noMatch:"No se encontraron productos en esta página.", clear:"Borrar búsqueda y filtros", pagination:"Páginas de productos", previous:"Anterior", next:"Siguiente", page:"Página", of:"de" },
});

export function productCount(locale: CatalogPageLocale, count: number, sample = false) {
  if (locale === "zh") return `找到 ${count} 条产品`;
  if (locale === "fr") return `${count} produit${count === 1 ? "" : "s"}`;
  if (locale === "es") return `${count} producto${count === 1 ? "" : "s"}`;
  return `${count} ${count === 1 ? "product" : "products"} found`;
}
export function categoryProductCount(locale: CatalogPageLocale, count: number) {
  if (locale === "zh") return `${count} 个产品`;
  if (locale === "fr") return `${count} produit${count === 1 ? "" : "s"}`;
  if (locale === "es") return `${count} producto${count === 1 ? "" : "s"}`;
  return `${count} ${count === 1 ? "product" : "products"}`;
}
