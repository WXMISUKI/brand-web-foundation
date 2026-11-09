import { getLocale, type LocaleCode } from "../i18n/locales.ts";
import { isPreviewRoute } from "../i18n/preview-routes.ts";

export function heroHref(locale: LocaleCode, path: string | null): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\") || /[\u0000-\u001f]/.test(path)) return null;
  const firstSegment = path.slice(1).split(/[/?#]/, 1)[0];
  if (getLocale(firstSegment.toLowerCase())) return null;
  // Spanish is a partial development preview; do not link to routes not yet open.
  if (locale === "es" && !isPreviewRoute(path)) return null;
  return `/${locale}${path === "/" ? "" : path}`;
}
