import importData from "./flbook-import.json";

export type FlbookProductCategory = "medium-nutrient" | "water-soluble" | "organic-water-soluble" | "compound";
export type FlbookProductDraft = {
  slug: string;
  displayName: string;
  englishDisplayName: string;
  intro: string;
  englishIntro: string;
  sourcePages: number[];
  sourceRelatedPages?: { page: number; role: "excluded-candidate" | "cross-page-context"; note?: string }[];
  sourcePreviewPath: string;
  sourceDetailPreviewPath?: string;
  category: FlbookProductCategory;
  sourceNote: string;
  officialImageSource?: string;
  imageStatus: "generated-placeholder" | "owner-supplied" | "authorized-example" | "pending";
  imagePath: string;
  contentStatus: "draft" | "owner-review" | "approved" | "rejected" | "asset-pending";
  claimsVerified?: boolean;
  specifications?: Array<{ id: string; locales: { zh: string; en: string }; unit: string; typical?: string; minimum?: string; maximum?: string }>;
};

/** Ten display-only product drafts based on the owner-provided brochure. */
export const flbookProductDrafts = importData.products as FlbookProductDraft[];
export const flbookSource = importData.source;
