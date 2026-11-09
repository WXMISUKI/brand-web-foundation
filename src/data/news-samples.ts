import staging from "./content-staging.json";

export const newsSamples = staging.records.news.map(item => ({
  slug: item.slug,
  kind: item.kind === "event" ? "event" : "news",
  en: item.locales.en.title,
  zh: item.locales.zh.title,
  summaryEn: item.locales.en.summary,
  summaryZh: item.locales.zh.summary,
  bodyEn: item.locales.en.body,
  bodyZh: item.locales.zh.body,
  publishedOn: item.publishedOn,
  image: item.image,
}));
