import base from './playwright.ui.config.mjs';
export default {
  ...base,
  testMatch: ['inquiry-validation.spec.mjs'],
  webServer: { ...base.webServer, env: { ...base.webServer.env, INQUIRY_MODE: 'enabled', PAYLOAD_SQLITE_URL: 'file:./.local/inquiry-acceptance.sqlite' } },
};
