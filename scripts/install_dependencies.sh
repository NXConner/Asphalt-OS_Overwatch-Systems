#!/usr/bin/env bash
set -euo pipefail

# Idempotent dependency installer

if command -v pnpm >/dev/null 2>&1; then
  PM=pnpm
elif command -v npm >/dev/null 2>&1; then
  PM=npm
else
  echo "No package manager found (npm/pnpm). Install Node.js 18+." >&2
  exit 1
fi

if [ -f pnpm-lock.yaml ]; then
  pnpm install --frozen-lockfile || pnpm install
elif [ -f package-lock.json ]; then
  npm ci || npm install
else
  npm install
fi

# Setup Husky pre-commit if available
if [ -d .git ]; then
  npx --yes husky >/dev/null 2>&1 || true
  npx --yes husky init >/dev/null 2>&1 || true
  mkdir -p .husky
  cat > .husky/pre-commit <<'HOOK'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint --silent || exit 1
HOOK
  chmod +x .husky/pre-commit
fi

echo "Dependencies installed."
