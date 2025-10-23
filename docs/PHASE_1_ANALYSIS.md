# Phase 1 — Analysis & Strategic Roadmap

## Project summary
- Core: Next.js 14 (pages API + app router intent), TypeScript, Tailwind, shadcn/ui, Playwright, Prisma/PostgreSQL, NextAuth, Stripe, SendGrid, PWA.
- Domain: Pavement Performance Suite — quoting, scheduling, GPS/time tracking, fleet/equipment, invoices, reports, weather guidance, achievements/leaderboards.

## Key findings (gaps, breakages, risks)
- Routing mismatch: `layout.tsx` and `page.tsx` live at repo root instead of `app/` (not picked up by Next app router). `pages/api/*` exists; dashboard pages like `/dashboard`, `/theme` are referenced but not implemented.
- Broken imports/aliases: Many imports use `@/components/...` but related files are at repo root (e.g., `dashboard-header.tsx`, `dashboard-sidebar.tsx`, `providers.tsx`, `theme-provider.tsx`, `pwa-installer.tsx`). No `tsconfig.json` path aliases.
- Auth missing: Components use `next-auth` but there’s no NextAuth route/config or type augmentation.
- Prisma misconfigured: `schema.prisma` generator outputs to an absolute path outside repo; no `lib/prisma.ts`; seeding script referenced but missing.
- Logger missing: `lib/email.ts` imports `@/lib/log` and `@/lib/flags`, which do not exist.
- Tailwind config missing: `tailwind.config.ts` missing; `components.json` references `app/globals.css` but actual file is `globals.css` at root.
- Docker inconsistencies: Dockerfile expects standalone output and `server.js` but `next.config.js` doesn’t set `output=standalone` by default; missing `.dockerignore`.
- Env management: No `.env.example`; env vars used but undocumented: `NEXT_PUBLIC_OPENWEATHER_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `SENDGRID_API_KEY`, `EMAIL_FROM`, `STRIPE_SECRET_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL`.
- Linting a11y: eslint is present, but no explicit `eslint-plugin-jsx-a11y` flat config.
- Theme UX: Theme presets exist; no theme customization page; no wallpaper uploads/persistence.
- Tests: Unit tests exist for utils/materials/weather; no auth/integration basics or e2e coverage of critical flows.

## Improvement & completion plan (prioritized)
1) Restore app routing and fix imports
- Create `app/` with `layout.tsx`, `page.tsx`, `dashboard/page.tsx`; add wrapper files under `components/*` to match current imports. Add `tsconfig.json` with aliases.

2) Authentication with NextAuth + Prisma
- Add credentials provider with bcrypt; Prisma adapter; session role typing; secure session callbacks.

3) Prisma client and seed
- Fix `schema.prisma` generator target; create `lib/prisma.ts` and `scripts/seed.ts` (admin user, demo data); keep idempotent.

4) Infra/devex
- `.env.example`, tailwind config, ESLint flat config with a11y, Prettier; `.dockerignore`; fix Dockerfile to force `standalone` build.

5) Logging + feature flags
- Implement `lib/log.ts` (structured, server/client aware) and `lib/flags.ts` with env-backed flags; integrate into email and other modules.

6) Theme customizer + wallpapers
- Add `/theme` page to pick presets, adjust brand colors, and upload/customize wallpapers with local persistence.

7) CI and templates
- GitHub workflow: install, lint, build, test, Playwright (headed off); audit; CodeQL; caching. Issue/PR templates.

8) Tests
- Add minimal auth integration tests and page-render smoke tests; ensure existing tests pass; add E2E stubs for login -> dashboard flow.

9) Docker compose polish
- Ensure compose dev works with Postgres; run prisma migrations on container start.

## Phased implementation roadmap

| Priority | Task Description | Task Type | Files to Modify/Create |
|---|---|---|---|
| P0 | Create `app/` router and wrappers, fix aliases | Refactor/Fix | `app/layout.tsx`, `app/page.tsx`, `app/dashboard/page.tsx`, `components/* wrappers`, `tsconfig.json` |
| P0 | Implement NextAuth (credentials + Prisma) | Max-Feature | `pages/api/auth/[...nextauth].ts`, `types/next-auth.d.ts`, `auth-form.tsx` (if needed) |
| P0 | Fix Prisma generator, add client and seed | Fix/Refactor | `schema.prisma`, `lib/prisma.ts`, `scripts/seed.ts`, `package.json` |
| P0 | Add log and flags utilities | New-Feature | `lib/log.ts`, `lib/flags.ts`, integrate in `lib/email.ts` |
| P1 | Add `.env.example`, ESLint/Prettier configs (a11y) | Refactor | `.env.example`, `eslint.config.mjs`, `.prettierrc` |
| P1 | Tailwind config and reconcile CSS paths | Fix | `tailwind.config.ts`, `components.json` (optional) |
| P1 | Docker: enforce standalone build and ignore context | Fix | `Dockerfile`, `.dockerignore` |
| P1 | Theme customizer with wallpapers | Max-Feature | `app/theme/page.tsx`, reuse `lib/theme-presets.ts` |
| P2 | CI + templates | New-Feature | `.github/workflows/ci.yml`, `.github/ISSUE_TEMPLATE/*`, `.github/PULL_REQUEST_TEMPLATE.md` |
| P2 | Tests: auth integration + e2e smoke | New-Feature | `tests/*`, `playwright.config.ts` |
| P3 | Compose polish: auto-migrate on up | Optimization | `docker-compose.yml`, `scripts/entrypoint.sh` (optional) |

Notes: All changes are idempotent, avoid deletion, add wrappers to prevent breaking existing imports. Security-by-design: no secrets committed; role-aware sessions; rate-limited endpoints (future step). Observability: simple structured logging baseline now, pluggable later.
