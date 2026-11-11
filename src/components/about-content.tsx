import Link from "next/link";
import { getCompanyProfile } from "../content/company-profile";
import { aboutMessages } from "../i18n/about-messages";
import type { LocaleCode } from "../i18n/locales";

export async function AboutContent({ locale }: { locale: LocaleCode }) {
  const profile = await getCompanyProfile(locale);
  const copy = aboutMessages[locale];
  return <main>
    <div className="about-banner-wrap"><div className="about-banner company-banner">{profile.banner && <img className="company-banner-image" src={profile.banner.src} alt={profile.banner.alt ?? ""} />}<span>KOMU</span><p>{copy.banner}</p>{!profile.banner && <small>{copy.sampleImage}</small>}</div></div>
    <div className="inner about-page"><nav className="crumb" aria-label={copy.breadcrumb}><Link href={locale === "es" ? "/es/products" : `/${locale}`}>{locale === "es" ? "Catálogo de productos" : copy.home}</Link> / {copy.about}</nav>
      <section className="about-introduction"><h1>{profile.title ?? copy.pending}</h1><p className="about-lead">{profile.summary ?? copy.pending}</p><p className="company-description">{profile.description ?? copy.pending}</p></section>
      <section className="about-themes" aria-labelledby="themes-title"><h2 id="themes-title">{copy.focus}{profile.source === "sample" && ` · ${copy.sample}`}</h2>{profile.focusAreas.length ? <div className="about-theme-grid">{profile.focusAreas.map((area,index)=><article key={area.id}><span className="about-theme-number">{String(index + 1).padStart(2, "0")}</span><h3>{area.title ?? copy.pending}</h3><p>{area.description ?? copy.pending}</p></article>)}</div> : <p>{copy.pending}</p>}</section>
      <section className="about-history" aria-labelledby="history-title"><div className="history-heading"><span className="eyebrow">{copy.journey}</span><h2 id="history-title">{copy.journey}</h2></div>{profile.milestones.length ? <ol className="history-timeline">{profile.milestones.map(milestone => <li key={milestone.id}><span className="history-period">{milestone.period ?? copy.pending}</span><article className="history-card">{milestone.image && <img src={milestone.image.src} alt={milestone.image.alt ?? milestone.title ?? ""} loading="lazy" />}<div><h3>{milestone.title ?? copy.pending}</h3><p>{milestone.description ?? copy.pending}</p></div></article></li>)}</ol> : <div className="history-placeholder"><span aria-hidden="true">●</span><div><strong>{copy.noMilestones}</strong><p>{copy.contact}</p></div></div>}</section>
      <div className="about-contact-link"><Link className="button green" href={`/${locale}/contact`}>{copy.contact} <span aria-hidden="true">↗</span></Link></div>
    </div>
  </main>;
}
