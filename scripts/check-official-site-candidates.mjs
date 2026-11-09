import fs from "node:fs/promises";

const input = JSON.parse(await fs.readFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const rows = [];
const errors = [];

for (const product of input.products) {
  const check = async (url) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      return { status: response.status, ok: response.ok };
    } catch (error) {
      return { status: 0, ok: false, error: error?.name ?? "network_error" };
    }
  };
  const page = await check(product.sourceUrl);
  const image = await check(product.imageUrl);
  const row = { name: product.name, sourceUrl: product.sourceUrl, imageUrl: product.imageUrl, page, image };
  rows.push(row);
  if (!page.ok) errors.push(`${product.sourceUrl}: HTTP ${page.status || page.error}`);
  if (!image.ok) errors.push(`${product.imageUrl}: HTTP ${image.status || image.error}`);
}

console.log(JSON.stringify({ ok: errors.length === 0, count: rows.length, reachablePages: rows.filter(row => row.page.ok).length, reachableImages: rows.filter(row => row.image.ok).length, errors, rows }, null, 2));
if (errors.length) process.exitCode = 1;
