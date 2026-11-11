"use client";

import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const labels = completeLocaleMap({
  en: { navigation: "Quick links", accessibility: "Accessibility options", contact: "Contact", distributor: "Distributors", partner: "Partner area", pending: "Coming later" },
  zh: { navigation: "快捷入口", accessibility: "无障碍选项", contact: "联系我们", distributor: "经销商", partner: "合作伙伴", pending: "待接入" },
  fr: { navigation: "Liens rapides", accessibility: "Options d’accessibilité", contact: "Contact", distributor: "Distributeurs", partner: "Espace partenaire", pending: "À venir" },
  es: { navigation: "Enlaces rápidos", accessibility: "Opciones de accesibilidad", contact: "Contacto", distributor: "Distribuidores", partner: "Socios", pending: "Pendiente" },
  pt: { navigation: "Links rápidos", accessibility: "Opções de acessibilidade", contact: "Contacto", distributor: "Distribuidores", partner: "Área de parceiros", pending: "Em breve" },
  ru: { navigation: "Быстрые ссылки", accessibility: "Параметры доступности", contact: "Контакты", distributor: "Дистрибьюторы", partner: "Раздел для партнёров", pending: "Скоро" },
  it: { navigation: "Link rapidi", accessibility: "Opzioni di accessibilità", contact: "Contatti", distributor: "Distributori", partner: "Area partner", pending: "In arrivo" },
  tr: { navigation: "Hızlı bağlantılar", accessibility: "Erişilebilirlik seçenekleri", contact: "İletişim", distributor: "Distribütörler", partner: "İş ortağı alanı", pending: "Yakında" },
  th: { navigation: "ลิงก์ด่วน", accessibility: "ตัวเลือกการช่วยการเข้าถึง", contact: "ติดต่อเรา", distributor: "ผู้จัดจำหน่าย", partner: "พื้นที่พันธมิตร", pending: "เร็ว ๆ นี้" },
  nl: { navigation: "Snelle links", accessibility: "Toegankelijkheidsopties", contact: "Contact", distributor: "Distributeurs", partner: "Partneromgeving", pending: "Binnenkort" },
  ro: { navigation: "Linkuri rapide", accessibility: "Opțiuni de accesibilitate", contact: "Contact", distributor: "Distribuitori", partner: "Zona partenerilor", pending: "În curând" },
  el: { navigation: "Γρήγοροι σύνδεσμοι", accessibility: "Επιλογές προσβασιμότητας", contact: "Επικοινωνία", distributor: "Διανομείς", partner: "Χώρος συνεργατών", pending: "Σύντομα" },
  he: { navigation: "קישורים מהירים", accessibility: "אפשרויות נגישות", contact: "צרו קשר", distributor: "מפיצים", partner: "אזור שותפים", pending: "בקרוב" },
});

export function DesktopQuickLinks({ locale }: { locale: CatalogPageLocale }) {
  const c = labels[locale];
  return <nav className="desktop-quick-links" aria-label={c.navigation}>
    <Link className="desktop-quick-link" href={`/${locale}/contact`}><span className="desktop-quick-link-icon"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="desktop-quick-link-label">{c.contact}</span></Link>
  </nav>;
}
