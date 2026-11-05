"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CatalogSearchForm({ locale, category, query }: { locale: "zh" | "en"; category: string; query: string }) {
  const [value, setValue] = useState(query);
  const router = useRouter();
  const en = locale === "en";
  return <form className="catalog-search" role="search" action={`${en ? "/en" : ""}/products#catalog-results`} method="get" onSubmit={(event) => { event.preventDefault(); const params = new URLSearchParams(); const term = value.trim().slice(0,100); if (category) params.set("category", category); if (term) params.set("q", term); const suffix = params.toString(); router.push(`${en ? "/en" : ""}/products${suffix ? `?${suffix}` : ""}#catalog-results`); }}><label htmlFor="product-search">{en ? "Search sample products" : "搜索示例产品"}</label><div className="catalog-search-row"><input id="product-search" type="search" name="q" value={value} onChange={(event) => setValue(event.target.value)} maxLength={100} placeholder={en ? "Product name or description" : "产品名称或简介"} aria-describedby="search-language-note" />{category && <input type="hidden" name="category" value={category} />}<button type="submit">{en ? "Search" : "搜索"}</button></div><p id="search-language-note" className="catalog-search-note">{en ? "Search uses the current language; keywords are not translated when switching languages." : "搜索当前语言的名称和简介；切换语言时关键词不会自动翻译。"}</p></form>;
}
