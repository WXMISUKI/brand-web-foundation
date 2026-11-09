import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { completeLocaleMap } from "../i18n/locale-fallback";

export const sustainabilityMessages = completeLocaleMap({
  en: { title: "Sustainability", preview: "TOPIC PREVIEW", intro: "Our sustainability strategy, practices and evidence will be added when company information is available.", image: "Sample image · not owner material", home: "Home", breadcrumb: "Breadcrumb", pending: "Content and supporting materials await owner confirmation.", sections: ["Strategy and goals", "Environment", "People and safety", "Governance"] },
  zh: { title: "可持续发展", preview: "专题预览", intro: "企业的可持续发展战略、实践及相关资料将在业主提供后补充。", image: "示例图片 · 非业主素材", home: "首页", breadcrumb: "面包屑导航", pending: "具体内容与支持资料等待业主确认。", sections: ["战略与目标", "环境", "员工与安全", "治理"] },
  fr: { title: "Développement durable", preview: "APERÇU DU THÈME", intro: "La stratégie, les pratiques et les documents de l’entreprise seront ajoutés lorsqu’ils seront disponibles.", image: "Image d’exemple · non fournie par l’entreprise", home: "Accueil", breadcrumb: "Fil d’Ariane", pending: "Contenu et documents à confirmer.", sections: ["Stratégie et objectifs", "Environnement", "Personnes et sécurité", "Gouvernance"] },
  es: { title: "Sostenibilidad", preview: "VISTA PREVIA DEL TEMA", intro: "La estrategia, las prácticas y los documentos se añadirán cuando la empresa facilite la información.", image: "Imagen de ejemplo · no facilitada por la empresa", home: "Inicio", breadcrumb: "Ruta de navegación", pending: "Contenido y documentación pendientes de confirmación.", sections: ["Estrategia y objetivos", "Medio ambiente", "Personas y seguridad", "Gobernanza"] },
});

export function SustainabilityContent({ locale }: { locale: CatalogPageLocale }) {
  const copy = sustainabilityMessages[locale];
  return <main className="sustainability-page"><div className="faq-banner sustainability-banner"><span>{copy.image}</span></div><div className="inner sustainability-body">
    <nav className="crumb" aria-label={copy.breadcrumb}><Link href={`/${locale}`}>{copy.home}</Link> / {copy.title}</nav>
    <span className="eyebrow">{copy.preview}</span><h1>{copy.title}</h1><p className="sustainability-intro">{copy.intro}</p>
    <div className="sustainability-grid">{copy.sections.map((section, index) => <section key={section}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h2>{section}</h2><p>{copy.pending}</p></section>)}</div>
  </div></main>;
}
