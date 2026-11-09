import Link from "next/link";
import type { NewsItem } from "../content/news";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { newsMessages } from "../i18n/news-messages";
import { aboutMessages } from "../i18n/about-messages";

export function NewsListItem({ item, locale, basePath }: { item: NewsItem; locale: CatalogPageLocale; basePath?: string }) {
  const copy = newsMessages[locale], title = item.title ?? (locale === "en" ? "Translation pending" : locale === "zh" ? "待翻译" : aboutMessages[locale].pending);
  return <article className={item.image ? "news-list-item has-image" : "news-list-item"}>
    {item.image && <img className="news-list-image" src={item.image.src} alt={item.image.alt ?? title} loading="lazy" />}
    <div><time dateTime={item.publishedOn ?? undefined}>{item.publishedOn?.slice(0, 10) ?? copy.date}</time>
      <h2><Link href={`${basePath ?? `/${locale}/news`}/${encodeURIComponent(item.slug)}`}>{title}</Link></h2>
      <p>{item.summary ?? copy.summary}</p></div>
  </article>;
}
