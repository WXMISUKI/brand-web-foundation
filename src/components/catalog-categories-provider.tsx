"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { CatalogCategory } from "../content/catalog";

const CategoriesContext = createContext<CatalogCategory[]>([]);
export function CatalogCategoriesProvider({ categories, children }: { categories: CatalogCategory[]; children: ReactNode }) {
  return <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>;
}
export function useCatalogCategories() { return useContext(CategoriesContext); }
