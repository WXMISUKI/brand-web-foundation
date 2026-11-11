import Link from "next/link";
import { getSiteHighlights } from "../content/site-catalog";
import { ProductVisual } from "./product-visual";
import { ProductRail } from "./product-rail";
import { homeProductMessages } from "../i18n/home-product-messages";
import { catalogMessages, type CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";

export async function HomeProducts({ locale }: { locale: CatalogPageLocale }) {
  const copy = homeProductMessages[locale], catalog = catalogMessages[locale], common = aboutMessages[locale];
  const { products, source } = await getSiteHighlights(locale, 10);
  return <section className="home-products" aria-labelledby="home-products-title">
    <div className="home-products-heading"><span className="eyebrow">{copy.ourProducts}{source === "sample" && ` · ${common.sample}`}</span><h2 id="home-products-title">{copy.ourProducts}</h2><p>{copy.contentNote}</p></div>
    {products.length === 0 && <p className="interest-empty">{copy.emptyProducts}</p>}
    <ProductRail locale={locale} sample={source === "sample"}>{products.map((product,index) => {
      const name = product.name ?? common.pending;
      return <Link className="home-product-card" key={product.slug} href={`/${locale}/products/${encodeURIComponent(product.slug)}`}><h3>{name}</h3><p>{product.intro ?? catalog.missing}</p><ProductVisual number={String(index+1).padStart(2,"0")} media={product.media ? { src: product.media.src, alt: { [locale]: product.media.alt ?? "" } } : undefined} locale={locale} productName={name} /><span className="home-product-link">{catalog.details} ↗</span></Link>;
    })}</ProductRail>
    <div className="home-products-more"><Link className="text-link" href={`/${locale}/products`}>{copy.allProducts}</Link></div>
  </section>;
}
