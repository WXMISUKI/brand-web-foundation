const base = (process.env.PUBLIC_BASE_URL || process.env.PREVIEW_URL || "http://localhost:3118").replace(/\/$/, "");
const timeoutMs = Number(process.env.AUDIT_TIMEOUT_MS || 30000);
const locales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];
const errors = [];
const warnings = [];

async function request(path) {
  try {
    const response = await fetch(new URL(path, `${base}/`), { signal: AbortSignal.timeout(timeoutMs) });
    return { response, body: await response.text() };
  } catch (error) {
    errors.push(`${path}: ${error?.name ?? "request failed"}`);
    return null;
  }
}

async function requestAsset(path) {
  try {
    const response = await fetch(new URL(path, `${base}/`), { signal: AbortSignal.timeout(timeoutMs) });
    const bytes = (await response.arrayBuffer()).byteLength;
    return { response, bytes };
  } catch (error) {
    warnings.push(`${path}: ${error?.name ?? "asset request failed"}`);
    return null;
  }
}

const ready = await request("/api/ready");
if (ready?.response.status !== 200) errors.push(`/api/ready: expected 200, got ${ready?.response.status ?? "none"}`);
else {
  try { const data = JSON.parse(ready.body); if (data.ok !== true || data.checks?.database !== true || data.checks?.media !== true) errors.push("/api/ready: database/media check failed"); }
  catch { errors.push("/api/ready: invalid JSON"); }
}

const health = await request("/api/health");
if (health?.response.status !== 200) errors.push(`/api/health: expected 200, got ${health?.response.status ?? "none"}`);
else {
  try { const data = JSON.parse(health.body); if (data.environment !== "production" || data.database !== "postgres" || data.catalogSource !== "payload" || data.mediaConfigured !== true) errors.push("/api/health: production shape mismatch"); }
  catch { errors.push("/api/health: invalid JSON"); }
}

const apiProducts = await request("/api/products?limit=1");
if (apiProducts?.response.status !== 403) errors.push(`/api/products?limit=1: expected 403, got ${apiProducts?.response.status ?? "none"}`);

const pages = [];
const assets = new Set(["/favicon.svg"]);
for (const locale of locales) {
  const path = `/${locale}`;
  const result = await request(path);
  if (!result || result.response.status !== 200) { errors.push(`${path}: expected 200, got ${result?.response.status ?? "none"}`); continue; }
  const lang = result.body.match(/<html[^>]*\blang="([^"]+)"/i)?.[1] ?? "";
  const dir = result.body.match(/<html[^>]*\bdir="([^"]+)"/i)?.[1] ?? "";
  const expectedLang = locale === "zh" ? "zh-CN" : locale;
  const expectedDir = locale === "he" ? "rtl" : "ltr";
  if (lang !== expectedLang) errors.push(`${path}: lang=${lang}, expected ${expectedLang}`);
  if (dir !== expectedDir) errors.push(`${path}: dir=${dir}, expected ${expectedDir}`);
  for (const marker of ["reviewStatus", "claimsVerified", "assetStatus", "excluded-candidate", "generated-placeholder"]) if (result.body.includes(marker)) errors.push(`${path}: public HTML contains ${marker}`);
  for (const match of result.body.matchAll(/(?:href|src)="(\/[^"?#]+)"/gi)) {
    const asset = match[1];
    if (/^\/_next\/static\/.*\.(?:css|js)$/i.test(asset) || /^\/api\/media\/file\//i.test(asset)) assets.add(asset);
  }
  pages.push({ path, status: result.response.status, lang, dir, bytes: result.body.length });
}

for (const path of ["/robots.txt", "/sitemap.xml"]) {
  const result = await request(path);
  if (!result || result.response.status !== 200) errors.push(`${path}: expected 200, got ${result?.response.status ?? "none"}`);
}

const assetRows = [];
for (const path of [...assets].slice(0, 12)) {
  const result = await requestAsset(path);
  if (!result || result.response.status !== 200) { warnings.push(`${path}: asset fetch failed`); continue; }
  assetRows.push({ path, status: result.response.status, contentType: result.response.headers.get("content-type"), bytes: result.bytes });
}

console.log(JSON.stringify({ ok: errors.length === 0, base, pages, assetRows, warnings, errors }, null, 2));
if (errors.length) process.exitCode = 1;
