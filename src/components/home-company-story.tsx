import Link from "next/link";
import type { CompanyProfile } from "../content/company-profile";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

export const homeCompanyStoryMessages = completeLocaleMap({
  en: { eyebrow: "ABOUT US", sampleTitle: <>Growing together<br/>with growers.</>, sampleSummary: "Anhui Kangmu International Fertilizer Co., Ltd. · KOMU plant nutrition", image: "KOMU plant nutrition", link: "About us ↗" },
  zh: { eyebrow: "关于我们", sampleTitle: <>理解土地，<br/>也理解种植者。</>, sampleSummary: "安徽康坶国际化肥股份有限公司 · 康姆植物营养", image: "康姆植物营养", link: "了解我们 ↗" },
  fr: { eyebrow: "À PROPOS · APERÇU", sampleTitle: <>Grandir ensemble<br/>avec les cultivateurs.</>, sampleSummary: "La présentation et les capacités de l’entreprise restent à confirmer.", image: "Image d’exemple · non fournie par l’entreprise", link: "À propos ↗" },
  es: { eyebrow: "QUIÉNES SOMOS · VISTA PREVIA", sampleTitle: <>Crecer junto a<br/>los agricultores.</>, sampleSummary: "La información y las capacidades de la empresa están pendientes de confirmación.", image: "Imagen de ejemplo · no facilitada por la empresa", link: "Quiénes somos ↗" },
  pt: { eyebrow: "SOBRE NÓS · PRÉ-VISUALIZAÇÃO", sampleTitle: <>Crescer juntos<br/>com os produtores.</>, sampleSummary: "A apresentação e as capacidades da empresa aguardam confirmação.", image: "Imagem de exemplo · não fornecida pela empresa", link: "Sobre nós ↗" },
  ru: { eyebrow: "О КОМПАНИИ · ПРЕДПРОСМОТР", sampleTitle: <>Растём вместе<br/>с растениеводами.</>, sampleSummary: "Информация о компании и её возможностях требует подтверждения.", image: "Пример изображения · не предоставлено компанией", link: "О компании ↗" },
  it: { eyebrow: "CHI SIAMO · ANTEPRIMA", sampleTitle: <>Crescere insieme<br/>ai coltivatori.</>, sampleSummary: "La presentazione e le capacità dell’azienda devono essere confermate.", image: "Immagine di esempio · non fornita dall’azienda", link: "Chi siamo ↗" },
  tr: { eyebrow: "HAKKIMIZDA · ÖNİZLEME", sampleTitle: <>Üreticilerle<br/>birlikte büyümek.</>, sampleSummary: "Şirket sunumu ve yetkinlikleri onay bekliyor.", image: "Örnek görsel · şirket tarafından sağlanmadı", link: "Hakkımızda ↗" },
  th: { eyebrow: "เกี่ยวกับเรา · ตัวอย่าง", sampleTitle: <>เติบโตไปพร้อม<br/>กับผู้ปลูก.</>, sampleSummary: "ข้อมูลบริษัทและความสามารถรอยืนยันจากเจ้าของ.", image: "รูปตัวอย่าง · บริษัทไม่ได้จัดหา", link: "เกี่ยวกับเรา ↗" },
  nl: { eyebrow: "OVER ONS · VOORBEELD", sampleTitle: <>Samen groeien<br/>met telers.</>, sampleSummary: "De presentatie en mogelijkheden van het bedrijf moeten nog worden bevestigd.", image: "Voorbeeldafbeelding · niet door het bedrijf geleverd", link: "Over ons ↗" },
  ro: { eyebrow: "DESPRE NOI · PREVIZUALIZARE", sampleTitle: <>Creștem împreună<br/>cu cultivatorii.</>, sampleSummary: "Prezentarea și capacitățile companiei așteaptă confirmarea.", image: "Imagine demonstrativă · nefurnizată de companie", link: "Despre noi ↗" },
  el: { eyebrow: "ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ · ΠΡΟΕΠΙΣΚΟΠΗΣΗ", sampleTitle: <>Μεγαλώνουμε μαζί<br/>με τους καλλιεργητές.</>, sampleSummary: "Η παρουσίαση και οι δυνατότητες της εταιρείας χρειάζονται επιβεβαίωση.", image: "Ενδεικτική εικόνα · δεν παρέχεται από την εταιρεία", link: "Σχετικά με εμάς ↗" },
  he: { eyebrow: "אודות · תצוגה מקדימה", sampleTitle: <>צומחים יחד<br/>עם המגדלים.</>, sampleSummary: "הצגת החברה ויכולותיה ממתינות לאישור.", image: "תמונת דוגמה · לא סופקה על ידי החברה", link: "אודות ↗" },
});

export function HomeCompanyStory({ locale, profile }: { locale: CatalogPageLocale; profile: CompanyProfile }) {
  const text = homeCompanyStoryMessages[locale], pending = aboutMessages[locale].pending;
  return <section className="story"><div className="story-art">{profile.banner ? <img className="story-image" src={profile.banner.src} alt={profile.banner.alt ?? ""} loading="lazy"/> : <span className="story-media-note">{text.image}</span>}</div><div className="story-copy"><span className="eyebrow">{text.eyebrow}</span><h2>{profile.source === "sample" ? text.sampleTitle : profile.title ?? pending}</h2><p>{profile.source === "sample" ? text.sampleSummary : profile.summary ?? pending}</p><Link className="button green" href={`/${locale}/about`}>{text.link}</Link></div></section>;
}
