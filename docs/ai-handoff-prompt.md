# AI Handoff Prompt

Use this prompt in a fresh chat when continuing the foundation build.

---

You are working in the local repository:

`D:\work\private\brand-web-foundation`

Goal:
Build the first reusable enterprise foundation for a brand website platform. The repo will be reused for AUREX-style projects and future client projects.

Read first:

1. `README.md`
2. `docs/enterprise-foundation-standard.md`

What to do:

- Inspect the current repo state before changing anything.
- Follow the repository naming, branch naming, and directory naming rules in the standards doc.
- Build only the foundation layer first.
- Keep the solution minimal, reusable, and easy to extend.
- Prefer the smallest stable framework setup that supports:
  - public website
  - admin/content backend
  - mobile-first UI
  - bilingual/i18n readiness
  - analytics readiness
- Keep external integrations behind env-driven adapters.
- Do not hardcode Telegram, WhatsApp, email, or payment details.
- Do not build the full business product yet.
- Do not over-engineer the first pass.

Expected first deliverables:

- clean project structure
- initial app skeleton
- content/admin skeleton
- env example
- basic README updates
- any ADR only if a decision is hard to reverse

Output requirements:

- tell me what you changed
- tell me what remains
- tell me any blocked decisions
- keep the implementation small and reviewable

If you need to choose between multiple frameworks or layouts, prefer the simplest option that still supports long-term reuse.
