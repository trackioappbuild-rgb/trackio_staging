#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_dir"

codex_runtime="/Users/nick/.cache/codex-runtimes/codex-primary-runtime/dependencies"

if ! command -v node >/dev/null 2>&1 && [ -x "$codex_runtime/node/bin/node" ]; then
  export PATH="$codex_runtime/node/bin:$codex_runtime/bin/fallback:$PATH"
fi

if ! command -v git >/dev/null 2>&1 && [ -x "$codex_runtime/bin/fallback/git" ]; then
  export PATH="$codex_runtime/bin/fallback:$PATH"
fi

for tool in git node npm; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Missing required tool: $tool"
    echo "Install Node.js 24, then try again."
    exit 1
  fi
done

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "GitHub is not connected yet. Ask Codex to finish the deployment setup."
  exit 1
fi

if [ "$(git branch --show-current)" != "main" ]; then
  echo "Publish from the main branch only. Current branch: $(git branch --show-current)"
  exit 1
fi

echo "Synchronizing with GitHub..."
git pull --rebase --autostash origin main

echo "Installing locked dependencies..."
npm ci

echo "Running checks..."
DATABASE_URL="postgresql://trackio:trackio@localhost:5432/trackio" npm run db:validate
npm run lint
DATABASE_URL="postgresql://trackio:trackio@localhost:5432/trackio" npm run build

git add -A

if git diff --cached --quiet; then
  echo "Everything is already published."
  exit 0
fi

message="${1:-Update Trackio staging}"
git commit -m "$message"
git push origin main

echo "Published. GitHub checks will run, then Render will deploy automatically."
