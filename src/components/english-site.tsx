import Link from "next/link";
import { SiteFooter } from "./site-footer";
import { NavigationMenu } from "./navigation-menu";

export function EnglishHeader({ chinesePath }: { chinesePath: string }) {
  return <><div className="preview">Prototype preview · English text and product data are examples awaiting review</div><header className="header"><nav className="nav left" aria-label="Main navigation"><NavigationMenu locale="en" kind="products"/><NavigationMenu locale="en" kind="solutions"/><Link href="/en/about">About</Link></nav><Link className="brand" href="/en" aria-label="Return to home"><span className="brand-mark" aria-hidden="true">✳</span><strong>AGRI</strong><small>PLANT NUTRITION</small></Link><nav className="nav right" aria-label="More navigation"><Link href="/en/contact">Contact</Link><Link href={chinesePath} hrefLang="zh-CN">中文</Link><span aria-current="page">English</span><Link className="nav-cta" href="/en/contact">Get in touch ↗</Link></nav><details className="mobile-menu"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation"><Link href="/en/products">Products</Link><Link href="/en/#applications">Solutions</Link><Link href="/en/about">About</Link><Link href="/en/contact">Contact</Link><Link href={chinesePath} hrefLang="zh-CN">中文</Link></nav></details></header></>;
}

export function EnglishFooter() {
  return <SiteFooter locale="en" />;
}
