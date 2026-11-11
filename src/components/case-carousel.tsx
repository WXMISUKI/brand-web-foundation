"use client";

import Link from "next/link";
import { useState } from "react";
import type { CaseItem } from "../content/cases";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { caseCarouselMessages } from "../i18n/case-carousel-messages";

export function CaseCarousel({ locale, slides }: { locale: CatalogPageLocale; slides: CaseItem[] }) {
  const [active, setActive] = useState(0);
  const copy = caseCarouselMessages[locale];
  const slide = slides.length > 0 ? slides[active % slides.length] : undefined;
  const change = (offset: number) => setActive(index => (index + offset + slides.length) % slides.length);

  return <section className="home-cases" aria-labelledby="cases-title" aria-roledescription={copy.role}>
    <div className="home-section-heading"><span className="eyebrow">{copy.eyebrow}</span><h2 id="cases-title">{copy.title}</h2></div>
    {slide ? <>
      <div className="home-case-card" aria-live="polite" aria-atomic="true">
        <div className="home-case-image case-image-empty">
          {slide.image && <img src={slide.image.src} alt={slide.image.alt ?? ""} />}
          {slide.sample && <span>{copy.sampleImage}</span>}
        </div>
        <div className="home-case-copy">
          {slide.sample && <span className="eyebrow">{copy.sampleTopic}</span>}
          <h3>{slide.title ?? copy.pendingTitle}</h3>
          <p>{slide.summary ?? copy.pendingSummary}</p>
          <Link className="text-link" href={`/${locale}/cases/${encodeURIComponent(slide.slug)}`}>{copy.view}</Link>
        </div>
      </div>
      {slides.length > 1 && <div className="case-carousel-controls" aria-label={copy.controls}>
        <button type="button" onClick={() => change(-1)} aria-label={copy.previous}>‹</button>
        <div className="case-carousel-dots">
          {slides.map((item, index) => <button key={item.slug} type="button" className={index === active ? "active" : ""} aria-label={`${copy.show} ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)}><span aria-hidden="true" /></button>)}
        </div>
        <button type="button" onClick={() => change(1)} aria-label={copy.next}>›</button>
      </div>}
    </> : <p>{copy.empty}</p>}
    <Link className="text-link cases-all-link" href={`/${locale}/cases`}>{copy.all}</Link>
  </section>;
}
