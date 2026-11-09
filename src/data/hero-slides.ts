import { heroMedia } from "./hero-media";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export type HeroSlide = { eyebrow: string | null; title: string | null; description: string | null; actionLabel: string | null; actionPath: string | null; image: string; video?: string; sampleText: boolean; sampleImage: boolean };
export function sampleHeroSlides(locale: CatalogPageLocale): HeroSlide[] {
  const slides = locale === "es" ? [
    { eyebrow: "CULTIVAR POSIBILIDADES", title: "Nutrición para cada\netapa de crecimiento.", description: "Explora ejemplos de productos de nutrición vegetal.", actionPath: "/products", actionLabel: "Explorar productos" },
    { eyebrow: "CRECER CON CUIDADO", title: "Conocer los cultivos,\nexplorar la nutrición.", description: "Descubre categorías de productos de ejemplo.", actionPath: "/products", actionLabel: "Ver productos" },
    { eyebrow: "CRECER JUNTOS", title: "Crecer junto a\nlos agricultores.", description: "La información de la empresa está pendiente de confirmación.", actionPath: "/about", actionLabel: "Quiénes somos" },
  ] : locale === "fr" ? [
    { eyebrow: "CULTIVER LES POSSIBILITÉS", title: "La nutrition à chaque\nétape de croissance.", description: "Découvrez des exemples de produits et de pratiques de culture.", actionPath: "/products", actionLabel: "Découvrir les produits" },
    { eyebrow: "CULTIVER AVEC SOIN", title: "Comprendre les cultures,\nexplorer la nutrition.", description: "Découvrez des catégories de produits données à titre d’exemple.", actionPath: "/#applications", actionLabel: "Découvrir les solutions" },
    { eyebrow: "GRANDIR ENSEMBLE", title: "Grandir aux côtés\ndes cultivateurs.", description: "Les informations sur l’entreprise et ses services restent à confirmer.", actionPath: "/about", actionLabel: "À propos" },
  ] : locale === "en" ? [
    { eyebrow: "NURTURE EVERY POSSIBILITY", title: "Nutrition for\nevery stage of growth.", description: "Explore sample plant nutrition products and growing applications.", actionPath: "/products", actionLabel: "Explore products" },
    { eyebrow: "GROW WITH CARE", title: "Understanding crops,\nexploring nutrition.", description: "Explore example product categories for growing needs.", actionPath: "/#applications", actionLabel: "Explore solutions" },
    { eyebrow: "ROOTED IN GROWTH", title: "Growing together\nwith growers.", description: "Company information and services await owner confirmation.", actionPath: "/about", actionLabel: "About us" },
  ] : [
    { eyebrow: "NURTURE EVERY POSSIBILITY", title: "用专业营养，\n陪伴每一次生长。", description: "从土壤到作物，探索更适合种植需求的植物营养方案。", actionPath: "/products", actionLabel: "探索产品" },
    { eyebrow: "GROW WITH CARE", title: "关注作物需求，\n探索营养方案。", description: "了解面向不同种植场景的产品分类与应用。", actionPath: "/#applications", actionLabel: "查看方案" },
    { eyebrow: "ROOTED IN GROWTH", title: "理解土地，\n也理解种植者。", description: "企业资料与服务内容将在业主确认后更新。", actionPath: "/about", actionLabel: "了解我们" },
  ];
  return slides.map((slide, index) => ({ ...slide, ...heroMedia[index], sampleText: true, sampleImage: true }));
}
