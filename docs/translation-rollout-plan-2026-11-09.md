# 13 语言翻译实施计划

日期：2026-11-09  
范围：默认英语；全部 13 个公开 locale 的界面文案与当前可见业务内容  
翻译方式：Codex 起草并自审；不调用外部翻译服务。2026-11-10 已按业主授权完成旧值保护生产回填。

2026-11-10 业主再次确认：继续使用现有 Codex 草稿，不新增 LibreTranslate、商用 API 或其他自动翻译服务；允许 Codex 全量自检并直接推进生产回填。

## 业主确认的规则

- 全部公开页面都纳入翻译，包括首页、公司、产品目录/详情、联系、FAQ、方案/作物指南、新闻、知识、案例及资源页。
- 默认语言为英语；目标语言为 `zh`、`es`、`fr`、`pt`、`ru`、`it`、`tr`、`th`、`nl`、`ro`、`el`、`he`。
- 优先页面为产品、公司、联系和 FAQ；语言按国际化常见顺序分批，中文源内容已存在，第一批其余语言先覆盖西班牙语、法语、葡萄牙语和俄语。
- 只翻译已有来源文字。候选产品、未核验 claims、案例事实和缺少来源的字段不补写事实；翻译不得将 `owner-review` 改成 `approved`，也不得更改 `claimsVerified`。
- 邮箱、WhatsApp、数字、化学式、单位、产品 slug、来源 URL 和来源页码按原值保留。术语不确定时保留原文并记录问题，不猜测。
- 机器或 AI 起草稿的完成不等于专业法律/农艺审校；对外发布前需按内容风险标记边界。

## 分批策略

1. **核心询盘路径**：产品目录/详情、公司介绍、Contact、FAQ。先覆盖 `zh`、`es`、`fr`、`pt`、`ru`，再覆盖 `it`、`tr`、`th`、`nl`、`ro`、`el`、`he`。
2. **首页与公司资料**：首页轮播、精选卡片、公司摘要/关注方向/发展节点；逐语言继续同一顺序。
3. **内容栏目**：方案与作物指南、新闻、知识文章、案例和资源页；只翻现有标题、摘要与正文，不创造技术建议或案例事实。
4. **发布复核**：逐语言检查长度、日期/数字/单位、专名、链接、SEO 元数据和 Hebrew RTL；缺译不得算作完成。

## 覆盖边界

- 所有 CMS 翻译先保存在版本控制内的源/导入草稿或隔离数据库中；未经单独备份与回读，不直接批量覆盖生产 Payload 内容。
- 生产 CMS 的编辑内容可能已与仓库 staging 漂移。回填脚本必须按 slug、locale、当前旧值保护人工修改，不可将 staging 整体重导入生产。
- UI 字典必须直接声明每个 locale，不能靠英语 fallback 冒充已翻译。CMS 字段通过 `fallbackLocale: false` 读取；空译继续显示明确的缺译提示。

## 当前进度

- 已有 13 locale：公司介绍、联系、FAQ 与主导航的界面字典。
- 本轮补齐 13 locale：产品目录、产品详情 UI 字典、数量和分页提示；新增 `tests/product-ui-locales.test.mjs` 防止这些产品 UI 字段回退英语。
- UI 字典批次 A/B 已将 footer、hero、首页产品区、新闻、知识、案例、搜索、系列/种植方式、导航详情和知识主题扩展为 13 个 authored locale；`tests/ui-authored-locale-coverage.test.mjs` 与 `tests/ui-content-locales.test.mjs` 防止这些地图重新回退到英语对象。新增文本仍是 Codex 草稿，未经过专业母语审校，不能等同于正式翻译完成。
- CMS 第一批草稿已覆盖 `es`、`fr`、`pt`、`ru`：10 条 FLBOOK 产品名称/来源简介/规格标签/分类，以及公司介绍和 FAQ。隔离 SQLite dry-run 回读全部通过；原有规格数值、单位、来源页与审核元数据保持不变。`typecheck`、`validate:flbook` 和第一批回归测试通过。
- CMS 第二批产品切片已覆盖 `it`：10 条 FLBOOK 产品名称/来源简介、23 个规格标签和 3 个分类名称，数据单独保存在 `src/data/flbook-localizations-phase2-it.json`，并已接入 FLBOOK staging/校验。隔离 SQLite dry-run 回读 `it` 产品名称、简介、规格标签、分类、76 条规格数值/单位、来源页和审核元数据全部通过；其他语言仍未在本批次扩展。
- 同一批次已补齐 `it` 公司介绍和 FAQ，数据保存在 `src/data/core-page-localizations-phase2-it.json`，并接入隔离导入回读；法律名称、邮箱、WhatsApp、来源边界和审核状态保持不变。
- 第三批产品切片已覆盖 `tr`：10 条 FLBOOK 产品名称/来源简介、23 个规格标签和 3 个分类名称，数据保存在 `src/data/flbook-localizations-phase3-tr.json`；土耳其语公司介绍和 FAQ 保存在 `src/data/core-page-localizations-phase3-tr.json`。
- 阶段 4–8 已依次补齐 `th`、`nl`、`ro`、`el`、`he`：每种语言均覆盖 10 条 FLBOOK 产品名称/来源简介、23 个规格标签、3 个分类名称，以及公司介绍和 FAQ；对应数据分别保存在 `src/data/*-localizations-phase4-th.json`、`phase5-nl.json`、`phase6-ro.json`、`phase7-el.json`、`phase8-he.json`，并已接入 prepare/validate/import/dry-run source list。`he` 额外保留 RTL 内容边界，数据不携带 `dir`/`direction` 或 HTML。
- 当前产品、公司和 FAQ 的 CMS 草稿已覆盖全部 13 个 locale（`en`、`zh`、`es`、`fr`、`pt`、`ru`、`it`、`tr`、`th`、`nl`、`ro`、`el`、`he`）。各批次 focused tests、`validate:flbook`、`typecheck` 和隔离 SQLite dry-run 均通过；dry-run 回读 13 个 locale、10 条产品、76 条规格值/单位、来源页和审核元数据均保持不变。
- 首页三批切片已将原先硬编码的首页种子抽出为 `src/data/homepage-staging.json` 及 `homepage-localizations-phase1/2/3.json`：13 个 locale 均覆盖 3 条 Hero 和 3 张精选卡。`tests/homepage-localizations-phase*.test.mjs`、`scripts/validate-homepage-staging.mjs` 与隔离 dry-run 均通过；Hebrew 数据不携带 HTML、`dir` 或 `direction`，RTL 由 locale shell 处理。首页 CMS 草稿仍未写生产，也未经过母语、法律或农艺审校。
- 新闻、知识文章和案例的三批 CMS 草稿已覆盖全部 13 个 locale：9 条记录的 title/summary/body、知识文章 author，以及现有 richBody 转换链路均通过 `fallbackLocale:false` 隔离回读；slug、kind、topics、日期、图片、assetStatus 和审核边界保持不变。内容 validator 报告 `missingLocales=[]`，但这些仍是未写生产、未经过专业审校的本地草稿。
- 作物指南三批 CMS 草稿已覆盖全部 13 个 locale：3 条指南的全部字段和 5 个 section title 均通过 `fallbackLocale:false` 隔离回读；数组内 localized section title 使用稳定 section ID 关联，避免语言更新时丢失标题。Hebrew 数据不含 HTML、`dir` 或 `direction`，RTL 继续由 locale shell 处理。
- 以上均为版本控制中的本地草稿和隔离库验证，未写生产 Payload，尚未部署，也未经过专业母语、法律或农艺审校。首页、新闻、知识、案例和方案/作物指南的 CMS 草稿已覆盖 13 个 locale；资源页主要依赖 UI 字典，仍需完成其 authored coverage。英语 fallback 只表示运行时兜底，不等于页面已完成翻译。
- 生产内容可能与仓库 staging 漂移；本轮已使用按 slug/locale/旧值保护的精确回填脚本，未重跑全量 seed。

## 验收

- `npm run typecheck` 通过。
- `node --experimental-strip-types --test tests/product-ui-locales.test.mjs` 通过。
- 每个 CMS 语言切片均有独立 focused test，覆盖字段完整性、来源页引用、23 个规格标签、3 个分类、联系渠道和审核边界；`validate:flbook`、`typecheck` 与隔离 SQLite dry-run 已覆盖全部 13 个 locale，规格值/单位、来源页和审核元数据保持不变。
- 以上验收只证明工作区与隔离库切片可回读；仍需专业母语、法律和农艺审校、生产备份、按 slug/locale/旧值保护的精确回填，以及生产回读后才能考虑发布。
- 每批语言做关键页面真实浏览器检查；Hebrew 额外核对 `lang="he"`、`dir="rtl"`、布局溢出与数字/化学式阅读顺序。当前 CMS 草稿尚未完成这轮完整人工审校和生产浏览器验收。

## 2026-11-10 生产回填补充

业主已明确授权由 Codex 直接完成全部外文翻译、自检并继续推进，不再等待外部母语审校，也不新增翻译服务。此次执行保持产品数值、单位、化学式、来源页、URL、claims 和审核元数据不变。

- 11 个外文 locale 只读预览：2,387 个空字段可安全填充，0 个已有值冲突，0 个翻译源缺失。
- 生产回填前完成 PostgreSQL custom dump（180,379 bytes）和媒体 manifest（104 files，65,865,625 bytes）。
- 生产精确回填完成 396 个 Payload 文档/全局更新；随后读回为 2,387 unchanged、0 conflict、0 missing。
- 公网 11 locale × 产品/About/FAQ/News 共 44 路由检查通过；smoke 23/23、SEO 5/5、RTL CSS 合同和候选资产合同通过。

本次自检是 Codex 内容与结构自检，不等同专业母语、法律或农艺认证；后续可通过 Payload 后台逐字段维护，回填脚本会保护已有非空值。

## 2026-11-10 UI 字典补充验收

- UI 批次 A 为 footer、hero、首页产品区；批次 B 为新闻、知识、案例、搜索、系列/种植方式、导航详情和知识主题。上述 10 个 UI map 均有 13 个 authored locale。
- `tests/ui-authored-locale-coverage.test.mjs` 与 `tests/ui-content-locales.test.mjs` 共 2/2 PASS；`npm run typecheck`、`check:locale`、RTL CSS 合同 PASS。
- `validate-content-localizations.mjs`、`validate-crop-guide-localizations.mjs`、`validate-homepage-staging.mjs` 均报告 `missingLocales=[]`。
- 本阶段只补齐本地 UI 草稿和可重复验证，不写生产 Payload；人工母语、法律、农艺审校和真实浏览器长文案验收仍未完成。
- 组件内联文案补充：`product-resources.tsx`、`sustainability-content.tsx` 和 `home-company-focus.tsx` 的 authored locale coverage 已核对；`tests/component-locale-coverage.test.mjs` 通过。该覆盖不代表所有页脚硬编码入口或 CMS 业务内容均已完成翻译。
- 隔离 Payload 浏览器验收：临时 SQLite + media 导入全部本地草稿后，Hebrew/Portuguese 关键首页、About、产品页面在 390px 下无待翻译占位、无英文资源标签、无 console error；临时库已清理。生产回填已完成，专业审校保留为可选后续维护。
- 询盘组件补充：`inquiry-form.tsx` 与 `product-enquiry-preview.tsx` 已补齐 13 locale authored labels/status；组件 coverage 回归继续通过。Contact 页面标题/说明随后已独立抽 map；剩余 partial inline maps 见当前阶段闸门。
- Contact 容器补充：新增 `contact-inquiry-messages.ts`，统一 13 locale 的询盘标题、说明、处理提示、公司标签和地址兜底；组件 coverage、typecheck 通过。
- Smart farming 补充：新增 `smart-farming-messages.ts` 并将页面从 en/zh/fr/es 分支统一为 13 locale authored map；组件 coverage、typecheck 通过。
- 方案详情补充：新增 `solution-page-messages.ts`，将通用方案详情界面文案统一为 13 locale authored map；组件 coverage、typecheck 通过。fr/es 专属展示分支保留其既有来源标记，作物指南数据链路未改动。
- 案例轮播补充：新增 `case-carousel-messages.ts`，将案例轮播的角色、标题、缺译提示、控制项和链接文案统一为 13 locale authored map；`case-carousel.tsx` 不再保留 en/zh/es/fr 分支，组件 coverage、typecheck 和 diff check 通过。fr/es 专属方案展示分支仍需一致性复核。
- 首页编辑内容补充：新增 `home-editorial-messages.ts`、`home-featured-messages.ts`，并将 `home-news.tsx`、`home-stories.tsx`、`home-featured.tsx` 的标题、简介、缺译提示、空态和入口文案统一为 13 locale authored map；保留西语精选卡片原有 insights 链接。组件 coverage、typecheck 和 diff check 通过。
- 组件 inline 补充：`home-company-story.tsx`、`home-newsletter.tsx`、`desktop-quick-links.tsx`、`mobile-quick-links.tsx`、`practice-menu-groups.tsx` 和 `product-insights.tsx` 已补齐 13 locale authored entries；coverage、typecheck、locale contract、RTL CSS contract 和 diff check 通过。剩余工作集中在产品系列/方案索引的少量导航/计数硬编码及需保留的 fr/es 专属结构。
- 参考路由补充：`reference-route-messages.ts` 新增面包屑、首页、产品单复数、详情和返回入口字段；产品系列与种植方式索引移除 en/zh 硬编码并通过 typecheck、UI locale coverage 和 diff check。需保留的 fr/es 专属页面结构未机械合并。
- 缺译提示补充：新增 `product-information-messages.ts` 并将产品信息缺失提示扩展为 13 locale；新闻、知识、案例和站内搜索移除 en/zh 特殊分支，统一读取现有 authored pending 文案。组件 coverage、typecheck 和 diff check 通过。
- 缺译分支继续收口：Hero、首页产品、产品详情和新闻详情统一读取现有 locale pending 文案；西语桌面/移动导航的方案入口改读 authored `methodsIndex`，不改变专属路由结构。typecheck 和 diff check 通过。
- 共享 UI 补充：新增 `shared-ui-messages.ts`，统一 13 locale 的 skip link 与产品占位图文案；资源页面包屑改读现有 authored About breadcrumb。组件 coverage、typecheck、locale contract、RTL CSS contract 和 diff check 通过。
- 方案详情分支收口：`solution-content.tsx` 移除 fr/es 重复 JSX 分支，统一使用 13 locale `solutionPageMessages`；保留 `frenchSolutionLabels`、`spanishSolutionLabels` 作为来源/slug 适配。方案 route contract 与 solutions locale smoke 均通过。
