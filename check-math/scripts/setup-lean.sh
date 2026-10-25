#!/usr/bin/env bash
# setup-lean.sh [DIR]: Lean + Mathlib for `bell verify --lean`. Prints the export line.
set -euo pipefail
DIR="${1:-$HOME/lean-steps}"
command -v elan >/dev/null 2>&1 || [ -x "$HOME/.elan/bin/elan" ] || \
  curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh | sh -s -- -y --default-toolchain none
export PATH="$HOME/.elan/bin:$PATH"
mkdir -p "$DIR" && cd "$DIR"
curl -sSf https://raw.githubusercontent.com/leanprover-community/mathlib4/master/lean-toolchain > lean-toolchain
cat > lakefile.toml <<'TOML'
name = "steps"
defaultTargets = ["Steps"]

[[require]]
name = "mathlib"
git = "https://github.com/leanprover-community/mathlib4"
rev = "master"

[[lean_lib]]
name = "Steps"
TOML
echo 'import Mathlib.Tactic' > Steps.lean
lake update   # fetches Mathlib's prebuilt cache (about 5 GB)
echo "export BELL_LEAN_PROJECT=$DIR PATH=\$HOME/.elan/bin:\$PATH"
