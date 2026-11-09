import type { MetadataRoute } from "next";
import { locales } from "../i18n/locales";

const siteUrl = "https://www.kowloonglobaltrading.com";

/** Publish a stable route inventory for the eventual indexable release. */
export default function sitemap(): MetadataRoute.Sitemap {
  const sections = ["", "/about", "/products", "/solutions", "/insights", "/news", "/faq", "/contact", "/smart-farming"];
  const routes = locales.flatMap(locale => sections.map(section => `/${locale.code}${section}`));
  return routes.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: "weekly", priority: path === "/en" || path === "/zh" ? 1 : 0.6 }));
}
