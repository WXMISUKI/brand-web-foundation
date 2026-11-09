import Link from "next/link";
import { getNewsPage } from "../content/news";
import type { LocaleCode } from "../i18n/locales";

export async function HomeNews({ locale }: { locale: LocaleCode }) {
  const en = locale === "en";
  const { items } = await getNewsPage(locale, 1, 3);
  const prefix = `/${locale}`;
  return <section className="home-news" aria-labelledby="home-news-title"><div className="home-section-heading"><span className="eyebrow">NEWS & EVENTS</span><h2 id="home-news-title">{en ? "News and events" : "新闻与活动"}</h2><p>{en ? "Product, growing and company updates from KOMU." : "康姆产品、种植与企业动态。"}</p></div>{items.length ? <div className="home-news-grid">{items.slice(0,3).map(item=><article className="home-news-card" key={item.slug}><span className="home-news-date" aria-hidden="true">{item.publishedOn ? item.publishedOn.slice(8,10) : "—"}<small>{item.publishedOn ? item.publishedOn.slice(0,7) : "—"}</small></span><div><h3><Link href={`${prefix}/news/${encodeURIComponent(item.slug)}`}>{item.title ?? (en ? "Translation unavailable" : "译文暂未提供")}</Link></h3><p>{item.summary ?? (en ? "Details are unavailable." : "详细内容暂未提供。")}</p></div></article>)}</div> : <p>{en ? "No updates are available yet." : "暂无动态。"}</p>}<Link className="text-link" href={`${prefix}/news`}>{en ? "View all news" : "查看全部新闻"} ↗</Link></section>;
}
