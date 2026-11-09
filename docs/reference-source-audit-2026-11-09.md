# 参考链接、资料映射与阶段门禁审计

日期：2026-11-09  
范围：KOMU/安徽康母参考站 `https://www.kowloonglobaltrading.com` 生产站、业主提供的 FLBOOK 浏览链接、Haifa 公开网页参考站。

## 资料口径

本轮产品事实只来自业主提供的 FLBOOK 浏览链接：

`https://flbook.com.cn/c/LTc82gQQM3`

本轮没有使用 PDF 作为产品资料来源。FLBOOK 通过浏览器等待加载后按页读取，并保留来源 URL、页码、跨页预览、单页裁剪、审核状态和素材状态。Haifa 公开网页只用于学习页面层级、导航、交互和响应式结构，不能把 Haifa 的品牌、配方、认证、施用量、案例结果或下载资料写成 KOMU 事实。

2026-11-09 通过公网逐一回读交接表中的 FLBOOK 与 16 个 Haifa 参考地址，结果全部 HTTP 200。这个结果只证明来源链接当前可达，不证明本地页面已经完成同等内容或交互。

## 来源到前台页面映射

| 来源 | 当前前台承接 | 状态 | 结论与缺口 |
| --- | --- | --- | --- |
| FLBOOK 产品页 6–23 | `/{locale}/products/{slug}` | PASS-SCOPED | 10 条产品已接入；9 个产品有 76 条页级规格，复合肥料因来源页缺少可靠定量表继续为空；全部保持 `owner-review` / `claimsVerified=false`。 |
| FLBOOK 页级图片和裁剪 | 产品详情来源预览、后台媒体关系 | PASS-SCOPED | 页面显示买家可理解的画册页码和来源预览；`excluded-candidate` 等内部审计字段不暴露给买家。 |
| Haifa 首页 `/` | `/{locale}` | PASS-SCOPED（结构） | Hero、兴趣切换、产品、企业、新闻、案例和快捷入口已有；参考站视频、正式企业素材和完整视觉细节仍未完全对齐。 |
| Haifa 产品目录 `/products-catalog` | `/{locale}/products` | PASS-SCOPED（主链路） | 分类、搜索、分页、语言切换和详情链接可用；参考站的独立产品系列介绍、型号列和系列下载尚未形成独立本地路由。 |
| Haifa 产品类型 `/products-type/plant-nutrition` | `/{locale}/products` | PARTIAL | 当前用分类和关键词筛选承接；参考站产品类型层级、筛选状态和分页仍需逐项视觉对照。 |
| Haifa 系列页 `/multi-k-potassium-nitrate-fertilizers-formula` | `/{locale}/products/series/{slug}` | PASS-SCOPED（轻量结构） | 已补齐系列索引/详情路由并复用现有产品分类；系列级长文案、型号对照和下载仍未接入。 |
| Haifa 单品 `/multi-k-gg` | `/{locale}/products/{slug}` | PARTIAL | 详情骨架、参数表、相关产品和询盘预览存在；多型号对照、正式包装、多图和真实资料仍待确认。 |
| Haifa 种植方式 `/nurseries` | `/{locale}/solutions` + `/{locale}/solutions/{slug}` | PASS-SCOPED（轻量结构） | 已补齐种植方式索引并复用现有方法数据；完整筛选、作物关系和农艺推荐仍未接入。 |
| Haifa 作物指南 `/crop-guide/vegetables/tomato` | `/{locale}/solutions/{slug}` | PARTIAL | 有章节结构和产品入口；当前是通用示例，尚未接入业主确认的作物、生长阶段和产品关系。 |
| Haifa 智慧农业 `/articles/online-expert` | `/{locale}/smart-farming` | PARTIAL | 页面结构已承接；真实工具、应用下载和推荐服务未接入。 |
| Haifa 企业页 `/about-us-0` | `/{locale}/about` | PASS-SCOPED（结构/数据） | 公司名、重点、历程和缺失信息回退已接入；完整企业事实和正式时间线仍需业主确认。 |
| Haifa FAQ `/faq` | `/{locale}/faq` | PASS-SCOPED（交互） | 分类切换、展开/收起、搜索和双语路径已验证；业务问答仍需正式内容审核。 |
| Haifa 新闻 `/news-events` | `/{locale}/news` | PASS-SCOPED（结构） | News/Events 筛选、搜索、详情和双语链接已验证；正式新闻事实和分页素材仍需审核。 |
| Haifa 联系 `/contact-us-1` | `/{locale}/contact` | PASS-SCOPED（保护态） | 邮箱、WhatsApp 和隐私边界说明已上线；站内询盘保持关闭，未声称邮件已送达。 |
| Haifa SDS `/products/sds-request` | `/{locale}/sds-request` | PROTECTED | 表单和上传保持 disabled；未配置接收人、文件处理、隐私和反垃圾流程。 |
| Haifa 质量 `/quality-assurance` | `/{locale}/quality-assurance` | PROTECTED | 只保留结构和待确认状态；没有虚构证书、检测或质量声明。 |
| Haifa 可持续 `/precision-impact/strategy` | `/{locale}/sustainability` | PARTIAL | 英文/中文结构可访问；正式专题内容、图片、多级菜单和其他语言译文未完成。 |

## 产品资料核对结果

- staging 与生产都保留 10 条产品；生产新增 76 条来源规格，生产总规格行数为 78（其中两个悬浮肥料已有历史公式行）。
- 9 个产品已有可读页级参数；复合肥料对应页没有可靠定量表，因此没有推测补数。
- 已修正第 8、9 页两个有机水溶肥料英文标题重复的问题：分别使用 `Growth, leaf quality and rooting` 与 `Growth, foliage and rooting`；中文标题、页码、规格和审核状态未改变。生产按 slug + `en` 精确更新，备份后回读通过。
- `validate:flbook` 已增加中英文目录标题唯一性门禁，避免后续准备导入时再次产生相同显示名。
- 生产英中简介对账发现 3 条差异：复合肥料英文的“配方与宣称按需提供”属于更谨慎的人工文案，保留；第 10 页英文简介的“specifications await review”与已展示的来源规格矛盾，已在备份 `payload-2026-11-08T19-38-19-391Z.dump` 后按精确旧值 guard 修正；第 6–7 页中文简介的语病字已一并修正。生产详情回读、smoke 23/23、SEO 4/4 通过。
- 规格、简介、来源预览和媒体关系均通过隔离 SQLite dry-run 与生产英中详情回读；当前只能证明“来源与页面映射正确”，不能证明“正式 claims 已获业主批准”。
- 2026-11-09 生产管理员视图对账确认 10 条产品的来源页、规格、双语 counterpart、`owner-review`、`claimsVerified=false` 和素材状态均完整；公开 REST/前台继续通过 `afterRead` 隐藏内部审核元数据。
- 包装、场景图和多图仍需区分业主提供、画册裁剪、生成示例和待补素材，不能在前台写成真实销售案例或认证事实。

## 交互和响应式风险矩阵

已有证据覆盖桌面 1440×900、1280×720、1051×720、1060×720，以及移动 768×844、390×844、320×720；生产 smoke 23/23、SEO 4/4、RTL CSS 合同和 7 个 CMS_EVAL 预览切片均通过。

| 风险 | 当前证据 | 仍需做什么 |
| --- | --- | --- |
| 根横向溢出 | 390/320 生产 Chromium 与页面矩阵未发现根横向溢出 | 真实 iOS Safari、Android Chrome 和长译文仍需补查。 |
| 参数表挤压 | 规格表包在独立 `.table-scroll` 内，390px 已验证 | 继续检查最长单位、阿拉伯语/希伯来语和异常长产品名。 |
| Header/下拉遮挡 | 390px 移动菜单 Escape/Tab 关闭并回焦点，1280px Products Enter/Escape 与面板几何已在生产 Playwright 验证；Hebrew Products 面板已右锚定 | 仍需补充真实 iOS/Android、鼠标移入/移出保持和完整断点截图。 |
| 底部快捷栏遮挡 | 390px 截图未发现与菜单互相覆盖 | 长详情页、表格横滚时的固定栏与最后一个按钮仍需真实设备复查。 |
| 图片比例与空状态 | alt、favicon、媒体 URL 和空地址/里程碑回退已修复 | 正式素材替换后需按原图尺寸重新检查裁切、加载失败和重复图。 |
| 语言 fallback | 13 语言 release-readiness、RTL CSS 和预览切片通过 | 只有 en/zh 是生产内容；其他 11 种语言不能提前公开或从语言菜单链接出去。 |
| 表单与隐私 | 询盘 API 503、SDS/联系表单 disabled，Contact 已说明外部渠道 | 未确认收件邮箱、隐私告知、反垃圾、处理人和通知链路前不得启用。 |

## 多角色判断

### 项目经理

当前项目已经从“原型开发”进入“发布前收口”。下一步不应继续无边界增加页面，而应先冻结 P2 正式内容和 P3 发布门禁。每个阶段必须有明确的输入、产物、验收证据和失败后的重开动作；任何 `CONDITIONAL` 或 `WAITING-EXTERNAL` 都不能改写成完成。

### 架构师

当前四层结构保持正确：参考观察层、共享 UI 层、Payload 内容层、页面适配层。后续不应把产品事实重新写回组件，也不应为假想的 Haifa 系列直接复制品牌内容。系列页、种植方式索引和型号对照只有在 KOMU 业务确认后才新增领域模型；否则继续保持显式的 partial/gap 状态。

### 前端与交互工程师

主链路已经可用，但最容易产生误判的是“路由 200”和“视觉/状态通过”之间的差异。下一轮应优先做长文案、长表格、键盘、Esc、焦点返回、固定快捷栏、真实 iOS/Android 和图片比例回归，而不是继续扩充占位模块。

### 内容与 SEO 负责人

需要完成逐条参数、型号、单位、停产状态、claims、包装、证书和最终译文审核。正式翻译未完成前保持 en/zh 公开、其他语言预览；canonical、alternate、sitemap、robots、noindex 要在语言和内容冻结后一起复核。

### 运维与安全负责人

SSH、systemd、PostgreSQL、媒体 readiness、联合备份恢复和 standalone 静态资源门禁已有证据。部署时必须重复复制 `.next/static` 与 `public`，并做公网 200 回读；不能用重新导入生产数据库代替增量修复，也不能把管理员密码写入聊天或仓库。

## 阶段门禁

1. **P0–P2：PASS-SCOPED。** 代码、数据模型、生产部署、后台维护、备份恢复、FLBOOK 映射和公开安全边界已有对应证据。
2. **P3-A：正式内容冻结。** 完成 10 条产品逐条审核，特别是复合肥料定量表、型号、claims、包装、证书和最终英中译文；失败则回到 P2 内容修复，不进入发布决策。
3. **P3-B：参考交互收口。** 补齐独立系列页/种植方式索引是否需要的业务决策，并完成键盘、长文案、真实设备和图片比例回归；失败则重开交互验收，不解除 noindex。
4. **P3-C：询盘发布。** 明确收件邮箱/工单、隐私、反垃圾、处理人和通知测试；未完成前继续 `INQUIRY_MODE=disabled`。
5. **P3-D：SEO 与上线决策。** 只有正式语言、内容、询盘和回滚证据都通过后，才讨论解除 noindex；否则保持 robots disallow、sitemap 可回读和 noindex。

2026-11-09 方案 A 复验：系列索引/详情与种植方式索引已部署；生产 route contract、smoke 23/23、SEO 4/4、390/1280 Playwright 视口和 console 0 errors 通过。  

当前阶段结论：**P3 仍为 CONDITIONAL；P3-B 轻量结构与 iOS WebKit/Android Chrome 补验已 PASS-SCOPED，仍需 P3-A 正式内容冻结、询盘外部配置和 noindex 决策。**
