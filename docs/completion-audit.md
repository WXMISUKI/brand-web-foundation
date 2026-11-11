# 持久目标完成度审计

更新时间：2026-11-08

> 历史快照：本文保留初始目标审计，不代表当前生产状态。当前状态以 `HANDOFF.md`、`docs/current-stage-gate-2026-11-09.md` 和 `docs/p3-release-decision-2026-11-09.md` 为准；后续已公开 13 locale 路由、启用询盘写入并解除 noindex。

这份审计按当前目标逐项核对证据。`PASS-SCOPED` 只表示对应范围已有证据，不代表整站完成。

| 目标项 | 当前结论 | 证据 | 缺口 |
| --- | --- | --- | --- |
| CodeGraph 初始化与同步 | PASS-SCOPED | 当前索引 81 文件、560 节点、858 关系 | 文件继续修改后需再次同步 |
| 固定视口与共享导航 | PASS-SCOPED | `docs/visual-baseline.md`；1440、1280、1051、1060、768、390、320 视口记录；2026-11-08 二次校准了 1201–1450px 搜索胶囊、左侧品牌绿导航、快捷入口起始位置、无障碍占位和兴趣轨道宽度；产品菜单 AX 展开状态与链接可见性已复查；移动语言/搜索入口及三列快捷栏已对齐参考结构 | 完整导航 hover 时序、全部页面截图矩阵仍需继续 |
| 首页复刻 | PASS-SCOPED | 阶段 2 已完成当前原型验收：1280×720、1440×900、390×844 三视口逐区复核；Hero、兴趣区、作物轨道、快捷入口、移动头部和底栏均有 Edge/Playwright 截图证据，且无根横向溢出 | 参考站正式品牌素材、视频、最终文案未替换 |
| 产品目录与详情 | PASS-SCOPED | 阶段 3 已完成当前原型验收：英文/中文目录与详情首屏、参考式横幅、来源预览、底部询盘预览、产品筛选、分页、语言切换和窄屏链路均有证据；FLBOOK 相邻候选页已通过 `sourceRelatedPages` 和详情页回归测试保持可追踪 | 正式产品包装、多图、询盘收件仍待接入 |
| 方案/作物指南 | PASS-SCOPED | 多作物路由、章节锚点、`crop-guide-drafts.ts` fallback adapter、`CropGuides` Payload collection、`crop-guide-staging.json`；dry-run 验证 3 条记录的中英文和 5 个章节；实时对照参考作物页后，方案详情已改为短横幅、面包屑、五张章节卡和正文顺序，首页兴趣切换与详情页已隔离 | 目前只有 3 条代表性 staging 记录，业主生长阶段、营养建议、产品关联、阶段表和技术资料仍待确认 |
| 企业、FAQ、新闻、知识、案例、搜索、资源 | PASS-SCOPED | `content-page-matrix.md`；企业页实时对照后已校准横幅边距、面包屑留白和标题层级；FAQ 实时对照后保持横幅/面包屑/标题首屏顺序，搜索移到问答布局之后；新闻实时对照后隐藏示例简介、搜索移到列表之后，News/Events 筛选卡首屏位置已校准；案例实时对照后隐藏示例简介、搜索移到列表之后并补齐标题到双列卡片留白；FAQ/新闻/知识/案例顶部横幅、FAQ 分类和折叠、知识主题筛选、列表、分页、详情、双语富文本 staging/导入和资源禁用状态已测；独立 SQLite Payload 回读已覆盖首页、企业页和 FAQ | 正式媒体、正文、证书、下载和服务接口未接入 |
| FLBOOK 页级追踪 | PASS-SCOPED | 24 页 manifest、产品页码关联、封面/封底及 11 个跨页预览、staging JSON；相邻未选候选页以 `excluded-candidate` 和 `sourceRelatedPages` 分离 | 高分辨率 OCR 和业主逐项确认仍待完成 |
| FLBOOK 产品导入 | PASS-SCOPED | `npm run dry-run:flbook`：10 产品、3 分类、23 WebP 媒体、10 条单页详情裁剪预览、3 FAQ 分组/6 FAQ，中英文关系、来源页码、关联候选页、跨页预览路径和审核/素材状态读取通过；`import:flbook` 已写入腾讯云生产 PostgreSQL，前台 Payload 回读已验证英中首页 Hero、产品详情、FAQ、企业页和媒体 URL；业主已确认 FLBOOK 可作为产品展示来源，并允许生成补充场景素材 | 正式包装、多图、配方参数和 claims 仍可在后台逐项替换；数据库与媒体联合备份恢复仍待演练 |
| 多语言 | PARTIAL | Payload 配置 13 种语言；英文/中文公开；法文/西语原有业务预览保持可用；新增 `/{locale}/locale-preview` 非生产预览壳，隔离验证 13 个语言的 HTTP 200、`lang`/`dir`、noindex 和非法代码 404；新增 CMS_EVAL 下 13 语言首页、`/about`、`/products`、产品详情、`/faq`、`/contact`、`/search`、新闻、知识、案例列表/详情、方案/作物指南、智慧农业、可持续发展、SDS 和质量保证业务预览切片，分别验证页面直达、方向属性、noindex、语言链接、来源产品数据、富文本、五段式作物章节、禁用表单和非公开语言其他路由 404；补充共享 RTL CSS 契约和真实 `/he` 浏览器截图，修正 RTL 下拉面板溢出与长 Hero 文案裁切；高影响 UI 字典统一接入 `completeLocaleMap` | 正式译文、生产语言发布和生产验收未完成 |
| PostgreSQL 与媒体 | PARTIAL | 生产配置要求 PostgreSQL；`PAYLOAD_MEDIA_DIR` 可配置；生产 env 形状检查通过；新增 custom dump 备份/恢复入口、媒体 SHA-256 manifest 备份/恢复、standalone Docker/Compose 资产、一次性空库管理员 bootstrap 和 Payload migration:create 流程；已生成并接入当前 schema 增量 migration，Payload PostgreSQL adapter 注册了 `prodMigrations`；新增 `/api/ready` 数据库/媒体依赖探针并接入 Compose；临时媒体树恢复演练通过；本轮使用临时 `.env.production` 完成 `docker compose config --quiet` 和生产环境形状联检；本机 PostgreSQL 17.11 Windows 服务由 `pg_isready` 确认 accepting connections | 没有目标服务器、可授权的临时 DATABASE_URL 和 PostgreSQL/媒体联合恢复演练证据；本机 Docker Desktop Linux 引擎未启动，镜像构建未执行 |
| 询盘与上线 | PARTIAL（历史记录） | 联系页已显示企业邮箱和 WhatsApp；新增默认关闭的 Payload `inquiries` 集合、蜜罐字段、状态流转、管理员访问边界和 `503 inquiry_disabled` API 闸门；主域名、HTTPS、英文/中文页面和早期 smoke 已通过 | 管理员初始化已在后续 P1 完成；若要站内询盘，仍需确认 SMTP/收件流程、隐私告知和反垃圾策略后再启用 |

当前结论：本文只代表早期原型范围；生产管理员、后台回读、备份恢复和 23/23 smoke 已在后续 P1/P2/P3 文档完成，当前正式收口仍受 claims/译文、询盘收件策略和 noindex/正式语言决策控制。上线验收边界与顺序见 [上线验收矩阵](launch-acceptance-matrix.md)。

真实浏览器交互的逐项记录见 [interaction-acceptance.md](interaction-acceptance.md)。其中 `PASS-BROWSER-SCOPED` 仅代表本地样例和 CMS_EVAL 预览中的真实浏览器证据，不代表生产发布通过。

## 本轮可复核验证

- `npm run check:locale`：13 个后台语言配置通过；公开语言边界保持 `en`、`zh`，法文/西语仍为预览状态。
- `npm run check:locale`：13 个后台语言配置及 13 个高影响 UI 字典键覆盖通过；公开语言边界保持 `en`、`zh`，法文/西语业务预览与其余语言 About 预览边界由输出分别标注。
- `npm run check:production-env:example`：通过，强制校验 PostgreSQL、Payload catalog/crop-guide 数据源和绝对媒体目录。
- `npm run test:about-preview`：CMS_EVAL 隔离服务中 13 个语言 `/about` 预览和非公开语言路由边界测试 2/2 通过；he 的 `dir="rtl"` 已验证。
- `npm run test:products-preview`：CMS_EVAL 隔离服务中 13 个语言产品目录/详情和普通开发边界测试 2/2 通过。
- `PREVIEW_INFORMATION_PATH=faq|contact|search npm run test:information-preview`：三次独立 CMS_EVAL 服务分别覆盖 13 个语言，三类页面各 2/2 通过；连续长跑曾触发 Next 开发服务器 OOM，已通过按页面隔离规避并保留该环境限制记录。
- `PREVIEW_EDITORIAL_PATH=news|insights|cases npm run test:editorial-preview`：三次独立 CMS_EVAL 服务分别覆盖 13 个语言的新闻、知识、案例列表/详情，各 2/2 通过。
- `npm run test:solutions-preview`：CMS_EVAL 隔离服务中 13 个语言方案/作物指南详情和普通开发边界测试 2/2 通过。
- `npm run test:home-preview`：CMS_EVAL 隔离服务中 13 个语言首页和普通开发边界测试 2/2 通过。
- `PREVIEW_RESOURCE_PATH=smart-farming|sustainability|sds-request|quality-assurance npm run test:resource-preview`：四次独立 CMS_EVAL 服务分别覆盖 13 个语言资源页面和普通开发边界，各 2/2 通过；SDS 表单禁用状态已验证。
- `npm run test:rtl-css`：RTL 静态契约通过，覆盖共享布局和方向性装饰；真实浏览器视觉证据另见 `docs/interaction-acceptance.md`。
- 早期生产回归：`PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke` 22/22 通过；后续已扩展为 23/23，并继续保持知识主题筛选修复。
- 生产文案检查：英文/中文公开页面的可见文本不再出现 Prototype preview、SAMPLE、owner confirmation、示例图片或原型预览；仅保留后台/非公开语言预览路径的审核提示。
- 真实 Playwright 交互验收：首页菜单/轮播/兴趣和案例切换、产品筛选/详情、FAQ 展开/搜索、新闻筛选/搜索/详情、知识筛选/搜索/详情、站内搜索、方案锚点、SDS 禁用、移动菜单、中文联系信息、`/he` RTL 面板和截图均已完成；详见 `docs/interaction-acceptance.md`。
- `npm run check:deployment:files`：通过，额外校验 `/api/ready` 的数据库/媒体检查、Compose readiness 探针和 Payload `prodMigrations` 注册。
- 临时生产环境联检：`docker compose config --quiet` 与 `node scripts/check-production-env.mjs` 均通过，临时 `.env.production` 已删除；未写入真实凭据。
- `npm run bootstrap:admin`：隔离 SQLite 创建管理员通过；第二次在非空 users 集合执行被明确拒绝，临时数据库已清理。
- `npm run dry-run:flbook`：新库 schema 中 `inquiries` 集合可读且默认为空；公开询盘仍由 `INQUIRY_MODE=disabled` 关闭。
- 询盘回归：隔离开发服务在 `INQUIRY_MODE=disabled` 下向 `/api/inquiries` POST 返回 `503` 和 `inquiry_disabled`，21 项冒烟测试全部通过。
- 询盘启用回归：新 SQLite schema 在 `INQUIRY_MODE=enabled` 下成功创建一条询盘（HTTP 201），未登录 GET 读取返回 HTTP 403；测试数据库已清理。
- 媒体备份回归：临时媒体树执行 `backup:media` 生成 manifest，再用 `restore:media` 恢复并重新校验两份文件的 SHA-256，临时目录已清理。
- `npm run typecheck`：通过。
- `npm run validate:content`、`npm run validate:flbook`、`npm run validate:crop-guides`：通过。
- `npm run test:rich-text`：4 个富文本契约测试通过。
- `PREVIEW_URL=http://localhost:3118 npm run test:smoke`：22 个本地预览路由、liveness/readiness 健康检查、知识主题、News/Events、FAQ 结构与语言切换测试通过；未设置该变量时测试会按默认 3000 端口运行，属于前置配置错误而非断言失败。
- `npm run dry-run:flbook`：10 个产品、3 条作物指南、3 个新闻、3 个知识文章、3 个案例、3 个 FAQ 分组/6 个 FAQ、首页/企业 global、23 个 WebP 媒体及中英文关系读取通过，来源页码/关联候选页/预览路径保留，临时库已清理。
- `NODE_ENV=development IMPORT_CONFIRM=YES IMPORT_EMPTY_DB=YES npm run import:flbook`：独立 SQLite 目标实际写入 10 个产品、首页/企业 global、3 个 FAQ 分组/6 个 FAQ 和 23 条媒体，目标目录已清理。
- Payload 回读验收：临时 SQLite/媒体目录启动隔离 Next 服务，`/en`、`/zh` 首页 Hero、英中产品详情、中文 FAQ、英文企业页和产品媒体 URL 均通过，媒体响应为 HTTP 200；随后已恢复 3118 示例服务并清理临时目录。
- 富文本回归：双语 staging 正文写入 Payload `richBody` 并由本地 sample 详情渲染；dry-run 同时检查新闻、知识和案例中英文 `body` 可读。
- 生产构建：使用临时 PostgreSQL 示例环境运行 `npm run build`，Next standalone 构建通过，未连接真实数据库；媒体 tracing 警告已通过 `turbopackIgnore` 收敛。
- Standalone 运行态：隔离端口启动 `.next/standalone/server.js` 后访问 `/api/health` 返回 `ok:true`、`environment:production`、`database:postgres`，进程已停止并清理。
- Docker 镜像构建：未执行成功，本机 Docker CLI 可用但 Docker Desktop Linux 引擎未启动（`dockerDesktopLinuxEngine` pipe 不存在）；该结果记录为环境阻断，不作为代码构建失败。
- 本机 PostgreSQL：Windows `postgresql-x64-17` 服务运行中，`D:\postgreSQL\bin\pg_isready -h 127.0.0.1 -p 5432` 返回 accepting connections；未发现可授权临时账号，因此未创建或修改任何数据库。
# 历史完成审计（非当前状态）

> 本文保留早期阶段的审计记录。当前生产事实以 `HANDOFF.md`、`docs/launch-acceptance-matrix.md`、`docs/p0-acceptance-2026-11-08.md`、`docs/p1-acceptance-2026-11-08.md`、`docs/p2-acceptance-2026-11-08.md` 和 `docs/p3-acceptance-2026-11-08.md` 为准。管理员、生产数据、系列路由和 P2/P3 证据已在后续交接中更新。

