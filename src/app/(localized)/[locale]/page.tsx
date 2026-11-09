import { LocalizedShell, readyHomeLocale } from "../../../components/localized-shell";
import { Hero } from "../../../components/hero";
import { InterestSection } from "../../../components/interest-section";
import { HomeFeatured } from "../../../components/home-featured";
import { HomeProducts } from "../../../components/home-products";
import { HomeStories } from "../../../components/home-stories";
import { HomeNews } from "../../../components/home-news";
import { HomeFrenchSections } from "../../../components/home-french-sections";
import { HomeSpanishSections } from "../../../components/home-spanish-sections";
import { HomeCompanyFocus } from "../../../components/home-company-focus";
import { HomeCompanyStory } from "../../../components/home-company-story";
import { getCompanyProfile } from "../../../content/company-profile";
import { getHeroSlides } from "../../../content/homepage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readyHomeLocale((await params).locale);
  const [profile, slides] = await Promise.all([getCompanyProfile(locale), getHeroSlides(locale)]);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={locale === "en" ? "/zh" : "/en"}><main>
    <Hero locale={locale} slides={slides}/><InterestSection locale={locale}/><HomeFeatured locale={locale}/><HomeProducts locale={locale}/>
    <HomeCompanyStory locale={locale} profile={profile}/><HomeCompanyFocus locale={locale} profile={profile}/>
    {locale === "es" ? <HomeSpanishSections/> : locale === "fr" ? <HomeFrenchSections/> : <><HomeStories locale={locale}/><HomeNews locale={locale}/></>}
  </main></LocalizedShell>;
}
