import { LocalizedShell, readySolutionsLocale } from "../../../../components/localized-shell";
import { SolutionsIndexPage } from "../../../../components/solutions-index-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readySolutionsLocale((await params).locale);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={`/${locale === "en" ? "zh" : "en"}/solutions`}><SolutionsIndexPage locale={locale}/></LocalizedShell>;
}
