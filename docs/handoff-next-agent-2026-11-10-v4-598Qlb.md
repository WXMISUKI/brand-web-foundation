# Haifa/KOMU 开发交接书（2026-11-10）

## 接手摘要

当前项目仍在持续改进，未达到整体验收或发布完成状态。阶段一已有本地英文媒体修正及部分候选文案修复，但素材覆盖、真实 Payload 页面核验和生产数据精确回读尚未完成；阶段二至八仍待执行或待外部决策。当前总目标在 Codex 中为 `paused`，本交接书本身不代表恢复该目标，也不授权生产写入或部署。

工作区：`D:\work\private\haifa-reference-rebuild`；分支：`codex/haifa-reference-rebuild`。工作树有大量既有未提交和未跟踪内容；禁止 reset、clean、批量覆盖或大范围暂存。3131 本地预览服务当前仍在监听，PID 47712；服务存活不构成生产证据。

## 用户决定与待确认项

- 候选英文文案按精确旧值保护修复；人工改过的字段保留。修复执行前要先有数据库备份并核验写后回读。
- 用户选择在维护窗口短暂冻结候选产品编辑。具体日期、时间和时区尚未确定；选择冻结策略不代表已实际冻结。
- 英文目录保留真实产品包装，即使包装标签有中文，并配英文说明；不能替换成不对应产品的生成包装图。
- 作物场景可使用有来源和使用权依据的真实图片，或明确标为 AI 场景示意，不得描述成 KOMU 现场、产品效果或产品材料。
- 当前会话无内置图像生成工具。`imagegen` 技能要求内置工具不可用时不得自行切换到 CLI/API；CLI 需要用户明确选择且本机配置 `OPENAI_API_KEY`，不得在聊天索要密钥。Openverse 搜索连接超时；Wikimedia Commons 此前已限流，本轮未重试。
- 候选公开状态的文件记录有冲突：v3 交接书称用户已同意 21 条候选上架；但当前候选决策矩阵和外部决策包仍把部分决策列为待业主确认，生产记录仍是 `owner-review / claimsVerified=false`。下一位 AI 应先核对可信用户决定并同步文档，不能仅因“公开展示”把 claims、型号、规格、销售状态标为已核实。

## 阶段状态

| 阶段 | 当前状态 | 未完成的主要验收 |
| --- | --- | --- |
| 1. 英文候选文案与首页媒体 | `PARTIAL` | 兴趣区 22 张作物卡仅 8 张有匹配图片，3 张种植方式卡仅 1 张有图；真实 Payload 首页/详情仍需复核；21 条后台候选修复尚未写生产并回读；owner review 未完成。 |
| 2. Header 滚动收起 | `NOT STARTED` | 初始展开、滚动收起、回顶恢复；1280×720、390×844、Hebrew RTL；焦点、横向溢出和 console 验收。阶段顺序原则上等待阶段 1 收口。 |
| 3. 21 条候选目录决策与展示 | `WAITING-EXTERNAL / PARTIAL` | 先处理上方决策记录冲突，再核 schema、查询过滤、隔离验证、生产备份/写入/回读；保留 28 个来源、7 条交叉关系和 3 组同名关系。 |
| 4. 13 语言专业审校与回填 | `WAITING-EXTERNAL` | 母语、法律、农艺审校和逐语言签核；按 locale/slug/旧值保护回填及回读。现有草稿/validator 通过不等于人工审校。 |
| 5. 产品资料和素材权利 | `WAITING-EXTERNAL` | 逐产品确认来源、图片授权、规格和 claims；无证据的定量字段保持空。 |
| 6. 询盘治理与反垃圾 | `PARTIAL / WAITING-EXTERNAL` | 隐私版本、PII 保留/删除责任、限速、通知策略和响应 SLA 决策；目前人工后台处理，无 SMTP/CRM 送达证明。 |
| 7. 备份、监控与恢复 | `PARTIAL / WAITING-EXTERNAL` | 备份频率/保留/异地/加密、RPO/RTO、告警、恢复周期和 systemd 回滚策略确认；已有脚本与一次性隔离恢复不等于生产排程。 |
| 8. 综合验收和发布 | `NOT STARTED` | 只在前置阶段有范围明确的证据后执行，记录实际版本、部署、浏览器、CMS、询盘及运维结果。 |

## 最近已完成且有证据的本地工作

- `src/components/hero.tsx` 通过 `src/data/hero-media-locale.mjs` 将英文 Hero 精确匹配的 `technology.jpg` 替换为已记录来源的麦田图片；中文 Hero 和其他媒体不变。
- 英文蔬菜卡使用 `vegetables-prototype.webp`，保留 AI 场景标识。英文卡片其余无匹配素材者显示占位，不回退到带中文宣传图。
- 增加/更新 `tests/featured-media.test.mjs`；测试先失败后通过。最近已知 `npm run typecheck`、精选媒体定向测试、`git diff --check` 均通过。Playwright 在英文首页 1280×720、390×844 检查 Hero 背景，宽度无溢出且 console error 为 0；中文 Hero 保留原媒体。截图见 `output/playwright/stage1-hero-en-desktop-v2.png`、`stage1-hero-en-mobile-v2.png`。
- 阶段记录已追加本轮覆盖率和证据：[docs/staged-execution-2026-11-10.md](staged-execution-2026-11-10.md)。

本地/sample/隔离验证不得扩大为生产通过；没有 `npm build` 或生产发布。

## 中断时的未验证改动与风险

- `tests/official-candidate-batch-postgres.test.mjs` 在上轮中断前新增了“`.committed` 提交标记路径已存在时，必须在数据库变更前拒绝”的测试断言。该测试尚未运行，当前修复脚本也尚未加入对应提交前检查。不要把该断言描述为已通过。
- 批量修复及回滚脚本 `scripts/repair-official-candidate-copy.mjs`、`scripts/rollback-official-candidate-copy.mjs` 目前都明确限制到本地隔离数据库 `candidate_copy_test:55439`。不得为生产操作直接移除此限制。
- 已发现批量修复在数据库 `COMMIT` 成功后再创建 `.committed` 标记；若标记路径冲突或写盘失败，会出现数据库已提交而脚本报错/缺少提交标记的风险。当前测试只新增了已存在标记的复现意图；尚未建立临时 PostgreSQL、跑 RED 或实现修复。必须先完善故障记录/恢复语义，再讨论生产使用。
- 当前没有 `CANDIDATE_TEST_DATABASE_URL`，本机 55439 端口也未监听。上轮确认 PostgreSQL 二进制位于 `D:\postgreSQL\bin\`；可在全新临时目录建立隔离测试实例，结束后核实并停止，只清理本次创建的目录。不要连接生产库做测试。

## 首要接手步骤

1. 重新读项目 `AGENTS.md`、`HANDOFF.md`、本文件、阶段计划和决策矩阵；检查 `rtk git status --short --branch`。CodeGraph MCP 当前不可用，按项目约定用 `rg`/源码阅读；`rtk` 可用但无全局 hook。
2. 对 `tests/official-candidate-batch-postgres.test.mjs` 的新断言补实现和隔离 PostgreSQL 验证；特别覆盖标记路径冲突、COMMIT 后标记写失败和可恢复/人工核对状态。所有数据库集成测试必须指向本次专用临时实例。
3. 等用户提供候选编辑维护窗口日期、时间和时区；窗口前只做只读生产核对，不执行生产写入。窗口内还需真实生产备份、可验证备份完整性、逐项精确预览、编辑冻结、事务写入、Payload 回读、冲突处置与恢复预案。
4. 图片补充优先使用可核验授权的素材；不要重试已限流的 Commons。若需要图像生成 CLI/API，先取得用户明确选择；不要请求用户贴密钥。
5. 阶段一通过相应范围验收后，再推进 Header 滚动、候选展示决策、专业审校、询盘和运维闸门，最后综合验收。每次报告写清 `PASS-SCOPED`、`PARTIAL`、`WAITING-EXTERNAL` 或 `UNKNOWN` 的覆盖范围。

## 关键资料

- 阶段与证据总账：[docs/staged-execution-2026-11-10.md](staged-execution-2026-11-10.md)
- 前一份详细技术交接：[docs/handoff-next-agent-2026-11-10-v3.md](handoff-next-agent-2026-11-10-v3.md)
- 总体规格：[docs/spec.md](spec.md)
- 候选逐条决策：[docs/official-candidate-decision-matrix-2026-11-10.md](official-candidate-decision-matrix-2026-11-10.md)
- 外部决策清单：[docs/external-decision-packet-2026-11-10.md](external-decision-packet-2026-11-10.md)
- 作物素材许可与来源：[docs/third-party-crop-images-2026-11-10.md](third-party-crop-images-2026-11-10.md)
- 官方包装素材记录：[docs/official-source-asset-audit-2026-11-09.md](official-source-asset-audit-2026-11-09.md)
- 询盘治理：[docs/inquiry-governance-2026-11-10.md](inquiry-governance-2026-11-10.md)
- 运维连续性：[docs/ops-continuity-governance-2026-11-10.md](ops-continuity-governance-2026-11-10.md)

建议技能：`using-superpowers`、`handoff`、`test-driven-development`、`security-and-hardening`、`browser-testing-with-devtools`、`source-driven-development`、`shipping-and-launch`。生产执行和用户决策必须以本次会话最新明确授权为准。
