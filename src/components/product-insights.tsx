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
  pt: { heading: "Explore conhecimentos de cultivo", note: "Consulte artigos recentes sobre nutrição vegetal e cultivo. Não são recomendações específicas para este produto.", sample: "Tema de exemplo", empty: "Ainda não há artigos disponíveis.", all: "Ver todos os conhecimentos ↗" },
  ru: { heading: "Изучите знания о выращивании", note: "Читайте последние статьи о питании растений и выращивании. Они не являются рекомендациями для конкретного продукта.", sample: "Пример темы", empty: "Статьи пока недоступны.", all: "Все материалы о выращивании ↗" },
  it: { heading: "Scopri gli approfondimenti sulla coltivazione", note: "Consulta gli articoli recenti sulla nutrizione vegetale e la coltivazione. Non sono raccomandazioni specifiche per questo prodotto.", sample: "Argomento di esempio", empty: "Non ci sono ancora articoli disponibili.", all: "Vedi tutti gli approfondimenti ↗" },
  tr: { heading: "Yetiştirme bilgilerini keşfedin", note: "Bitki besleme ve yetiştirme hakkında güncel makalelere göz atın. Bunlar bu ürüne özel öneriler değildir.", sample: "Örnek konu", empty: "Henüz makale bulunmuyor.", all: "Tüm bilgileri görüntüle ↗" },
  th: { heading: "สำรวจความรู้ด้านการเพาะปลูก", note: "ดูบทความล่าสุดเกี่ยวกับโภชนาการพืชและการเพาะปลูก เนื้อหาเหล่านี้ไม่ใช่คำแนะนำเฉพาะผลิตภัณฑ์นี้", sample: "หัวข้อตัวอย่าง", empty: "ยังไม่มีบทความ", all: "ดูความรู้ทั้งหมด ↗" },
  nl: { heading: "Ontdek teeltinzichten", note: "Bekijk recente artikelen over plantenvoeding en teelt. Dit zijn geen aanbevelingen voor een specifiek product.", sample: "Voorbeeldonderwerp", empty: "Er zijn nog geen artikelen beschikbaar.", all: "Bekijk alle inzichten ↗" },
  ro: { heading: "Explorați informațiile despre cultivare", note: "Consultați articole recente despre nutriția plantelor și cultivare. Acestea nu sunt recomandări pentru un anumit produs.", sample: "Subiect demonstrativ", empty: "Nu există încă articole disponibile.", all: "Vezi toate informațiile ↗" },
  el: { heading: "Εξερευνήστε τις γνώσεις καλλιέργειας", note: "Διαβάστε πρόσφατα άρθρα για τη φυτική θρέψη και την καλλιέργεια. Δεν αποτελούν συστάσεις για το συγκεκριμένο προϊόν.", sample: "Δείγμα θέματος", empty: "Δεν υπάρχουν ακόμη διαθέσιμα άρθρα.", all: "Δείτε όλες τις γνώσεις ↗" },
  he: { heading: "גלו ידע בגידול", note: "עיינו במאמרים עדכניים על תזונת צמחים וגידול. אלה אינן המלצות ספציפיות למוצר זה.", sample: "נושא לדוגמה", empty: "עדיין אין מאמרים זמינים.", all: "לכל המידע ↗" },
});

export async function ProductInsights({ locale }: { locale: CatalogPageLocale }) {
  const copy = messages[locale], common = aboutMessages[locale];
  const { items } = await getInsightPage(locale, "", "", 1, 3);
  return <section className="detail-section product-insights" aria-labelledby="product-insights-title"><h2 id="product-insights-title">{copy.heading}</h2><p>{copy.note}</p>{items.length ? <ul>{items.map(item => <li key={item.slug}>{item.sample && <small>{copy.sample} · </small>}<Link href={`/${locale}/insights/${encodeURIComponent(item.slug)}`}>{item.title ?? common.pending} ↗</Link></li>)}</ul> : <p>{copy.empty}</p>}<Link className="text-link" href={`/${locale}/insights`}>{copy.all}</Link></section>;
}
