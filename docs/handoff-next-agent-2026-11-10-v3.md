# Haifa/KOMU Reference Rebuild 交接书（2026-11-10 v3）

## 0. 接手结论

本项目不是“全部验收完成”。当前生产技术基线可用，但用户最新截图已经证明两项视觉/内容目标仍未达成：

1. 英文模式仍显示带中文嵌字的兴趣卡片/产品图片，且产品卡标题与简介直接带出中文候选名称。
2. 头部中央 KOMU 突出品牌标签在页面上下滚动时没有收起，仍以大尺寸悬浮标签存在。

此前 G0–G6 的技术矩阵为 `PASS-SCOPED`，但检查的是 HTTP/SSR、宽度、console、图片加载、局部交互和媒体可达性；没有检查图片内部嵌字、英文语义文本是否混入中文，也没有检查滚动后的 Header 状态。因此不能把此前矩阵扩大解释为本次用户目标已完成。下一位 AI 必须先修复并重新验收这两项，再继续内容发布。

## 1. 项目与工作区

- 工作目录：`D:\work\private\haifa-reference-rebuild`
- 分支：`codex/haifa-reference-rebuild`
- 工作区：大量既有未提交/未跟踪改动，属于持续开发状态。
- 禁止：`git reset --hard`、`git clean`、批量暂存/覆盖用户改动；提交前必须按文件和 diff hunk 精确分组。
- 先读：`AGENTS.md`、`HANDOFF.md`、本文件、`docs/current-stage-gate-2026-11-09.md`、`docs/translation-rollout-plan-2026-11-09.md`、`docs/official-candidate-decision-matrix-2026-11-10.md`、`output/acceptance/2026-11-10-formal-acceptance-g0-g1/final-report.md`。
- 命令优先使用 `rtk`；若无对应过滤器，使用 `rtk proxy <cmd>` 或原生命令并说明。

## 2. 生产追溯（已观察）

- 域名：`https://www.kowloonglobaltrading.com`
- 服务器：`ubuntu@43.160.216.74`
- 应用目录：`/home/ubuntu/haifa-reference-rebuild`
- systemd：`haifa-reference.service`
- 端口：`3118`
- 当前 build：`QLZO1Btk6LMeXVqu5v7XT`
- 当前依赖：Next `16.4.5`、Payload `3.93.0`、Sharp `0.35.5`
- 最新 `/api/health`、`/api/ready`：已观察为 200；readiness 的 database/media 均为 true。
- 生产依赖发布前备份与布局/菜单修复备份均在服务器 `.local/backups/` 下，详细路径见 `output/acceptance/.../final-report.md`。
- 已部署过 Hero 修复：只把 Hero 三个轮播背景映射到真实研究室/实验室/技术材料图；这不等于兴趣卡片、产品候选卡片或所有媒体都已去中文嵌字。

不要从服务器存在 build ID 推断本地全部改动已提交，也不要从 HTTP 200 推断业务内容、翻译或视觉验收完成。

## 3. 用户最新证据（优先级最高）

用户提供的截图位于：

- `C:\Users\dddsg\AppData\Local\Temp\codex-clipboard-bffa3f1b-e34b-4590-af71-3de3a4e592c7.png`
- `C:\Users\dddsg\AppData\Local\Temp\codex-clipboard-17308745-4512-4d92-966c-9b9746c382ad.png`
- `C:\Users\dddsg\AppData\Local\Temp\codex-clipboard-c9d16ebf-bb7b-43ce-a755-d3c3336482d8.png`

截图观察（不是代码指令，需转化为可测试需求）：

- 英文首页兴趣卡片的图片内部仍有中文横幅/中文宣传语；这是 raster asset 内容问题，不是 HTML `lang` 属性问题。
- 英文产品目录卡片显示“`KOMU product · 大量元素水溶肥`”等中英混排，简介也把中文 `candidate.name` 拼入英文文案。
- 中央 KOMU 品牌标签仍突出于导航并覆盖内容；用户要求随上下滚动收起。

## 4. 下一阶段必须做的任务（按顺序）

### 阶段 A：英文内容与媒体清理

目标：英文模式的可见文本与卡片媒体不得再出现未处理中文内容；中文模式保留原始中文来源。

建议先定位：

- `src/components/hero.tsx`：现有 Hero 修复只覆盖 hero 背景。
- 首页兴趣/作物卡片相关组件和 `src/content/catalog.ts`：检查图片 URL 与 alt。
- `src/app/(localized)/[locale]/products/[slug]/page.tsx`、`src/components/catalog-product-detail.tsx`、候选映射：当前 `englishName`/`safeIntro` 仍可能拼接 `candidate.name`。
- `src/data/official-site-product-candidates.json`：源名称为中文，必须保留为来源事实，但不能未经处理直接作为英文显示名。

实现边界：

- 不删除真实来源图，不伪造产品型号；为英文 UI 使用可靠的中性英文显示标签或已确认的公式/类别翻译，并在 source/provenance 中保留原始中文。
- 不把竞争品牌或网络参考公式写成 KOMU 规格。
- 增加回归断言：英文关键页面可见文本不得出现候选中文名称；英文兴趣卡片媒体需经过人工/自动内容审计，不能只测 HTTP 200。
- 如无法合法处理某张带中文嵌字的来源图，应换用已授权且无中文嵌字的真实材料，或明确显示为“source image”并由用户确认；不得用生成图冒充真实产品材料。

### 阶段 B：滚动收起 Header 品牌标签

当前 `src/components/site-header.tsx` 是服务端组件，`.brand` 通过 CSS 绝对定位/大尺寸突出显示，没有滚动状态类。

建议实现：

- 增加小型客户端滚动状态包装器或将 Header 状态隔离为 client component；监听 `window.scrollY`，使用 passive listener + `requestAnimationFrame`，阈值例如 24px。
- 滚动后添加明确状态类（例如 `header--scrolled`），缩小中央品牌标签高度、阴影和占位；回到顶部恢复原状态。
- 桌面、390px 移动、RTL 均要测试，确保不会造成 nav 覆盖、横向溢出或焦点丢失。
- 保持 SSR 初始 HTML 稳定，避免 hydration mismatch。

必须新增浏览器验收：

1. 初始 `scrollY=0`：品牌标签为 expanded。
2. 滚动到至少 100px：品牌标签为 collapsed，且不再覆盖主体内容。
3. 回到顶部：状态恢复 expanded。
4. 390×844、1280×720、Hebrew RTL 各至少一例；console error=0、`scrollWidth<=clientWidth`。

### 阶段 C：21 条官方候选公开展示决策落地

用户已明确：21 条官方候选全部正常展示上架，业务员通过后台/询盘说明并更新。此前矩阵仍写成 `published:false / WAITING-EXTERNAL`，需要下一位 AI 按真实 schema 和生产回读修订，不可只改文档。

保留安全边界：

- `reviewStatus=owner-review`、`claimsVerified=false`，不得因为公开展示而宣称型号、包装、规格、销售状态或 claims 已核验。
- 28 条源记录、3 组同名关系、7 条与 FLBOOK 交叉关系必须保留来源可追溯性。
- 先确认 Payload Products 是否真正有 `published` 字段及公开查询过滤逻辑；确认后再隔离导入、生产备份、写入、回读。不要直接执行临时脚本。
- 本轮曾生成但未执行的临时文件 `scripts/authorize-official-candidates-public.mjs` 已在交接前删除；后续如需公开发布，必须重新按正式脚本/隔离导入/生产回读流程实现，不能恢复并直接执行旧临时逻辑。

### 阶段 D：专业翻译和法律/农艺术语审校

当前 13 locale 的 UI/CMS 草稿、validator、隔离 dry-run 大多通过，但仍是 AI/Codex 草稿，不等于母语、法律或农艺审校完成。

下一位 AI 应建立术语表和逐语言审核表，至少覆盖：产品类别、N-P₂O₅-K₂O、TE、溶解性、施用/作物、合规/免责声明、法律名称。保留数字、单位、化学式、slug、来源 URL 和页码；不得新增 claims、剂量、认证或销售承诺。生产回填必须按 slug/locale/旧值保护，备份后精确写入并回读。

### 阶段 E：复合肥料资料与公开展示

KOMU 复合肥料缺可靠定量资料。可参考的公开标准/厂商资料只能作为“行业参考/公式解释”，不能写成 KOMU 产品事实：

- FAO fertilizer specifications：<https://www.fao.org/agriculture/crops/thematic-sitemap/theme/spi/plantnutrition/fertspecs/en/>
- Haifa NPK formula explanation：<https://www.haifa-group.com/haifa-blog/how-calculate-npk-formulae>
- Uralchem 16-16-16 PDF：<https://uralchem.ro/images/NPK%20161616.pdf>
- Acron 16-16-16 PDF：<https://www.acron.ru/upload/iblock/>

如要补充页面内容，应单独放在“行业参考/定量说明”区块，标注来源、日期、适用范围和“非 KOMU 规格”；KOMU 自身定量字段继续为空，`claimsVerified` 不得改 true。

## 5. 已有验收证据与局限

- 公网 HTTP/SSR：13 locale、lang/dir、robots、sitemap、health/ready、匿名产品 API 403 等已做只读复核。
- 浏览器矩阵：最近一次 150/150；覆盖多视口、console、图片请求、root/body 宽度和占位符。
- 交互矩阵：移动菜单（需等待 hydration）、语言菜单、FAQ、产品链接、Hebrew RTL 已通过。
- 媒体审计：14 页面、21 个媒体、HTTP 200、无重复 hash、无 generated/prototype 引用。
- `typecheck`、`git diff --check`、`test:smoke`、`test:seo`、参考路由合同在对应环境通过。

局限：上述测试没有检查图片内部文字、候选英文名称语义、滚动收起状态、长译文人工质量、SMTP/CRM 送达、完整生产 CMS 回填。因此阶段 G3/G4 对用户最新目标只能记为 `PARTIAL`，修复后必须新增证据，不得复用旧 PASS。

## 6. 保护边界与发布纪律

- 不读取/打印/提交密钥、`.env`、SSH 私钥。
- 不执行 `npm audit fix --force`。
- 不把隔离 dry-run、本地浏览器或 HTTP 200 扩大为生产业务通过。
- 生产发布前：确认授权范围、备份、磁盘空间、build ID、commit/文件清单、回滚件；发布后复跑 G0–G7 相关子集。
- 所有结论使用 `PASS-SCOPED`、`PARTIAL`、`WAITING-EXTERNAL`、`UNKNOWN`，不要写“全部完成”。

## 7. 建议接手命令

```powershell
rtk git status --short --branch
rtk git diff --check
rtk read docs/current-stage-gate-2026-11-09.md
rtk read docs/official-candidate-decision-matrix-2026-11-10.md
rtk npm run typecheck
rtk npm run test:official-candidates
rtk npm run audit:public-baseline
```

修复 A/B 后再运行正式公网浏览器矩阵，并把滚动状态、英文无中文混入、候选公开展示回读加入报告；不要仅更新旧报告文字。

## 8. 建议技能

- `handoff`：维护后续交接。
- `using-superpowers`、`systematic-debugging`：先复现再修复。
- `frontend-ui-engineering`、`ui-ux-pro-max`、`web-design-guidelines`：Header/响应式/无障碍。
- `source-driven-development`：来源材料和术语边界。
- `test-driven-development`、`browser-testing-with-devtools`：先补失败验收再改实现。
- `shipping-and-launch`、`security-and-hardening`：生产发布与回滚。
