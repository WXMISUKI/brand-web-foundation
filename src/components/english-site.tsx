import Link from "next/link";
import { SiteFooter } from "./site-footer";
import { NavigationMenu } from "./navigation-menu";

export function EnglishHeader({ chinesePath }: { chinesePath: string }) {
  return <><div className="preview">Prototype preview · English text and product data are examples awaiting review</div><header className="english-header"><Link href="/en">AGRI · PLANT NUTRITION</Link><nav aria-label="Main navigation"><NavigationMenu locale="en" kind="products"/><NavigationMenu locale="en" kind="solutions"/><Link href="/en/about">About</Link><Link href="/en/contact">Contact</Link><Link href={chinesePath} hrefLang="zh-CN">中文</Link><span aria-current="page">English</span></nav></header></>;
}

export function EnglishFooter() {
  return <SiteFooter locale="en" />;
}
