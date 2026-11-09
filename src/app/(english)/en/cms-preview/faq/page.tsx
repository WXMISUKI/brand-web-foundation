import { notFound } from "next/navigation";
import { FaqContent } from "../../../../../components/faq-content";
import { filterFaqContent, getFaqContent } from "../../../../../content/faq";
import { getLocale, locales } from "../../../../../i18n/locales";

export const dynamic = "force-dynamic";
export default async function FaqPreview({ searchParams }: { searchParams: Promise<{ locale?: string; q?: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const { locale: code = "en", q } = await searchParams, locale = getLocale(code);
  if (!locale) notFound();
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const data = filterFaqContent(await getFaqContent(locale.code), query);
  return <><aside className="locale-preview-notice"><strong>Local-only preview · interface translations require review</strong><p>Some links point to unfinished public pages. Content: {locale.label}</p><nav aria-label="Preview languages">{locales.map(item => <span key={item.code}><a href={`?locale=${item.code}`}>{item.label}</a>{" · "}</span>)}</nav></aside><div lang={locale.htmlLang} dir={locale.direction}><FaqContent key={`${locale.code}:${query}`} locale={locale.code} data={data} query={query} preview/></div></>;
}
