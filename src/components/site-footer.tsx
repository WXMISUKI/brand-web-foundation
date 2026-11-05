import Link from "next/link";
import { productCategories } from "../data/products";
import { englishCategories } from "../data/english-samples";

export function SiteFooter({ locale }: { locale: "zh" | "en" }) {
  const en = locale === "en";
  const base = en ? "/en" : "";
  return <footer className="site-footer"><div className="site-footer-main"><div className="site-footer-brand"><Link href={en ? "/en" : "/"} aria-label={en ? "Return to home" : "返回首页"}><span aria-hidden="true">✳</span><strong>AGRI</strong><small>PLANT NUTRITION</small></Link><p>{en ? "Prototype preview. Company profile, brand identity and contact details await owner confirmation." : "网站原型展示。企业简介、品牌标识和联系方式将在业主确认后更新。"}</p></div><nav className="site-footer-nav" aria-label={en ? "Footer navigation" : "页脚导航"}><div><h2>{en ? "Products" : "产品中心"}</h2><Link href={`${base}/products`}>{en ? "Product catalog" : "全部产品"}</Link>{productCategories.map(category=><Link href={`${base}/products?category=${category.id}`} key={category.id}>{en ? englishCategories[category.id] : category.name}</Link>)}</div><div><h2>{en ? "Growing solutions" : "种植方案"}</h2><Link href={`${base}/solutions/greenhouse`}>{en ? "Greenhouse" : "设施农业"}</Link><Link href={`${base}/solutions/vegetables`}>{en ? "Vegetables" : "蔬菜"}</Link><Link href={`${base}/solutions/fruit-trees`}>{en ? "Fruit trees" : "果树"}</Link></div><div><h2>{en ? "About" : "关于我们"}</h2><Link href={`${base}/about`}>{en ? "Company profile" : "企业介绍"}</Link><Link href={`${base}/contact`}>{en ? "Contact us" : "联系我们"}</Link></div></nav></div><div className="site-footer-bottom"><span>{en ? "Prototype only · Company and legal information await confirmation" : "原型演示 · 企业及法律信息待确认"}</span><Link href={`${base}/contact`}>{en ? "Contact details pending" : "联系方式待确认"}</Link></div></footer>;
}
