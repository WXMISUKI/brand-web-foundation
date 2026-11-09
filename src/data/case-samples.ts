import staging from "./content-staging.json";

export const caseSamples = staging.records.cases.map(item => ({
  slug: item.slug,
  image: item.image,
  en: item.locales.en.title,
  zh: item.locales.zh.title,
  summaryEn: item.locales.en.summary,
  summaryZh: item.locales.zh.summary,
  bodyEn: item.locales.en.body,
  bodyZh: item.locales.zh.body,
}));
