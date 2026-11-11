import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import { changes, applyExactChanges } from '../scripts/repair-company-copy-exact.mjs';

test('exact repair updates only expected temporary records and rejects conflicting edits', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const c=new pg.Client({connectionString:process.env.TEST_DATABASE_URL});await c.connect();
  try{
    await c.query('BEGIN');
    for(const table of ['company_profile_locales','company_profile_focus_areas_locales','homepage_slides_locales','homepage_featured_locales','faqs_locales'])
      await c.query(`CREATE TEMP TABLE ${table} (id serial primary key, _locale text, _parent_id text, legal_name text, description text, answer text, question text)`);
    for(const table of ['company_profile_focus_areas','homepage_slides','homepage_featured'])await c.query(`CREATE TEMP TABLE ${table} (id text primary key, _order integer)`);
    const list=changes();const company=new Map();
    for(const item of list){
      if(item.table==='company_profile_locales'){const row=company.get(item.locale)||{};row[item.column]=item.old;company.set(item.locale,row);continue;}
      const parentId=item.parent?`${item.parent}-${item.order}`:String(item.parentId);
      if(item.parent)await c.query(`INSERT INTO pg_temp.${item.parent} (id,_order) VALUES($1,$2) ON CONFLICT DO NOTHING`,[parentId,item.order]);
      await c.query(`INSERT INTO pg_temp.${item.table} (_parent_id,_locale,${item.column},question) VALUES($1,$2,$3,$4)`,[parentId,item.locale,item.old,item.question||null]);
    }
    for(const [locale,row] of company) await c.query('INSERT INTO pg_temp.company_profile_locales (_locale,legal_name,description) VALUES ($1,$2,$3)',[locale,row.legal_name||null,row.description||null]);
    assert.equal((await applyExactChanges(c,{schema:'pg_temp',apply:false})).filter(x=>x.status==='would-update').length,list.length);
    assert.equal((await applyExactChanges(c,{schema:'pg_temp',apply:true})).filter(x=>x.status==='updated').length,list.length);
    assert.equal((await applyExactChanges(c,{schema:'pg_temp',apply:true})).filter(x=>x.status==='already-correct').length,list.length);
    await c.query("UPDATE pg_temp.company_profile_locales SET legal_name='editor changed this'");
    const faq=list.find(item=>item.label==='faq.distributor.zh');
    await c.query('UPDATE pg_temp.faqs_locales SET answer=$1',[faq.old]);
    await assert.rejects(applyExactChanges(c,{schema:'pg_temp',apply:true}),/current value differs/);
    assert.equal((await c.query('SELECT legal_name FROM pg_temp.company_profile_locales')).rows[0].legal_name,'editor changed this');
    assert.equal((await c.query('SELECT answer FROM pg_temp.faqs_locales')).rows[0].answer,faq.old);
  }finally{await c.query('ROLLBACK');await c.end();}
});
