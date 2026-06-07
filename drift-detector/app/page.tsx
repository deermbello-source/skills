'use client'

import { useState } from 'react'
import type { DriftReport, DriftInstance, Severity } from '@/lib/types'

const CANONICAL_PLACEHOLDER = `Define the canonical state here. Example:

IS: The process by which a team decides which features to ship next
IS NOT: not a brainstorming session, not a roadmap review, not a sprint ceremony
CONSTRAINTS: Must involve direct input from at least one customer-facing team member before any decision is finalized`

const CURRENT_PLACEHOLDER = `Paste the current description, document, or state here. Example:

Prioritization is our quarterly planning process where leadership reviews the product roadmap and selects initiatives based on strategic alignment and available capacity.`

const severityBorder: Record<Severity, string> = {
  HIGH: 'border-red-500 bg-red-500/10',
  MEDIUM: 'border-yellow-500 bg-yellow-500/10',
  LOW: 'border-blue-500 bg-blue-500/10',
}

const severityDot: Record<Severity, string> = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-blue-500',
}

const typeLabel: Record<DriftInstance['type'], string> = {
  SUBSTITUTION: 'Substitution',
  ADDITION: 'Addition',
  REMOVAL: 'Removal',
  REDEFINITION: 'Redefinition',
}

function ScoreRing({ score }: { score: number }) {
  const integrity = 100 - score
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (integrity / 100) * circumference
  const color = integrity >= 80 ? '#22c55e' : integrity >= 50 ? '#eab308' : '#ef4444'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#1f2937" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold" fontFamily="monospace">
          {integrity}
        </text>
        <text x="70" y="85" textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="monospace">
          INTEGRITY
        </text>
      </svg>
      <div className="text-center">
        <span className="text-sm text-gray-400">Drift Score: </span>
        <span className="text-sm font-mono font-bold text-white">{score}</span>
      </div>
    </div>
  )
}

export default function Page() {
  const [canonical, setCanonical] = useState('')
  const [current, setCurrent] = useState('')
  const [report, setReport] = useState<DriftReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDetect() {
    if (!canonical.trim() || !current.trim()) return
    setLoading(true)
    setError(null)
    setReport(null)

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canonical, current }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-purple-400">MEM</span> / Drift Detector
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Measures structural departure from a canonical definition
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">
              Canonical — locked definition
            </label>
            <textarea
              value={canonical}
              onChange={e => setCanonical(e.target.value)}
              placeholder={CANONICAL_PLACEHOLDER}
              rows={12}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-700 resize-none focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">
              Current — present state
            </label>
            <textarea
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder={CURRENT_PLACEHOLDER}
              rows={12}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-200 placeholder-gray-700 resize-none focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={handleDetect}
            disabled={loading || !canonical.trim() || !current.trim()}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Detecting...' : 'Detect Drift'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {report && (
          <div className="border border-gray-800 rounded-xl p-6 bg-gray-900/50">
            <div className="flex flex-col lg:flex-row gap-8">

              <div className="flex flex-col items-center justify-center lg:w-48 shrink-0">
                <ScoreRing score={report.drift_score} />
                <div className="mt-3 text-center">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Instances</div>
                  <div className="text-2xl font-bold text-white">{report.drift_instances.length}</div>
                </div>
              </div>

              <div className="flex-1">
                {report.drift_instances.length === 0 ? (
                  <div className="text-green-400 text-sm py-8 text-center">
                    No drift detected. Current matches Canonical.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {report.drift_instances.map((instance, i) => (
                      <div key={i} className={`border rounded-lg p-4 ${severityBorder[instance.severity]}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${severityDot[instance.severity]}`} />
                          <span className="text-xs uppercase tracking-widest text-gray-400">
                            {typeLabel[instance.type]}
                          </span>
                          <span className="text-xs text-gray-600 ml-auto">{instance.severity}</span>
                        </div>
                        <div className="flex items-start gap-2 mb-2 text-sm">
                          <span className="text-gray-400 shrink-0">Canonical:</span>
                          <span className="text-white font-bold">{instance.canonical_term}</span>
                        </div>
                        <div className="flex items-start gap-2 mb-3 text-sm">
                          <span className="text-gray-400 shrink-0">Current:</span>
                          <span className="text-gray-300">{instance.current_term}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{instance.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  )
}
