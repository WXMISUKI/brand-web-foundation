import crypto from "node:crypto";

const base = (process.env.PREVIEW_URL || "http://localhost:3118").replace(/\/$/, "");
const timeoutMs = Number(process.env.AUDIT_TIMEOUT_MS || 30000);
const paths = [
  "/en", "/en/about", "/en/products", "/en/products/organic-water-soluble-growth-draft", "/en/news", "/en/insights", "/en/cases",
  "/zh", "/zh/about", "/zh/products", "/zh/products/organic-water-soluble-growth-draft", "/zh/news", "/zh/insights", "/zh/cases",
];
const errors = [];
const warnings = [];
const pages = [];
const media = new Map();

const absolute = (src) => {
  if (!src || src.startsWith("data:")) return null;
  try { return new URL(src, `${base}/`).toString(); } catch { return null; }
};

for (const path of paths) {
  const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) { errors.push(`${path}: page HTTP ${response.status}`); continue; }
  const html = await response.text();
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]).map(tag => ({
    src: absolute(tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? ""),
    alt: tag.match(/\balt=["']([^"']*)["']/i)?.[1] ?? "",
  })).filter(item => item.src);
  pages.push({ path, status: response.status, images: images.length });
  for (const image of images) {
    const refs = media.get(image.src) ?? { pages: [], alts: new Set() };
    refs.pages.push(path); refs.alts.add(image.alt); media.set(image.src, refs);
  }
}

const resolved = [];
await Promise.all([...media.entries()].map(async ([url, refs]) => {
  let response;
  try { response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) }); }
  catch (error) { warnings.push(`${url}: media fetch timeout or network error (${error?.name ?? "unknown"})`); return; }
  if (!response.ok) { errors.push(`${url}: image HTTP ${response.status}`); return; }
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  const row = { url, bytes: bytes.length, hash, pages: [...new Set(refs.pages)], alts: [...refs.alts] };
  resolved.push(row);
  if (row.alts.some(alt => /\{&?quot;|\[object Object\]|\{\s*"/.test(alt))) errors.push(`${url}: serialized alt`);
  if (/\/images\/(generated|.*prototype)|prototype/i.test(url)) errors.push(`${url}: generated/prototype media is publicly referenced`);
}));

const byHash = new Map();
for (const row of resolved) byHash.set(row.hash, [...(byHash.get(row.hash) ?? []), row.url]);
const duplicateHashes = [...byHash.entries()].filter(([, urls]) => urls.length > 1).map(([hash, urls]) => ({ hash, urls }));
console.log(JSON.stringify({ ok: errors.length === 0, base, pages, mediaCount: resolved.length, duplicateHashes, warnings, errors }, null, 2));
if (errors.length) process.exitCode = 1;
