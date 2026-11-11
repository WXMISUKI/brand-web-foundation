import Link from "next/link";
import { referenceMethodLabel, referenceMethodSolutions } from "../data/reference-index";
import { referenceRouteMessages } from "../i18n/reference-route-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";

export function SolutionsIndexPage({ locale }: { locale: CatalogPageLocale }) {
  const copy = referenceRouteMessages[locale];
  return <main><div className="detail-banner reference-index-banner"><div><span>{copy.methodsTitle}</span><p>{copy.methodsIntro}</p></div></div><div className="inner reference-index-page"><nav className="crumb" aria-label={copy.breadcrumb}><Link href={`/${locale}`}>{copy.home}</Link> / {copy.methodsTitle}</nav><header className="reference-index-heading"><span className="eyebrow">{copy.methodsTitle}</span><h1>{copy.methodsTitle}</h1><p>{copy.methodsIntro}</p></header><section aria-labelledby="methods-list-title"><h2 id="methods-list-title">{copy.methods}</h2><div className="reference-index-grid">{referenceMethodSolutions.map((solution, index) => <Link className="reference-index-card" key={solution.slug} href={`/${locale}/solutions/${encodeURIComponent(solution.slug)}`}><span className="reference-index-card-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><strong>{referenceMethodLabel(locale, solution)}</strong><small>{copy.view}</small><span>{copy.view} ↗</span></Link>)}</div></section><Link className="text-link" href={`/${locale}`}>← {copy.backHome}</Link></div></main>;
}
