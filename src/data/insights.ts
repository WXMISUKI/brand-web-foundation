import staging from "./content-staging.json";

export const insightSamples = staging.records.insights.map(item => ({
  slug: item.slug,
  topics: item.topics ?? [],
  en: item.locales.en.title,
  zh: item.locales.zh.title,
  summaryEn: item.locales.en.summary,
  summaryZh: item.locales.zh.summary,
  bodyEn: item.locales.en.body,
  bodyZh: item.locales.zh.body,
  authorEn: item.locales.en.author,
  authorZh: item.locales.zh.author,
  publishedOn: item.publishedOn,
  image: item.image,
}));
