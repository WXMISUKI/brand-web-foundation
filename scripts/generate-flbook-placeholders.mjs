import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDir = join(process.cwd(), "public", "images", "flbook-drafts");
const products = [
  ["medium-element-granular-draft", "非水溶中量元素肥料", "钙镁硅锌 · 生根抗逆", "#d97706"],
  ["organic-water-soluble-growth-draft", "有机水溶肥料", "促长 · 靓叶 · 生根", "#0f766e"],
  ["organic-water-soluble-quality-draft", "有机水溶肥料", "促长 · 促叶 · 生根", "#b45309"],
  ["organic-water-soluble-absorption-draft", "有机水溶肥料", "抗逆促恢复 · 膨果着色", "#7c3aed"],
  ["organic-water-soluble-root-draft", "有机水溶肥料", "根系生长 · 养分吸收", "#0891b2"],
  ["suspended-fertilizer-120-60-400-draft", "康姆®大量元素水溶肥", "悬浮型 · 120-60-400+TE", "#166534"],
  ["suspended-fertilizer-200-150-200-draft", "康姆®大量元素水溶肥", "悬浮型 · 200-150-200+TE", "#15803d"],
  ["massive-element-liquid-quality-draft", "黄金屋®大量元素水溶肥", "液体型 · 提升产量品质", "#1d4ed8"],
  ["medium-element-liquid-draft", "黄金屋®中量元素水溶肥", "液体型 · 补充钙镁硅", "#2563eb"],
  ["organic-inorganic-compound-draft", "康姆®有机无机复混肥", "养分均衡 · 改良土壤", "#365314"],
];

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const svg = ([slug, title, subtitle, color]) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 900" role="img" aria-labelledby="title desc"><title id="title">${escapeXml(title)} ${escapeXml(subtitle)}</title><desc id="desc">Generated prototype package image. Not an owner supplied package or approved product claim.</desc><defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f3f7f0"/><stop offset="1" stop-color="#dcebdc"/></linearGradient></defs><rect width="720" height="900" fill="url(#bg)"/><path d="M0 0h720v180c-170 65-360 70-720-10Z" fill="${color}" opacity=".95"/><path d="M0 740c180-110 360-95 720-10v170H0Z" fill="${color}" opacity=".13"/><g transform="translate(150 125) rotate(-3 210 300)"><rect width="420" height="610" rx="20" fill="#fffdf5" stroke="#c9d5c7" stroke-width="5"/><rect x="20" y="20" width="380" height="110" rx="12" fill="${color}"/><text x="210" y="72" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="34" font-weight="700" fill="#fff">AGRI</text><text x="210" y="105" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="15" fill="#eaf7e8">PLANT NUTRITION</text><circle cx="210" cy="270" r="82" fill="${color}" opacity=".12"/><path d="M210 210c-35 55-70 80-70 124 0 44 31 72 70 72s70-28 70-72c0-44-35-69-70-124Z" fill="${color}" opacity=".85"/><text x="210" y="420" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="26" font-weight="700" fill="#183a27">${escapeXml(title)}</text><text x="210" y="462" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="22" fill="#315b42">${escapeXml(subtitle)}</text><line x1="80" x2="340" y1="505" y2="505" stroke="#b8c9b8" stroke-width="3"/><text x="210" y="550" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="16" fill="#627567">示例包装 · 待业主确认</text></g><text x="360" y="850" text-anchor="middle" font-family="Arial,Microsoft YaHei,sans-serif" font-size="16" fill="#496050">generated-placeholder · ${escapeXml(slug)}</text></svg>`;

await mkdir(outputDir, { recursive: true });
const desired = new Set(products.map(([slug]) => `${slug}.svg`));
for (const file of await readdir(outputDir)) {
  if (file.endsWith(".svg") && !desired.has(file)) await rm(join(outputDir, file), { force: true });
}
await Promise.all(products.map(([slug]) => writeFile(join(outputDir, `${slug}.svg`), svg(products.find((item) => item[0] === slug)), "utf8")));
console.log(`Generated ${products.length} prototype package SVGs in ${outputDir}`);
