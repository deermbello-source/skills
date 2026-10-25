---
name: check-math
description: Check arithmetic and algebra exactly before answering, using the `bell` checker (exact rational arithmetic, no floating point). Use when an answer contains calculations, a derivation, equation solving, or step-by-step math, or when the user asks to verify math.
---

# Check Math

`bell` decides math exactly or says it cannot. Never report math as verified unless `bell` exited 0.

## Setup

```sh
git clone https://github.com/deermbello-source/bell-governance-core
cd bell-governance-core && cargo build --release
export BELL=$PWD/target/release/bell
```

## Arithmetic in a draft answer

```sh
$BELL claims "So there are 116*117 = 13192 pairs."
# or a whole draft:  scripts/check-draft.sh draft.md
```

- Exit 0: every claim found is correct.
- Exit 1: a claim is `wrong`. The JSON gives `value` (exact) and `stated`. Fix it and re-run.
- Only claims with numbers on both sides are checked. `rounded` and `skipped` are not errors.

## A derivation, one step per line

```sh
$BELL verify "x^2 = 2x" "x = 2"
```

| verdict | meaning | action |
|---|---|---|
| `equal`, `equivalent` | step is exact | keep |
| `implies` | true forward, loses no solution; converse may fail (`converse_fails_at`) | keep; check for extra solutions at the end |
| `invalid`, `not_equal` | wrong; `counterexample` / `at` shows where | fix the step |
| `undecided` | not decided | do not call it verified; say so |
| `unreadable`, `incomparable` | line did not parse, or expression vs equation | rewrite the line |

Undecided steps can go to Lean with Mathlib (setup once: `scripts/setup-lean.sh`, then export `BELL_LEAN_PROJECT`):

```sh
$BELL verify --lean "x > 2" "x > 1"     # undecided -> implies, method "lean (Mathlib)"
```

Lean upgrades a step only when it proves it with no `sorry`; a step it cannot prove stays `undecided`. Division, roots and logs carry their side conditions (`d ≠ 0`, `0 ≤ r`, `0 < a`), so Lean's `x / 0 = 0` never proves a step.

Syntax: `*` or implicit (`2x`, `2(x+1)`), `^`, `/`, `sqrt(..)`, `=`, `<`, `<=`, `>`, `>=`. LaTeX `\frac`, `\cdot`, `\sqrt` is accepted.

## Workflow

1. Draft the answer.
2. Run `claims` on the draft and `verify` on each derivation.
3. Fix every `wrong`, `invalid`, `not_equal`. Re-run until exit 0.
4. In the answer, state what `bell` checked and anything left `undecided`.

## Recorded checks

With a server running (`$BELL serve --state-dir DIR`), `$BELL record "x^2 - 9 = 0"` commits a reading with a receipt. `$BELL audit --state-dir DIR` re-checks a state directory offline: exit 0 only if receipts, chain and every reading hold.
