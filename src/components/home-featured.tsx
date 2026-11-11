import Link from "next/link";
import { getFeaturedCards, type FeaturedCard } from "../content/homepage";
import { heroHref } from "../data/hero-link";
import { heroMessages } from "../i18n/hero-messages";
import { homeFeaturedMessages } from "../i18n/home-featured-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export async function HomeFeatured({ locale }: { locale: CatalogPageLocale }) {
  const prefix = `/${locale}`, copy = heroMessages[locale], examples = homeFeaturedMessages[locale];
  const exampleCards = [
    { title: examples.aboutTitle, description: examples.aboutDescription, action: examples.aboutAction, href: `${prefix}/about` },
    { title: examples.productsTitle, description: examples.productsDescription, action: examples.productsAction, href: `${prefix}/products` },
    { title: examples.solutionsTitle, description: examples.solutionsDescription, action: examples.solutionsAction, href: `${prefix}/${locale === "es" ? "insights" : "solutions/greenhouse"}` },
  ];
  const configured = await getFeaturedCards(locale);
  const cards: FeaturedCard[] = configured.length ? configured : exampleCards.map((card, index) => ({ id: String(index), title: card.title, description: card.description, actionLabel: card.action, actionPath: card.href.slice(prefix.length), image: null, sample: true }));
  return <section className="home-featured" aria-label={copy.topics}>{!configured.length && <p className="home-featured-note">{copy.featuredNote}</p>}<div className="home-featured-grid">{cards.map((card) => { const href = heroHref(locale, card.actionPath); return <article className="home-feature-card" key={card.id}><div className="home-feature-copy"><h2>{card.title ?? examples.pendingTitle}</h2><p>{card.description ?? examples.pendingDescription}</p>{href && card.actionLabel && <Link className="home-feature-link" href={href}>{card.actionLabel} <span aria-hidden="true">↗</span></Link>}</div><div className="home-feature-image">{card.image ? <img src={card.image.src} alt={card.image.alt ?? ""} loading="lazy" /> : !card.sample && <small>{copy.sampleImage}</small>}</div></article>; })}</div></section>;
}
