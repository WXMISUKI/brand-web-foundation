# KOMU 化肥导购网站

项目使用 Next.js、React、Payload 和 PostgreSQL 构建，以 [Haifa](https://www.haifa-group.com/) 为结构与交互参考，品牌和业务资料属于安徽康母国际化肥股份有限公司；产品资料来源见业主提供的 [FLBOOK 画册](https://flbook.com.cn/c/LTc82gQQM3)。生产站为 `https://www.kowloonglobaltrading.com`。截至 2026-11-09，13 个语言 URL 已公开、noindex 已解除、询盘写入 Payload 已启用；邮件通知未配置，缺少人工译文的 CMS 字段回退英文。当前生产状态和限制见 [HANDOFF](HANDOFF.md) 与[阶段闸门](docs/current-stage-gate-2026-11-09.md)。

## 本地运行

项目声明的 Node 范围是 `^22.23.4 || >=24.22.1`；`.nvmrc` 指定 24.22.1。本机曾使用独立的 Node 24.22.1 进行开发检查；版本管理器不一定已经安装该版本，运行前应确认 `node --version`，必要时通过所用版本管理器安装。旧版 22.19.0 不满足当前依赖要求。

复制 `.env.example` 为 `.env`，填写至少 32 个字符的随机 `PAYLOAD_SECRET`；不要将真实密钥或 `.env` 提交。开发环境默认使用 SQLite，未指定文件时保存在 `.local/payload.sqlite`。然后执行：

```sh
npm ci
npm run dev
```

按终端给出的地址打开网站；指定端口可运行 `npm run dev -- -p 3118`。后台入口为 `/admin`；首次使用需建立本地管理员。`.local` 内数据库和上传文件是本机数据，切换或清理环境前应先备份。

`CATALOG_SOURCE=sample` 使用示例内容；设置为 `payload` 后相关页面读取后台数据，缺失译文显示待补充，具体覆盖范围见 [后台与多语言记录](docs/cms-translation-assessment.md)。生产环境使用 PostgreSQL，必须设置 `PAYLOAD_DATABASE=postgres` 和 `DATABASE_URL`，并设置持久化的 `PAYLOAD_MEDIA_DIR`。当前生产目标为腾讯云 `43.160.216.74`、systemd `haifa-reference.service`、Nginx HTTPS 和 PostgreSQL `haifa_reference`；真实部署、备份恢复和 standalone 静态资源门禁已按 [HANDOFF](HANDOFF.md) 与阶段验收文档完成。

生产容器资产为 `Dockerfile` 和 `docker-compose.production.yml`，应用使用 Next standalone 输出，Compose 同时提供 PostgreSQL 17 和媒体/数据库持久化卷。部署前运行 `npm run check:deployment:files`；备份与恢复命令见 [PostgreSQL 备份恢复手册](docs/postgresql-backup-runbook.md)。

## 页面与内容

`/` 重定向至英文首页 `/en`；中文首页为 `/zh`，13 个已配置语言均有公开 URL。后台内容主要提供英中版本；未完成的 CMS 译文使用英文源回退，因此路由已公开不代表 13 种语言的业务文案均已翻译或审校。相关 locale 和 SEO 范围以当前阶段闸门为准。

后台已配置产品、分类、媒体、新闻、知识文章、案例、FAQ、企业介绍和首页内容；知识文章、新闻与案例支持富文本。10 条 FLBOOK 产品已获批准；21 条官网候选产品仍待业主审核，不能据此推断型号、包装或 claims。询盘当前写入 Payload，处理通知方案仍待确定；安全数据表申请和订阅表单为预览功能。

## 检查与项目资料

`npm run typecheck` 检查类型。生产回归使用：

本地 UI 一键验收先运行 `npx playwright install chromium`（首次），随后运行 `npm run test:ui`。该命令自动启动隔离示例站并执行浏览器交互与页面矩阵；覆盖范围和结果查看方式见[自动化 UI 验收方案](docs/automated-ui-acceptance-2026-11-11.md)。

```sh
PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke
PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:seo
npm run check:locale
npm run audit:production-products
npm run audit:public-baseline
npm run check:p2-release
```

冒烟测试覆盖有限路由及基本行为，不代替浏览器交互、视觉、生产部署或真实资料验收。`audit:public-baseline` 只执行 GET 请求，检查公网 health/readiness、匿名 API 边界、13 locale SSR、robots/sitemap、公开审核字段和抽样静态资源；运行时设置 `PUBLIC_BASE_URL`。`check:p2-release` 检查本地 FLBOOK 内容门禁；2026-11-09 当前结果为 `ready:true`，不代表官方候选已审核或生产数据库已被该命令修改。

- [项目规格](docs/spec.md)和[参考页面映射](docs/reference-route-map.md)：范围、路由与实现位置。
- [页面对照](docs/page-comparison.md)和[参考研究](docs/reference-research.md)：观察、已验证事项及差异。
- [资料收集模板](docs/owner-templates/README.md)和[产品字段对照](docs/product-content-mapping.md)：真实资料准备与当前模型限制。
- [多语言计划](docs/locale-routing-proposal.md)和[后台与多语言记录](docs/cms-translation-assessment.md)：语言、CMS 和迁移进展。

后续事项包括官方候选产品审核、询盘通知和隐私/反垃圾运营规则、人工译文及备份恢复演练。历史验收文件是阶段快照；当前状态以 [HANDOFF](HANDOFF.md)、[阶段闸门](docs/current-stage-gate-2026-11-09.md) 和 [P3 发布决策](docs/p3-release-decision-2026-11-09.md) 为准。
