const englishReplacements = new Map([
  ["hero-01.jpg", { src: "/images/official-site/company-products.jpg", alt: "KOMU product display" }],
  ["hero-02.jpg", { src: "/images/third-party/commons-wheat-texas.webp", alt: "Wheat field in Texas" }],
]);

export function featuredMediaForLocale(locale, media) {
  if (locale !== "en" || !media?.src) return media;
  const match = /^\/api\/media\/file\/(hero-0[12]\.jpg)(?:\?.*)?$/.exec(media.src);
  return match ? englishReplacements.get(match[1]) : media;
}
