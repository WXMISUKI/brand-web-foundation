# P2 正式内容与产品模型验收

> 历史阶段快照。2026-11-09 后续授权审核已批准 10 条 FLBOOK 产品；当前状态以 `docs/current-stage-gate-2026-11-09.md` 和 `docs/p3-release-decision-2026-11-09.md` 为准。

日期：2026-11-08

状态：**PASS-SCOPED**。P2 的内容模型、公开安全呈现、双语产品详情补充、媒体 alt 和缺失联系信息修复已部署并通过真实公网回归；产品的逐项正式参数/claims 仍保留 `owner-review`，不被本阶段伪装成最终审核完成。

P1 已通过，P2 的代码模型、公开安全空态和来源边界已具备；正式技术参数、包装说明、用途、施用说明和 claims 仍缺少业主确认资料，因此不能把当前草稿状态升级为正式内容通过。

## 已通过的模型与安全边界

- 生产 PostgreSQL 有 10 条产品；每条都有英文/中文名称和简介、主图、来源页、来源预览路径。
- 已将 10/10 产品的审核状态降为 `reviewStatus=owner-review`、`claimsVerified=false`，保留 `assetStatus=owner-supplied`，消除“未逐项核验却显示已批准”的治理冲突。
- 已补齐 10/10 产品英中 `materials`、`packaging`、`uses`、`instructions`，内容使用来源页已有定位和联系式技术资料提示，不编造施用量。
- 已为来源页明确显示配方的两条悬浮型产品写入 2 条英中规格行；其他产品仍保留安全空态，等待更完整技术表。
- 产品详情已实现安全空态：缺失规格显示联系团队/来源页提示，不生成单位、施用量或功效；缺失字段不回退到错误语言。
- 匿名公开读取不会返回 `sourceUrl`、`sourceRelatedPages`、`sourceNote`、`reviewStatus`、`assetStatus`、`claimsVerified` 等内部 provenance 字段。
- 10 条英文产品详情均未出现 `await review`、`PREVIEW`、`placeholder` 或 `Information unavailable`；产品、FAQ、新闻富文本和媒体在 P1 重启后保持干净回读。
- 已修复首页、新闻、知识、案例的 HTML-escaped JSON 图片 alt；About 空里程碑和 Contact 缺失地址改为联系式文案，公网抓取验证通过。
- 产品详情的字段组织参考 Haifa 公开产品页常见的“用途、包装、营养分析、技术资料”结构；未复制 Haifa 品牌、配方或数值到 KOMU 产品。

## 当前门禁结论

P2 的工程实现和公开展示门禁通过，可以进入 P3。正式资料治理仍保持 `owner-review`：后续若要解除 noindex 或对外宣称完整规格，仍需逐条补齐正式名称/型号、规格及单位、claims、停产状态和最终翻译。

不得从 FLBOOK 低清截图、参考站文案或生成图片推算配方、数值、认证、施用量或真实案例。资料到位后，按产品逐条通过 Payload 后台录入/修正，前台英文/中文回读，数据库字段对账，最后再决定是否把审核状态恢复为 `approved` / `claimsVerified=true`。

## P2 验收命令与证据

```bash
npm run typecheck
npm run validate:flbook
npm run validate:content
npm run validate:crop-guides
npm run check:locale
PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke
```

P1/P2 部署后的公网 smoke 为 23/23；P2 数据门禁使用生产数据库字段对账、真实页面抓取和重启后回读，未用 staging dry-run 替代。

2026-11-09 的参考链接与资料边界复验见 `docs/p2-source-audit-2026-11-09.md`：staging 页码和审核状态已校正，dry-run 公开/管理员 provenance 回读和生产公开详情回归均通过。

2026-11-09 的可读来源参数证据见 `docs/p2-parameter-evidence-2026-11-09.md`：9 个产品的 76 条参数已按 FLBOOK 页级表格写入，只有缺少可靠定量表的有机无机复混肥料继续保持空规格和 `owner-review`。

新增 `npm run check:p2-release` 只读门禁：当前报告 10 个产品、76 条规格、10 个 `owner-review`、0 个 `claimsVerified`，因此明确返回 `ready:false`。这不是失败的技术回归，而是正式 claims、型号、包装、证书和最终译文尚未获得正式审核的外部发布门禁。

2026-11-09 生产管理员视图对账发现历史导入遗漏 `reviewStatus`、`assetStatus`、`claimsVerified`；已在备份 `payload-2026-11-08T20-20-27-070Z.dump` 后按 slug 精确补回 10 条产品的 provenance/review 元数据，未覆盖名称、简介、规格或详情。管理员审计 `audit-production-products.mjs` 返回 `missingCount=0`，随后 smoke 23/23、SEO 4/4 通过。

元数据修复后公开边界复验：匿名 `GET /api/products?limit=1` 返回 `403`；英文产品详情 HTML 不包含 `reviewStatus`、`assetStatus` 或 `claimsVerified`。
