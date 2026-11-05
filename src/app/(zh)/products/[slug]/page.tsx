import { ProductInformation } from "../../../../components/product-information";
import { ProductVisual } from "../../../../components/product-visual";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "../../../../components/site";
import { products } from "../../../../data/products";
export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = products.filter((item) => item.slug !== slug);
  return <><Header englishPath={`/en/products/${product.slug}`}/><main><div className="detail-banner"><div><span>PLANT NUTRITION · 原型视觉</span><p>以营养，助力每一次生长</p></div><small>示例图片 · 非业主素材</small></div><div className="inner">
    <div className="language-link"><span aria-current="page">中文</span><Link href={`/en/products/${product.slug}`} hrefLang="en">English · 示例</Link></div><nav className="crumb" aria-label="面包屑导航"><Link href="/">首页</Link> / <Link href="/products">产品中心</Link> / <span aria-current="page">{product.name}</span></nav>
    <div className="product-detail-layout"><article>
      <div className="detail-intro"><span className="eyebrow">PRODUCT DETAILS · 示例</span><h1>{product.name}</h1><p className="lead">{product.intro}</p><p>产品成分、规格、适用作物和使用说明等待业主提供并审核。</p></div>
      <div className="detail-product-visual"><ProductVisual number={product.image} media={product.media} locale="zh" productName={product.name} /></div>
      <ProductInformation locale="zh" category={product.category} details={product.details?.zh} specifications={product.specifications} />
      <section className="detail-section" aria-labelledby="related-products"><span className="eyebrow">EXPLORE MORE</span><h2 id="related-products">探索其他示例产品</h2><div className="related-list">{related.map((item) => <Link href={`/products/${item.slug}`} key={item.slug}><span><small>{item.category} · 示例</small><strong>{item.name}</strong></span><span aria-hidden="true">↗</span></Link>)}</div></section>
    </article><aside className="detail-contact"><span className="eyebrow">CONTACT US</span><h2>了解产品详情</h2><p>需要了解产品规格或应用？请前往联系页面。联系方式及询盘服务待业主确认。</p><Link className="button green" href="/contact">联系咨询 <span>↗</span></Link></aside></div>
  </div></main><Footer /></>;
}
