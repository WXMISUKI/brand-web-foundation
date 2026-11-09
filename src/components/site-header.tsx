import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { navigationDetail } from "../i18n/navigation-detail";
import { NavigationMenu } from "./navigation-menu";
import { MobileMenu } from "./mobile-menu";
import { LanguageMenu } from "./language-menu";
import { SearchLink } from "./search-link";
import { hasPreviewCounterpart } from "../i18n/preview-routes";

export function SiteHeader({ locale, alternatePath, previewAllLocales = false }: { locale: CatalogPageLocale; alternatePath: string; previewAllLocales?: boolean }) {
  const copy = navigationDetail[locale];
  const previewCounterpart = process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production" && hasPreviewCounterpart(alternatePath);
  const frenchPreview = previewCounterpart, spanishPreview = previewCounterpart;
  const preview = process.env.CATALOG_SOURCE === "payload" ? copy.preview : copy.samplePreview;
  const previewBanner = process.env.SHOW_PREVIEW_BANNER === "1" ? <div className="preview">{preview}{locale === "es" && " · Solo disponible en desarrollo"}</div> : null;
  const signatureLinks = <>
    <Link className="header-signature-link" href={`/${locale}/about#company-focus`}>COMPASSion</Link>
    <Link className="header-signature-link" href={`/${locale}/sustainability`}>Precision <span>IMPACT</span></Link>
  </>;
  const mobileHeaderTools = <div className="mobile-header-tools"><LanguageMenu locale={locale} alternatePath={alternatePath} frenchPreview={frenchPreview} spanishPreview={spanishPreview} previewAllLocales={previewAllLocales}/><SearchLink locale={locale}/></div>;
  if (locale === "es") return <>{previewBanner}<header className="header"><nav className="nav left" aria-label={copy.main}><NavigationMenu locale={locale} kind="crops"/><NavigationMenu locale={locale} kind="products"/><NavigationMenu locale={locale} kind="solutions"/><NavigationMenu locale={locale} kind="tools"/></nav><Link className="brand" href="/es" aria-label={copy.home}><span className="brand-mark" aria-hidden="true">✳</span><strong>KOMU</strong><small>PLANT NUTRITION</small></Link><nav className="nav right" aria-label={copy.more}>{signatureLinks}<NavigationMenu locale={locale} kind="corporate"/><NavigationMenu locale={locale} kind="insights"/><SearchLink locale={locale}/><LanguageMenu locale={locale} alternatePath={alternatePath} frenchPreview={frenchPreview} previewAllLocales={previewAllLocales}/></nav><MobileMenu locale={locale} alternatePath={alternatePath} frenchPreview={frenchPreview} previewAllLocales={previewAllLocales}/>{mobileHeaderTools}</header></>;
  return <>{previewBanner}<header className="header">
    <nav className="nav left" aria-label={copy.main}>
      <NavigationMenu locale={locale} kind="crops"/><NavigationMenu locale={locale} kind="products"/><NavigationMenu locale={locale} kind="solutions"/><NavigationMenu locale={locale} kind="tools"/>
    </nav>
    <Link className="brand" href={`/${locale}`} aria-label={copy.home}><span className="brand-mark" aria-hidden="true">✳</span><strong>KOMU</strong><small>PLANT NUTRITION</small></Link>
    <nav className="nav right" aria-label={copy.more}>
      {signatureLinks}<NavigationMenu locale={locale} kind="corporate"/><NavigationMenu locale={locale} kind="insights"/><SearchLink locale={locale}/><LanguageMenu locale={locale} alternatePath={alternatePath} frenchPreview={frenchPreview} spanishPreview={spanishPreview}/>
    </nav>
    <MobileMenu locale={locale} alternatePath={alternatePath} frenchPreview={frenchPreview} spanishPreview={spanishPreview} previewAllLocales={previewAllLocales}/>{mobileHeaderTools}
  </header></>;
}
