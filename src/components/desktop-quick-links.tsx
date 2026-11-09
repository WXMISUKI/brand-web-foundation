"use client";

import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const labels = completeLocaleMap({
  en: { navigation: "Quick links", accessibility: "Accessibility options", contact: "Contact", distributor: "Distributors", partner: "Partner area", pending: "Coming later" },
  zh: { navigation: "快捷入口", accessibility: "无障碍选项", contact: "联系我们", distributor: "经销商", partner: "合作伙伴", pending: "待接入" },
  fr: { navigation: "Liens rapides", accessibility: "Options d’accessibilité", contact: "Contact", distributor: "Distributeurs", partner: "Espace partenaire", pending: "À venir" },
  es: { navigation: "Enlaces rápidos", accessibility: "Opciones de accesibilidad", contact: "Contacto", distributor: "Distribuidores", partner: "Socios", pending: "Pendiente" },
});

export function DesktopQuickLinks({ locale }: { locale: CatalogPageLocale }) {
  const c = labels[locale];
  return <nav className="desktop-quick-links" aria-label={c.navigation}>
    <button className="desktop-accessibility" type="button" disabled aria-label={`${c.accessibility} · ${c.pending}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.8"/><path d="M5 9.5h14M12 9.5v9M8 21l4-6 4 6M8 9.5l-2 6M16 9.5l2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span>{c.accessibility}</span><small>{c.pending}</small>
    </button>
    <Link href={`/${locale}/contact`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>{c.contact}</Link>
    <div role="note" aria-label={`${c.distributor} · ${c.pending}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg><strong>{c.distributor}</strong><small>{c.pending}</small></div>
    <div role="note" aria-label={`${c.partner} · ${c.pending}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg><strong>{c.partner}</strong><small>{c.pending}</small></div>
  </nav>;
}
