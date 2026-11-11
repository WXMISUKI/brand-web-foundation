import Link from "next/link";
import type { CompanyProfile } from "../content/company-profile";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

export const homeCompanyFocusMessages = completeLocaleMap({
  en: { heading: "Our focus", sample: "KOMU plant nutrition", preview: "Company focus", image: "KOMU plant nutrition", pending: "Information unavailable", details: "Explore our company ↗" },
  zh: { heading: "我们的关注重点", sample: "康姆植物营养", preview: "企业重点", image: "康姆植物营养", pending: "资料暂未提供", details: "了解企业 ↗" },
  fr: { heading: "Nos priorités", sample: "Sujets d’exemple · à confirmer", preview: "Priorités de l’entreprise · aperçu", image: "Image de fond d’exemple · non fournie par l’entreprise", pending: "Contenu ou traduction à compléter", details: "Découvrir l’entreprise ↗" },
  es: { heading: "Nuestras prioridades", sample: "Temas de ejemplo · pendientes de confirmación", preview: "Prioridades de la empresa · vista previa", image: "Fondo de ejemplo · no facilitado por la empresa", pending: "Contenido o traducción pendiente", details: "Conocer la empresa ↗" },
  pt: { heading: "As nossas prioridades", sample: "Temas de exemplo · por confirmar", preview: "Prioridades da empresa · pré-visualização", image: "Fundo de exemplo · não fornecido pela empresa", pending: "Conteúdo ou tradução pendente", details: "Conheça a empresa ↗" },
  ru: { heading: "Наши приоритеты", sample: "Примеры тем · требуют подтверждения", preview: "Приоритеты компании · предпросмотр", image: "Пример фона · не предоставлен компанией", pending: "Контент или перевод требуют подтверждения", details: "Узнать о компании ↗" },
  it: { heading: "Le nostre priorità", sample: "Temi di esempio · da confermare", preview: "Priorità aziendali · anteprima", image: "Sfondo di esempio · non fornito dall’azienda", pending: "Contenuto o traduzione da completare", details: "Scopri l’azienda ↗" },
  tr: { heading: "Önceliklerimiz", sample: "Örnek konular · onay bekliyor", preview: "Şirket öncelikleri · önizleme", image: "Örnek arka plan · şirket tarafından sağlanmadı", pending: "İçerik veya çeviri onay bekliyor", details: "Şirketi keşfedin ↗" },
  th: { heading: "จุดเน้นของเรา", sample: "หัวข้อตัวอย่าง · รอยืนยัน", preview: "จุดเน้นของบริษัท · ตัวอย่าง", image: "พื้นหลังตัวอย่าง · บริษัทไม่ได้จัดหา", pending: "เนื้อหาหรือคำแปลรอการยืนยัน", details: "รู้จักบริษัท ↗" },
  nl: { heading: "Onze aandachtspunten", sample: "Voorbeeldonderwerpen · moeten nog worden bevestigd", preview: "Aandachtspunten van het bedrijf · voorbeeld", image: "Voorbeeldachtergrond · niet door het bedrijf geleverd", pending: "Inhoud of vertaling moet nog worden bevestigd", details: "Ontdek ons bedrijf ↗" },
  ro: { heading: "Prioritățile noastre", sample: "Teme demonstrative · de confirmat", preview: "Prioritățile companiei · previzualizare", image: "Fundal demonstrativ · nefurnizat de companie", pending: "Conținut sau traducere în așteptare", details: "Descoperiți compania ↗" },
  el: { heading: "Οι προτεραιότητές μας", sample: "Ενδεικτικά θέματα · προς επιβεβαίωση", preview: "Προτεραιότητες εταιρείας · προεπισκόπηση", image: "Ενδεικτικό φόντο · δεν παρέχεται από την εταιρεία", pending: "Το περιεχόμενο ή η μετάφραση χρειάζονται επιβεβαίωση", details: "Γνωρίστε την εταιρεία ↗" },
  he: { heading: "ההתמקדות שלנו", sample: "נושאי דוגמה · ממתינים לאישור", preview: "מוקדי החברה · תצוגה מקדימה", image: "רקע לדוגמה · לא סופק על ידי החברה", pending: "התוכן או התרגום ממתינים לאישור", details: "הכירו את החברה ↗" },
});

export function HomeCompanyFocus({ locale, profile }: { locale: CatalogPageLocale; profile: CompanyProfile }) {
  const copy = homeCompanyFocusMessages[locale];
  const items = Array.from({ length: 3 }, (_, index) => profile.focusAreas[index] ?? { id: `pending-${index}`, title: null, description: null });
  return <section className="home-company-focus" aria-labelledby="company-focus-title">{profile.banner && <img className="home-company-focus-background" src={profile.banner.src} alt="" aria-hidden="true" loading="lazy"/>}<div className="home-section-heading"><span className="eyebrow">KOMU</span><h2 id="company-focus-title">{copy.heading}</h2></div><div className="home-company-focus-grid">{items.map((item, index) => <article key={item.id} className="home-company-focus-card"><span aria-hidden="true" className="home-company-focus-number">{String(index + 1).padStart(2, "0")}</span><h3>{item.title ?? copy.pending}</h3><p>{item.description ?? copy.pending}</p><Link href={`/${locale}/about`}>{copy.details}</Link></article>)}</div>{!profile.banner && <p className="home-company-focus-image-note">{copy.image}</p>}</section>;
}
