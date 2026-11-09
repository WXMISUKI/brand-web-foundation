import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

export type CropGuideDraft = {
  status: "draft" | "owner-review" | "approved" | "rejected" | "asset-pending";
  sections: [string, string, string, string, string];
  nav: string;
  overview: string;
  stages: string;
  stagesText: string;
  nutrition: string;
  products: string;
  browse: string;
  resources: string;
  resourcesText: string;
};

const defaults = completeLocaleMap<CropGuideDraft>({
  en: { status: "approved", sections: ["Overview", "Growth stages", "Nutrition guidance", "Related products", "Resources"], nav: "Guide sections", overview: "Plan crop nutrition around local conditions, crop goals and the four main stages of growth.", stages: "Establishment · vegetative growth · flowering or fruiting · quality and harvest", stagesText: "Use these stages to structure observations, compare product formats and prepare a focused product conversation.", nutrition: "Start with soil and water analysis, then compare the nutrient roles and package formats described on the related product pages. Final rates should follow local agronomic advice.", products: "Open the brochure-linked product pages to compare categories, package information and source pages.", browse: "Browse all products ↗", resources: "Product and brochure resources", resourcesText: "Use the source page references on each product page and contact the KOMU team for current technical documents." },
  zh: { status: "approved", sections: ["作物概览", "生长阶段", "营养管理", "相关产品", "技术资料"], nav: "指南章节", overview: "结合当地种植条件、作物目标和主要生长阶段规划作物营养。", stages: "定植与建苗 · 营养生长 · 开花或结果 · 品质与采收", stagesText: "用四个阶段整理观察记录、比较产品形态，并准备更有针对性的产品沟通。", nutrition: "先结合土壤和水质分析，再对照关联产品页面中的营养作用和包装形式。具体用量应结合当地农艺建议。", products: "打开画册关联产品页面，比较产品类别、包装信息和来源页码。", browse: "浏览全部产品 ↗", resources: "产品与画册资料", resourcesText: "可查看产品页面中的来源页码，并通过联系方式向康姆团队获取最新技术资料。" },
  fr: { status: "owner-review", sections: ["Présentation", "Stades de croissance", "Conseils nutritionnels", "Produits associés", "Ressources"], nav: "Sections du guide", overview: "Les informations sur la culture et les conditions de production restent à confirmer.", stages: "Informations sur les stades de croissance à compléter", stagesText: "Les descriptions des stades et les produits associés n’ont pas été fournis.", nutrition: "Aucune dose, période d’application ni recommandation de traitement n’a été fournie.", products: "Les associations entre produits et cultures restent à confirmer.", browse: "Voir tous les exemples de produits ↗", resources: "Ressources à compléter", resourcesText: "Les téléchargements seront ajoutés après validation des documents." },
  es: { status: "owner-review", sections: ["Descripción general", "Etapas de crecimiento", "Orientación nutricional", "Productos relacionados", "Recursos"], nav: "Secciones de la guía", overview: "La información del cultivo y las condiciones de producción están pendientes de confirmación.", stages: "Información de etapas pendiente", stagesText: "No se han facilitado descripciones de las etapas ni productos asociados.", nutrition: "No se han proporcionado dosis, fechas de aplicación ni recomendaciones de tratamiento.", products: "Las relaciones entre productos y cultivos están pendientes de confirmación.", browse: "Ver todos los productos de ejemplo ↗", resources: "Recursos pendientes", resourcesText: "Las descargas se añadirán cuando se disponga de materiales aprobados." },
});

const cropOverrides: Record<string, Partial<Record<CatalogPageLocale, Partial<CropGuideDraft>>>> = {
  corn: {
    en: { overview: "The corn crop profile, growing conditions and production targets await owner confirmation." },
    zh: { overview: "玉米作物资料、种植条件及生产目标待业主确认。" },
    fr: { overview: "Le profil du maïs, ses conditions de culture et ses objectifs de production restent à confirmer." },
    es: { overview: "El perfil del maíz, sus condiciones de cultivo y objetivos de producción están pendientes de confirmación." },
  },
};

/** Sample, owner-review crop guide records. Replace this adapter with Payload data after approval. */
export function getCropGuideDraft(slug: string, locale: CatalogPageLocale): CropGuideDraft {
  return { ...defaults[locale], ...(cropOverrides[slug]?.[locale] ?? {}) };
}
