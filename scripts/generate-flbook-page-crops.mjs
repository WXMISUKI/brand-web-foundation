import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "public", "images", "flbook-pages");
const crops = [
  { source: "pages-06-07.jpg", page: 6, side: "left" },
  { source: "pages-08-09.jpg", page: 8, side: "left" },
  { source: "pages-08-09.jpg", page: 9, side: "right" },
  { source: "pages-10-11.jpg", page: 10, side: "left" },
  { source: "pages-12-13.jpg", page: 12, side: "left" },
  { source: "pages-14-15.jpg", page: 14, side: "left" },
  { source: "pages-16-17.jpg", page: 16, side: "left" },
  { source: "pages-18-19.jpg", page: 18, side: "left" },
  { source: "pages-20-21.jpg", page: 20, side: "left" },
  { source: "pages-22-23.jpg", page: 22, side: "left" },
];

for (const crop of crops) {
  const input = path.join(sourceDir, crop.source);
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Cannot read FLBOOK preview dimensions: ${crop.source}`);
  const width = Math.floor(metadata.width / 2);
  const left = crop.side === "right" ? metadata.width - width : 0;
  await sharp(input).extract({ left, top: 0, width, height: metadata.height }).jpeg({ quality: 90 }).toFile(path.join(sourceDir, `page-${String(crop.page).padStart(2, "0")}-product.jpg`));
}

console.log(JSON.stringify({ ok: true, crops: crops.length, output: "public/images/flbook-pages" }, null, 2));
