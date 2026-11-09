import fs from "node:fs/promises";

const base = "http://m.zgkomu.cn";
const html = await (await fetch(`${base}/`)).text();
const pattern = /<a href="(?<href>\/display\/\d+\.html)">\s*<div class="pic"><img src="(?<image>[^"]+)"[^>]*>\s*<\/div>\s*<div class="t4">\s*<div class="t1">(?<name>[^<]+)<\/div>/g;
const products = [];
for (const match of html.matchAll(pattern)) {
  products.push({
    name: match.groups.name.trim(),
    sourceUrl: `${base}${match.groups.href}`,
    imageUrl: `${base}${match.groups.image}`,
    reviewStatus: "owner-review",
    published: false,
  });
}
const output = { source: `${base}/`, extractedAt: new Date().toISOString(), count: products.length, products };
await fs.writeFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ok: true, output: "src/data/official-site-product-candidates.json", count: products.length }, null, 2));
