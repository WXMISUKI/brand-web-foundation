import { notFound } from "next/navigation";
import { CaseList } from "../../../../../../components/case-content";
import { insightPageNumber } from "../../../../../../data/insight-search";
export const dynamic = "force-dynamic";
export default async function FrenchCasePreview({ searchParams }: { searchParams: Promise<{ q?: string | string[]; page?: string | string[] }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const s = await searchParams, query = typeof s.q === "string" ? s.q.trim().slice(0,100) : "";
  return <><aside className="locale-preview-notice"><strong>Local-only French case preview · translations require review</strong><p>Some links may lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><CaseList locale="fr" query={query} page={insightPageNumber(s.page)} basePath="/en/cms-preview/cases/fr"/></div></>;
}
