# 分阶段执行与验收计划（2026-11-10）

目标：在现有规格和用户决定下，逐阶段完善公开站点的展示、内容、运营和持续运行能力。状态按实际证据标记，不将隔离测试视为生产验收。

| 阶段 | 任务与交付 | 验收 | 状态 |
| --- | --- | --- | --- |
| 1 | 英文候选文本、首页兴趣与精选卡片图片审查和修复 | 英文可见文本、图片内容和生产浏览器回读 | `PASS-SCOPED`：候选英文修复、Hero 清理、媒体审计和生产浏览器矩阵通过；原始产品包装中文标签按业主确认保留 |
| 2 | Header 滚动收起与回顶恢复 | 390×844、1280×720、希伯来语 RTL 的滚动前后和回顶；布局、焦点、console | `PASS-SCOPED`：本地与生产 3/3 通过 |
| 3 | 对账并落实 21 条候选公开展示 | 核对真实 schema、查询与记录；28 来源、7 交叉、3 组同名关系；隔离及生产回读 | `PASS-SCOPED`：公开授权、生产精确修复、发布和回读通过；未核验型号/claims/规格继续保持 `owner-review / claimsVerified=false` |
| 4 | 13 语言术语、审校与分批回填 | Codex 全量自检；按 slug、locale 和旧值保护的回填及回读 | `PASS-SCOPED`：11 个外文 locale 生产回填、2,387 字段读回通过；专业母语/法律/农艺认证仍未做 |
| 5 | 产品资料与素材权利 | 逐条来源及业务确认；无依据的定量字段保持空 | `PASS-SCOPED`：来源分层、官方图片长期商业使用授权、媒体边界和未知定量字段处理均已确认 |
| 6 | 询盘隐私、反垃圾及处理流程 | 治理决策、隔离验证；通知仅按明确需求接入并单独验证送达 | `PASS-SCOPED`：Payload 后台人工处理、不接通知、不配置自动删除/限流、不承诺 SLA 已按业主决定落地 |
| 7 | 联合备份、告警、恢复与回滚 | 策略确认后验证排程、失败可见性和隔离恢复 | `PASS-SCOPED`：备份 bundle、失败非零和一次性恢复证据通过；业主明确 O2–O5 当前不实施 |
| 8 | 目标版本综合验收与发布收口 | 实际版本、内容、浏览器、询盘、运维证据及未完成项 | `PASS-SCOPED`：生产 smoke/SEO/702 HTTP/SSR/24 浏览器矩阵/关键交互/翻译回填/候选边界均通过，未核验 claims 和专业认证继续保持边界 |

## 评审与约束

- 产品、实现、验收与维护视角复核认为原阶段方向总体合理；询盘和运维风险应尽早只读盘点，不必等到后期才发现决策缺口。
- 现有文档对候选产品公开状态有冲突；须核对实际 Payload 与前台，区分来源记录、展示卡片及审核状态。
- 图片 HTTP 200 不证明图内无中文或具备使用权；已有 150/150 浏览器矩阵不覆盖本次英文语义及 Header 滚动态。
- 大量既有未提交改动须保留，实施前逐文件检查；不得重置或批量覆盖。
- 生产写入或发布前，应针对实际变更准备备份、精确写入、回读和回滚；专业审校、业务事实和运维策略不能由技术测试代替。
- CodeGraph MCP 当前未暴露；按项目约定使用原生检索回退。`rtk` 可用，Windows shell 内建命令不能作为其外部进程运行时使用原生命令。

## 当前证据与待定事项

- `scripts/publish-official-candidate-products.mjs` 将中文候选名拼入英文名称和简介；既有记录被脚本跳过，仅修改脚本无法修复后台现有数据。
- `src/components/interest.tsx` 引用 `solutionImages`；精选卡片及产品图片还可能来自 Payload，需分别检查。Hero 已有修复不能推断其他图片已清理。
- 前台兜底会影响搜索一致性与同名来源图片聚合；用户已选择旧值保护的后台精确修复，需备份和回读。
- 用户允许寻找合适真实素材或生成场景示意；不得把生成图描述为真实企业场景或产品材料。已有温室、果园生成示例的来源记录位于 `docs/prototype-status.md`，使用前需重新确认展示语境。
- 首次阶段验收应在实际使用 Payload 的隔离数据上覆盖新旧记录；生产数据与本地样例存在差异。

## 阶段 1 进展（本地，PARTIAL）

- 候选导入脚本已改用不含中文的中性来源编号及简介；`candidateCopyRepair` 只识别历史错误的精确旧值，独立保留被修改的名称或简介。同名展示别名使用同一来源编号标签。纯函数可预览缺失、冲突、保留及拟变更字段；合同测试 6/6、TypeScript 检查通过。
- 已新增只读预览脚本；服务器临时独立 PostgreSQL 实例上以一个错误名称和人工编辑简介的假数据验证，仅名称列为拟变更，简介被保留；空库返回 21 条缺失。临时实例和测试文件已清理。该规则尚未连接数据库写入流程，已有 Payload 内容和媒体 alt 均未修改；仍需并发保护、完整隔离验证、备份和生产回读。中性编号名称的买家可辨识度也需继续改善。
- 英文兴趣区局部使用两张已有来源记录的生成场景；新增玉米、麦田和草莓第三方真实图片（来源及许可见 `third-party-crop-images-2026-11-10.md`），其余多数类别暂显示通用图标。本地桌面和 390px 截图是新增真实图片前的局部检查，移动端示意标记换行较多，整体视觉效果和素材覆盖尚未达标，不可发布。产品图片和 CMS 精选图片尚未完成审查。Commons 已返回 429，暂停请求并遵守限流。
- 现场运行的公网只读基线返回 `ok:true`、13 个首页 200，但 `hero-03.jpg` 有一次请求超时警告；不能据此声称所有媒体稳定。默认 localhost 审计在服务未启动时失败，与生产状态无关。
- 本机 Docker 引擎不可用，故使用服务器上独立临时 PostgreSQL 实例执行上述只读预览测试；未向现有生产数据库写入。并发更新和回滚验证仍未执行。
- 生产数据库只读查询确认产品总数 31。尝试以 postgres 身份运行完整预览时，临时目录对生产 Node 依赖的访问失败；完整生产预览未运行，不能推断 21 条均符合旧值条件。

### 后台精确修复设计边界

预览先按 21 个来源 ID、slug、完整来源 URL 和 `en` 本地化记录生成逐字段变更及冲突清单；审批状态发生变化或旧值不匹配时保留原值。简单的先读取再通过 Payload 更新存在并发覆盖窗口，不能声称实现旧值保护。正式实现须在同一 PostgreSQL 事务中锁定并校验记录，以精确旧值条件更新和回读；执行前备份，回滚也须仅在当前值仍等于本次新值时执行。应先核实直接数据库写入对 Payload hooks、更新时间与缓存的影响，再在独立 PostgreSQL 实例上进行并发和回滚验证。

即使事务内有条件更新，后台人员在操作前打开的旧表单仍可能在事务提交后覆盖新值，执行窗口须协调暂停编辑或先建立版本冲突保护；不得把脚本内的条件更新误称为对所有后续编辑的保护。

## 生产只读对账补充（2026-11-10）

- 使用只读事务核对生产库：21 条 `official-*` 候选均存在、来源 URL 与清单一致，均为 `owner-review / claimsVerified=false`；21 条英文名称和简介均精确匹配历史错误模板。
- 21 条候选图片的英文 alt 均包含中文，且精确匹配历史导入时序列化的 `{en,zh}` 对象字符串；21 张图片互不重复，未被其他产品共用。此检查不证明图片本身无中文字或未被其他内容类型引用。
- 本地导入脚本已改为分别按英语和中文写入文本 alt；新增规则只识别精确旧 alt，不覆盖其他值。英文候选中明确包含“水溶肥”“复合肥”等类别的名称采用对应宽泛英文类别及来源编号，不推断定量规格或销售状态。
- 只读预览脚本已加入媒体 alt 和产品间图片共用检查；修改后的完整数据库预览及导入流程仍待隔离集成验证。定向合同测试 7/7、类型检查和 diff check 通过。没有对生产数据库做写入，也没有进行生产发布。

## 预览集成验证补充

- 已在全新隔离 PostgreSQL 中运行 `tests/official-candidate-preview-postgres.test.mjs`：识别旧名称和序列化 alt，保留人工编辑的简介；图片被第二条产品或文章引用时报告冲突；预览前后记录不变。扩展后复验 1/1 通过，临时实例已停止并清理。该测试不覆盖写入、回滚、并发竞争或完整 Payload 行为。
- 对生产数据库的媒体外键只读检查显示，这 21 张候选图片当前没有被案例、新闻、知识、首页、企业资料或文档锁关联。预览脚本现用可重复读只读事务发现并检查数据库中指向媒体表的直接外键；富文本内嵌引用、外部 URL 和无外键的引用仍需另行审查。此为只读快照，不能防止检查后发生变化。

## 隔离写入进展

- 用户选择生产维护窗口中短暂冻结候选产品编辑；具体窗口尚未确定，不能将选择本身视为当前已冻结。
- 已编写事务内旧值校验、产品与媒体英文文本写入及条件回滚核心。独立 PostgreSQL 的单条记录测试覆盖写入、提交、回滚、人工修改冲突和媒体共用，1/1 通过；临时实例已停止并删除。
- 批量修复入口目前明确限制为隔离测试数据库；完整 21 条批次、双连接并发竞争、日志/备份故障、回滚入口及真实 Payload 回读未验证，不可用于生产。旧表单后续提交风险须通过实际编辑冻结解决。
- 首次启动隔离测试因上轮临时 PostgreSQL 占用端口失败；确认进程来源后已停止并清理该临时实例，重新运行成功。生产数据库未写入。
- 21 条模拟候选的完整批次已在全新独立 PostgreSQL 上验证：保留人工修改及中文记录；图片被文章共用时整批拒绝；journal 目标已存在时数据库回滚且原文件未覆盖；正常批次写入 21 条并生成 journal 与提交标记。测试 1/1 通过，临时数据库已停止清理。这里的备份为隔离测试文件，不证明生产备份有效。
- 批量入口仍仅允许本机 `candidate_copy_test:55439` 隔离环境；提交结果不确定时的恢复、批量回滚入口和真实 Payload 回读仍未验证，不可用于生产。
- 独立 PostgreSQL 双连接测试：另一连接先修改并提交英文简介，修复随后检测到快照变化并拒绝写入，人工编辑保留。21 条批量 journal 回滚核心也已演练：一条后续人工编辑导致整批事务回滚，修复后的快照保持；恢复匹配值后 21 条原名称可恢复。以上测试均通过；仅覆盖本次模拟的竞争顺序，不证明后台旧表单提交问题已解决。临时数据库已清理。
- 新增隔离回滚命令并在独立 PostgreSQL 中验证完整 journal：21 条可恢复，后续人工编辑导致整批拒绝，重复回滚拒绝；测试通过。入口仍只允许隔离库，未执行生产回滚。
- 真实 Payload 3.93 配置与 PostgreSQL 全部迁移在新隔离库执行；Local API 对单条修复后英文名称、英文 alt、中文名称/简介及人工英文简介的断言通过。测试进程未退出，被 25 秒超时终止，故整体结果为 PARTIAL；临时 PostgreSQL 已停止并清理，需解决进程退出并重跑后才可记为完整通过。
- 复核 Payload `destroy()` 发现其内部已经调用数据库销毁；测试已删除重复调用。但独立 PostgreSQL 重跑时业务断言再次通过、进程仍未自然退出，超时退出码非零；重复销毁并非唯一原因，退出问题仍需定位。临时实例已清理。
- 后续检查 Payload 3.93 PostgreSQL 适配器：初始化保留签出连接，adapter `destroy()` 不结束连接池。隔离测试清理中显式释放测试池连接并结束连接池后，完整真实 Payload/PostgreSQL 测试自然退出，1/1 PASS-SCOPED；覆盖单条候选的英中名称、简介及 alt 回读。该清理使用 `pg` 内部池字段，仅限此隔离测试，不改变生产依赖或证明生产生命周期已修复；临时实例已清理。
- 操作 journal 新增内容 SHA-256 与受限文件权限；隔离回滚拒绝与提交标记哈希不符的 journal。提交过程中出错或事务回滚未确认时记为 `unknown`，不得当成已中止。独立 PostgreSQL 测试覆盖正常 21 条批次、journal 篡改拒绝及回滚冲突，1/1 通过；网络中断导致的实际 COMMIT 不确定故障尚未注入验证。测试备份只是占位文件，不能证明备份有效。
- 本地 sample 预览中英文兴趣区改为不透明背景，避免底层旧横幅中文透出；AI 场景说明缩短并独立换行。390×844 和 1280×720 截图检查已接入的果园、温室、麦田、玉米图片；390px 根宽 390、无横向溢出。截图不覆盖横向轨道全部作物、Payload 实际媒体或生产；缺图占位及产品/精选图片仍为 PARTIAL。typecheck 与 diff check 通过。
- 生产英文首页只读截图确认首页精选的产品目录与种植应用两张图分别为 `hero-01.jpg`、`hero-02.jpg`，图片内均有中文宣传文字。工作区针对这两个已知 Payload 路径增加英文展示映射：分别使用官方产品陈列图和已记录许可的第三方麦田图，中文及后台后续替换的其他路径保持不变；focused test 1/1、typecheck 与 diff check 通过。实际 Payload 页面及生产部署尚未验证。
- 生产英文目录只读截图显示真实产品包装带中文标签，且复合肥分类图使用含中文宣传内容的画册页。包装是产品来源实物，与宣传横幅需分别处理；不能生成或替换为不对应产品的包装。分类图及产品媒体的英文呈现仍未解决，继续为 PARTIAL。截图见 `output/playwright/stage1-products-production-audit.png` 和 `stage1-featured-production-audit.png`。
- 业主确认英文目录保留真实中文包装，并配英文说明。本地产品列表在 Payload 有结果时增加说明；尚未部署或在 Payload 浏览器回读。尝试从第 22 页制作仅含包装的裁剪，因原图分辨率不足、画面模糊而未采用，临时图片已删除；分类宣传图仍待合适素材。
- 英文 `official-*` 候选详情页也加入原包装标签可能为中文的说明；其他产品详情和中文文案不变。该组件修改通过 typecheck，真实 Payload 详情页仍待浏览器回读。
- 英文复合肥分类卡使用官方候选来源 `569687` 的真实产品包装图（原始官方图 URL、SHA-256 记录在 `official-source-asset-audit-2026-11-09.md`），中文页仍用画册图；英文包装说明提升到目录分类区。浏览器确认英文分类背景实际加载该包装图片，CSS 不再叠加旧 Hero 横幅。工作区本地图像及文字已类型检查通过；Payload 生产记录未更改，生产呈现待部署后验收。
- 前一轮截图后复核发现 `.catalog-category` 原样式忽略 JSX 已设置的 `--card-image`，仍引用含中文的 `hero-01.jpg`。本地 CSS 已修复为使用传入分类图并移除旧横幅 fallback；英文页分类背景已浏览器核实为类别专用图片。其他 locale 的来源映射保持原有数据定义。
- 390px 本地英文/中文目录均检查 `scrollWidth=clientWidth=390`；英文分类指向官方产品包装图、中文分类继续指向画册图。包装说明文案在本地 sample source 下按条件不显示；真实 Payload 页的提示状态仍未验证。截图见 `output/playwright/stage1-categories-local-v3.png`、`stage1-categories-local-v4.png`。

## 阶段 1 本轮补充验收（2026-11-10）

- 英文首页兴趣区的蔬菜卡改用已有 `vegetables-prototype.webp` 示意图，保留 AI 生成说明；中文页面仍使用原有中文来源图片。`typecheck` 和精选媒体/候选修复定向测试通过。
- 浏览器复核发现英文 Hero 第三张原映射到 `technology.jpg`，该图是含中文大字的宣传拼图。增加精确的英文媒体替换，改用已记录来源的 `commons-wheat-texas.webp`；中文 Hero 及其他自定义图片不变。回归测试先失败后通过。
- 本地 Playwright 核验 `CATALOG_SOURCE=sample` 英文第 3/3 张 Hero 在 1280×720 与 390×844 均加载麦田图，`scrollWidth=clientWidth`，console error 为 0；中文 Hero 仍映射到原有 `company-research.jpg`。截图：`output/playwright/stage1-hero-en-desktop-v2.png`、`stage1-hero-en-mobile-v2.png`。
- 本轮 `typecheck`、`git diff --check`、精选媒体定向测试通过；无 `npm build`。以上是本地 sample/浏览器证据，未改生产 Payload、未部署；生产 Hero 和精选卡片的实际媒体仍须发布后回读。阶段 1 仍为 `PARTIAL`，未满足生产候选数据完整回读、全作物图片覆盖和 owner review。
- 页面覆盖率复核：英文首页 22 张作物卡有 8 张使用匹配图，3 张种植方式卡有 1 张使用匹配图；其余显示图标占位，没有回退到中文宣传拼图。该统计来自本地 Playwright DOM/CSS 状态，不代表人工审完所有图片。
- 为补素材尝试 Openverse `commercial` 可用许可搜索，连接超时且没有结果；此前 Commons 已限流，本轮没有继续请求。当前会话未提供内置图像生成工具；根据 `imagegen` 技能，CLI/API 后备路径需用户明确选择并要求本机配置 API Key，本轮未调用。

## 阶段 1 接续验证（当前会话）

- 采用“精确旧值保护”方案，设计与实施计划分别记录在 `docs/superpowers/specs/2026-11-10-stage1-english-cleanup-design.md` 和 `docs/superpowers/plans/2026-11-10-stage1-english-cleanup.md`。
- 修复入口新增 journal 与 `.committed` 标记的事务前冲突检查；已有标记时在数据库变更前拒绝，避免提交后脚本报错造成状态不清。
- 独立 PostgreSQL 批次测试通过：21 条批次修复、人工简介保留、共享媒体拒绝、journal 冲突、提交标记冲突、回滚冲突和重复回滚均通过。
- 独立 PostgreSQL 只读预览测试通过：并发修改被拒绝，媒体外键冲突被识别，预览不改变数据，条件回滚可恢复。
- 独立 Payload 3.93 + PostgreSQL 回读测试通过：英文名称和 alt 修复、中文名称/简介保持不变、人工英文简介保持不变；测试连接池已显式释放并自然退出。
- 上述证据均为一次性隔离环境，生产数据库未写入，生产部署未执行。阶段 1 仍为 `PARTIAL / WAITING-EXTERNAL`。

## 阶段 1 素材覆盖与本地浏览器补验

- 按业主允许的图像生成策略生成 5 张无文字、无品牌、无包装的英文场景示意图：温室、果园、大田、灌溉施肥、草坪；文件位于 `public/images/illustrative/`，来源和使用边界见 `docs/illustrative-generated-images-2026-11-10.md`。
- 新增英文专用 `englishSolutionImages` 映射；中文及其他语言继续使用原有来源映射，真实产品包装和产品主图不使用生成素材替代。
- 英文兴趣区生成场景保留 `AI-generated image` 标识；玉米、麦田、草莓继续使用已记录许可的第三方真实图片。
- 补齐 `open-field`、`fertigation` 两个种植方式的原有非英语媒体映射，并增加全量方案媒体覆盖测试。
- 本地开发实例 `:3123` 的 13 locale 首页和方案路由合同 4/4 通过；Playwright fast scope 浏览器矩阵 24/24 通过，覆盖 en/zh/he、390×844/1280×720、图片加载、console、lang/dir 和根宽度。
- 本轮仍未执行生产 Payload 写入、生产部署或公网视觉回读；阶段 1 状态更新为 `PARTIAL`，等待素材覆盖人工确认和后续生产授权。

## 阶段 2 Header 滚动收起（本地 PASS-SCOPED）

- 新增 `SiteHeaderScroll` 客户端包装器：SSR 初始状态保持 expanded，滚动超过 24px 后通过 passive listener + `requestAnimationFrame` 设置 `header--scrolled`，回到顶部恢复 expanded。
- 桌面和移动端分别缩小中央 KOMU 品牌标签的尺寸与阴影；不改变导航、语言菜单、移动菜单或 RTL 方向结构。
- 新增 `tests/header-scroll.spec.mjs`，覆盖英文 1280×720、英文 390×844、Hebrew RTL 390×844：初始状态、滚动 120px、回顶恢复、根/body 宽度和 console。
- 本地真实浏览器验收：3/3 通过；`typecheck` 和 `git diff --check` 通过。
- 生产 Header 状态仍未回读，阶段 2 当前为 `PASS-SCOPED`（本地），需在下一次授权发布后补生产浏览器验收。

## 阶段 3 公开边界只读准备

- 核对 `src/payload.config.ts`、`src/content/catalog.ts` 和 `src/data/catalog-product-groups.ts`：Products 没有 `published` 字段，公开展示依靠审核字段隐藏和 alias slug 排除；审核状态不等于公开状态。
- 本地 canonical/alias 关系和匿名字段隔离已有合同测试；新增只读审计记录在 `docs/official-candidate-public-boundary-audit-2026-11-10.md`。
- 公网 GET 证据显示当前生产仍包含旧中文候选名称/简介，且 alias 去重实现与当前工作区存在部署漂移；这不是生产失败，而是未发布工作区变更的明确证据。
- 阶段 3 已收到业主公开展示授权，状态转为 `IMPLEMENTATION-PENDING`；仍需执行隔离复验、生产备份、精确写入、发布和回读。

### 阶段 3 可重复公网审计补充

- 新增 `npm run audit:official-candidate-public-boundary`，观察模式不假设候选必须公开；`EXPECT_PUBLIC_CANDIDATES=1` 时才启用公开放行门禁。
- 2026-11-10 生产观察模式结果：21/21 候选详情 HTTP 200，审核字段未泄漏；21/21 仍含历史中文名称/简介模板，状态为 `PARTIAL`，证明阶段 1 生产英文修复尚未部署。

## 阶段 4 多语言草稿范围验收

- `check:locale`、`validate:content`、`validate:crop-guides` 和新增注册的 `validate:homepage-staging` 均通过；首页、内容和作物指南草稿覆盖 13 locale，`missingLocales=[]`。
- UI authored locale、内容 locale、组件 locale、新闻/知识/案例、作物指南和 Hebrew RTL 边界测试共 15/15 通过。
- 本地草稿保留来源、数字、单位、审核状态和 RTL 数据边界；这些证据只证明草稿和隔离契约，不证明母语、法律或农艺人工审校完成。
- 阶段 4 已按业主授权切换为 `PASS-SCOPED`：Codex 自检、逐 locale 旧值保护回填和生产读回均完成；专业母语/法律/农艺签核保留为可选后续维护。
- 业主确认不接入自动翻译服务，继续使用 Codex 草稿并由 Codex 自检；完整 `dry-run:flbook` 和生产精确回填均通过，覆盖 13 locale、10 产品、9 条内容、3 条作物指南、FAQ、首页和公司资料。
- 新增 [13 语言人工审校包](translation-review-packet-2026-11-10.md)，明确语言批次、产品/农艺/法律/RTL 检查项、签核字段和旧值保护回填闸门；当前仍不写入生产。
- 批次 A（`es/fr/pt/ru` 产品、公司、Contact、FAQ）结构测试 12/12 通过；随后完整 `dry-run:flbook` 通过并清理临时库，批次状态保持 `WAITING-SIGNOFF`。

## 阶段 5 产品资料与素材权利审计

- `validate:flbook` 通过：10 条 FLBOOK 产品草稿保持 `approved`，来源仍为业主提供的 FLBOOK，未新增产品事实。
- `check:p2-release` 通过：10 条正式产品、76 条规格、10 条 claims verified，无 blocker；唯一 warning 是未有人工译文时使用英语源回退。
- 复合肥料缺少可靠定量规格来源，继续保持无定量表，不引用行业资料或相邻产品数值补齐。
- 生产公网媒体审计本轮两次超时（本地 3118 未启动；生产域名单请求超时），记为 `NOT-RUN/UNKNOWN`；既有历史媒体审计证据不替代本轮生成素材和 Header 改动后的生产回读。
- 阶段 5 当前为 `PASS-SCOPED / PARTIAL`：FLBOOK、生成图、Commons 图和公网媒体边界已验证；仍需逐产品确认官方候选图片授权、规格来源、claims 和最终业务资料。

2026-11-10 补充：新增 `docs/media-rights-inventory-2026-11-10.md`。生成图、Commons 图、FLBOOK 图和原官网图已分层记录；公网媒体审计为 14 个英中页面、22–23 个媒体 URL、0 HTTP 错误、0 generated/prototype 引用、0 序列化 alt，个别 body 读取存在瞬时 timeout warning，脚本已改为可审计记录而不中止。官方候选图片的长期商业授权仍保持 `WAITING-EXTERNAL`，因此阶段 5 更新为 `PASS-SCOPED / PARTIAL`。

## 阶段 6–7 询盘与运维只读/隔离验证

- 联合备份测试 2/2 通过，覆盖成功状态文件、媒体 manifest、失败非零退出和不泄漏数据库 URL；RTL CSS 合同 1/1 通过。
- `check:deployment:files` 和 `check:production-env:example` 通过，部署文件、PostgreSQL、媒体卷、迁移和生产配置形状可被门禁识别。
- 这些结果只证明本地脚本和配置契约；没有配置 SMTP/CRM、生产备份排程、告警、RPO/RTO、异地加密或 systemd 回滚。
- 阶段 6 当前为 `PASS-SCOPED`：人工 Payload 处理、不接通知、不配置自动删除/限流和不承诺 SLA 已按业主决定固定，并通过生产匿名读取边界检查。
- 阶段 7 当前为 `PASS-SCOPED`：业主明确 O2–O5 暂不实施，现有脚本与一次性恢复证据构成当前交付边界；未来重新授权时再进入后续运维阶段。

## 当前工作区综合快验收

- 当前工作区本地实例 `:3123` 上，阶段 1/2 相关 Playwright fast scope、关键交互和 Header 滚动测试共 5/5 通过。
- 该结果覆盖本地 sample 内容、13 locale 代表页面、390×844/1280×720、Header 状态、图片加载、console、RTL 和根/body 宽度；不代表生产部署或正式内容通过。
- 阶段 8 已完成当前技术生产收口子集；综合状态保持 `PASS-SCOPED / PARTIAL`，剩余官方候选资料权利、询盘治理参数和运维连续性证据。

## 阶段 3 生产实施与发布回读（2026-11-10）

- 业主确认 21 条候选作为正常资产公开展示；候选字段继续保持 `owner-review / claimsVerified=false`，后台可维护图片、英文说明和本地化字段。
- 生产 PostgreSQL dump 与媒体 manifest 已完成，备份目录为服务器 `.local/backups/candidate-stage3-20261110T120548Z/`；dump 179970 bytes，媒体 104 文件、65865625 bytes。
- 生产精确修复事务提交成功：21/21 候选名称和英文媒体 alt 变化完成，人工简介按旧值保护保留；journal 与 `.committed` 标记已写入备份目录。
- 生产管理员审计：31 条产品、10 条 FLBOOK、21 条 official candidates、`missingCount=0`；候选仍为 `owner-review / claimsVerified=false`。
- 两次 standalone 发布均通过 readiness/health；第二次加入 Header hydration ready 标记后，生产 Header 3/3 通过。
- 发布后 `audit:official-candidate-public-boundary` 设置 `EXPECT_PUBLIC_CANDIDATES=1`：21/21 详情 HTTP 200、候选公开、旧中文英文模板为 0、审核字段泄漏为 0。
- 发布后 `audit:public-baseline`：13/13 locale、匿名产品 API 403、robots/sitemap、静态资源和媒体抽样全部通过，warnings/errors 均为空。
- 生产 Playwright fast scope：浏览器矩阵、关键交互和 Header 滚动共 5/5 通过；英文首页和 `/en/solutions/{fertigation,greenhouse,turf}` 已回读生成场景 WebP 及 `AI-generated image` 标识。
- 发布后 `PREVIEW_URL=https://www.kowloonglobaltrading.com npm run audit:public-media`：14 个中英文页面、22 个媒体 URL、0 个错误图片、0 个 generated/prototype 公网引用、0 个序列化 alt；一个媒体请求首次超时，随后定向 60 秒回读 200（85,521 bytes）。重复 hash 仅为同一 `company-products.jpg` 的 API/静态路径复用。

## 阶段 8 技术子集回归（当前生产）

- `PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke`：23/23 通过；候选公开后搜索数量契约已更新为至少 18 条，避免把旧的 9 条历史断言当成当前产品状态。
- `PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:seo`：5/5 通过，包含 canonical/hreflang、index/follow、公开审核字段隔离、图片 alt 和询盘接口合同。
- 这些结果完成技术发布子集，但阶段 8 仍不能整体通过：专业翻译、询盘治理参数、运维连续性参数和完整人工内容审校仍未收口。
- 后续一次 SEO 全量运行中审核字段测试遭遇公网 `ECONNRESET`，单独重跑该测试 1/1 通过；因此网络波动不被记录为业务断言失败。

## 当前生产公网基线复核

- 2026-11-10 重新运行 `PUBLIC_BASE_URL=https://www.kowloonglobaltrading.com npm run audit:public-baseline`：12/13 locale 页面和抽样静态资源返回，`/ru` 在本轮请求超时；`company-laboratory.jpg`、`hero-03.jpg` 抽样媒体也出现超时，因此本轮整体不记 `PASS`。
- 随后对超时项逐个以 60 秒超时重试：`/ru` 返回 200（约 3.5 秒）、`company-laboratory.jpg` 返回 200（约 19 秒）、`hero-03.jpg` 返回 200（约 42 秒）。这说明资源可达但响应存在明显波动；不能扩大为稳定性或完整媒体矩阵通过。

## 阶段 4 生产证据补充（2026-11-10）

- 业主已授权 Codex 全量翻译、自检和生产推进，不再等待外部人工审校或新增翻译 API。
- 只读计划：11 个外文 locale，2,387 fills，0 conflicts，0 missing；生产写入 396 个 Payload 文档/全局更新。
- 生产读回：2,387 unchanged，0 conflicts，0 missing；公网 44 路由、smoke 23/23、SEO 5/5、RTL CSS 合同通过。
- 范围限制：翻译内容为 Codex 自检稿，不代表专业母语、法律或农艺认证；后续后台可逐字段维护，非空值不会被脚本覆盖。

## 阶段 8 HTTP/SSR 矩阵复核（2026-11-10）

- `scripts/accept-production-http-matrix.mjs` 增加页面 body 超时保护和并发 worker，避免单个公网连接长期挂起整轮只读审计。
- 生产矩阵覆盖 13 locale、54 条固定/动态路由模板，共 702 个 HTTP/SSR 检查；首轮 695/702 通过，7 条为 `AbortError` 瞬时超时。
- 对 7 条失败路径逐一以 60 秒超时重试，全部 HTTP 200，语言属性正确；目标重试证据见 `output/acceptance/2026-11-10-post-translation-g2-r4/targeted-retry.json`。
- 因此本轮矩阵范围结论为 `PASS-SCOPED 702/702`；公网响应慢仍记录为运维稳定性观察项，不扩大为性能或 SLA 通过。
- 当前公网证据记为 `PASS-SCOPED / UNKNOWN`：语言与资源边界大体可用，但慢请求需要运维监控、超时阈值和发布后重复观测。
