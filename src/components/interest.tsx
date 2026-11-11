"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { solutionLabel, solutions, spanishSolutionLabels } from "../data/solutions";
import { englishSolutionImages, solutionImages } from "../data/section-media";
import { homeProductMessages } from "../i18n/home-product-messages";
import { frenchSolutionLabels } from "../i18n/navigation-detail";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export function Interest({ locale = "zh", products, sample }: { locale?: CatalogPageLocale; products: { slug: string; name: string | null; image: string | null }[]; sample: boolean }) {
  const [active, setActive] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true, overflow: false });
  const copy = homeProductMessages[locale];
  const prefix = `/${locale}`;
  const solutionEntries = (group: "method" | "crop") => solutions.filter(s => s.group === group).map(s => ({ name: locale === "es" ? spanishSolutionLabels[s.slug] : locale === "fr" ? frenchSolutionLabels[s.slug] : solutionLabel(locale, s), href: `${prefix}/solutions/${s.slug}`, image: englishSolutionImages[s.slug] ?? solutionImages[s.slug] }));
  const categories = [
    { name: copy.crops, entries: solutionEntries("crop") },
    { name: copy.methods, entries: solutionEntries("method") },
    { name: copy.products, entries: products.map(p => ({ name: p.name ?? aboutMessages[locale].pending, href: `${prefix}/products/${encodeURIComponent(p.slug)}`, image: p.image ?? undefined })) },
  ];
  useEffect(() => {
    const element = grid.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft <= 1, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1, overflow: element.scrollWidth > element.clientWidth + 1 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [active]);
  const move = (direction: number) => {
    const element = grid.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.75, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section className="interest" id="applications"><div className="interest-title"><h2>{copy.interest}</h2></div><div className="switches" aria-label={copy.select}>{categories.map((item, i) => <button key={item.name} aria-pressed={active === i} onClick={() => { setActive(i); if (grid.current) grid.current.scrollLeft = 0; }}>{item.name}</button>)}</div><p className="interest-scroll-hint" hidden={!edges.overflow}>{copy.swipe}</p><div className="interest-rail"><div className="interest-grid" ref={grid}>{categories[active].entries.length === 0 && <p className="interest-empty" role="status">{copy.emptyProducts}</p>}{categories[active].entries.map(item => { const content = <><span className={active === 2 ? "interest-card-image interest-card-image--product" : "interest-card-image"} aria-hidden="true" style={item.image ? ({ "--card-image": `url("${item.image}")` } as CSSProperties) : undefined}>{!item.image && <span>✳</span>}</span><strong>{item.name}</strong>{(active !== 2 || sample) && <span className="interest-card-note">{item.href ? (active === 2 ? copy.sampleProduct : copy.sampleGuide) : `${copy.sampleGuide} · ${aboutMessages[locale].pending}`}</span>}</>; return item.href ? <Link href={item.href} className="interest-card" key={item.href} onFocus={(event) => { if (window.matchMedia("(max-width: 760px)").matches) event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" }); }}>{content}</Link> : <div className="interest-card" key={item.name}>{content}</div>; })}</div><div className="interest-rail-controls" hidden={!edges.overflow}><button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label={copy.previousItems}>‹</button><button type="button" onClick={() => move(1)} disabled={edges.end} aria-label={copy.nextItems}>›</button></div></div></section>;
}
