# 官方候选公开边界只读审计（2026-11-10）

状态：`PASS-SCOPED / WAITING-EXTERNAL`。本记录只保存 schema、代码和公网 GET 证据，不授权生产写入或部署。

## Schema 与代码结论

- `Products` 没有 `published` 字段。审核字段为 `reviewStatus`、`assetStatus`、`claimsVerified`，其中审核字段只允许管理员读取。
- 未登录读取通过 `afterRead` 删除审核和来源内部字段；匿名 API 仍由 access 控制为不可读。
- 前台产品查询不按 `reviewStatus` 或 `claimsVerified` 过滤，而是排除 `publicProductAliasSlugs`。因此公开展示与审核通过是两个独立维度。
- 当前本地 canonical/alias 关系为 `official-569687` → `official-569688`、`official-569693` → `official-569692`；详情读取会将 alias 规范化到 canonical 并合并来源媒体。
- 21 条新增候选仍必须保持 `owner-review / claimsVerified=false`，不能因为公开展示而补充型号、包装、定量规格、销售状态或 claims。

## 公网只读证据

使用 GET 读取 `https://www.kowloonglobaltrading.com`：

- `/en/products`、`/en/products/official-569687`、`/en/products/official-569688`、`/en/products/official-569693`、`/en/products/official-569692` 均返回 HTTP 200。
- 公开 HTML 未发现 `reviewStatus`、`claimsVerified` 或 `assetStatus` 字段名。
- `/en/products` 仍包含历史中文候选名称和简介，例如 `大量元素水溶肥`、`复合肥料16-16-16`，并出现历史模板 `KOMU product · 中文名称`。
- 公网产品列表的 featured/alias 展示与当前工作区的 alias 排除实现不一致，说明生产实例尚未包含全部本地阶段修改；不能用公网响应证明当前工作区的去重修复已部署。

## 可重复审计命令与最新结果

新增 `npm run audit:official-candidate-public-boundary`。该命令只执行 GET，不写 Payload；默认观察模式不假设候选必须公开，设置 `EXPECT_PUBLIC_CANDIDATES=1` 后才会把缺失详情列为失败。

2026-11-10 初次对生产域名运行观察模式：

- 21/21 候选详情返回 HTTP 200，未发现审核字段泄漏。
- 产品列表出现 15 个候选链接，详情层观察到 21 条候选可访问。
- 21/21 详情仍包含历史中文候选名称/简介模板，因此状态为 `PARTIAL`，证明阶段 1 的生产英文修复尚未部署。

随后业主确认公开展示并完成生产精确修复和 standalone 发布。设置 `EXPECT_PUBLIC_CANDIDATES=1` 复跑：

- 21/21 候选详情 HTTP 200，列表和详情公开边界通过。
- `staleCopy=[]`，没有历史中文英文名称/简介模板。
- `leakedFields=[]`，没有 `reviewStatus`、`claimsVerified`、`assetStatus` 等审核字段泄漏。
- 当前结果：`PASS-SCOPED`；型号、包装、定量规格、销售状态和 claims 仍保持未核验状态。

## 阶段 3 的后续门禁

1. 先由业主确认 21 条候选的展示决策、三组同名关系、canonical/alias、型号/包装、销售状态、规格来源、claims 和图片授权。
2. 在隔离 Payload 中验证真实 schema、查询结果、canonical/alias、来源媒体和审核字段边界。
3. 生产窗口内先备份并冻结候选编辑，再按确认批次精确写入；写后管理员回读和匿名 HTML 回读必须同时通过。
4. 发布前后记录实际 commit/build ID，避免把本地 alias 去重或阶段 1 英文修复误记为生产完成。
