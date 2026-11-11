import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import legacy from '../src/data/company-legacy-copy.mjs';
import { companyDescriptionForDisplay, focusDescriptionForDisplay, correctKnownCompanyName } from '../src/data/company-public-copy.mjs';
import { legacyFeaturedDescription, featuredDescriptionForDisplay } from '../src/data/homepage-public-copy.mjs';

const locales = ['en','zh','he','nl','fr','it','es','pt','el','ro','ru','th','tr'];
const typoName = '安徽康母国际化肥股份有限公司';
const typoAbout = '了解安徽康母国际化肥股份有限公司与康姆产品系列。';
const typoFaq = '请通过邮箱或 WhatsApp 联系安徽康母国际化肥股份有限公司，并说明所在市场和渠道情况。';

export function changes() {
  const list = [
    { label:'company.legalName.zh', table:'company_profile_locales', column:'legal_name', locale:'zh', old:typoName, next:correctKnownCompanyName(typoName) },
    ...locales.flatMap(locale => [
      { label:`company.description.${locale}`, table:'company_profile_locales', column:'description', locale, old:legacy[locale].description, next:companyDescriptionForDisplay(locale,legacy[locale].description) },
      ...[0,1,2].map(index => ({ label:`company.focus.${index}.${locale}`, table:'company_profile_focus_areas_locales', parent:'company_profile_focus_areas', order:index+1, column:'description', locale, old:legacy[locale].focusAreas[index], next:focusDescriptionForDisplay(locale,index,legacy[locale].focusAreas[index]) })),
    ]),
    { label:'homepage.slides.2.zh', table:'homepage_slides_locales', parent:'homepage_slides', order:3, column:'description', locale:'zh', old:typoAbout, next:correctKnownCompanyName(typoAbout) },
    { label:'homepage.featured.2.zh', table:'homepage_featured_locales', parent:'homepage_featured', order:3, column:'description', locale:'zh', old:typoAbout, next:correctKnownCompanyName(typoAbout) },
    { label:'faq.distributor.zh', table:'faqs_locales', column:'answer', parentId:6, locale:'zh', old:typoFaq, next:correctKnownCompanyName(typoFaq), question:'如何洽谈经销合作？' },
  ];
  for(const locale of locales) list.push({label:`homepage.featured.0.${locale}`, table:'homepage_featured_locales', parent:'homepage_featured', order:1, column:'description', locale, old:legacyFeaturedDescription[locale], next:featuredDescriptionForDisplay(locale,legacyFeaturedDescription[locale])});
  return list;
}

// Called within a serializable transaction. Only public or temporary tables are permitted.
export async function applyExactChanges(client, { schema='public', apply=false }={}) {
  if(!['public','pg_temp'].includes(schema)) throw Error('Unsupported schema');
  const list=changes();const rows=[];
  for(const item of list){
    const join=item.parent ? ` JOIN ${schema}.${item.parent} p ON p.id = l._parent_id` : '';
    const params=[item.locale];let where='l._locale::text = $1';
    if(item.parent){params.push(item.order);where+=` AND p._order = $${params.length}`;}
    if(item.parentId){params.push(item.parentId);where+=` AND l._parent_id = $${params.length}`;}
    if(item.question){params.push(item.question);where+=` AND l.question = $${params.length}`;}
    const found=await client.query(`SELECT l.id, l.${item.column} AS value FROM ${schema}.${item.table} l${join} WHERE ${where} FOR UPDATE OF l`,params);
    if(found.rows.length!==1)throw Error(`${item.label}: expected exactly one row, found ${found.rows.length}`);
    const row=found.rows[0];
    if(row.value!==item.old && row.value!==item.next)throw Error(`${item.label}: current value differs from both the expected old and replacement values`);
    rows.push({item,row,changed:row.value===item.old});
  }
  if(apply)for(const {item,row,changed} of rows){if(!changed)continue;const result=await client.query(`UPDATE ${schema}.${item.table} SET ${item.column}=$1 WHERE id=$2 AND ${item.column}=$3`,[item.next,row.id,item.old]);if(result.rowCount!==1)throw Error(`${item.label}: concurrent change`);}
  return rows.map(({item,changed})=>({field:item.label,status:changed?(apply?'updated':'would-update'):'already-correct'}));
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
  const require=createRequire(import.meta.url);const {Client}=require('pg');const client=new Client({connectionString:process.env.DATABASE_URL});
  const apply=process.env.COPY_REPAIR_APPLY==='YES';
  await client.connect();
  try{await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');const report=await applyExactChanges(client,{apply});await client.query(apply?'COMMIT':'ROLLBACK');console.log(JSON.stringify({ok:true,mode:apply?'apply':'dry-run',fields:report},null,2));}
  catch(e){await client.query('ROLLBACK');console.error(`Copy repair aborted: ${e.message}`);process.exitCode=1;}
  finally{await client.end();}
}
