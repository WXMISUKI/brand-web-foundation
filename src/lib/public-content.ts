import type { LocaleCode } from "../i18n/locales";
import candidates from "../data/official-site-product-candidates.json" with { type: "json" };
import flbook from "../data/flbook-import.json" with { type: "json" };
import phase1 from "../data/flbook-localizations-phase1.json" with { type: "json" };
import phase2 from "../data/flbook-localizations-phase2-it.json" with { type: "json" };
import phase3 from "../data/flbook-localizations-phase3-tr.json" with { type: "json" };
import phase4 from "../data/flbook-localizations-phase4-th.json" with { type: "json" };
import phase5 from "../data/flbook-localizations-phase5-nl.json" with { type: "json" };
import phase6 from "../data/flbook-localizations-phase6-ro.json" with { type: "json" };
import phase7 from "../data/flbook-localizations-phase7-el.json" with { type: "json" };
import phase8 from "../data/flbook-localizations-phase8-he.json" with { type: "json" };

const contactCopy: Record<LocaleCode, string> = {
  en: "Contact the KOMU team for current product information.",
  zh: "请联系我们了解产品详情和最新技术资料。",
  es: "Contacte con el equipo de KOMU para obtener información actualizada sobre el producto.",
  fr: "Contactez l’équipe KOMU pour obtenir les informations produit à jour.",
  pt: "Contacte a equipa KOMU para obter informações atualizadas sobre o produto.",
  ru: "Свяжитесь с командой KOMU, чтобы получить актуальную информацию о продукте.",
  it: "Contatta il team KOMU per informazioni aggiornate sul prodotto.",
  tr: "Güncel ürün bilgileri için KOMU ekibiyle iletişime geçin.",
  th: "ติดต่อทีม KOMU เพื่อขอข้อมูลผลิตภัณฑ์ล่าสุด",
  nl: "Neem contact op met het KOMU-team voor actuele productinformatie.",
  ro: "Contactați echipa KOMU pentru informații actualizate despre produs.",
  el: "Επικοινωνήστε με την ομάδα KOMU για ενημερωμένες πληροφορίες προϊόντος.",
  he: "לקבלת מידע עדכני על המוצר, פנו לצוות KOMU.",
};
const legacyCandidateIntros = new Set(candidates.products.flatMap(({ name }) => [
  `The official KOMU product center lists ${name}. Model, packaging, technical values and claims remain subject to formal review.`,
  `原官网产品中心列出“${name}”。型号、包装、技术参数和 claims 仍以正式审核资料为准。`,
]));
const chineseIntroductions: Record<string, string> = {
  "medium-element-granular-draft": "非水溶中量元素肥料，含钙、镁、硅、锌等营养元素。",
  "organic-water-soluble-growth-draft": "有机水溶肥料，亚磷酸型，包装规格约 20 kg。",
  "organic-water-soluble-quality-draft": "有机水溶肥料，亚磷酸型，包装规格约 20 kg。",
  "organic-water-soluble-absorption-draft": "有机水溶肥料，包装规格约 10 kg。",
  "organic-water-soluble-root-draft": "有机水溶肥料，包装规格约 10 kg。",
  "suspended-fertilizer-120-60-400-draft": "悬浮型大量元素水溶肥料，标注 120-60-400+TE，包装规格 10 kg。",
  "suspended-fertilizer-200-150-200-draft": "悬浮型大量元素水溶肥料，标注 200-150-200+TE，包装规格 10 kg。",
  "massive-element-liquid-quality-draft": "液体大量元素水溶肥料，包装规格 1000 mL。",
  "medium-element-liquid-draft": "液体中量元素水溶肥料，含钙、镁、硅，包装规格 1000 mL。",
  "organic-inorganic-compound-draft": "有机无机复混肥料，包装规格 50 kg。",
};
const legacyChineseIntros = new Map(flbook.products.map(product => [product.intro, chineseIntroductions[product.slug]]));
const localizedFlbookIntros = new Map<string, string>();
for (const phase of [phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8]) {
  for (const entries of Object.values(phase.products)) {
    for (const [locale, entry] of Object.entries(entries)) {
      const item = entry as { name: string; intro: string };
      localizedFlbookIntros.set(`${locale}\u0000${item.intro}`, `${item.name}. ${contactCopy[locale as LocaleCode]}`);
    }
  }
}

const legacyEnglishIntros: Record<string, string> = {
  "Brochure page 18 presents a Huangjinwu liquid massive-element water-soluble fertilizer positioned for yield and quality improvement, shown in a 1000 mL pack. Formula and application details follow the brochure page.": "Huangjinwu liquid water-soluble fertilizer for crop nutrition, supplied in a 1000 mL pack. Contact us for current product and application details.",
  "Brochure pages 6–7 present a non-water-soluble secondary nutrient fertilizer for plant nutrition, positioned around Ca, Mg, Si and Zn supply, photosynthesis support, rooting, stress resilience and soil water management. Packaging and formula follow the brochure page.": "A non-water-soluble secondary nutrient fertilizer supplying calcium, magnesium, silicon and zinc. Contact us for current product and application details.",
  "Brochure page 20 presents a Huangjinwu liquid secondary-element water-soluble fertilizer positioned around calcium, magnesium and silicon supplementation with lasting nutrient effect, shown in a 1000 mL pack. Formula and application details follow the brochure page.": "Huangjinwu liquid water-soluble fertilizer containing calcium, magnesium and silicon, supplied in a 1000 mL pack. Contact us for current product and application details.",
  "Brochure page 22 presents a Kangmu organic-inorganic compound fertilizer positioned around balanced nutrition and improved soil structure, shown in a 50 kg pack. Formula and claims await review.": "Kangmu organic-inorganic compound fertilizer supplied in a 50 kg pack. Contact us for current product and application details.",
  "Brochure page 22 presents a Kangmu organic-inorganic compound fertilizer positioned around balanced nutrition and improved soil structure, shown in a 50 kg pack. The page description is used as the public summary.": "Kangmu organic-inorganic compound fertilizer supplied in a 50 kg pack. Contact us for current product and application details.",
  "Brochure page 10 presents an organic water-soluble fertilizer positioned around stress recovery, fruit sizing and colour development, soil activation and multiple physiological functions. The pack is shown at about 10 kg; the page description is used as the public summary.": "Organic water-soluble fertilizer supplied in an approximately 10 kg pack. Contact us for current product and application details.",
  "Brochure page 8 presents an organic water-soluble fertilizer marked for growth, leaf appearance and rooting, with a phosphite-oriented positioning and an approximately 20 kg pack. The description follows the brochure page.": "Organic water-soluble fertilizer with phosphite, supplied in an approximately 20 kg pack. Contact us for current product and application details.",
  "Brochure page 9 shows a second organic water-soluble fertilizer positioned for growth, leaf development and rooting, with an approximately 20 kg pack. The description follows the brochure page.": "Organic water-soluble fertilizer supplied in an approximately 20 kg pack. Contact us for current product and application details.",
  "Brochure page 12 presents an organic water-soluble fertilizer positioned around root growth and nutrient absorption, shown in an approximately 10 kg pack. The description follows the brochure page.": "Organic water-soluble fertilizer supplied in an approximately 10 kg pack. Contact us for current product and application details.",
  "Brochure page 14 presents a Kangmu suspended water-soluble fertilizer marked 120-60-400+TE, positioned for fruit sizing and colour development, with a 10 kg pack. Values and use ranges follow the brochure page.": "Kangmu suspended water-soluble fertilizer marked 120-60-400+TE, supplied in a 10 kg pack. Contact us for current product and application details.",
  "Brochure page 16 presents a Kangmu suspended water-soluble fertilizer marked 200-150-200+TE, positioned around balanced nutrition and root support, with a 10 kg pack. Values and use ranges follow the brochure page.": "Kangmu suspended water-soluble fertilizer marked 200-150-200+TE, supplied in a 10 kg pack. Contact us for current product and application details.",
};

/** Replace known imported review templates while preserving edited product copy. */
export function publicProductIntro(value: unknown, locale: LocaleCode = "en"): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (locale === "zh" && legacyChineseIntros.has(trimmed)) return legacyChineseIntros.get(trimmed) ?? trimmed;
  const localizedFlbook = localizedFlbookIntros.get(`${locale}\u0000${trimmed}`);
  if (localizedFlbook) return localizedFlbook;
  if (locale === "en" && legacyEnglishIntros[trimmed]) return legacyEnglishIntros[trimmed];
  if (trimmed === "This product is listed in the official KOMU product center. Contact us for current product information." || legacyCandidateIntros.has(trimmed)) return contactCopy[locale];
  return trimmed;
}

// Exact historical imports only; CMS editor changes are returned unchanged.
const legacyEnglishDetails: Record<string, string> = {
  "1000 mL pack shown in the source page; confirm current packaging.": "1000 mL pack; contact us to confirm current packaging.",
  "50 kg pack shown in the source page; confirm current packaging.": "50 kg pack; contact us to confirm current packaging.",
  "Approximately 10 kg is shown in the source page; confirm current packaging.": "Approximately 10 kg; contact us to confirm current packaging.",
  "Approximately 20 kg is shown in the source page; confirm current packaging.": "Approximately 20 kg; contact us to confirm current packaging.",
  "10 kg pack shown in the source page; confirm current packaging.": "10 kg pack; contact us to confirm current packaging.",
  "Water-soluble NPK with trace elements; 120-60-400+TE follows the source page and needs current-sheet confirmation.": "Water-soluble NPK with trace elements; 120-60-400+TE. Contact us for the current technical sheet.",
  "Water-soluble NPK with trace elements; 200-150-200+TE follows the source page and needs current-sheet confirmation.": "Water-soluble NPK with trace elements; 200-150-200+TE. Contact us for the current technical sheet.",
  "Source-page positioning is yield and quality support; confirm crop, timing and rate.": "Contact us to confirm the crop, timing and application rate.",
  "Source-page positioning is calcium, magnesium and silicon supplementation; confirm crop, timing and rate.": "Contact us to confirm the crop, timing and application rate.",
  "Source-page positioning is balanced nutrition and soil-structure support; confirm crop, timing and rate.": "Contact us to confirm the crop, timing and application rate.",
  "Source-page positioning is fruit sizing and colour development; confirm crop, timing and rate.": "Contact us to confirm the crop, timing and application rate.",
  "Source-page positioning is balanced nutrition and root support; confirm crop, timing and rate.": "Contact us to confirm the crop, timing and application rate.",
};
const legacyChineseDetails: Record<string, string> = {
  "来源页显示 1000mL；当前包装请确认。": "包装规格 1000 mL，当前包装请联系我们确认。",
  "来源页显示 50KG；当前包装请确认。": "包装规格 50 kg，当前包装请联系我们确认。",
  "来源页显示约 10KG；当前包装请确认。": "包装规格约 10 kg，当前包装请联系我们确认。",
  "来源页显示约 20KG；当前包装请确认。": "包装规格约 20 kg，当前包装请联系我们确认。",
  "来源页显示 10KG；当前包装请确认。": "包装规格 10 kg，当前包装请联系我们确认。",
  "含微量元素的水溶 NPK；120-60-400+TE 来自来源页，需以最新资料确认。": "含微量元素的水溶 NPK，标注 120-60-400+TE，具体信息请以最新资料为准。",
  "含微量元素的水溶 NPK；200-150-200+TE 来自来源页，需以最新资料确认。": "含微量元素的水溶 NPK，标注 200-150-200+TE，具体信息请以最新资料为准。",
  "来源页定位为产量和品质支持；作物、时期和用量请确认。": "作物、施用时期和用量请联系我们确认。",
  "来源页定位为补充钙、镁、硅；作物、时期和用量请确认。": "作物、施用时期和用量请联系我们确认。",
  "来源页定位为养分均衡和土壤结构支持；作物、时期和用量请确认。": "作物、施用时期和用量请联系我们确认。",
  "来源页定位为膨果和促进着色；作物、时期和用量请确认。": "作物、施用时期和用量请联系我们确认。",
  "来源页定位为营养均衡和促根；作物、时期和用量请确认。": "作物、施用时期和用量请联系我们确认。",
};

export function publicProductDetail(value: unknown, locale: LocaleCode): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  if (locale === "zh" && legacyChineseDetails[value]) return legacyChineseDetails[value];
  if (legacyEnglishDetails[value]) {
    if (locale === "en") return legacyEnglishDetails[value];
    const fact = value.match(/(?:\d+(?:-\d+){2}\+TE|\d+\s?(?:kg|mL))/i)?.[0];
    return `${fact ? `${fact}. ` : ""}${contactCopy[locale]}`;
  }
  return value;
}
