#!/usr/bin/env bash
set -euo pipefail
mkdir -p distribution-evidence
./result/bin/libre-calculator-desktop > distribution-evidence/nix-launch.txt 2>&1 &
app_pid=$!
trap 'kill "$app_pid" 2>/dev/null || true' EXIT
for attempt in $(seq 1 30); do
  sleep 1
  if ! kill -0 "$app_pid" 2>/dev/null; then
    cat distribution-evidence/nix-launch.txt
    exit 1
  fi
  if xwininfo -root -tree | tee distribution-evidence/nix-windows.txt | grep -q 'Libre Calculator'; then
    sleep 5
    import -window root distribution-evidence/nix-ui.png
    exit 0
  fi
done
cat distribution-evidence/nix-launch.txt
exit 1
