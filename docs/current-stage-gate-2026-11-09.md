# 当前阶段闸门审计（2026-11-09）

本报告按真实生产、真实浏览器、HTTP/API、数据库/媒体证据区分已通过范围和外部未放行事项。它不把保护态站点宣称为正式上线完成。

| 阶段 | 当前状态 | 已验证证据 | 仍需完成 |
| --- | --- | --- | --- |
| P0 生产与公开边界 | PASS-SCOPED | 生产 PostgreSQL、`/api/ready`、匿名产品 API 403、公开 HTML 不泄漏审核字段、静态资源和媒体回读 | 持续运维备份与安全审计 |
| P1 后台与恢复 | PASS-SCOPED | 管理员 users=1、Payload 编辑回读、媒体替换、联合 PostgreSQL/media 备份、systemd 重启回读 | 日常备份计划和恢复演练持续执行 |
| P2 正式内容与媒体 | PASS-SCOPED（FLBOOK）/ PARTIAL（官方候选） | 10 条 FLBOOK 产品已按业主授权回读 `approved` / `claimsVerified=true`；76 条规格、官方图片、About/Contact、14 页面媒体审计；21 条官方候选独立保留 `owner-review` | 复合肥料仍缺可靠定量表；21 条候选的型号/销售状态/claims 及 3 组同名冲突待确认；非英语 CMS 字段仍需人工翻译审校，缺译时当前已回退英语 |
| P3 13 语言/询盘/SEO | PASS-SCOPED | 共享 Payload 初始化与英语源回退已部署；冷启动 `/en/sds-request`、`/en` 均 `200`，readiness 数据库/媒体通过；公网 smoke 23/23、SEO 5/5；真实移动 Contact 表单写入 Payload；13 语言 URL 与 SEO 合同通过；390px Hebrew RTL 浏览器检查无溢出、无已加载失败图片、无控制台错误 | SMTP/API 邮件通知仍未配置，询盘只确认写入后台，不代表邮件送达；完整 13 语言真实浏览器与长译文人工审校仍属后续内容质量工作 |

## 当前保护状态

- 公开语言：13 个配置语言均已进入生产 URL，默认英语；共享 Payload 初始化与英语源回退已部署并完成冷启动回读；英语源回退不等于本地化翻译完成。
- 询盘：已启用，生产表单写入 Payload `inquiries`；邮件/SMTP 通知未配置，不能声称邮件送达。
- SEO：已解除 noindex；robots 允许抓取，页面 `index, follow`，sitemap 与 alternate 已生成。
- 产品：10 条 FLBOOK 产品为 `approved` / `claimsVerified=true`；21 条官方候选为 `official-candidate` / `owner-review` / `claimsVerified=false`。
- 官方候选：原官网 28 条候选审核包保留 3 组同名冲突；其中 7 条与已审核 FLBOOK 记录按来源 ID 合并展示，21 条新增记录已发布为独立候选卡。

## 证据入口

- [上线验收矩阵](launch-acceptance-matrix.md)
- [官方来源媒体审计](official-source-asset-audit-2026-11-09.md)
- [官方候选产品审核包](official-site-candidate-review-packet-2026-11-09.md)
- [P2 正式内容审核包](p2-content-review-packet-2026-11-09.md)
- [交互验收记录](interaction-acceptance.md)

2026-11-09 最终回读：共享 Payload Promise 与英语源回退版本已部署；部署前 PostgreSQL 与媒体备份分别保存在服务器 `/home/ubuntu/backups/haifa-2026-11-09-p3/`；构建与 standalone 静态资源复制通过；服务重启后 readiness、资源页和首页均通过。冷启动重启期间旧 Node 进程优雅退出超时，期间公网曾短暂返回 502；systemd 随后强制结束旧进程并成功启动新版本，后续连续 smoke/SEO 和 readiness 均通过。产品审计 31 条（10 FLBOOK 已批准、21 官方候选保持 owner-review），媒体审计 14 页面/21 唯一媒体/0 哈希重复/0 generated-prototype 引用。

当前结论：13 语言路由、SEO 放行、询盘写入链路和产品/媒体边界已完成当前部署范围验收。邮件通知未配置；不得把后台写入描述为邮件送达。完整 13 语言真实浏览器与长译文人工审校仍应单独跟踪，不影响已授权语言路由发布的事实。
