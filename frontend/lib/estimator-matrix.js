// Replacement-estimator pricing matrix (P1.14 — Apr 24, 2026)
//
// Server-side only. Do NOT import from any client component.
// This file is the source of truth for the cost ranges shown on
// /replacement-estimator. It maps directly to the Google Sheet the
// user fills in — each exported constant is one labeled section of
// the sheet. Edit these numbers freely; no redeploy of client code
// is needed (API route reads at request time).
//
// Units: all dollars, all USD, all range-of-installed-cost to DFW
// homeowners (includes equipment, installation, permits, disposal
// of old unit). Refrigerant fill, thermostat, and standard line-set
// work are assumed baked into these ranges.
//
// Values below are conservative DFW market placeholders for 2025–2026.
// Replace with values from the user's filled Google Sheet before production.

// ─── Sheet A: Home Size → Tonnage ──────────────────────────────────
// Maps squarefootage bucket to estimated AC tonnage. This is the
// Manual J proxy — real Manual J calcs will shift ±0.5 tons but this
// is within the range variance we already publish.
export const SQFT_TONNAGE = {
  under_1500: 2.5,
  '1500_2500': 3.5,
  '2500_3500': 4,
  '3500_5000': 5,
  over_5000: 6,
}

// ─── Sheet B: System Type → Base Cost per Ton (low/high) ───────────
// Dollars per ton of cooling capacity, installed. "Matched" means
// AC + furnace swap together; "heat_pump" replaces both with a single
// unit (no gas); "mini_split" is ductless per-zone averaged.
export const SYSTEM_TYPE_BASE = {
  ac_only: { low: 1500, high: 2200 },
  furnace_only: { low: 1200, high: 1800 },
  matched: { low: 2500, high: 3500 },
  heat_pump: { low: 2700, high: 3700 },
  mini_split: { low: 2000, high: 3200 },
  not_sure: { low: 2500, high: 3500 }, // defaults to "matched" math
}

// ─── Sheet C: Equipment Tier → Multiplier ──────────────────────────
// Applied to base cost. Value = single-stage, standard = two-stage,
// premium = variable-speed / communicating / premium brand tier.
export const STAGE_MULTIPLIER = {
  value: 1.0,
  standard: 1.2,
  premium: 1.45,
  not_sure: 1.1,
}

// ─── Sheet D: Efficiency Tier → Flat Addition ──────────────────────
// Flat dollar adder (not a multiplier — higher SEER2 adds a fixed
// premium regardless of tonnage at typical DFW loads).
export const SEER_ADD = {
  baseline: 0, // 14 SEER2
  mid: 600, // 17 SEER2
  high: 1500, // 20+ SEER2
  not_sure: 300,
}

// ─── Sheet E: Duct Condition → Range Addition (low/high) ───────────
// Added to the overall range. "full_replacement" is the biggest
// variance driver in real quotes; surfacing it here prevents
// sticker-shock at the estimate visit.
export const DUCT_ADD = {
  newer_fine: { low: 0, high: 0 },
  older_ok: { low: 200, high: 600 },
  needs_work: { low: 1500, high: 3500 },
  full_replacement: { low: 3500, high: 7000 },
  unknown: { low: 0, high: 1500 },
}

// ─── Sheet F: Global Variance Band ─────────────────────────────────
// Additional ±% swing applied to the final range AFTER all math
// above. Accounts for permit fees, electrical panel surprises,
// attic access complexity, and brand preference. Keep conservative.
export const GLOBAL_VARIANCE = {
  lowPct: 0.92, // -8%
  highPct: 1.08, // +8%
}

// ─── Core calculation ──────────────────────────────────────────────
// Given validated inputs, return { low, high, breakdown, tonnage }.
// Rounds final figures to nearest $100. Throws on unknown keys —
// the API route validates inputs before calling in.
export function calculateReplacementRange({ sqft, systemType, stage, seer, ducts }) {
  const tonnage = SQFT_TONNAGE[sqft]
  const base = SYSTEM_TYPE_BASE[systemType]
  const stageMult = STAGE_MULTIPLIER[stage]
  const seerAdd = SEER_ADD[seer]
  const ductAdd = DUCT_ADD[ducts]

  if (tonnage == null || !base || stageMult == null || seerAdd == null || !ductAdd) {
    throw new Error('Invalid pricing matrix input')
  }

  const baseLow = base.low * tonnage * stageMult
  const baseHigh = base.high * tonnage * stageMult

  let low = baseLow + seerAdd + ductAdd.low
  let high = baseHigh + seerAdd + ductAdd.high

  low = low * GLOBAL_VARIANCE.lowPct
  high = high * GLOBAL_VARIANCE.highPct

  const roundToHundred = (n) => Math.round(n / 100) * 100

  return {
    low: roundToHundred(low),
    high: roundToHundred(high),
    tonnage,
    breakdown: {
      sizing: `${tonnage}-ton system (based on ${sqft.replace(/_/g, ' ')} sqft range)`,
      systemType,
      stage,
      seer,
      ducts,
      ductImpact: ductAdd,
    },
  }
}
