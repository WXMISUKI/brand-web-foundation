import Link from "next/link";
import type { CSSProperties } from "react";
import { solutions, spanishSolutionLabels } from "../data/solutions";
import { englishSolutionImages, solutionImages } from "../data/section-media";
import { CropGuideSections } from "./crop-guide-sections";
import { frenchSolutionLabels } from "../i18n/navigation-detail";
import { solutionPageMessages } from "../i18n/solution-page-messages";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import type { CropGuideDraft } from "../data/crop-guide-drafts";

export function SolutionContent({ item, locale, cropGuide }: { item: (typeof solutions)[number]; locale: CatalogPageLocale; cropGuide?: CropGuideDraft | null }) {
  const copy = solutionPageMessages[locale];
  const prefix = `/${locale}`;
  const name = locale === "es" ? spanishSolutionLabels[item.slug] : locale === "fr" ? frenchSolutionLabels[item.slug] : locale === "zh" ? item.zh : item.en;
  const image = englishSolutionImages[item.slug] ?? solutionImages[item.slug];
  return <main><div className="detail-banner solution-banner" style={image ? ({ "--solution-image": `url("${image}")` } as CSSProperties) : undefined}><div><span>{copy.banner}</span><p>{name}</p></div><small>{copy.bannerSmall}</small></div><div className="inner"><nav className="crumb" aria-label={copy.breadcrumb}><Link href={`${prefix}#applications`}>{copy.root}</Link> / {name}</nav><div className="product-detail-layout"><article><div className="detail-intro"><span className="eyebrow">{copy.guide}</span><h1>{name}</h1><p className="lead">{copy.lead}</p><p>{copy.intro}</p></div>{item.group === "crop" ? <CropGuideSections locale={locale} slug={item.slug} draft={cropGuide}/> : <><section className="detail-section"><h2>{copy.context}</h2><p>{copy.contextText}</p></section><section className="detail-section"><h2>{copy.nutrition}</h2><p>{copy.nutritionText}</p></section><section className="detail-section"><h2>{copy.products}</h2><p>{copy.productsText}</p><Link className="text-link" href={`${prefix}/products`}>{copy.browse}</Link></section></>}</article><aside className="detail-contact"><h2>{copy.contactTitle}</h2><p>{copy.contactText}</p><Link className="button green" href={`${prefix}/contact`}>{copy.contact} <span aria-hidden="true">↗</span></Link></aside></div></div></main>;
}
