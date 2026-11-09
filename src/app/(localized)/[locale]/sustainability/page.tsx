import { LocalizedShell, readyResourcesLocale } from "../../../../components/localized-shell";
import { SustainabilityContent } from "../../../../components/sustainability-content";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readyResourcesLocale((await params).locale);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={`/${locale === "en" ? "zh" : "en"}/sustainability`}><SustainabilityContent locale={locale}/></LocalizedShell>;
}
