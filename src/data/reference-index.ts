import { productCategories } from "./categories";
import { solutions } from "./solutions";
import type { LocaleCode } from "../i18n/locales";

export const referenceSeriesSlugs = productCategories.map(category => category.id);
export const referenceMethodSolutions = solutions.filter(solution => solution.group === "method");

export function referenceSeriesLabel(locale: LocaleCode, slug: string) {
  const category = productCategories.find(item => item.id === slug);
  if (!category) return null;
  if (locale === "zh") return category.name;
  return ({
    "water-soluble": "Water-soluble",
    "medium-elements": "Secondary nutrients",
    compound: "Compound fertilizer",
  } as Record<string, string>)[slug] ?? category.name;
}

export function referenceMethodLabel(locale: LocaleCode, solution: (typeof referenceMethodSolutions)[number]) {
  return locale === "zh" ? solution.zh : solution.en;
}
