# P3 外部上线决策包

日期：2026-11-09  
当前状态：**CONDITIONAL**

技术实现、生产部署、后台维护、备份恢复、真实浏览器、SEO 合同和公开 API 边界已有对应证据。以下四项仍需要项目方/业主做最终决定；未确认时系统保持保护态，不会自动放行。

## 1. 正式产品内容

请确认：

- 10 条首期产品名称、型号和停用状态。
- 76 条来源规格的单位、最小值、最大值和典型值。
- 包装、多图、证书和素材授权。
- claims、用途、说明和最终英中译文。
- 第 22 页有机无机复混肥料是否有可靠定量表；没有则保持无规格。

当前证据：`npm run audit:production-products` 返回 10 条、`missingCount=0`；`npm run check:p2-release` 返回 `ready:false`，10 条仍是 `owner-review`、0 条 `claimsVerified`。

确认后的动作：逐条在 Payload 后台更新并回读，必要时将对应记录从 `owner-review` 提升为 `approved`，再重跑前台、数据库和 smoke 验收。

未确认时：继续显示来源页和规格，保留审核提示，claims 不标记为已核验。

## 2. 正式语言

请确认：

- 首期是否继续只公开 `en` / `zh`。
- 是否提供其他 11 种语言的正式译文和术语表。
- 每种语言的业务内容、RTL 页面和 SEO counterpart 是否由谁审核。

当前状态：13 个语言代码已配置；生产只公开 `en` / `zh`，其他语言为 CMS_EVAL 预览，全部 noindex。

确认后的动作：逐语言完成翻译、真实桌面/移动/RTL 回归、alternate、canonical、sitemap 和 SEO 合同，再调整 `publicLocales`。

未确认时：其他语言不进入公开菜单、sitemap 或 alternate。

## 3. 询盘与隐私

请确认：

- 收件邮箱或工单系统。
- 处理人和状态流转责任人。
- 表单字段、隐私版本、同意文本和数据保留期限。
- 反垃圾策略、蜜罐处理和通知回执测试方式。
- 是否继续只使用邮箱和 WhatsApp 外部渠道。

当前状态：`INQUIRY_MODE=disabled`；匿名 `POST /api/inquiries` 返回 `503 inquiry_disabled`；Contact 页面已说明站内不收集询盘。

确认后的动作：先在隔离环境完成正常提交、蜜罐拒绝、管理员状态流转、通知回执和恢复演练，再安排生产启用。

未确认时：不启用站内表单，不声称邮件已送达，不创建询盘记录。

## 4. SEO 与 noindex

请确认：

- 正式产品内容和正式语言是否已冻结。
- 是否允许解除 `noindex`。
- 解除时间、授权人和回滚窗口。

当前状态：robots 禁止抓取、页面 noindex、sitemap/canonical/alternate 已部署并通过 4/4 SEO 合同。

确认后的动作：在正式语言和产品内容冻结后复核 robots、sitemap、canonical、alternate、HTTPS 和回滚，再单独提交 noindex 变更。

未确认时：保持 noindex 和预发布 robots 保护，不解除搜索引擎屏蔽。

## 回复格式

项目方可以按下面格式回复，系统将据此进入下一阶段：

```text
产品内容：通过 / 需要修改（列出 slug）
正式语言：只公开 en/zh / 扩大到 ______
询盘：继续外部邮箱+WhatsApp / 启用站内询盘（收件与隐私资料见附件）
SEO：继续 noindex / 允许解除 noindex（授权人和时间）
```
