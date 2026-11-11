import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { getLocale, isPublicLocale, type LocaleCode, type PublicLocale } from "../i18n/locales";
import type { CatalogUiLocale } from "../i18n/catalog-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { DesktopQuickLinks } from "./desktop-quick-links";
import { sharedUiMessages } from "../i18n/shared-ui-messages";
import { ContactCallout } from "./home-newsletter";

export function previewLocale(code: string): PublicLocale {
  if (isPublicLocale(code)) return code;
  notFound();
}
export function readyLocale(code: string): CatalogUiLocale {
  if (isPublicLocale(code) || (code === "fr" && process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production")) return code;
  notFound();
}
/** All configured locales are public after the owner-approved release. */
export function readyLayoutLocale(code: string): LocaleCode {
  const locale = getLocale(code);
  if (!locale) notFound();
  if (isPublicLocale(code) || (process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production")) return locale.code;
  notFound();
}
/** About is available for every configured locale with safe English fallback. */
export function readyAboutLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** Products are available for every configured locale with safe English fallback. */
export function readyProductsLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** FAQ, contact and search are available for every configured locale. */
export function readyInformationLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** News, insights and cases are available for every configured locale. */
export function readyEditorialLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** Growing solutions and crop guides are available for every configured locale. */
export function readySolutionsLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** The homepage is available for every configured locale. */
export function readyHomeLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** Resource pages are available for every configured locale. */
export function readyResourcesLocale(code: string): LocaleCode {
  return readyLayoutLocale(code);
}
/** Spanish catalog pages use the same public route guard as other locales. */
export function readyCatalogLocale(code: string): CatalogPageLocale {
  if (code === "es" && process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production") return code;
  return readyLocale(code);
}

export function LocalizedShell({ locale, alternatePath, children, previewAllLocales = false }: { locale: CatalogPageLocale; alternatePath: string; children: ReactNode; previewAllLocales?: boolean }) {
  const skip = sharedUiMessages[locale].skip;
  return <><a className="skip-link" href="#main-content">{skip}</a><SiteHeader locale={locale} alternatePath={alternatePath} previewAllLocales={previewAllLocales}/><div id="main-content" tabIndex={-1}>{children}</div><ContactCallout locale={locale}/><SiteFooter locale={locale}/><DesktopQuickLinks locale={locale}/></>;
}
