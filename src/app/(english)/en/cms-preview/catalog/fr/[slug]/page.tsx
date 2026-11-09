import { notFound } from "next/navigation";
import { getSiteHighlights, getSiteProduct } from "../../../../../../../content/site-catalog";
import { CatalogProductDetail } from "../../../../../../../components/catalog-product-detail";

export const dynamic = "force-dynamic";
export default async function FrenchProductPreview({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const { slug } = await params, product = await getSiteProduct("fr", slug);
  if (!product) notFound();
  const highlights = await getSiteHighlights("fr", 3, slug);
  return <><aside className="locale-preview-notice"><strong>Local-only French product preview · translations require review</strong><p>Contact links lead to unfinished public pages.</p></aside><div lang="fr" dir="ltr"><CatalogProductDetail locale="fr" product={product} catalog={{ ...highlights, categories: [] }} basePath="/en/cms-preview/catalog/fr"/></div></>;
}
