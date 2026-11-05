"use client";
import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { productCategories } from "../data/products";
import { englishCategories } from "../data/english-samples";
import { solutions } from "../data/solutions";
import { solutionImages } from "../data/section-media";
export function Interest({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [active, setActive] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const en = locale === "en";
  const prefix = en ? "/en" : "";
  const solutionEntries = (group: "method" | "crop") => solutions.filter(s => s.group === group).map(s => ({ name: en ? s.en : s.zh, href: `${prefix}/solutions/${s.slug}`, image: solutionImages[s.slug] }));
  const categories = [
    { name: en ? "Products" : "产品系列", entries: productCategories.map(c => ({ name: en ? englishCategories[c.id] : c.name, href: `${prefix}/products?category=${c.id}`, image: undefined as string | undefined })) },
    { name: en ? "Growing methods" : "种植方式", entries: solutionEntries("method") },
    { name: en ? "Crops" : "作物场景", entries: solutionEntries("crop") },
  ];
  return <section className="interest" id="applications"><div className="interest-title"><span>FIND YOUR SOLUTION</span><h2>{en ? "Explore nutrition solutions" : "探索适合您的营养方案"}</h2></div><div className="switches" aria-label={en ? "Choose a category" : "选择方案类别"}>{categories.map((item, i) => <button key={item.name} aria-pressed={active === i} onClick={() => { setActive(i); if (grid.current) grid.current.scrollLeft = 0; }}>{item.name}</button>)}</div><p className="interest-scroll-hint">{en ? "Swipe to explore more →" : "左右滑动查看更多 →"}</p><div className="interest-grid" ref={grid}>{categories[active].entries.map((item, i) => <Link href={item.href} className={`interest-card${active ? " interest-card-photo" : ""}`} key={item.name} style={item.image ? ({ "--card-image": `url("${item.image}")` } as CSSProperties) : undefined} onFocus={(event) => { if (window.matchMedia("(max-width: 760px)").matches) event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" }); }}><span className="card-no">{active ? (en ? "SAMPLE IMAGE" : "示例图片") : `0${i+1}`}</span>{active === 0 && <span className="leaf" aria-hidden="true">✳</span>}<strong>{item.name}</strong><span>{active === 0 ? (en ? "View products ↗" : "查看产品 ↗") : (en ? "Sample guide ↗" : "查看示例方案 ↗")}</span></Link>)}</div></section>;
}
