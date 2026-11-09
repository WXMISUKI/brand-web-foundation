import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

const labels = completeLocaleMap({
  en: { groups: ["Fertilization methods", "Farming methods"], names: ["Fertigation", "Foliar feeding", "Soil application", "Controlled release", "Greenhouse", "Open field", "Fruit trees", "Nurseries"] },
  zh: { groups: ["施肥方法", "种植方法"], names: ["灌溉施肥", "叶面施肥", "土壤施肥", "控释施肥", "设施农业", "大田种植", "果树", "苗圃"] },
  fr: { groups: ["Méthodes de fertilisation", "Méthodes de culture"], names: ["Fertigation", "Nutrition foliaire", "Application au sol", "Libération contrôlée", "Serre", "Plein champ", "Arbres fruitiers", "Pépinières"] },
  es: { groups: ["Métodos de fertilización", "Métodos de cultivo"], names: ["Fertirrigación", "Aplicación foliar", "Aplicación al suelo", "Liberación controlada", "Invernadero", "Campo abierto", "Frutales", "Viveros"] },
});

const paths = ["fertigation", "#foliar-feeding", "#soil-application", "#controlled-release", "greenhouse", "open-field", "fruit-trees", "#nurseries"] as const;

export function PracticeMenuGroups({ locale, onNavigate }: { locale: CatalogPageLocale; onNavigate?: () => void }) {
  const copy = labels[locale];
  return <>{copy.groups.map((group, index) => <section key={group}><strong>{group}</strong>{paths.slice(index * 4, index * 4 + 4).map((slug, offset) => {
    const name = copy.names[index * 4 + offset];
    return slug?.startsWith("#") ? <Link key={name} href={`/${locale}/contact${slug}`} onClick={onNavigate}>{name}</Link> : <Link key={name} href={`/${locale}/solutions/${slug}`} onClick={onNavigate}>{name}</Link>;
  })}</section>)}</>;
}
