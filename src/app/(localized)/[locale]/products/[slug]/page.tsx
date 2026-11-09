import { notFound } from "next/navigation";
import { getSiteHighlights, getSiteProduct } from "../../../../../content/site-catalog";
import { CatalogProductDetail } from "../../../../../components/catalog-product-detail";
import { LocalizedShell, readyProductsLocale } from "../../../../../components/localized-shell";
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: code, slug } = await params, locale = readyProductsLocale(code);
  const product = await getSiteProduct(locale, slug);
  if (!product) notFound();
  const highlights = await getSiteHighlights(locale, 3, slug);
  const catalog = { ...highlights, categories: [] };
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={'/' + (locale === "en" ? "zh" : "en") + '/products/' + encodeURIComponent(product.slug)}><CatalogProductDetail locale={locale} product={product} catalog={catalog}/></LocalizedShell>;
}
