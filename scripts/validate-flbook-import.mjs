import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "src", "data", "flbook-import.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const phase1 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase1.json"), "utf8"));
const phase2 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase2-it.json"), "utf8"));
const phase3 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase3-tr.json"), "utf8"));
const phase4 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase4-th.json"), "utf8"));
const phase5 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase5-nl.json"), "utf8"));
const phase6 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase6-ro.json"), "utf8"));
const phase7 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase7-el.json"), "utf8"));
const phase8 = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "flbook-localizations-phase8-he.json"), "utf8"));
const localizationSources = [phase1, phase2, phase3, phase4, phase5, phase6, phase7, phase8];
const localizationLocales = [...new Set(localizationSources.flatMap(source => source.locales))];
const productLocalizations = (slug) => Object.assign({}, ...localizationSources.map(source => source.products[slug] ?? {}));
const localizedValue = (source, value) => typeof value === "string" ? { [source.locales[0]]: value } : (value ?? {});
const specificationLabels = (id) => Object.assign({}, ...localizationSources.map(source => localizedValue(source, source.specificationLabels[id])));
const categoryNames = Object.fromEntries(Object.keys(phase1.categoryNames).map((slug) => [slug, Object.assign({}, ...localizationSources.map(source => localizedValue(source, source.categoryNames?.[slug])))]));
const allowedCategories = new Set(["medium-nutrient", "water-soluble", "organic-water-soluble", "compound"]);
const errors = [];
const displayNames = new Set();
const englishDisplayNames = new Set();

if (source.schemaVersion !== 1) errors.push("schemaVersion must be 1");
if (source.source?.rights !== "owner-provided") errors.push("source rights must be owner-provided");
if (!Array.isArray(source.products) || source.products.length !== 10) errors.push("expected exactly 10 product drafts");

const slugs = new Set();
for (const [index, product] of (source.products ?? []).entries()) {
  const prefix = `products[${index}]`;
  if (!product.slug || slugs.has(product.slug)) errors.push(`${prefix}.slug must be unique`);
  slugs.add(product.slug);
  if (!product.displayName) errors.push(`${prefix}.displayName is required`);
  if (!product.englishDisplayName) errors.push(`${prefix}.englishDisplayName is required`);
  if (displayNames.has(product.displayName)) errors.push(`${prefix}.displayName must be unique`);
  if (englishDisplayNames.has(product.englishDisplayName)) errors.push(`${prefix}.englishDisplayName must be unique`);
  displayNames.add(product.displayName);
  englishDisplayNames.add(product.englishDisplayName);
  if (!product.intro) errors.push(`${prefix}.intro is required`);
  if (!product.englishIntro) errors.push(`${prefix}.englishIntro is required`);
  const translations = productLocalizations(product.slug);
  for (const locale of localizationLocales) {
    if (!translations?.[locale]?.name || !translations?.[locale]?.intro) errors.push(`${prefix}.${locale} name and source-based intro are required`);
  }
  if (!allowedCategories.has(product.category)) errors.push(`${prefix}.category is not mapped`);
  if (!Array.isArray(product.sourcePages) || product.sourcePages.length === 0 || product.sourcePages.some((page) => !Number.isInteger(page) || page < 1 || page > source.source.viewerPages)) errors.push(`${prefix}.sourcePages must contain valid viewer page numbers`);
  const firstSourcePage = product.sourcePages?.[0];
  if (Number.isInteger(firstSourcePage) && (!product.intro?.includes(`第 ${firstSourcePage}`) || !new RegExp(`pages? ${firstSourcePage}`).test(product.englishIntro ?? ""))) errors.push(`${prefix}.localized intros must cite the first source page`);
  if (product.sourceRelatedPages !== undefined && (!Array.isArray(product.sourceRelatedPages) || product.sourceRelatedPages.some((related) => !related || !Number.isInteger(related.page) || related.page < 1 || related.page > source.source.viewerPages || product.sourcePages.includes(related.page) || !["excluded-candidate", "cross-page-context"].includes(related.role)))) errors.push(`${prefix}.sourceRelatedPages must contain valid adjacent context pages outside sourcePages`);
  if (!product.sourcePreviewPath?.startsWith("/images/flbook-pages/")) errors.push(`${prefix}.sourcePreviewPath must point to the captured page preview folder`);
  if (!["owner-review", "approved"].includes(product.contentStatus)) errors.push(`${prefix}.contentStatus must be owner-review or approved`);
  if (!["generated-placeholder", "owner-supplied", "authorized-example", "pending"].includes(product.imageStatus)) errors.push(`${prefix}.imageStatus is invalid`);
  if (!product.imagePath?.startsWith("/images/flbook-pages/") && !product.imagePath?.startsWith("/images/flbook-drafts/") && !product.imagePath?.startsWith("/images/official-site/")) errors.push(`${prefix}.imagePath must point to a captured, official-site or generated asset folder`);
  const assetPath = path.join(root, "public", product.imagePath.slice(1));
  if (!fs.existsSync(assetPath)) errors.push(`${prefix}.imagePath does not exist: ${product.imagePath}`);
  if (product.officialImageSource !== undefined && !/^http:\/\/m\.zgkomu\.cn\/display\/\d+\.html$/.test(product.officialImageSource)) errors.push(`${prefix}.officialImageSource must point to an official product detail page`);
  const previewPath = path.join(root, "public", product.sourcePreviewPath?.slice(1) ?? "");
  if (!fs.existsSync(previewPath)) errors.push(`${prefix}.sourcePreviewPath does not exist: ${product.sourcePreviewPath}`);
  if (product.sourceDetailPreviewPath !== undefined) {
    if (!product.sourceDetailPreviewPath.startsWith("/images/flbook-pages/")) errors.push(`${prefix}.sourceDetailPreviewPath must point to the captured page preview folder`);
    const detailPreviewPath = path.join(root, "public", product.sourceDetailPreviewPath.slice(1));
    if (!fs.existsSync(detailPreviewPath)) errors.push(`${prefix}.sourceDetailPreviewPath does not exist: ${product.sourceDetailPreviewPath}`);
  }
  if (product.contentStatus === "owner-review" && product.claimsVerified === true) errors.push(`${prefix}.claimsVerified must remain false while contentStatus is owner-review`);
  if (!Array.isArray(product.specifications)) errors.push(`${prefix}.specifications must be an array`);
  for (const [specIndex, spec] of (product.specifications ?? []).entries()) {
    if (!spec?.id || !spec.locales?.zh || !spec.locales?.en || !spec.unit || (!spec.typical && !spec.minimum && !spec.maximum)) errors.push(`${prefix}.specifications[${specIndex}] must include bilingual label, unit and a value`);
    for (const locale of localizationLocales) if (!specificationLabels(spec.id)[locale]) errors.push(`${prefix}.specifications[${specIndex}] is missing ${locale} label`);
  }
}
for (const category of ["water-soluble", "medium-elements", "compound"]) {
  for (const locale of localizationLocales) if (!categoryNames[category]?.[locale]) errors.push(`category ${category} is missing ${locale} translation`);
}

if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, source: source.source.url, productDrafts: source.products.length, status: source.products.every(product => product.contentStatus === "approved") ? "approved" : "owner-review" }, null, 2));
}
