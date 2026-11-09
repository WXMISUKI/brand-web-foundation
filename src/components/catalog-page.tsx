import Link from "next/link";
import { getSiteCatalogOverview, getSiteCatalogResults } from "../content/site-catalog";
import { CatalogOverview } from "./catalog-overview";
import { CatalogControls, catalogHref } from "./catalog-controls";
import { ProductVisual } from "./product-visual";
import { aboutMessages } from "../i18n/about-messages";
import { catalogMessages, type CatalogPageLocale } from "../i18n/catalog-messages";

export async function CatalogPage({ locale, category, query, page, basePath }: { locale: CatalogPageLocale; category: string; query: string; page: number; basePath?: string }) {
  const copy = catalogMessages[locale], common = aboutMessages[locale], prefix = `/${locale}`;
  const [catalog, results] = await Promise.all([getSiteCatalogOverview(locale), getSiteCatalogResults(locale, category, query, page, 12)]);
  const sample = catalog.source === "sample";
  const noMatch = copy.noMatch;
  return <main className="catalog-page"><div className="inner"><nav className="crumb" aria-label={common.breadcrumb}>{locale === "es" ? copy.title : <><Link href={prefix}>{common.home}</Link> / {copy.title}</>}</nav><CatalogOverview locale={locale} catalog={catalog} basePath={basePath}/><h2 id="catalog-results" className="catalog-results-title">{sample ? copy.sampleProducts : copy.products}</h2><CatalogControls locale={locale} category={category} query={query} count={results.totalDocs} categories={catalog.categories} sample={sample} basePath={basePath}/>{results.products.length ? <div className="product-grid">{results.products.map((product,index)=>{const name=product.name ?? common.pending;return <Link className="product-card" href={`${basePath ?? `${prefix}/products`}/${encodeURIComponent(product.slug)}`} key={product.slug}><ProductVisual number={String((page - 1) * 12 + index+1).padStart(2,"0")} media={product.media ? { src: product.media.src, alt: { [locale]: product.media.alt ?? "" } } : undefined} locale={locale} productName={name}/><div className="product-copy"><small>{product.category?.name ?? common.pending}{sample && ` · ${common.sample}`}</small><h2>{name}</h2><p>{product.intro ?? copy.missing}</p><span>{copy.details} ↗</span></div></Link>;})}</div> : <p>{noMatch} <Link href={catalogHref(locale,"","",true,1,basePath)}>{copy.clear}</Link></p>}{(results.totalPages > 1 || page > 1) && <nav className="insight-pagination" aria-label={copy.pagination}>{page > 1 && <Link href={catalogHref(locale,category,query,true,Math.min(page-1,Math.max(results.totalPages,1)),basePath)}>{copy.previous}</Link>}<span>{copy.page} {page} {copy.of} {results.totalPages || 1}{locale === "zh" && " 页"}</span>{page < results.totalPages && <Link href={catalogHref(locale,category,query,true,page+1,basePath)}>{copy.next}</Link>}</nav>}</div></main>;
}
