# 生产容器部署手册

生产容器使用 Next standalone 输出，应用和 PostgreSQL 由 `docker-compose.production.yml` 编排。应用媒体挂载到 `payload_media`，数据库挂载到 `payload_postgres`；两个卷都必须纳入目标服务器备份策略。

准备 `.env.production` 时至少提供：

- `PAYLOAD_SECRET`：32 字符以上随机密钥；
- `DATABASE_URL`：指向 Compose PostgreSQL 或外部 PostgreSQL；
- `PAYLOAD_DATABASE=postgres`；
- `CATALOG_SOURCE=payload`、`CROP_GUIDE_SOURCE=payload`；
- `PAYLOAD_MEDIA_DIR=/app/data/media`；
- `POSTGRES_DB`、`POSTGRES_USER`、`POSTGRES_PASSWORD`：供 Compose 初始化数据库。

部署前运行 `npm run check:deployment:files` 和 `npm run check:production-env`。当前 Payload PostgreSQL adapter 已通过 `prodMigrations: migrations` 注册生产迁移；在 `NODE_ENV=production` 连接数据库时会按顺序执行迁移。首次真实部署仍需执行 `docker compose config`、镜像构建、查看迁移日志、后台登录、媒体上传、备份恢复和真实域名验收；本仓库没有代替这些外部环境验证。

应用 liveness 地址为 `/api/health`；依赖 readiness 地址为 `/api/ready`。Compose 使用 Node fetch 轮询 `/api/ready`，它会检查 PostgreSQL TCP/SQLite 文件连通性和媒体目录读写。它不替代 schema 迁移验收，切流前仍必须查看应用启动日志，确认 Payload 已连接 PostgreSQL 并完成 `prodMigrations`；询盘渠道和业务数据仍需单独验收。

生产询盘已按业主授权设置 `INQUIRY_MODE=enabled`；表单写入 Payload `inquiries`，未配置 SMTP 时不声称邮件通知已送达。旧 SQLite 或旧 PostgreSQL schema 必须先完成 `inquiries` 集合迁移，否则公开接口会因缺少表结构失败。

首次空库初始化管理员时，使用一次性环境变量运行：

```bash
BOOTSTRAP_CONFIRM=YES \\
BOOTSTRAP_EMAIL=owner@example.com \\
BOOTSTRAP_PASSWORD='至少 16 位随机密码' \\
npm run bootstrap:admin
```

该命令只接受空的 `users` 集合；已有管理员时会拒绝继续创建，避免部署脚本重复生成账号。密码不会写入输出。完成初始化后应立即清除这些临时环境变量，并通过 `/admin/login` 实际登录回读产品、首页、企业资料和 FAQ。

## systemd standalone 发布顺序

2026-11-14 询盘表单修复：生产运行 build `4A7JIgaEHzAjtzSylrDBZ`，构建源为 `/home/ubuntu/haifa-release-374f875`。候选基于上一生产构建源，仅同步提交 `374f875` 的询盘表单文件；不是分支完整仓库快照。上一运行版保存在 `/home/ubuntu/haifa-reference-rebuild/.local/backups/release-374f875/standalone-live`。恢复时仅切换 standalone 并重启服务，不恢复数据库或媒体。本次生产构建、候选独立端口及生产就绪检查通过；生产表单成功和失败状态使用浏览器拦截模拟，未创建真实生产询盘。公网只读 smoke 23/23，13 语言公开基线无错误和警告，抽样 CSS、JS 与媒体均返回 200。

2026-11-14 导航与产品图片修复：当时生产运行 build `C3PwoBDZ8j8x4lJA2VjEC`。构建源为 `/home/ubuntu/haifa-release-93d26bc`，以先前生产构建源为基底，仅同步提交 `93d26bc` 的导航组件和样式修复，以及部署文件检查所需的配置；不要把它当作该提交的完整仓库快照。上一运行版保存在 `/home/ubuntu/haifa-reference-rebuild/.local/backups/release-93d26bc/standalone-live`。恢复时仅切换 standalone 并重启服务，不恢复数据库或媒体。生产切换期间旧进程退出较慢，曾短暂无法连接。

2026-11-11 内容修复发布说明：当时的 standalone 构建为 `aYk82dGusLwksofqMmRJE`，对应的完整构建源在服务器 `/home/ubuntu/haifa-release-content-20261111`。本次为保护服务器原工作目录，只切换了 `.next/standalone`，未覆盖 `/home/ubuntu/haifa-reference-rebuild/src` 或根目录的依赖；**根目录源码不是当前运行版本**。下次构建应先从已核对的当前源准备新的隔离候选，不要直接从旧根目录构建以免回退。部署前备份位于 `/home/ubuntu/haifa-reference-rebuild/.local/backups/content-release-20261111-064507`；其中 `standalone-live` 为本轮发布前版本，`standalone-before-hotfix` 和 `standalone-before-label` 为中间版本。数据库 69 条精确值已更新，恢复数据库前必须评估是否会覆盖后续后台编辑。

当前腾讯云实例使用 systemd 启动 standalone 产物，不使用本仓库的 Docker Compose。每次发布都必须在应用目录执行以下顺序：

```bash
npm ci
npm run check:deployment:files
npm run check:production-env
npm run build
npm run prepare:standalone
```

应用通过 `src/lib/payload.ts` 复用进程级 Payload Promise，避免 systemd 冷启动时多个页面并发初始化 Payload；发布后必须先访问 `/api/ready`、`/en/sds-request` 和 `/en`，确认首个资源页与首页连续返回 `200`，再做全量 smoke。

`prepare:standalone` 会把 `.next/static` 和 `public` 复制到 `.next/standalone`，并检查 `server.js`、favicon 和复制结果。它不会删除 standalone 中已有的文件、媒体目录或数据库；复制失败时不要重启服务，先检查构建目录，并按上一版发布记录恢复可用 standalone 产物。

复制成功后再重启并做本机依赖探针：

```bash
sudo systemctl restart haifa-reference.service
curl -fsS http://127.0.0.1:3118/api/ready
```

最后从公网 HTML 读取当前版本引用的 `/_next/static/*.css`、`/_next/static/*.js`，分别用 `curl -fI` 验证为 `200`，并验证 `/favicon.svg` 和一个已知媒体 URL 为 `200`。只有这些检查通过才把本次构建视为可发布；失败时按服务器上的上一版发布记录回滚，保留媒体卷，不能重新导入数据库。

发布后可使用仓库内的只读基线审计统一复核：

```bash
PUBLIC_BASE_URL=https://www.kowloonglobaltrading.com npm run audit:public-baseline
```

该脚本检查 `/api/ready`、`/api/health`、匿名产品 API 403、13 locale 的 `lang/dir`、robots、sitemap、公开审核字段边界和抽样静态/媒体资源。它只执行 GET 请求，不提交询盘或修改 Payload；通过后仍需单独完成真实浏览器交互和人工内容审校。

### 冒烟与询盘验证的边界

`npm run test:public-readonly` 在本机模拟服务上检查 `test:smoke` 和 `test:seo` 的 HTTP 请求方法；随后可用 `PREVIEW_URL` 指向生产站运行这两个只读套件。它们检查公开页面和联系入口，不验证生产询盘写入。`npm run test:inquiry` 启动专用本地服务和隔离 SQLite 数据库，覆盖有效请求创建及无效请求拒绝；该结果不能替代真实生产数据库写入或通知送达的验证。不要将询盘 POST 加回公开验收套件。若确需生产端到端写入，应单独安排并明确授权测试记录的标识和清理方式。
