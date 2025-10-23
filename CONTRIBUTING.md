## Contributing

- Create a topic branch off `main`.
- Ensure lint and tests pass: `npm run lint && npm test`.
- Add or update tests for your changes.
- Submit a PR with a clear description and checklist.

### Commit style
- Conventional style preferred (feat, fix, chore, docs, refactor, test, perf).

### Dev setup
- Copy `.env.example` to `.env`.
- `bash scripts/install_dependencies.sh`.
- `npx prisma migrate dev && npm run seed`.

### Code quality
- ESLint (with a11y) and Prettier enforced via pre-commit (Husky).
