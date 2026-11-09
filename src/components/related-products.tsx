import Link from "next/link";
import type { Catalog } from "../content/catalog";
import { ProductVisual } from "./product-visual";
import { productDetailMessages } from "../i18n/product-detail-messages";
import { catalogMessages, type CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";

export function RelatedProducts({ locale, currentSlug, catalog, basePath }: { locale: CatalogPageLocale; currentSlug: string; catalog: Catalog; basePath?: string }) {
  const copy = productDetailMessages[locale], common = aboutMessages[locale], labels = catalogMessages[locale];
  const otherProducts = catalog.products.filter(item => item.slug !== currentSlug);
  if (!otherProducts.length) return null;
  return <section className="detail-section" aria-labelledby="related-products"><span className="eyebrow">{copy.more}</span><h2 id="related-products">{copy.more}</h2><p>{copy.moreNote}</p><div className="related-products-grid">{otherProducts.map((item,index) => { const name = item.name ?? common.pending; return <Link className="related-product-card" key={item.slug} href={`${basePath ?? `/${locale}/products`}/${encodeURIComponent(item.slug)}`}><ProductVisual number={String(index+1).padStart(2,"0")} media={item.media ? { src: item.media.src, alt: { [locale]: item.media.alt ?? "" } } : undefined} locale={locale} productName={name}/><div className="related-product-copy"><small>{item.category?.name ?? common.pending}</small><h3>{name}</h3><p>{item.intro ?? labels.missing}</p><span>{labels.details} ↗</span></div></Link>; })}</div></section>;
}
