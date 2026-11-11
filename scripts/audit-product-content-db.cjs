const { Client } = require('pg');
const words = /安徽康母|原官网|来源页面|业主|待审核|待核验|画册|official (?:site|product cent(?:er|re))|owner[ -]?review|await(?:s|ing) (?:review|confirmation)|source[ -]page|brochure[ -](?:page|linked)|review gate|pending (?:review|confirmation)|claims (?:remain|await)|folleto|brochure|broşür|broszür|брошюр|folheto|brochura|brochure|broșur|φυλλαδί|חוברת|โบรชัวร์|sitio oficial|site officiel|sito ufficiale|site oficial|официальн.{0,20}сайт|resmi (?:site|web)|officiële (?:site|website)|site-ul oficial|επίσημ.{0,25}ιστοσελίδ|האתר הרשמי|เว็บไซต์อย่างเป็นทางการ/i;
(async () => {
 const c = new Client({connectionString:process.env.DATABASE_URL, statement_timeout:15000});
 await c.connect();
 try {
  await c.query('BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
  const products = await c.query('SELECT p.slug, l._locale AS locale, l.name, l.intro, l.materials, l.packaging, l.uses, l.instructions FROM products p LEFT JOIN products_locales l ON l._parent_id=p.id ORDER BY p.slug, l._locale');
  const specifications = await c.query('SELECT p.slug, l._locale AS locale, l.label, s.unit, s.typical, s.minimum, s.maximum FROM products_specifications s JOIN products p ON p.id=s._parent_id LEFT JOIN products_specifications_locales l ON l._parent_id=s.id ORDER BY p.slug, l._locale');
  const hits = [];
  for (const [kind, result] of [['product',products], ['specification',specifications]]) for (const row of result.rows) {
   for (const [field, value] of Object.entries(row)) if (!['slug','locale'].includes(field) && typeof value === 'string' && words.test(value)) hits.push({kind, slug:row.slug, locale:row.locale, field, value});
  }
  const byLocale = {};
  for (const row of products.rows) byLocale[row.locale ?? '(missing)'] = (byLocale[row.locale ?? '(missing)'] || 0) + 1;
  const nonChineseNames = {};
  for (const row of products.rows) if (row.locale && row.locale !== 'zh' && /[\u4e00-\u9fff]/u.test(row.name || '')) nonChineseNames[row.locale] = (nonChineseNames[row.locale] || 0) + 1;
  await c.query('ROLLBACK');
  const hitCounts = {};
  for (const hit of hits) { const key = `${hit.locale}.${hit.field}`; hitCounts[key] = (hitCounts[key] || 0) + 1; }
  const otherFindings = hits.filter(hit => !(hit.slug.startsWith('official-') && hit.field === 'intro')).map(({kind,slug,locale,field}) => ({kind,slug,locale,field}));
  console.log(JSON.stringify({mode:'read-only',productCount:new Set(products.rows.map(row=>row.slug)).size,localizedRows:products.rows.length,byLocale,specificationRows:specifications.rows.length,hitCount:hits.length,hitCounts,nonChineseNames,otherFindings},null,2));
 } finally { await c.end(); }
})().catch(e => { console.error('Read-only audit failed:', e.code || e.name); process.exitCode=1; });
