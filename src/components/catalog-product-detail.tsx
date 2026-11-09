import Link from "next/link";
import type { Catalog, CatalogProduct } from "../content/catalog";
import { ProductInformation } from "./product-information";
import { ProductVisual } from "./product-visual";
import { RelatedProducts } from "./related-products";
import { ProductInsights } from "./product-insights";
import { ProductEnquiryPreview } from "./product-enquiry-preview";
import { aboutMessages } from "../i18n/about-messages";
import { catalogMessages, type CatalogPageLocale } from "../i18n/catalog-messages";
import { productDetailMessages } from "../i18n/product-detail-messages";

export function CatalogProductDetail({ locale, product, catalog, basePath }: { locale: CatalogPageLocale; product: CatalogProduct; catalog: Catalog; basePath?: string }) {
  const common = aboutMessages[locale], labels = catalogMessages[locale], copy = productDetailMessages[locale];
  const prefix = `/${locale}`, name = product.name ?? (locale === "en" ? "Translation pending" : locale === "zh" ? "待翻译" : common.pending);
  const details = { materials: product.details.materials ?? undefined, packaging: product.details.packaging ?? undefined, uses: product.details.uses ?? undefined, instructions: product.details.instructions ?? undefined };
  const specifications = product.specifications.map(spec => ({ id: spec.id, label: { [locale]: spec.label ?? undefined }, unit: spec.unit ?? undefined, typical: spec.typical ?? undefined, minimum: spec.minimum ?? undefined, maximum: spec.maximum ?? undefined }));
  return <main><div className="detail-banner"><small>{copy.banner}</small></div><div className="inner"><nav className="crumb" aria-label={common.breadcrumb}><Link href={basePath ?? `${prefix}/products`}>{labels.title}</Link> / {name}</nav><div className="product-detail-layout"><article><div className="detail-intro"><h1>{name}</h1><p className="lead">{product.intro ?? labels.missing}</p><p>{copy.review}</p>{product.provenance.sourcePages.length > 0 && <p className="product-provenance"><strong>{copy.sourcePages}:</strong> {product.provenance.sourcePages.join(", ")}</p>}</div><ProductInformation sample={catalog.source === "sample"} locale={locale} category={product.category?.name ?? common.pending} details={details} specifications={specifications}/><div className="detail-product-visual"><ProductVisual number="" media={product.media ? { src: product.media.src, alt: { [locale]: product.media.alt ?? "" } } : undefined} locale={locale} productName={name}/></div>{product.provenance.sourcePreviewPath && <figure className="source-preview"><img src={product.provenance.sourceDetailPreviewPath ?? product.provenance.sourcePreviewPath} alt={`${copy.sourcePreview} · ${name}`} /><figcaption>{copy.sourcePreview} · {copy.sourcePages}: {product.provenance.sourcePages.join(", ")}</figcaption></figure>}<RelatedProducts locale={locale} currentSlug={product.slug} catalog={catalog} basePath={basePath}/><ProductInsights locale={locale}/></article><ProductEnquiryPreview locale={locale}/></div></div><div className="product-quote-bar"><div><strong>{copy.quote}</strong><span>{copy.quoteNote}</span></div><Link href={`/${locale}/contact`}>{common.contact} ↗</Link></div></main>;
}
