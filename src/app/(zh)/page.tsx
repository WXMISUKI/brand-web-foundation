import { ProductVisual } from "../../components/product-visual";
import Link from "next/link";
import { Header, Footer } from "../../components/site";
import { Interest } from "../../components/interest";
import { Hero } from "../../components/hero";
import { products } from "../../data/products";
export default function Home(){return <><Header/><main><Hero/><Interest/><section className="section product-section"><div className="section-heading"><div><span className="eyebrow">OUR PRODUCTS</span><h2>从需求出发，<br/>找到适合的产品。</h2></div><Link className="text-link" href="/products">查看全部产品 ↗</Link></div><div className="product-grid">{products.map(p=><Link className="product-card" key={p.slug} href={`/products/${p.slug}`}><ProductVisual number={p.image} media={p.media} locale="zh" productName={p.name} /><div className="product-copy"><small>{p.category} · 示例</small><h3>{p.name}</h3><p>{p.intro}</p><span>了解详情 ↗</span></div></Link>)}</div></section><section className="story"><div className="story-art"><span>ROOTED IN<br/>BETTER GROWTH</span></div><div className="story-copy"><span className="eyebrow">ABOUT US</span><h2>理解土地，<br/>也理解种植者。</h2><p>从产品研发到应用服务，企业介绍和真实能力将在业主资料确认后更新。</p><Link className="button green" href="/about">了解我们 <span>↗</span></Link></div></section></main><Footer/></>}
