#!/usr/bin/env bash
set -euo pipefail

install -m 0644 ops/systemd/portfo-github-prewarm.service /etc/systemd/system/portfo-github-prewarm.service
install -m 0644 ops/systemd/portfo-github-prewarm.timer /etc/systemd/system/portfo-github-prewarm.timer

systemctl daemon-reload
systemctl enable --now portfo-github-prewarm.timer
systemctl status --no-pager portfo-github-prewarm.timer
