import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

export const sustainabilityMessages = completeLocaleMap({
  en: { title: "Sustainability", preview: "TOPIC PREVIEW", intro: "Our sustainability strategy, practices and evidence will be added when company information is available.", image: "Sample image · not owner material", home: "Home", breadcrumb: "Breadcrumb", pending: "Content and supporting materials await owner confirmation.", sections: ["Strategy and goals", "Environment", "People and safety", "Governance"] },
  zh: { title: "可持续发展", preview: "专题预览", intro: "企业的可持续发展战略、实践及相关资料将在业主提供后补充。", image: "示例图片 · 非业主素材", home: "首页", breadcrumb: "面包屑导航", pending: "具体内容与支持资料等待业主确认。", sections: ["战略与目标", "环境", "员工与安全", "治理"] },
  fr: { title: "Développement durable", preview: "APERÇU DU THÈME", intro: "La stratégie, les pratiques et les documents de l’entreprise seront ajoutés lorsqu’ils seront disponibles.", image: "Image d’exemple · non fournie par l’entreprise", home: "Accueil", breadcrumb: "Fil d’Ariane", pending: "Contenu et documents à confirmer.", sections: ["Stratégie et objectifs", "Environnement", "Personnes et sécurité", "Gouvernance"] },
  es: { title: "Sostenibilidad", preview: "VISTA PREVIA DEL TEMA", intro: "La estrategia, las prácticas y los documentos se añadirán cuando la empresa facilite la información.", image: "Imagen de ejemplo · no facilitada por la empresa", home: "Inicio", breadcrumb: "Ruta de navegación", pending: "Contenido y documentación pendientes de confirmación.", sections: ["Estrategia y objetivos", "Medio ambiente", "Personas y seguridad", "Gobernanza"] },
  pt: { title: "Sustentabilidade", preview: "PRÉ-VISUALIZAÇÃO DO TEMA", intro: "A estratégia, as práticas e os documentos serão adicionados quando a empresa fornecer as informações.", image: "Imagem de exemplo · não fornecida pela empresa", home: "Início", breadcrumb: "Navegação estrutural", pending: "Conteúdo e documentos aguardam confirmação.", sections: ["Estratégia e objetivos", "Ambiente", "Pessoas e segurança", "Governação"] },
  ru: { title: "Устойчивое развитие", preview: "ПРЕДПРОСМОТР ТЕМЫ", intro: "Стратегия, практики и документы будут добавлены после предоставления информации компанией.", image: "Пример изображения · не предоставлено компанией", home: "Главная", breadcrumb: "Навигация", pending: "Контент и документы требуют подтверждения.", sections: ["Стратегия и цели", "Окружающая среда", "Люди и безопасность", "Управление"] },
  it: { title: "Sostenibilità", preview: "ANTEPRIMA DEL TEMA", intro: "La strategia, le pratiche e i documenti saranno aggiunti quando saranno disponibili le informazioni aziendali.", image: "Immagine di esempio · non fornita dall’azienda", home: "Home", breadcrumb: "Percorso di navigazione", pending: "Contenuti e documenti da confermare.", sections: ["Strategia e obiettivi", "Ambiente", "Persone e sicurezza", "Governance"] },
  tr: { title: "Sürdürülebilirlik", preview: "KONU ÖNİZLEMESİ", intro: "Şirket bilgileri sağlandığında sürdürülebilirlik stratejisi, uygulamaları ve kanıtları eklenecektir.", image: "Örnek görsel · şirket tarafından sağlanmadı", home: "Ana sayfa", breadcrumb: "İçerik yolu", pending: "İçerik ve destek belgeleri onay bekliyor.", sections: ["Strateji ve hedefler", "Çevre", "İnsanlar ve güvenlik", "Yönetişim"] },
  th: { title: "ความยั่งยืน", preview: "ตัวอย่างหัวข้อ", intro: "กลยุทธ์ แนวปฏิบัติ และหลักฐานด้านความยั่งยืนจะเพิ่มเมื่อมีข้อมูลจากบริษัท.", image: "รูปตัวอย่าง · บริษัทไม่ได้จัดหา", home: "หน้าแรก", breadcrumb: "เส้นทางนำทาง", pending: "เนื้อหาและเอกสารประกอบรอการยืนยัน", sections: ["กลยุทธ์และเป้าหมาย", "สิ่งแวดล้อม", "ผู้คนและความปลอดภัย", "ธรรมาภิบาล"] },
  nl: { title: "Duurzaamheid", preview: "VOORBEELD VAN HET THEMA", intro: "De strategie, werkwijzen en onderbouwing worden toegevoegd zodra bedrijfsinformatie beschikbaar is.", image: "Voorbeeldafbeelding · niet door het bedrijf geleverd", home: "Home", breadcrumb: "Kruimelpad", pending: "Inhoud en documenten moeten nog worden bevestigd.", sections: ["Strategie en doelen", "Milieu", "Mensen en veiligheid", "Bestuur"] },
  ro: { title: "Sustenabilitate", preview: "PREVIZUALIZARE TEMĂ", intro: "Strategia, practicile și documentele vor fi adăugate când informațiile companiei vor fi disponibile.", image: "Imagine demonstrativă · nefurnizată de companie", home: "Acasă", breadcrumb: "Traseu de navigare", pending: "Conținutul și documentele așteaptă confirmarea.", sections: ["Strategie și obiective", "Mediu", "Oameni și siguranță", "Guvernanță"] },
  el: { title: "Βιωσιμότητα", preview: "ΠΡΟΕΠΙΣΚΟΠΗΣΗ ΘΕΜΑΤΟΣ", intro: "Η στρατηγική, οι πρακτικές και τα τεκμήρια θα προστεθούν όταν είναι διαθέσιμες οι εταιρικές πληροφορίες.", image: "Ενδεικτική εικόνα · δεν παρέχεται από την εταιρεία", home: "Αρχική", breadcrumb: "Διαδρομή πλοήγησης", pending: "Το περιεχόμενο και τα έγγραφα χρειάζονται επιβεβαίωση.", sections: ["Στρατηγική και στόχοι", "Περιβάλλον", "Άνθρωποι και ασφάλεια", "Διακυβέρνηση"] },
  he: { title: "קיימות", preview: "תצוגה מקדימה של הנושא", intro: "האסטרטגיה, הנהלים והמסמכים יתווספו כאשר מידע מהחברה יהיה זמין.", image: "תמונת דוגמה · לא סופקה על ידי החברה", home: "דף הבית", breadcrumb: "פירורי ניווט", pending: "התוכן והמסמכים המשלימים ממתינים לאישור.", sections: ["אסטרטגיה ויעדים", "סביבה", "אנשים ובטיחות", "ממשל"] },
});

export function SustainabilityContent({ locale }: { locale: CatalogPageLocale }) {
  const copy = sustainabilityMessages[locale];
  const unavailable: Record<CatalogPageLocale, string> = {
    en: "There is no information available on this topic yet.",
    zh: "暂无相关信息。",
    fr: "Aucune information n’est disponible sur ce sujet pour le moment.",
    es: "Todavía no hay información disponible sobre este tema.",
    pt: "Ainda não existe informação disponível sobre este tema.",
    ru: "Информация по этой теме пока недоступна.",
    it: "Al momento non sono disponibili informazioni su questo tema.",
    tr: "Bu konuda henüz bilgi bulunmuyor.",
    th: "ยังไม่มีข้อมูลเกี่ยวกับหัวข้อนี้",
    nl: "Er is momenteel geen informatie over dit onderwerp beschikbaar.",
    ro: "Nu există încă informații disponibile despre acest subiect.",
    el: "Δεν υπάρχουν ακόμη διαθέσιμες πληροφορίες για αυτό το θέμα.",
    he: "אין עדיין מידע זמין בנושא זה.",
  };
  return <main className="sustainability-page"><div className="inner sustainability-body">
    <nav className="crumb" aria-label={copy.breadcrumb}><Link href={`/${locale}`}>{copy.home}</Link> / {copy.title}</nav>
    <h1>{copy.title}</h1><p className="sustainability-intro">{unavailable[locale]}</p>
  </div></main>;
}
