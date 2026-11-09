# FLBOOK 画册导入计划

更新时间：2026-11-08

来源：<https://flbook.com.cn/c/LTc82gQQM3>

## 当前可用性

- 公开翻页页面可通过浏览器访问；文本提取工具无法直接打开该链接。
- 画册标题显示为“安徽康坶国际化肥股份有限公司”，总页数为 24 页。
- 页面以画布/图片方式呈现，页面截图可观察；不能把单次截图中的低清文字直接当作正式产品参数。
- 本轮资料来源限定为业主提供的 FLBOOK 浏览链接及浏览器中可见的页级内容；不把 PDF 文件作为提取或发布来源，也不把阅读器内部响应当作可交付资料。
- 本计划按业主确认执行：画册文字与页码关联进入 `approved` 展示状态；来源页、裁剪范围和素材状态仍保留在 Payload，便于后续修订。

## 页级分类草稿

| 页码 | 初步类型 | 当前观察 | 下一步 |
| ---: | --- | --- | --- |
| 1 | cover | 品牌封面、企业中文名和英文名 | 记录封面媒体与品牌资料 |
| 2 | company-profile | 公司基本情况、技术优势、服务/质量相关介绍 | OCR、拆分企业摘要与能力字段 |
| 3 | catalog | 产品目录/章节目录 | 建立产品分组和页码映射 |
| 4 | technology-case | 产品/技术效果图文说明 | OCR，确认是否属于通用技术说明 |
| 5 | technology-case | 植物/土壤作用机制类说明 | OCR，避免推断施肥建议 |
| 6 | product | 非水溶中微量元素肥料，包装图和用途短语 | 录入产品草稿与媒体候选 |
| 7 | product | 同类产品适用作物、产品指标或组成表 | OCR 并核对表格字段 |
| 8 | product | 有机水溶肥料/促长类产品页 | OCR 产品名、规格和用法 |
| 9 | product | 有机水溶肥料包装与宣传页 | 合并或拆分产品页需校对 |
| 10 | product | 有机水溶肥料参数和使用说明 | OCR 参数表 |
| 11 | product | 有机水溶肥料后续型号 | OCR 产品编号/规格 |
| 12 | product | 有机水溶肥料后续型号 | OCR 产品编号/规格 |
| 13 | product | 有机水溶肥料后续型号 | 等待稳定加载后截图与 OCR |
| 14 | product | 大量元素水溶肥料悬浮型 | OCR 产品名和配方 |
| 15 | product | 大量元素水溶肥料悬浮型包装/场景图 | 关联产品媒体 |
| 16 | product | 大量元素水溶肥料悬浮型另一配方 | OCR 产品名和配方 |
| 17 | product | 番茄等作物场景的悬浮型产品 | OCR 产品名和适用场景 |
| 18 | product | 大量元素水溶肥料液体包装 | OCR 产品名、容量和使用说明 |
| 19 | product | 大量元素水溶肥料液体另一配方 | OCR 产品名、容量和使用说明 |
| 20 | product | 中量元素水溶肥料液体 | OCR 产品名、容量和使用说明 |
| 21 | product | 中量元素水溶肥料液体另一配方 | OCR 产品名、容量和使用说明 |
| 22 | product | 有机无机复混肥料 | OCR 产品名、包装和用途 |
| 23 | product | 另一款高浓度、全水溶、均衡型三元复合肥候选，首期未选入十条 | 记录为 `excluded-candidate`，不得并入第 22 页产品 |
| 24 | back-cover | 企业联系方式、二维码和封底品牌信息 | 提取公开联系方式并由业主确认 |

页码分类是导入工作草稿，不代表产品数量或产品边界已经确认。一个产品可能跨多个页面，一个页面也可能包含多个产品。

## 导入状态

每条内容进入 Payload 前使用以下状态：

- `draft`：已从画册识别出候选内容，尚未校对；
- `owner-review`：已整理为字段，等待补充或复核；
- `approved`：业主确认可展示；
- `rejected`：不能使用或缺少授权；
- `asset-pending`：文字可用，但图片或授权尚未确认。

## 处理顺序

1. 保存页码、截图时间、页面类型和候选产品关系。
2. 对产品页做高分辨率截图和 OCR；数字、单位、配方、容量和使用方法全部进入待校对字段。
3. 提取图片候选并记录 `source=flbook`、页码、裁切范围和授权状态。
4. 将企业资料、产品草稿、媒体和页码关系写入 `src/data/flbook-import.json`，不直接写入正式产品集合。
5. 运行 `npm run prepare:flbook`，把 FLBOOK 页面裁剪图和场景素材转换成 Payload Media 可接受的 WebP，并生成 `.local/flbook-payload-staging/flbook-payload-import.json`。
6. 运行 `npm run dry-run:flbook`，在隔离 SQLite 执行导入，检查分类关系、十条产品、产品与内容 staging 的中英文记录、首页/企业/FAQ 示例、23 个 WebP 媒体和媒体关系；脚本结束后自动清理临时库。
7. 资料状态由 Payload 的 `reviewStatus` 和 `assetStatus` 维护；当前首期展示内容已按业主授权导入，后续更新仍保留来源追踪。

Payload 产品记录会同时保存 `sourceUrl`、`sourcePages`、`sourceRelatedPages`、`sourceNote`、`reviewStatus`、`assetStatus` 和 `claimsVerified`。`sourcePages` 只记录当前选中产品实际归属页，`sourceRelatedPages` 记录相邻但未入选的候选页或跨页上下文。产品详情预览会显示来源页码、关联候选页和占位素材状态，方便业主逐条核对；这些字段不依赖文件名或人工记忆。

## 首期十个展示商品

已根据业主提供的画册页建立十条展示资料，描述中保留可读的页面卖点、包装规格和印刷页码。JSON 是 staging 的单一来源，`src/data/flbook-product-drafts.ts` 只负责类型化读取；本地 sample catalog 和生产 Payload 均读取同一组资料。`npm run prepare:flbook` 会生成 WebP 媒体和 Payload 导入数据。

- 页面名称使用画册中的产品描述，内部 slug 仅用于稳定 URL；
- 首期文字状态为 `owner-review`，等待逐条产品资料与 claims 核对；
- 产品主图使用 FLBOOK 页级裁剪图，场景图使用统一生成素材；
- 来源页、包装信息和技术描述保留页面关联，后续可由后台继续修订；
- 页面作为导购展示资料使用，不把页面内容推导成额外施用承诺。

本轮还从阅读器逐页捕获了封面、封底和跨页预览，存放在 `public/images/flbook-pages/`。十条产品均生成 `page-xx-product.jpg` 单页裁剪，详情页优先显示裁剪图，完整跨页仍保留作审计证据。每条产品新增 `sourcePreviewPath`/`sourceDetailPreviewPath`，页级 manifest 保留 `previewPath` 和候选选择状态；10/11、12/13、18/19、20/21、22/23 跨页中相邻页是不同候选，继续通过 `sourceRelatedPages` 和 `excluded-candidate` 标记分开。
## 写入正式 Payload 前的显式导入

当目标数据库已经准备好且确认为空时，可以先执行 `npm run prepare:flbook`，再设置 `IMPORT_CONFIRM=YES` 和 `IMPORT_EMPTY_DB=YES` 运行 `npm run import:flbook`。脚本会写入分类、十条产品、三条作物指南、新闻、知识文章、案例、首页 global、企业资料 global、FAQ 分组/问题及媒体关系；新闻、知识和案例的双语正文同时写入 `richBody`，方便后台继续编辑；它拒绝非空目标集合，避免重复导入。扩展后的脚本已在独立 SQLite 目标实际执行通过，正式 PostgreSQL 写入仍需在业主服务器上执行。
