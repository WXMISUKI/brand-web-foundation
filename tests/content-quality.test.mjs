import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkContentFields } from '../scripts/content-quality-rules.mjs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import legacyCompanyCopy from '../src/data/company-legacy-copy.mjs';

test('flags company-name typo and internal editorial wording, without leaking content', () => {
  const result = checkContentFields([
    { path: 'company.legalName', value: '安徽康母国际化肥股份有限公司' },
    { path: 'homepage.description', value: '原官网介绍了产品' },
    { path: 'faq.answer', value: '安徽康坶提供产品资料。' },
    { path: 'blank', value: null },
  ]);
  assert.deepEqual(result, [
    { path: 'company.legalName', rule: 'company-name-typo' },
    { path: 'homepage.description', rule: 'internal-editorial-language' },
  ]);
});

test('detects exact historical company copy in every locale while preserving edited text', () => {
  for (const [locale, copy] of Object.entries(legacyCompanyCopy)) {
    for (const value of [copy.description, ...copy.focusAreas]) {
      assert.ok(checkContentFields([{ path: locale, value }]).length > 0, locale);
    }
  }
  assert.deepEqual(checkContentFields([{ path: 'editor', value: 'The company develops plant nutrition products.' }]), []);
});

test('flags known product review templates without flagging ordinary product descriptions', () => {
  const findings = checkContentFields([
    { path: 'product.intro', value: 'The official KOMU product center lists fertilizer. Model, packaging, technical values and claims remain subject to formal review.' },
    { path: 'product.edited', value: 'Contact the KOMU team for current product information.' },
  ]);
  assert.deepEqual(findings, [{ path: 'product.intro', rule: 'product-review-template' }]);
});

test('CMS audit identifies public field paths without printing their contents', async () => {
  const server = createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    if (req.url.startsWith('/api/globals/company-profile')) res.end(JSON.stringify({ legalName: '安徽康母国际化肥股份有限公司' }));
    else if (req.url.startsWith('/api/globals/homepage')) res.end(JSON.stringify({ slides: [], featured: [{ description: '浏览根据业主画册整理的十条产品资料。' }] }));
    else if (req.url.startsWith('/api/news')) res.end(JSON.stringify({ docs: [{ richBody: { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: '原官网资料' }] }] } } }], totalPages: 1 }));
    else if (/^\/api\/(faqs|categories|products|insights|cases|crop-guides)/.test(req.url)) res.end(JSON.stringify({ docs: [], totalPages: 1 }));
    else { res.statusCode = 404; res.end('{}'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const port = server.address().port;
    const child = spawn(process.execPath, ['scripts/audit-cms-public-copy.mjs'], { env: { ...process.env, PUBLIC_BASE_URL: `http://127.0.0.1:${port}`, AUDIT_LOCALES: 'zh' } });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    const exitCode = await new Promise((resolve, reject) => { child.on('error', reject); child.on('close', resolve); });
    const result = JSON.parse(output);
    assert.equal(exitCode, 1);
    assert.deepEqual(result.findings, [
      { path: 'zh.company.legalName', rule: 'company-name-typo' },
      { path: 'zh.homepage.featured.0.description', rule: 'stale-featured-product-count' },
      { path: 'zh.news.docs.0.richBody.root.children.0.children.0', rule: 'internal-editorial-language' },
    ]);
    assert.doesNotMatch(output, /安徽康母/);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
