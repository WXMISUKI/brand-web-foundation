# P0 生产数据与公开边界阶段验收

日期：2026-11-08

状态：**PASS-SCOPED**。P0 已通过，允许进入 P1；不代表整站正式上线完成。

## 阶段目标

- 修复生产 `company-profile.focusAreas` 英中缺失。
- 解析生产媒体 JSON alt，前台输出当前语言纯文本。
- 去除公开页面中的 `Information unavailable`、可见 `PREVIEW` 和 `await review`。
- 关闭匿名 Payload Products CRUD，避免公开 provenance/audit 字段。
- 固化 standalone 静态资源复制并完成 systemd 重启回读。
- 用真实生产 API、浏览器和 smoke 证据验收。

## 保护与变更

- 生产 PostgreSQL custom dump：`/home/ubuntu/haifa-reference-backups/p0-before-content-fix/haifa_reference.dump`，169885 bytes。
- 生产媒体备份：`/home/ubuntu/haifa-reference-backups/p0-before-content-fix/media`，69 files、61290012 bytes，包含 SHA-256 manifest。
- 只补写 3 个缺失的英文 focusAreas；已有中文字段未覆盖。
- Products collection 仅允许认证用户读写；前台通过 server-only Local API `overrideAccess:true` 读取，afterRead 仍移除匿名内部审计字段。
- 保留 `sourcePages`、`sourcePreviewPath`、`sourceDetailPreviewPath` 供买家页面显示；匿名接口不再提供 Products 原始文档。
- 未导入产品、未修改规格/claims、未启用询盘、未解除 noindex。

## 验收证据

- `systemctl is-active haifa-reference.service`：`active`
- `systemctl is-enabled haifa-reference.service`：`enabled`
- standalone `.next/static`：87 files
- standalone `public`：44 files
- favicon：存在且公网 HTTP 200
- `/api/health`：`ok:true`、PostgreSQL、Payload catalog、媒体已配置
- `/api/ready`：database/media 均为 true
- 匿名 `/api/products`：认证拒绝（401/403），后台认证 PATCH 保持可用
- `company-profile` 英文 focusAreas：Plant nutrition / Product quality / Grower support
- `company-profile` 中文 focusAreas：植物营养 / 产品品质 / 种植支持
- 首页：JSON alt 0、Information unavailable 0、可见 `GROWER STORIES · PREVIEW` 0、`await review` 0
- 产品详情：HTTP 200、Source pages/preview 可见、Related brochure pages 不可见、图片无 broken image
- Playwright 390×844：根 scrollWidth == clientWidth、无 broken image、console 0 errors/warnings
- Playwright 1440×900：根 scrollWidth == clientWidth、无 broken image、console 0 errors/warnings
- 正确公网 `PREVIEW_URL` 下 `npm run test:smoke`：23/23

## 阶段失败与修复记录

第一次验收记录为 `P0-API-BOUNDARY-FAIL-2026-11-08`：Payload 数组字段级 read access 仍使匿名 REST 返回 `sourceRelatedPages` 字段。经过架构、内容、QA/运维重新分析后，改为关闭 Products 自动 endpoints，并新增匿名接口回归；修复后重新构建、重启和复验通过。

## 尚未完成的后续阶段

- P1：生产管理员初始化、后台编辑回读、PostgreSQL 与媒体联合恢复演练。
- P2：正式产品规格、包装、多图、claims、新闻/案例/作物指南及正式译文。
- P3：询盘收件策略、canonical、robots、sitemap、正式语言发布和 noindex 决策。
- FLBOOK 当前直连仍返回 404，需要业主重新确认来源或提供原始资料副本。
