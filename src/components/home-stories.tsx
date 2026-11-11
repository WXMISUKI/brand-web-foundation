import Link from "next/link";
import { getInsightPage } from "../content/insights";
import { CaseCarousel } from "./case-carousel";
import { getCasePage } from "../content/cases";
import type { LocaleCode } from "../i18n/locales";
import { homeEditorialMessages } from "../i18n/home-editorial-messages";

export async function HomeStories({ locale }: { locale: LocaleCode }) {
  const copy = homeEditorialMessages[locale];
  const { items: topics } = await getInsightPage(locale, "", "", 1, 3);
  const { items: cases } = await getCasePage(locale, "", 1, 6);
  return <><section className="home-insights" aria-labelledby="insights-title"><div className="home-section-heading"><span className="eyebrow">{copy.insightEyebrow}</span><h2 id="insights-title">{copy.insightTitle}</h2><p>{copy.insightIntro}</p></div><div className="home-insights-grid">{topics.slice(0, 3).map((item,index)=><article className="home-insight-card" key={item.slug}><div className="home-insight-copy"><span className="home-insight-avatar" aria-hidden="true">✳</span><div><small>{item.author ?? copy.insightAuthor}</small><h3><Link href={'/' + locale + '/insights/' + encodeURIComponent(item.slug)}>{item.title ?? copy.insightPendingTitle}</Link></h3><p>{item.summary ?? copy.insightPendingSummary}</p></div></div><div className={'home-insight-image home-insight-image-' + (index + 1)}>{item.image && <img src={item.image.src} alt={item.image.alt ?? ""} />}</div></article>)}</div>{topics.length === 0 && <p>{copy.insightEmpty}</p>}<Link className="text-link" href={'/' + locale + '/insights'}>{copy.insightAll}</Link></section><CaseCarousel locale={locale} slides={cases}/></>;
}
