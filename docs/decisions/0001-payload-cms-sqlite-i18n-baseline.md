# ADR-0001: Payload CMS Integration + SQLite Baseline + i18n Baseline

- Status: Accepted
- Date: 2026-09-07
- Deciders: Project owner (direction & acceptance)
- Replaces: placeholder `apps/cms` Next.js scaffold
- Related spec: `docs/specs/foundation-hardening-spec.md`

## Context

The foundation repo (`brand-web-foundation`) is the reusable base for brand
websites (public front end + content/admin backend), to be reused first for the
AUREX-style project and future clients. Current state audit showed:

- `apps/cms` is a placeholder Next.js page, not a real CMS.
- i18n config points at `en`/`zh`, contradicting the confirmed Brazil-market
  direction (`pt-BR` default, `en` second).
- Shared tooling in `packages/config` is not consumed by any app/package.
- ESLint is not truly wired; there is no Prettier config; no test command exists.

Next-phase scope is "foundation hardening": quality gates, i18n baseline, CMS
boundary, and app/package boundary — not full product or visual design
(Hallmark pre-check: no design system work yet).

## Decision

### 1. CMS = Payload CMS 3.x, embedded in `apps/cms` (Next.js integration mode)

- Install Payload **stable 3.x** into the existing Next.js 15 app `apps/cms`.
  Do **not** adopt Payload 4 beta yet.
- Admin mounts at `/admin` inside the same Next.js app; Local API / REST are
  generated from a single `payload.config.ts` (code-first).
- Collections in this phase: built-in `users` (auth + access control),
  `media` (uploads / image management), `pages` (first real content model with
  `versions.drafts` so draft/publish and preview can be exercised).
- Access control stays function-based and minimal: public read only for
  published `pages`; write/scoped ops require an authenticated admin.
- Preview capability: Payload admin preview opens a minimal preview route on
  `apps/web` that validates the draft token and renders basic page fields.

Rationale: matches the confirmed option "formally integrate Payload CMS using
the Next.js integration mode; this phase establishes content models, auth,
permissions, media management, and preview." It keeps CMS and admin in the
monorepo, one codebase/deploy target, and avoids a self-built CMS abstraction
layer (Ponytail: nothing custom until a real need exists).

### 2. Database = SQLite via `@payloadcms/db-sqlite` (default), Postgres later

- Use the official SQLite adapter; DB file lives under `apps/cms/data/`
  (gitignored), path supplied by `DATABASE_URI` env var.
- Adapter selection is isolated to one import site in `payload.config.ts` so a
  future switch to `@payloadcms/db-postgres` is a one-file change.
- No Prisma/Drizzle usage in app code; Payload owns the data layer.

Rationale: zero-infrastructure dev experience for a foundation phase; keeps
environment requirements minimal until the first real deployment (AUREX)
justifies Postgres. Postgres remains the expected production target and is an
ADR follow-up, not a blocker.

### 3. i18n = baseline only (`pt-BR` default, `en` second), no routing library yet

- `@brand/i18n` becomes the single source of locale truth:
  `defaultLocale = 'pt-BR'`, `locales = ['pt-BR', 'en']` (default first).
- `apps/web` root layout/metadata read locale from the shared config (env
  override still allowed) and must stop hardcoding `en`/`zh` assumptions.
- Message-catalog skeleton lands in `content/locales/{pt-BR,en}.json`
  (copy stays out of component code, per repo standard). A loader is **not**
  built in this phase.
- URL strategy (`/` no-prefix default vs `/[locale]`, middleware redirects) is
  deferred and documented; adopting `next-intl` or `[lang]` segments is a
  future decision driven by AUREX page requirements.
- Field-level Payload localization is explicitly out of scope this phase.

Rationale: fix the wrong-locale contradiction now with minimal irreversible
surface; avoid locking a URL/routing scheme before real pages exist (Ponytail).

### 4. Shared tooling is actually consumed (`@brand/config` boundary)

- TS base config: single source in `packages/config/typescript/base.json`;
  every app/package tsconfig extends it (root duplicate removed).
- ESLint: flat config, single root `eslint.config.mjs` composed from the shared
  config in `packages/config`; root `pnpm lint` is the one entry point.
  Deprecated `next lint` is removed.
- Prettier: committed config at repo root (single source) so
  `pnpm format:check` passes.
- Tailwind v4 CSS-first: the v3-style JS preset in
  `packages/config/tailwind/preset.js` is obsolete and removed; design tokens
  will later live under the UI package as `@theme` once the design-system phase
  starts (Hallmark deferral).

Rationale: the boundary goal is "shared config is real and referenced", not a
bigger abstraction.

## Consequences

- Positive:
  - CMS/admin/content model reachable at `:3001/admin` with auth, media,
    draft/publish, and a preview path; public site can later consume CMS data.
  - Locale baseline aligns with the Brazil market and is easy to extend.
  - One lint/typecheck/format/test entry point; reproducible gates.
- Negative / constraints:
  - `apps/cms` build/dev requires `PAYLOAD_SECRET` + `DATABASE_URI` env vars.
  - Payload dependencies are heavy; install time and `apps/cms` dependency
    surface grow (accepted cost of a real CMS).
  - Draft preview needs `apps/web` to reach `apps/cms` over HTTP (REST) in dev;
    cross-app coupling is minimal and documented.
- Out of scope this phase (see spec for full list): Postgres, cloud storage
  plugin, field-level localization, next-intl/routing middleware, Turborepo/Nx,
  full test suite, UI component library expansion, design tokens, real brand
  visual work, CMS abstraction layer, and any AUREX-specific content model.
