import { test } from "node:test";
import assert from "node:assert/strict";
import { checkCatalog, parseCsv } from "../scripts/check-owner-catalog.mjs";

test("CSV supports BOM, quoted commas, quotes and multiline text", () => {
  assert.deepEqual(parseCsv('\uFEFF编号,说明\r\n1,"第一行,内容\n第二行"\r\n2,"含""引号"""\r\n'), [["编号", "说明"], ["1", "第一行,内容\n第二行"], ["2", '含"引号"']]);
  assert.throws(() => parseCsv('x\n"unfinished'), /未闭合/);
});

test("catalog checks duplicates and broken product references without exposing values", () => {
  const products = [{ 产品编号:"A", 中文产品名称:"示例" }, { 产品编号:"A", 英文产品名称:"Example" }];
  const specs = [{ 产品编号:"missing", 指标中文名称:"指标" }];
  const assets = [{ 素材编号:"M", 关联产品编号:"missing", 文件名或共享位置:"image.jpg" }];
  const issues = checkCatalog(products, specs, assets);
  assert.equal(issues.length, 3);
  assert.ok(issues.some(issue => issue.includes("重复")));
  assert.ok(issues.every(issue => !issue.includes("missing")));
  assert.ok(checkCatalog([], [], []).some(issue => issue.includes("未提供产品")));
  assert.deepEqual(checkCatalog([{ 产品编号:"A", 英文产品名称:"Example" }], [{ 产品编号:"A", 指标英文名称:"N" }], [{ 素材编号:"M", 关联产品编号:"A", 文件名或共享位置:"image.jpg" }]), []);
});
