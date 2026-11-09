import type { ProductDetails, ProductSpecification } from "../data/products";
import type { CatalogPageLocale } from "../i18n/catalog-messages";
import { productDetailMessages } from "../i18n/product-detail-messages";
import { aboutMessages } from "../i18n/about-messages";

export function ProductInformation({ locale, category, details, specifications, sample }: { locale: CatalogPageLocale; category: string; details?: ProductDetails; specifications?: ProductSpecification[]; sample: boolean }) {
  const copy = productDetailMessages[locale], common = aboutMessages[locale];
  const pending = locale === "en" ? "Contact the KOMU team for current details" : locale === "zh" ? "最新资料请联系康姆团队" : common.pending;
  const fields = [[copy.category, category + (sample ? ` · ${common.sample}` : "")], [copy.materials, details?.materials], [copy.packaging, details?.packaging], [copy.uses, details?.uses], [copy.instructions, details?.instructions]];
  return <><section className="detail-section" aria-labelledby="product-information"><span className="eyebrow">{copy.information}</span><h2 id="product-information">{copy.information}</h2><p>{copy.informationNote}</p><dl className="detail-facts">{fields.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value || pending}</dd></div>)}</dl></section>
    <section className="detail-section" aria-labelledby="product-specification"><span className="eyebrow">{copy.specs}</span><h2 id="product-specification">{copy.specs}</h2><p>{copy.specNote}</p><p className="table-scroll-hint" id="specification-scroll-hint">{copy.scroll}</p><div className="table-scroll" role="region" aria-labelledby="product-specification" aria-describedby="specification-scroll-hint" tabIndex={0}><table className="spec-table"><thead><tr>{copy.columns.map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{specifications?.length ? specifications.map(spec=>{const label=spec.label[locale];return <tr key={spec.id}><th scope="row">{label || common.pending}</th>{label ? <><td>{spec.unit || pending}</td><td>{spec.typical || pending}</td><td>{spec.minimum || pending}</td><td>{spec.maximum || pending}</td></> : <td colSpan={4}>{copy.hidden}</td>}</tr>;}) : <tr><td colSpan={5}>{copy.emptySpecs}</td></tr>}</tbody></table></div></section></>;
}
