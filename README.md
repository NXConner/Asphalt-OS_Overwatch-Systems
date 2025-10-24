# Pavement Performance Suite

Production-ready Next.js 14 application for asphalt paving operations: quoting, scheduling, GPS/time tracking, fleet & equipment, invoices, reporting, weather intelligence, and payments.

## Tech Stack
- Next.js 14 (App Router + Pages API)
- TypeScript, Tailwind, shadcn/ui
- Prisma (PostgreSQL), NextAuth (credentials)
- Stripe (payments), SendGrid (email)
- Playwright, Jest
- Docker, GitHub Actions

## Quickstart
1. Copy env: `cp .env.example .env` and fill values.
2. Install deps: `bash scripts/install_dependencies.sh`.
3. Database: start Postgres (local or Supabase) and set `DATABASE_URL`.
4. Migrate + seed:
   - `npx prisma migrate dev` (create DB schema)
   - `npm run seed`
5. Dev server: `npm run dev` (If already running, restart dev server.)
6. Visit: `http://localhost:3000`.

## OpenAPI Docs
- Generate spec: `npm run openapi:gen` (outputs to `public/swagger.json`).
- View UI: `http://localhost:3000/api-docs`.

## Testing
- Unit: `npm test`
- E2E: `npm run test:e2e`

## Load Testing
- Requires k6: `k6 run scripts/load/k6-smoke.js` (BASE_URL can be overridden).

## Docker
- Build: `docker build -t pps .`
- Run: `docker run -p 3000:3000 pps`
- Compose (with Postgres): `docker compose up --build`

## Security
- No secrets committed. Use environment variables or a secrets manager in prod.

## Contributing
See `CONTRIBUTING.md`. PRs welcome.

## License
MIT. See `LICENSE`.
