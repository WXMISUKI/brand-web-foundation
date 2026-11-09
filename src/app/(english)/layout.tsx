import type { Metadata } from "next";
import { MobileQuickLinks } from "../../components/mobile-quick-links";
import { CatalogCategoriesProvider } from "../../components/catalog-categories-provider";
import { getSiteCategories } from "../../content/site-catalog";
import { CanonicalLink } from "../../components/canonical-link";
import { AlternateLinks } from "../../components/alternate-links";
import "../styles.css";

export const metadata: Metadata = { title: "Plant Nutrition | Prototype", description: "Plant nutrition website prototype with sample content.", icons: { icon: "/favicon.svg" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await getSiteCategories("en");
  return <html lang="en"><head><CanonicalLink /><AlternateLinks /></head><body><CatalogCategoriesProvider categories={categories}>{children}<MobileQuickLinks locale="en" /></CatalogCategoriesProvider></body></html>;
}
