import { notFound } from "next/navigation";
import { InsightList } from "../../../../../../components/insight-content";
import { insightPageNumber } from "../../../../../../data/insight-search";
export const dynamic = "force-dynamic";
export default async function FrenchInsightPreview({ searchParams }: { searchParams: Promise<{ q?: string | string[]; author?: string | string[]; page?: string | string[] }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const s = await searchParams, query = typeof s.q === "string" ? s.q.slice(0,100) : "", author = typeof s.author === "string" ? s.author.slice(0,100) : "";
  return <><aside className="locale-preview-notice"><strong>Local-only French article preview · translations require review</strong><p>Some links may lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><InsightList locale="fr" query={query} author={author} page={insightPageNumber(s.page)} basePath="/en/cms-preview/insights/fr"/></div></>;
}
