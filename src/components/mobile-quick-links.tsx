import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const labels = completeLocaleMap({
  en: { navigation: "Quick links", contact: "Contact us", distributor: "Distributor", partner: "Partner Zone", pending: "Coming later" },
  zh: { navigation: "快捷入口", contact: "联系我们", distributor: "经销商", partner: "合作伙伴", pending: "待接入" },
  fr: { navigation: "Liens rapides", contact: "Nous contacter", distributor: "Distributeur", partner: "Espace partenaire", pending: "À venir" },
  es: { navigation: "Enlaces rápidos", contact: "Contacto", distributor: "Distribuidor", partner: "Zona de socios", pending: "Pendiente" },
  pt: { navigation: "Links rápidos", contact: "Contacte-nos", distributor: "Distribuidor", partner: "Área de parceiros", pending: "Em breve" },
  ru: { navigation: "Быстрые ссылки", contact: "Связаться с нами", distributor: "Дистрибьютор", partner: "Раздел для партнёров", pending: "Скоро" },
  it: { navigation: "Link rapidi", contact: "Contattaci", distributor: "Distributore", partner: "Area partner", pending: "In arrivo" },
  tr: { navigation: "Hızlı bağlantılar", contact: "Bize ulaşın", distributor: "Distribütör", partner: "İş ortağı alanı", pending: "Yakında" },
  th: { navigation: "ลิงก์ด่วน", contact: "ติดต่อเรา", distributor: "ผู้จัดจำหน่าย", partner: "พื้นที่พันธมิตร", pending: "เร็ว ๆ นี้" },
  nl: { navigation: "Snelle links", contact: "Neem contact op", distributor: "Distributeur", partner: "Partneromgeving", pending: "Binnenkort" },
  ro: { navigation: "Linkuri rapide", contact: "Contactați-ne", distributor: "Distribuitor", partner: "Zona partenerilor", pending: "În curând" },
  el: { navigation: "Γρήγοροι σύνδεσμοι", contact: "Επικοινωνήστε μαζί μας", distributor: "Διανομέας", partner: "Χώρος συνεργατών", pending: "Σύντομα" },
  he: { navigation: "קישורים מהירים", contact: "צרו קשר", distributor: "מפיץ", partner: "אזור שותפים", pending: "בקרוב" },
});

export function MobileQuickLinks({ locale, preview = false }: { locale: CatalogPageLocale; preview?: boolean }) {
  const copy = labels[locale], prefix = `/${locale}`;
  return <nav className="mobile-quick-links" data-locale-preview={preview || undefined} aria-label={copy.navigation}>
    <Link href={`${prefix}/contact`}><span aria-hidden="true">✉</span>{copy.contact}</Link>
  </nav>;
}
