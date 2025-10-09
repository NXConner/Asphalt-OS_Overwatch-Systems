## Project Summary

Lot Legends: PaveQuest overlays gamification onto the existing Asphalt OS business platform to transform estimating, scheduling, execution, QA, and invoicing workflows into engaging missions and quests. Built on Next.js 14, TypeScript, Tailwind, and a Prisma/Postgres backend, it adds an event-driven gamification layer with feature flags so all core workflows remain intact.

### Main Technologies (current)
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Radix UI
- Next-Auth
- Prisma (schema present) with Postgres
- PWA assets and service worker

### Gamification Layer (proposed)
- Frontend event bus and HUD components
- Rules engine mapping events → XP, achievements, quest progress
- Feature flags (game_mode, premium features)
- Data model for profiles, achievements, quests, skills, currencies, leaderboards

## Improvement & Completion Plan (Prioritized)
1) Implement feature flags and a global Game Mode toggle with persistent user pref.
2) Add lightweight frontend event bus; instrument core actions to emit events.
3) Add XP computation and leveling; profile HUD with XP bar and streaks.
4) Implement achievements and daily/weekly quests (config-driven).
5) Add team-only leaderboards with privacy-safe scopes and opt-out.
6) Add mission model mapped to jobs; mission logs and rewards.
7) Introduce puzzles (layout optimizer, routing) and weekly planning board.
8) Co-op parties, shared objectives, and party chat/comments.
9) Premium AI features (AR scan, generative layouts, forecast AI) gated by flags.
10) Observability of game metrics and fairness checks.

## Feature Maximization
- Estimating: AI-assisted layout, ADA compliance checks, accuracy XP, achievements.
- Scheduling: Route optimization challenges; weather-aware rescheduling.
- Execution: Safety streaks, equipment upkeep quests; photo QA puzzles.
- QA/Closeout: Compliance scoring, client sign-off quests, auto-invoice mission.
- Admin: Seasonal goals, configurable scoring weights, org-level controls.

## New High-Value Features
- Story Mode campaigns for flagship projects; seasonal battle pass with cosmetics.
- Client Portal “quests” for approvals and reviews.
- Training simulator (2D/VR) for crew onboarding and skill progression.

## Refactors/Fixes/Optimizations
- Centralized theming with presets; add a11y checks (eslint-plugin-jsx-a11y).
- Organize gamification state in `lib/gamification/*` modules with strong typing.
- Add idempotent scripts for setup, migrations, and seeding.

## Phased Implementation Roadmap

| Priority | Task Description | Task Type | Files to Modify/Create |
| --- | --- | --- | --- |
| P0 | Add feature flags and Game Mode toggle | Max-Feature | `components/game/GameModeToggle.tsx`, `dashboard-header.tsx`, `lib/gamification/flags.ts` |
| P0 | Event bus and base rules engine | Max-Feature | `lib/gamification/events.ts`, `lib/gamification/rules.ts` |
| P0 | HUD overlay (XP, quests, streaks) | Max-Feature | `components/game/HUD.tsx`, `globals.css` |
| P1 | XP/leveling, profile fields | Max-Feature | `lib/gamification/xp.ts`, `components/game/ProfileXP.tsx` |
| P1 | Achievements + daily/weekly quests | Max-Feature | `lib/gamification/achievements.ts`, `lib/gamification/quests.ts` |
| P1 | Team leaderboards | Max-Feature | `components/leaderboard-table.tsx` (enhance), `lib/gamification/leaderboard.ts` |
| P2 | Missions mapped to jobs | Max-Feature | `lib/gamification/missions.ts` |
| P2 | Puzzles: layout + routing | Max-Feature | `components/game/LayoutPuzzle.tsx`, `components/game/RoutePuzzle.tsx` |
| P3 | Co-op parties and shared objectives | New-Feature | `lib/gamification/parties.ts`, `components/game/PartyPanel.tsx` |
| P3 | Premium AI features (flags) | New-Feature | `lib/gamification/premium.ts` |
| P4 | Observability dashboards | New-Feature | `components/game/GameAnalytics.tsx` |

This roadmap preserves core workflows and lets users opt into fun overlays that drive quality, timeliness, and compliance.
