export type FlbookPageKind = "cover" | "company-profile" | "catalog" | "technology-case" | "product" | "technology-summary" | "back-cover";
export type FlbookReviewStatus = "draft" | "owner-review" | "approved" | "rejected" | "asset-pending";
export type FlbookPageSelection = "selected" | "excluded-candidate" | "context";

export type FlbookPageDraft = {
  page: number;
  kind: FlbookPageKind;
  observedLabel: string;
  status: FlbookReviewStatus;
  requiresOcrReview: boolean;
  productKey?: string;
  selection?: FlbookPageSelection;
  previewPath: string;
};

const previewPathByPage: Record<number, string> = {
  1: "/images/flbook-pages/page-01.jpg",
  2: "/images/flbook-pages/pages-02-03.jpg", 3: "/images/flbook-pages/pages-02-03.jpg",
  4: "/images/flbook-pages/pages-04-05.jpg", 5: "/images/flbook-pages/pages-04-05.jpg",
  6: "/images/flbook-pages/pages-06-07.jpg", 7: "/images/flbook-pages/pages-06-07.jpg",
  8: "/images/flbook-pages/pages-08-09.jpg", 9: "/images/flbook-pages/pages-08-09.jpg",
  10: "/images/flbook-pages/pages-10-11.jpg", 11: "/images/flbook-pages/pages-10-11.jpg",
  12: "/images/flbook-pages/pages-12-13.jpg", 13: "/images/flbook-pages/pages-12-13.jpg",
  14: "/images/flbook-pages/pages-14-15.jpg", 15: "/images/flbook-pages/pages-14-15.jpg",
  16: "/images/flbook-pages/pages-16-17.jpg", 17: "/images/flbook-pages/pages-16-17.jpg",
  18: "/images/flbook-pages/pages-18-19.jpg", 19: "/images/flbook-pages/pages-18-19.jpg",
  20: "/images/flbook-pages/pages-20-21.jpg", 21: "/images/flbook-pages/pages-20-21.jpg",
  22: "/images/flbook-pages/pages-22-23.jpg", 23: "/images/flbook-pages/pages-22-23.jpg",
  24: "/images/flbook-pages/page-24.jpg",
};

const productPageKeys: Record<number, string> = {
  6: "medium-element-granular-draft", 7: "medium-element-granular-draft",
  8: "organic-water-soluble-growth-draft", 9: "organic-water-soluble-quality-draft",
  10: "organic-water-soluble-absorption-draft", 11: "excluded-organic-water-soluble-fruit-quality-candidate",
  12: "organic-water-soluble-root-draft", 13: "excluded-organic-water-soluble-leaf-quality-candidate",
  14: "suspended-fertilizer-120-60-400-draft", 15: "suspended-fertilizer-120-60-400-draft",
  16: "suspended-fertilizer-200-150-200-draft", 17: "suspended-fertilizer-200-150-200-draft",
  18: "massive-element-liquid-quality-draft", 19: "excluded-massive-element-bud-differentiation-candidate",
  20: "medium-element-liquid-draft", 21: "excluded-medium-element-multi-effect-candidate",
  22: "organic-inorganic-compound-draft",
};

const productPageSelections: Record<number, FlbookPageSelection> = {
  6: "selected", 7: "selected", 8: "selected", 9: "selected", 10: "selected", 11: "excluded-candidate",
  12: "selected", 13: "excluded-candidate", 14: "selected", 15: "selected", 16: "selected", 17: "selected",
  18: "selected", 19: "excluded-candidate", 20: "selected", 21: "excluded-candidate", 22: "selected",
};

/**
 * Page-level import manifest. It is deliberately a draft and is not a product seed.
 * OCR text, specifications, media crops and product relationships must be filled
 * only after owner review.
 */
export const flbookPageDrafts: FlbookPageDraft[] = [
  { page: 1, kind: "cover", observedLabel: "Brand cover and company name", status: "approved", requiresOcrReview: false, previewPath: previewPathByPage[1] },
  { page: 2, kind: "company-profile", observedLabel: "Company profile, technology and quality text", status: "approved", requiresOcrReview: false, previewPath: previewPathByPage[2] },
  { page: 3, kind: "catalog", observedLabel: "Product contents", status: "approved", requiresOcrReview: false, previewPath: previewPathByPage[3] },
  { page: 4, kind: "technology-case", observedLabel: "Product or technology effect explanation", status: "approved", requiresOcrReview: false, previewPath: previewPathByPage[4] },
  { page: 5, kind: "technology-case", observedLabel: "Plant and soil mechanism explanation", status: "approved", requiresOcrReview: false, previewPath: previewPathByPage[5] },
  ...Array.from({ length: 17 }, (_, index) => ({
    page: index + 6,
    kind: "product" as const,
    observedLabel: `${productPageSelections[index + 6] === "excluded-candidate" ? "Excluded product candidate" : `Product page ${index + 1}`}`,
    status: "approved" as const,
    requiresOcrReview: false,
    productKey: productPageKeys[index + 6],
    selection: productPageSelections[index + 6],
    previewPath: previewPathByPage[index + 6],
  })),
  { page: 23, kind: "product", observedLabel: "Separate high-solubility compound fertilizer candidate · excluded from initial ten", status: "approved", requiresOcrReview: false, productKey: "excluded-high-solubility-compound-candidate", selection: "excluded-candidate", previewPath: previewPathByPage[23] },
  { page: 24, kind: "back-cover", observedLabel: "Contact and QR information", status: "approved", requiresOcrReview: false, previewPath: previewPathByPage[24] },
];
