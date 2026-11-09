import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogCategoriesProvider } from "../../../components/catalog-categories-provider";
import { MobileQuickLinks } from "../../../components/mobile-quick-links";
import { getSiteCategories } from "../../../content/site-catalog";
import { getLocale, isPublicLocale } from "../../../i18n/locales";
import { readyLayoutLocale } from "../../../components/localized-shell";
import { CanonicalLink } from "../../../components/canonical-link";
import { AlternateLinks } from "../../../components/alternate-links";
import "../../styles.css";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const current = getLocale(locale);
  const title = locale === "zh" ? "康姆植物营养 | 安徽康母国际化肥股份有限公司" : locale === "en" ? "KOMU Plant Nutrition | Anhui Kangmu International Fertilizer Co., Ltd." : `KOMU Plant Nutrition | ${current?.label ?? locale}`;
  const description = locale === "zh" ? "康姆植物营养产品、作物方案与种植资料。" : "KOMU plant nutrition products, official product catalog, crop solutions and grower resources.";
  return { title, description, icons: { icon: "/favicon.svg" }, robots: isPublicLocale(locale) ? { index: true, follow: true } : { index: false, follow: false } };
}
export default async function LocalizedLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: input } = await params;
  const code = readyLayoutLocale(input);
  const locale = getLocale(code);
  if (!locale) notFound();
  const categories = await getSiteCategories(code);
  return <html lang={locale.htmlLang} dir={locale.direction}><head><CanonicalLink fallbackPath={`/${code}`} /><AlternateLinks fallbackPath={`/${code}`} /></head><body><CatalogCategoriesProvider categories={categories}>{children}<MobileQuickLinks locale={code} /></CatalogCategoriesProvider></body></html>;
}
