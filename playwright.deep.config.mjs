import base from './playwright.ui.config.mjs';

// Broader matrix still uses the same isolated local sample server and disables inquiries.
process.env.ACCEPTANCE_SCOPE = 'full';
export default {
  ...base,
  testMatch: ['acceptance-production-browser.spec.mjs'],
  webServer: { ...base.webServer, env: { ...base.webServer.env, ACCEPTANCE_SCOPE: 'full' } },
};
