import { test, expect } from "playwright/test";

const base = (process.env.PUBLIC_BASE_URL || "http://localhost:3118").replace(/\/$/, "");
const locales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];

test("desktop quick links keep every localized label inside its card", async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of locales) {
      await page.goto(`${base}/${locale}`, { waitUntil: "domcontentloaded" });
      const result = await page.evaluate(() => {
        const nav = document.querySelector(".desktop-quick-links");
        if (!nav) return { visible: false, issues: ["missing quick links"] };
        const visible = getComputedStyle(nav).display !== "none";
        const issues = [];
        const navRect = nav.getBoundingClientRect();
        if (navRect.right > window.innerWidth + 1) issues.push("nav overflow");
        for (const card of nav.querySelectorAll(":scope > *")) {
          const cardRect = card.getBoundingClientRect();
          const label = card.querySelector(".desktop-quick-link-label");
          const labelRect = label?.getBoundingClientRect();
          if (cardRect.right > window.innerWidth + 1) issues.push("card overflow");
          if (labelRect && (labelRect.left < cardRect.left - 1 || labelRect.right > cardRect.right + 1)) issues.push("label overflow");
        }
        return { visible, issues };
      });
      expect(result.visible, `${locale} ${width}px quick links should be visible`).toBe(true);
      expect(result.issues, `${locale} ${width}px quick links layout`).toEqual([]);
    }
  }
});
