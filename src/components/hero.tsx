"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const chineseSlides = [
  { eyebrow: "NURTURE EVERY POSSIBILITY", title: <>用专业营养，<br />陪伴每一次生长。</>, description: "从土壤到作物，探索更适合种植需求的植物营养方案。", href: "/products", action: "探索产品" },
  { eyebrow: "GROW WITH CARE", title: <>关注作物需求，<br />探索营养方案。</>, description: "了解面向不同种植场景的产品分类与应用。", href: "/#applications", action: "查看方案" },
  { eyebrow: "ROOTED IN GROWTH", title: <>理解土地，<br />也理解种植者。</>, description: "企业资料与服务内容将在业主确认后更新。", href: "/about", action: "了解我们" },
];
const englishSlides = [
  { eyebrow: "NURTURE EVERY POSSIBILITY", title: <>Nutrition for<br />every stage of growth.</>, description: "Explore sample plant nutrition products and growing applications.", href: "/en/products", action: "Explore products" },
  { eyebrow: "GROW WITH CARE", title: <>Understanding crops,<br />exploring nutrition.</>, description: "Explore example product categories for growing needs.", href: "/en#applications", action: "Explore solutions" },
  { eyebrow: "ROOTED IN GROWTH", title: <>Growing together<br />with growers.</>, description: "Company information and services await owner confirmation.", href: "/en/about", action: "About us" },
];

export function Hero({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const playingBeforePointer = useRef(false);
  const slides = locale === "en" ? englishSlides : chineseSlides;
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!motion.matches);
    const onMotionChange = (event: MediaQueryListEvent) => { if (event.matches) setPlaying(false); };
    const onVisibilityChange = () => setVisible(document.visibilityState === "visible");
    onVisibilityChange();
    motion.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { motion.removeEventListener("change", onMotionChange); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, []);
  useEffect(() => {
    if (!playing || hovered || !visible) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, visible, slides.length]);
  const slide = slides[active];
  const change = (step: number) => setActive((index) => (index + step + slides.length) % slides.length);
  return <section className="hero" aria-label={locale === "en" ? "Featured topics" : "首页主题轮播"} aria-roledescription={locale === "en" ? "carousel" : "轮播"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPlaying(false)}>
    <div className="hero-art" aria-hidden="true" />
    <div className="hero-content" aria-live={playing ? "off" : "polite"} aria-atomic="true">
      <span className="eyebrow light">{slide.eyebrow}</span><h1>{slide.title}</h1><p>{slide.description}</p>
      <Link className="button white" href={slide.href}>{slide.action} <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="hero-controls" aria-label={locale === "en" ? "Carousel controls" : "轮播控制"}><button type="button" className="hero-play" onPointerDown={() => { playingBeforePointer.current = playing; }} onClick={(event) => setPlaying(event.detail > 0 ? !playingBeforePointer.current : !playing)} aria-label={playing ? (locale === "en" ? "Pause rotation" : "暂停轮播") : (locale === "en" ? "Start rotation" : "播放轮播")}>{playing ? "Ⅱ" : "▶"}</button><button type="button" onClick={() => change(-1)} aria-label={locale === "en" ? "Previous slide" : "上一张"}>‹</button><span aria-live={playing ? "off" : "polite"}>{active + 1} / {slides.length}</span><button type="button" onClick={() => change(1)} aria-label={locale === "en" ? "Next slide" : "下一张"}>›</button></div>
    <span className="hero-note">{locale === "en" ? "Sample copy and image · not owner material" : "示例文案与图片 · 非业主素材"}</span>
  </section>;
}
