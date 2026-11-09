import Link from "next/link";
import type { CompanyProfile } from "../content/company-profile";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const messages = completeLocaleMap({
  en: { heading: "Our focus", sample: "KOMU plant nutrition", preview: "Company focus", image: "KOMU plant nutrition", pending: "Information unavailable", details: "Explore our company ↗" },
  zh: { heading: "我们的关注重点", sample: "康姆植物营养", preview: "企业重点", image: "康姆植物营养", pending: "资料暂未提供", details: "了解企业 ↗" },
  fr: { heading: "Nos priorités", sample: "Sujets d’exemple · à confirmer", preview: "Priorités de l’entreprise · aperçu", image: "Image de fond d’exemple · non fournie par l’entreprise", pending: "Contenu ou traduction à compléter", details: "Découvrir l’entreprise ↗" },
  es: { heading: "Nuestras prioridades", sample: "Temas de ejemplo · pendientes de confirmación", preview: "Prioridades de la empresa · vista previa", image: "Fondo de ejemplo · no facilitado por la empresa", pending: "Contenido o traducción pendiente", details: "Conocer la empresa ↗" },
});

export function HomeCompanyFocus({ locale, profile }: { locale: CatalogPageLocale; profile: CompanyProfile }) {
  const copy = messages[locale];
  const items = Array.from({ length: 3 }, (_, index) => profile.focusAreas[index] ?? { id: `pending-${index}`, title: null, description: null });
  return <section className="home-company-focus" aria-labelledby="company-focus-title">{profile.banner && <img className="home-company-focus-background" src={profile.banner.src} alt="" aria-hidden="true" loading="lazy"/>}<div className="home-section-heading"><span className="eyebrow">{profile.source === "sample" ? copy.sample : copy.preview}</span><h2 id="company-focus-title">{copy.heading}</h2></div><div className="home-company-focus-grid">{items.map((item, index) => <article key={item.id} className="home-company-focus-card"><span aria-hidden="true" className="home-company-focus-number">{String(index + 1).padStart(2, "0")}</span><h3>{item.title ?? copy.pending}</h3><p>{item.description ?? copy.pending}</p><Link href={`/${locale}/about`}>{copy.details}</Link></article>)}</div>{!profile.banner && <p className="home-company-focus-image-note">{copy.image}</p>}</section>;
}
