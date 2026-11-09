import Link from "next/link";
import type { CSSProperties } from "react";
import type { CatalogOverviewData } from "../content/catalog";
import { categoryImages } from "../data/section-media";
import { ProductVisual } from "./product-visual";
import { catalogMessages, categoryProductCount, type CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";
import { catalogHref } from "../data/catalog-path";

export function CatalogOverview({ locale, catalog, basePath }: { locale: CatalogPageLocale; catalog: CatalogOverviewData; basePath?: string }) {
  const copy = catalogMessages[locale], common = aboutMessages[locale];
  const prefix = `/${locale}`;
  const featured = catalog.featured;
  const pending = common.pending;
  return <section className="catalog-overview" aria-labelledby="catalog-title">
    <div className="catalog-intro"><span className="eyebrow">{copy.title}{catalog.source === "sample" && ` · ${common.sample}`}</span><h1 id="catalog-title">{copy.title}</h1><p>{copy.intro}</p><div className="catalog-intro-note"><strong>{copy.featured}</strong>{featured ? <><p>{featured.intro ?? copy.missing}</p><Link className="catalog-featured-product" href={`${basePath ?? `${prefix}/products`}/${encodeURIComponent(featured.slug)}`}><ProductVisual number="01" media={featured.media ? { src: featured.media.src, alt: { [locale]: featured.media.alt ?? "" } } : undefined} locale={locale} productName={featured.name ?? pending}/><span>{featured.name ?? pending} ↗</span></Link></> : <p>{copy.empty}</p>}</div></div>
    <div className="catalog-category-grid">{catalog.categories.map((category,index)=>{
      const items = category.products;
      const name = category.name ?? pending;
      const href = catalogHref(locale,category.slug,"",true,1,basePath);
      return <article className={`catalog-category catalog-category-${index % 3 + 1}`} key={category.slug} style={categoryImages[category.slug] ? ({ "--card-image": `url("${categoryImages[category.slug]}")` } as CSSProperties) : undefined}><Link className="catalog-category-overlay" href={href} aria-label={name}/><span className="catalog-symbol" aria-hidden="true">{["✳","◌","✧"][index % 3]}</span><div className="catalog-category-label"><span><strong>{name}</strong><small>{categoryProductCount(locale,category.count)}</small></span><span className="catalog-arrow" aria-hidden="true">↗</span></div><div className="catalog-mobile-copy"><p>{copy.browse}</p><strong>{copy.productsLabel}</strong><div className="catalog-mobile-products">{items.map(product => <Link key={product.slug} href={`${basePath ?? `${prefix}/products`}/${encodeURIComponent(product.slug)}`}>{product.name ?? pending}</Link>)}</div><Link className="catalog-mobile-all" href={href}>{copy.viewProducts} ↗</Link></div></article>;
    })}</div>
  </section>;
}
