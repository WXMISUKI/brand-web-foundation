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
- 新增 `npm run check:p2-release` 只读正式内容门禁；当前输出 `ready:false`，10 个产品均为 `owner-review`、0 个 `claimsVerified`，明确保留正式 claims/型号/包装/证书/最终翻译外部门禁，不自动放宽审核状态。
- P2 逐条审核包已写入 `docs/p2-content-review-packet-2026-11-09.md`，列出 10 条产品、来源页、76 条规格、复合肥料缺失定量表和统一签核项；完成审核前不推进 P3 发布决策。
- 2026-11-09 生产历史导入元数据修复：管理员视图下 10 条产品的 `reviewStatus/assetStatus/claimsVerified` 曾为 null，已在备份 `.local/backups/payload-2026-11-08T20-20-27-070Z.dump` 后按 slug 精确补回；`audit-production-products.mjs` `missingCount=0`，公开 hook 仍隐藏审核字段，smoke/SEO 通过。修复脚本现在要求 `PRODUCTION_REPAIR_CONFIRM=YES`。
- `npm run audit:production-products` 已纳入 package scripts，并在生产管理员视图运行通过：10 条产品、`missingCount=0`、双语详情完整、规格和审核元数据完整。
- P3 外部决策包已写入 `docs/p3-external-decision-packet-2026-11-09.md`，将产品内容、正式语言、询盘隐私和 noindex 解除拆成可直接回复的四项门禁。
- 2026-11-09 项目方已选择继续保护态：公开 en/zh、其他语言预览、询盘 disabled、noindex 保持、产品继续 owner-review/claimsVerified=false。决策理由和下一次放行条件见 `docs/p3-release-decision-2026-11-09.md`。
- 元数据修复后的公开边界回读：匿名 `/api/products?limit=1` 为 `403`，英文产品详情不泄漏 `reviewStatus`、`assetStatus`、`claimsVerified`。
- `test:seo` 已增加上述公开边界回归，当前生产 SEO 合同为 5/5。

更新时间：2026-11-09。目标是继续完成高保真参考站复刻、画册内容接入、后台维护、多语言、询盘及上线验收；当前**未完成最终验收**。

2026-11-09 资料边界与参数复验已完成：SSH 已恢复并确认生产服务、数据库、媒体和 standalone 静态资源正常；以业主提供的 FLBOOK 浏览链接和 Haifa 参考网页为来源，不以 PDF 作为本轮资料来源。十条 staging 产品页码、笔误和审核状态已修正，dry-run 改为分离公开/管理员 provenance 回读并全量通过；产品详情隐藏 `excluded-candidate` 内部候选页，只保留画册页码和来源预览。生产 PostgreSQL 先完成新备份，再按 slug/locale/旧值精确修正 20 条英中简介页码，保留已存在的审核后缀；随后追加 9 个产品的 76 条来源规格，只有复合肥料因页面没有可靠定量表继续为空。修复已部署，生产 `api/ready`、静态 CSS/JS/favicon、smoke 23/23、SEO 4/4 均通过。证据见 `docs/p2-source-audit-2026-11-09.md` 与 `docs/p2-parameter-evidence-2026-11-09.md`。

## 工作区与保护边界

- 实际项目：`D:\work\private\haifa-reference-rebuild`，分支 `codex/haifa-reference-rebuild`，HEAD `202240d`。`D:\work\private\brand-web-foundation` 的 `main` 是旧基础工程，不能误当作当前站点。
- 当前工作区有大量已修改、删除和未跟踪文件，包含当前站点的主要实现和本轮修复；这些都是需要保留的工作。**不要 reset、clean、checkout 覆盖、批量提交或重新导入生产数据库。** `.playwright-cli/` 是浏览器验收记录，清理前先判断是否需要留存证据。
- 先阅读 `docs/spec.md`、`tasks/plan.md`、`tasks/todo.md`、`docs/interaction-acceptance.md`、`docs/deployment-target.md`、`docs/launch-acceptance-matrix.md`。部分历史审计文档有旧结论，必须以本交接和实际运行状态为准。CodeGraph 已初始化；先查索引再读代码，工具不可用时回退原生检索。
- 使用中文与用户沟通；按项目指令优先 RTK，保留现有改动。普通实现细节可自行决定；架构、数据、安全、部署的重大选项先向用户说明。

## 已确认需求和资料

- 参考站：https://www.haifa-group.com/；用户希望整体布局、菜单状态、交互与视觉尽可能接近，不能把 HTTP 200 视作视觉或全流程验收。
- 业主拥有并授权使用画册：https://flbook.com.cn/c/LTc82gQQM3 。允许按页提取、裁剪；缺少的场景图可生成补充。10 个产品在 `src/data/flbook-import.json`，页码与素材清单在 `src/data/flbook-manifest.ts`、`docs/flbook-import-plan.md` 和 `docs/product-content-mapping.md`。生成图片与真实画册内容须保留可追踪来源，不能把生成场景或编辑性案例写成已发生的真实事实。
- 名称：安徽康母国际化肥股份有限公司；英文当前使用 `Anhui Kangmu International Fertilizer Co., Ltd.`；产品品牌 KOMU/康姆。邮箱 `leon@kowloonglobaltrading.com`；WhatsApp `+852 9074 0009`。
- 用户确认 Payload + Next.js，生产 PostgreSQL，本地可 SQLite；多语言独立 URL、默认英文 `/` 跳 `/en`。目标与参考站语言种类一致；代码配置 13 种，但生产当前仅公开 en/zh，不能宣称 13 种均已发布或翻译完成。后台需维护产品、图片、新闻、知识文章与富文本，无需审核流。

## 线上与验证现状

- 入口：https://www.kowloonglobaltrading.com/en ，中文 `/zh`。服务器 `43.160.216.74`，SSH 用户 `ubuntu`，本机私钥 `C:\Users\dddsg\.ssh\kowloon_web_sg_01.pem`；不要读取或打印私钥、环境变量和密码。目标目录 `/home/ubuntu/haifa-reference-rebuild`，systemd `haifa-reference.service`，127.0.0.1:3118，Nginx/HTTPS，PostgreSQL 数据库 `haifa_reference`。旧 `brand-web.service`、`brand-cms.service` 历史上已停用，旧项目保留作备份。
- 本次交接实时核验：公网 `/en` HTTP 200；`/api/ready` HTTP 200 且数据库、媒体检查为 true；本地 `npm run typecheck` 通过。SSH 本次返回 `Connection closed ... port 22`，因此**本次未复核** systemd、数据库计数和管理员状态；此前记录用户表为 0。检查 Clash TUN/代理 DIRECT 配置后重试，不需要为此开启 IPv6。
- 2026-11-09 复核：关闭代理 TUN 后 SSH 已成功；`haifa-reference.service` active、PostgreSQL/媒体 readiness 通过、users=1、standalone 静态资源和 favicon 回读 200，生产 smoke 23/23、SEO 4/4；上一条 SSH 失败记录仅保留作故障背景。
- 历史记录：此前生产 smoke 22/22 通过，覆盖路由、筛选、双语链接和健康接口，知识主题筛选 500 已修复并上线；后续已扩展为当前 smoke 23/23，这不是浏览器全交互或全面视觉验收。
- 关键事故：最近真实浏览器发现 `_next/static` 和 `favicon.svg` 404，SSR 正常但脚本样式未加载。已在服务器将 `.next/static` 和 `public` 复制到 `.next/standalone/.next/static`、`.next/standalone/public` 并重启，随后浏览器 reload 控制台无新错误。**每次 standalone 重新 build 都可能重置这些目录，部署流程必须固化复制和公网静态资源回读**；Dockerfile 已有复制指令，但服务器使用 systemd 非 Docker。上线前确认 HTML 引用的 CSS/JS、favicon 和媒体均返回 200，再做浏览器交互。
- 真实浏览器曾在修复静态资源后看到首页英文公司重点显示 `Information unavailable`、图片 alt 是 JSON、案例标题含 `PREVIEW`、部分产品简介仍有 `await review`。不要把先前“占位文案已全部清理”当作事实。

## 历史中断记录（2026-11-08，已处理）

以下是 2026-11-08 当时的未部署清单；其中与静态资源、内容映射和详情展示相关的修改已在 2026-11-09 部署并通过生产回归，后续以本交接书顶部的 2026-11-09 快照和 P2/P3 证据文档为准：

1. `src/lib/localized-text.ts` 及 `src/content/{catalog,homepage,company-profile,news,insights,cases}.ts`：兼容历史媒体 alt 被序列化成 JSON；英文公司重点缺字段时提供通用回退。注意回退只能缓解展示；后台原始英文数据仍需正确修复，不能覆盖用户后续编辑。
2. `src/components/case-carousel.tsx`、`product-information.tsx`：去除部分预览提示，缺技术参数时引导联系。`src/data/flbook-import.json` 修正两条英文 `await review` 和一处中文语病；生产数据库不会自动随 JSON 更新，禁止运行只允许空库的 `import:flbook` 覆盖生产。
3. `scripts/import-flbook-payload.mjs` 公司 focusAreas 改用 `locale: all` 一次写双语，防止逐语言更新数组覆盖英文。只做了语法检查和 typecheck；需独立临时库实际 dry-run/readback，确认双语均存在，严禁对现有生产库直接重导。
4. 交接前 `src/content/insights.ts` 的 `topics.slug` 查询已上线；`docs/completion-audit.md`、`docs/launch-acceptance-matrix.md`、`tasks/todo.md` 有当时记录，但其中“所有提示已清理”等结论需要按真实页面修正。

## 按顺序继续

1. **冻结现状与修复部署**：核对当前 git diff 和未跟踪文件；确认线上资源、可用磁盘与服务。为 systemd 构建后复制 standalone static/public 增加可重复部署步骤，避免删除或覆盖现有媒体和数据库，验证失败时能回滚。不要擅自清库或重新 seed。
2. **验证并完成本地待发布修改**：隔离 SQLite 运行 `npm run dry-run:flbook`，检查公司 focusAreas 英中读取、媒体 alt、产品内容；检查 import 脚本确实接受 `locale: all`。必要时使用一次性、范围限定、可回滚的数据修复，先备份并检查生产当前值，避免覆盖后台人工编辑；暂未授权的高风险覆盖先与用户确认。部署后用真实浏览器核对页面和图片，而不是只检查 HTML。
3. **真实交互与视觉验收**：使用 Playwright CLI 和参考站逐页比较，先桌面 1440/1280、移动 390，检查导航 hover/点击、下拉长列表裁剪、键盘和 Esc、右侧快捷栏默认/hover/active、轮播、兴趣切换、筛选、搜索、产品与作物链接、FAQ、语言、移动菜单、滚动遮挡及 console/network。记录失败和修复后复测，分别标记真实浏览器、HTTP、生产数据证据；不可声称尚未执行的全流程通过。用户特别关注参考站还原与图片不重复。
4. **内容与数据对账**：核验 24 页画册、10 商品的图片、产品标题与源页的对应关系，以及 `sourceRelatedPages` 等内部审计字段是否不恰当地暴露给买家；修正空白、虚构新闻日期/案例事实、重复图片、残留预览词，保留内容来源和生成素材标识于后台。将前台缺失字段处理为实际可用信息或联系入口，勿编造配方、认证或施用量。
5. **后台与备份（历史待办，已处理）**：此前管理员数量为 0，后续已安全初始化为 users=1，并完成后台编辑回读、联合备份恢复和重启回读。继续参照 `docs/postgresql-backup-runbook.md` 做日常备份，不能覆盖生产。
6. **多语言、询盘、发布**：业主已授权 13 语言公开、`INQUIRY_MODE=enabled` 和解除 noindex；共享 Payload 初始化与英语源回退已部署，生产 URL/SEO/询盘写入/冷启动均完成当前范围验收。缺少人工译文的 Payload 字段使用英语源回退，不能视作翻译完成；询盘成功只代表后台记录，未配置 SMTP 时不能声称邮件已送达。后续工作是人工翻译审校和通知策略决策，不再等待部署回读。

## 回归命令与限制

- `npm run typecheck`、`npm run validate:flbook`、`npm run validate:content`、`npm run validate:crop-guides`、`npm run check:locale`、`npm run test:rtl-css`。
- smoke 需显式设置 `PREVIEW_URL=https://www.kowloonglobaltrading.com`；默认 localhost:3000 可能是另一个服务，导致误判 404。生产 smoke 在 `INQUIRY_MODE=enabled` 下会创建明确标记的验收询盘，后台可将其状态改为 `closed`。
- 项目要求非必要不运行 build；但生产部署需要 build 和静态资源完整性验证。此前服务器 `npm ci` 报 19 个依赖漏洞，需重新核实当前依赖与实际风险，不要盲目 `npm audit fix --force`。
- 实际管理员、询盘收件、SEO、多语言和全量浏览器验收仍未完成；持久目标应保持 active。
