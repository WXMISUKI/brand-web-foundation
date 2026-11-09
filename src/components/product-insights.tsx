import Link from "next/link";
import { getInsightPage } from "../content/insights";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const messages = completeLocaleMap({
  en: { heading: "Explore growing insights", note: "Browse recent articles on plant nutrition and growing. These are not product-specific recommendations.", sample: "Sample topic", empty: "No articles are available yet.", all: "View all insights ↗" },
  zh: { heading: "了解更多种植知识", note: "浏览近期植物营养与种植文章；这些文章不代表针对本产品的使用建议。", sample: "示例主题", empty: "暂无文章。", all: "查看全部种植知识 ↗" },
  fr: { heading: "Découvrir les conseils de culture", note: "Consultez les articles récents sur la nutrition végétale et la culture. Ils ne constituent pas des recommandations propres à ce produit.", sample: "Sujet d’exemple", empty: "Aucun article disponible pour le moment.", all: "Voir tous les conseils ↗" },
  es: { heading: "Explorar conocimientos de cultivo", note: "Consulte artículos recientes sobre nutrición vegetal y cultivo. No son recomendaciones específicas para este producto.", sample: "Tema de ejemplo", empty: "Todavía no hay artículos disponibles.", all: "Ver todos los artículos ↗" },
});

export async function ProductInsights({ locale }: { locale: CatalogPageLocale }) {
  const copy = messages[locale], common = aboutMessages[locale];
  const { items } = await getInsightPage(locale, "", "", 1, 3);
  return <section className="detail-section product-insights" aria-labelledby="product-insights-title"><h2 id="product-insights-title">{copy.heading}</h2><p>{copy.note}</p>{items.length ? <ul>{items.map(item => <li key={item.slug}>{item.sample && <small>{copy.sample} · </small>}<Link href={`/${locale}/insights/${encodeURIComponent(item.slug)}`}>{item.title ?? common.pending} ↗</Link></li>)}</ul> : <p>{copy.empty}</p>}<Link className="text-link" href={`/${locale}/insights`}>{copy.all}</Link></section>;
}
