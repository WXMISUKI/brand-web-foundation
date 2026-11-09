import { headers } from "next/headers";
import { locales } from "../i18n/locales";

/**
 * Publish every owner-approved language counterpart. CMS preview routes
 * deliberately receive no alternate links.
 */
export async function AlternateLinks({ fallbackPath = "/en" }: { fallbackPath?: string }) {
  const requestHeaders = await headers();
  const forwardedUri = requestHeaders.get("x-forwarded-uri")?.split("?", 1)[0];
  const path = forwardedUri && forwardedUri.startsWith("/") ? forwardedUri : fallbackPath;
  const codes = locales.map(locale => locale.code).join("|");
  const match = path.match(new RegExp(`^/(${codes})(?=/|$)(.*)$`));
  if (!match || match[2].startsWith("/cms-preview")) return null;
  const suffix = match[2] || "";
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "www.kowloonglobaltrading.com";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "https";
  const url = (locale: string) => `${proto}://${host}/${locale}${suffix}`;
  return <>{locales.map(locale => <link key={locale.code} rel="alternate" hrefLang={locale.htmlLang} href={url(locale.code)} />)}<link rel="alternate" hrefLang="x-default" href={url("en")} /></>;
}
