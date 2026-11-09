import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { getCropGuideDraft } from "../data/crop-guide-drafts";
import type { CropGuideDraft } from "../data/crop-guide-drafts";

const ids = ["crop-overview", "crop-stages", "crop-nutrition", "crop-products", "crop-resources"];

export function CropGuideSections({ locale, slug = "default", draft }: { locale: CatalogPageLocale; slug?: string; draft?: CropGuideDraft | null }) {
  const c = draft ?? getCropGuideDraft(slug, locale);
  return <>
    <nav className="crop-guide-nav" aria-label={c.nav}>{ids.map((id, index) => <a key={id} href={'#' + id}>{c.sections[index]}</a>)}</nav>
    <section className="detail-section crop-guide-section" id={ids[0]}><h2>{c.sections[0]}</h2><p>{c.overview}</p></section>
    <section className="detail-section crop-guide-section" id={ids[1]}><h2>{c.sections[1]}</h2><div className="crop-guide-placeholder"><strong>{c.stages}</strong><p>{c.stagesText}</p></div></section>
    <section className="detail-section crop-guide-section" id={ids[2]}><h2>{c.sections[2]}</h2><p>{c.nutrition}</p></section>
    <section className="detail-section crop-guide-section" id={ids[3]}><h2>{c.sections[3]}</h2><p>{c.products}</p><Link className="text-link" href={`/${locale}/products`}>{c.browse}</Link></section>
    <section className="detail-section crop-guide-section" id={ids[4]}><h2>{c.sections[4]}</h2><div className="crop-guide-placeholder"><strong>{c.resources}</strong><p>{c.resourcesText}</p></div></section>
  </>;
}
