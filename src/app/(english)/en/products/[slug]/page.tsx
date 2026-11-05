import { ProductInformation } from "../../../../../components/product-information";
import { EnglishHeader, EnglishFooter } from "../../../../../components/english-site";
import Link from "next/link";
import { notFound } from "next/navigation";
import { englishCategories, englishProducts } from "../../../../../data/english-samples";

export default async function EnglishProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = englishProducts.find((item) => item.slug === slug);
  if (!product) notFound();
  return <div lang="en"><EnglishHeader chinesePath={`/products/${product.slug}`} /><main><div className="detail-banner"><div><span>PLANT NUTRITION · SAMPLE VISUAL</span><p>Nutrition for every stage of growth</p></div><small>Sample image · not owner material</small></div><div className="inner"><nav className="crumb" aria-label="Breadcrumb"><Link href="/en/products">Product catalog</Link> / {product.translation?.name ?? "Translation pending"}</nav><div className="product-detail-layout"><article><div className="detail-intro"><span className="eyebrow">PRODUCT DETAILS · SAMPLE</span><h1>{product.translation?.name ?? "Translation pending"}</h1><p className="lead">{product.translation?.intro ?? "This product translation has not been supplied."}</p><p>Composition, specifications and applications await owner review.</p></div><ProductInformation locale="en" category={englishCategories[product.categoryId]} details={product.details?.en} specifications={product.specifications} /></article><aside className="detail-contact"><h2>Product enquiries</h2><p>Contact details and enquiry service await owner confirmation.</p><Link href={`/products/${product.slug}`}>View Chinese prototype →</Link></aside></div></div></main><EnglishFooter /></div>;
}
