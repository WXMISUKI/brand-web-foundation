import { FaqContent } from "../../../../components/faq-content";
import { LocalizedShell, readyInformationLocale } from "../../../../components/localized-shell";
import { filterFaqContent, getFaqContent } from "../../../../content/faq";
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string | string[]; question?: string | string[] }> }) {
  const locale = readyInformationLocale((await params).locale), search = await searchParams;
  const query = typeof search.q === "string" ? search.q.trim().slice(0, 100) : "";
  const question = typeof search.question === "string" ? search.question.slice(0, 100) : "";
  const all = await getFaqContent(locale);
  const target = question ? all.groups.find(group => group.questions.some(item => item.id === question)) : undefined;
  const data = target ? { ...all, groups: [{ ...target, questions: target.questions.filter(item => item.id === question) }] } : filterFaqContent(all, query);
  const suffix = new URLSearchParams(); if (query) suffix.set("q", query); if (question) suffix.set("question", question);
  return <LocalizedShell locale={locale} previewAllLocales={process.env.CMS_EVAL === "1" && process.env.NODE_ENV !== "production"} alternatePath={`/${locale === "en" ? "zh" : "en"}/faq${suffix.size ? `?${suffix}` : ""}`}><FaqContent key={`${query}:${question}`} locale={locale} data={data} query={query} questionId={question}/></LocalizedShell>;
}
