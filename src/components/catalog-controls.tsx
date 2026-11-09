import Link from "next/link";
import type { CatalogCategory } from "../content/catalog";
import { CatalogSearchForm } from "./catalog-search-form";
import { catalogHref } from "../data/catalog-path";
import { catalogMessages, productCount, type CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";
export { catalogHref } from "../data/catalog-path";

export function CatalogControls({ locale, category, query, count, categories, sample, basePath }: { locale: CatalogPageLocale; category: string; query: string; count: number; categories: CatalogCategory[]; sample: boolean; basePath?: string }) {
  const copy = catalogMessages[locale];
  return <><CatalogSearchForm key={JSON.stringify([locale, category, query])} locale={locale} category={category} query={query} sample={sample} basePath={basePath}/><nav className="catalog-filters" aria-label={copy.categories}><Link href={catalogHref(locale,"",query,true,1,basePath)} aria-current={!category ? "page" : undefined}>{copy.all}</Link>{categories.map(item=><Link key={item.slug} href={catalogHref(locale,item.slug,query,true,1,basePath)} aria-current={category === item.slug ? "page" : undefined}>{item.name ?? aboutMessages[locale].pending}</Link>)}</nav><p className="catalog-result-count">{productCount(locale,count,sample)}</p></>;
}
