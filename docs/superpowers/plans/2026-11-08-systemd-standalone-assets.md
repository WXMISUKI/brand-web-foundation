# Systemd standalone 静态资源准备 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 固化 Next standalone 构建后 `.next/static` 与 `public` 的复制和完整性校验，避免 systemd 部署出现 SSR 200 但静态资源 404。

**Architecture:** 新增一个无外部依赖的 Node 脚本，默认操作仓库 `.next`，也支持传入输出根目录；脚本只复制并校验，不删除目标目录。部署门禁检查脚本与 package 命令，运行手册记录 systemd 发布顺序。

**Tech Stack:** Node.js 22+/24+, Next.js standalone, npm scripts, PowerShell/Linux shell compatible paths.

**Spec:** `docs/superpowers/specs/2026-11-08-systemd-standalone-assets-design.md`

## Global Constraints

- 不 reset、clean、覆盖未提交改动，不重新导入生产数据库。
- 不读取、打印或提交密码、私钥、环境变量值和数据库连接串。
- 不删除 `.next/standalone`、生产媒体目录、数据库或上一版部署产物。
- 默认输出 `JSON` 摘要，失败使用非零退出码。

## Review Focus

- 缺少 `.next/standalone/server.js` 时必须失败；测试在 Task 1。
- 缺少 `.next/static` 或 `public` 时必须失败；测试在 Task 1。
- 目标目录已有文件时必须保留并覆盖同名构建产物；测试在 Task 1。
- Windows 与 POSIX 路径参数都能解析；测试在 Task 1。
- 部署门禁能阻止脚本/命令被误删；测试在 Task 2。

### Task 1: Standalone 资源准备脚本

**Files:**
- Create: `scripts/prepare-standalone.mjs`
- Modify: `package.json`

**Interfaces:**
- CLI: `node scripts/prepare-standalone.mjs [next-output-root]`
- Default root: `.next`
- Produces: `{ ok: true, outputRoot, standaloneRoot, copied: { static, public }, checks: [...] }`

- [ ] **Step 1: Create a temporary fixture with a standalone server, static file, and public favicon, and run the CLI against it; confirm it returns non-zero before required source/target files are complete.**
- [ ] **Step 2: Implement source/target checks and `fs.cp(..., { recursive: true, force: true })`; never remove directories; print only paths and counts.**
- [ ] **Step 3: Add `prepare:standalone` to `package.json` and run the fixture again; confirm the copied CSS/JS/favicon are readable from the standalone tree and existing unrelated files remain.**

### Task 2: Deployment gate and runbook

**Files:**
- Modify: `scripts/check-deployment-files.mjs`
- Modify: `docs/deployment-runbook.md`

**Interfaces:**
- `npm run check:deployment:files` must require `scripts/prepare-standalone.mjs` and the `prepare:standalone` package script.
- Runbook must place `npm run prepare:standalone` after `npm run build` and before systemd restart, then show local/public static URL checks.

- [ ] **Step 1: Extend the gate to read the script and package file, and fail with actionable messages when the command or copy contract is missing.**
- [ ] **Step 2: Document the non-destructive systemd sequence, including `api/ready`, CSS/JS/favicon HTTP 200 checks, and rollback instruction to keep the prior standalone directory untouched until checks pass.**
- [ ] **Step 3: Run the gate and documentation-related static checks.**

### Task 3: Verification

**Files:**
- No production files or databases.

- [ ] **Step 1: Run `npm run check:deployment:files`.**
- [ ] **Step 2: Run the temporary fixture script check, `npm run typecheck`, and `git diff --check`.**
- [ ] **Step 3: Re-read the diff and confirm no generated fixture, secret, database file, or media directory is tracked.**
