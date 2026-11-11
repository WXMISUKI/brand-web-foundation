# 化肥独立站交接书

## 2026-11-09 当前阶段快照

- P0：PASS-SCOPED。生产备份、公开 API 边界、静态资源和真实页面已复核。
- P1：PASS-SCOPED。管理员已初始化；产品、FAQ、新闻富文本和媒体关系真实编辑回读通过；联合备份恢复和 systemd 重启回读通过；smoke 23/23。
- P2：PASS-SCOPED（FLBOOK）/ PARTIAL（官方候选）。10 条 FLBOOK 产品已按业主授权回读 `approved` / `claimsVerified=true`；9 个产品有 76 条双语规格，复合肥料定量表仍因来源缺失而为空；21 条官方候选独立保持 `official-candidate` / `owner-review` / `claimsVerified=false`，三组同名冲突仍待逐项确认。
- P3：PASS-SCOPED。业主已批准 13 个语言 URL、询盘启用和解除 noindex；共享 Payload 初始化与英语源回退已部署；13 语言首页 `200`/`lang`/`index, follow`、canonical/alternate、robots、sitemap、SEO 5/5、smoke 23/23、冷启动资源页/首页、readiness、真实询盘记录均已回读。390px Hebrew RTL 浏览器根/body 无溢出、无已加载失败图片，console 0 errors/warnings。SMTP 邮件送达尚未配置；缺少人工译文的内容使用英语源回退。
- 2026-11-09 P3 最终发布：部署前 PostgreSQL 与媒体备份位于服务器 `/home/ubuntu/backups/haifa-2026-11-09-p3/`，上一版 standalone 同目录保留。生产构建、`prepare:standalone`、冷启动与公开回归通过；重启期间旧进程优雅退出超时造成短暂 502，systemd 随后终止旧进程，新版本 readiness、smoke 23/23、SEO 5/5 均通过。生产产品审计回读 31 条（10 条 FLBOOK approved、21 条官方候选 owner-review）；媒体审计 14 页面、21 唯一媒体、0 重复哈希、0 prototype/generated 引用。详见 `docs/current-stage-gate-2026-11-09.md` 与 `docs/p3-release-decision-2026-11-09.md`。
- 2026-11-09 官方来源媒体修复：读取业主提供的 `http://m.zgkomu.cn`（HTTPS TLS 握手失败）与 FLBOOK 链接，新增 `docs/official-source-asset-audit-2026-11-09.md`。7 条产品图和 5 张公司/技术图与原官网远程文件 SHA-256 一致；3 条无法稳定对应的产品继续使用 FLBOOK 裁剪图，避免错绑。
- 2026-11-09 生产媒体定向替换：先完成 PostgreSQL 备份，再按 slug 更新 7 条产品媒体、Homepage/Company banner 和 9 条内容媒体；未重导产品数据库。随后按业主授权发布候选、批准 10 条 FLBOOK 产品、启用询盘和解除 noindex；公网 smoke 23/23、SEO 5/5、`/api/ready` 通过。
- 2026-11-09 provenance 补充：7 条产品的 `sourceNote` 已追加对应原官网 `/display/*.html` 详情页，保留 FLBOOK 作为文字/规格主来源；生产 `audit:production-products` 回读 31 条，其中 10 条 FLBOOK 正式审核、21 条候选审核；`check:p2-release` 当前 `ready:true`，warning 仅提示缺少人工译文时使用英语源回退。
- 2026-11-09 生成/原型图片清理：`src` 已不再引用 `/images/generated/*`、`field-hero-prototype`、`greenhouse-prototype`、`orchard-prototype`；遗留文件保留在磁盘用于回滚审计，当前前台通过官方站横幅、公司/技术图和产品图展示。真实移动详情页根溢出 0、规格表横滚 540/351、图片 GET 200。
- 2026-11-09 新增 `npm run audit:public-media` 公网媒体门禁：生产扫描 14 个英文/中文公开页面（含 About）、18 个唯一媒体 URL，无错误图片、generated/prototype 公网引用、序列化 alt 或内容哈希重复；产品跨页面主图重复均为同一产品的正常页面复用。
- 2026-11-09 企业资料补充：根据原官网 `/info/99186.html` 更新生产 About 英中简介和三项 focus areas，保留 2014 年来源事实，未写入旧站员工/面积/服务时效数字；更新前备份为 `.local/backups/payload-2026-11-09T00-10-09-130Z.dump`，生产 About 390px 根/body 溢出 0、console 0 errors，smoke 23/23、SEO 5/5。
- 2026-11-09 Contact 资料补充：根据原官网联系地址更新 Company Profile 英中地址字段，保留业主当前邮箱和 WhatsApp，不把旧站固定电话当作新的业务渠道；更新前备份为 `.local/backups/payload-2026-11-09T00-15-55-533Z.dump`，Contact 390px 根/body 溢出 0、console 0 errors，smoke 23/23、SEO 5/5。
- 2026-11-09 SEO 合同扩展：`test:seo` 的 canonical/alternate/index-follow 矩阵已覆盖公开语言、About、Contact、FAQ、Search、News/Detail、Insights/Detail、Cases/Detail、Products、Series、Solutions、产品详情等路径；生产 5/5，询盘接口成功写入，审核字段仍隔离。
- 2026-11-09 P3 真实浏览器矩阵补验：生产 Chromium 在系列、方案、Contact、FAQ、Search 路由的 390×844 与 1280×720 视口下均为根/body 溢出 0、broken 图片 0，Console 0 errors / 0 warnings。
- 2026-11-09 原官网候选产品清单：`npm run extract:official-candidates` 从原官网产品中心提取 28 条候选；其中 7 条按来源 ID 与 FLBOOK 正式产品合并，21 条新增候选已发布为 `official-*` 独立卡片，仍标记 `owner-review`/`claimsVerified=false`。
- 2026-11-09 候选来源可达性：`npm run check:official-candidates` 验证 28/28 原官网详情页和 28/28 官方图片 URL 返回 HTTP 200；未导入生产。
- 2026-11-09 候选审核包：`npm run review:official-candidates` 生成 28 条候选清单和 3 组同名冲突；生产只按官方来源 ID 处理已合并项，不按名称自动合并，新增候选保留审核状态。
- 2026-11-09 候选合同测试：生产/本地 `npm run test:official-candidates` 通过，锁定 28 条、官方 URL、owner-review、published:false 和 3 组同名冲突。
- 2026-11-09 当前阶段闸门审计已写入 `docs/current-stage-gate-2026-11-09.md`，按 P0/P1/P2/P3 区分 PASS-SCOPED、PREVIEW-ONLY 和 WAITING-EXTERNAL，防止将保护态误报为正式上线完成。
- 2026-11-09 中文公开边界补验：生产 Chromium 对 `/zh` 及中文系列、方案、Contact、FAQ、Search 路由在 390×844/1280×720 下确认 `lang=zh-CN`、溢出 0、broken 图片 0、Console 0 errors / 0 warnings。
- 当前证据文档：`docs/p1-acceptance-2026-11-08.md`、`docs/p2-acceptance-2026-11-08.md`、`docs/p3-acceptance-2026-11-08.md`。持久目标仍 active，不得宣称最终上线完成。
- 2026-11-09 已补充 `docs/reference-source-audit-2026-11-09.md`：明确本轮产品来源是 FLBOOK 浏览链接而非 PDF，Haifa 仅作结构/交互参考，并按产品、路由、响应式风险、多角色职责和 P3 门禁重新划分 PASS-SCOPED / PARTIAL / GAP / PROTECTED；后续以该审计和本交接书顶部快照为准。
- 2026-11-09 内容卫生修复：第 8、9 页两个有机水溶肥料英文标题重复，已在本地 staging 与生产 Payload 的对应 `slug` / `en` 记录中精确修正；生产备份、前台详情回读、smoke 23/23、SEO 4/4 通过，审核状态和 claims 未放宽。
- 2026-11-09 P3-B 交互复验：移动菜单新增焦点离开自动关闭，已部署并通过生产 390×844 与 1280×720 Playwright 验证；Escape 关闭、焦点返回、Tab 离开、规格表横滚和根横向溢出均有证据。P3-B 仍未覆盖真实 iOS/Android 与完整长译文。
- 共享菜单改动后已用正确的 `PREVIEW_EVAL_URL` / 生产 `PREVIEW_URL` 边界重跑 7 个 CMS_EVAL 预览切片，全部通过；此前把 PREVIEW_URL 指到 CMS_EVAL 导致的单次 404 断言失败属于测试环境变量错误，已纠正并复验。
- `scripts/validate-flbook-import.mjs` 已增加中英文产品显示名唯一性门禁；当前 `npm run validate:flbook` 通过，生产脚本已同步。
- 2026-11-09 参考链接可达性复核：FLBOOK 源链接与交接表中的 16 个 Haifa 参考地址均返回 HTTP 200；这只证明来源可达，不等于本地页面已完整复刻。
- 2026-11-09 生产简介对账：复合肥料英文保留更谨慎的人工“配方与宣称按需提供”文案；第 10 页英文简介和第 6–7 页中文简介已按精确旧值 guard 修正，备份为 `.local/backups/payload-2026-11-08T19-38-19-391Z.dump`，前台回读与 smoke/SEO 通过。
- 独立系列页与种植方式索引的 P3-B 方案已写入 `docs/superpowers/specs/2026-11-09-independent-reference-routes-design.md`；按用户此前“按推荐方向继续”的授权采用方案 A（轻量独立路由、复用现有数据、不新增集合），已实现并完成生产验收。
- 2026-11-09 继续按推荐方案 A 实现并部署：新增 `/{locale}/products/series`、`/{locale}/products/series/{slug}`、`/{locale}/solutions`，复用现有 Payload 产品/分类/solutions 数据；route contract、生产 smoke 23/23、SEO 4/4、390/1280 Playwright 和 console 0 errors 通过。未修改数据库结构、询盘或 noindex。
- 2026-11-09 真实引擎补验：WebKit iPhone 13 与 Chrome Pixel 7 生产页面均通过溢出、规格表/系列卡、快捷栏、canonical、Escape 焦点和 console 0 errors 检查；P3-B 不再缺真实移动引擎证据。
- 历史门禁状态：`npm run check:p2-release` 曾输出 `ready:false`，当时 10 个产品均为 `owner-review`；后续业主批准并生产回读后，当前本地门禁为 `ready:true`，生产审计为 10 条 FLBOOK approved。该门禁不会自动审核 21 条官方候选或修改生产数据库。
- P2 逐条审核包已写入 `docs/p2-content-review-packet-2026-11-09.md`，列出 10 条产品、来源页、76 条规格、复合肥料缺失定量表和统一签核项；完成审核前不推进 P3 发布决策。
- 2026-11-09 生产历史导入元数据修复：管理员视图下 10 条产品的 `reviewStatus/assetStatus/claimsVerified` 曾为 null，已在备份 `.local/backups/payload-2026-11-08T20-20-27-070Z.dump` 后按 slug 精确补回；`audit-production-products.mjs` `missingCount=0`，公开 hook 仍隐藏审核字段，smoke/SEO 通过。修复脚本现在要求 `PRODUCTION_REPAIR_CONFIRM=YES`。
- `npm run audit:production-products` 已纳入 package scripts，并在生产管理员视图运行通过：10 条产品、`missingCount=0`、双语详情完整、规格和审核元数据完整。
- P3 外部决策包已写入 `docs/p3-external-decision-packet-2026-11-09.md`，将产品内容、正式语言、询盘隐私和 noindex 解除拆成可直接回复的四项门禁。
- 历史决策：2026-11-09 较早阶段曾选择保护态（仅 en/zh、询盘 disabled、noindex 保持）。该决策已被当天后续正式发布授权及 `docs/p3-release-decision-2026-11-09.md` 取代；当前状态以本文顶部快照为准。
- 元数据修复后的公开边界回读：匿名 `/api/products?limit=1` 为 `403`，英文产品详情不泄漏 `reviewStatus`、`assetStatus`、`claimsVerified`。
- `test:seo` 已增加上述公开边界回归，当前生产 SEO 合同为 5/5。

更新时间：2026-11-09。Haifa 仅作为安徽康母国际化肥股份有限公司网站的结构与交互参考；品牌、产品事实、图片和业务数据以业主资料及已核验来源为准。2026-11-09 已完成当前授权范围的生产发布与回读，仍有候选产品审核、邮件通知、人工翻译及运维治理事项未完成。

2026-11-09 资料边界与参数复验已完成：SSH 已恢复并确认生产服务、数据库、媒体和 standalone 静态资源正常；以业主提供的 FLBOOK 浏览链接和 Haifa 参考网页为来源，不以 PDF 作为本轮资料来源。十条 staging 产品页码、笔误和审核状态已修正，dry-run 改为分离公开/管理员 provenance 回读并全量通过；产品详情隐藏 `excluded-candidate` 内部候选页，只保留画册页码和来源预览。生产 PostgreSQL 先完成新备份，再按 slug/locale/旧值精确修正 20 条英中简介页码，保留已存在的审核后缀；随后追加 9 个产品的 76 条来源规格，只有复合肥料因页面没有可靠定量表继续为空。修复已部署，生产 `api/ready`、静态 CSS/JS/favicon、smoke 23/23、SEO 4/4 均通过。证据见 `docs/p2-source-audit-2026-11-09.md` 与 `docs/p2-parameter-evidence-2026-11-09.md`。

2026-11-09 本地依赖安全验证：使用官方 npm registry 检查当前未提交锁文件，审计结果为 0 high/critical、13 low/moderate；类型检查、部署文件检查、P2 本地门禁、官方候选合同、FLBOOK/内容/作物指南校验、locale 和 RTL CSS 合同通过。Next production build 与 standalone 资源复制通过，并为 Sharp 原生运行库增加 Next 文件追踪与 standalone 加载门禁；随后在 WSL2 Ubuntu 24.04 使用 Node 24.22.1 完成独立 Linux 冻结安装、构建、Sharp 0.35.5 加载和 standalone 冷启动，health/favicon/JS 资源均通过，隔离占位数据库下 readiness 503 符合预期。生产仍使用旧依赖并有 2 critical/4 high，该升级未部署；Linux 门禁证据和限制见 `docs/dependency-security-release-2026-11-09.md`。

2026-11-09 候选目录展示决定：业主确认 21 条官方候选名称和图片继续对访客展示，客户经 Contact 联系康姆询盘；型号/包装/规格/claims 仍保持 `owner-review`，不作已核验承诺。当前工作区将两组完全同名候选合并为单张目录卡，详情保留两条原官网图片和源记录；候选记录本身不删除。`754922` 瓶装图与现有已批准 FLBOOK 桶装产品图不同，仍作为独立来源图展示。该改动已通过本地构建，但尚未部署，线上目录在下次发布前仍可能显示重复卡。
- 询盘运营决定：业主选择先由 Payload 后台人工查看和处理，不接邮件/CRM 通知；所有后台账号均可查看和处理。目前仅有 `leon@kowloonglobaltrading.com` 一个后台账号，由后台常驻人员留意新询盘；无需固定检查频率或首次响应 SLA，不对外承诺响应时限。
- 多语言决定：默认英语，全部 13 种公开语言均需覆盖所有公开页面的界面文案与当前可见业务内容；由 Codex 起草并自审。候选产品、未核验 claims、案例事实及缺少来源的字段只翻译已有文字，不补造事实，也不改变原审核状态。业主确认按国际化常见顺序分批，优先产品、公司、联系和 FAQ。
- 2026-11-09 翻译第一批本地验证（历史快照）：产品目录/详情 UI 覆盖 13 locale；CMS 草稿为 10 条 FLBOOK 产品及公司介绍/FAQ 的 `es/fr/pt/ru` 翻译。后续批次已扩展到全部 13 locale 和更多 UI/CMS 草稿；当前仍未完成专业母语/法律/农艺审校、旧值保护生产回填和生产回读，详见 `docs/translation-rollout-plan-2026-11-09.md`。

## 工作区与保护边界

- 实际项目：`D:\work\private\haifa-reference-rebuild`，当前分支 `codex/haifa-reference-rebuild`，HEAD `8054e4d`。`production-2026-11-09` 是发布记录标签，指向状态文档提交 `8054e4d`，其说明的应用快照为 `67e6b93`。`D:\work\private\brand-web-foundation` 的 `main` 属于另一套基础工程，且 `origin` 仍指向该工程；不要将 Haifa 代码推送到这个远端主线。
- 当前工作区未提交修改：`AGENTS.md`、`package.json`、`package-lock.json`；未跟踪 `.playwright-cli/`、`output/`、以及 `public/images/` 下原型/生成素材。全部保留，逐项确认归属后再决定提交或归档。**不要 reset、clean、覆盖 checkout、批量提交或重新导入生产数据库。**
- 生产应用目录没有 Git 元数据，不能直接从服务器取得部署 commit。当前可追溯依据是生产标签说明、发布记录及服务器只读核验；下次部署应保存实际 commit/build ID。
- CodeGraph 在本机项目目录已初始化的历史记录仍需以当前工具可用性为准；不可用时回退原生检索。文档冲突时，优先级为最新生产只读审计、`docs/p3-release-decision-2026-11-09.md`、本交接顶部快照，其次才是明确标注为历史的审核包和任务记录。
- 先阅读 `docs/spec.md`、`tasks/plan.md`、`tasks/todo.md`、`docs/interaction-acceptance.md`、`docs/deployment-target.md`、`docs/launch-acceptance-matrix.md`。使用中文沟通，按项目指令优先 RTK；架构、数据、安全、部署的重大选项先与业主确认。
- 使用中文与用户沟通；按项目指令优先 RTK，保留现有改动。普通实现细节可自行决定；架构、数据、安全、部署的重大选项先向用户说明。

## 已确认需求和资料

- 参考站：https://www.haifa-group.com/；用户希望整体布局、菜单状态、交互与视觉尽可能接近，不能把 HTTP 200 视作视觉或全流程验收。
- 业主拥有并授权使用画册：https://flbook.com.cn/c/LTc82gQQM3 。允许按页提取、裁剪；缺少的场景图可生成补充。10 个产品在 `src/data/flbook-import.json`，页码与素材清单在 `src/data/flbook-manifest.ts`、`docs/flbook-import-plan.md` 和 `docs/product-content-mapping.md`。生成图片与真实画册内容须保留可追踪来源，不能把生成场景或编辑性案例写成已发生的真实事实。
- 名称：安徽康母国际化肥股份有限公司；英文当前使用 `Anhui Kangmu International Fertilizer Co., Ltd.`；产品品牌 KOMU/康姆。邮箱 `leon@kowloonglobaltrading.com`；WhatsApp `+852 9074 0009`。
- 用户确认 Payload + Next.js，生产 PostgreSQL，本地可 SQLite；多语言独立 URL、默认英文 `/` 跳 `/en`。13 个配置语言 URL 已按业主授权公开，但 CMS 缺少人工译文时会回退英文，不能宣称 13 种内容均已完成翻译。后台维护产品、图片、新闻、知识文章与富文本。

## 线上与验证现状

- 入口：https://www.kowloonglobaltrading.com/en ，中文 `/zh`。服务器 `43.160.216.74`，SSH 用户 `ubuntu`，本机私钥 `C:\Users\dddsg\.ssh\kowloon_web_sg_01.pem`；不要读取或打印私钥、环境变量和密码。目标目录 `/home/ubuntu/haifa-reference-rebuild`，systemd `haifa-reference.service`，127.0.0.1:3118，Nginx/HTTPS，PostgreSQL 数据库 `haifa_reference`。旧 `brand-web.service`、`brand-cms.service` 历史上已停用，旧项目保留作备份。
- 2026-11-09 本次只读复核：`haifa-reference.service` 为 active，`/api/ready` 的数据库和媒体检查均为 true；生产 PostgreSQL 审计回读 31 条产品，10 条 FLBOOK 为 `approved` / `claimsVerified=true`，21 条官方候选为 `owner-review` / `claimsVerified=false`，`missingCount=0`。生产锁文件使用 Next 16.3.5、Payload 3.92.0、Sharp 0.34.5，官方 npm audit 为 19 项（7 low、6 moderate、4 high、2 critical）。
- 当前工作区安全升级将 Next 更新至 16.4.5、Payload 更新至 3.93.0、Sharp 更新至 0.35.5，并定向覆盖 DOMPurify 3.4.17 与 happy-dom 21.0.4；官方 npm audit 为 13 项（7 low、6 moderate、0 high、0 critical）。升级尚未部署，不能将本地审计结果描述为生产已修复。
- 历史记录：此前生产 smoke 22/22 通过，覆盖路由、筛选、双语链接和健康接口，知识主题筛选 500 已修复并上线；后续已扩展为当前 smoke 23/23，这不是浏览器全交互或全面视觉验收。
- 关键事故：最近真实浏览器发现 `_next/static` 和 `favicon.svg` 404，SSR 正常但脚本样式未加载。已在服务器将 `.next/static` 和 `public` 复制到 `.next/standalone/.next/static`、`.next/standalone/public` 并重启，随后浏览器 reload 控制台无新错误。**每次 standalone 重新 build 都可能重置这些目录，部署流程必须固化复制和公网静态资源回读**；Dockerfile 已有复制指令，但服务器使用 systemd 非 Docker。上线前确认 HTML 引用的 CSS/JS、favicon 和媒体均返回 200，再做浏览器交互。
- 真实浏览器曾在修复静态资源后看到首页英文公司重点显示 `Information unavailable`、图片 alt 是 JSON、案例标题含 `PREVIEW`、部分产品简介仍有 `await review`。不要把先前“占位文案已全部清理”当作事实。

## 历史中断记录（2026-11-08，已处理）

以下是 2026-11-08 当时的未部署清单；其中与静态资源、内容映射和详情展示相关的修改已在 2026-11-09 部署并通过生产回归，后续以本交接书顶部的 2026-11-09 快照和 P2/P3 证据文档为准：

1. `src/lib/localized-text.ts` 及 `src/content/{catalog,homepage,company-profile,news,insights,cases}.ts`：兼容历史媒体 alt 被序列化成 JSON；英文公司重点缺字段时提供通用回退。注意回退只能缓解展示；后台原始英文数据仍需正确修复，不能覆盖用户后续编辑。
2. `src/components/case-carousel.tsx`、`product-information.tsx`：去除部分预览提示，缺技术参数时引导联系。`src/data/flbook-import.json` 修正两条英文 `await review` 和一处中文语病；生产数据库不会自动随 JSON 更新，禁止运行只允许空库的 `import:flbook` 覆盖生产。
3. `scripts/import-flbook-payload.mjs` 公司 focusAreas 改用 `locale: all` 一次写双语，防止逐语言更新数组覆盖英文。只做了语法检查和 typecheck；需独立临时库实际 dry-run/readback，确认双语均存在，严禁对现有生产库直接重导。
4. 交接前 `src/content/insights.ts` 的 `topics.slug` 查询已上线；`docs/completion-audit.md`、`docs/launch-acceptance-matrix.md`、`tasks/todo.md` 有当时记录，但其中“所有提示已清理”等结论需要按真实页面修正。

## 2026-11-10 continuation progress

- 工作区隔离 dry-run 已覆盖 13 个 locale 的产品/公司/FAQ、首页、新闻/知识/案例和作物指南；对应 focused tests、字段回读、来源/审核边界、typecheck 和 `git diff --check` 均通过。
- 作物指南的数组内 localized section title 曾因缺少稳定子项 ID 丢失，现已在 import/dry-run 中复用 `section-1..5` 对应 ID，并通过 13 locale dry-run 回归。
- 依赖与 Sharp standalone 运行时已在隔离 worktree `codex/haifa-dependency-release` 提交为 `81859a6`；该提交包含 Sharp 必须从 standalone `node_modules` 解析的 P1 边界回归测试。主工作区未合并、未推送、未部署。`origin` 仍指向另一套 `brand-web-foundation` 工程。
- 上述翻译仍是 AI 草稿，未经过母语、法律或农艺审校；生产 Payload 未写入。21 条官方候选、复合肥定量缺项、SMTP/工单通知、浏览器矩阵和运维治理仍未收口。

2026-11-10 本地路由验收补充：在独立端口启动 CMS_EVAL `3123` 与普通公开实例 `3118`，参考系列/方案 route contract 3/3 通过；7 个多语言页面切片共 14 项 smoke（About、产品、FAQ/Contact/Search、新闻/知识/案例、方案/作物指南、首页、资源页）全部通过。发现旧测试仍断言已按发布决策公开的 `he` 路由应为 404，已将断言更新为公开实例与 CMS_EVAL 实例均为 200；`check:locale`、RTL CSS 合同、typecheck 均通过。该证据只覆盖本地运行时，不替代公网 13 语言真实浏览器矩阵。

2026-11-10 官方候选收口补充：只读审计确认来源 28 条、与 FLBOOK 交叉合并 7 条、新增候选 21 条、同名冲突 3 组；已建立 `docs/official-candidate-decision-matrix-2026-11-10.md`。754921/754922 因图片/包装来源不同保持独立，569687/569688 与 569693/569692 仅做展示层 canonical/alias；所有候选继续 `owner-review / published:false`，未写入 Payload。

2026-11-10 多语言 UI 补充：UI 字典批次 A/B 已为 footer、hero、首页产品区、新闻、知识、案例、搜索、系列/种植方式、导航详情和知识主题补齐 13 个 authored locale；新增 `tests/ui-authored-locale-coverage.test.mjs` 与 `tests/ui-content-locales.test.mjs`，两项通过。内容/首页/作物指南本地验证器均报告 `missingLocales=[]`。这些仍是 Codex 草稿，未写生产、未部署、未完成专业审校。

2026-11-10 浏览器/组件补充：本地 Chromium CMS_EVAL 390px 逐一回读 13 locale 均 200、`lang`/`dir` 正确、无根横向溢出、console error 0；Hebrew 菜单展开和 1280px English 截图已保存到 `output/playwright/`。浏览器同时暴露 sample 数据源仍显示部分 `译文暂未提供`，故内容矩阵保持 `PARTIAL`。随后补齐资源页、可持续发展、首页公司重点及导航/页脚组件内联 locale，组件 coverage 1/1、typecheck 和 RTL 合同通过。

2026-11-10 隔离 Payload 浏览器补充：通过现有 FLBOOK import 链路建立临时 SQLite + media 预览库，`CATALOG_SOURCE=payload` 下 Hebrew `/he`、`/he/about`、`/he/products` 与 Portuguese `/pt`、`/pt/products` 均 200，390px 宽度和 console 通过，未出现待翻译占位或英文资源标签；截图已保留在 `output/playwright/`，临时库已清理。该证据只覆盖隔离 Payload 预览，不代表生产回填或人工审校完成。

2026-11-10 询盘治理补充：建立 `docs/inquiry-governance-2026-11-10.md`，明确当前 consent/honeypot/状态/管理员边界为 `PASS-SCOPED`，通知为 `NOTIFY-LIMITED`，隐私版本、保留期限、速率限制、删除责任和通知策略保持 `PARTIAL / WAITING-EXTERNAL`；未接入 SMTP、未清理生产数据、未承诺 SLA。

2026-11-10 运维 O2 本地动作补充：新增 `scripts/backup-bundle.mjs`，将 PostgreSQL custom dump 与 media manifest 绑定到同一 bundle，写入 `backup-status.json`，任一步失败非零退出并脱敏连接串；`tests/backup-bundle.test.mjs` 2/2 通过。该实现只提供可调度原子动作，生产频率、保留、异地、加密和告警仍待 O1 外部决策。

2026-11-10 案例轮播文案补充：新增 `src/i18n/case-carousel-messages.ts`，并将 `src/components/case-carousel.tsx` 的角色、标题、缺译提示、控制项和链接统一改为 13 locale authored map；`tests/component-locale-coverage.test.mjs`、`npm run typecheck`、`git diff --check` 通过。该变更仍属于本地 UI 草稿，不代表专业母语审校或生产部署完成。

2026-11-10 首页编辑内容补充：新增 `home-editorial-messages.ts`、`home-featured-messages.ts`，并将首页新闻、种植知识和精选卡片的标题、简介、缺译提示、空态与入口文案统一为 13 locale authored map；保留西语精选卡片原有 insights 路径。组件 coverage、typecheck 和 diff check 通过，仍未部署或完成专业审校。

2026-11-10 partial inline map 收口：`home-company-story.tsx`、`home-newsletter.tsx`、`desktop-quick-links.tsx`、`mobile-quick-links.tsx`、`practice-menu-groups.tsx` 和 `product-insights.tsx` 已补齐 13 locale authored entries。组件 coverage、typecheck、locale contract、RTL CSS contract 和 diff check 通过；后续已完成产品系列/方案索引导航计数和方案详情统一渲染，仍未部署或完成专业审校。

2026-11-10 参考路由 inline 收口：`reference-route-messages.ts` 新增面包屑、首页、产品单复数、详情和返回入口字段；产品系列与种植方式索引已移除 en/zh 硬编码。typecheck、UI locale coverage 和 diff check 通过；fr/es 专属页面结构继续保留，未部署或完成专业审校。

2026-11-10 缺译提示收口：新增 `product-information-messages.ts`，产品信息缺失提示覆盖 13 locale；新闻、知识、案例和站内搜索统一读取现有 authored pending 文案并移除 en/zh 特殊分支。组件 coverage、typecheck 和 diff check 通过，未部署或完成专业审校。

2026-11-10 缺译分支继续收口：Hero、首页产品、产品详情和新闻详情统一读取 locale pending 文案；西语桌面/移动导航的方案入口改读 authored `methodsIndex`，专属路由结构保持不变。typecheck 和 diff check 通过，未部署或完成专业审校。

2026-11-10 共享 UI 收口：新增 `shared-ui-messages.ts`，统一 13 locale 的 skip link 与产品占位图文案；资源页面包屑改读 authored About breadcrumb。组件 coverage、typecheck、locale contract、RTL CSS contract 和 diff check 通过，未部署或完成专业审校。

2026-11-10 发布前基线复核：`check:deployment:files`、`check:p2-release`、`test:official-candidates`、`validate:flbook`、`validate:content`、`validate:crop-guides`、`check:locale` 均通过；内容、作物指南和首页本地化验证器均报告 `missingLocales=[]`。该证据仍是工作区/隔离 staging 范围，不代表候选发布、生产依赖部署或人工译文审校完成。

2026-11-10 方案详情收口：`solution-content.tsx` 已移除 fr/es 重复 JSX 分支，统一使用 13 locale `solutionPageMessages`；法语/西语 solution label 仍作为来源 slug 适配保留。route contract、solutions locale smoke、typecheck、component/UI coverage 和 RTL CSS contract 通过，未部署或改变作物指南事实。

2026-11-10 公网只读基线复核：`/api/ready` 返回 200 且 database/media 均为 true；公网 `/en`、`/he`、`/zh`、`robots.txt`、`sitemap.xml` 均返回 200。英文公开 HTML 未发现 `reviewStatus`、`claimsVerified`、`assetStatus`、`excluded-candidate` 或 `generated-placeholder` 字段名；“owner-review gate”仅为访客可理解的审核说明。该证据不替代完整浏览器矩阵、依赖部署或候选审核。

2026-11-10 公网安全边界与静态资源补验：匿名 `/api/products?limit=1` 返回 `403`；从英文首页抽取的媒体、CSS、JS 和 favicon 抽样资源均返回 `200`。该证据只覆盖当前公开实例的 HTTP/静态资源边界，不代表依赖候选已部署或新代码已上线。

2026-11-10 公网 health 补验：`/api/health` 返回 `200`，环境为 `production`，数据库为 `postgres`，`catalogSource=payload`，`mediaConfigured=true`。仍不能据此证明当前生产已运行工作区最新代码。

2026-11-10 公网 13 locale 服务端路由复核：`/en`、`/he`、`/nl`、`/fr`、`/it`、`/es`、`/pt`、`/el`、`/zh`、`/ro`、`/ru`、`/th`、`/tr` 全部返回 200；HTML `lang` 与预期一致，`he` 为 RTL、其余为 LTR，`zh` 为 `zh-CN`。该证据不替代完整真实浏览器矩阵。

2026-11-10 可重复公网基线审计：新增 `npm run audit:public-baseline`。对 `https://www.kowloonglobaltrading.com` 执行后 `ok:true`，13/13 locale 页面、language/dir、匿名 API 403、robots/sitemap、公开审核字段边界及抽样静态/媒体资源均通过，warnings/errors 为空。脚本只读，不提交询盘或修改生产。

2026-11-10 外部决策收口：新增 `docs/external-decision-packet-2026-11-10.md`，集中列出依赖发布窗口、21 条候选产品决策、询盘通知/隐私、运维 RPO/RTO 与翻译/视觉审校所需的确认字段。该文档仅用于收集参数，不授权生产操作。

2026-11-10 依赖安全升级候选复验：隔离 worktree `codex/haifa-dependency-release` 保持 clean，提交 `81859a6` 仍仅包含 5 个依赖/standalone 文件。官方 registry 冻结安装、esbuild rebuild、audit（0 high/critical）、typecheck、部署文件、P2、官方候选合同、Sharp 边界测试、隔离占位数据库 build（`m0jKmHl0rVA_MzgIXBcyZ`）和 `prepare:standalone` 均通过。生产备份、发布窗口、回滚点和实际部署仍待外部确认。

2026-11-10 依赖升级已部署：在生产完成 PostgreSQL/media/上一版 standalone 备份后，部署候选提交 `81859a6`；生产版本为 Next 16.4.5、Payload 3.93.0、Sharp 0.35.5，build ID `e7m_5Jpd1SGNUDiD5kOcW`。systemd 重启后 active，health/readiness 通过，公网 `audit:public-baseline` 13 locale 全通过。生产浏览器 Hebrew 390px、系列和方案路由通过方向/宽度/console 检查；懒加载图片完整矩阵仍为 `PARTIAL`，未扩大结论。

2026-11-10 UI inline map 批次 C 浏览器补验：开发实例 `CMS_EVAL=1 CATALOG_SOURCE=sample :3123` 的 Hebrew 首页在 390×844 下 `lang=he`、`dir=rtl`、`scrollWidth=390`，截图为 `output/playwright/home-he-inline-maps-390.png`。sample 内容和开发 HMR WebSocket 错误使本条保持 `PARTIAL`，不能替代 Payload 预览或生产 console-clean 证据。

## 按顺序继续

1. **收口发布追溯和文档状态**：保留当前所有本地差异；把本次服务器核验、生产依赖版本、审计结果和 67e6b93 应用快照记录为当前基线。生产目录没有 Git 元数据，下次部署补记 commit 与 build ID。
2. **依赖安全升级与 Hero 热修复已完成当前发布闸门**：生产已运行 Next 16.4.5 / Payload 3.93.0 / Sharp 0.35.5，锁文件 audit 为 0 high/critical；备份、构建、standalone、systemd、health/readiness、公网基线和 Hero 中文横幅清理均已通过当前范围验收。后续不要重复部署依赖，继续处理下方仍开放的产品、翻译、询盘和运维闸门。
3. **处理官方候选产品**：21 条官方候选和 3 组同名冲突需要业主确认型号、包装、销售状态及 claims；确认前保持 `owner-review` / `claimsVerified=false`。复合肥料无可靠定量来源，继续不展示推断数值。
4. **确定询盘运营闭环**：生产询盘已写入 Payload，但 SMTP/API 通知未配置。先决定由谁人工处理，或选择邮件/工单集成及收件、失败重试和 SLA，再实现对应能力。
5. **逐步完成语言本地化**：13 种语言路由已公开；UI 字典、案例轮播和主要组件内联文案已完成本地 authored coverage。下一步优先确定关键语言和页面，由人工审校业务文案，英文回退只作为缺译兜底；fr/es 仅保留方案名称/slug 适配。
6. **运维连续性 O1–O5**：先补齐备份频率、保留/异地/加密、告警接收人和 RPO/RTO 决策表；再实施定期联合备份与失败可见性、readiness/磁盘/systemd/询盘积压监控、隔离恢复演练，最后评估优雅停止与版本目录回滚。没有外部参数和服务器授权时保持 `PARTIAL` / `WAITING-EXTERNAL`，不把一次性备份演练扩大为持续运维能力。

## 回归命令与限制

- `npm run typecheck`、`npm run validate:flbook`、`npm run validate:content`、`npm run validate:crop-guides`、`npm run check:locale`、`npm run test:rtl-css`。
- smoke 需显式设置 `PREVIEW_URL=https://www.kowloonglobaltrading.com`；默认 localhost:3000 可能是另一个服务，导致误判 404。生产 smoke 在 `INQUIRY_MODE=enabled` 下会创建明确标记的验收询盘，后台可将其状态改为 `closed`。
- 项目要求非必要不运行 build；依赖升级在准备部署时需要生产构建和静态资源完整性验证。不要执行盲目的 `npm audit fix --force`。
- 本次确认服务 active、数据库/媒体 readiness 通过；未在本轮重新执行公网 smoke、SEO、全语言真实浏览器矩阵或备份恢复演练。SMTP/工单通知和非英语人工译文仍未完成。

## 2026-11-10 依赖发布后 Hero 热修复

首次依赖发布的生产截图确认 Hero 原始 `hero-01.jpg` 等图片含中文横幅字样，故该问题当时并未解决。随后提交 `8e141d2` 将 Hero 背景切换到 `company-research.jpg`、`company-laboratory.jpg`、`technology.jpg`，并已部署到生产 build `kQvA_SEwMLo_zDx9zdImU`。英文 390px 截图 `output/playwright/production-en-390-hero-hotfix.png` 与中文 `/zh` SSR 回读均确认 Hero 使用干净背景；作物兴趣卡片保留原始图片属于独立业务用途。

热修复后的公网基线为 `ok:true`：13 个 locale 均 200，`lang/dir` 正确，health/readiness 通过，匿名产品 API 403，抽样静态资源通过。当前只可将 Hero 中文横幅清理记为 `PASS-SCOPED`；完整图片视觉矩阵、专业人工翻译、官方候选审核、询盘通知和运维连续性仍未收口。

## 2026-11-10 G0–G7 正式验收阶段完成

已按 `tasks/plan.md` 的正式闸门执行：G2 生产 HTTP/SSR 728/728；G3 四视口真实浏览器 150/150；G4 长语言 Header、RTL 宽度和移动 Logo 层叠问题已修复；G5 14 页面/21 媒体审计通过；G6 smoke 23/23、SEO 5/5、route contract 3/3 和当前菜单 Escape/语言菜单/FAQ/产品/RTL 交互通过。当前 build 为 `QLZO1Btk6LMeXVqu5v7XT`。

技术验收阶段可以记为 `PASS-SCOPED`，整体项目仍不能记为最终完成：非英语专业翻译、21 条官方候选字段签核、复合肥定量资料、询盘治理和运维连续性仍保持 `PARTIAL` / `WAITING-EXTERNAL`。完整证据见 `output/acceptance/2026-11-10-formal-acceptance-g0-g1/final-report.md`。

## 2026-11-10 阶段 4 生产回填补充

- 业主已明确授权 Codex 全量翻译、自检和生产推进，不再等待外部翻译服务或人工签核。
- `scripts/backfill-localizations.mjs` 默认只读预览；生产写入要求三重显式确认，并按 locale/slug/字段保护已有非空值。
- 生产前备份：PostgreSQL 180,379 bytes；媒体 104 files / 65,865,625 bytes，目录为 `.local/backups/translation-stage4-20261110T213600Z/`。
- 生产回填：11 个外文 locale、2,387 个字段由空值填充，396 个 Payload 文档/全局更新；读回 2,387 unchanged、0 conflict、0 missing。
- 公网验收：11 locale 产品/About/FAQ/News 共 44 路由通过；smoke 23/23、SEO 5/5；Codex 自检稿不代表专业母语、法律或农艺认证。
