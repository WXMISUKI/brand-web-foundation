# 依赖安全升级发布准备记录

日期：2026-11-09  
分支：`codex/haifa-reference-rebuild`  
状态：**隔离发布候选已验证并提交；主工作区未合并、未部署**

隔离 worktree：`codex/haifa-dependency-release`；候选提交：`81859a6`。该提交只包含依赖清单、Sharp/standalone 运行时耦合文件和 Sharp 路径边界回归测试，未推送远端。

## 变更范围

| 依赖 | 当前生产 | 本地候选 | 目的 |
| --- | --- | --- | --- |
| Next.js | 16.3.5 | 16.4.5 | 修复生产依赖树中 Next.js critical advisories |
| Payload 与官方包 | 3.92.0 | 3.93.0 | 与兼容版本的框架升级配套 |
| Sharp | 0.34.5 | 0.35.5 | 更新带有 libvips/libheif/librsvg advisories 的原生图像依赖 |
| `monaco-editor` 的 DOMPurify | 3.4.15 | 3.4.17 override | 覆盖当前 audit 命中的 DOMPurify critical advisories |
| `@lexical/headless` 的 happy-dom | 依赖范围解析到 20.9.0 | 21.0.4 override | 覆盖当前 audit 命中的 happy-dom high advisories |

更新前对生产锁文件的官方 registry audit 为 19 项：7 low、6 moderate、4 high、2 critical。候选 `package-lock.json` 的官方 registry audit 为 13 项：7 low、6 moderate、0 high、0 critical。剩余 low/moderate 主要来自 Payload `deepmerge` 与 `drizzle-kit` 下旧版 esbuild；强制自动修复会选到不兼容的 Payload 版本，本次不采用。

候选锁文件完成 `npm audit signatures`：403 个包签名验证通过，90 个包带有 registry attestations。npm 镜像 `registry.npmmirror.com` 不实现 audit API，正式审计命令需显式使用 `https://registry.npmjs.org`。

## 验证证据

- Node.js `24.22.1`、npm `11.19.1`。
- 使用官方 registry 执行 `npm ci --ignore-scripts`，安装 403 个包；安装脚本仅对 lockfile 中列出的 3 个 esbuild 版本逐项检查，确认 `postinstall` 仅调用各自的 `install.js`，随后显式 `npm rebuild esbuild` 成功。Sharp 0.35.5 无生命周期脚本。
- `npm run typecheck`、`check:deployment:files`、`check:p2-release`、`test:official-candidates`、`validate:flbook`、`validate:content`、`validate:crop-guides`、`check:locale`、`test:rtl-css` 通过。
- `next build` 成功，包含 TypeScript、页面数据收集及 production route manifest；build ID 为 `nlj850Hsl3yt1ZdLMgLcC`。
- 2026-11-09 复验当前工作区：本地 `.env` 选择 SQLite，直接执行生产构建时按设计在 Payload 配置检查处失败；未连接任何数据库。随后仅在构建子进程设置占位 PostgreSQL URL，`npm run build` 成功，当前 build ID 为 `vx8xwCXto9DzjLNNfiK6U`；`npm run prepare:standalone` 通过，复制 88 个 static 文件和 64 个 public 文件，并从 standalone 目录成功解析 Sharp。此构建使用隔离的占位数据库配置，不代表 CMS 数据页或生产 readiness 已通过。
- 首次 standalone 冷启动暴露 Sharp 原生库追踪缺口：Next 自动追踪包含 `.node` 文件但未完整包含平台运行库。本地 Windows detail 请求返回 500，而项目根安装直接加载 Sharp 正常。
- 后续独立审查发现旧门禁会从 standalone 外部回退解析项目根 `node_modules/sharp`；`81859a6` 已改为要求 `require.resolve("sharp")` 位于 standalone 的 `node_modules` 下，并增加根目录回退失败回归测试。
- 按 Next 16.4.5 `output` 配置文档，在 `next.config.ts` 为 `sharp` 与 `@img` 加入窄范围 `outputFileTracingIncludes`。`prepare-standalone` 现会从 standalone 目录实际 require Sharp，防止产物漏带原生依赖；修复后 build 和该门禁均通过。
- 本机 standalone 冷启动：健康接口 200、favicon 200、抽样 `/_next/static/*.js` 200；两条旧候选详情 URL 分别 307 到 canonical slug `official-569687` 和 `official-569693`。生产 CMS 页面测试使用隔离无效 PostgreSQL 地址时会按预期无法读取产品，不能据此宣称 CMS 页面通过。`/api/ready` 为 503（database false、media true）也是隔离测试预期。
- Windows 原生环境没有 Linux ABI；该限制已通过本机 WSL2 Ubuntu 24.04 的独立门禁补齐，生产工作区仍未写入。

## 2026-11-09 WSL2 Linux 门禁（PASS-SCOPED）

- 在 WSL2 Ubuntu 24.04（Linux kernel `6.6.87.2-microsoft-standard-WSL2`）中使用 Node `24.22.1` / npm `11.19.1`，将当前工作树复制到独立目录 `/home/dddsglyl/haifa-reference-linux-gate-20261109`；未使用 Windows `node_modules`，未连接生产数据库。
- 本次 WSL `npm ci --ignore-scripts` 实际安装 405 个包、审计 406 个包；此前锁文件签名检查的 403 个包记录仍保留为安装前证据。
- 该目录执行冻结 `npm ci --ignore-scripts`、`npm rebuild esbuild`、`npm audit --audit-level=high`、`npm run typecheck`、部署文件检查、生产环境示例检查、locale 合同和官方候选合同，均通过；审计为 7 low、6 moderate、0 high、0 critical。
- 设置隔离的占位 PostgreSQL URL 后执行 `npm run build`，Linux build ID 为 `DFpWegUM8opxdio-r9J9P`；`npm run prepare:standalone` 通过，复制 88 个 static 文件和 64 个 public 文件。
- standalone 目录实际加载 Sharp `0.35.5`，格式探测返回 jpeg/png/webp/tiff/magick；冷启动 health、favicon 和抽样 `/_next/static/*.js` 均返回 200，生产形状回读为 `catalogSource=payload`、`mediaConfigured=true`。
- 隔离数据库不存在，因此 `/api/ready` 返回 503（database=false、media=true）是预期结果；该证据证明 Linux 构建与运行时资源门禁，不证明 CMS 数据页或生产 readiness。
- Route/SEO 合同首次运行因未启动对应 localhost 服务而返回 `ECONNREFUSED`，不是断言失败；没有将这些结果记为通过。本轮未对生产发起会创建询盘的 SEO 测试。

## 部署门禁

本记录只确认候选依赖可安装、可构建并能生成 standalone 产物。部署前仍需：

1. 将依赖升级与现有文档/图片/验收记录等未提交改动分开审阅，形成清晰且可追溯的提交；不要把其他工作区改动或未确认图片混入依赖提交。
2. Linux 构建与 Sharp standalone 门禁已在 WSL2 独立环境通过；生产部署前仍需复核生产备份新鲜度、磁盘空间和上一版 standalone 回滚产物。生产部署目录当前没有 Git 元数据，发布记录必须另存实际 commit 与 build ID。
3. 发布后检查 systemd 服务、`/api/ready`、首页/资源页冷启动、CSS/JS/favicon/媒体响应，再运行不会误写真实询盘的生产回归。
4. 出现 readiness、静态资源或关键页面失败时停止扩大流量，恢复上一版 standalone；保留 PostgreSQL 与媒体目录，不重导数据。

当前工作区仍有未提交文件。本记录不授权生产部署，也未创建提交或修改生产数据。

## 2026-11-10 合并前边界复核

- `git diff --name-only 8054e4d..81859a6` 仅包含 5 个文件：`package.json`、`package-lock.json`、`next.config.ts`、`scripts/prepare-standalone.mjs` 和 `tests/prepare-standalone-sharp-boundary.test.mjs`。
- `codex/haifa-dependency-release` worktree 当前 clean；翻译 JSON、官方候选目录、原型图片、浏览器证据和运维文档均未进入该提交。
- 主工作区对应的 5 个候选文件与 `81859a6` worktree 逐项 `git hash-object` 一致，因此当前工作区已经包含候选内容；这不等于候选已形成新的主分支提交，也不等于已部署生产。
- 主工作区仍保留其他未提交差异，不能直接用批量提交或 reset 代替逐项审阅；当前远端仍指向另一套 `brand-web-foundation` 工程，不能推送。
- 本阶段结论：候选提交满足“依赖/运行时边界隔离”的 `PASS-SCOPED` 条件；合并后的完整工作区回归、生产备份复核、发布窗口和部署回读仍是独立闸门，当前保持 `WAITING-EXTERNAL`。
- 本轮复验：Sharp 路径边界测试 `1/1 PASS`，`npm run typecheck`、`npm run check:p2-release`（ready=true，10 条正式产品）和 `npm run test:official-candidates`（1/1）通过；这些结果仍只证明本地候选状态。
- 2026-11-10 官方 registry 复核：在 `npm_config_registry=https://registry.npmjs.org` 下执行 `npm audit --omit=dev --audit-level=high`，结果为 13 项（7 low、6 moderate、0 high、0 critical）；默认镜像的 audit endpoint 不可用，未将镜像失败误报为安全结果。候选仍未部署。
- 2026-11-10 候选 worktree 重新验收：官方 registry `npm ci --ignore-scripts` 安装 403 个包并报告 13 项 low/moderate；`npm rebuild esbuild`、`npm run typecheck`、`check:deployment:files`、`check:p2-release`（ready=true）、`test:official-candidates`、Sharp 路径边界测试均通过。隔离占位 PostgreSQL 配置下 `npm run build` 成功，build ID 为 `m0jKmHl0rVA_MzgIXBcyZ`；`npm run prepare:standalone` 复制 88 个 static 文件和 56 个 public 文件，并确认 standalone Sharp runtime、favicon 和目录边界存在。该证据仍不代表生产部署。

## 2026-11-10 生产部署与回读

- 业主明确选择依赖安全升级发布并授权直接部署；部署前完成 PostgreSQL custom dump、104 文件媒体备份和上一版 standalone tarball，目录为 `/home/ubuntu/haifa-reference-rebuild/.local/backups/dependency-release-20261109T230938Z/`，并保存 SHA-256 清单。
- 从 clean worktree `codex/haifa-dependency-release` 的 `81859a6` 上传五个文件，远端 hash 与候选逐项一致；生产执行 `npm ci --ignore-scripts`、`npm rebuild esbuild`、部署/生产环境门禁、Sharp 边界测试、build 和 `prepare:standalone`。
- 生产 build ID 为 `e7m_5Jpd1SGNUDiD5kOcW`；实际运行版本 Next 16.4.5、Payload 3.93.0、Sharp 0.35.5。systemd 重启后 active，本机 health/readiness 通过。
- 公网 `audit:public-baseline` 返回 `ok:true`，13 locale、匿名 API 403、robots/sitemap、公开审核字段边界和静态/媒体抽样均通过；生产浏览器 Hebrew 390px、系列/方案页方向和宽度通过，懒加载图片完整矩阵保持 `PARTIAL`。
- 当前结论：依赖升级生产发布为 `PASS-SCOPED`；完整生产视觉矩阵、候选产品发布和询盘/运维治理仍是独立闸门。

## 2026-11-10 生产 Hero 热修复补充

- 依赖发布后的生产视觉回读发现旧 Hero 图片包含中文横幅文字；已在独立提交 `8e141d2` 中将 Hero 背景切换到官方无横幅素材。
- 热修复构建 ID `kQvA_SEwMLo_zDx9zdImU`，systemd、health/readiness 与公网 13 locale 基线复核通过。
- 该补丁只收口 Hero 背景叠字问题，不能替代完整图片矩阵、专业译文审校或其他业务闸门。
