import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

for (const suite of ['tests/prototype-smoke.test.mjs', 'tests/seo-contract.test.mjs']) {
  test(`${suite} never writes to its target`, async () => {
    const requests = [];
    const server = http.createServer((req, res) => {
      requests.push({ method: req.method, path: req.url });
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(req.url.endsWith('/contact') ? 'mailto:leon@kowloonglobaltrading.com https://wa.me/85290740009' : '{"ok":true,"id":1}');
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
      const env = { ...process.env, PREVIEW_URL: `http://127.0.0.1:${server.address().port}` };
      delete env.NODE_TEST_CONTEXT;
      const child = spawn(process.execPath, ['--test', suite], {
        env,
        stdio: 'ignore',
      });
      await once(child, 'exit');
      assert.ok(requests.some(request => request.path === (suite.includes('prototype') ? '/zh/contact' : '/robots.txt')), 'suite must reach the expected checks');
      assert.deepEqual([...new Set(requests.map(request => request.method).filter(method => method !== 'GET' && method !== 'HEAD'))], []);
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  });
}
