import Link from "next/link";
import { productCategories } from "../data/products";
import { englishCategories } from "../data/english-samples";
import { CatalogSearchForm } from "./catalog-search-form";

export function catalogHref(locale: "zh" | "en", category: string, query: string, anchor = false) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query) params.set("q", query);
  const suffix = params.toString();
  return `${locale === "en" ? "/en" : ""}/products${suffix ? `?${suffix}` : ""}${anchor ? "#catalog-results" : ""}`;
}

export function CatalogControls({ locale, category, query, count }: { locale: "zh" | "en"; category: string; query: string; count: number }) {
  const en = locale === "en";
  return <><CatalogSearchForm key={JSON.stringify([locale, category, query])} locale={locale} category={category} query={query}/><nav className="catalog-filters" aria-label={en ? "Product categories" : "产品类别"}><Link href={catalogHref(locale,"",query,true)} aria-current={!category ? "page" : undefined}>{en ? "All" : "全部"}</Link>{productCategories.map(item=><Link key={item.id} href={catalogHref(locale,item.id,query,true)} aria-current={category === item.id ? "page" : undefined}>{en ? englishCategories[item.id] : item.name}</Link>)}</nav><p className="catalog-result-count">{en ? `${count} sample ${count === 1 ? "product" : "products"} found` : `找到 ${count} 条示例产品`}</p></>;
}
