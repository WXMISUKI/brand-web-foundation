import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('latest migration snapshot includes the previously applied company contact fields', () => {
  const snapshot = JSON.parse(readFileSync('src/migrations/20261108_061401_add_company_contact_fields.json','utf8'));
  for (const [table, columns] of Object.entries({ 'public.company_profile':['email','whatsapp'], 'public.company_profile_locales':['legal_name','address'] })) {
    for (const column of columns) assert.ok(snapshot.tables[table].columns[column], `${table}.${column}`);
  }
});
