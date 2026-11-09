import { notFound } from "next/navigation";
import { CatalogPage } from "../../../../../../components/catalog-page";
import { insightPageNumber } from "../../../../../../data/insight-search";

export const dynamic = "force-dynamic";
export default async function FrenchCatalogPreview({ searchParams }: { searchParams: Promise<{ category?: string | string[]; q?: string | string[]; page?: string | string[] }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const search = await searchParams;
  const category = typeof search.category === "string" ? search.category : "";
  const query = typeof search.q === "string" ? search.q.trim().slice(0, 100) : "";
  const page = insightPageNumber(search.page);
  return <><aside className="locale-preview-notice"><strong>Local-only French catalog preview · translations require review</strong><p>Product details open in this preview; other links may lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><CatalogPage locale="fr" category={category} query={query} page={page} basePath="/en/cms-preview/catalog/fr"/></div></>;
}
