import path from "node:path";
import { defineConfig } from "playwright/test";

// This command always targets an isolated local sample-data server.
const baseURL = "http://localhost:3125";
process.env.PUBLIC_BASE_URL = baseURL;
process.env.ACCEPTANCE_SCOPE = "fast";

export default defineConfig({
  testDir: "./tests",
  testMatch: [
    "language-switching.spec.mjs",
    "header-scroll.spec.mjs",
    "header-navigation-overlap.spec.mjs",
    "desktop-quick-links-layout.spec.mjs",
    "quick-links-availability.spec.mjs",
    "public-copy-display.spec.mjs",
    "content-acceptance.spec.mjs",
    "homepage-fallback-locales.spec.mjs",
    "local-visual-quality.spec.mjs",
    "unfinished-content.spec.mjs",
    "company-preview-locales.spec.mjs",
    "product-provenance-display.spec.mjs",
    "accessibility-acceptance.spec.mjs",
    "accessibility-locales.spec.mjs",
    "admin-locale-loading.spec.mjs",
    "acceptance-production-interactions.spec.mjs",
    "acceptance-production-browser.spec.mjs",
  ],
  workers: 1,
  reporter: "list",
  use: { trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: {
    command: "npm run dev -- -p 3125",
    url: `${baseURL}/en`,
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      ...process.env,
      NODE_ENV: "development",
      NEXT_TELEMETRY_DISABLED: "1",
      PAYLOAD_DATABASE: "sqlite",
      PAYLOAD_SQLITE_URL: "file:./.local/ui-acceptance.sqlite",
      PAYLOAD_MEDIA_DIR: path.resolve(".local/ui-acceptance-media"),
      PAYLOAD_SECRET: "local-ui-acceptance-only-not-a-production-secret",
      DATABASE_URL: "",
      CATALOG_SOURCE: "sample",
      CROP_GUIDE_SOURCE: "sample",
      INQUIRY_MODE: "disabled",
      CMS_EVAL: "0",
      SHOW_PREVIEW_BANNER: "0",
    },
  },
});
