"use client";
import Link from "next/link";
import { useRef } from "react";
import { solutionLabel, solutions } from "../data/solutions";
import { LanguageMenu } from "./language-menu";
import { navigationMessages } from "../i18n/navigation-messages";
import { frenchSolutionLabels, navigationDetail } from "../i18n/navigation-detail";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { resourceMessages } from "./product-resources";
import { PracticeMenuGroups } from "./practice-menu-groups";

export function MobileMenu({ locale, alternatePath, frenchPreview = false, spanishPreview = false, previewAllLocales = false }: { locale: CatalogPageLocale; alternatePath: string; frenchPreview?: boolean; spanishPreview?: boolean; previewAllLocales?: boolean }) {
  const ref = useRef<HTMLDetailsElement>(null), labels = navigationMessages[locale], copy = navigationDetail[locale], prefix = `/${locale}`;
  const close = () => { if (ref.current) ref.current.open = false; };
  if (locale === "es") return <details className="mobile-menu" ref={ref} onKeyDownCapture={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); ref.current?.querySelector("summary")?.focus(); } }} onKeyDown={event => { if (event.key === "Escape") { close(); ref.current?.querySelector("summary")?.focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}><summary onKeyDown={event => { if (event.key === "Escape") { close(); ref.current?.querySelector("summary")?.focus(); } }}>{labels.menu} <span aria-hidden="true">☰</span></summary><nav aria-label={labels.mobileNavigation} onClick={event => { if ((event.target as HTMLElement).closest("a")) close(); }}><Link href="/es/search">{copy.search}</Link><Link href="/es/products">{labels.products}</Link><Link href="/es/products/series">{copy.series}</Link><Link href="/es/faq">{copy.faq}</Link><Link href="/es/sds-request">{resourceMessages.es.sds}</Link><Link href="/es/quality-assurance">{resourceMessages.es.quality}</Link><Link href="/es/smart-farming">{copy.toolsPreview}</Link><details className="mobile-submenu"><summary>{copy.solutions}</summary><div><Link href="/es/solutions">{copy.methodsIndex}</Link><PracticeMenuGroups locale={locale} onNavigate={close}/></div></details><Link href="/es/about">{labels.about}</Link><Link href="/es/insights">{copy.knowledge}</Link><Link href="/es/cases">{copy.stories}</Link><Link href="/es/news">{copy.news}</Link><Link href="/es/contact">{labels.contact}</Link><LanguageMenu locale={locale} alternatePath={alternatePath} mobile frenchPreview={frenchPreview} previewAllLocales={previewAllLocales}/></nav></details>;
  const solutionName = (item: (typeof solutions)[number]) => locale === "fr" ? frenchSolutionLabels[item.slug] : solutionLabel(locale, item);
  return <details className="mobile-menu" ref={ref} onKeyDownCapture={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); ref.current?.querySelector("summary")?.focus(); } }} onKeyDown={event => { if (event.key === "Escape" && ref.current?.open) { close(); ref.current.querySelector("summary")?.focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) close(); }}>
    <summary onKeyDown={event => { if (event.key === "Escape" && ref.current?.open) { close(); ref.current.querySelector("summary")?.focus(); } }}>{labels.menu} <span aria-hidden="true">☰</span></summary>
    <nav aria-label={labels.mobileNavigation} onClick={event => { if ((event.target as HTMLElement).closest("a")) close(); }}>
      <Link href={`${prefix}/search`}>{copy.search}</Link>
      <details className="mobile-submenu"><summary>{copy.cropSample}</summary><div>{solutions.filter(item => item.group === "crop").map(item => <Link key={item.slug} href={`${prefix}/solutions/${item.slug}`}>{solutionName(item)}</Link>)}</div></details>
      <Link href={`${prefix}/products`}>{labels.products}</Link><Link href={`${prefix}/products/series`}>{copy.series}</Link><Link href={`${prefix}/faq`}>{copy.faq}</Link><Link href={`${prefix}/sds-request`}>{resourceMessages[locale].sds}</Link><Link href={`${prefix}/quality-assurance`}>{resourceMessages[locale].quality}</Link>
      <details className="mobile-submenu"><summary>{copy.solutions}</summary><div><Link href={`${prefix}/solutions`}>{copy.methodsIndex}</Link><PracticeMenuGroups locale={locale} onNavigate={close}/></div></details>
      <details className="mobile-submenu"><summary>{labels.tools}</summary><div><Link href={`${prefix}/smart-farming`}>{copy.allTools}</Link></div></details>
      <Link href={`${prefix}/about`}>{labels.about}</Link><details className="mobile-submenu"><summary>{labels.insights}</summary><div><Link href={`${prefix}/insights`}>{copy.knowledge}</Link><Link href={`${prefix}/cases`}>{copy.stories}</Link><Link href={`${prefix}/faq`}>{copy.faq}</Link><Link href={`${prefix}/news`}>{copy.news}</Link></div></details>
      <Link href={`${prefix}/contact`}>{labels.contact}</Link><LanguageMenu locale={locale} alternatePath={alternatePath} mobile frenchPreview={frenchPreview} spanishPreview={spanishPreview} previewAllLocales={previewAllLocales} />
    </nav>
  </details>;
}
