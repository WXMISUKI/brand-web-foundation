import { notFound } from "next/navigation";
import { getSiteCatalog } from "../../../../content/site-catalog";
import { getLocale, locales } from "../../../../i18n/locales";

export const dynamic = "force-dynamic";

export default async function CatalogPreview({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const locale = getLocale(params.locale ?? "en")?.code;
  if (!locale) notFound();
  const catalog = await getSiteCatalog(locale);
  return <main><h1>Local CMS data verification</h1><p>Data source: {catalog.source} · {locale}</p><nav aria-label="Test locales">{locales.map(item => <span key={item.code}><a href={'?locale=' + item.code}>{item.label}</a>{" · "}</span>)}</nav>
    <h2>Categories</h2><ul>{catalog.categories.map(item => <li key={item.slug}>{item.name ?? "Translation pending"} ({item.slug})</li>)}</ul>
    <h2>Products</h2><ul>{catalog.products.map(item => <li key={item.slug}><strong>{item.name ?? "Translation pending"}</strong> · {item.category?.name ?? "Category translation pending"}<p>{item.intro ?? "Description pending"}</p>{item.media && <img src={item.media.src} alt={item.media.alt ?? ""} width={200}/>}</li>)}</ul>
  </main>;
}
