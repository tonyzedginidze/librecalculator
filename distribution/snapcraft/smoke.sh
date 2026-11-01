#!/usr/bin/env bash
set -euo pipefail
snap run librecalculator > distribution-evidence/snap-launch.txt 2>&1 &
app_pid=$!
trap 'kill "$app_pid" 2>/dev/null || true' EXIT
for attempt in $(seq 1 30); do
  sleep 1
  if ! kill -0 "$app_pid" 2>/dev/null; then
    cat distribution-evidence/snap-launch.txt
    exit 1
  fi
  if xwininfo -root -tree | tee distribution-evidence/snap-windows.txt | grep -q 'Libre Calculator'; then
    sleep 5
    import -window root distribution-evidence/snap-ui.png
    exit 0
  fi
done
cat distribution-evidence/snap-launch.txt
exit 1
