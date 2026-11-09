import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { navigationDetail } from "../i18n/navigation-detail";

export function SearchLink({ locale }: { locale: CatalogPageLocale }) {
  const label = navigationDetail[locale].search;
  const icon = <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  return <><form className="header-search-form" action={`/${locale}/search`} role="search"><input type="search" name="q" maxLength={100} aria-label={label}/><button type="submit" aria-label={label}>{icon}</button></form><Link className="header-search-link" href={`/${locale}/search`} aria-label={label}>{icon}</Link></>;
}
