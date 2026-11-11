import Link from "next/link";
import { getSiteCategories } from "../content/site-catalog";
import { getCompanyProfile } from "../content/company-profile";
import { footerMessages } from "../i18n/footer-messages";
import { navigationDetail } from "../i18n/navigation-detail";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { resourceMessages } from "./product-resources";
import { siteContact } from "../data/site-contact";

export async function SiteFooter({ locale }: { locale: CatalogPageLocale }) {
  const copy = footerMessages[locale], common = aboutMessages[locale], base = `/${locale}`;
  const [categories, profile] = await Promise.all([getSiteCategories(locale), getCompanyProfile(locale)]);
  const summary = profile.source === "sample" ? copy.summary : profile.summary ?? common.pending;
  if (locale === "es") return <footer className="site-footer"><div className="site-footer-main"><div className="site-footer-brand"><Link href="/es" aria-label={`KOMU PLANT NUTRITION — ${navigationDetail.es.home}`}><span aria-hidden="true">✳</span><strong>KOMU</strong>{" "}<small>PLANT NUTRITION</small></Link><p>{summary}</p></div><nav className="site-footer-nav" aria-label={copy.navigation}><div><h2>{copy.products}</h2><Link href="/es/products">{copy.catalog}</Link><Link href="/es/faq">{copy.faq}</Link><Link href="/es/sds-request">{resourceMessages.es.sds}</Link><Link href="/es/quality-assurance">{resourceMessages.es.quality}</Link><Link href="/es/smart-farming">{copy.smart}</Link>{categories.map(category=><Link href={`/es/products?category=${encodeURIComponent(category.slug)}`} key={category.slug}>{category.name ?? common.pending}</Link>)}</div><div><h2>{copy.about}</h2><Link href="/es/about">{copy.company}</Link><Link href="/es/insights">{copy.insights}</Link><Link href="/es/cases">{copy.stories}</Link><Link href="/es/news">{copy.news}</Link><Link href="/es/contact">{copy.contact}</Link></div></nav></div><div className="site-footer-bottom"><span>{copy.legal}</span></div></footer>;
  return <footer className="site-footer"><div className="site-footer-main">
    <div className="site-footer-brand"><Link href={base} aria-label={`KOMU PLANT NUTRITION — ${navigationDetail[locale].home}`}><span aria-hidden="true">✳</span><strong>KOMU</strong>{" "}<small>PLANT NUTRITION</small></Link><p>{summary}</p><address className="site-footer-contact"><strong>{profile.contact.companyName ?? (locale === "zh" ? siteContact.companyName.zh : siteContact.companyName.en)}</strong><a href={`mailto:${profile.contact.email ?? siteContact.email}`}>{profile.contact.email ?? siteContact.email}</a><a href={siteContact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp {profile.contact.whatsapp ?? siteContact.whatsapp}</a></address></div>
    <nav className="site-footer-nav" aria-label={copy.navigation}>
      <div><h2>{copy.products}</h2><Link href={`${base}/products`}>{copy.catalog}</Link><Link href={`${base}/faq`}>{copy.faq}</Link><Link href={`${base}/sds-request`}>{resourceMessages[locale].sds}</Link><Link href={`${base}/quality-assurance`}>{resourceMessages[locale].quality}</Link>{categories.map(category=><Link href={`${base}/products?category=${encodeURIComponent(category.slug)}`} key={category.slug}>{category.name ?? common.pending}</Link>)}</div>
      <div><h2>{copy.solutions}</h2><Link href={`${base}/solutions/greenhouse`}>{copy.greenhouse}</Link><Link href={`${base}/solutions/vegetables`}>{copy.vegetables}</Link><Link href={`${base}/solutions/fruit-trees`}>{copy.fruit}</Link></div>
      <div><h2>{copy.tools}</h2><Link href={`${base}/smart-farming`}>{copy.smart}</Link><Link href={`${base}/insights`}>{copy.insights}</Link><Link href={`${base}/cases`}>{copy.stories}</Link></div>
      <div><h2>{copy.about}</h2><Link href={`${base}/about`}>{copy.company}</Link><Link href={`${base}/news`}>{copy.news}</Link><Link href={`${base}/contact`}>{copy.contact}</Link></div>
    </nav>
  </div><div className="site-footer-bottom"><span>{copy.legal}</span><Link href={`${base}/contact`}>{copy.contactPending}</Link></div></footer>;
}
