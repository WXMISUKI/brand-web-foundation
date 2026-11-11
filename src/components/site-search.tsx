import Link from "next/link";
import { getSiteCatalogResults } from "../content/site-catalog";
import { getInsightPage } from "../content/insights";
import { getCasePage } from "../content/cases";
import { getNewsPage } from "../content/news";
import { filterFaqContent, getFaqContent } from "../content/faq";
import { aboutMessages } from "../i18n/about-messages";
import { catalogMessages, type CatalogPageLocale } from "../i18n/catalog-messages";
import { insightMessages } from "../i18n/insight-messages";
import { caseMessages } from "../i18n/case-messages";
import { newsMessages } from "../i18n/news-messages";
import { faqMessages } from "../i18n/faq-messages";
import { searchMessages } from "../i18n/search-messages";

export async function SiteSearch({ locale, query }: { locale: CatalogPageLocale; query: string }) {
  const copy = searchMessages[locale], common = aboutMessages[locale], prefix = `/${locale}`;
  const results = query ? await Promise.all([getSiteCatalogResults(locale, "", query, 1, 5), getInsightPage(locale, query, "", 1, 5), getCasePage(locale, query, 1, 5), getNewsPage(locale, 1, 5, query), getFaqContent(locale)]) : null;
  const faqResults = results ? filterFaqContent(results[4], query).groups.flatMap(group => group.questions) : [];
  const sections = results ? [
    { key: "products", title: catalogMessages[locale].products, total: results[0].totalDocs, items: results[0].products.map(item => ({ slug: item.slug, title: item.name, summary: item.intro })) },
    { key: "insights", title: insightMessages[locale].title, total: results[1].totalDocs, items: results[1].items },
    { key: "cases", title: caseMessages[locale].title, total: results[2].totalDocs, items: results[2].items },
    { key: "news", title: newsMessages[locale].title, total: results[3].totalDocs, items: results[3].items },
  ] : [];
  const pending = common.pending;
  return <main className="inner site-search-page"><nav className="crumb" aria-label={common.breadcrumb}><Link href={prefix}>{common.home}</Link> / {copy.title}</nav><h1>{copy.title}</h1><form action={`${prefix}/search`} role="search"><label htmlFor="site-query">{copy.label}</label><div><input id="site-query" name="q" type="search" maxLength={100} defaultValue={query}/><button type="submit">{copy.button}</button></div><p>{copy.note}</p></form>
    {!query ? <p>{copy.prompt}</p> : sections.every(section => section.total === 0) && !faqResults.length ? <p role="status">{copy.empty}</p> : <>{sections.filter(section => section.total > 0).map(section => <section key={section.key} className="site-search-section"><h2>{section.title} <small>({section.total})</small></h2><ul>{section.items.map(item => <li key={item.slug}><Link href={`${prefix}/${section.key}/${encodeURIComponent(item.slug)}`}>{item.title ?? pending}</Link>{item.summary && <p>{item.summary}</p>}</li>)}</ul>{section.total > section.items.length && <Link className="text-link" href={`${prefix}/${section.key}?${new URLSearchParams({ q: query })}`}>{copy.all} ↗</Link>}</section>)}{faqResults.length > 0 && <section className="site-search-section"><h2>{faqMessages[locale].title} <small>({faqResults.length})</small></h2><ul>{faqResults.slice(0, 5).map(item => <li key={item.id}><Link href={`${prefix}/faq?${new URLSearchParams({ q: query, question: item.id })}`}>{item.question ?? pending}</Link>{item.answer && <p>{item.answer}</p>}</li>)}</ul>{faqResults.length > 5 && <Link className="text-link" href={`${prefix}/faq?${new URLSearchParams({ q: query })}`}>{copy.faqAll} ↗</Link>}</section>}</>}
  </main>;
}
