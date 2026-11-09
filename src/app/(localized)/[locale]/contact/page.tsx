import { ContactContent } from "../../../../components/contact-content";
import { LocalizedShell, readyInformationLocale } from "../../../../components/localized-shell";
import { getCompanyProfile } from "../../../../content/company-profile";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const locale = readyInformationLocale((await params).locale); const profile = await getCompanyProfile(locale); return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={'/' + (locale === "en" ? "zh" : "en") + '/contact'}><ContactContent locale={locale} profile={profile}/></LocalizedShell>; }
