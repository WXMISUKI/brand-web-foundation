"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { catalogMessages, type CatalogPageLocale } from "../i18n/catalog-messages";
import { catalogHref } from "../data/catalog-path";

export function CatalogSearchForm({ locale, category, query, sample, basePath }: { locale: CatalogPageLocale; category: string; query: string; sample: boolean; basePath?: string }) {
  const [value, setValue] = useState(query);
  const router = useRouter();
  const copy = catalogMessages[locale];
  return <form className="catalog-search" role="search" action={basePath ?? `/${locale}/products`} method="get" onSubmit={(event) => { event.preventDefault(); router.push(catalogHref(locale, category, value.trim().slice(0,100), true, 1, basePath)); }}><label htmlFor="product-search">{sample ? copy.searchSample : copy.search}</label><div className="catalog-search-row"><input id="product-search" type="search" name="q" value={value} onChange={(event) => setValue(event.target.value)} maxLength={100} placeholder={copy.placeholder} aria-describedby="search-language-note" />{category && <input type="hidden" name="category" value={category} />}<button type="submit">{copy.submit}</button></div><p id="search-language-note" className="catalog-search-note">{copy.note}</p></form>;
}
