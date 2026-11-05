export const productCategories = [
  { id: "water-soluble", name: "水溶肥" },
  { id: "medium-elements", name: "中量元素" },
  { id: "compound", name: "复合肥" },
] as const;

type CategoryId = (typeof productCategories)[number]["id"];
export type ProductLocale = "zh" | "en";
export type ProductMedia = { src: string; alt: Partial<Record<ProductLocale, string>> };
export type ProductDetails = { materials?: string; packaging?: string; uses?: string };
export type ProductSpecification = {
  id: string;
  label: Partial<Record<ProductLocale, string>>;
  unit?: string;
  typical?: string;
  range?: string;
};
type Product = { slug: string; categoryId: CategoryId; name: string; intro: string; image: string; media?: ProductMedia; details?: Partial<Record<ProductLocale, ProductDetails>>; specifications?: ProductSpecification[] };

const sampleProducts: Product[] = [
  { slug: "water-soluble", categoryId: "water-soluble", name: "水溶肥系列", intro: "为不同生长阶段设计的营养方案。", image: "01" },
  { slug: "medium-elements", categoryId: "medium-elements", name: "中量元素系列", intro: "围绕作物需求提供营养补充。", image: "02" },
  { slug: "compound", categoryId: "compound", name: "复合肥系列", intro: "面向多样种植场景的营养选择。", image: "03" },
  { slug: "water-soluble-example-b", categoryId: "water-soluble", name: "水溶肥示例 B", intro: "用于验证同一分类下的多条示例数据。", image: "04" },
];

export const products = sampleProducts.map((product) => ({
  ...product,
  category: productCategories.find((category) => category.id === product.categoryId)!.name,
}));
