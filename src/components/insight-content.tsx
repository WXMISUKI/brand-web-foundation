import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, getInsightPage } from "../content/insights";
import { insightSearchPath } from "../data/insight-search";
import { insightMessages } from "../i18n/insight-messages";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { RichBody } from "./rich-body";
import { insightTopics, topicLabel } from "../i18n/insight-topics";

export async function InsightList({ locale, query, author, topic = "", page, basePath }: { locale: CatalogPageLocale; query: string; author: string; topic?: string; page: number; basePath?: string }) {
  const copy = insightMessages[locale], common = aboutMessages[locale], path = basePath ?? `/${locale}/insights`;
  const { items: matches, totalPages } = await getInsightPage(locale, query, author, page, 9, topic);
  const allTopics = locale === "zh" ? "全部主题" : locale === "fr" ? "Tous les thèmes" : locale === "es" ? "Todos los temas" : "All topics";
  const topicPath = (value: string) => insightSearchPath(locale, query, author, value, 1, path);
  return <main><div className="insight-banner"><span>{common.sampleImage}</span></div><div className="inner insight-page">
    <nav className="crumb" aria-label={common.breadcrumb}><Link href={locale === "es" ? "/es/products" : `/${locale}`}>{locale === "es" ? "Catálogo de productos" : common.home}</Link> / {copy.title}</nav>
    <h1>{copy.title}</h1><p className="insight-intro">{copy.intro}</p>
    <nav className="insight-topics" aria-label={allTopics}><Link href={topicPath("")} aria-current={topic ? undefined : "page"}>{allTopics}</Link>{Object.keys(insightTopics.en).map(slug => <Link key={slug} href={topicPath(slug)} aria-current={topic === slug ? "page" : undefined}>{topicLabel(locale, slug)}</Link>)}</nav>
    <form className="insight-search" action={path}><input type="hidden" name="topic" value={topic}/><label htmlFor="insight-query">{copy.search}</label><div><input id="insight-query" name="q" defaultValue={query} aria-describedby="insight-search-help" /></div><label htmlFor="insight-author">{copy.author}</label><div><input id="insight-author" name="author" defaultValue={author} aria-describedby="insight-search-help" /><button type="submit">{copy.submit}</button></div><p id="insight-search-help">{copy.note}</p></form>
    {matches.length ? <div className="insight-list">{matches.map(item => <article key={item.slug}>{item.image && <img src={item.image.src} alt={item.image.alt ?? ""} />}<div><small>{item.author ?? (locale === "zh" ? "康姆编辑团队" : "KOMU editorial team")}</small><h2><Link href={`${path}/${encodeURIComponent(item.slug)}`}>{item.title ?? common.pending}</Link></h2><p>{item.summary ?? copy.summary}</p></div></article>)}</div> : <div role="status"><p>{copy.empty}</p><Link className="text-link" href={path}>{copy.all}</Link></div>}
    {(totalPages > 1 || page > 1) && <nav className="insight-pagination" aria-label={copy.pages}>{page > 1 && <Link href={insightSearchPath(locale, query, author, topic, Math.min(page - 1, Math.max(totalPages, 1)), path)}>{copy.previous}</Link>}<span>{copy.page} {page} {copy.of} {totalPages || 1}{locale === "zh" && " 页"}</span>{page < totalPages && <Link href={insightSearchPath(locale, query, author, topic, page + 1, path)}>{copy.next}</Link>}</nav>}
  </div></main>;
}

export async function InsightDetail({ locale, slug, basePath }: { locale: CatalogPageLocale; slug: string; basePath?: string }) {
  const item = await getInsight(locale, slug);
  if (!item) notFound();
  const copy = insightMessages[locale], common = aboutMessages[locale], path = basePath ?? `/${locale}/insights`;
  const title = item.title ?? common.pending;
  return <main><div className="insight-banner"><span>{common.sampleImage}</span></div><article className="inner insight-page">
    <nav className="crumb" aria-label={common.breadcrumb}><Link href={path}>{copy.title}</Link> / {title}</nav>
    <h1>{title}</h1>
    {item.author && <p>{item.author}</p>}{item.publishedOn && <time dateTime={item.publishedOn}>{item.publishedOn.slice(0, 10)}</time>}
    {item.image && <img className="news-image" src={item.image.src} alt={item.image.alt ?? title} />}
    <RichBody locale={locale} rich={item.richBody} plain={item.body} pending={copy.body}/>
    <Link className="text-link" href={path}>{copy.back}</Link>
  </article></main>;
}
