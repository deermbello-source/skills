# Pre-Structure — Reference

## Document template

```
# Pre-Structure Document

## Objects

| Object | IS | IS NOT | Breaks if removed |
|---|---|---|---|
| [exact name] | [one sentence — necessary and sufficient] | not [A], not [B], not [C] | [what fails structurally] |
| [exact name] | ... | ... | ... |

## Relationships

Constraints only. No descriptions.

- Before [action], [object] must have [state]
- If [object A] changes, [object B] must be notified before [external action]
- [Object A] and [object B] cannot both hold [state] simultaneously
- [Object A] cannot exist without [object B] having [property]

## Invariants

Conditions that hold across all implementations:

- [condition]
- [condition]

## Boundary

This document defines the complete scope. The following are outside it:

- [thing outside scope]
- [thing outside scope]

## Prohibition list

The following abstractions must NOT be applied without explicit approval:

| Abstraction | Would substitute for | Reason forbidden |
|---|---|---|
| [trained abstraction] | [exact object name] | [what it would wrongly impose] |
| [trained abstraction] | [exact object name] | ... |
```

---

## Session constraint preamble

Paste this above the pre-structure document when opening a Claude Code session.

```
---
STRUCTURE CONSTRAINT — READ BEFORE PROCEEDING
---

The following pre-structure document defines the complete scope and structure of this problem.

Rules:
1. Work from the objects and constraints in this document. Do not introduce abstractions,
   patterns, or concepts not present here.
2. If a pattern from your training seems applicable to any named object, name it explicitly,
   state which object it would apply to, and stop. Do not implement it.
3. If any object name is unclear, ask using that exact name. Do not infer what type of
   thing it is.
4. If you recognize any item from the prohibition list, name it and wait for approval
   before proceeding.
5. Do not introduce anything outside the defined boundary.

---
[PRE-STRUCTURE DOCUMENT]
---
```

---

## What structure-form statements look like vs. label-form

### Label-form (what Claude Code produces without the pre)

> "UserService manages authentication state"

This tells Claude what category to map to. "Service" triggers a trained pattern. "Manages" triggers ownership/lifecycle patterns. Claude now has a substitution target: any service pattern from training that handles auth state.

### Structure-form (what the pre produces)

> **IS**: The object that holds a verified identity token for the duration of a single request.
> **IS NOT**: not a session manager, not an auth provider, not a repository, not a middleware.
> **Breaks if removed**: No object can determine which identity is acting. Every write operation loses its accountability constraint.
> **Constraint**: Before any write operation proceeds, this object must be in state VERIFIED. If it is in state PENDING or ABSENT, the write must not occur.

Claude cannot substitute "UserService" with a trained service pattern because the structure names what the object holds, what it is not, and what the constraint is. The prohibition list would add: "do not apply a service locator pattern to this object."

---

## Constraint-form vs. description-form — reference table

| Description-form (forbidden) | Constraint-form (required) |
|---|---|
| X manages Y | X must read Y's current state before any write to Z |
| A depends on B | A cannot be initialized without B holding state READY |
| C notifies D | If C's state changes, D must receive the delta before any call leaves the system |
| E handles F | If F arrives, E is the only object permitted to act on it |
| G owns H | H cannot change state unless G has authorized the transition |

---

## Invariant examples

Invariants are not requirements or features. They are structural truths that hold regardless of implementation:

- The identity of the acting object must be known before any state change is committed.
- Two objects cannot hold conflicting versions of the same resource simultaneously.
- The order in which events are applied must match the order in which they were received.
- A deleted object's references must be resolved before deletion is committed.

If an implementation violates an invariant, it is structurally wrong — not just buggy.

---

## Prohibition list guidance

The prohibition list is where you name the trained abstractions you know Claude will reach for. The more specific the better.

| Too vague | Precise enough |
|---|---|
| Don't use design patterns | Do not apply the Repository pattern to [ObjectName] |
| Don't add abstractions | Do not introduce an interface layer between [A] and [B] |
| Keep it simple | Do not extract a service class from [ObjectName] |

Vague prohibitions get interpreted. Precise prohibitions name the thing and the target.

---

## Diagnostic: has the pre held?

After receiving output from Claude Code, run these checks:

1. **Name check**: Does every object from the pre-structure document appear by its exact name in the output? If a name has changed, substitution occurred.
2. **Negation check**: Does the output contain any term from the IS NOT column? If yes, a forbidden substitution was made.
3. **Boundary check**: Does the output introduce any object not in the pre-structure document? If yes, Claude expanded scope.
4. **Prohibition check**: Does the output implement anything from the prohibition list without asking? If yes, the constraint preamble was not followed.

Any failed check means the session must stop, the substitution must be named, and the affected objects must be re-specified before proceeding.
