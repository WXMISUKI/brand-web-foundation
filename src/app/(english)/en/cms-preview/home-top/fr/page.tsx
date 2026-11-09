import { notFound } from "next/navigation";
import { Hero } from "../../../../../../components/hero";
import { HomeFeatured } from "../../../../../../components/home-featured";
import { getHeroSlides } from "../../../../../../content/homepage";
import { getSiteCategories } from "../../../../../../content/site-catalog";
import { CatalogCategoriesProvider } from "../../../../../../components/catalog-categories-provider";
import { InterestSection } from "../../../../../../components/interest-section";
import { HomeProducts } from "../../../../../../components/home-products";
export const dynamic = "force-dynamic";
export default async function FrenchHomeTopPreview() {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const [slides, categories] = await Promise.all([getHeroSlides("fr"), getSiteCategories("fr")]);
  return <><aside className="locale-preview-notice"><strong>Local-only French home preview · translations require review</strong><p>Some links point to unfinished pages.</p></aside><div lang="fr" dir="ltr"><CatalogCategoriesProvider categories={categories}><Hero locale="fr" slides={slides}/><InterestSection locale="fr"/><HomeFeatured locale="fr"/><HomeProducts locale="fr"/></CatalogCategoriesProvider></div></>;
}
