import fs from "node:fs/promises";

const input = JSON.parse(await fs.readFile(new URL("../src/data/official-site-product-candidates.json", import.meta.url), "utf8"));
const byName = new Map();
for (const product of input.products) byName.set(product.name, [...(byName.get(product.name) ?? []), product]);
const duplicates = [...byName.entries()].filter(([, rows]) => rows.length > 1);
const lines = [
  "# 原官网候选产品审核包（2026-11-09）",
  "",
  `来源：${input.source}；候选数：${input.count}；全部保持 owner-review / published:false。`,
  "",
  "本清单只记录原官网产品中心的官方名称、详情 URL 和图片 URL，不会自动写入 Payload。额外型号必须先确认型号、包装、规格、停产状态和最终译文。",
  "",
  `## 重复名称冲突（${duplicates.length} 组）`,
  "",
  ...(duplicates.length ? duplicates.flatMap(([name, rows]) => [`- **${name}**：${rows.map(row => `[${row.sourceUrl}](${row.sourceUrl})`).join("、")}`]) : ["- 无"]),
  "",
  "## 候选清单",
  "",
  "| # | 官方名称 | 详情页 | 官方图片 | 状态 |",
  "| ---: | --- | --- | --- | --- |",
  ...input.products.map((product, index) => `| ${index + 1} | ${product.name} | [详情](${product.sourceUrl}) | [图片](${product.imageUrl}) | ${product.reviewStatus} / unpublished |`),
  "",
  "## 与当前生产目录的边界",
  "",
  "- 当前生产目录仍以 FLBOOK 10 条产品为主，不因候选清单自动增加产品。",
  "- 能与 FLBOOK 包装视觉稳定对应的旧官网图片已用于现有产品媒体；其余候选保持待审核。",
  "- 只有逐条完成名称、型号、包装、规格、claims、停产状态和英中译文审核后，才允许进入 Payload 导入计划。",
];
await fs.writeFile(new URL("../docs/official-site-candidate-review-packet-2026-11-09.md", import.meta.url), `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify({ ok: true, output: "docs/official-site-candidate-review-packet-2026-11-09.md", candidates: input.count, duplicateNameGroups: duplicates.length }, null, 2));
