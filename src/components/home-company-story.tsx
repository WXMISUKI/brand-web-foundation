import Link from "next/link";
import type { CompanyProfile } from "../content/company-profile";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const copy = completeLocaleMap({
  en: { eyebrow: "ABOUT US", sampleTitle: <>Growing together<br/>with growers.</>, sampleSummary: "Anhui Kangmu International Fertilizer Co., Ltd. · KOMU plant nutrition", image: "KOMU plant nutrition", link: "About us ↗" },
  zh: { eyebrow: "关于我们", sampleTitle: <>理解土地，<br/>也理解种植者。</>, sampleSummary: "安徽康母国际化肥股份有限公司 · 康姆植物营养", image: "康姆植物营养", link: "了解我们 ↗" },
  fr: { eyebrow: "À PROPOS · APERÇU", sampleTitle: <>Grandir ensemble<br/>avec les cultivateurs.</>, sampleSummary: "La présentation et les capacités de l’entreprise restent à confirmer.", image: "Image d’exemple · non fournie par l’entreprise", link: "À propos ↗" },
  es: { eyebrow: "QUIÉNES SOMOS · VISTA PREVIA", sampleTitle: <>Crecer junto a<br/>los agricultores.</>, sampleSummary: "La información y las capacidades de la empresa están pendientes de confirmación.", image: "Imagen de ejemplo · no facilitada por la empresa", link: "Quiénes somos ↗" },
});

export function HomeCompanyStory({ locale, profile }: { locale: CatalogPageLocale; profile: CompanyProfile }) {
  const text = copy[locale], pending = aboutMessages[locale].pending;
  return <section className="story"><div className="story-art">{profile.banner ? <img className="story-image" src={profile.banner.src} alt={profile.banner.alt ?? ""} loading="lazy"/> : <span className="story-media-note">{text.image}</span>}</div><div className="story-copy"><span className="eyebrow">{text.eyebrow}</span><h2>{profile.source === "sample" ? text.sampleTitle : profile.title ?? pending}</h2><p>{profile.source === "sample" ? text.sampleSummary : profile.summary ?? pending}</p><Link className="button green" href={`/${locale}/about`}>{text.link}</Link></div></section>;
}
