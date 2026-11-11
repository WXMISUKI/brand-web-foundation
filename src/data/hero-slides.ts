import { heroMedia } from "./hero-media";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import staging from "./homepage-staging.json";
import phase1 from "./homepage-localizations-phase1.json";
import phase2 from "./homepage-localizations-phase2.json";
import phase3 from "./homepage-localizations-phase3.json";

export type HeroSlide = { eyebrow: string | null; title: string | null; description: string | null; actionLabel: string | null; actionPath: string | null; image: string; video?: string; sampleText: boolean; sampleImage: boolean };

const homeCopy = {
  slides: { ...staging.slides, ...phase1.slides, ...phase2.slides, ...phase3.slides },
  featured: { ...staging.featured, ...phase1.featured, ...phase2.featured, ...phase3.featured },
};

export function fallbackFeatured(locale: CatalogPageLocale) {
  return homeCopy.featured[locale];
}

export function sampleHeroSlides(locale: CatalogPageLocale): HeroSlide[] {
  return homeCopy.slides[locale].map((slide, index) => ({
    ...slide, ...heroMedia[index], sampleText: false, sampleImage: false,
  }));
}
