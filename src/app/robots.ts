import type { MetadataRoute } from "next";

const siteUrl = "https://www.kowloonglobaltrading.com";

/** Public release robots policy after owner-approved SEO release. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
