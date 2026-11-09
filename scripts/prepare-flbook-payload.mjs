import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(await fs.readFile(path.join(root, "src", "data", "flbook-import.json"), "utf8"));
const outputRoot = path.resolve(root, process.argv[2] || ".local/flbook-payload-staging");
const mediaRoot = path.join(outputRoot, "media");
const categoryMap = { "medium-nutrient": "medium-elements", "water-soluble": "water-soluble", "organic-water-soluble": "water-soluble", compound: "compound" };

await fs.mkdir(mediaRoot, { recursive: true });
const products = [];
for (const draft of source.products) {
  const input = path.join(root, "public", draft.imagePath.slice(1));
  const mediaFile = `${draft.slug}.webp`;
  await sharp(input).resize({ width: 900, height: 1200, fit: "contain", background: "#f5f8f3" }).webp({ quality: 88 }).toFile(path.join(mediaRoot, mediaFile));
  products.push({
    slug: draft.slug,
    categorySlug: categoryMap[draft.category],
    locales: {
      zh: { name: draft.displayName, intro: draft.intro },
      en: { name: draft.englishDisplayName, intro: draft.englishIntro },
    },
    media: { file: `media/${mediaFile}`, alt: { zh: `${draft.displayName}，图片来自官方产品页，文字来源于 FLBOOK 第 ${draft.sourcePages.join("、")} 页`, en: `${draft.englishDisplayName}, official product image; text sourced from owner-provided FLBOOK pages ${draft.sourcePages.join(", ")}` } },
    sourcePreviewPath: draft.sourcePreviewPath,
    sourceDetailPreviewPath: draft.sourceDetailPreviewPath,
    relatedPages: draft.sourceRelatedPages ?? [],
    specifications: (draft.specifications ?? []).map(spec => ({ id: `${draft.slug}-${spec.id}`, locales: spec.locales, label: spec.locales.en, unit: spec.unit, typical: spec.typical, minimum: spec.minimum, maximum: spec.maximum })),
    review: { status: draft.contentStatus, claimsVerified: draft.claimsVerified ?? false, placeholder: draft.imageStatus === "generated-placeholder" },
    assetStatus: draft.imageStatus,
    provenance: { sourceKind: source.source.kind, sourceUrl: source.source.url, viewerPages: draft.sourcePages, sourceNote: draft.sourceNote },
  });
}

const output = { schemaVersion: 1, source: source.source, categoryMap, categories: Object.values(categoryMap).filter((slug, index, all) => all.indexOf(slug) === index), products };
await fs.writeFile(path.join(outputRoot, "flbook-payload-import.json"), `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ok: true, output: path.relative(root, outputRoot), products: products.length, mediaFormat: "webp", status: products.every(product => product.review.status === "approved") ? "approved" : "owner-review" }, null, 2));
