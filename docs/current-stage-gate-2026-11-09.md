# 当前阶段闸门审计（2026-11-09）

本报告按真实生产、真实浏览器、HTTP/API、数据库/媒体证据区分已通过范围和仍待处理事项。2026-11-09 正式发布已按业主授权完成当前范围；本报告不代表人工翻译、邮件送达或候选产品审核全部完成。

| 阶段 | 当前状态 | 已验证证据 | 仍需完成 |
| --- | --- | --- | --- |
| P0 生产与公开边界 | PASS-SCOPED | 生产 PostgreSQL、`/api/ready`、匿名产品 API 403、公开 HTML 不泄漏审核字段、静态资源和媒体回读 | 持续运维备份与安全审计 |
| P1 后台与恢复 | PASS-SCOPED | 管理员 users=1、Payload 编辑回读、媒体替换、联合 PostgreSQL/media 备份、systemd 重启回读 | 日常备份计划和恢复演练持续执行 |
| P2 正式内容与媒体 | PASS-SCOPED（FLBOOK）/ PARTIAL（官方候选） | 10 条 FLBOOK 产品已按业主授权回读 `approved` / `claimsVerified=true`；76 条规格、官方图片、About/Contact、14 页面媒体审计；21 条官方候选独立保留 `owner-review`；11 个外文 locale 已完成 Codex 自检稿生产回填和读回 | 复合肥料仍缺可靠定量表；21 条候选的型号/销售状态/claims 及 3 组同名冲突待确认；专业母语/法律/农艺认证未提供，不扩大为专业翻译通过 |
| P3 13 语言/询盘/SEO | PASS-SCOPED | 13 语言 URL、11 个外文 locale CMS 回填读回、生产 smoke 23/23、SEO 5/5、候选公开边界和 Hebrew RTL 检查通过；真实 Contact 表单写入 Payload；匿名 API 读取仍为 403 | SMTP/API 邮件通知仍未配置，询盘只确认写入后台，不代表邮件送达；完整 13 语言长文案视觉矩阵和专业翻译认证仍属内容质量后续项 |

## 当前生产状态

- 公开语言：13 个配置语言均已进入生产 URL，默认英语；11 个外文 locale 的 CMS 业务字段已按 Codex 自检稿回填，运行时仍保留英语 fallback 作为缺译保护；fallback 不作为翻译质量认证。
- 询盘：已启用，生产表单写入 Payload `inquiries`；邮件/SMTP 通知未配置，不能声称邮件送达。
- SEO：已解除 noindex；robots 允许抓取，页面 `index, follow`，sitemap 与 alternate 已生成。
- 产品：10 条 FLBOOK 产品为 `approved` / `claimsVerified=true`；21 条官方候选为 `official-candidate` / `owner-review` / `claimsVerified=false`。
- 官方候选：原官网 28 条候选审核包保留 3 组同名冲突；其中 7 条与已审核 FLBOOK 记录按来源 ID 合并展示，21 条新增记录已发布为独立候选卡。

## 证据入口

- [上线验收矩阵](launch-acceptance-matrix.md)
- [官方来源媒体审计](official-source-asset-audit-2026-11-09.md)
- [官方候选产品审核包](official-site-candidate-review-packet-2026-11-09.md)
- [官方候选产品决策矩阵](official-candidate-decision-matrix-2026-11-10.md)
- [P2 正式内容审核包](p2-content-review-packet-2026-11-09.md)
- [交互验收记录](interaction-acceptance.md)
- [运维连续性治理决策表](ops-continuity-governance-2026-11-10.md)
- [询盘治理闸门](inquiry-governance-2026-11-10.md)

## 2026-11-10 发布前基线复核

- `check:deployment:files`：PASS，部署文件、PostgreSQL、媒体卷和 `prodMigrations` 形状通过。
- `check:p2-release`：PASS-SCOPED，10 条正式产品、76 条规格、10 条 claims verified，无 blocker；warning 为 CMS 外文内容采用 Codex 自检稿，未提供专业母语/法律/农艺认证。
- `test:official-candidates`：PASS-SCOPED，候选仍保持未发布、可追溯和 owner-review。
- `validate:flbook`、`validate:content`、`validate:crop-guides`：PASS-SCOPED。
- `validate-content-localizations.mjs`、`validate-crop-guide-localizations.mjs`、`validate-homepage-staging.mjs`：PASS，13 locale 均 `missingLocales=[]`。
- 这些结果不扩大为生产依赖已部署、官方候选已批准或人工翻译已完成。

## 2026-11-10 公网只读基线复核

- `https://www.kowloonglobaltrading.com/api/ready` 返回 `200`，`database=true`、`media=true`。
- 公网 `/en`、`/he`、`/zh`、`/robots.txt`、`/sitemap.xml` 均返回 `200`；robots 允许抓取并指向 sitemap。
- 英文公开 HTML 未发现 `reviewStatus`、`claimsVerified`、`assetStatus`、`excluded-candidate` 或 `generated-placeholder` 字段名；页面中的 “owner-review gate” 是面向访客的技术审核说明，不是内部字段泄漏。
- 该复核为只读公网证据，不替代完整 13 locale 浏览器矩阵、生产依赖升级部署或候选产品审核。

## 2026-11-10 公网安全边界与静态资源复核

- 匿名 `GET /api/products?limit=1` 返回 `403 application/json`，公开产品 API 读取边界仍生效。
- 从公网英文首页抽取的媒体、CSS、JS 和 favicon 资源均返回 `200`；本轮抽样媒体为 4 个，CSS/JS 与 favicon 均成功回读。
- 该复核只证明当前公开实例的 HTTP/静态资源边界，不代表新依赖候选已经部署，也不替代真实浏览器交互矩阵。
- `/api/health` 返回 `200`，环境为 `production`，数据库为 `postgres`，`catalogSource=payload`，`mediaConfigured=true`。

## 2026-11-10 公网 13 locale 服务端路由复核

- `/en`、`/he`、`/nl`、`/fr`、`/it`、`/es`、`/pt`、`/el`、`/zh`、`/ro`、`/ru`、`/th`、`/tr` 均返回 `200`。
- HTML `lang` 与预期一致；`zh` 为 `zh-CN`，`he` 为 `rtl`，其余语言为 `ltr`。
- 该证据只证明公网 SSR 路由与方向属性，不能替代 13 locale 的真实浏览器交互、溢出、图片和 console 矩阵。

## 2026-11-10 可重复公网基线审计

- 新增 `npm run audit:public-baseline`，仅使用 GET 请求检查 `/api/ready`、`/api/health`、匿名产品 API 403、13 locale `lang/dir`、robots、sitemap、公开审核字段边界及抽样 CSS/JS/favicon/媒体资源。
- 使用 `PUBLIC_BASE_URL=https://www.kowloonglobaltrading.com npm run audit:public-baseline`：`ok:true`，13/13 页面 200，13/13 语言属性正确，抽样资源全部 200，warnings/errors 均为空。
- 脚本不提交询盘、不修改 Payload；结果仍只覆盖公网 HTTP/SSR/静态资源范围，不替代浏览器视觉矩阵或生产依赖发布验收。

## 2026-11-09 只读复核补充

- systemd `haifa-reference.service` 为 active；`/api/ready` 返回数据库和媒体检查均通过。
- 生产只读 Payload 审计回读 31 条产品，10 条 FLBOOK 为 `approved` / `claimsVerified=true`，21 条官方候选为 `owner-review` / `claimsVerified=false`，`missingCount=0`。
- 2026-11-09 部署前生产安装版本为 Next 16.3.5、Payload 3.92.0、Sharp 0.34.5；官方 registry audit 为 19 项（7 low、6 moderate、4 high、2 critical）。
- 2026-11-10 已部署依赖候选：Next 16.4.5、Payload 3.93.0、Sharp 0.35.5，并覆盖 DOMPurify 3.4.17、happy-dom 21.0.4；候选锁文件 audit 为 13 项（7 low、6 moderate、0 high、0 critical）。
- 生产目录未保存 Git 元数据；`production-2026-11-09` 标签说明其应用快照为 `67e6b93`，但无法在服务器副本内独立验证该 commit。下次部署需将 commit 与 build ID 写入发布记录。
- 业主决定继续公开 21 条官方候选名称与图片，并通过 Contact 接受询盘；型号、包装、规格和 claims 仍未核验。工作区已将两组同名候选合并为单张目录卡，详情保留两条来源图片，原 Payload 记录未删除。此改动已本地构建通过，尚未部署；生产仍需等发布后才能体现去重。

2026-11-09 最终回读：共享 Payload Promise 与英语源回退版本已部署；部署前 PostgreSQL 与媒体备份分别保存在服务器 `/home/ubuntu/backups/haifa-2026-11-09-p3/`；构建与 standalone 静态资源复制通过；服务重启后 readiness、资源页和首页均通过。冷启动重启期间旧 Node 进程优雅退出超时，期间公网曾短暂返回 502；systemd 随后强制结束旧进程并成功启动新版本，后续连续 smoke/SEO 和 readiness 均通过。产品审计 31 条（10 FLBOOK 已批准、21 官方候选保持 owner-review），媒体审计 14 页面/21 唯一媒体/0 哈希重复/0 generated-prototype 引用。

当前结论：13 语言路由、SEO 放行、询盘写入链路和产品/媒体边界已完成当前部署范围验收。邮件通知未配置；不得把后台写入描述为邮件送达。完整 13 语言真实浏览器与长译文人工审校仍应单独跟踪，不影响已授权语言路由发布的事实。

## 2026-11-10 本地路由契约补验

- 在隔离本地实例 `CMS_EVAL=1 :3123` 与普通公开实例 `:3118` 上复验，参考系列/方案 route contract 为 3/3 PASS。
- 7 个多语言页面切片（About、产品、FAQ/Contact/Search、新闻/知识/案例、方案/作物指南、首页、资源页）共 14 项 smoke 均 PASS；覆盖 13 locale 的 `lang`、`dir`、公开 robots 与关键链接。
- 旧测试中的“非公开语言应 404”断言已按当前发布决策改为公开实例可访问；该变更只校准验收契约，不改变生产数据或部署。
- `npm run check:locale`、`npm run test:rtl-css`、`npm run typecheck` 均 PASS。证据范围是本地运行时，公网完整 13 语言视觉矩阵仍为后续外部验收项。

## 2026-11-10 本地真实浏览器补验

- Chromium 本地 CMS_EVAL 实例 `:3123` 在 390px 视口逐一访问 13 个 locale：全部 HTTP 200，`lang`/`dir` 正确，`scrollWidth=375`，console error 0；English 1280px 首页、Hebrew 390px 首页和移动菜单截图已保留在 `output/playwright/`。
- 该实例使用 sample 数据源，因此只证明路由、RTL、响应式布局、菜单和资源加载；Hebrew 首页仍显示部分 `译文暂未提供`、`Information unavailable` 和英文资源入口。CMS 13 locale 草稿尚未接入 sample 运行时，业务内容质量保持 `PARTIAL`，不能记为完整多语言浏览器 PASS。
- 随后补齐资源页、可持续发展、首页公司重点及导航/页脚的组件内联 locale 使用；组件 coverage、typecheck 和 RTL 合同通过。当前仍有少量快捷入口/品牌文案硬编码，且 CMS 草稿未接入 sample 运行时，保持 `PARTIAL`。
- 使用隔离 SQLite + media 预览库实际导入全部 FLBOOK/核心/内容/作物指南草稿后，`CATALOG_SOURCE=payload` 浏览器回读 Hebrew 与 Portuguese 关键页面：200、RTL/宽度通过、无待翻译占位、console error 0；临时库已删除。该证据证明隔离 Payload 预览链路，不代表生产 Payload 已回填或人工审校完成。
- 询盘表单、产品询盘预览、Contact 容器、快捷入口、Newsletter、practice menu、产品相关推荐、产品信息缺失提示、共享跳转入口、产品占位图 alt、资源页面包屑以及产品系列/方案索引的 13 locale labels/status/说明已补齐并通过组件与 route coverage；方案详情 fr/es 专属结构已改为统一渲染，保留名称适配和原审核边界。
- Contact 容器的询盘标题、说明、处理提示、公司标签和地址兜底已统一为 13 locale authored map；剩余只包括少量快捷入口/品牌硬编码和需保留的专属结构复核。
- Smart farming 页面、通用方案详情界面、案例轮播以及首页新闻/知识/精选卡片文案已统一为 13 locale authored map，并通过组件 coverage；fr/es 仅保留方案名称/slug 适配，不再保留重复展示分支。

## 2026-11-10 依赖升级生产发布验收

- 生产备份目录：`/home/ubuntu/haifa-reference-rebuild/.local/backups/dependency-release-20261109T230938Z/`；包含 PostgreSQL dump、104 文件媒体备份、上一版 standalone tarball、旧依赖文件和 SHA-256 清单。
- 候选提交：`81859a6`；构建 ID：`e7m_5Jpd1SGNUDiD5kOcW`；生产实际版本：Next 16.4.5、Payload 3.93.0、Sharp 0.35.5。
- 远端 `npm ci --ignore-scripts`、esbuild rebuild、部署文件门禁、生产环境门禁、Sharp 边界测试、Next build 和 `prepare:standalone` 通过。
- systemd `haifa-reference.service` 重启后为 active；本机 `/api/health`、`/api/ready` 均通过；公网 `audit:public-baseline` `ok:true`，13 locale、匿名 API 403、静态资源和公开字段边界通过。
- 生产 Playwright：Hebrew 390px `lang=he`、`dir=rtl`、`scrollWidth=390`、console 0；系列页和方案页 390px `scrollWidth=390`，系列链接 3 个、方案链接可见。懒加载图片在未进入视口时仍有未完成请求，不能扩大为完整图片矩阵 PASS；直接 HTTP 媒体抽样均 200，浏览器证据保持 `PARTIAL`。

## 2026-11-10 Hero 中文叠加热修复与生产回读

- 首次依赖发布后的生产截图发现 Hero 使用的 `hero-01.jpg` 等素材本身带有中文横幅文字；因此“中文封面已清理”在首次依赖发布时不能记为通过。
- 提交 `8e141d2` 将 Hero 的 `hero-01.jpg`、`hero-02.jpg`、`hero-03.jpg` 映射到无横幅文字的官方素材 `company-research.jpg`、`company-laboratory.jpg`、`technology.jpg`；作物兴趣卡片仍可继续使用原始 `hero-01.jpg`，不改变其业务图片用途。
- 热修复已部署并完成构建，生产 build ID 为 `kQvA_SEwMLo_zDx9zdImU`；systemd active，`/api/health` 与 `/api/ready` 通过。
- 英文 390px 生产截图 `output/playwright/production-en-390-hero-hotfix.png` 已确认 Hero 背景为干净研究室素材；公网 `/zh` SSR 回读同样显示 `company-research.jpg`，`lang=zh-CN`、`dir=ltr`。
- 热修复后的公网只读基线再次 `ok:true`：13/13 locale 200，`lang/dir` 正确，匿名产品 API 403，健康/就绪、robots、sitemap 和抽样静态资源均通过。
- 结论：Hero 中文横幅叠加清理为 `PASS-SCOPED`；全站所有图片逐张视觉检查、全部语言专业译文和长文案视觉矩阵仍为 `PARTIAL`。

## 2026-11-10 正式 G0–G7 验收结果

- G0/G1：生产 build `QLZO1Btk6LMeXVqu5v7XT`、依赖、备份、静态契约和内容边界通过。
- G2：13 locale × 14 固定页面切片 + 42 个动态产品/方案详情，共 728/728 HTTP/SSR 通过。
- G3：四视口真实浏览器矩阵 150/150 通过；console、可见图片、lang/dir、根/body 宽度和占位文案均通过。
- G4：长语言桌面 Header、Hebrew RTL honeypot 宽度和移动 Header Logo 重叠问题已修复并部署；当前几何结论为 `PASS-SCOPED`。
- G5：14 个英中页面、21 个媒体 URL 全部通过媒体/来源/alt/hash 审计；10 条 FLBOOK 正式资料保持 approved，21 条候选保持 owner-review。
- G6：smoke 23/23、SEO 5/5、route contract 3/3、当前菜单/语言/FAQ/产品/RTL 交互测试通过。
- G7：技术验收阶段完成；专业翻译、候选字段签核、询盘治理和运维连续性继续保持 `PARTIAL` / `WAITING-EXTERNAL`。
- 证据索引：`output/acceptance/2026-11-10-formal-acceptance-g0-g1/final-report.md`。

## 2026-11-10 候选公开与 Header 发布后补充

- 业主确认 21 条 official candidates 作为正常资产公开展示，仍保持 `owner-review / claimsVerified=false`；生产 PostgreSQL 精确修复后管理员审计为 31 条产品、21 条候选、`missingCount=0`。
- 生产备份与媒体 manifest 已完成，精确修复 journal 和提交标记保存在 `candidate-stage3-20261110T120548Z` 备份目录；人工英文简介按旧值保护保留。
- 发布后候选边界审计 `EXPECT_PUBLIC_CANDIDATES=1` 为 `PASS-SCOPED`：21/21 详情 200、旧中文英文模板 0、审核字段泄漏 0。
- Header hydration-ready 修复后生产真实浏览器 3/3 通过；综合 fast scope 5/5 通过；公网 baseline、smoke 23/23、SEO 5/5 和媒体审计均有当前回读证据。
- 本补充不改变专业翻译、询盘隐私参数和运维排程仍为后续阶段的事实边界。

## 2026-11-10 阶段 4 生产回填补充

- 业主授权 Codex 全量外文翻译、自检和生产推进；不新增翻译服务。
- 11 个外文 locale 的产品、公司、FAQ、首页、新闻、知识、案例和作物指南字段已完成精确回填。
- 生产读回为 2,387 unchanged、0 conflict、0 missing；备份目录为服务器 `.local/backups/translation-stage4-20261110T213600Z/`。
- 公网 44 路由、smoke 23/23、SEO 5/5 通过。专业母语/法律/农艺认证仍记录为可选后续维护，不再作为当前生产阻塞项。

## 2026-11-10 阶段 5/8 复核补充

- `audit-public-baseline.mjs` 在 120 秒超时下：13/13 locale、health/readiness、匿名 API 403、robots/sitemap、静态资源均通过，warnings/errors 为空。
- `audit-public-media.mjs` 在 120 秒超时下：14 个英中页面、23 个媒体 URL、0 错误、0 generated/prototype 公网引用、0 序列化 alt。
- `audit-official-candidate-public-boundary.mjs`：21/21 候选详情 200，旧中文英文模板 0，审核字段泄漏 0，状态 `PASS-SCOPED`。
- 资料/权利清单见 `docs/media-rights-inventory-2026-11-10.md`；官方候选图片长期商业授权、规格和 claims 仍为 `PARTIAL / WAITING-EXTERNAL`。

## 2026-11-10 HTTP/SSR 矩阵补充

- 生产矩阵覆盖 13 locale、54 条固定/动态路由模板，共 702 条检查。
- 首轮 695/702 通过，7 条因公网瞬时 `AbortError` 超时；逐条 60 秒重试全部 200，目标证据位于 `output/acceptance/2026-11-10-post-translation-g2-r4/targeted-retry.json`。
- 页面 body 超时和并发 worker 已纳入 `scripts/accept-production-http-matrix.mjs`，当前范围结论为 `PASS-SCOPED 702/702`；响应慢仍不等同性能或 SLA 通过。

## 2026-11-10 询盘与运维范围补充

- 生产匿名 `GET /api/inquiries?limit=1` 返回 403；`/api/ready` 和 `/api/health` 返回 production/postgres/payload 正常形状。
- 询盘当前范围按业主决定收口为 Payload 后台人工处理，不接 SMTP/CRM，不配置自动删除/限流，不承诺 SLA；当前范围结论为 `PASS-SCOPED`，不扩大为自动化通知或合规认证。
- 运维当前范围按业主决定收口为现有备份脚本、联合 bundle 和一次性恢复证据；不配置生产排程、告警、周期恢复或自动回滚，当前范围结论为 `PASS-SCOPED`，后续重新授权后再进入 O2–O5。
