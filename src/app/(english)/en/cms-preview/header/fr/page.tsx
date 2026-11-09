import { notFound } from "next/navigation";
import { SiteHeader } from "../../../../../../components/site-header";
import { CatalogCategoriesProvider } from "../../../../../../components/catalog-categories-provider";
import { getSiteCategories } from "../../../../../../content/site-catalog";
export const dynamic = "force-dynamic";
export default async function FrenchHeaderPreview() {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const categories = await getSiteCategories("fr");
  return <><aside className="locale-preview-notice"><strong>Local-only French navigation preview · translations require review</strong><p>Links point to public pages that are not yet available in French.</p></aside><div lang="fr" dir="ltr"><CatalogCategoriesProvider categories={categories}><SiteHeader locale="fr" alternatePath="/en"/><main className="inner"><h1>Navigation · aperçu</h1></main></CatalogCategoriesProvider></div></>;
}
