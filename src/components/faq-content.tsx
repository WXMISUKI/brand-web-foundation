"use client";

import Link from "next/link";
import { useState } from "react";
import type { FaqContentData } from "../content/faq";
import { faqMessages } from "../i18n/faq-messages";
import { aboutMessages } from "../i18n/about-messages";
import type { LocaleCode } from "../i18n/locales";

export function FaqContent({ locale, data, query = "", questionId = "", preview = false }: { locale: LocaleCode; data: FaqContentData; query?: string; questionId?: string; preview?: boolean }) {
  const [activeId, setActiveId] = useState(data.groups.find(group => group.questions.some(item => item.id === questionId))?.id ?? data.groups[0]?.id);
  const active = data.groups.find(group => group.id === activeId) ?? data.groups[0];
  const copy = faqMessages[locale], common = aboutMessages[locale], prefix = `/${locale}`;
  return <main className="faq-page">
    <div className="faq-banner"><span>{common.sampleImage}</span></div>
    <div className="faq-body">
      <nav className="faq-breadcrumb" aria-label={common.breadcrumb}><Link href={locale === "es" ? "/es/products" : prefix}>{locale === "es" ? "Catálogo de productos" : common.home}</Link> / {copy.title}</nav>
      <h1>{copy.title}</h1>
      <p className="faq-intro">{copy.intro}</p>
      {active ? <div className="faq-layout"><nav className="faq-categories" aria-label={copy.categories}>{data.groups.map(group => <button key={group.id} type="button" aria-pressed={group.id === active.id} onClick={() => setActiveId(group.id)}>{group.name ?? common.pending}</button>)}</nav>
        <div className="faq-list" key={active.id}>{active.questions.length ? active.questions.map(item => <details key={item.id} open={item.id === questionId ? true : undefined}><summary>{item.question ?? common.pending}</summary><div><p className="news-body">{item.answer ?? common.pending}</p><Link href={`${prefix}/contact`}>{common.contact} ↗</Link></div></details>) : <p>{copy.empty}</p>}</div>
      </div> : <p>{query ? copy.noMatch : copy.empty}</p>}
      <form className="faq-search" action={preview ? "/en/cms-preview/faq" : `${prefix}/faq`} role="search">{preview && <input type="hidden" name="locale" value={locale}/>}<label htmlFor="faq-query">{copy.search}</label><div><input id="faq-query" name="q" type="search" maxLength={100} defaultValue={query}/><button type="submit">{copy.submit}</button>{query && <Link href={preview ? `/en/cms-preview/faq?locale=${encodeURIComponent(locale)}` : `${prefix}/faq`}>{copy.clear}</Link>}</div></form>
    </div>
  </main>;
}
