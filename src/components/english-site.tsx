import Link from "next/link";
import { SiteFooter } from "./site-footer";
import { NavigationMenu } from "./navigation-menu";
import { MobileMenu } from "./mobile-menu";
import { LanguageMenu } from "./language-menu";
import { SearchLink } from "./search-link";

export function EnglishHeader({ chinesePath }: { chinesePath: string }) {
  const preview = process.env.CATALOG_SOURCE === "payload" ? "Prototype preview · Content requires review before publication" : "Prototype preview · English text and product data are examples awaiting review";
  return <>{process.env.SHOW_PREVIEW_BANNER === "1" && <div className="preview">{preview}</div>}<header className="header"><nav className="nav left" aria-label="Main navigation"><NavigationMenu locale="en" kind="crops"/><NavigationMenu locale="en" kind="products"/><NavigationMenu locale="en" kind="solutions"/><NavigationMenu locale="en" kind="tools"/></nav><Link className="brand" href="/en" aria-label="Return to home"><span className="brand-mark" aria-hidden="true">✳</span><strong>KOMU</strong><small>PLANT NUTRITION</small></Link><nav className="nav right" aria-label="More navigation"><NavigationMenu locale="en" kind="corporate"/><NavigationMenu locale="en" kind="insights"/><SearchLink locale="en"/><LanguageMenu locale="en" alternatePath={chinesePath}/><Link className="nav-cta" href="/en/contact">Contact ↗</Link></nav><MobileMenu locale="en" alternatePath={chinesePath}/></header></>;
}

export function EnglishFooter() {
  return <SiteFooter locale="en" />;
}
