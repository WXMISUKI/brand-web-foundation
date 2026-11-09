import { products } from "./products";
import { flbookProductDrafts } from "./flbook-product-drafts";
export { englishCategories } from "./categories";

// Preview translations only; these are not approved product descriptions.
const translations: Record<string, { name: string; intro: string }> = {};

for (const draft of flbookProductDrafts) {
  translations[draft.slug] = {
    name: draft.englishDisplayName,
    intro: draft.englishIntro,
  };
}

export const englishProducts = products.map((product) => ({ ...product, translation: translations[product.slug] }));
