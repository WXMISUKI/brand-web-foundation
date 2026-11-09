import { notFound } from "next/navigation";
import { NewsList } from "../../../../../../components/news-content";
import { newsPageNumber } from "../../../../../../data/news-page";
export const dynamic = "force-dynamic";
export default async function FrenchNewsPreview({ searchParams }: { searchParams: Promise<{ q?: string | string[]; page?: string | string[] }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const s = await searchParams, query = typeof s.q === "string" ? s.q.trim().slice(0,100) : "";
  return <><aside className="locale-preview-notice"><strong>Local-only French news preview · translations require review</strong><p>Some links may lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><NewsList locale="fr" query={query} page={newsPageNumber(s.page)} basePath="/en/cms-preview/news/fr"/></div></>;
}
