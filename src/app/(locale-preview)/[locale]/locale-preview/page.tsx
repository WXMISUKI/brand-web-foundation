import { notFound } from "next/navigation";
import { getLocale, locales } from "../../../../i18n/locales";

export const dynamic = "force-dynamic";

export default async function LocalePreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || process.env.CMS_EVAL !== "1" || process.env.NODE_ENV === "production") notFound();
  return <main className="inner locale-preview-page" dir={locale.direction}>
    <p className="eyebrow">LOCALE READINESS · PREVIEW</p>
    <h1>{locale.label}</h1>
    <p>This language route is available for non-production layout and fallback checks. Product, article and company translations remain pending owner review.</p>
    <dl>
      <div><dt>Locale code</dt><dd><code>{locale.code}</code></dd></div>
      <div><dt>HTML language</dt><dd><code>{locale.htmlLang}</code></dd></div>
      <div><dt>Direction</dt><dd><code>{locale.direction}</code></dd></div>
      <div><dt>Publication</dt><dd>Preview only · noindex</dd></div>
    </dl>
    <nav aria-label="Available locale previews">
      {locales.map(item => <a key={item.code} href={`/${item.code}/locale-preview`} lang={item.htmlLang} dir={item.direction}>{item.label}</a>)}
    </nav>
  </main>;
}
