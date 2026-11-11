import Link from "next/link";
import { getNewsPage } from "../content/news";
import type { LocaleCode } from "../i18n/locales";
import { homeEditorialMessages } from "../i18n/home-editorial-messages";

export async function HomeNews({ locale }: { locale: LocaleCode }) {
  const copy = homeEditorialMessages[locale];
  const { items } = await getNewsPage(locale, 1, 3);
  const prefix = `/${locale}`;
  return <section className="home-news" aria-labelledby="home-news-title"><div className="home-section-heading"><span className="eyebrow">{copy.newsEyebrow}</span><h2 id="home-news-title">{copy.newsTitle}</h2><p>{copy.newsIntro}</p></div>{items.length ? <div className="home-news-grid">{items.slice(0,3).map(item=><article className="home-news-card" key={item.slug}><span className="home-news-date" aria-hidden="true">{item.publishedOn ? item.publishedOn.slice(8,10) : "—"}<small>{item.publishedOn ? item.publishedOn.slice(0,7) : "—"}</small></span><div><h3><Link href={`${prefix}/news/${encodeURIComponent(item.slug)}`}>{item.title ?? copy.newsPendingTitle}</Link></h3><p>{item.summary ?? copy.newsPendingSummary}</p></div></article>)}</div> : <p>{copy.newsEmpty}</p>}<Link className="text-link" href={`${prefix}/news`}>{copy.newsAll} ↗</Link></section>;
}
