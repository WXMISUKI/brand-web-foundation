import test from 'node:test';
import assert from 'node:assert/strict';
import { adminLocaleLabel, localizeAdminCollection } from '../src/admin/payload-labels.ts';

test('Chinese admin labels preserve inquiry values, access and hidden fields', () => {
  const access = { read: () => true };
  const config = localizeAdminCollection({ slug: 'inquiries', access, fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['new', 'in-progress', 'closed'] },
    { name: 'website', type: 'text', admin: { hidden: true } },
    { name: 'sourcePages', type: 'array', fields: [{ name: 'page', type: 'number' }] },
  ] });
  assert.equal(config.labels.plural.zh, '产品询盘');
  assert.equal(config.fields[0].label.zh, '姓名');
  assert.deepEqual(config.fields[1].options.map(o => o.value), ['new', 'in-progress', 'closed']);
  assert.equal(config.fields[1].options[1].label.zh, '处理中');
  assert.equal(config.fields[2].admin.hidden, true);
  assert.equal(config.fields[3].labels.singular.zh, '画册页码');
  assert.equal(config.fields[3].fields[0].label.zh, '页码');
  assert.equal(config.access, access);
});

test('content locale names retain the original English-interface label', () => {
  assert.deepEqual(adminLocaleLabel('he', 'עברית'), { en: 'עברית', zh: '希伯来语' });
});
