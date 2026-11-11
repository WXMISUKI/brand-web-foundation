# 13 语言人工审校包（2026-11-10）

状态：`CODEX-SELF-REVIEWED / PRODUCTION-BACKFILLED`。本包记录 Codex 自检和生产回填证据；不代表任何语言获得专业母语、法律或农艺认证。

## 审校范围

优先页面顺序：

1. 产品目录、产品详情、产品规格标签和 Contact 入口。
2. About、FAQ、首页 Hero、精选卡片和询盘提示。
3. Solutions、Crop Guides、News、Insights、Cases、Resources。

## 语言批次

| 批次 | locale | HTML lang | 方向 | 当前草稿状态 | 人工签核 |
| --- | --- | --- | --- | --- | --- |
| A | `zh` | `zh-CN` | LTR | 已有源内容 | 待确认 |
| A | `es` | `es` | LTR | Codex 草稿 | 待确认 |
| A | `fr` | `fr` | LTR | Codex 草稿 | 待确认 |
| A | `pt` | `pt` | LTR | Codex 草稿 | 待确认 |
| A | `ru` | `ru` | LTR | Codex 草稿 | 待确认 |
| B | `it` | `it` | LTR | Codex 草稿 | 待确认 |
| B | `tr` | `tr` | LTR | Codex 草稿 | 待确认 |
| B | `th` | `th` | LTR | Codex 草稿 | 待确认 |
| B | `nl` | `nl` | LTR | Codex 草稿 | 待确认 |
| B | `ro` | `ro` | LTR | Codex 草稿 | 待确认 |
| B | `el` | `el` | LTR | Codex 草稿 | 待确认 |
| B | `he` | `he` | RTL | Codex 草稿 | 待确认 |

英语 `en` 是源语言，也需要业务资料和 claims 边界复核，但不作为翻译签核对象。

## 每条内容的审校字段

- locale、页面、slug、字段名
- 审校前文本和审校后文本
- 审校人、角色、日期
- 来源页码或业主资料链接
- 是否涉及产品类别、规格、claims、认证、销售状态或法律名称
- 是否保留数字、单位、化学式、产品 slug、URL 和来源页码
- 是否需要业务、法律或农艺二次签核
- 回填前的当前旧值（用于旧值保护）

## 产品与农艺术语检查

- `N-P₂O₅-K₂O`、`TE`、溶解性、施用、作物和营养阶段术语保持语义一致。
- 不新增剂量、效果、认证、销售承诺或未出现在来源中的适用作物。
- 规格数值、单位、典型/最小/最大值不能被翻译改写。
- `owner-review`、`claimsVerified=false` 等内部状态不出现在公开文本中，也不能被翻译流程改变。
- 复合肥缺少可靠定量资料时，所有语言都保持缺失提示，不补造配方数字。

## 法律与联系人检查

- 公司法定名称、邮箱、WhatsApp、地址按业主确认值保留。
- 隐私、consent、询盘处理说明不得暗示邮件已发送或承诺响应 SLA。
- 联系入口、来源 URL、产品 slug 和 canonical 路径不能被翻译破坏。

## Hebrew / RTL 额外检查

- `lang="he"`、`dir="rtl"`、数字和化学式阅读顺序。
- Header、菜单、表格、规格滚动区域、表单错误和固定快捷栏无溢出或遮挡。
- 不在翻译文本中加入 `dir`、`direction` 或未经允许的 HTML。

## 回填闸门

人工签核完成后，每批必须按以下顺序执行：

1. 只读读取目标 slug、locale 和当前旧值。
2. 生成逐字段 dry-run，旧值不匹配则跳过并报告冲突。
3. 完成 PostgreSQL 与媒体备份。
4. 在 Payload 后台编辑冻结或确认版本冲突保护。
5. 精确写入并回读目标字段、来源、审核状态和媒体关系。
6. 运行对应语言×页面×视口浏览器验收，再决定是否进入下一批。

未完成人工签核前，生产仍保持当前英语 fallback 和既有内容，不把草稿覆盖写入生产。

## 2026-11-10 业主授权后的执行结果

状态更新为：`CODEX-SELF-REVIEWED / PRODUCTION-BACKFILLED`。业主明确要求由 Codex 主动完成全部外文翻译并快速推进，因此本包不再等待外部人工签核；仍保留专业审校风险说明。

- 11 个外文 locale、产品/公司/FAQ/首页/新闻/知识/案例/作物指南的现有草稿已按 Payload locale 字段精确回填。
- 回填脚本：`scripts/backfill-localizations.mjs`；默认 `preview`，写入必须同时提供三项确认环境变量。
- 旧值保护规则：空值才填充；已有非空值保留并记录冲突；并发变化会在写入前中止。
- 生产读回：2,387 unchanged、0 conflict、0 missing；数值、单位、来源、审核状态和媒体关系未被翻译流程改写。
- 备份：服务器 `.local/backups/translation-stage4-20261110T213600Z/`。
