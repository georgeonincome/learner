#!/usr/bin/env bash
# Lena local stack: Firebase emulators + stripe-mock + Next dev.
# No production keys required (audit decision D8). Logs in .cache/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .cache
if ! curl -s -m 2 http://127.0.0.1:9099/ >/dev/null; then
  firebase emulators:start --project demo-lena > .cache/emulators.log 2>&1 &
  echo "firebase emulators starting (pid $!) — log .cache/emulators.log"
fi
if ! curl -s -m 2 -o /dev/null http://127.0.0.1:12111/; then
  if [ ! -x .cache/bin/stripe-mock ]; then
    mkdir -p .cache/bin
    curl -sL -o .cache/bin/stripe-mock.tar.gz https://github.com/stripe/stripe-mock/releases/download/v0.1.13/stripe-mock_0.1.13_linux_amd64.tar.gz
    tar -xzf .cache/bin/stripe-mock.tar.gz -C .cache/bin
  fi
  .cache/bin/stripe-mock -port 12111 > .cache/stripe-mock.log 2>&1 &
  echo "stripe-mock starting (pid $!) — log .cache/stripe-mock.log"
fi
for i in $(seq 1 60); do curl -s -m 2 http://127.0.0.1:9099/ >/dev/null && break; sleep 2; done
node .cache/apply-schema.mjs 2>/dev/null || npx tsx scripts/migrate.ts
exec npm run dev
