import Link from "next/link";
import { getFeaturedCards, type FeaturedCard } from "../content/homepage";
import { heroHref } from "../data/hero-link";
import { heroMessages } from "../i18n/hero-messages";
import { aboutMessages } from "../i18n/about-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export async function HomeFeatured({ locale }: { locale: CatalogPageLocale }) {
  const en = locale === "en";
  const prefix = `/${locale}`, common = aboutMessages[locale], copy = heroMessages[locale];
  const examples = locale === "es" ? [
    { title: "Conoce la empresa", description: "La información de la empresa está pendiente de confirmación.", action: "Quiénes somos", href: `${prefix}/about` },
    { title: "Explora los productos", description: "Descubre productos de nutrición vegetal de ejemplo.", action: "Ver productos", href: `${prefix}/products` },
    { title: "Conocimientos de cultivo", description: "Explora temas de ejemplo sobre nutrición y cultivo.", action: "Ver artículos", href: `${prefix}/insights` },
  ] : locale === "fr" ? [
    { title: "Découvrir l’entreprise", description: "La présentation et les capacités de l’entreprise restent à confirmer.", action: "À propos", href: `${prefix}/about` },
    { title: "Explorer les catégories", description: "Découvrez des exemples de produits de nutrition végétale.", action: "Voir les produits", href: `${prefix}/products` },
    { title: "Découvrir les cultures", description: "Exemple de pratique de culture en attente de vérification.", action: "Voir l’exemple", href: `${prefix}/solutions/greenhouse` },
  ] : en ? [
    { title: "About the company", description: "Company profile and capabilities await owner confirmation.", action: "About the company", href: `${prefix}/about` },
    { title: "Explore product categories", description: "Browse sample plant nutrition products and categories.", action: "View products", href: `${prefix}/products` },
    { title: "Explore growing applications", description: "View an example growing scenario awaiting technical review.", action: "View sample guide", href: `${prefix}/solutions/greenhouse` },
  ] : [
    { title: "了解企业", description: "企业介绍和业务能力等待业主确认。", action: "查看企业介绍", href: "/zh/about" },
    { title: "探索产品系列", description: "浏览植物营养产品和分类示例。", action: "查看产品", href: "/zh/products" },
    { title: "了解种植应用", description: "查看等待技术审核的种植场景示例。", action: "查看示例方案", href: "/zh/solutions/greenhouse" },
  ];
  const configured = await getFeaturedCards(locale);
  const cards: FeaturedCard[] = configured.length ? configured : examples.map((card, index) => ({ id: String(index), title: card.title, description: card.description, actionLabel: card.action, actionPath: card.href.slice(3), image: null, sample: true }));
  return <section className="home-featured" aria-label={copy.topics}>{!configured.length && <p className="home-featured-note">{copy.featuredNote}</p>}<div className="home-featured-grid">{cards.map((card) => { const href = heroHref(locale, card.actionPath); return <article className="home-feature-card" key={card.id}><div className="home-feature-copy"><h2>{card.title ?? (en ? "Title pending translation" : locale === "zh" ? "标题待翻译" : common.pending)}</h2><p>{card.description ?? (en ? "Description pending translation." : locale === "zh" ? "介绍待翻译。" : common.pending)}</p>{href && card.actionLabel && <Link className="home-feature-link" href={href}>{card.actionLabel} <span aria-hidden="true">↗</span></Link>}</div><div className="home-feature-image">{card.image ? <img src={card.image.src} alt={card.image.alt ?? ""} loading="lazy" /> : !card.sample && <small>{copy.sampleImage}</small>}</div></article>; })}</div></section>;
}
