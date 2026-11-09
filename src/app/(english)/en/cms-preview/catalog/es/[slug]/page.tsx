import { notFound } from "next/navigation";
import { getSiteHighlights, getSiteProduct } from "../../../../../../../content/site-catalog";
import { CatalogProductDetail } from "../../../../../../../components/catalog-product-detail";
export const dynamic = "force-dynamic";
export default async function SpanishProductPreview({ params }: { params: Promise<{ slug: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const { slug } = await params, product = await getSiteProduct("es", slug);
  if (!product) notFound();
  const highlights = await getSiteHighlights("es", 3, slug);
  return <><aside className="locale-preview-notice"><strong>Local-only Spanish product preview · translations require review</strong><p>Some links lead to unfinished public pages.</p></aside><div lang="es" dir="ltr"><CatalogProductDetail locale="es" product={product} catalog={{ ...highlights, categories: [] }} basePath="/en/cms-preview/catalog/es"/></div></>;
}
