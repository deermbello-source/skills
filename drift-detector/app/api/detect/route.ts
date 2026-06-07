import { NextRequest, NextResponse } from 'next/server'
import { detectDrift } from '@/lib/drift'
import type { DetectRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body: DetectRequest = await req.json()

    if (!body.canonical?.trim()) {
      return NextResponse.json({ error: 'Canonical is required' }, { status: 400 })
    }
    if (!body.current?.trim()) {
      return NextResponse.json({ error: 'Current is required' }, { status: 400 })
    }

    const report = await detectDrift(body)
    return NextResponse.json(report)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Detection failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
