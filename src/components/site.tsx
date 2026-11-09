import Link from "next/link";
import { SiteFooter } from "./site-footer";
import { NavigationMenu } from "./navigation-menu";
import { MobileMenu } from "./mobile-menu";
import { LanguageMenu } from "./language-menu";
import { SearchLink } from "./search-link";
export function Header({ englishPath = "/en" }: { englishPath?: string }){return <>{process.env.SHOW_PREVIEW_BANNER === "1" && <div className="preview">{process.env.CATALOG_SOURCE === "payload" ? "原型预览 · 内容上线前需核对" : "原型预览 · 内容与数据均为示例，等待业主确认"}</div>}<header className="header"><nav className="nav left" aria-label="主要导航"><NavigationMenu locale="zh" kind="crops"/><NavigationMenu locale="zh" kind="products"/><NavigationMenu locale="zh" kind="solutions"/><NavigationMenu locale="zh" kind="tools"/></nav><Link className="brand" href="/zh" aria-label="返回首页"><span className="brand-mark">✳</span><strong>KOMU</strong><small>PLANT NUTRITION</small></Link><nav className="nav right" aria-label="更多导航"><NavigationMenu locale="zh" kind="corporate"/><NavigationMenu locale="zh" kind="insights"/><SearchLink locale="zh"/><LanguageMenu locale="zh" alternatePath={englishPath}/><Link className="nav-cta" href="/zh/contact">联系我们 ↗</Link></nav><MobileMenu locale="zh" alternatePath={englishPath}/></header></>}
export function Footer(){return <SiteFooter locale="zh"/>}
