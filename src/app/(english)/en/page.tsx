import { ProductVisual } from "../../../components/product-visual";
import Link from "next/link";
import { Hero } from "../../../components/hero";
import { Interest } from "../../../components/interest";
import { EnglishHeader, EnglishFooter } from "../../../components/english-site";
import { englishProducts } from "../../../data/english-samples";

export default function EnglishHome() {
  return <div lang="en"><EnglishHeader chinesePath="/" /><main><Hero locale="en" /><Interest locale="en" /><section className="section"><div className="section-heading"><div><span className="eyebrow">OUR PRODUCTS · SAMPLE</span><h2>Explore nutrition<br />for growing needs.</h2></div><Link className="text-link" href="/en/products">All products ↗</Link></div><div className="product-grid">{englishProducts.slice(0,3).map((product)=><Link className="product-card" key={product.slug} href={`/en/products/${product.slug}`}><ProductVisual number={product.image} media={product.media} locale="en" productName={product.translation?.name ?? "Translation pending"} /><div className="product-copy"><small>{product.translation?.category ?? "Translation pending"} · Sample</small><h3>{product.translation?.name ?? "Translation pending"}</h3><p>{product.translation?.intro ?? "Translation has not been supplied."}</p><span>View details ↗</span></div></Link>)}</div></section><section className="story"><div className="story-art"><span>ROOTED IN<br />BETTER GROWTH</span></div><div className="story-copy"><span className="eyebrow">ABOUT US</span><h2>Growing together<br />with growers.</h2><p>Company information and capabilities await owner confirmation.</p><Link className="button green" href="/en/about">About us ↗</Link></div></section></main><EnglishFooter /></div>;
}
