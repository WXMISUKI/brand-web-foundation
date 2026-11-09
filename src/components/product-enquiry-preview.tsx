import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { aboutMessages } from "../i18n/about-messages";
import { productDetailMessages } from "../i18n/product-detail-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";
import { siteContact } from "../data/site-contact";

const messages = completeLocaleMap({
  en: { dealer: "Distribution enquiries", name: "Full name", country: "Country", phone: "Phone", email: "Email", role: "Your expertise", consent: "I agree to receive information by email", send: "Send", status: "Contact the KOMU team by email or WhatsApp." },
  zh: { dealer: "经销合作咨询", name: "姓名", country: "国家或地区", phone: "电话", email: "电子邮箱", role: "您的行业", consent: "我同意通过电子邮件接收资讯", send: "发送", status: "可通过邮箱或 WhatsApp 联系康姆团队。" },
  fr: { dealer: "Trouver un distributeur · À venir", name: "Nom complet", country: "Pays", phone: "Téléphone", email: "Adresse e-mail", role: "Votre domaine", consent: "J’accepte de recevoir des informations par e-mail", send: "Envoyer", status: "Aperçu uniquement. Ce formulaire ne reçoit pas encore de demandes." },
  es: { dealer: "Buscar distribuidor · Próximamente", name: "Nombre completo", country: "País", phone: "Teléfono", email: "Correo electrónico", role: "Tu actividad", consent: "Acepto recibir información por correo electrónico", send: "Enviar", status: "Solo vista previa. El formulario aún no recibe consultas." },
});

export function ProductEnquiryPreview({ locale }: { locale: CatalogPageLocale }) {
  const copy = messages[locale];
  return <aside className="detail-contact product-enquiry">
    <div className="detail-dealer">{copy.dealer}</div>
    <div className="detail-contact-panel">
      <h2>{productDetailMessages[locale].enquiries}</h2>
      <p id="product-enquiry-status">{copy.status}</p>
      <div className="product-contact-actions"><a className="button green" href={`mailto:${siteContact.email}`}>{siteContact.email}</a><a className="text-link" href={siteContact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp {siteContact.whatsapp} ↗</a></div>
      <Link href={`/${locale}/contact`}>{aboutMessages[locale].contact} ↗</Link>
    </div>
  </aside>;
}
