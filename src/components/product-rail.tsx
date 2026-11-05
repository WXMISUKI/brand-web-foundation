"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function ProductRail({ children, locale }: { children: ReactNode; locale: "zh" | "en" }) {
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

  return <div className="product-rail-wrap"><div ref={rail} className="home-products-grid" aria-label={locale === "en" ? "Sample products" : "示例产品"}>{children}</div><div className="product-rail-controls" hidden={!edges.overflow}><button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label={locale === "en" ? "Previous products" : "查看前面的产品"}>‹</button><button type="button" onClick={() => move(1)} disabled={edges.end} aria-label={locale === "en" ? "Next products" : "查看更多产品"}>›</button></div></div>;
}
