# 上线验收矩阵

状态含义：`PASS-SCOPED` 表示仓库内对应范围已有证据；`WAITING-EXTERNAL` 表示必须依赖业主资料、目标服务器或正式凭据；`CONDITIONAL` 表示代码和隔离环境已准备，但仍缺真实环境验收。

| 验收域 | 当前状态 | 现有证据 | 上线前动作 | 负责人 |
| --- | --- | --- | --- | --- |
| 页面与路由 | PASS-SCOPED | `PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke` 23/23；系列索引/详情、种植方式索引 route contract；390/1280 Playwright、WebKit iPhone 13、Chrome Pixel 7 根溢出 0 | P2 正式资料替换后复跑桌面、移动和断点截图 | 开发 |
| 13 语言发布 | PASS-SCOPED | 13 个语言首页生产回读均为 HTTP 200，`lang` 与 `index, follow` 正确；共享 Payload 初始化与英语源回退已部署；SEO 合同 5/5；390px Hebrew RTL 浏览器根/body 无溢出、无已加载失败图片，console 0 errors/warnings | 后续完善缺少人工译文的 CMS 内容；SMTP 邮件送达未配置 | 开发/内容维护 |
| FLBOOK 产品 | PASS-SCOPED | `npm run dry-run:flbook`：10 产品、23 WebP、页码关系、排除候选页、英中字段和媒体回读通过 | 逐项核对 OCR、配方、claims、包装和图片授权；再执行正式 Payload 导入 | 业主/内容维护 |
| Payload 后台 | PASS-SCOPED | 生产管理员已初始化并真实登录；产品、FAQ、新闻富文本 PATCH、前台回读和原文恢复已通过；smoke 23/23 | P2 正式内容逐项录入和验收 | 开发/运维 |
| PostgreSQL | PASS-SCOPED | 生产 `haifa_reference` 已运行；隔离 dump 恢复计数与快照一致；systemd 重启后 `/api/ready` 和后台数据回读通过 | 继续执行日常备份并在发布前复核恢复演练 | 运维 |
| 媒体存储 | PASS-SCOPED | `PAYLOAD_MEDIA_DIR`、SHA-256 联合备份/恢复通过；产品媒体关系替换、URL 回读和 systemd 重启持久化通过 | 正式素材替换时继续保留 manifest 和来源状态 | 运维 |
| 询盘 | PASS-SCOPED / NOTIFY-LIMITED | 生产 `INQUIRY_MODE=enabled`；真实表单提交与 smoke/SEO 合同均返回 `201` 并产生记录 ID；邮箱/WhatsApp 可直达 | 配置 SMTP/通知适配器前不声称邮件送达 | 业主/运维 |
| 域名与 SEO | PASS-SCOPED / DEPLOY-RECHECK | DNS/Nginx/HTTPS、13 语言 canonical/alternate、robots allow、sitemap、`npm run test:seo` 5/5 已通过；页面为 `index, follow` | SSH 恢复后确认重启持久化、搜索控制文件和回滚证据 | 业主/运维 |
| 正式资料审核 | PASS-SCOPED / PARTIAL | 10 条 FLBOOK 产品按业主授权为 `approved` / `claimsVerified=true`；76 条规格和来源媒体已回读；21 条官方候选保持独立审核状态；`npm run check:p2-release` ready=true | 复合肥料定量表仍缺可靠来源；候选技术字段和最终人工译文继续由后台维护 | 业主/内容维护 |

## 推荐发布顺序

1. 业主锁定品牌、产品、译文、联系入口和素材授权。
2. 运维准备域名、服务器、PostgreSQL、媒体卷和 `.env.production`。
3. 运行 `npm run check:production-env`、`npm run check:deployment:files` 和 `docker compose config --quiet`。
4. 构建并启动容器，查看 Payload `prodMigrations` 日志，完成后台登录和资料回读。
5. 执行 PostgreSQL dump 与媒体清单联合恢复演练。
6. 按正式语言、桌面/移动视口、询盘、SEO 和 HTTPS 完成发布验收，再解除 noindex。

当前结论：业主已授权正式发布；生产共享 Payload/英语回退版本、13 语言 URL、冷启动、23/23 smoke、SEO 5/5、询盘记录链路、媒体与产品审核边界、健康探针、后台编辑回读、联合备份恢复和 HTTPS 均已有证据。SMTP 邮件送达能力尚未配置，完整 13 语言人工译文审校是后续内容维护事项。

## Staging 部署记录

2026-11-08 已在腾讯云当前实例 `43.160.216.74` 部署并刷新新站：系统 PostgreSQL 16、数据库 `haifa_reference`、Payload 迁移、十条 FLBOOK 产品、十个单页产品裁剪图、三条作物指南、新闻/知识/案例、首页、企业资料、FAQ 和 23 个媒体均已导入；Nginx 已将 `kowloonglobaltrading.com` 与 `www` 切换到 `127.0.0.1:3118`，公网 HTTPS 和中文/英文页面回读通过，证书自动续期已配置。旧 `brand-web.service`、`brand-cms.service` 已停止并禁用，旧配置保存在 `/etc/nginx/backup/`。管理员账号初始化、后台编辑回读和联合恢复已通过；正式资料审核、询盘策略和最终 SEO/noindex 决策仍待完成。
