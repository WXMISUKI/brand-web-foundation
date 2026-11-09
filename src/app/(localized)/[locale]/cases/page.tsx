import { CaseList } from "../../../../components/case-content";
import { LocalizedShell, readyEditorialLocale } from "../../../../components/localized-shell";
import { casePath } from "../../../../data/case-path";
import { insightPageNumber } from "../../../../data/insight-search";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string | string[]; page?: string | string[] }> }) {
  const locale = readyEditorialLocale((await params).locale);
  const search = await searchParams, value = search.q;
  const query = typeof value === "string" ? value.trim().slice(0, 200) : "";
  const page = insightPageNumber(search.page);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={casePath(locale === "en" ? "zh" : "en", query, page)}><CaseList locale={locale} query={query} page={page}/></LocalizedShell>;
}
