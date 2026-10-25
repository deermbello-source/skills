#!/usr/bin/env bash
# check-draft.sh FILE: exit 1 if an arithmetic claim in FILE is wrong.
set -euo pipefail
BELL="${BELL:-bell}"
if ! command -v "$BELL" >/dev/null 2>&1; then
  echo "bell not found: build bell-governance-core and set BELL=path/to/target/release/bell" >&2
  exit 2
fi
[ $# -eq 1 ] || { echo "usage: check-draft.sh FILE" >&2; exit 2; }
exec "$BELL" claims - < "$1"
