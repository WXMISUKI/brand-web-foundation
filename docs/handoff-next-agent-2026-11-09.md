# Haifa 项目下一阶段交接

更新时间：2026-11-09  
工作目录：`D:\work\private\haifa-reference-rebuild`  
分支：`codex/haifa-reference-rebuild`  
当前 HEAD：`8054e4d256981817a1225e2995aa4a7f09311b46`

## 项目目标

这是安徽康母国际化肥股份有限公司的品牌官网。Haifa 仅作为结构和交互参考；品牌、产品事实、图片及业务内容以业主资料和已核验来源为准。生产使用 Next.js、Payload、PostgreSQL 和 systemd。`brand-web-foundation/main` 是另一套基础工程，不要把本项目推送到它的远端。

## 当前状态

- 生产站点在此前核验时正常运行，依赖仍为 Next 16.3.5、Payload 3.92.0、Sharp 0.34.5；依赖升级尚未部署。生产旧锁文件官方审计曾有 4 high、2 critical。
- 当前工作区候选升级为 Next 16.4.5、Payload 3.93.0、Sharp 0.35.5，并覆盖 DOMPurify 3.4.17、happy-dom 21.0.4。官方 registry audit 当前为 7 low、6 moderate、0 high、0 critical。剩余问题在 Payload `deepmerge` 和 Drizzle/esbuild 依赖链；`npm audit fix --force` 会降级到不兼容版本，不要执行。
- 本次验证：`typecheck`、部署文件门禁、生产环境示例检查、FLBOOK 数据校验、第一批翻译测试、隔离 SQLite dry-run 均通过。dry-run 回读产品/规格、公司全局字段和 FAQ，保留数值、单位、来源及审核元数据。
- 生产构建在本地 `.env` 的 SQLite 设置下按配置规则失败；仅在构建子进程传入占位 PostgreSQL URL 后，构建成功，build ID 为 `vx8xwCXto9DzjLNNfiK6U`。`prepare:standalone` 通过，复制 88 个 static 文件和 64 个 public 文件，standalone 可解析 Sharp。此项不证明生产数据页或 readiness 通过。
- 本机无可用 WSL 或 Docker Linux engine，Sharp 的 Linux 原生运行库仍未验证。**这是依赖升级发布前的首要技术门禁。** 详见 `docs/dependency-security-release-2026-11-09.md`。
- 21 条官方候选名称和图片按业主决定继续展示；同名重复项已在本地目录合并为单卡，候选审核状态仍为 `owner-review` / `claimsVerified=false`。此目录修改未部署。型号、包装、销售状态和 claims 暂不作为已核验承诺。
- 询盘由 Payload 后台人工处理，不接邮件或 CRM，不承诺响应 SLA。目前只有一个后台账号，但所有后台账号都可查看处理。
- 13 语言翻译由 Codex 起草并自审。产品 UI 已有 13 locale；CMS 首批 `es/fr/pt/ru` 覆盖 10 条 FLBOOK 产品、公司介绍和 FAQ，并通过隔离验证。未写生产、未部署，也未做专业母语/法律/农艺审校。剩余工作见 `docs/translation-rollout-plan-2026-11-09.md`。

## 建议推进顺序

1. **完成 Linux 构建验证。** 先检查可用的 CI、Linux runner 或受控 Linux 构建环境；执行冻结锁文件安装、production build、`prepare:standalone`，冷启动并核对 Sharp、health、静态资源和实际可用的 CMS 页面。不要用本地 Windows 结果代替 Linux ABI 验证。
2. **整理变更边界。** 工作区已有较多未提交和未跟踪内容，涉及依赖升级、产品目录去重、翻译数据与测试、文档、原型/生成素材等。逐文件阅读 diff，确认归属后再拆分提交；不要 `reset`、`clean`、批量暂存或把全部改动塞进依赖升级提交。
3. **完成发布审阅与计划。** 依赖升级通过 Linux 门禁后，再确认生产备份新鲜度、磁盘空间、上一版 standalone 回滚件及发布后的 `/api/ready`、CSS/JS/favicon/媒体回读。生产目录没有 Git 元数据，发布记录需保留实际 commit 和 build ID。
4. **继续翻译核心询盘路径。** 按计划完成其他 locale 的产品、公司、联系、FAQ，再翻译首页及新闻、知识、案例、方案/作物指南和资源页 UI/CMS 内容。逐批验证字段覆盖、数值/单位、专名、链接及 RTL；不要让英语 fallback 冒充已翻译。
5. **后续单独处理业务内容审核。** 21 条候选仍需逐条核对型号、包装、在售状态和 claims；确认前不改变审核状态。询盘通知策略已确定为后台人工处理，不要重复询问或自行接入邮件/CRM。

## 保护边界

- 这一轮没有部署、没有写生产数据库、没有创建提交。
- 不运行全量 FLBOOK seed 到生产，不覆盖 Payload 后台人工编辑；未来回填必须按 slug、locale 和当前旧值做保护，并在独立库回读。
- 不删除工作区的 `.playwright-cli/`、`output/`、原型或生成图片；先确认用途和归属。
- 不输出或读取密钥、环境变量秘密或 SSH 私钥。生产操作要使用安全的密钥注入方式。
- 保留所有当前工作区差异；当前分支与 `origin` 的配置关系需在任何 push 前复核。

## 相关文档与命令

- 总体项目快照、生产边界和历史发布证据：`HANDOFF.md`、`docs/current-stage-gate-2026-11-09.md`、`docs/launch-acceptance-matrix.md`
- 依赖版本、构建证据和 Linux 发布门禁：`docs/dependency-security-release-2026-11-09.md`
- 13 语言范围、批次和翻译规则：`docs/translation-rollout-plan-2026-11-09.md`
- 常用本地检查：`npm run typecheck`、`npm run validate:flbook`、`npm run dry-run:flbook`、`npm run check:deployment:files`、`npm run check:production-env:example`
- 翻译回归：`node --experimental-strip-types --test tests/flbook-localization-phase1.test.mjs tests/core-page-localizations-phase1.test.mjs tests/product-ui-locales.test.mjs`

## 建议技能

先读取仓库 `AGENTS.md` 并检查实时 Git 状态。Linux 发布准备使用 `shipping-and-launch`、`security-and-hardening`、`git-workflow-and-versioning` 和 `code-review-and-quality`；继续多语言实现时使用 `incremental-implementation`、`test-driven-development`、`documentation-and-adrs`，并按每批风险加入浏览器验收。`grill-me` 仅用于出现新的业务决策时；已确认的候选展示、询盘处理和翻译范围无需重问。
