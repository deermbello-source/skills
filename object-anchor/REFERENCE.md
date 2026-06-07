# Object Anchor — Reference

## Common substitution patterns

These are the most frequent ways a stated object gets silently replaced.

### Specific → abstract category

The user names a specific thing. The model generalizes it to a type.

| User's object | Substituted with |
|---|---|
| Clarient | communication framework |
| The Redux store | state management |
| Module X | a module |
| Section 3.2 of the spec | the specification |

**Why it happens:** the specific term is unfamiliar or ambiguous, so the model reaches for the nearest familiar category. The category is analyzable. The specific thing is not — or not yet.

**What's lost:** the specific term may have properties, constraints, or history that the category does not. Analyzing the category answers a different question.

---

### Verb → noun (action → discovery)

The user uses a verb describing what happened. The model nominalize it into a concept.

| User's object | Substituted with |
|---|---|
| revealed | discovered / discovery |
| collapsed | failure |
| diverged | inconsistency |
| hardcoded | a configuration issue |

**Why it happens:** nominals are easier to predicate things about. "Discovery implies X" is structurally cleaner than "revealed implies X."

**What's lost:** the verb carries tense, agency, and directionality. "Revealed" names a specific event and implies something was previously hidden. "Discovered" shifts the frame to the agent who finds something. They are not the same.

---

### Concrete → theory

The user names a pattern observed in the data or system. The model promotes it to a theoretical construct.

| User's object | Substituted with |
|---|---|
| pattern | theory |
| behavior | rule |
| result | principle |
| observation | hypothesis |

**Why it happens:** theories and principles are what the model has been trained to reason about. Raw patterns are harder to operate on.

**What's lost:** the distinction between "this happened" and "this always happens." The user named a concrete object. The analysis now applies to a theoretical generalization.

---

### Named artifact → generic type

The user refers to a specific named artifact — a document, protocol, system, or product. The model replaces the name with the type.

| User's object | Substituted with |
|---|---|
| reality | metaphysics |
| the IETF RFC | a protocol document |
| the migration | a database operation |
| the incident | an outage |

**Why it happens:** the model's knowledge about "metaphysics" is richer than its knowledge about "reality" as the user is using it. Substituting in the richer concept feels like being more helpful.

**What's lost:** the user's object is specific. The analysis of the substituted type may not apply to the specific thing at all, and the user has no way to see that the switch happened.

---

## Diagnostic questions

When an analysis is complete, run these against it:

1. **Is the stated object present by name in the analysis?** If the user said "Clarient" and the word "Clarient" doesn't appear in the response, substitution likely occurred.

2. **Does the first sentence of the analysis describe the user's object or something else?** The framing sentence often reveals the substitution.

3. **Would the analysis change if the object were replaced with the neighboring category?** If not, the analysis was already about the category.

4. **Has the analysis answered a question the user didn't ask?** Substitution often shifts not just the object but the question: "What is Clarient?" becomes "What do communication frameworks do?"

---

## Example: substitution vs. direct analysis

**User's object:** `revealed`

**Substituted analysis:**
> "Discovery is a key moment in any investigation. When information is discovered, it implies that prior knowledge was incomplete..."

This is an analysis of *discovery*, not of *revealed*. The word "revealed" has dropped out entirely.

**Direct analysis:**
> "`revealed` is a past-tense verb. Its subject performed an action of uncovering something that was previously obscured — not unknown, but hidden. This is distinct from *discovered* (which implies the thing was unknown to the agent) and from *disclosed* (which implies deliberate, voluntary action). If the original text used `revealed`, it asserts both that the thing was hidden and that the hiding is now over."

The second stays on the object. It uses the neighboring terms (*discovered*, *disclosed*) as contrasts that sharpen the original — not as replacements.
