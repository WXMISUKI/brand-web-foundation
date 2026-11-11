import legacy from "./company-legacy-copy.mjs";
import { legacyCompanyNameValues } from "./company-name-legacy.mjs";

export function correctKnownCompanyName(value) {
  return legacyCompanyNameValues.includes(value) ? value.replace(legacyCompanyNameValues[0], "安徽康坶国际化肥股份有限公司") : value;
}

// Replace only the known seeded editorial notes; later CMS edits pass through.
const copy = {
  en: { description: "Anhui Kangmu is a private technology enterprise based in Bengbu, Anhui, integrating fertilizer research, development, production and sales.", focus: ["We integrate fertilizer research, development, production and sales.", "Explore KOMU fertilizer categories and product information.", "We carry out research and product development for fertilizer and plant nutrition."] },
  zh: { description: "安徽康坶位于安徽省蚌埠市淮上区，是一家集肥料科研、开发、生产和销售于一体的民营科技企业。", focus: ["公司集肥料科研、开发、生产和销售于一体。", "浏览康姆肥料产品系列和相关产品资料。", "围绕肥料和植物营养开展研究与产品开发。"] },
  es: { description: "Anhui Kangmu es una empresa tecnológica privada de Bengbu, Anhui, que integra investigación, desarrollo, producción y venta de fertilizantes.", focus: ["Integramos la investigación, el desarrollo, la producción y la venta de fertilizantes.", "Explore las categorías de fertilizantes KOMU y la información de los productos.", "Investigamos y desarrollamos productos para la fertilización y la nutrición vegetal."] },
  fr: { description: "Anhui Kangmu est une entreprise technologique privée située à Bengbu, dans l’Anhui, qui réunit la recherche, le développement, la production et la vente d’engrais.", focus: ["Nous réunissons la recherche, le développement, la production et la vente d’engrais.", "Découvrez les catégories d’engrais KOMU et les informations sur les produits.", "Nous menons des recherches et développons des produits pour la fertilisation et la nutrition végétale."] },
  pt: { description: "A Anhui Kangmu é uma empresa tecnológica privada de Bengbu, Anhui, que integra investigação, desenvolvimento, produção e venda de fertilizantes.", focus: ["Integramos investigação, desenvolvimento, produção e venda de fertilizantes.", "Explore as categorias de fertilizantes KOMU e as informações dos produtos.", "Investigamos e desenvolvemos produtos para fertilização e nutrição vegetal."] },
  ru: { description: "Anhui Kangmu — частное технологическое предприятие в Бэнбу, провинция Аньхой, объединяющее исследования, разработку, производство и продажу удобрений.", focus: ["Мы объединяем исследования, разработку, производство и продажу удобрений.", "Изучите категории удобрений KOMU и информацию о продукции.", "Мы исследуем и разрабатываем продукты для удобрения и питания растений."] },
  it: { description: "Anhui Kangmu è un’impresa tecnologica privata di Bengbu, nell’Anhui, che integra ricerca, sviluppo, produzione e vendita di fertilizzanti.", focus: ["Integriamo ricerca, sviluppo, produzione e vendita di fertilizzanti.", "Scopri le categorie di fertilizzanti KOMU e le informazioni sui prodotti.", "Svolgiamo ricerca e sviluppiamo prodotti per la fertilizzazione e la nutrizione delle piante."] },
  tr: { description: "Anhui Kangmu, Anhui eyaletinin Bengbu kentinde gübre araştırması, geliştirmesi, üretimi ve satışını bir araya getiren özel bir teknoloji şirketidir.", focus: ["Gübre araştırması, geliştirmesi, üretimi ve satışını bir araya getiriyoruz.", "KOMU gübre kategorilerini ve ürün bilgilerini inceleyin.", "Gübre ve bitki besleme alanında araştırma ve ürün geliştirme yürütüyoruz."] },
  th: { description: "Anhui Kangmu เป็นบริษัทเทคโนโลยีเอกชนในเมืองเปิงปู้ มณฑลอานฮุย ดำเนินงานด้านการวิจัย พัฒนา ผลิต และจำหน่ายปุ๋ย", focus: ["เราดำเนินงานด้านการวิจัย พัฒนา ผลิต และจำหน่ายปุ๋ย", "สำรวจหมวดหมู่ปุ๋ย KOMU และข้อมูลผลิตภัณฑ์", "เราวิจัยและพัฒนาผลิตภัณฑ์สำหรับปุ๋ยและธาตุอาหารพืช"] },
  nl: { description: "Anhui Kangmu is een particulier technologiebedrijf in Bengbu, Anhui, dat onderzoek, ontwikkeling, productie en verkoop van meststoffen combineert.", focus: ["Wij combineren onderzoek, ontwikkeling, productie en verkoop van meststoffen.", "Bekijk de KOMU-meststofcategorieën en productinformatie.", "Wij onderzoeken en ontwikkelen producten voor bemesting en plantenvoeding."] },
  ro: { description: "Anhui Kangmu este o companie privată de tehnologie din Bengbu, Anhui, care integrează cercetarea, dezvoltarea, producția și vânzarea îngrășămintelor.", focus: ["Integrăm cercetarea, dezvoltarea, producția și vânzarea îngrășămintelor.", "Descoperiți categoriile de îngrășăminte KOMU și informațiile despre produse.", "Cercetăm și dezvoltăm produse pentru fertilizare și nutriția plantelor."] },
  el: { description: "Η Anhui Kangmu είναι ιδιωτική εταιρεία τεχνολογίας στο Bengbu της Anhui, που συνδυάζει έρευνα, ανάπτυξη, παραγωγή και πώληση λιπασμάτων.", focus: ["Συνδυάζουμε την έρευνα, την ανάπτυξη, την παραγωγή και την πώληση λιπασμάτων.", "Δείτε τις κατηγορίες λιπασμάτων KOMU και τις πληροφορίες προϊόντων.", "Ερευνούμε και αναπτύσσουμε προϊόντα λίπανσης και θρέψης φυτών."] },
  he: { description: "Anhui Kangmu היא חברת טכנולוגיה פרטית מבנגבו שבמחוז אנחווי, המשלבת מחקר, פיתוח, ייצור ומכירה של דשנים.", focus: ["אנו משלבים מחקר, פיתוח, ייצור ומכירה של דשנים.", "גלו את קטגוריות הדשנים של KOMU ואת פרטי המוצרים.", "אנו חוקרים ומפתחים מוצרים לדישון ולהזנת צמחים."] },
};

export function companyDescriptionForDisplay(locale, value) {
  if (legacy[locale]?.description === value) return copy[locale].description;
  if (legacy.en.description === value) return copy.en.description;
  return value;
}

export function focusDescriptionForDisplay(locale, index, value) {
  if (legacy[locale]?.focusAreas[index] === value) return copy[locale].focus[index];
  if (legacy.en.focusAreas[index] === value) return copy.en.focus[index];
  return value;
}
