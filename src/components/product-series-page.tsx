import Link from "next/link";
import { getSiteCatalogOverview, getSiteCatalogResults } from "../content/site-catalog";
import { referenceSeriesLabel, referenceSeriesSlugs } from "../data/reference-index";
import { referenceRouteMessages } from "../i18n/reference-route-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { ProductVisual } from "./product-visual";

export async function ProductSeriesIndexPage({ locale }: { locale: CatalogPageLocale }) {
  const copy = referenceRouteMessages[locale];
  const catalog = await getSiteCatalogOverview(locale);
  const categories = catalog.categories.filter(category => referenceSeriesSlugs.includes(category.slug as (typeof referenceSeriesSlugs)[number]));
  return <main><div className="detail-banner reference-index-banner"><div><span>{copy.seriesTitle}</span><p>{copy.seriesIntro}</p></div></div><div className="inner reference-index-page"><nav className="crumb" aria-label={copy.breadcrumb}><Link href={`/${locale}`}>{copy.home}</Link> / {copy.seriesTitle}</nav><header className="reference-index-heading"><span className="eyebrow">{copy.seriesTitle}</span><h1>{copy.seriesTitle}</h1><p>{copy.seriesIntro}</p></header><div className="reference-index-grid">{categories.map(category => { const label = referenceSeriesLabel(locale, category.slug) ?? category.name ?? copy.seriesTitle; return <Link className="reference-index-card" key={category.slug} href={`/${locale}/products/series/${encodeURIComponent(category.slug)}`}><span className="reference-index-card-number" aria-hidden="true">{String(categories.indexOf(category) + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{category.count} {category.count === 1 ? copy.productCount : copy.productsCount}</small><span>{copy.view} ↗</span></Link>; })}</div></div></main>;
}

export async function ProductSeriesDetailPage({ locale, slug }: { locale: CatalogPageLocale; slug: string }) {
  const copy = referenceRouteMessages[locale];
  const label = referenceSeriesLabel(locale, slug);
  if (!label || !referenceSeriesSlugs.includes(slug as (typeof referenceSeriesSlugs)[number])) return null;
  const [catalog, results] = await Promise.all([getSiteCatalogOverview(locale), getSiteCatalogResults(locale, slug, "", 1, 24)]);
  return <main><div className="detail-banner reference-index-banner"><div><span>{copy.seriesTitle}</span><p>{label}</p></div></div><div className="inner reference-index-page"><nav className="crumb" aria-label={copy.breadcrumb}><Link href={`/${locale}`}>{copy.home}</Link> / <Link href={`/${locale}/products/series`}>{copy.seriesTitle}</Link> / {label}</nav><header className="reference-index-heading"><span className="eyebrow">{copy.seriesTitle}</span><h1>{label}</h1></header>{results.products.length ? <section aria-labelledby="series-products-title"><h2 id="series-products-title">{copy.products}</h2><div className="product-grid">{results.products.map((product, index) => <Link className="product-card" href={`/${locale}/products/${encodeURIComponent(product.slug)}`} key={product.slug}><ProductVisual number={String(index + 1).padStart(2, "0")} media={product.media ? { src: product.media.src, alt: { [locale]: product.media.alt ?? "" } } : undefined} locale={locale} productName={product.name ?? label}/><div className="product-copy"><small>{product.category?.name ?? label}</small><h3>{product.name ?? label}</h3>{product.intro && <p>{product.intro}</p>}<span>{copy.details} ↗</span></div></Link>)}</div></section> : <p role="status">{copy.empty}</p>}<Link className="text-link" href={`/${locale}/products/series`}>← {copy.back}</Link></div></main>;
}

export function hasProductSeriesSlug(slug: string) {
  return referenceSeriesSlugs.includes(slug as (typeof referenceSeriesSlugs)[number]);
}
