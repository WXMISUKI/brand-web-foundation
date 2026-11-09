import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The source files are never modified; quoted fields, escaped quotes and multiline cells are supported.
export function parseCsv(input) {
  const rows = []; let row = [], field = "", quoted = false, closed = false;
  const source = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { quoted = false; closed = true; }
      else field += ch;
    } else if (ch === '"' && !field && !closed) quoted = true;
    else if (ch === ',') { row.push(field); field = ""; closed = false; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && source[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = ""; closed = false;
    } else if (closed || ch === '"') throw new Error("CSV 引号格式无效");
    else field += ch;
  }
  if (quoted) throw new Error("CSV 存在未闭合的引号");
  if (field || row.length || closed) { row.push(field); rows.push(row); }
  return rows.filter(values => values.some(value => value.trim()));
}

export function checkCatalog(products, specs, assets) {
  const issues = [], productIds = new Set(), assetIds = new Set();
  if (!products.length) issues.push("未提供产品记录，无法确认资料已准备就绪");
  for (const [index, row] of products.entries()) {
    const id = row["产品编号"]?.trim();
    if (!id) issues.push(`产品第 ${index + 1} 条记录缺少产品编号`);
    else if (productIds.has(id)) issues.push(`产品第 ${index + 1} 条记录产品编号重复`);
    else productIds.add(id);
    if (!row["中文产品名称"]?.trim() && !row["英文产品名称"]?.trim()) issues.push(`产品第 ${index + 1} 条记录缺少中英文名称`);
  }
  for (const [index, row] of specs.entries()) {
    const id = row["产品编号"]?.trim();
    if (!id || !productIds.has(id)) issues.push(`参数第 ${index + 1} 条记录未关联有效产品编号`);
    if (!row["指标中文名称"]?.trim() && !row["指标英文名称"]?.trim()) issues.push(`参数第 ${index + 1} 条记录缺少中英文指标名称`);
  }
  for (const [index, row] of assets.entries()) {
    const id = row["素材编号"]?.trim(), product = row["关联产品编号"]?.trim();
    if (!id) issues.push(`素材第 ${index + 1} 条记录缺少素材编号`);
    else if (assetIds.has(id)) issues.push(`素材第 ${index + 1} 条记录素材编号重复`);
    else assetIds.add(id);
    if (product && !productIds.has(product)) issues.push(`素材第 ${index + 1} 条记录未关联有效产品编号`);
    if (!row["文件名或共享位置"]?.trim()) issues.push(`素材第 ${index + 1} 条记录缺少文件名或共享位置`);
  }
  return issues;
}

async function loadTable(folder, file, required) {
  const rows = parseCsv(await readFile(path.join(folder, file), "utf8"));
  const header = rows.shift();
  if (!header || new Set(header).size !== header.length || required.some(name => !header.includes(name))) throw new Error(`${file} 表头缺失或重复`);
  return rows.map((values, index) => {
    if (values.length !== header.length) throw new Error(`${file} 第 ${index + 1} 条数据记录列数与表头不一致`);
    return Object.fromEntries(header.map((name, col) => [name, values[col]]));
  });
}

async function main() {
  const folder = process.argv[2];
  if (!folder) throw new Error("用法：node scripts/check-owner-catalog.mjs <资料目录>");
  const [products, specs, assets] = await Promise.all([
    loadTable(folder, "products.csv", ["产品编号", "中文产品名称", "英文产品名称"]),
    loadTable(folder, "specifications.csv", ["产品编号", "指标中文名称", "指标英文名称"]),
    loadTable(folder, "assets.csv", ["素材编号", "关联产品编号", "文件名或共享位置"]),
  ]);
  const issues = checkCatalog(products, specs, assets);
  console.log(`已检查：产品 ${products.length} 条、参数 ${specs.length} 条、素材 ${assets.length} 条。`);
  if (issues.length) { console.error(issues.join("\n")); process.exitCode = 1; }
  else console.log("关联和必要标识检查通过；内容准确性、授权及文件可用性仍需人工核对。");
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
