export type DriftType = 'SUBSTITUTION' | 'ADDITION' | 'REMOVAL' | 'REDEFINITION'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH'

export interface DriftInstance {
  type: DriftType
  canonical_term: string
  current_term: string
  severity: Severity
  description: string
}

export interface DriftReport {
  drift_instances: DriftInstance[]
  drift_score: number
  canonical_integrity: number
}

export interface DetectRequest {
  canonical: string
  current: string
}
