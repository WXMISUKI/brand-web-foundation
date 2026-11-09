import Link from "next/link";
import { getInsightPage } from "../content/insights";
import { CaseCarousel } from "./case-carousel";
import { getCasePage } from "../content/cases";
import type { LocaleCode } from "../i18n/locales";

export async function HomeStories({ locale }: { locale: LocaleCode }) {
  const en = locale === "en";
  const { items: topics } = await getInsightPage(locale, "", "", 1, 3);
  const { items: cases } = await getCasePage(locale, "", 1, 6);
  return <><section className="home-insights" aria-labelledby="insights-title"><div className="home-section-heading"><span className="eyebrow">KNOWLEDGE</span><h2 id="insights-title">{en ? "Growing insights" : "种植知识"}</h2><p>{en ? "Explore articles on plant nutrition and growing." : "了解植物营养与种植相关知识。"}</p></div><div className="home-insights-grid">{topics.slice(0, 3).map((item,index)=><article className="home-insight-card" key={item.slug}><div className="home-insight-copy"><span className="home-insight-avatar" aria-hidden="true">✳</span><div><small>{item.author ?? (en ? "KOMU editorial team" : "康姆编辑团队")}</small><h3><Link href={'/' + locale + '/insights/' + encodeURIComponent(item.slug)}>{item.title ?? (en ? "Translation unavailable" : "译文暂未提供")}</Link></h3><p>{item.summary ?? (en ? "Article summary unavailable" : "文章摘要暂未提供")}</p></div></div><div className={'home-insight-image home-insight-image-' + (index + 1)}>{item.image && <img src={item.image.src} alt={item.image.alt ?? ""} />}</div></article>)}</div>{topics.length === 0 && <p>{en ? "No articles are available yet." : "暂无文章。"}</p>}<Link className="text-link" href={'/' + locale + '/insights'}>{en ? "View all insights ↗" : "查看全部种植知识 ↗"}</Link></section><CaseCarousel locale={locale} slides={cases}/></>;
}
