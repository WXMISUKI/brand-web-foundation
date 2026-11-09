import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  output: "standalone",
  ...(process.env.CMS_EVAL === "1" ? { distDir: ".next-cms" } : {}),
  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      ...["products", "solutions", "about", "contact", "faq"].map((section) => ({
        source: `/${section}/:path*`,
        destination: `/zh/${section}/:path*`,
        permanent: false,
      })),
    ];
  },
};

export default withPayload(nextConfig);
