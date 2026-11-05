import { products } from "./products";

// Preview translations only; these are not approved product descriptions.
const translations: Record<string, { name: string; intro: string; category: string }> = {
  "water-soluble": { name: "Water-soluble fertilizer range", intro: "An example nutrition range for different growth stages.", category: "Water-soluble" },
  "medium-elements": { name: "Secondary nutrient range", intro: "An example range for supplementary plant nutrition.", category: "Secondary nutrients" },
  "compound": { name: "Compound fertilizer range", intro: "An example range for varied growing conditions.", category: "Compound fertilizer" },
};

export const englishProducts = products.map((product) => ({ ...product, translation: translations[product.slug] }));
export const englishCategories: Record<string, string> = { "water-soluble": "Water-soluble", "medium-elements": "Secondary nutrients", compound: "Compound fertilizer" };
