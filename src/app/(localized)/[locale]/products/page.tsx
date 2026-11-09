import { CatalogPage } from "../../../../components/catalog-page";
import { catalogHref } from "../../../../components/catalog-controls";
import { LocalizedShell, readyProductsLocale } from "../../../../components/localized-shell";
import { insightPageNumber } from "../../../../data/insight-search";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string | string[]; q?: string | string[]; page?: string | string[] }> }) {
  const locale = readyProductsLocale((await params).locale), search = await searchParams;
  const category = typeof search.category === "string" ? search.category : "";
  const query = typeof search.q === "string" ? search.q.trim().slice(0, 100) : "";
  const page = insightPageNumber(search.page);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={catalogHref(locale === "en" ? "zh" : "en", category, query, false, page)}><CatalogPage locale={locale} category={category} query={query} page={page}/></LocalizedShell>;
}
