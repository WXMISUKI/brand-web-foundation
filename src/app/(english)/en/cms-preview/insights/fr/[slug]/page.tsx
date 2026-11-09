import { notFound } from "next/navigation";
import { InsightDetail } from "../../../../../../../components/insight-content";
export const dynamic = "force-dynamic";
export default async function FrenchArticlePreview({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  return <><aside className="locale-preview-notice"><strong>Local-only French article preview · translations require review</strong><p>Links inside articles may lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><InsightDetail locale="fr" slug={slug} basePath="/en/cms-preview/insights/fr"/></div></>;
}
