import Link from "next/link";
import { aboutMessages } from "../i18n/about-messages";
import { contactMessages } from "../i18n/contact-messages";
import type { LocaleCode } from "../i18n/locales";
import type { CompanyProfile } from "../content/company-profile";
import { siteContact } from "../data/site-contact";
import { InquiryForm } from "./inquiry-form";

export function ContactContent({ locale, profile }: { locale: LocaleCode; profile: CompanyProfile }) {
  const copy = contactMessages[locale], common = aboutMessages[locale], prefix = `/${locale}`;
  const contact = profile.contact;
  const email = contact.email ?? siteContact.email;
  const whatsapp = contact.whatsapp ?? siteContact.whatsapp;
  const inquiryNote = locale === "zh" ? "询盘会记录给康姆团队处理；邮箱和 WhatsApp 仍可直接联系。" : "Enquiries are recorded for the KOMU team; email and WhatsApp remain available.";
  const inquiryHeading = locale === "zh" ? "发送询盘" : "Send an enquiry";
  const inquiryIntro = locale === "zh" ? "请说明关注的产品和目标市场，询盘会记录给康姆团队处理。" : "Share the product and market you are interested in. Your enquiry will be recorded for the KOMU team.";
  const companyLabel = locale === "zh" ? "企业名称" : locale === "fr" ? "Entreprise" : locale === "es" ? "Empresa" : "Company";
  return <main><div className="about-banner-wrap"><div className="about-banner contact-banner"><span>{common.contact} · {common.sample}</span><h1>{common.contact}</h1><small>{common.sampleImage}</small></div></div>
    <div className="inner contact-page"><nav className="crumb" aria-label={common.breadcrumb}><Link href={locale === "es" ? "/es/products" : prefix}>{locale === "es" ? "Catálogo de productos" : common.home}</Link> / {common.contact}</nav>
      <div className="contact-layout"><section className="contact-intro"><span className="eyebrow">{common.contact}</span><h2>{copy.heading}</h2><p>{copy.intro}</p><div className="contact-details"><h3>{copy.information}</h3><dl><div><dt>{companyLabel}</dt><dd>{contact.companyName ?? common.pending}</dd></div><div><dt>{copy.email}</dt><dd>{contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : common.pending}</dd></div><div><dt>{copy.phone}</dt><dd>{contact.whatsapp ? <a href={siteContact.whatsappHref} target="_blank" rel="noreferrer">{contact.whatsapp}</a> : common.pending}</dd></div><div><dt>{copy.address}</dt><dd>{contact.address ?? (locale === "zh" ? "地址可按需提供" : "Address available on request")}</dd></div></dl></div><Link className="text-link" href={`${prefix}/products`}>{copy.products} ↗</Link></section>
        <section className="contact-preview" aria-labelledby="contact-preview-title"><h2 id="contact-preview-title">{inquiryHeading}</h2><p>{inquiryIntro}</p><InquiryForm locale={locale} sourcePath={`${prefix}/contact`} /><div className="contact-actions"><a className="button white" href={`mailto:${email}`}>{email}</a><a className="button white" href={siteContact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp {whatsapp}</a></div><small>{inquiryNote}</small></section>
      </div>
    </div>
  </main>;
}
