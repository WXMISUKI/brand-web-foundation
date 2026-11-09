import { notFound } from "next/navigation";
import { NewsDetail } from "../../../../../../../components/news-content";
export const dynamic = "force-dynamic";
export default async function FrenchNewsDetailPreview({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const { slug } = await params;
  return <><aside className="locale-preview-notice"><strong>Local-only French news preview · translations require review</strong><p>Links inside articles may lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><NewsDetail locale="fr" slug={slug} basePath="/en/cms-preview/news/fr"/></div></>;
}
