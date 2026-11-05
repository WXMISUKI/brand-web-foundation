import { ProductVisual } from "../../../../components/product-visual";
import { CatalogOverview } from "../../../../components/catalog-overview";
import { EnglishHeader, EnglishFooter } from "../../../../components/english-site";
import Link from "next/link";
import { productCategories } from "../../../../data/products";
import { englishCategories, englishProducts } from "../../../../data/english-samples";

export default async function EnglishProducts({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const value = (await searchParams).category;
  const selected = typeof value === "string" ? value : "";
  const query = selected ? `?category=${encodeURIComponent(selected)}` : "";
  const visible = selected ? englishProducts.filter((product) => product.categoryId === selected) : englishProducts;
  return <div lang="en"><EnglishHeader chinesePath={`/products${query}`} /><main className="inner">
    <CatalogOverview locale="en" /><h2 id="catalog-results" className="catalog-results-title">Sample products</h2>
    <nav className="catalog-filters" aria-label="Product categories"><Link href="/en/products" aria-current={!selected ? "page" : undefined}>All</Link>{productCategories.map((category) => <Link key={category.id} href={`/en/products?category=${category.id}`} aria-current={selected === category.id ? "page" : undefined}>{englishCategories[category.id]}</Link>)}</nav>
    {visible.length ? <div className="product-grid">{visible.map((product) => <Link className="product-card" href={`/en/products/${product.slug}`} key={product.slug}><ProductVisual number={product.image} media={product.media} locale="en" productName={product.translation?.name ?? "Translation pending"} /><div className="product-copy"><small>{product.translation?.category ?? "Translation pending"} · Sample</small><h2>{product.translation?.name ?? "Translation pending"}</h2><p>{product.translation?.intro ?? "This product translation has not been supplied."}</p><span>View details ↗</span></div></Link>)}</div> : <p>No sample products found for this category. <Link href="/en/products">View all products</Link></p>}
  </main><EnglishFooter /></div>;
}
