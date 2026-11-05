import Link from "next/link";
import { ProductVisual } from "../../../../components/product-visual";
import { CatalogOverview } from "../../../../components/catalog-overview";
import { CatalogControls, catalogHref } from "../../../../components/catalog-controls";
import { EnglishHeader, EnglishFooter } from "../../../../components/english-site";
import { englishProducts } from "../../../../data/english-samples";

export default async function EnglishProducts({ searchParams }: { searchParams: Promise<{ category?: string | string[]; q?: string | string[] }> }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.q === "string" ? params.q.trim().slice(0,100) : "";
  const normalized = query.toLocaleLowerCase();
  const visible = englishProducts.filter(product => (!category || product.categoryId === category) && (!normalized || `${product.translation?.name ?? ""} ${product.translation?.intro ?? ""}`.toLocaleLowerCase().includes(normalized)));
  return <div lang="en"><EnglishHeader chinesePath={catalogHref("zh",category,query)} /><main className="inner"><CatalogOverview locale="en"/><h2 id="catalog-results" className="catalog-results-title">Sample products</h2><CatalogControls locale="en" category={category} query={query} count={visible.length}/>{visible.length ? <div className="product-grid">{visible.map(product=><Link className="product-card" href={`/en/products/${product.slug}`} key={product.slug}><ProductVisual number={product.image} media={product.media} locale="en" productName={product.translation?.name ?? "Translation pending"}/><div className="product-copy"><small>{product.translation?.category ?? "Translation pending"} · Sample</small><h2>{product.translation?.name ?? "Translation pending"}</h2><p>{product.translation?.intro ?? "This product translation has not been supplied."}</p><span>View details ↗</span></div></Link>)}</div> : <p>No matching sample products found. <Link href="/en/products#catalog-results">Clear search and filters</Link></p>}</main><EnglishFooter/></div>;
}
