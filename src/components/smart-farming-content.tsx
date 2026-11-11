import Link from "next/link";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { smartFarmingMessages } from "../i18n/smart-farming-messages";
import { navigationDetail } from "../i18n/navigation-detail";

export function SmartFarmingContent({ locale }: { locale: CatalogPageLocale }) {
  const copy = smartFarmingMessages[locale];
  const navigation = navigationDetail[locale];
  return <main className="smart-farming">
    <section className="smart-farming-hero inner">
      <div><span className="eyebrow">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.intro}</p><nav aria-label={copy.navLabel}><Link href={`/${locale}/products`}>{navigation.catalog}</Link><Link href={`/${locale}/solutions`}>{navigation.methodsIndex}</Link></nav></div>
      <div className="smart-farming-visual"><span>{copy.visual}</span></div>
    </section>
    <div className="inner smart-farming-sections">
      <section id="web-tools"><div><h2>{navigation.catalog}</h2><p>{copy.webText}</p><Link className="text-link" href={`/${locale}/products`}>{navigation.exploreProducts} ↗</Link></div><div className="smart-farming-placeholder" aria-hidden="true"><span>KOMU</span></div></section>
      <span id="mobile-tools" hidden />
    </div>
  </main>;
}
