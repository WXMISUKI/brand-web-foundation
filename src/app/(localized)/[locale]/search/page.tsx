import { SiteSearch } from "../../../../components/site-search";
import { LocalizedShell, readyInformationLocale } from "../../../../components/localized-shell";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string | string[] }> }) {
  const locale = readyInformationLocale((await params).locale), input = (await searchParams).q;
  const query = typeof input === "string" ? input.trim().slice(0, 100) : "";
  const suffix = query ? `?${new URLSearchParams({ q: query })}` : "";
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={`/${locale === "en" ? "zh" : "en"}/search${suffix}`}><SiteSearch locale={locale} query={query}/></LocalizedShell>;
}
