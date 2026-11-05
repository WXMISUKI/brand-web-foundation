import Link from "next/link";
import { ProductVisual } from "../../../components/product-visual";
import { CatalogOverview } from "../../../components/catalog-overview";
import { CatalogControls, catalogHref } from "../../../components/catalog-controls";
import { Header, Footer } from "../../../components/site";
import { products } from "../../../data/products";

export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string | string[]; q?: string | string[] }> }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.q === "string" ? params.q.trim().slice(0,100) : "";
  const normalized = query.toLocaleLowerCase();
  const visible = products.filter(product => (!category || product.categoryId === category) && (!normalized || `${product.name} ${product.intro}`.toLocaleLowerCase().includes(normalized)));
  const englishPath = catalogHref("en",category,query);
  return <><Header englishPath={englishPath}/><main className="inner"><div className="language-link"><span aria-current="page">中文</span><Link href={englishPath} hrefLang="en">English · 示例</Link></div><div className="crumb"><Link href="/">首页</Link> / 产品中心</div><CatalogOverview locale="zh" /><h2 id="catalog-results" className="catalog-results-title">示例产品</h2><CatalogControls locale="zh" category={category} query={query} count={visible.length} />{visible.length ? <div className="product-grid">{visible.map(product=><Link className="product-card" href={`/products/${product.slug}`} key={product.slug}><ProductVisual number={product.image} media={product.media} locale="zh" productName={product.name}/><div className="product-copy"><small>{product.category} · 示例</small><h2>{product.name}</h2><p>{product.intro}</p><span>了解详情 ↗</span></div></Link>)}</div> : <p>没有找到匹配的示例产品。<Link href="/products#catalog-results">清除搜索与筛选</Link></p>}</main><Footer/></>;
}
