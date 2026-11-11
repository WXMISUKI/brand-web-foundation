"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "../data/hero-slides";
import { heroHref } from "../data/hero-link";
import { heroMediaForLocale } from "../data/hero-media-locale.mjs";
import { heroMessages } from "../i18n/hero-messages";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

const cleanHeroImage = (image: string) => {
  if (/hero-01\.jpg(?:$|[?#])/.test(image)) return "/images/official-site/company-research.jpg";
  if (/hero-02\.jpg(?:$|[?#])/.test(image)) return "/images/official-site/company-laboratory.jpg";
  if (/hero-03\.jpg(?:$|[?#])/.test(image)) return "/images/official-site/technology.jpg";
  return image;
};

export function Hero({ locale, slides }: { locale: CatalogPageLocale; slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failedVideo, setFailedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingBeforePointer = useRef(false);
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
    if (!playing || hovered || !visible || slides.length < 2) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % slides.length), 7000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, visible, slides.length]);
  const slide = slides[active % slides.length];
  const image = heroMediaForLocale(locale, cleanHeroImage(slide.image));
  const href = heroHref(locale, slide.actionPath);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && !hovered && visible) void video.play().catch(() => { if (video.error) setFailedVideo(slide.video ?? null); });
    else video.pause();
  }, [active, playing, hovered, visible, slide.video, failedVideo]);
  const change = (step: number) => setActive((index) => (index + step + slides.length) % slides.length);
  const copy = heroMessages[locale];
  return <section className="hero" aria-label={copy.topics} aria-roledescription={copy.carousel} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPlaying(false)}>
    <div className="hero-art" aria-hidden="true" style={{ backgroundImage: `linear-gradient(90deg, rgba(11, 68, 31, .82), rgba(102, 130, 28, .34)), url("${image}")` }}>{slide.video && slide.video !== failedVideo && <video key={slide.video} ref={videoRef} className="hero-video" src={slide.video} poster={image} muted loop playsInline preload="metadata" onError={() => setFailedVideo(slide.video ?? null)} />}</div>
    <div className="hero-content" aria-live={playing ? "off" : "polite"} aria-atomic="true">
      {slide.eyebrow && <span className="eyebrow light">{slide.eyebrow}</span>}<h1>{slide.title ?? aboutMessages[locale].pending}</h1>{slide.description && <p>{slide.description}</p>}
      {href && slide.actionLabel && <Link className="button white" href={href}>{slide.actionLabel} <span aria-hidden="true">↗</span></Link>}
    </div>
    {slides.length > 1 && <div className="hero-controls" aria-label={copy.controls}><button type="button" className="hero-play" onPointerDown={() => { playingBeforePointer.current = playing; }} onClick={(event) => setPlaying(event.detail > 0 ? !playingBeforePointer.current : !playing)} aria-label={playing ? copy.pause : copy.play}>{playing ? "Ⅱ" : "▶"}</button><button type="button" className="hero-previous" onClick={() => change(-1)} aria-label={copy.previous}>‹</button><span className="hero-slide-count" aria-live={playing ? "off" : "polite"}>{active % slides.length + 1} / {slides.length}</span><button type="button" className="hero-next" onClick={() => change(1)} aria-label={copy.next}>›</button></div>}
    {(slide.sampleText || slide.sampleImage) && <span className="hero-note">{slide.sampleText ? copy.sampleText : copy.sampleImage}</span>}
  </section>;
}
