import { solutionNameSlugs, solutionNames } from "../i18n/solution-names";
// Illustrative navigation only; product associations and advice require owner review.
export const solutions = [
  { slug: "open-field", group: "method", zh: "大田种植", en: "Open field" },
  { slug: "greenhouse", group: "method", zh: "设施农业", en: "Greenhouse" },
  { slug: "fertigation", group: "method", zh: "灌溉施肥", en: "Fertigation" },
  { slug: "fruit-trees", group: "crop", zh: "果树", en: "Fruit trees" },
  { slug: "vegetables", group: "crop", zh: "蔬菜", en: "Vegetables" },
  { slug: "field-crops", group: "crop", zh: "大田作物", en: "Field crops" },
  { slug: "corn", group: "crop", zh: "玉米", en: "Corn" },
  { slug: "sugar-beet", group: "crop", zh: "甜菜", en: "Sugar beet" },
  { slug: "garlic", group: "crop", zh: "大蒜", en: "Garlic" },
  { slug: "almond", group: "crop", zh: "杏仁", en: "Almond" },
  { slug: "soybean", group: "crop", zh: "大豆", en: "Soybean" },
  { slug: "turf", group: "crop", zh: "草坪", en: "Turf" },
  { slug: "tomato", group: "crop", zh: "番茄", en: "Tomato" },
  { slug: "pepper", group: "crop", zh: "辣椒", en: "Pepper" },
  { slug: "cucumber", group: "crop", zh: "黄瓜", en: "Cucumber" },
  { slug: "potato", group: "crop", zh: "马铃薯", en: "Potato" },
  { slug: "strawberry", group: "crop", zh: "草莓", en: "Strawberry" },
  { slug: "citrus", group: "crop", zh: "柑橘", en: "Citrus" },
  { slug: "banana", group: "crop", zh: "香蕉", en: "Banana" },
  { slug: "olives", group: "crop", zh: "橄榄", en: "Olives" },
  { slug: "rice", group: "crop", zh: "水稻", en: "Rice" },
  { slug: "wheat", group: "crop", zh: "小麦", en: "Wheat" },
  { slug: "onion", group: "crop", zh: "洋葱", en: "Onion" },
  { slug: "apple", group: "crop", zh: "苹果", en: "Apple" },
  { slug: "grapes", group: "crop", zh: "葡萄", en: "Grapes" },
] as const;

export function solutionLabel(locale: import("../i18n/locales").LocaleCode, solution: (typeof solutions)[number]) {
  if (locale === "zh") return solution.zh;
  const index = solutionNameSlugs.indexOf(solution.slug);
  return solutionNames[locale]?.[index] ?? solution.en;
}

export const spanishSolutionLabels: Record<(typeof solutions)[number]["slug"], string> = {
  "open-field": "Campo abierto", greenhouse: "Invernadero", fertigation: "Fertirrigación", "fruit-trees": "Frutales", vegetables: "Hortalizas", "field-crops": "Cultivos de campo",
  corn: "Maíz", "sugar-beet": "Remolacha azucarera", garlic: "Ajo", almond: "Almendra", soybean: "Soja", turf: "Césped", tomato: "Tomate", pepper: "Pimiento", cucumber: "Pepino", potato: "Patata", strawberry: "Fresa", citrus: "Cítricos", banana: "Banano", olives: "Olivos", rice: "Arroz", wheat: "Trigo", onion: "Cebolla", apple: "Manzana", grapes: "Uvas",
};
