import "server-only";
import { getAppPayload } from "../lib/payload";

import type { CatalogPageLocale } from "../i18n/catalog-messages";
import type { CropGuideDraft } from "../data/crop-guide-drafts";

const record = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const text = (value: unknown): string => typeof value === "string" ? value : "";

/** Read an owner-review crop guide from Payload without falling back across locales. */
export async function getPayloadCropGuide(locale: CatalogPageLocale, slug: string): Promise<CropGuideDraft | null> {
  const payload = await getAppPayload();
  const result = await payload.find({ collection: "crop-guides", locale, fallbackLocale: "en", depth: 0, where: { slug: { equals: slug } }, limit: 1 });
  const item = record(result.docs[0]);
  if (!item) return null;
  const rows = Array.isArray(item.sections) ? item.sections : [];
  const sections = rows.flatMap((value) => {
    const row = record(value);
    const title = text(row?.title);
    return title ? [title] : [];
  });
  if (sections.length !== 5) return null;
  const status = text(item.status);
  if (!["draft", "owner-review", "approved", "rejected"].includes(status)) return null;
  return {
    status: status as CropGuideDraft["status"],
    sections: sections as CropGuideDraft["sections"],
    nav: text(item.nav),
    overview: text(item.overview),
    stages: text(item.stages),
    stagesText: text(item.stagesText),
    nutrition: text(item.nutrition),
    products: text(item.products),
    browse: text(item.browse),
    resources: text(item.resources),
    resourcesText: text(item.resourcesText),
  };
}
