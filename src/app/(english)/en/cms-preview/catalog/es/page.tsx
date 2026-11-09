import { notFound } from "next/navigation";
import { CatalogPage } from "../../../../../../components/catalog-page";
import { insightPageNumber } from "../../../../../../data/insight-search";
export const dynamic = "force-dynamic";
export default async function SpanishCatalogPreview({ searchParams }: { searchParams: Promise<{ category?: string | string[]; q?: string | string[]; page?: string | string[] }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const search = await searchParams;
  const category = typeof search.category === "string" ? search.category : "";
  const query = typeof search.q === "string" ? search.q.trim().slice(0, 100) : "";
  return <><aside className="locale-preview-notice"><strong>Local-only Spanish catalog preview · translations require review</strong><p>Product details open in this preview; other links may lead to unfinished public pages.</p></aside><div lang="es" dir="ltr"><CatalogPage locale="es" category={category} query={query} page={insightPageNumber(search.page)} basePath="/en/cms-preview/catalog/es"/></div></>;
}
