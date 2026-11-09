import { AboutContent } from "../../../../components/about-content";
import { LocalizedShell, readyAboutLocale } from "../../../../components/localized-shell";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const locale = readyAboutLocale((await params).locale); return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={'/' + (locale === "en" ? "zh" : "en") + '/about'}><AboutContent locale={locale}/></LocalizedShell>; }
