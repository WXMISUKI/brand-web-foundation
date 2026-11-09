import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem, getNewsPage } from "../content/news";
import { newsPagePath } from "../data/news-page";
import { NewsListItem } from "./news-list-item";
import { RichBody } from "./rich-body";
import { newsMessages } from "../i18n/news-messages";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export async function NewsList({ locale, page, query, kind = "all", basePath }: { locale: CatalogPageLocale; page: number; query: string; kind?: "all" | "news" | "event"; basePath?: string }) {
  const copy = newsMessages[locale], common = aboutMessages[locale], prefix = `/${locale}`, path = basePath ?? `${prefix}/news`;
  const { items, totalPages } = await getNewsPage(locale, page, 9, query, kind);
  const tabPath = (tab: "all" | "news" | "event") => newsPagePath(locale, 1, query, path, tab);
  return <main><div className="insight-banner"><span>{common.sampleImage}</span></div><div className="inner news-page"><nav className="crumb"><Link href={locale === "es" ? "/es/products" : prefix}>{locale === "es" ? "Catálogo de productos" : common.home}</Link> / {copy.short}</nav><h1>{copy.title}</h1><p className="news-intro-placeholder">{copy.intro}</p><nav className="news-type-tabs" aria-label={copy.title}><Link href={tabPath("all")} aria-current={kind === "all" ? "page" : undefined}>{copy.allTab}</Link><Link href={tabPath("news")} aria-current={kind === "news" ? "page" : undefined}>{copy.newsTab}</Link><Link href={tabPath("event")} aria-current={kind === "event" ? "page" : undefined}>{copy.eventsTab}</Link></nav>{items.length ? <div className="news-list">{items.map(item=><NewsListItem key={item.slug} item={item} locale={locale} basePath={basePath} />)}</div> : <p>{copy.empty} {query && <Link className="text-link" href={path}>{copy.all}</Link>}</p>}<form className="case-search" action={path} role="search"><input type="hidden" name="type" value={kind === "all" ? "" : kind}/><label htmlFor="news-query">{copy.search}</label><div><input id="news-query" name="q" type="search" maxLength={100} defaultValue={query}/><button type="submit">{copy.submit}</button></div><small>{copy.note}</small></form>{(totalPages > 1 || page > 1) && <nav className="insight-pagination" aria-label={copy.pages}>{page > 1 && <Link href={newsPagePath(locale, Math.min(page - 1, Math.max(totalPages, 1)), query, path, kind)}>{copy.previous}</Link>}<span>{copy.page} {page} {copy.of} {totalPages || 1}{locale === "zh" && " 页"}</span>{page < totalPages && <Link href={newsPagePath(locale, page + 1, query, path, kind)}>{copy.next}</Link>}</nav>}</div></main>;
}
export async function NewsDetail({ locale, slug, basePath }: { locale: CatalogPageLocale; slug: string; basePath?: string }) {
  const copy = newsMessages[locale], common = aboutMessages[locale], path = basePath ?? `/${locale}/news`;
  const item = await getNewsItem(locale, slug);
  if (!item) notFound();
  const title = item.title ?? (locale === "en" ? "Translation pending" : locale === "zh" ? "待翻译" : common.pending);
  return <main><div className="insight-banner"><span>{common.sampleImage}</span></div><article className="inner news-page"><nav className="crumb"><Link href={path}>{copy.title}</Link> / {title}</nav><h1>{title}</h1><time>{item.publishedOn?.slice(0,10) ?? copy.date}</time>{item.image && <img className="news-image" src={item.image.src} alt={item.image.alt ?? title}/>}<RichBody locale={locale} rich={item.richBody} plain={item.body} pending={copy.body}/></article></main>;
}
