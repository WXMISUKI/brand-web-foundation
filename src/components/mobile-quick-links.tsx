import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const labels = completeLocaleMap({
  en: { navigation: "Quick links", contact: "Contact us", distributor: "Distributor", partner: "Partner Zone", pending: "Coming later" },
  zh: { navigation: "快捷入口", contact: "联系我们", distributor: "经销商", partner: "合作伙伴", pending: "待接入" },
  fr: { navigation: "Liens rapides", contact: "Nous contacter", distributor: "Distributeur", partner: "Espace partenaire", pending: "À venir" },
  es: { navigation: "Enlaces rápidos", contact: "Contacto", distributor: "Distribuidor", partner: "Zona de socios", pending: "Pendiente" },
});

export function MobileQuickLinks({ locale, preview = false }: { locale: CatalogPageLocale; preview?: boolean }) {
  const copy = labels[locale], prefix = `/${locale}`;
  return <nav className="mobile-quick-links" data-locale-preview={preview || undefined} aria-label={copy.navigation}>
    <Link href={`${prefix}/contact`}><span aria-hidden="true">✉</span>{copy.contact}</Link>
    <div><span aria-hidden="true">⌖</span><strong>{copy.distributor}</strong><small>{copy.pending}</small></div>
    <div><span aria-hidden="true">◇</span><strong>{copy.partner}</strong><small>{copy.pending}</small></div>
  </nav>;
}
