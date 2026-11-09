/** Routes implemented for French and Spanish development previews. */
const previewSections = new Set(["products", "solutions", "smart-farming", "sds-request", "quality-assurance", "about", "contact", "faq", "insights", "news", "cases", "search", "sustainability"]);

/** Accept a site-relative path without its language prefix. */
export function isPreviewRoute(path: string): boolean {
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
  const section = path.slice(1).split(/[/?#]/, 1)[0];
  return !section || previewSections.has(section);
}

/** Accept an already localized counterpart path from a public/preview page. */
export function hasPreviewCounterpart(path: string): boolean {
  const match = /^\/(?:en|zh|fr|es)(?=\/|\?|#|$)/.exec(path);
  if (!match) return false;
  const remainder = path.slice(match[0].length);
  return !remainder || isPreviewRoute(remainder.startsWith("/") ? remainder : `/${remainder}`);
}
