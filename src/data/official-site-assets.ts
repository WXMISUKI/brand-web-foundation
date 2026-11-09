/**
 * Owner-provided official-site asset provenance.
 * The old mobile site is currently reachable over HTTP; HTTPS fails TLS
 * negotiation, so the HTTP URLs below are retained as the captured source.
 */
export const officialSiteAssets = {
  homeBanners: {
    source: "http://m.zgkomu.cn/banner?mode=jsMobile&defaultBannerId=8397",
    files: ["/images/official-site/hero-01.jpg", "/images/official-site/hero-02.jpg", "/images/official-site/hero-03.jpg"],
  },
  productPages: {
    "medium-element-granular-draft": "http://m.zgkomu.cn/display/754923.html",
    "organic-water-soluble-growth-draft": "http://m.zgkomu.cn/display/754921.html",
    "organic-water-soluble-quality-draft": "http://m.zgkomu.cn/display/754926.html",
    "organic-water-soluble-absorption-draft": "http://m.zgkomu.cn/display/754931.html",
    "organic-water-soluble-root-draft": "http://m.zgkomu.cn/display/754932.html",
    "suspended-fertilizer-120-60-400-draft": "http://m.zgkomu.cn/display/754918.html",
    "suspended-fertilizer-200-150-200-draft": "http://m.zgkomu.cn/display/754919.html",
  },
} as const;
