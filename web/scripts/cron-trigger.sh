#!/bin/bash
set -euo pipefail

WEB_DIR="/var/www/golden-msg/web"

cd "$WEB_DIR"

set -a
if [ -f "$WEB_DIR/.env" ]; then
  . "$WEB_DIR/.env"
fi
set +a

exec node "$WEB_DIR/scripts/cron-trigger.mjs"

