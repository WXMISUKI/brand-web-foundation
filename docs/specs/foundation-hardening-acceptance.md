# Foundation Hardening — Acceptance Report (A1–A10)

- **Date**: 2026-09-07
- **Repo**: `brand-web-foundation`
- **Spec**: `docs/specs/foundation-hardening-spec.md`
- **ADR**: `docs/decisions/0001-payload-cms-sqlite-i18n-baseline.md`
- **Status**: PASSED (All 10 criteria verified)

---

## Acceptance Verification Matrix

| #       | Category    | Test / Check Command                                | Result            | Evidence / Details                                                                                                                                                     |
| ------- | ----------- | --------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A1**  | Automated   | `pnpm lint`                                         | **PASS** (Exit 0) | Single-source ESLint 9 flat config (`eslint.config.mjs` + `@brand/config/eslint`). Deprecated `next lint` removed.                                                     |
| **A2**  | Automated   | `pnpm typecheck`                                    | **PASS** (Exit 0) | All 7 workspace packages + 2 apps (`apps/web`, `apps/cms`) typecheck cleanly with TypeScript 5.8+.                                                                     |
| **A3**  | Automated   | `pnpm format:check`                                 | **PASS** (Exit 0) | Prettier configuration committed (`.prettierrc`, `.prettierignore`). All files formatted cleanly.                                                                      |
| **A4**  | Automated   | `pnpm test`                                         | **PASS** (Exit 0) | Vitest test runner integrated (`vitest run`). 9 tests passed across 2 test suites (`packages/lib/src/cn.test.ts`, `packages/i18n/src/config.test.ts`).                 |
| **A5**  | HTTP        | Dev server startup (`pnpm dev:web`, `pnpm dev:cms`) | **PASS** (200 OK) | Web server ready on `http://localhost:3000` (200 OK); CMS Payload Admin ready on `http://localhost:3001/admin` (200 OK).                                               |
| **A6**  | CMS Auth    | Admin Seed & Login                                  | **PASS**          | `payload.config.ts` `onInit` hook seeds default admin user (`admin@example.com` / `changeme123`) idempotently.                                                         |
| **A7**  | CMS Content | Collections & Access Control                        | **PASS**          | `users`, `media`, `pages` collections configured with proper function-based access control. Anonymous REST GET `/api/pages` returns published pages only.              |
| **A8**  | Preview     | Draft Preview Channel                               | **PASS**          | Live Preview configured in `pages` collection pointing to `http://localhost:3000/preview/pages/[id]`. Route validates draft token and renders page data.               |
| **A9**  | Directory   | Asset & TS Single Source Check                      | **PASS**          | Single TypeScript base config in `packages/config/typescript/base.json`. `content/locales/{pt-BR,en}.json` created. `apps/cms/data/` and `apps/cms/media/` gitignored. |
| **A10** | Doc Check   | Verification & Cleanup                              | **PASS**          | No `next lint` remaining. No `en`/`zh` i18n defaults remaining. README updated with script matrix, directory rules, and ADR links.                                     |

---

## Detailed Task Accomplishments (T1–T8)

1. **T1 — ESLint Real Wiring**:
   - Upgraded to root ESLint 9 flat config (`eslint.config.mjs`).
   - Defined shared base rules in `packages/config/eslint/base.js` using `@eslint/js` and `typescript-eslint`.
   - Replaced all package `"lint"` scripts from `echo` or `next lint` to `eslint .`.

2. **T2 — Prettier Configuration**:
   - Added root `.prettierrc` (single quotes, trailing commas, 2 space indent, LF).
   - Added `.prettierignore` ignoring `node_modules`, `.next`, `dist`, `apps/cms/data`, `apps/cms/media`, etc.
   - Formatted repository with `pnpm format`.

3. **T3 — TypeScript Single Source**:
   - Removed duplicate root `tsconfig.base.json`.
   - Consolidated TypeScript base configuration into `@brand/config/typescript/base` (`packages/config/typescript/base.json`).
   - Extended `@brand/config/typescript/base` across all package and app tsconfigs.

4. **T4 — Test Framework**:
   - Integrated Vitest (`^3.0.0`) as lightweight test runner.
   - Added unit tests for `@brand/lib` (`cn()`) and `@brand/i18n` (`defaultLocale`, `locales`, `isValidLocale`).

5. **T5 — i18n Baseline**:
   - Single-source locale configuration in `@brand/i18n`: `defaultLocale = 'pt-BR'`, `locales = ['pt-BR', 'en']`.
   - Added locale catalogs in `content/locales/pt-BR.json` and `content/locales/en.json`.
   - Updated `apps/web/src/app/layout.tsx` to read `defaultLocale` from `@brand/i18n` (or `NEXT_PUBLIC_DEFAULT_LOCALE` env var).

6. **T6 — Payload CMS 3.x Integration**:
   - Embedded Payload 3.x into `apps/cms` via Next.js App Router integration (`(payload)` route group).
   - Integrated `@payloadcms/db-sqlite` with SQLite database file at `apps/cms/data/payload.db`.
   - Configured `users` (auth + roles), `media` (upload directory at `apps/cms/media/`), and `pages` (drafts + live preview).
   - Implemented idempotent seed in `payload.config.ts` (`onInit`).

7. **T7 — Boundary & Directory Standardization**:
   - Cleaned up obsolete Tailwind v3 JS preset dead config.
   - Fixed `@brand/ui` `Button` component with standard Tailwind utility classes and `TODO(design-system)` marker.
   - Documented directory conventions for static assets, copy, media, and SQLite DB in `README.md`.

8. **T8 — Documentation & Acceptance**:
   - Updated `README.md` with complete quick start, script table, project structure, asset conventions, and ADR-0001 references.
   - Generated this acceptance report confirming A1–A10 PASS.

---

## Out-of-Scope (Verified Retained in Backlog)

- ❌ No design system visual tokens, custom fonts, or expanded UI component library created.
- ❌ No Postgres adapter or cloud storage plugins added (SQLite adapter isolated in `payload.config.ts`).
- ❌ No `next-intl` or complex routing middleware added.
- ❌ No AUREX-specific business pages or custom content models.
