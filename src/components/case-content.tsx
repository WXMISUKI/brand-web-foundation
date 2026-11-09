import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase, getCasePage } from "../content/cases";
import { casePath } from "../data/case-path";
import { RichBody } from "./rich-body";
import { caseMessages } from "../i18n/case-messages";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export async function CaseList({ locale, query, page, basePath }: { locale: CatalogPageLocale; query: string; page: number; basePath?: string }) {
  const copy = caseMessages[locale], common = aboutMessages[locale], path = basePath ?? `/${locale}/cases`;
  const { items, totalPages } = await getCasePage(locale, query, page, 9);
  return <main><div className="insight-banner"><span>{common.sampleImage}</span></div><div className="inner case-page">
    <nav className="crumb" aria-label={common.breadcrumb}><Link href={locale === "es" ? "/es/products" : `/${locale}`}>{locale === "es" ? "Catálogo de productos" : common.home}</Link> / {copy.title}</nav>
    <h1>{copy.title}</h1><p className="case-intro-placeholder">{copy.intro}</p>
    {items.length ? <div className="case-grid">{items.map(item => <article className="case-card" key={item.slug}><div>{item.sample && <span className="eyebrow">{copy.sample}</span>}<h2><Link href={`${path}/${encodeURIComponent(item.slug)}`}>{item.title ?? common.pending}</Link></h2><p>{item.summary ?? copy.summary}</p></div>{item.image && <img src={item.image.src} alt={item.image.alt ?? ""} loading="lazy"/>}{item.sample && <span className="case-image-note">{copy.sampleImage}</span>}</article>)}</div> : <div role="status"><p>{copy.empty}</p><Link className="text-link" href={path}>{copy.all}</Link></div>}
    <form className="case-search" action={path}><label htmlFor="case-query">{copy.search}</label><div><input id="case-query" name="q" defaultValue={query}/><button type="submit">{copy.submit}</button></div><small>{copy.note}</small></form>
    {(totalPages > 1 || page > 1) && <nav className="insight-pagination" aria-label={copy.pages}>{page > 1 && <Link href={casePath(locale, query, Math.min(page - 1, Math.max(totalPages, 1)), path)}>{copy.previous}</Link>}<span>{copy.page} {page} {copy.of} {totalPages || 1}{locale === "zh" && " 页"}</span>{page < totalPages && <Link href={casePath(locale, query, page + 1, path)}>{copy.next}</Link>}</nav>}
  </div></main>;
}
export async function CaseDetail({ locale, slug, basePath }: { locale: CatalogPageLocale; slug: string; basePath?: string }) {
  const item = await getCase(locale, slug);
  if (!item) notFound();
  const copy = caseMessages[locale], common = aboutMessages[locale], path = basePath ?? `/${locale}/cases`;
  const title = item.title ?? (locale === "en" ? "Translation pending" : locale === "zh" ? "待翻译" : common.pending);
  return <main><div className="insight-banner"><span>{common.sampleImage}</span></div><article className="inner case-page"><nav className="crumb" aria-label={common.breadcrumb}><Link href={path}>{copy.title}</Link> / {title}</nav>{item.sample && <span className="eyebrow">{copy.sampleDetail}</span>}<h1>{title}</h1><p>{item.summary ?? copy.summary}</p>{item.image && <img className="case-detail-image" src={item.image.src} alt={item.image.alt ?? ""}/>}<section><h2>{copy.information}</h2><RichBody locale={locale} rich={item.richBody} plain={item.body} pending={copy.body}/></section><Link className="text-link" href={path}>{copy.back}</Link></article></main>;
}
