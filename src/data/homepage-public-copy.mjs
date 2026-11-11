// Historical seeded strings are matched exactly; later editor changes pass through.
export const legacyFeaturedDescription = {
  en: 'Browse ten products transcribed from the owner-provided brochure.',
  zh: '浏览根据业主画册整理的十条产品资料。',
  he: 'עיינו בעשרה מוצרים שתועתקו מהחוברת שסיפק הבעלים.',
  nl: 'Bekijk tien producten die zijn overgenomen uit de door de eigenaar verstrekte brochure.',
  fr: 'Parcourez dix produits transcrits de la brochure fournie par le propriétaire.',
  it: 'Consulta dieci prodotti trascritti dalla brochure fornita dal titolare.',
  es: 'Consulte diez productos transcritos del folleto proporcionado por el propietario.',
  pt: 'Consulte dez produtos transcritos da brochura fornecida pelo proprietário.',
  el: 'Δείτε δέκα προϊόντα που μεταγράφηκαν από το φυλλάδιο του ιδιοκτήτη.',
  ro: 'Consultați zece produse transcrise din broșura furnizată de proprietar.',
  ru: 'Изучите десять продуктов, расшифрованных из предоставленной владельцем брошюры.',
  th: 'ดูข้อมูลผลิตภัณฑ์สิบรายการที่ถอดความจากโบรชัวร์ที่เจ้าของจัดเตรียม',
  tr: 'Sahibinin sağladığı broşürden aktarılan on ürünü inceleyin.',
};
const descriptions = {
  en: 'Explore the KOMU product catalogue and product information.',
  zh: '浏览康姆产品目录和产品资料。',
  he: 'גלו את קטלוג המוצרים של KOMU ואת פרטי המוצרים.',
  nl: 'Bekijk de KOMU-productcatalogus en productinformatie.',
  fr: 'Découvrez le catalogue et les informations sur les produits KOMU.',
  it: 'Esplora il catalogo e le informazioni sui prodotti KOMU.',
  es: 'Explore el catálogo y la información de productos KOMU.',
  pt: 'Explore o catálogo e as informações dos produtos KOMU.',
  el: 'Δείτε τον κατάλογο και τις πληροφορίες προϊόντων KOMU.',
  ro: 'Descoperiți catalogul și informațiile despre produsele KOMU.',
  ru: 'Изучите каталог и информацию о продукции KOMU.',
  th: 'สำรวจแค็ตตาล็อกและข้อมูลผลิตภัณฑ์ KOMU',
  tr: 'KOMU ürün kataloğunu ve ürün bilgilerini inceleyin.',
};
export function featuredDescriptionForDisplay(locale, value) {
  if (value === legacyFeaturedDescription[locale]) return descriptions[locale];
  if (value === legacyFeaturedDescription.en) return descriptions.en;
  return value;
}
