import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "../../../../i18n/locales";
import "../../../styles.css";

export const dynamic = "force-dynamic";

function previewEnabled() {
  return process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production";
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || !previewEnabled()) return { robots: { index: false, follow: false } };
  return { title: `${locale.label} · Locale preview`, description: "Non-public locale readiness preview.", robots: { index: false, follow: false } };
}

export default async function LocalePreviewLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: code } = await params;
  const locale = getLocale(code);
  if (!locale || !previewEnabled()) notFound();
  return <html lang={locale.htmlLang} dir={locale.direction}><body>{children}</body></html>;
}
