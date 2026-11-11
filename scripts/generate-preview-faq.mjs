import { faqSeeds } from '../scripts/payload-seeds.mjs';
import { readFile, writeFile } from 'node:fs/promises';
const files = ['1','2-it','3-tr','4-th','5-nl','6-ro','7-el','8-he'];
const phases = await Promise.all(files.map(id => readFile(new URL(`../src/data/core-page-localizations-phase${id}.json`, import.meta.url), 'utf8').then(JSON.parse)));
const locales = ['en','zh','es','fr','pt','ru','it','tr','th','nl','ro','el','he'];
const result = Object.fromEntries(locales.map(locale => [locale, faqSeeds.map(group => {
  const translation = phases.map(phase => phase.faq[group.slug]?.[locale]).find(Boolean);
  return {
    id: group.slug,
    name: locale === 'en' || locale === 'zh' ? group.name[locale] : translation?.name,
    questions: group.questions.map(question => {
      const localized = locale === 'en' || locale === 'zh' ? { question: question.question[locale], answer: question.answer[locale] } : translation?.questions[question.slug];
      if (!localized?.question || !localized?.answer) throw Error(`Missing ${locale}/${group.slug}/${question.slug}`);
      return { id: `${group.slug}-${question.slug}`, ...localized };
    })
  };
})]));
await writeFile(new URL('../src/data/faq-preview.json', import.meta.url), JSON.stringify(result, null, 2) + '\n');
