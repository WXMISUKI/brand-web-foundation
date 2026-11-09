import { LocalizedShell, readyProductsLocale } from "../../../../../components/localized-shell";
import { ProductSeriesIndexPage } from "../../../../../components/product-series-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readyProductsLocale((await params).locale);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={`/${locale === "en" ? "zh" : "en"}/products/series`}><ProductSeriesIndexPage locale={locale}/></LocalizedShell>;
}
