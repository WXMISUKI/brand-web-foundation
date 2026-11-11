import { checkContentFields } from './content-quality-rules.mjs';
import { legacyFeaturedDescription } from '../src/data/homepage-public-copy.mjs';

// Only public content endpoints, never inquiries, users, or authenticated CMS data.
const base = (process.env.PUBLIC_BASE_URL || 'http://localhost:3125').replace(/\/$/, '');
const locales = (process.env.AUDIT_LOCALES || 'en,zh,he,nl,fr,it,es,pt,el,ro,ru,th,tr').split(',').map(x => x.trim()).filter(Boolean);
const all = [];
const failures = [];
function richTextFields(value, path, add) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { value.forEach((child, index) => richTextFields(child, `${path}.${index}`, add)); return; }
  if (value.type === 'text' && typeof value.text === 'string') add(path, value.text);
  if (value.root) richTextFields(value.root, `${path}.root`, add);
  if (Array.isArray(value.children)) richTextFields(value.children, `${path}.children`, add);
}
for (const locale of locales) {
  for (const [kind, path] of [['company', '/api/globals/company-profile'], ['homepage', '/api/globals/homepage'], ['faqs', '/api/faqs?limit=100'], ['categories', '/api/categories?limit=100'], ['products', '/api/products?limit=100&depth=0'], ['news', '/api/news?limit=100'], ['insights', '/api/insights?limit=100'], ['cases', '/api/cases?limit=100'], ['crop-guides', '/api/crop-guides?limit=100']]) {
    const separator = path.includes('?') ? '&' : '?';
    try {
      const response = await fetch(`${base}${path}${separator}locale=${encodeURIComponent(locale)}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const fields = [];
      const add = (path, value) => fields.push({ path: `${locale}.${kind}.${path}`, value });
      if (kind === 'company') {
        for (const key of ['title', 'summary', 'description', 'legalName']) add(key, data[key]);
        for (const [i, row] of (data.focusAreas || []).entries()) for (const key of ['title', 'description']) add(`focusAreas.${i}.${key}`, row[key]);
        for (const [i, row] of (data.milestones || []).entries()) for (const key of ['title', 'description']) add(`milestones.${i}.${key}`, row[key]);
      } else if (kind === 'homepage') {
        for (const key of ['slides', 'featured']) for (const [i, row] of (data[key] || []).entries()) for (const field of ['eyebrow', 'title', 'description', 'actionLabel']) add(`${key}.${i}.${field}`, row[field]);
        const featuredDescription = data.featured?.[0]?.description;
        if (featuredDescription && (featuredDescription === legacyFeaturedDescription[locale] || featuredDescription === legacyFeaturedDescription.en)) {
          all.push({ path: `${locale}.homepage.featured.0.description`, rule: 'stale-featured-product-count' });
        }
      } else if (kind === 'faqs') {
        for (const [i, row] of (data.docs || []).entries()) for (const key of ['question', 'answer']) add(`docs.${i}.${key}`, row[key]);
      } else {
        const publicFields = { categories: ['name'], products: ['name', 'intro', 'materials', 'packaging', 'uses', 'instructions'], news: ['title', 'summary', 'body'], insights: ['title', 'summary', 'author', 'body'], cases: ['title', 'summary', 'body'], 'crop-guides': ['nav', 'overview', 'stages', 'stagesText', 'nutrition', 'products', 'resources', 'resourcesText'] };
        for (const [i, row] of (data.docs || []).entries()) {
          for (const key of publicFields[kind]) add(`docs.${i}.${key}`, row[key]);
          if (kind === 'products') for (const [j, spec] of (row.specifications || []).entries()) for (const key of ['label', 'unit', 'typical', 'minimum', 'maximum']) add(`docs.${i}.specifications.${j}.${key}`, spec[key]);
          if (['news', 'insights', 'cases'].includes(kind)) richTextFields(row.richBody, `docs.${i}.richBody`, add);
        }
      }
      if (kind !== 'company' && kind !== 'homepage' && (data.totalPages || 1) > 1) failures.push(`${locale}.${kind}: more than 100 records; extend pagination`);
      all.push(...checkContentFields(fields));
    } catch (error) { failures.push(`${locale}.${kind}: ${error.message}`); }
  }
}
console.log(JSON.stringify({ ok: !all.length && !failures.length, base, locales, findings: all, errors: failures }, null, 2));
if (all.length || failures.length) process.exitCode = 1;
