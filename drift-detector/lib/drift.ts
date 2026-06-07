import type { DetectRequest, DriftReport } from './types'

const SYSTEM_PROMPT = `You are a structural drift detector.

Your task: compare a CURRENT state against a CANONICAL definition and identify every instance where the CURRENT has structurally departed from the CANONICAL.

Drift types:
- SUBSTITUTION: a term in CURRENT uses a different word or category than CANONICAL, where the replacement belongs to a neighboring category (e.g. "revealed" replaced by "discovered")
- ADDITION: CURRENT contains a concept not present in CANONICAL
- REMOVAL: CURRENT is missing a concept that is present in CANONICAL
- REDEFINITION: CURRENT redefines something that CANONICAL has explicitly defined

Rules:
- Work from the CANONICAL as stated. Do not interpret it, reclassify it, or assume what it means.
- Name the exact term from CANONICAL and the exact term from CURRENT for every instance.
- Do not infer intent. Report only what is structurally present or absent.
- SUBSTITUTION is the most dangerous type — flag it even when the replacement seems reasonable.

You must respond with a JSON object only. No prose, no explanation, no markdown.`

function buildPrompt(canonical: string, current: string): string {
  return `CANONICAL:
${canonical}

CURRENT:
${current}

Return this exact JSON structure:
{
  "drift_instances": [
    {
      "type": "SUBSTITUTION" | "ADDITION" | "REMOVAL" | "REDEFINITION",
      "canonical_term": "exact term from CANONICAL",
      "current_term": "exact term from CURRENT",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "description": "one sentence describing the structural departure"
    }
  ],
  "drift_score": <number 0-100, weighted sum: HIGH=20 MEDIUM=10 LOW=5, capped at 100>,
  "canonical_integrity": <100 minus drift_score>
}`
}

function parseReport(text: string): DriftReport {
  const cleaned = text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  const report = JSON.parse(cleaned) as DriftReport

  for (const instance of report.drift_instances) {
    if (!instance.canonical_term || !instance.current_term) {
      throw new Error(`DriftInstance missing required terms: ${JSON.stringify(instance)}`)
    }
  }

  report.canonical_integrity = 100 - report.drift_score

  return report
}

export async function detectDrift(req: DetectRequest): Promise<DriftReport> {
  const base = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL ?? 'llama3.1'

  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      format: 'json',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(req.canonical, req.current) },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Ollama error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const content = data?.message?.content
  if (typeof content !== 'string') throw new Error('Unexpected response shape from Ollama')

  return parseReport(content)
}
