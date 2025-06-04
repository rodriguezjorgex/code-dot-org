#!/bin/bash
set -euo pipefail

# Discover Puma master PIDs
masters=$(ps -eo pid,ppid,cmd | grep 'puma' | grep -v 'worker' | grep -v grep | awk '$2 == 1 {print $1}')

for master in $masters; do
  label=$(ps -p "$master" -o cmd= | grep -oE '\[(dashboard|pegasus)\]' | tr -d '[]' || echo "unknown")
  echo "=== Workers for $label (master PID $master) ==="
  
  for pid in $(pgrep -P "$master"); do
    if [ -r "/proc/$pid/status" ]; then
      rss_kb=$(awk '/VmRSS/ {print $2}' /proc/$pid/status)
      rss_mb=$((rss_kb / 1024))
      echo "$rss_mb MB - PID $pid"
    fi
  done | sort -nr
done
