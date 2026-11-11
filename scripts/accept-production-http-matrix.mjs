const base = (process.env.PUBLIC_BASE_URL || "https://www.kowloonglobaltrading.com").replace(/\/$/, "");
const runId = process.env.ACCEPTANCE_RUN_ID || new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = process.env.ACCEPTANCE_OUTPUT_DIR || `output/acceptance/${runId}`;
const timeoutMs = Number(process.env.AUDIT_TIMEOUT_MS || 20000);
const locales = ["en", "he", "nl", "fr", "it", "es", "pt", "el", "zh", "ro", "ru", "th", "tr"];
const routeTemplates = [
  "",
  "/about",
  "/products",
  "/products/series",
  "/solutions",
  "/contact",
  "/faq",
  "/search?q=nutrition",
  "/news",
  "/insights",
  "/smart-farming",
  "/sustainability",
  "/quality-assurance",
  "/sds-request",
];
const forbiddenMarkers = ["reviewStatus", "claimsVerified", "assetStatus", "excluded-candidate", "generated-placeholder"];
const rows = [];
const discoveryErrors = [];

async function fetchWithBody(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(new URL(path, `${base}/`), { signal: controller.signal, redirect: "manual" });
    const body = await response.text();
    return { response, body };
  } catch (error) {
    return { error };
  } finally {
    clearTimeout(timer);
  }
}

async function discoverDetailRoutes(prefix) {
  const result = await fetchWithBody(`/en/${prefix}`);
  if (result.error) {
    discoveryErrors.push({ path: `/en/${prefix}`, error: `${result.error?.name ?? "request failed"}: ${result.error?.message ?? ""}`.trim() });
    return [];
  }
  const body = result.body;
  const found = new Set();
  for (const match of body.matchAll(new RegExp(`href="/en/${prefix}/([^"?#/]+)"`, "gi"))) {
    const slug = match[1];
    if (slug && slug !== "series") found.add(`/${prefix}/${slug}`);
  }
  return [...found].sort();
}

const detailRoutes = [
  ...(await discoverDetailRoutes("products")),
  ...(await discoverDetailRoutes("solutions")),
];
const allRoutes = [...new Set([...routeTemplates, ...detailRoutes])];

const targets = locales.flatMap(locale => allRoutes.map(route => ({ locale, route })));
let nextTarget = 0;
const checkTarget = async ({ locale, route }) => {
  const path = `/${locale}${route}`;
  const row = { locale, path, status: null, lang: null, dir: null, canonical: null, alternates: 0, bytes: 0, forbiddenMarkers: [], error: null };
  try {
    const result = await fetchWithBody(path);
    if (result.error) throw result.error;
    const response = result.response;
    const body = result.body;
    row.status = response.status;
    row.bytes = body.length;
    row.lang = body.match(/<html[^>]*\blang="([^"]+)"/i)?.[1] ?? null;
    row.dir = body.match(/<html[^>]*\bdir="([^"]+)"/i)?.[1] ?? null;
    row.canonical = body.match(/<link[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/i)?.[1] ?? null;
    row.alternates = [...body.matchAll(/<link[^>]*\brel="alternate"[^>]*\bhreflang=/gi)].length;
    row.forbiddenMarkers = forbiddenMarkers.filter((marker) => body.includes(marker));
    const expectedLang = locale === "zh" ? "zh-CN" : locale;
    const expectedDir = locale === "he" ? "rtl" : "ltr";
    if (row.status !== 200) row.error = `expected 200, got ${row.status}`;
    else if (row.lang !== expectedLang) row.error = `expected lang ${expectedLang}, got ${row.lang}`;
    else if (row.dir !== expectedDir) row.error = `expected dir ${expectedDir}, got ${row.dir}`;
    else if (!row.canonical) row.error = "missing canonical";
    else if (!row.alternates) row.error = "missing hreflang alternates";
    else if (row.forbiddenMarkers.length) row.error = `forbidden markers: ${row.forbiddenMarkers.join(",")}`;
  } catch (error) {
    row.error = `${error?.name ?? "request failed"}: ${error?.message ?? ""}`.trim();
  }
  rows.push(row);
};
const workerCount = Math.max(1, Math.min(Number(process.env.ACCEPTANCE_CONCURRENCY || 8), targets.length));
await Promise.all(Array.from({ length: workerCount }, async () => {
  while (nextTarget < targets.length) {
    const target = targets[nextTarget++];
    await checkTarget(target);
  }
}));

const summary = {
  runId,
  base,
  localeCount: locales.length,
  routeCount: allRoutes.length,
  fixedRouteCount: routeTemplates.length,
  detailRoutes,
  discoveryErrors,
  total: rows.length,
  passed: rows.filter((row) => !row.error).length,
  failed: rows.filter((row) => row.error).length,
  rows,
};

await import("node:fs/promises").then(({ mkdir, writeFile }) => mkdir(outputDir, { recursive: true }).then(() => writeFile(`${outputDir}/http-matrix.json`, `${JSON.stringify(summary, null, 2)}\n`)));
console.log(JSON.stringify(summary, null, 2));
if (summary.failed) process.exitCode = 1;
