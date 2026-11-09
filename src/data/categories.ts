// Example categories and translations; replace after owner review.
export const productCategories = [
  { id: "water-soluble", name: "水溶肥" },
  { id: "medium-elements", name: "中量元素" },
  { id: "compound", name: "复合肥" },
] as const;

export type CategoryId = (typeof productCategories)[number]["id"];
export const englishCategories: Record<CategoryId, string> = {
  "water-soluble": "Water-soluble",
  "medium-elements": "Secondary nutrients",
  compound: "Compound fertilizer",
};
