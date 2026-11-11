# P3 多语言、询盘与 SEO 发布前验收

> 2026-11-08 发布前快照。2026-11-09 后续授权已公开语言路由、启用询盘写入并解除 noindex；当前状态以 `docs/current-stage-gate-2026-11-09.md` 和 `docs/p3-release-decision-2026-11-09.md` 为准。

日期：2026-11-09（基于 2026-11-08 初始验收记录更新）

状态：**CONDITIONAL**。

## 已通过

- 生产公开语言边界仍为 `en` / `zh`；其他语言保持预览或 404，不伪装成正式翻译。
- 英文/中文页面的 `lang`、方向属性、语言 counterpart、noindex 均通过公网 smoke 和浏览器矩阵。
- `INQUIRY_MODE=disabled` 仍生效：匿名 `POST /api/inquiries` 被拒绝，联系页保持邮箱/WhatsApp 直达入口，不创建记录、不声称邮件已送达。
- 已新增并部署 `robots.txt`：发布前对所有爬虫 `disallow: /`，并指向 `sitemap.xml`。
- 已新增并部署 `sitemap.xml`：列出 en/zh 主要页面，当前仍配合 noindex 使用，不代表已允许搜索引擎收录。
- 已补充当前请求路径 canonical：Nginx 传递原始 URI，英文/中文首页、列表、详情和 About 页面抓取均返回对应 canonical URL。
- 已增加正式 `test:seo` 回归合同，生产域名 4/4 通过：robots/sitemap、canonical+noindex、图片 alt 和询盘关闭。
- `CMS_EVAL=1` 隔离服务上的 7 个多语言预览切片（About、Products、FAQ/Contact/Search、Editorial、Solutions、Home、Resources）均通过；`check:locale` 和 RTL CSS 合同也通过。生产公开语言仍仅 en/zh。
- 2026-11-09 在新增 76 条产品规格后重新运行 7 个 CMS_EVAL 预览切片：About、Products、Information、Editorial、Solutions、Home、Resources 全部通过；`check:locale` 与 `test:rtl-css` 仍通过。
- 2026-11-09 Contact 英文/中文页面补充“不通过站内表单收集询盘、邮箱和 WhatsApp 为外部渠道”的明确说明；`INQUIRY_MODE=disabled` 未改变，未创建数据或发送通知。
- 2026-11-09 生产公开 en/zh 页面补充 `alternate`（en、zh-CN、x-default）链接；产品详情与 About 路径回读正确，CMS preview 不生成公开 alternate；`test:seo` 4/4、smoke 23/23 通过。
- 2026-11-09 新增代码级 `localeReleaseReadiness`：`check:locale` 现在同时校验 13 个语言代码、public/preview 状态、所有语言 noindex 和询盘关闭，避免未完成译文被误加入生产边界。
- 2026-11-09 SEO 合同新增产品审核元数据公开边界：匿名 `/api/products` 必须为 403，产品 HTML 不得包含 `reviewStatus`、`assetStatus`、`claimsVerified`；生产 `test:seo` 现为 5/5。
- 公开页面抓取确认首页、新闻、知识、案例图片 alt 不再输出 JSON 对象；About 空里程碑与 Contact 空地址均使用联系式文案。

## 仍需完成

- 仍需在解除 noindex 前复核 canonical、alternate、robots、sitemap 与正式翻译的一致性。
- 询盘收件邮箱、隐私告知、反垃圾、处理人和端到端通知尚未确认，因此不能启用询盘。
- 13 种语言仍只有 en/zh 正式公开，其他语言需有正式译文和真实浏览器/RTL 验收后再扩大公开边界。
- 解除 noindex 前还需完成正式参数/claims/最终翻译审阅。

## 当前结论

P3 的发布前保护措施已实现，但 SEO canonical、询盘启用和正式语言发布仍是外部决策门禁；保持 noindex 和询盘关闭。
