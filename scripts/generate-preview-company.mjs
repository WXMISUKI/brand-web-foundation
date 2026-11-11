import { companySeeds } from './payload-seeds.mjs';
import { readFile, writeFile } from 'node:fs/promises';
const suffixes = ['1','2-it','3-tr','4-th','5-nl','6-ro','7-el','8-he'];
const phases = await Promise.all(suffixes.map(suffix => readFile(new URL(`../src/data/core-page-localizations-phase${suffix}.json`, import.meta.url), 'utf8').then(JSON.parse)));
const company = Object.assign({}, companySeeds, ...phases.map(phase => phase.company));
const locales = ['en','zh','es','fr','pt','ru','it','tr','th','nl','ro','el','he'];
for (const locale of locales) {
  const row = company[locale];
  if (!row?.title || !row?.summary || !row?.description || row.focusAreas?.length !== 3 || row.focusAreas.some(area => !area.title || !area.description)) throw Error(`Incomplete company preview: ${locale}`);
}
await writeFile(new URL('../src/data/company-preview.json', import.meta.url), JSON.stringify(Object.fromEntries(locales.map(locale => [locale, company[locale]])), null, 2) + '\n');
