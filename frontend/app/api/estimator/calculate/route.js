import { NextResponse } from 'next/server'
import { calculateReplacementRange } from '@/lib/estimator-matrix'

export const dynamic = 'force-dynamic'

// Valid enum sets — mirror the UI radio values. Kept server-side so
// a hand-crafted curl can't coax the calculator into producing a
// bogus range from unknown keys.
const VALID = {
  sqft: ['under_1500', '1500_2500', '2500_3500', '3500_5000', 'over_5000'],
  systemType: ['ac_only', 'furnace_only', 'matched', 'heat_pump', 'mini_split', 'not_sure'],
  stage: ['value', 'standard', 'premium', 'not_sure'],
  seer: ['baseline', 'mid', 'high', 'not_sure'],
  ducts: ['newer_fine', 'older_ok', 'needs_work', 'full_replacement', 'unknown'],
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { sqft, systemType, stage, seer, ducts } = body || {}

    // Validate every field against its enum set. Reject if any missing or unknown.
    for (const [field, allowed] of Object.entries(VALID)) {
      const val = { sqft, systemType, stage, seer, ducts }[field]
      if (!val || !allowed.includes(val)) {
        return NextResponse.json(
          { error: `Invalid or missing '${field}' (expected one of: ${allowed.join(', ')})` },
          { status: 400 }
        )
      }
    }

    const result = calculateReplacementRange({ sqft, systemType, stage, seer, ducts })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[estimator/calculate] error:', err)
    return NextResponse.json(
      { error: 'Unable to calculate estimate. Please try again.' },
      { status: 500 }
    )
  }
}
