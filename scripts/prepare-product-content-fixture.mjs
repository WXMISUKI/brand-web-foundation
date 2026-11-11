import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
if (process.env.PAYLOAD_DATABASE !== 'sqlite' || process.env.PAYLOAD_SQLITE_URL !== 'file:./.local/product-content-qa-20261111.sqlite' || process.env.DATABASE_URL) throw new Error('Only the dedicated isolated SQLite fixture is allowed');
if (existsSync('.local/product-content-qa-20261111.sqlite')) throw new Error('Fixture database already exists; do not overwrite it');
const require = createRequire(import.meta.url);
const nextEnv = require(path.join(process.cwd(), 'node_modules/@next/env'));
if (!nextEnv.default) nextEnv.default = nextEnv;
const { getPayload } = await import('payload');
const config = (await import(pathToFileURL(path.join(process.cwd(), 'src/payload.config.ts')).href)).default;
const payload = await getPayload({ config });
try {
 const category = await payload.create({collection:'categories',locale:'en',overrideAccess:true,data:{slug:'qa-category',name:'QA category'}});
 const first = await payload.create({collection:'products',locale:'en',overrideAccess:true,data:{slug:'official-569683',category:category.id,name:'KOMU compound fertilizer · 569683',intro:'This product is listed in the official KOMU product center. Contact us for current product information.'}});
 await payload.update({collection:'products',id:first.id,locale:'fr',overrideAccess:true,data:{name:'KOMU product · 复合肥料15-5-20',intro:'The official KOMU product center lists 复合肥料15-5-20. Model, packaging, technical values and claims remain subject to formal review.'}});
 await payload.create({collection:'products',locale:'en',overrideAccess:true,data:{
  slug:'qa-suspended',category:category.id,name:'QA suspended 120-60-400+TE',
  intro:'Brochure page 14 presents a Kangmu suspended water-soluble fertilizer marked 120-60-400+TE, positioned for fruit sizing and colour development, with a 10 kg pack. Values and use ranges follow the brochure page.',
  materials:'Water-soluble NPK with trace elements; 120-60-400+TE follows the source page and needs current-sheet confirmation.',
  packaging:'10 kg pack shown in the source page; confirm current packaging.',
  uses:'Source-page positioning is fruit sizing and colour development; confirm crop, timing and rate.'
 }});
 console.log('Isolated product fixtures created');
} finally { await payload.destroy(); }
