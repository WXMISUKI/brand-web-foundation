# KOMU 化肥导购网站

项目使用 Next.js、React、Payload 和 PostgreSQL 构建，参考 [Haifa](https://www.haifa-group.com/) 的页面结构，产品资料来自业主提供的 [FLBOOK 画册](https://flbook.com.cn/c/LTc82gQQM3)。当前生产站已部署到 `https://www.kowloonglobaltrading.com`，但正式 claims/译文、询盘启用和 noindex 解除仍受阶段门禁控制，页面继续保持 `noindex`。

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

`/` 重定向至英文首页 `/en`；中文首页为 `/zh`，旧中文产品、方案、企业、联系和 FAQ 地址有临时跳转。中英文可浏览主要原型页面；法语及部分西班牙语页面仅在 `CMS_EVAL=1` 且非生产模式下作为开发预览；同一模式下首页、`/about`、`/products`、产品详情、`/faq`、`/contact`、`/search`、新闻、知识、案例、方案/作物指南以及资源页面已提供 13 种语言的业务预览切片，其余语言业务页面仍未开放。后台配置了 13 种内容语言，不代表前台 13 种语言已完成。

后台已配置产品、分类、媒体、新闻、知识文章、案例、FAQ、企业介绍和首页内容；部分功能已通过隔离数据验证，具体范围以记录为准。知识文章、新闻与案例支持富文本；真实产品资料、证书、视频及询盘接收方案仍待业主提供或确认。安全数据表申请和订阅表单目前为禁用的预览。

## 检查与项目资料

`npm run typecheck` 检查类型。生产回归使用：

```sh
PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:smoke
PREVIEW_URL=https://www.kowloonglobaltrading.com npm run test:seo
npm run check:locale
npm run audit:production-products
npm run check:p2-release
```

冒烟测试覆盖有限路由及基本行为，不代替浏览器交互、视觉、生产部署或真实资料验收；`check:p2-release` 在正式内容未审核前预期返回 `ready:false`。

- [项目规格](docs/spec.md)和[参考页面映射](docs/reference-route-map.md)：范围、路由与实现位置。
- [页面对照](docs/page-comparison.md)和[参考研究](docs/reference-research.md)：观察、已验证事项及差异。
- [资料收集模板](docs/owner-templates/README.md)和[产品字段对照](docs/product-content-mapping.md)：真实资料准备与当前模型限制。
- [多语言计划](docs/locale-routing-proposal.md)和[后台与多语言记录](docs/cms-translation-assessment.md)：语言、CMS 和迁移进展。

上线前仍需确认询盘渠道、隐私/反垃圾、正式 claims、证书、最终译文和解除 noindex 的授权窗口，并针对最终版本完成数据、功能、视觉、设备与部署验收。历史构建和隔离数据库测试不能替代最终验收；当前真实状态以 [HANDOFF](HANDOFF.md) 和 [上线验收矩阵](docs/launch-acceptance-matrix.md) 为准。
