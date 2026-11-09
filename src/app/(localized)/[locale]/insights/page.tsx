import { InsightList } from "../../../../components/insight-content";
import { LocalizedShell, readyEditorialLocale } from "../../../../components/localized-shell";
import { insightPageNumber, insightSearchPath } from "../../../../data/insight-search";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string | string[]; author?: string | string[]; topic?: string | string[]; page?: string | string[] }> }) {
  const locale = readyEditorialLocale((await params).locale);
  const { q, author: authorParam, topic: topicParam, page: pageParam } = await searchParams;
  const query = typeof q === "string" ? q : "", author = typeof authorParam === "string" ? authorParam : "", topic = typeof topicParam === "string" ? topicParam : "", page = insightPageNumber(pageParam);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={insightSearchPath(locale === "en" ? "zh" : "en", query, author, topic, page)}><InsightList locale={locale} query={query} author={author} topic={topic} page={page}/></LocalizedShell>;
}
