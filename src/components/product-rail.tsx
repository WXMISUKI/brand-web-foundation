"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { catalogMessages } from "../i18n/catalog-messages";
import { homeProductMessages } from "../i18n/home-product-messages";

export function ProductRail({ children, locale, sample }: { children: ReactNode; locale: CatalogPageLocale; sample: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true, overflow: false });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft <= 1, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 1, overflow: element.scrollWidth > element.clientWidth + 1 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [children]);

  const move = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollBy({ left: direction * element.clientWidth * 0.9, behavior: reduceMotion ? "instant" : "smooth" });
  };

  const copy = homeProductMessages[locale], catalog = catalogMessages[locale];
  return <div className="product-rail-wrap"><div ref={rail} role="group" className="home-products-grid" aria-label={sample ? catalog.sampleProducts : catalog.products}>{children}</div><div className="product-rail-controls" hidden={!edges.overflow}><button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label={copy.previousProducts}>‹</button><button type="button" onClick={() => move(1)} disabled={edges.end} aria-label={copy.nextProducts}>›</button></div></div>;
}
