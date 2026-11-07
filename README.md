# brand-web-foundation

Reusable enterprise foundation for brand websites: public front end, content/admin backend (Payload CMS 3.x), and future growth paths.

## Quick Start

```bash
# Prerequisites: Node >= 22, pnpm >= 10
pnpm install

# Set up environment variables
cp .env.example .env

# Configure initial CMS admin seed credentials in .env:
# SEED_ADMIN_EMAIL=admin@example.com
# SEED_ADMIN_PASSWORD=your-secure-password-here

# Run dev servers
pnpm dev:web   # Public site → http://localhost:3000
pnpm dev:cms   # Admin panel → http://localhost:3001/admin
```

> ⚠️ **Security Notice**: Initial admin credentials must be configured via `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in your local `.env` file before initial startup. No hardcoded default credentials or secret fallbacks exist in code. Never commit production credentials or secret keys to source control.

## Project Structure

```text
apps/
  web/                     # Public website (Next.js 15, i18n via @brand/i18n, draft preview)
    src/app/
      layout.tsx           # Root layout with pt-BR default locale
      preview/pages/[id]/  # CMS Live Preview route for draft pages
  cms/                     # Admin & Content Backend (Payload CMS 3.x embedded)
    src/app/(payload)/     # Payload Admin & REST API mount routes (/admin, /api)
    src/collections/       # Content schemas: Users, Media, Pages (with drafts)
    src/payload.config.ts  # Payload configuration (SQLite, Lexical, Live Preview)
    data/                  # SQLite database storage (payload.db, gitignored)
    media/                 # Uploaded media assets (gitignored)
packages/
  ui/                      # Shared UI presentation components (@brand/ui)
  config/                  # Single-source ESLint flat config & TypeScript base (@brand/config)
  i18n/                    # Locale single source: pt-BR default, en second (@brand/i18n)
  analytics/               # Env-driven analytics event tracking adapter stub (@brand/analytics)
  lib/                     # General-purpose utilities e.g. cn() helper (@brand/lib)
content/
  locales/                 # Copy & text catalogs (pt-BR.json, en.json)
docs/
  decisions/               # Architecture Decision Records (ADR-0001)
  specs/                   # Engineering specifications (foundation-hardening-spec.md)
public/                    # Repository-level shared static assets
scripts/                   # Build and deploy scripts
tests/                     # End-to-end test suites
```

## Asset & Directory Conventions

- **App static assets**: `apps/web/public/`, `apps/cms/public/`
- **Repo-level static assets**: root `public/`
- **Copy & Locales**: `content/locales/` (`pt-BR.json`, `en.json`)
- **CMS Media Uploads**: `apps/cms/media/` (runtime generated, gitignored)
- **CMS SQLite Database**: `apps/cms/data/` (runtime generated, gitignored)

## Available Scripts

| Command             | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `pnpm dev`          | Start all apps in parallel                             |
| `pnpm dev:web`      | Start public site (port 3000)                          |
| `pnpm dev:cms`      | Start admin panel (port 3001)                          |
| `pnpm build`        | Build all apps                                         |
| `pnpm lint`         | Lint all packages and apps via root ESLint 9           |
| `pnpm typecheck`    | TypeScript type checking across all workspace projects |
| `pnpm format`       | Format codebase with Prettier                          |
| `pnpm format:check` | Check code formatting                                  |
| `pnpm test`         | Run unit & integration test suite via Vitest           |
| `pnpm clean`        | Clean build artifacts across all workspace projects    |

## Architecture & Key Decisions

- **CMS**: [ADR-0001](docs/decisions/0001-payload-cms-sqlite-i18n-baseline.md) — Payload CMS 3.x embedded in Next.js App Router.
- **Database**: SQLite via `@payloadcms/db-sqlite` for local dev; zero infra dependencies.
- **i18n**: Brazil market baseline (`pt-BR` default, `en` second); locale single-source in `@brand/i18n`.
- **Quality Gates**: Single-source ESLint 9 flat config, Prettier, TypeScript strict checking, Vitest.
- **Tailwind CSS**: v4 CSS-first `@import 'tailwindcss'`.

## Core Docs

- [Foundation Hardening Spec](docs/specs/foundation-hardening-spec.md)
- [ADR-0001: Payload CMS + SQLite + i18n Baseline](docs/decisions/0001-payload-cms-sqlite-i18n-baseline.md)
- [Enterprise Foundation Standard](docs/enterprise-foundation-standard.md)
- [AI Handoff Prompt](docs/ai-handoff-prompt.md)

## Working Rule

Read the standards doc before adding code. Keep architecture decisions small, reversible, and documented.
