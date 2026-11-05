"use client";

import Link from "next/link";
import { useRef } from "react";
import { productCategories } from "../data/products";
import { englishCategories } from "../data/english-samples";
import { solutions } from "../data/solutions";

export function NavigationMenu({ locale, kind }: { locale: "zh" | "en"; kind: "products" | "solutions" }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const en = locale === "en";
  const prefix = en ? "/en" : "";
  const close = () => { if (ref.current) ref.current.open = false; };
  const label = kind === "products" ? (en ? "Products" : "产品中心") : (en ? "Solutions" : "种植方案");
  return <details className="navigation-menu" ref={ref} name="primary-navigation" onKeyDown={(event) => { if (event.key === "Escape") { close(); ref.current?.querySelector("summary")?.focus(); } }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}>
    <summary>{label} <span aria-hidden="true">⌄</span></summary><div className="navigation-panel">
      {kind === "products" ? <><strong>{en ? "Product categories" : "产品分类"}</strong>{productCategories.map(category=><Link key={category.id} onClick={close} href={`${prefix}/products?category=${category.id}`}>{en ? englishCategories[category.id] : category.name}</Link>)}<Link className="navigation-all" onClick={close} href={`${prefix}/products`}>{en ? "All products →" : "全部产品 →"}</Link></> : <><strong>{en ? "Growing methods" : "种植方式"}</strong>{solutions.filter(item=>item.group==="method").map(item=><Link key={item.slug} onClick={close} href={`${prefix}/solutions/${item.slug}`}>{en ? item.en : item.zh} <small>{en ? "· Sample" : "· 示例"}</small></Link>)}<strong>{en ? "Crops" : "作物场景"}</strong>{solutions.filter(item=>item.group==="crop").map(item=><Link key={item.slug} onClick={close} href={`${prefix}/solutions/${item.slug}`}>{en ? item.en : item.zh} <small>{en ? "· Sample" : "· 示例"}</small></Link>)}</>}
    </div>
  </details>;
}
