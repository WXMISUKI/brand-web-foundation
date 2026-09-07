# Enterprise Foundation Standard

This repository is the reusable base for brand websites with a public front end and an admin/content backend.

## 1. Repository naming rules

- Use lowercase kebab-case only.
- Use English only.
- Do not include spaces, Chinese, timestamps, or random suffixes.
- Do not encode tech stack in the product repo name unless the repo is a shared foundation.

Recommended names:

- Shared base: `brand-web-foundation`
- Product repo: `<brand>-web`
- Product platform repo: `<brand>-platform`
- Standalone backend repo: `<brand>-cms`
- Separate admin console repo: `<brand>-admin`

Current repo name is acceptable because it describes a reusable foundation instead of a single client.

## 2. Branch naming rules

Use short-lived branches. Keep `main` protected.

Recommended branch prefixes:

- `feature/<slug>` for new features
- `fix/<slug>` for bug fixes
- `hotfix/<slug>` for urgent production fixes
- `chore/<slug>` for maintenance work
- `docs/<slug>` for documentation only
- `refactor/<slug>` for internal code reshaping without behavior change
- `spike/<slug>` for short research branches that may be thrown away

Optional ticket format:

- `feature/123-home-hero`
- `fix/248-telegram-link`

Rules:

- lowercase only
- use kebab-case in the slug
- one purpose per branch
- branch names should be easy to read in GitHub and CI logs

## 3. Directory structure naming rules

Use lowercase kebab-case for every directory and file.

Recommended top-level structure:

```text
apps/
  web/
  cms/
packages/
  ui/
  config/
  lib/
  analytics/
  i18n/
content/
docs/
public/
scripts/
tests/
```

Rules:

- `apps/web` owns the public site.
- `apps/cms` owns content and admin/backend concerns.
- `packages/*` is for reusable code shared by apps.
- `content/` is for copy, legal text, and structured static content.
- `docs/` is for decisions, handoff notes, plans, and standards.
- Keep one responsibility per directory.

## 4. Initialization standards

Every new project copied from this foundation should start with the same baseline:

1. Fix the package manager and Node version.
2. Add `.editorconfig`, `.gitignore`, `.env.example`, and a lockfile.
3. Add lint, format, typecheck, test, and dev scripts before feature work.
4. Put public site config and backend config behind environment variables.
5. Keep external platform credentials out of the repo.
6. Document major irreversible decisions in `docs/decisions/`.
7. Keep handoff notes in `docs/handoff/`.
8. Keep product copy and legal copy separate from component code.
9. Add analytics and locale support early, even if the events are stubbed.
10. Keep the first release small enough to ship and review.

## 5. Team reuse standard

Use this repo as a template, not as a long-lived branch pile.

- New client or brand: create a new repo from the foundation.
- Shared baseline change: update the foundation repo once, then reuse it.
- Feature-specific work: branch off the project repo, not off the template forever.

## 6. Checklist for the next project

- [ ] Confirm brand name and repo name
- [ ] Confirm branch strategy
- [ ] Confirm runtime stack
- [ ] Confirm public site scope
- [ ] Confirm backend scope
- [ ] Confirm analytics scope
- [ ] Confirm locale scope
- [ ] Confirm content ownership
- [ ] Confirm deployment target
- [ ] Confirm legal and compliance scope

## 7. Notes for future decisions

When a choice is hard to reverse, write an ADR before implementation.
