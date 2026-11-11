import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-import.json"), "utf8"));
const phase1 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase1.json"), "utf8"));
const phase2 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase2-it.json"), "utf8"));
const phase3 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase3-tr.json"), "utf8"));
const phase4 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase4-th.json"), "utf8"));
const phase5 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase5-nl.json"), "utf8"));
const phase6 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase6-ro.json"), "utf8"));
const phase7 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase7-el.json"), "utf8"));
const phase8 = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-localizations-phase8-he.json"), "utf8"));
const localizationSources = [phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8];
const localizationLocales = [...new Set(localizationSources.flatMap(source => source.locales))];
const productLocalizations = (slug) => Object.assign({}, ...localizationSources.map(source => source.products[slug] ?? {}));
const localizedValue = (source, value) => typeof value === "string" ? { [source.locales[0]]: value } : (value ?? {});
const specificationLabels = (id) => Object.assign({}, ...localizationSources.map(source => localizedValue(source, source.specificationLabels[id])));
const categoryNames = Object.fromEntries(Object.keys(phase1.categoryNames).map((slug) => [slug, Object.assign({}, ...localizationSources.map(source => localizedValue(source, source.categoryNames?.[slug])))]));
const outputRoot = path.resolve(root, process.argv[2] || ".local/flbook-payload-staging");
const mediaRoot = path.join(outputRoot, "media");
const categoryMap = { "medium-nutrient": "medium-elements", "water-soluble": "water-soluble", "organic-water-soluble": "water-soluble", compound: "compound" };

await fs.mkdir(mediaRoot, { recursive: true });
const products = [];
for (const draft of source.products) {
  const translated = productLocalizations(draft.slug);
  if (!translated || localizationLocales.some(locale => !translated[locale]?.name || !translated[locale]?.intro)) throw new Error(`Missing product translations: ${draft.slug}`);
  const input = path.join(root, "public", draft.imagePath.slice(1));
  const mediaFile = `${draft.slug}.webp`;
  await sharp(input).resize({ width: 900, height: 1200, fit: "contain", background: "#f5f8f3" }).webp({ quality: 88 }).toFile(path.join(mediaRoot, mediaFile));
  products.push({
    slug: draft.slug,
    categorySlug: categoryMap[draft.category],
    locales: {
      zh: { name: draft.displayName, intro: draft.intro },
      en: { name: draft.englishDisplayName, intro: draft.englishIntro },
      ...translated,
    },
    media: { file: `media/${mediaFile}`, alt: { zh: draft.displayName, en: draft.englishDisplayName, ...Object.fromEntries(localizationLocales.map(locale => [locale, translated[locale].name])) } },
    sourcePreviewPath: draft.sourcePreviewPath,
    sourceDetailPreviewPath: draft.sourceDetailPreviewPath,
    relatedPages: draft.sourceRelatedPages ?? [],
    specifications: (draft.specifications ?? []).map(spec => {
      const labels = { ...spec.locales };
      for (const locale of localizationLocales) {
        const translatedLabel = specificationLabels(spec.id)[locale];
        if (!translatedLabel) throw new Error(`Missing ${locale} specification label: ${spec.id}`);
        labels[locale] = translatedLabel;
      }
      return { id: `${draft.slug}-${spec.id}`, locales: labels, label: labels.en, unit: spec.unit, typical: spec.typical, minimum: spec.minimum, maximum: spec.maximum };
    }),
    review: { status: draft.contentStatus, claimsVerified: draft.claimsVerified ?? false, placeholder: draft.imageStatus === "generated-placeholder" },
    assetStatus: draft.imageStatus,
    provenance: { sourceKind: source.source.kind, sourceUrl: source.source.url, viewerPages: draft.sourcePages, sourceNote: draft.sourceNote },
  });
}

const categories = Object.values(categoryMap).filter((slug, index, all) => all.indexOf(slug) === index).map(slug => ({ slug, locales: { en: slug === "water-soluble" ? "Water-soluble" : slug === "medium-elements" ? "Secondary nutrients" : "Compound fertilizer", zh: slug === "water-soluble" ? "水溶肥" : slug === "medium-elements" ? "中量元素" : "复合肥", ...categoryNames[slug] } }));
const output = { schemaVersion: 2, source: source.source, locales: ["en", "zh", ...localizationLocales], categoryMap, categories, products };
await fs.writeFile(path.join(outputRoot, "flbook-payload-import.json"), `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ok: true, output: path.relative(root, outputRoot), products: products.length, mediaFormat: "webp", status: products.every(product => product.review.status === "approved") ? "approved" : "owner-review" }, null, 2));
