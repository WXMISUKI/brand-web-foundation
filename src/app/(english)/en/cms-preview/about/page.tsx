import { notFound } from "next/navigation";
import { AboutContent } from "../../../../../components/about-content";
import { getLocale, locales } from "../../../../../i18n/locales";

export const dynamic = "force-dynamic";

export default async function AboutPreview({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
  if (process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  const { locale: code = "en" } = await searchParams;
  const locale = getLocale(code);
  if (!locale) notFound();
  return <>
    <aside className="locale-preview-notice"><strong>Local-only preview · interface translations require review</strong><p>Links may lead to unfinished public pages. Content: {locale.label}</p><nav aria-label="Preview languages">{locales.map(item => <span key={item.code}><a href={`?locale=${item.code}`}>{item.label}</a>{" · "}</span>)}</nav></aside>
    <div lang={locale.htmlLang} dir={locale.direction}><AboutContent locale={locale.code}/></div>
  </>;
}
