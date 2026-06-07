---
name: pre-structure
description: Generates a structure-first document that locks objects, relationships, constraints, and explicit negations before Claude Code touches a problem. Prevents trained abstraction substitution by establishing hard boundaries the session cannot cross. Use before any coding session where structural integrity matters, or when a prior session drifted from the intended design. See [REFERENCE.md](REFERENCE.md) for the document template, session preamble, and worked example.
---

# Pre-Structure

Run this before a coding session. Produces a document that gives Claude Code structure to work from instead of trained patterns to substitute in.

## Why

Claude Code is trained on labels and abstractions. Without prior constraints, it pattern-matches your problem to a trained abstraction and implements that instead of your structure. This protocol closes the substitution door before the session begins.

## Protocol

### 1. Lock every object

List every object in the problem by its exact name. No categories, no types — only the names as you intend them.

### 2. Define each object

For each object, write three things:

- **IS** — one sentence. Necessary and sufficient. What it is, not what it does.
- **IS NOT** — the 2–3 most tempting neighboring categories. Name them explicitly and exclude them.
- **Breaks if removed** — what fails structurally if this object doesn't exist. Not functionally — structurally.

### 3. State relationships as constraints

For every relationship between objects, write it as a constraint — not a description.

| Not this | This |
|---|---|
| X manages Y | X must read Y's state before any write to Z |
| A depends on B | A cannot be initialized without B holding state Q |
| C notifies D | If C changes, D must receive the change before any external call |

Constraint forms:
- **Precondition**: Before [action], [object] must have [state]
- **Ordering**: If [object A] changes, [object B] must be notified before [external action]
- **Exclusion**: [Object A] and [object B] cannot both hold [state] simultaneously
- **Existence**: [Object A] cannot exist without [object B] having [property]

### 4. List invariants

Conditions that must hold across all implementations, regardless of how the code is written. These are non-negotiable. If an implementation violates one, it is wrong regardless of whether it runs.

### 5. Write the boundary

Everything not named in this document is outside the problem. Claude Code is not permitted to introduce it.

### 6. Write the prohibition list

Name the 3–5 trained abstractions most likely to be substituted in. State which object each one would target. Mark them forbidden unless you explicitly approve.

## Output

Produce the filled pre-structure document using the template in [REFERENCE.md](REFERENCE.md).

Then paste the session constraint preamble from [REFERENCE.md](REFERENCE.md) above it before giving it to Claude Code.
