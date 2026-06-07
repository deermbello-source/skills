---
name: object-anchor
description: Forces analysis to stay anchored to the user's exact stated object — a term, claim, theorem, architecture component, or document section — without silently substituting it for a neighboring category. Use when the user gives a specific object to analyze, when prior analysis drifted to a different concept, or when the user says "you changed the word" or "that's not what I said". See [REFERENCE.md](REFERENCE.md) for substitution patterns and examples.
---

# Object Anchor

## The failure this corrects

Silent substitution: the user names object X, the model recognizes X as "like" Y, analyzes Y, and presents the result as analysis of X. The reasoning is internally coherent but no longer attached to the original object.

## Protocol

### 1. Lock the object

Quote the user's exact term verbatim before doing anything else.

> The object is: **[exact user term]**

Do not paraphrase, reclassify, or wrap it in quotes of a different category.

### 2. State what kind of thing it is

Use the user's framing — do not reclassify upward:

- Term or word
- Claim or assertion
- Named architecture component
- Specific document section or passage
- Theorem, rule, or constraint
- Process or operation

### 3. Substitution check

Before proceeding, ask explicitly: "Have I already renamed this?"

If yes, revert to the original. See [REFERENCE.md](REFERENCE.md) for the most common substitution patterns to catch.

### 4. Work the object directly

Derive properties from the object as stated:

- What does **this exact object** assert, require, or entail?
- What properties does **this exact term** carry that its substitutes do not?
- What breaks if you replace **this exact object** with the neighboring category?

Do not ask: "What do things like this typically do?" — that is the substitution door.

### 5. Name comparisons explicitly

If a neighboring category is genuinely useful, state it as a contrast — never as a replacement:

> "If this were [Y], we'd expect [Z]. Since the object is [X], that expectation doesn't hold because..."

## Retroactive use

When drift has already occurred:

1. Identify the point of substitution — the first response where X became Y
2. State the substitution explicitly: "I replaced [X] with [Y] at step N"
3. Re-run the analysis from the original object without carrying forward conclusions from Y
