# 独立系列页与种植方式索引实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 用现有 Payload 产品、分类和方案数据补齐独立产品系列入口与种植方式索引，消除 P3-B 的结构 GAP。

**Architecture:** 新增页面适配组件和路由，复用 `getSiteCatalogOverview`、`getSiteCatalogResults` 与 `solutions`；不新增 Payload collection、不生成新的产品 claims。所有页面继续通过 `LocalizedShell`、canonical/alternate、noindex 和当前语言边界。

**Tech Stack:** Next.js App Router、React/TypeScript、Payload read adapters、现有 CSS、Node `node:test` 合同测试。

**Spec:** `docs/superpowers/specs/2026-11-09-independent-reference-routes-design.md`

## Global Constraints

- 产品事实只能来自当前 Payload/FLBOOK 来源字段；不得复制 Haifa 配方、认证、案例或施用量。
- 不修改生产数据库结构，不重导生产数据库，不改变 `owner-review` / `claimsVerified=false`。
- 生产公开语言仍为 en/zh；CMS_EVAL 才开放预览语言；询盘保持 disabled；noindex 保持。
- 参考结构页面不得伪装成已完成的系列 claims、剂量、证书或下载资料。
- 保留当前工作区全部未提交改动。

## Review Focus

- 无效系列 slug 和无效方案 slug 必须是 404；由路由合同测试覆盖。
- en/zh counterpart、canonical、alternate 与查询参数不能丢失；由 SEO/路由测试覆盖。
- 320/390px 卡片、长标题、固定快捷栏不得造成根横向溢出；由 Playwright 生产回归覆盖。
- CMS_EVAL 预览语言可访问，但生产 `/he` 等非公开语言仍关闭；由预览切片和生产 smoke 覆盖。
- 空分类、无产品或内容仍需有可读空状态，不得渲染空白区域；由组件合同和浏览器检查覆盖。

### Task 1: 页面索引数据适配（已完成）

**Files:**
- Create: `src/data/reference-index.ts`
- Modify: `src/content/site-catalog.ts` only if a reusable category lookup is needed
- Test: `tests/reference-routes-contract.test.mjs`

**Interfaces:**
- Produces `referenceSeriesSlugs`, `referenceMethodSolutions`, and locale-safe label helpers.
- Consumes existing catalog categories/products and `solutions` without adding claims.

- [x] Write contract assertions for the three existing category slugs and the three `group=method` solution slugs.
- [x] Implement the data adapter with stable slugs and English/Chinese labels.
- [x] Verify invalid slugs are rejected before page rendering.

### Task 2: Product series index and detail pages（已完成）

**Files:**
- Create: `src/components/product-series-page.tsx`
- Create: `src/app/(localized)/[locale]/products/series/page.tsx`
- Create: `src/app/(localized)/[locale]/products/series/[slug]/page.tsx`
- Modify: `src/components/navigation-menu.tsx`, `src/components/mobile-menu.tsx`, `src/components/catalog-overview.tsx`
- Test: `tests/reference-routes-contract.test.mjs`

**Interfaces:**
- Routes consume `readyProductsLocale`, `getSiteCatalogOverview`, `getSiteCatalogResults`, and `LocalizedShell`.
- Detail pages accept only a known category slug and render existing product cards/source notes.

- [x] Assert `/en/products/series`, `/zh/products/series`, and known category detail routes return 200 with localized headings and links.
- [x] Assert invalid series routes return 404 and language counterparts preserve the series slug.
- [x] Implement index/detail views with an explicit source/review note and existing product cards.
- [x] Add navigation links without exposing preview-only locales.

### Task 3: Growing methods index（已完成）

**Files:**
- Create: `src/components/solutions-index-page.tsx`
- Create: `src/app/(localized)/[locale]/solutions/page.tsx`
- Modify: `src/components/navigation-menu.tsx`, `src/components/mobile-menu.tsx`, `src/components/interest-section.tsx`
- Test: `tests/reference-routes-contract.test.mjs`

**Interfaces:**
- Index consumes `solutions.filter(item => item.group === "method")` and links to existing detail routes.
- It uses `LocalizedShell` and counterpart path `/{locale}/solutions`.

- [x] Assert index exposes Open field, Greenhouse, and Fertigation in en/zh and preview locales.
- [x] Assert links reach existing method details and invalid details remain 404.
- [x] Implement responsive cards, empty-safe rendering, and navigation links.

### Task 4: Acceptance and deployment（已完成）

**Files:**
- Modify: `tests/reference-routes-contract.test.mjs`, `docs/reference-route-map.md`, `docs/reference-source-audit-2026-11-09.md`, `HANDOFF.md`, `tasks/todo.md`

- [x] Run `npm run typecheck`, `npm run check:locale`, `npm run test:rtl-css`, and focused route contracts.
- [x] Run CMS_EVAL preview slices with separate `PREVIEW_EVAL_URL` and production `PREVIEW_URL`.
- [x] Deploy only changed source files, run remote `npm run build` and `npm run prepare:standalone`, restart systemd, and verify `/api/ready`.
- [x] Run production smoke/SEO and Playwright at 390×844 and 1280×720; record root overflow, menu keyboard behavior, route clicks, canonical/alternate and 404 behavior.
- [x] Mark P3-B lightweight structure PASS-SCOPED; remaining P3 gates stay open.

## Checkpoint

Do not start inquiry enablement, formal language publication or noindex changes until Task 4 passes in production.

## Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Existing Payload categories differ from sample categories | High | Use existing catalog adapter and production smoke before deployment. |
| Long localized labels overflow cards | Medium | Use bounded card titles, responsive CSS and 320/390 checks. |
| New links expose incomplete preview locales | High | Reuse `LocalizedShell` and `alternate-links` public boundary. |
| Series pages imply unsupported agronomic claims | High | Render only existing source-backed product text and review notes. |

## Open Questions

- The implementation follows the recommended lightweight route decision from the preceding design document; if the user later selects the full content-model option, this plan must be replaced before adding Payload collections.
