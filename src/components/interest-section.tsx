import { getSiteHighlights } from "../content/site-catalog";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { Interest } from "./interest";

export async function InterestSection({ locale }: { locale: CatalogPageLocale }) {
  const { source, products } = await getSiteHighlights(locale, 12);
  return <Interest locale={locale} products={products.map(({ slug, name, media }) => ({ slug, name, image: media?.src ?? null }))} sample={source === "sample"}/>;
}
