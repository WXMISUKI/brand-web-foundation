# 语言发布矩阵

更新时间：2026-11-09

业主已批准 13 个配置语言进入生产公开边界，默认英语。CMS 缺少人工译文的字段使用英语源回退；不能把英语源回退误报为人工翻译完成。

| 语言 | 当前状态 | 内容状态 | 生产索引 | 询盘 | 证据 |
| --- | --- | --- | --- | --- | --- |
| en | public | production | index, follow | enabled | 生产 smoke/SEO、真实页面、询盘提交 |
| zh | public | production | index, follow | enabled | 生产 smoke/SEO、真实页面、中文回读 |
| he / nl / fr / it / es / pt / el / ro / ru / th / tr | public | production + English fallback where needed | index, follow | enabled | 13 URL HTTP/lang/robots 回读、alternate、RTL 截图 |

代码门禁：`npm run check:locale` 校验 13 个配置语言全部为 public、`noindex=false`、`inquiryEnabled=true`，并覆盖 `src/i18n/release-readiness.ts`。

正式收口仍需补做共享 Payload 版本的冷启动和英语源回退回读；SMTP/邮件通知尚未配置，询盘“已记录”不等于“邮件已送达”。
