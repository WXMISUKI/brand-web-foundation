# Foundation Hardening Spec — Phase 底座完善 (2026-09)

- Status: Draft — awaiting owner acceptance
- Owner / acceptance: direction & acceptance role (human + assistant)
- Executor: implementation AI (strict boundary, see §9)
- Repo: `brand-web-foundation` (`D:\work\private\brand-web-foundation`)
- Companion decision records: `docs/decisions/0001-payload-cms-sqlite-i18n-baseline.md`

> 本 Spec 只覆盖下一阶段「底座完善」的 5 个目标。它不是对整个品牌项目的重述,不进入
> 品牌视觉、AUREX 业务模型或任何产品功能设计。实现 AI 严格按本文件执行,超出范围的需求
> 一律记入 §10 Backlog,不得私自实现。

---

## 1. 目标 (Why)

让 `brand-web-foundation` 从「可运行的脚手架」升级为「可被后续品牌项目(首个为 AUREX 类
项目)复用的工程底座」,补齐会阻塞后续开发的四块基础能力:

1. **工程质量门禁** — lint / format / typecheck / test 成为真实、可执行的命令,不再是占位。
2. **国际化基础** — 语言方向修正为巴西市场(`pt-BR` 默认、`en` 第二),语言事实单一来源化。
3. **CMS 边界** — `apps/cms` 正式接入 Payload CMS(Next.js 集成模式),建立认证 / 权限 /
   内容模型 / 媒体 / 预览的最小能力闭环。
4. **应用与共享包边界** — `@brand/config` 被真实引用、`@brand/ui` 使用规范落地、
   `public` / `content` / 媒体资源目录职责清晰。

每项均配自动化或半自动验收(§7)。

---

## 2. 范围 (Scope)

### 2.1 In scope

| #   | 工作项        | 说明                                                                         |
| --- | ------------- | ---------------------------------------------------------------------------- |
| G1  | 工程质量门禁  | ESLint(flat config, CLI)、Prettier 配置落库、typecheck、最小 test 命令       |
| G2  | 国际化基础    | `@brand/i18n` 单一来源化(pt-BR/en);web 根布局接入;`content/locales` 文案骨架 |
| G3  | CMS = Payload | `apps/cms` 接入 Payload 3.x;SQLite;Users/Media/Pages;draft 与预览            |
| G4  | 共享边界      | `@brand/config` 真实接入(tsc/eslint/prettier);Tailwind v4 清理;资源目录规范  |
| G5  | 文档与验收    | 本 Spec 配套的文档、验收脚本、README 同步、ADR 存档                          |

### 2.2 Out of scope (硬性禁止,实现 AI 不得触碰)

- 品牌视觉设计系统 / 字体 / 色彩 token / 动效体系(上一轮 Hallmark 结论:缺口已知,延后)。
- Payload 的 Postgres / MongoDB 适配器、云存储插件、多语言字段级 localization。
- `next-intl` / 路由中间件 / `[lang]` 路径策略——URL 形态待 AUREX 页面需求触发后再定。
- Turborepo/Nx、Prisma/Drizzle(应用代码层)、PostHog/Matomo 等实际 SDK、完整测试体系、
  大型 UI 组件库、自研 CMS 抽象层。
- `apps/web` 真正消费 CMS 内容渲染页面(本阶段只做「预览通道」最小验证)。
- 任何 AUREX 专属内容模型与业务页面。

---

## 3. 现状基准(已审计,实现 AI 以此为准)

| 项            | 现状证据                                                                                                                                                               | 结论                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| TypeScript    | `pnpm typecheck` 通过(各 workspace 已有 tsc --noEmit)                                                                                                                  | 保持,不做大改                      |
| ESLint        | 仅 `packages/config/eslint/base.js` 孤本;apps 用已弃用的 `next lint`;packages 是 `echo` 占位;根未装 eslint                                                             | **需重建为真实 CLI**               |
| Prettier      | 根有依赖无配置;`format:check` 失败                                                                                                                                     | 需配置落库 + 全库格式化一次        |
| Test          | 无命令、无框架、`tests/` 空                                                                                                                                            | 需最小 test 命令                   |
| i18n          | `packages/i18n/src/config.ts`:`defaultLocale='en'`、`locales=['en','zh']`                                                                                              | **方向错误,须改为 pt-BR/en**       |
| CMS           | `apps/cms` = Next.js 占位页;无 Payload 痕迹;无数据库                                                                                                                   | **正式接入 Payload**               |
| Shared config | `@brand/config` 存在 `typescript/base.json`(与根 `tsconfig.base.json` 内容重复);`tailwind/preset.js` 为 v3 对象写法,与 Tailwind v4 CSS-first 不兼容;无任何包真实引用它 | **收编为单一来源并接入**           |
| public        | 根 `public/` 仅 `.gitkeep`;apps 无各自 `public/`;无媒体目录约定                                                                                                        | 需规范                             |
| env           | 根 `.env.example`:`DEFAULT_LOCALE=en`、无 Payload 密钥/DB 项                                                                                                           | 需拆分 + 补 Payload 项             |
| 依赖基线      | Next 15.5.x(锁文件)、React 19、Tailwind v4、pnpm>=10、Node>=22、`shamefully-hoist=false`、`strict-peer-dependencies=true`                                              | Payload 安装需按 §6.3 风险预案处理 |

---

## 4. 目标架构(Phase 完成后)

```text
apps/
  web/                     # 公共站:Next 15,html lang 与元数据读取 @brand/i18n
  cms/                     # Payload CMS(Next.js 集成模式)
    src/app/(payload)/     # Payload admin + REST API 挂载(/admin、/api)
    src/payload.config.ts  # buildConfig:sqlite、collections、livePreview
    data/                  # SQLite 文件(gitignore)
    media/                 # Payload 上传目录(gitignore)
packages/
  config/                  # 单一来源:typescript/base.json、eslint 共享 flat config
  i18n/                    # defaultLocale=pt-BR;locales=[pt-BR,en]
  ui/  lib/  analytics/    # 维持现状(ui 本轮仅规范,不扩组件)
content/locales/           # pt-BR.json / en.json 文案骨架
docs/
  decisions/0001-...md     # 本阶段 ADR
  specs/foundation-hardening-spec.md
```

预览链路(最小):CMS Pages 启用 drafts → Admin 预览按钮携带 token 打开
`http://localhost:3000/preview/pages/{id}?token=...` → web 端 Server 组件用 token
请求 CMS REST `draft=true` 渲染标题等基础字段 → 200。

---

## 5. 任务清单

> 编号即执行顺序建议。每项含交付物与自检点。**T8 必须最后做**。

### T1 — ESLint 真实接入(flat config + CLI)

要求:

- 根 `package.json` 增加 `eslint` 及相关依赖;新增根 `eslint.config.mjs`(flat config,
  ESLint 9 语法),**不得再用 `next lint`**(Next 15 已弃用)。
- `packages/config` 作为共享规则来源:整理 `eslint/base.js`(js+ts 基础规则),根配置与
  `apps/*` 通过引用共享;依赖声明收口到真正使用处(遵循 pnpm strict peer 规则,缺 peer
  依赖要显式声明,不用 `--force`/`--legacy`)。
- 各 workspace `lint` 脚本改为真实调用(如 `eslint .`),删除 `echo 'no lint configured'` 占位。
- 忽略规则覆盖 `node_modules` / `.next` / `dist` / `coverage` / 生成文件;错误级别以
  error 为主,遗留告警在 PR 内清零或显式注释。

自检:根目录 `pnpm lint` 退出码 0;`pnpm -r run lint` 通过。

### T2 — Prettier 配置落库 + 全库格式化

要求:

- 根新增 `.prettierrc`(或 `prettier.config.mjs`),与 `.editorconfig`(2 空格、lf、
  utf-8、md 不 trim)一致;建议 `singleQuote: true`(现状代码为单引号)、
  `trailingComma: 'all'`。
- 全库执行一次 `pnpm format` 并提交(一次性格式化提交,不与功能混提)。
- 添加 `.prettierignore`(`node_modules`、`.next`、`dist`、`pnpm-lock.yaml`、
  `.codegraph`、SQLite 文件等)。

自检:`pnpm format:check` 退出码 0。

### T3 — typecheck 收口为根命令

要求:

- 保留各 workspace `typecheck`(`tsc --noEmit`),根 `pnpm typecheck` 已为
  `pnpm -r run typecheck` → 补跑并修复存量错误(若有)。
- 将 TS 基础配置收编为**单一来源**:以 `packages/config/typescript/base.json` 为准,
  删除根 `tsconfig.base.json` 的重复副本;`apps/*` 与 `packages/*` 的 tsconfig 通过
  package 名或相对路径引用该单一来源(实现 AI 选可靠的一种,README/文档标注引用方式)。
  注意 `apps/*/tsconfig.json` 需保留 next 插件相关字段。

自检:根 `pnpm typecheck` 退出码 0;全库仅存在一份 TS base 配置事实。

### T4 — 最小 test 命令

要求:

- 选择**最轻**方案(倾向 Node 内置 `node --test` + 少量 TS 冒烟,或 vitest 单选其一;
  由实现 AI 判断依赖体积与 TS 支持,不得引入完整测试框架矩阵)。
- 至少一个真实用例覆盖共享包逻辑,例如:`packages/lib` 的 `cn()`、
  `packages/i18n` 的 `isValidLocale('pt-BR') === true` / `isValidLocale('en')===true`
  / `'zh'` 不再有效。
- 根 `package.json` 增加 `test` 脚本;`tests/` 目录接住端到端冒烟(§7 A5)。

自检:根 `pnpm test` 退出码 0。

### T5 — 国际化基础(pt-BR / en)

要求:

- `packages/i18n/src/config.ts`:`defaultLocale` 改为 `'pt-BR'`;
  `locales` 改为 `['pt-BR', 'en']`(默认语言在首位);`Locale` 类型与
  `isValidLocale` 同步;导出保持不变(`index.ts` 无需破坏性变更)。
- 新增/更新 `content/locales/pt-BR.json` 与 `content/locales/en.json`:最小同构骨架
  (如 `{ "home": { "title": ..., "subtitle": ... } }` 或扁平 key),字段一一对应,
  **本轮不建 loader**,仅确立「文案归 content、不写死在组件」的边界。
- `apps/web/src/app/layout.tsx`:`<html lang>` 与 metadata 的 locale 来源改为
  `@brand/i18n`(环境变量仍可覆盖,但默认值=pt-BR),不再出现硬编码 `en` 兜底。
- 根 `.env.example` 与 README 中的 locale 表述同步为 pt-BR/en。
- CMS 管理端语言保持 Payload 默认(英语),本轮不做 admin 文案翻译。

自检:web 首页 HTML `lang="pt-BR"`(无 env 覆盖时);`@brand/i18n` 测试通过;仓库内
grep 不到 `defaultLocale = 'en'` 或 `locales = ['en', 'zh']` 的残留(占位文案除外,
如有遗留需替换为从 content 读取的占位)。

### T6 — CMS 接入 Payload(最大工作项)

前提:遵循官方当前稳定文档(payloadcms.com, v3.x);**不引入 4.x beta**。

要求:

1. **依赖与配置**
   - `apps/cms` 增加:`payload`、`@payloadcms/next`、`@payloadcms/db-sqlite`、
     `@payloadcms/richtext-lexical`(richText 编辑器)等 v3 对应包;依赖按 pnpm
     peer 规则正确收口。
   - `apps/cms/payload.config.ts`(或按官方模板约定位置):`buildConfig` 内含
     `secret`(读 `PAYLOAD_SECRET`)、`db: sqliteAdapter({ client: { url: ... } })`
     (读 `DATABASE_URI`,默认指向 `apps/cms/data` 下 sqlite 文件)、`collections`、
     `editor: lexicalEditor()`。
   - Admin 与 REST 挂载:按官方模板在 `apps/cms/src/app/(payload)/` 下建立
     `admin/[[...segments]]/page.tsx`、`api/[...slug]/route.ts`、`layout.tsx`、
     `not-found.tsx` 等路由组文件。
   - `next.config.ts` 按官方模板接入 Payload(含 `withPayload` / 别名 / 静态目录),
     保证 dev(webpack)与 build 可用;若 dev 默认 Turbopack 与此冲突,本轮 dev 用
     webpack 并记录。
   - tsconfig 增加 `@payload-config` 路径别名指向 `payload.config.ts`。
2. **内容模型与权限**(§ADR 决定)
   - `users`:启用 auth;最小角色字段(如 `role: 'admin' | 'editor'`,默认
     `editor`);access 收敛为:登录用户可读自己的资料、管理员可管理全部(实现 AI
     给出精确 access 函数,避免过度设计但必须防匿名写)。
   - `media`:upload 集合(alt 文本等最小字段);存储落到 `apps/cms/media/`
     (gitignore);公开可读、写需登录。
   - `pages`:字段最小集(如 `title` text 必填、`slug` text/unique 必填、
     `excerpt` textarea 可选、`content` richText 可选);`versions: { drafts: true }`
     启用草稿/发布;access:公开读仅 published,写需登录;admin 开启
     `livePreview` 指向 web 预览 URL(见 §4)。
   - `typescript` 类型生成:接入 `payload generate:types` 流程并纳入 typecheck
     范围(或文档化执行方式)。
3. **首个管理员与数据**
   - 提供幂等 seed 脚本(如 `apps/cms/src/seed/` 或 scripts),用 Local API 创建
     admin 用户与 1 篇示例 published page、1 篇 draft page;口令从 env 读取,
     不入库。seed 幂等(已存在则跳过)。
4. **env 与 ignore**
   - `apps/cms/.env.example`(或根 `.env.example` 拆分,实现 AI 决定但必须在 README
     写明每端各自读取的 env 文件位置与必填项):`PAYLOAD_SECRET`、
     `DATABASE_URI`(sqlite 文件路径)、`CMS_URL`/`NEXT_PUBLIC_*` 等。
   - `.gitignore` 增加 `apps/cms/data/`、`apps/cms/media/`、生成的
     payload-types / importMap 若为生成物则统一约定(建议提交 payload-types 以共享类型,
     importMap 按官方模板忽略规则处理)。

自检:

- `pnpm --filter cms dev` 后 `http://localhost:3001/admin` 200 且显示登录;
- seed 后可用 admin 登录;
- 后台可:新建/编辑 Users、上传 media、创建/发布 page、对 draft 触发预览;
- 匿名 `GET http://localhost:3001/api/pages` 只见 published;带 draft token 可见 draft。

### T7 — 共享边界与资源目录规范

要求:

- `@brand/config`:**无任何副本漂移**,其 `typescript/base.json` 为唯一 TS base(见
  T3);eslint 共享规则真实被根与 apps 引用(见 T1)。
- Tailwind v4 清理:`apps/*/src/app/globals.css` 保持 `@import 'tailwindcss'`
  CSS-first 用法;删除或改造 `@brand/config/tailwind/preset.js`(v3 对象写法当前不兼容),
  避免保留「死配置」;如保留占位须在 README 注明 v4 下 token 的落点(设计系统阶段再做,
  见 ADR 后果)。
- `packages/ui`:本轮**只定规范不改视觉**。将 `Button` 等现状占位标注
  `TODO(design-system)`,明确 `@brand/ui` 使用边界(纯展示组件、样式由应用层 Tailwind
  或未来 DS token 提供;不内置业务逻辑、不 import 客户端 API)。若 `button.tsx` 当前
  样式类为占位假类(如 `btn-*` 未定义),修正为可用的原子类或标记待设计系统,不允许
  交付不可用的假样式。
- 资源目录规范(写入 README):
  - 各 app 的静态资源 → `apps/web/public/`、`apps/cms/public/`(各自 Next 约定);
  - 仓库级共享、非运行期资源 → 根 `public/`(维持,写清语义);
  - 文案/法律文本 → `content/`(含本轮 `content/locales/`);
  - CMS 上传文件 → `apps/cms/media/`(运行期生成,不入库);
  - SQLite → `apps/cms/data/`(运行期生成,不入库)。
- `@brand/ui` 若存在未使用的导出清理项,一并最小化整理(不扩展组件)。

自检:README 目录树与脚本表与实际一致;无重复 TS base;无 v3 死配置;`@brand/ui`
无未定义样式类交付。

### T8 — 文档、验收与收尾

要求:

- README:`Quick Start`(dev:web/dev:cms 启动前置:需各自 env)、脚本表(与根
  package.json 完全一致)、目录树(加入 payload 路由、media、data、content/locales)、
  「已知决策」链接到 ADR。
- 校验根 `package.json` 脚本集合与 README 表一一对应。
- 依 §7 执行全部验收,产出验收报告(可追加在 Spec 或单独
  `docs/specs/foundation-hardening-acceptance.md`)。
- 提交规范:分功能提交,T2 一次性格式化单独提交;生成物(锁文件、类型)如实入库;
  不提交 `.env*`(仅 `.env.example`)。

自检:§7 全绿。

---

## 6. 技术约束与风险预案

1. **Payload 稳定线**:严格 `payload@^3`(当前 3.85.x 线),锁文件固定;**禁止 4.x
   beta**。若官方模板在本轮执行期间升级主版本,记录并回退到 3.x 稳定 tag。
2. **pnpm 严格 peer / 不提升**:`shamefully-hoist=false`、`strict-peer-dependencies=true`
   可能导致 Payload 依赖解析报错。**预案顺序**:(a) 显式补齐缺失 peer 依赖;
   (b) 必要时在 `apps/cms/.npmrc`(局部)按官方指引添加 `public-hoist-pattern` /
   `node-linker` 白名单 —— 局部、最小、并写入 ADR/README;(c) 严禁根级
   `shamefully-hoist=true` 或 `--force`。
3. **Turbopack 兼容性**:Next dev 默认构建器与 Payload 若冲突,dev 用 webpack 启动并在
   README「已知限制」记录;待官方确认 Turbopack 支持后再切换。
4. **SQLite 文件路径**:以 `apps/cms` 为 cwd 的相对/绝对路径解析,避免 `pnpm -r`
   与 `--filter` 两种启动方式下路径漂移;README 写明启动方式一致性。
5. **Preview 跨应用**:web(:3000)与 cms(:3001)为两个 dev server;预览 token 校验
   只做「存在 + 能取回 draft」级别,不在本阶段做安全加固(公开站点对外发布前再评审)。
6. **一次性格式化范围**:T2 格式化会触碰全库文件;接受该噪音,但必须独立提交以利
   review 与回滚。

---

## 7. 验收标准(依 T1–T8 顺序)

| #   | 类别     | 命令 / 检查                                          | 通过标准                                                                                                       |
| --- | -------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| A1  | 自动化   | `pnpm lint`                                          | exit 0,无 error                                                                                                |
| A2  | 自动化   | `pnpm typecheck`                                     | exit 0                                                                                                         |
| A3  | 自动化   | `pnpm format:check`                                  | exit 0                                                                                                         |
| A4  | 自动化   | `pnpm test`                                          | exit 0,且含 i18n pt-BR/en 断言                                                                                 |
| A5  | HTTP     | 启动 `pnpm dev:web` 与 `pnpm dev:cms`(各自 env 就绪) | web `/` 200;cms `/admin` 200                                                                                   |
| A6  | CMS 认证 | seed 后浏览器登录 admin                              | 登录成功、进入 Dashboard                                                                                       |
| A7  | CMS 内容 | 后台创建 page(published)+ 上传 media                 | 列表可见;`GET :3001/api/pages` 匿名仅含 published;media 可访问                                                 |
| A8  | 预览     | draft page 触发「预览」                              | 打开 `:3000/preview/pages/{id}?...` 返回 200 并显示基础字段                                                    |
| A9  | 目录检查 | README / 文件系统                                    | 每端 public 就位;`content/locales/{pt-BR,en}.json` 存在且同构;`apps/cms/data                                   | media`被 ignore;无根级`tsconfig.base.json` 重复副本 |
| A10 | 文档检查 | grep / 阅读                                          | 无 `next lint` 残留;无 `defaultLocale='en'`/`locales=['en','zh']` 残留;ADR 与 README 同步;根脚本表 = README 表 |

A5–A8 为半自动(人工配合浏览器/curl),由执行方在验收报告中贴证据(curl 输出、
截图、日志)。

---

## 8. 交付物与归档(archive 阶段标准)

验收全绿后,按既有 spec → impl → archive 节奏:

- 归档内容:本 Spec + ADR + 验收报告;README 同步后作为新基线。
- 归档标记:git tag 或 release note(命名遵循仓库规范,如 `foundation-hardening-1`),
  具体格式由 owner 确认后执行。
- 遗留项 → §10 Backlog 滚动。

---

## 9. 实现 AI 角色边界(硬约束)

1. 只执行 §5 任务;发现 Spec 与现实的冲突(依赖版本、官方模板差异等)→ **停下询问**,
   不得擅自扩大或改写决策(尤其 §2.2 禁止项)。
2. 涉及跨端协议/共享契约变更(如 env 命名、REST 形态、包导出)→ **三方同步**:
   spec(本文档)→ 实现 → 文档(README/ADR)必须一致更新。
3. 交付时报告三件事:改了什么、还剩什么、被阻塞的决策;不编造验收结果,附证据。
4. 不做 §2.2 中任何「顺手加一下」的改动;如需建议 → 写进 Backlog。

---

## 10. Backlog(滚动,非本轮实现)

- [ ] Postgres 适配(首个生产部署时,AUREX 或首个外部客户确认后,按 ADR 后续决策执行)
- [ ] Payload 字段级 localization(双语内容真实出现后)
- [ ] 品牌视觉系统 / DS token / `@brand/ui` 正式组件化(Hallmark 缺口,待需求触发)
- [ ] 公共站消费 CMS 内容(页面渲染、ISR/revalidate)
- [ ] 正式测试体系与 CI(质量门禁稳定运行后)
- [ ] Turbopack 官方支持确认后切换 dev 构建器
- [ ] 若本轮 pnpm peer 冲突需局部放宽 → 归入 ADR 修订记录
