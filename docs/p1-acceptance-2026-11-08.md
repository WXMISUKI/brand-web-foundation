# P1 后台与备份恢复阶段验收

> 2026-11-08 阶段快照。当前生产状态以 `docs/current-stage-gate-2026-11-09.md` 为准。

日期：2026-11-08

状态：**PASS-SCOPED**。联合恢复、管理员初始化、后台编辑回读、媒体替换回读和重启持久化回读均已通过；P2 正式内容与产品模型仍需单独验收。

## 已通过

- 使用 P0 PostgreSQL custom dump 恢复到隔离数据库 `haifa_reference_p1_restore`。
- 隔离数据库计数与生产快照一致：`media=23`、`products=10`、`news=3`、`insights=3`、`cases=3`、`crop_guides=3`、`faqs=6`、`inquiries=0`。
- 使用 P0 media manifest 恢复到独立媒体目录，69 files、61290012 bytes、SHA-256 校验通过。
- 恢复过程中发现备份目录父路径对 `postgres` 不可穿越；改为临时复制到 `/tmp` 后恢复，生产数据库未被触碰。
- 隔离数据库、恢复媒体目录和临时 dump 已清理。
- 生产 `users` 数量已从 0 变为 1，`/admin/login` HTTP 200；密码未进入聊天、仓库或 agent 输出。
- 第一次后台编辑发现 Products 自动 endpoint 关闭会阻断认证 PATCH；该次保存未成功，随后改为“认证用户可读写、匿名拒绝、server-only Local API overrideAccess”边界，待重新部署后复验。
- 修复部署后，产品后台 PATCH 已通过：临时 `P1-ADMIN-CHECK` 在公开英文产品详情可回读，随后已恢复原文；匿名 `/api/products` 仍返回 403。
- FAQ 后台 PATCH 已通过：`PATCH /api/faqs/6` 出现在生产访问日志，临时 `P1-FAQ-CHECK` 可在数据库和 `/en/faq` 回读，随后已恢复原文。
- 新闻富文本后台 PATCH 已通过：临时 `P1-RICH-CHECK` 在新闻详情页可回读，随后数据库和公开页均恢复干净。
- 产品媒体关系已通过：产品图片临时替换为 `greenhouse-growing-3.png` 后公开详情 URL 变化，随后恢复 `organic-inorganic-compound-draft-2.webp`；数据库 `products.image_id=10` 与生产媒体记录一致。
- 重启持久化已通过：`systemctl restart haifa-reference.service` 后 `/api/health`、`/api/ready` 正常，产品/FAQ/新闻原文和媒体 URL 均保持恢复状态。
- 部署 smoke 回归为 23/23 通过。

## 已完成硬门禁

1. 已使用刚创建的管理员真实登录 `/admin/login`。
2. 已修改一条产品、一条 FAQ 和一篇新闻富文本，并完成前台回读与原文恢复。
3. 已替换一张产品媒体关系，确认前台 URL 变化并恢复原图。
4. 已重启 systemd，并确认数据库、媒体和富文本持久化。
5. P1 已标记 PASS-SCOPED；P2 正式内容与产品模型验收已开始。

## 运行方式

```bash
read -r -s BOOTSTRAP_PASSWORD
export BOOTSTRAP_CONFIRM=YES
export BOOTSTRAP_EMAIL=owner@example.com
npm run bootstrap:admin
unset BOOTSTRAP_CONFIRM BOOTSTRAP_EMAIL BOOTSTRAP_PASSWORD
```

管理员密码不应发送给 agent 或写入仓库。P1 通过后，后续阶段仍需遵守 noindex、询盘关闭和来源字段不公开的边界。
