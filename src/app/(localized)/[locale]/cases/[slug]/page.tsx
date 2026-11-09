import { CaseDetail } from "../../../../../components/case-content";
import { LocalizedShell, readyEditorialLocale } from "../../../../../components/localized-shell";

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: code, slug } = await params;
  const locale = readyEditorialLocale(code);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={'/' + (locale === "en" ? "zh" : "en") + '/cases/' + encodeURIComponent(slug)}><CaseDetail locale={locale} slug={slug}/></LocalizedShell>;
}
