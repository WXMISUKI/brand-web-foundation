import { notFound } from "next/navigation";
import { LocalizedShell, readySolutionsLocale } from "../../../../../components/localized-shell";
import { SolutionContent } from "../../../../../components/solution-content";
import { solutions } from "../../../../../data/solutions";
import { getPayloadCropGuide } from "../../../../../content/crop-guides";
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: code, slug } = await params, locale = readySolutionsLocale(code);
  const item = solutions.find(solution => solution.slug === slug);
  if (!item) notFound();
  const cropGuide = item.group === "crop" && process.env.CROP_GUIDE_SOURCE === "payload" ? await getPayloadCropGuide(locale, slug) : undefined;
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={'/' + (locale === "en" ? "zh" : "en") + '/solutions/' + encodeURIComponent(slug)}><SolutionContent item={item} locale={locale} cropGuide={cropGuide}/></LocalizedShell>;
}
