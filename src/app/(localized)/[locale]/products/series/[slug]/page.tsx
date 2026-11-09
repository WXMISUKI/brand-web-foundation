import { notFound } from "next/navigation";
import { LocalizedShell, readyProductsLocale } from "../../../../../../components/localized-shell";
import { hasProductSeriesSlug, ProductSeriesDetailPage } from "../../../../../../components/product-series-page";

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: code, slug } = await params;
  const locale = readyProductsLocale(code);
  if (!hasProductSeriesSlug(slug)) notFound();
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={`/${locale === "en" ? "zh" : "en"}/products/series/${encodeURIComponent(slug)}`}><ProductSeriesDetailPage locale={locale} slug={slug}/></LocalizedShell>;
}
