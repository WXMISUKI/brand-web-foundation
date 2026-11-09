"use client";

import Link from "next/link";
import { useRef } from "react";
import { isPublicLocale, locales } from "../i18n/locales";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { navigationDetail } from "../i18n/navigation-detail";

export function LanguageMenu({ locale, alternatePath, mobile = false, frenchPreview = false, spanishPreview = false, previewAllLocales = false }: { locale: CatalogPageLocale; alternatePath: string; mobile?: boolean; frenchPreview?: boolean; spanishPreview?: boolean; previewAllLocales?: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const current = locales.find(item => item.code === locale)!;
  const copy = navigationDetail[locale];
  const close = () => { if (ref.current) ref.current.open = false; };
  return <details className={mobile ? "language-menu language-menu-mobile" : "language-menu"} ref={ref}
    onKeyDown={event => { if (event.key === "Escape" && ref.current?.open) { event.stopPropagation(); close(); ref.current.querySelector("summary")?.focus(); } }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}>
    <summary aria-label={copy.language}>{current.label}<span aria-hidden="true">⌄</span></summary>
    <ul aria-label={copy.languages}>
      {locales.map(item => <li key={item.code} lang={item.htmlLang} dir={item.direction}>
        {item.code === locale ? <span aria-current="page">{item.label}</span> : isPublicLocale(item.code) || (item.code === "fr" && frenchPreview) || (item.code === "es" && spanishPreview) || previewAllLocales ? <Link href={alternatePath.replace(/^\/(?:en|he|nl|fr|it|es|pt|el|zh|ro|ru|th|tr)(?=\/|\?|#|$)/, `/${item.code}`)} hrefLang={item.htmlLang} onClick={close}>{item.label}</Link> : <span className="language-pending">{item.label} <small lang={current.htmlLang}>{copy.pending}</small></span>}
      </li>)}
    </ul>
  </details>;
}
