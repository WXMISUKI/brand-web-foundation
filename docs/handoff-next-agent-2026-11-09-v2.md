# Haifa Reference Rebuild 下一位 AI 交接书（续）

更新时间：2026-11-09  
工作目录：`D:\work\private\haifa-reference-rebuild`  
分支：`codex/haifa-reference-rebuild`  
目标：继续完成当前持久目标，不重置或清理现有工作区。

## 先读这些文件

1. `AGENTS.md`
2. `HANDOFF.md`
3. `docs/current-stage-gate-2026-11-09.md`
4. `docs/dependency-security-release-2026-11-09.md`
5. `docs/translation-rollout-plan-2026-11-09.md`
6. `docs/open-issues-priority-discussion-2026-11-09.md`
7. 本交接书

旧交接文档 `docs/handoff-next-agent-2026-11-09.md` 仍是背景资料；本文件记录本轮之后的最新增量。

## 本轮已完成并验证

### Linux 依赖与 standalone 门禁

- WSL2 Ubuntu 24.04 已恢复，Linux kernel 为 `6.6.87.2-microsoft-standard-WSL2`。
- Linux Node `24.22.1`、npm `11.19.1` 已安装。
- 当前工作树被复制到隔离目录：`/home/dddsglyl/haifa-reference-linux-gate-20261109`。
- 使用官方 npm registry 执行冻结安装和 `npm rebuild esbuild`。
- Linux 审计结果：7 low、6 moderate、0 high、0 critical；没有执行 `npm audit fix --force`。
- Linux `typecheck`、部署文件检查、生产环境示例检查、locale 合同、官方候选合同通过。
- 隔离 PostgreSQL URL 下 `npm run build` 通过，Linux build ID：`DFpWegUM8opxdio-r9J9P`。
- `npm run prepare:standalone` 通过，复制 88 个 static 文件和 64 个 public 文件。
- standalone 实际加载 Sharp `0.35.5`；格式探测包含 jpeg/png/webp/tiff/magick。
- standalone 冷启动 health、favicon、抽样静态 JS 返回 200；`catalogSource=payload`、媒体检查为 true。
- 隔离数据库不存在，`/api/ready` 返回 503（database=false、media=true）是预期结果，不代表生产 readiness 失败。
- 证据已补入 `docs/dependency-security-release-2026-11-09.md`、`HANDOFF.md` 和 `tasks/todo.md`。

### 官方候选与正式产品边界

- 原官网候选仍为 28 条，详情页和图片 URL 均已验证可达。
- 21 条新增候选继续保持 `owner-review` / `claimsVerified=false`，不能自动批准。
- 3 组同名冲突仍独立记录：754921/754922、569687/569688、569693/569692。
- 当前目录只对已经进入公开目录的两组候选使用稳定 slug 合并；754921/754922 仍刻意不合并，测试已锁定该边界。
- 复合肥料仍缺可靠定量规格来源，保持空缺，不得推断数值。
- 正式 FLBOOK 10 条产品的 P2 门禁为 `ready:true`，76 条规格、审核字段和来源元数据保持通过。

### 多语言增量

当前 CMS staging/隔离 dry-run 已覆盖：`en`、`zh`、`es`、`fr`、`pt`、`ru`、`it`、`tr`。

- 第一批：`es/fr/pt/ru`，产品、公司、FAQ。
- 第二批：`it`，10 条产品、76 条规格标签、3 个分类、公司资料和 FAQ。
- 第三批：`tr`，10 条产品、76 条规格标签、3 个分类、公司资料和 FAQ。
- 本轮已将 FLBOOK 和核心页面本地化源改为可追加的 source list，后续语言只需新增数据文件并加入 source 数组。
- 当前新增文件：
  - `src/data/flbook-localizations-phase2-it.json`
  - `src/data/core-page-localizations-phase2-it.json`
  - `src/data/flbook-localizations-phase3-tr.json`
  - `src/data/core-page-localizations-phase3-tr.json`
  - `tests/flbook-localization-phase2-it.test.mjs`
  - `tests/core-page-localizations-phase2-it.test.mjs`
  - `tests/flbook-localization-phase3-tr.test.mjs`
  - `tests/core-page-localizations-phase3-tr.test.mjs`
- 受影响的 staging/验证脚本：
  - `scripts/prepare-flbook-payload.mjs`
  - `scripts/validate-flbook-import.mjs`
  - `scripts/import-flbook-payload.mjs`
  - `scripts/dry-run-flbook-payload.mjs`
- 当前最终验证：
  - 7 条 phase2/phase3 翻译合同测试通过。
  - `npm run validate:flbook` 通过。
  - `npm run typecheck` 通过。
  - `npm run dry-run:flbook` 通过，8 个 locale 的产品、规格、分类、公司、FAQ 均回读通过。
  - dry-run 中 76 条规格的数值和单位未改变，来源页、审核元数据和询盘空库约束通过。

## 当前未完成事项

按原持久目标顺序继续：

1. **逻辑变更边界与提交整理**
   - 当前工作区仍有大量既有未提交和未跟踪文件，不能 `reset`、`clean` 或批量暂存。
   - 依赖/standalone、FLBOOK staging、翻译、文档、浏览器证据和原型素材应分别审阅。
   - `origin` 仍指向 `brand-web-foundation.git`，不是本项目安全的远端；push 前必须复核。
   - 不要把既有用户修改整体塞进依赖升级提交；若需要提交，先按文件和 diff hunk 精确分组。

2. **继续 13 语言 CMS 内容**
   - 下一批按计划补 `th`、`nl`、`ro`、`el`、`he`，至少先完成产品、公司、FAQ。
   - 每个 locale 建独立 phase JSON 和回归测试，再跑 `validate:flbook`、`dry-run:flbook`、类型检查。
   - 不要把英语 fallback 当成人工翻译完成；翻译不得新增 claims、剂量、证书或销售承诺。
   - 首页、新闻、知识、案例、方案/作物指南和资源页的新增 CMS 内容仍未完成。

3. **21 条官方候选审核**
   - 需要业主确认型号、包装、销售状态、规格、claims 和三组同名关系。
   - 在没有正式资料前保持 `owner-review` / `claimsVerified=false`，不能通过脚本或名称相似度自动合并。

4. **依赖升级发布**
   - 工作区候选版本为 Next 16.4.5、Payload 3.93.0、Sharp 0.35.5；生产仍是旧版本。
   - Linux 构建门禁已通过，但没有生产部署授权。
   - 部署前仍需独立审阅依赖 diff、备份新鲜度、磁盘空间、上一版 standalone 回滚件和真实发布 commit/build ID。

5. **运维治理**
   - 备份/恢复脚本已有，自动排程、异地保留、失败告警、磁盘/readiness/systemd 监控、RPO/RTO 和定期恢复演练仍未收口。

## 已知验证限制

- 本地 SEO 合同在隔离开发服务器上 4/5：robots/sitemap、图片 alt、审核字段隔离、询盘写入通过；canonical 断言失败是因为本地服务返回 `http://localhost:3000`，测试固定要求生产域名。
- 生产历史证据为 SEO 5/5；不要为了让本地测试通过而把 canonical 改成固定生产域名或向生产重复写测试询盘。
- 询盘测试会写入本地 SQLite；若再次运行，必须使用隔离数据库并清理临时文件。
- 没有做真实人工母语、法律或农艺审校。

## 保护边界

- 不读取、打印或提交密钥、`.env` 内容、SSH 私钥。
- 不写生产 Payload、不执行全量生产 seed、不自动批准候选。
- 不执行 `npm audit fix --force`。
- 不删除 `.playwright-cli/`、`output/`、prototype/generated 图片，除非先确认归属和用途。
- 不把 HTTP 200、隔离 dry-run 或局部浏览器结果扩大解释为全站生产通过。
- 所有结论按 `PASS-SCOPED`、`PARTIAL`、`WAITING-EXTERNAL` 记录。

## 建议下一步命令

```powershell
rtk git status --short --branch
rtk git diff --check
rtk npm run validate:flbook
rtk npm run dry-run:flbook
rtk npm run typecheck
rtk npm run check:p2-release
rtk npm run check:official-candidates
rtk npm run test:official-candidates
```

下一语言切片完成后，再跑对应 phase 测试、`dry-run:flbook` 和 `git diff --check`。生产部署另开明确授权步骤。

## 建议技能

- `incremental-implementation`
- `test-driven-development`
- `git-workflow-and-versioning`
- `code-review-and-quality`
- `shipping-and-launch`
- `security-and-hardening`
- `observability-and-instrumentation`
- 多语言切片继续使用 `documentation-and-adrs`，涉及 UI 变化时再使用浏览器验收技能。
