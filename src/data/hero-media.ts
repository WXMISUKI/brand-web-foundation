// Hero stills are sourced from the owner-provided official mobile site.
// Videos are decorative, muted backgrounds; each still image remains the fallback.
export type HeroMedia = { image: string; video?: string };
export const heroMedia: HeroMedia[] = [
  { image: "/images/official-site/hero-01.jpg" },
  { image: "/images/official-site/hero-02.jpg" },
  { image: "/images/official-site/hero-03.jpg" },
];
