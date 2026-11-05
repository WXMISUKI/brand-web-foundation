import Link from "next/link";
import { englishProducts } from "../data/english-samples";
import { ProductVisual } from "./product-visual";
import { ProductRail } from "./product-rail";

export function HomeProducts({ locale }: { locale: "zh" | "en" }) {
  const en = locale === "en";
  return <section className="home-products" aria-labelledby="home-products-title">
    <div className="home-products-heading"><span className="eyebrow">{en ? "OUR PRODUCTS · SAMPLE" : "OUR PRODUCTS · 示例"}</span><h2 id="home-products-title">{en ? "Our products" : "产品推荐"}</h2><p>{en ? "Product names and information await owner review." : "产品名称与资料均为示例，等待业主审核。"}</p></div>
    <ProductRail locale={locale}>{englishProducts.map((product) => {
      const name = en ? product.translation?.name ?? "Translation pending" : product.name;
      const intro = en ? product.translation?.intro ?? "This product translation has not been supplied." : product.intro;
      return <Link className="home-product-card" key={product.slug} href={`${en ? "/en" : ""}/products/${product.slug}`}><h3>{name}</h3><p>{intro}</p><ProductVisual number={product.image} media={product.media} locale={locale} productName={name} /><span className="home-product-link">{en ? "View details" : "了解详情"} ↗</span></Link>;
    })}</ProductRail>
    <div className="home-products-more"><Link className="text-link" href={en ? "/en/products" : "/products"}>{en ? "View all products ↗" : "查看全部产品 ↗"}</Link></div>
  </section>;
}
