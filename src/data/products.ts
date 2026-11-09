import { productCategories, type CategoryId } from "./categories";
import { flbookProductDrafts, type FlbookProductCategory } from "./flbook-product-drafts";
import type { LocaleCode } from "../i18n/locales";
export { productCategories } from "./categories";
export type { CategoryId } from "./categories";
export type ProductLocale = LocaleCode;
export type ProductMedia = { src: string; alt: Partial<Record<ProductLocale, string>> };
export type ProductDetails = { materials?: string; packaging?: string; uses?: string; instructions?: string };
export type ProductSpecification = {
  id: string;
  label: Partial<Record<ProductLocale, string>>;
  unit?: string;
  typical?: string;
  minimum?: string;
  maximum?: string;
};
export type ProductSourceRelatedPage = { page: number; role: "excluded-candidate" | "cross-page-context"; note?: string };
export type ProductReviewStatus = "draft" | "owner-review" | "approved" | "rejected" | "asset-pending";
export type ProductAssetStatus = "generated-placeholder" | "owner-supplied" | "authorized-example" | "pending";
type Product = {
  slug: string;
  categoryId: CategoryId;
  name: string;
  intro: string;
  image: string;
  media?: ProductMedia;
  details?: Partial<Record<ProductLocale, ProductDetails>>;
  specifications?: ProductSpecification[];
  sourcePages?: number[];
  sourcePreviewPath?: string;
  sourceDetailPreviewPath?: string;
  sourceRelatedPages?: ProductSourceRelatedPage[];
  sourceUrl?: string;
  sourceNote?: string;
  reviewStatus?: ProductReviewStatus;
  assetStatus?: ProductAssetStatus;
  claimsVerified?: boolean;
};

const flbookCategoryMap: Record<FlbookProductCategory, CategoryId> = {
  "medium-nutrient": "medium-elements",
  "water-soluble": "water-soluble",
  "organic-water-soluble": "water-soluble",
  compound: "compound",
};

const flbookProducts: Product[] = flbookProductDrafts.map((draft, index) => ({
  slug: draft.slug,
  categoryId: flbookCategoryMap[draft.category],
  name: draft.displayName,
  intro: draft.intro,
  image: String(index + 1).padStart(2, "0"),
  media: {
    src: draft.imagePath,
    alt: {
      zh: `${draft.displayName}，图片来自官方产品页，文字来源于业主提供的 FLBOOK 第 ${draft.sourcePages.join("、")} 页`,
      en: `${draft.englishDisplayName}, official product image; text sourced from owner-provided FLBOOK pages ${draft.sourcePages.join(", ")}`,
    },
  },
  sourcePages: draft.sourcePages,
  sourceRelatedPages: draft.sourceRelatedPages,
  sourcePreviewPath: draft.sourcePreviewPath,
  sourceDetailPreviewPath: draft.sourceDetailPreviewPath,
  sourceUrl: "https://flbook.com.cn/c/LTc82gQQM3",
  sourceNote: draft.sourceNote,
  reviewStatus: draft.contentStatus,
  assetStatus: draft.imageStatus,
  claimsVerified: draft.claimsVerified ?? draft.contentStatus === "approved",
}));

export const products = flbookProducts.map((product) => ({
  ...product,
  category: productCategories.find((category) => category.id === product.categoryId)!.name,
}));
