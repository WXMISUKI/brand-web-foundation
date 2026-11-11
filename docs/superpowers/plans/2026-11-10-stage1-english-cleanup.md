# 阶段 1 英文内容与媒体清理实施计划

**Goal:** 清理英文候选文案与首页媒体中的中文混排和不合适展示，同时保护人工修改、来源记录和生产数据边界。

**Architecture:** 复用现有 `candidateCopyRepair`、`candidateMediaAltRepair` 和事务写入函数；通过独立 PostgreSQL/隔离 Payload 验证批次、并发、journal 和回滚。前台继续按 locale 做媒体映射，生产写入保持显式隔离限制。

**Tech Stack:** Next.js、React、Payload 3.93、PostgreSQL、Node test、Playwright。

**Spec:** `docs/superpowers/specs/2026-11-10-stage1-english-cleanup-design.md`

## Global Constraints

- 只替换精确匹配的历史英文名称、简介和序列化 alt。
- `owner-review / claimsVerified=false` 保持不变。
- 不推断型号、包装、定量规格、销售状态或 claims。
- 生产写入前必须有备份、维护窗口、事务保护、写后回读和回滚证据。
- 生产入口继续拒绝非隔离数据库。

## Review Focus

- 人工修改的名称、简介或 alt 不应被覆盖：由纯函数和数据库并发测试覆盖。
- 共享媒体或外键引用不应被单独修改：由预览与批次测试覆盖。
- journal/提交标记冲突不应造成隐式成功：由批次测试覆盖。
- 英文页面不应出现候选中文名称或序列化对象 alt：由文本和浏览器验收覆盖。
- 中文页面和真实中文包装展示不应被误清理：由 locale 回归覆盖。

### Task 1: 候选修复故障语义

**Files:**
- Modify: `scripts/repair-official-candidate-copy.mjs`
- Test: `tests/official-candidate-batch-postgres.test.mjs`

- [ ] 补齐提交标记写失败、提交状态未知和 journal 状态记录的隔离测试。
- [ ] 保持生产数据库与非 55439 端口拒绝。
- [ ] 运行批次测试；无专用数据库时明确记录 skipped/NOT-RUN，不连接生产库。

### Task 2: Payload 隔离回读

**Files:**
- Verify: `tests/official-candidate-payload-postgres.test.mjs`
- Verify: `tests/official-candidate-preview-postgres.test.mjs`

- [ ] 在一次性独立 PostgreSQL 上运行真实 Payload 迁移、单条修复、英文/中文回读和资源清理。
- [ ] 保留连接池显式释放，避免测试进程假死。
- [ ] 清理本次创建的临时实例、媒体和测试文件。

### Task 3: 英文首页媒体覆盖

**Files:**
- Verify/Modify as needed: `src/data/featured-media.mjs`, `src/data/hero-media-locale.mjs`, `src/components/interest.tsx`, `src/components/home-featured.tsx`
- Test: `tests/featured-media.test.mjs`

- [ ] 验证英文 Hero、兴趣区、精选卡片和产品/分类卡的实际媒体来源与 alt。
- [ ] 对示意图保留明确标识，对真实包装保留来源和中文标签说明。
- [ ] 不用生成图冒充产品材料；缺少合法素材时保留占位并记录覆盖缺口。

### Task 4: 阶段 1 范围验收

**Files:**
- Verify: `tests/featured-media.test.mjs`, locale/component tests, Playwright acceptance scripts
- Update: `docs/staged-execution-2026-11-10.md`

- [ ] 运行 typecheck、定向测试、locale/RTL 合同和英文/中文 390×844、1280×720 浏览器检查。
- [ ] 把结果按 `PASS-SCOPED`、`PARTIAL`、`WAITING-EXTERNAL` 写入阶段记录。
- [ ] 生产写入和部署保持未执行，直到获得维护窗口与明确授权。
