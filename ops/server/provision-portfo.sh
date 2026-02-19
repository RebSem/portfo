#!/usr/bin/env bash
set -euo pipefail

DEPLOY_USER="deploy"
DEPLOY_GROUP="deploy"
REPO_URL="${1:-https://github.com/RebSem/portfo.git}"
APP_DIR="/var/www/portfo/app"
DATA_DIR="/var/www/portfo/data"

as_deploy() {
  runuser -u "$DEPLOY_USER" -- bash -lc "$1"
}

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y \
  ca-certificates \
  curl \
  git \
  docker.io \
  docker-compose-plugin \
  certbot \
  python3-certbot-apache

systemctl enable --now docker

if ! getent group "$DEPLOY_GROUP" >/dev/null; then
  groupadd "$DEPLOY_GROUP"
fi

if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash -g "$DEPLOY_GROUP" "$DEPLOY_USER"
fi

usermod -aG docker "$DEPLOY_USER"

mkdir -p "$APP_DIR" "$DATA_DIR"
chown -R "$DEPLOY_USER:$DEPLOY_GROUP" /var/www/portfo

if [ ! -d "$APP_DIR/.git" ]; then
  as_deploy "git clone '$REPO_URL' '$APP_DIR'"
else
  as_deploy "cd '$APP_DIR' && git fetch origin && git pull --ff-only origin main"
fi

as_deploy "mkdir -p '$DATA_DIR'"

as_deploy "cd '$APP_DIR' && docker compose up -d --build"

a2enmod proxy proxy_http rewrite headers

echo "Provisioning complete. Next steps:"
echo "1) bash ops/server/install-apache-vhost.sh"
echo "2) certbot --apache -d rebsem.ru -d www.rebsem.ru"
echo "3) bash ops/server/install-prewarm.sh"
