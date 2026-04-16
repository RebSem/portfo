#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/portfo/app}"
ENV_FILE="$APP_DIR/.env"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
CACHE_FILE="${GITHUB_CACHE_FILE:-/app/data/github-cache.json}"
TOKEN="${GITHUB_TOKEN:-}"

if [ -z "$TOKEN" ]; then
  if [ -t 0 ]; then
    read -r -s -p "Enter GITHUB_TOKEN (input hidden): " TOKEN
    echo
  fi
fi

if [ -z "$TOKEN" ]; then
  echo "Error: GITHUB_TOKEN is empty."
  echo "Usage: GITHUB_TOKEN=... bash ops/server/setup-env.sh"
  exit 1
fi

if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  echo "Error: user '$DEPLOY_USER' not found. Run provisioning first."
  exit 1
fi

if [ ! -d "$APP_DIR" ]; then
  echo "Error: app dir '$APP_DIR' not found."
  exit 1
fi

umask 077
cat > "$ENV_FILE" <<EOT
GITHUB_CACHE_FILE=$CACHE_FILE
GITHUB_TOKEN=$TOKEN
EOT

chown "$DEPLOY_USER:$DEPLOY_USER" "$ENV_FILE" 2>/dev/null || chown "$DEPLOY_USER" "$ENV_FILE"
chmod 600 "$ENV_FILE"

echo "Written $ENV_FILE"
echo "Permissions: $(stat -c '%a %U:%G %n' "$ENV_FILE")"
