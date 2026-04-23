#!/usr/bin/env node
/**
 * Seed the new `fiveStarReviewCount` field on Sanity's `companyInfo` doc.
 *
 * Why this exists (P1.6a — Apr 23, 2026): The page-title review badge
 * implements "Option C hybrid" logic (see lib/metadata.js → getReviewBadgeCount).
 * When googleRating >= 4.95 the badge uses live googleReviews from the daily
 * cron sync. If the rating ever dips, we fall back to a manually-curated
 * fiveStarReviewCount. Seeding at 150 gives a forward-looking buffer — slightly
 * ahead of today's live count (147) so the badge stays accurate as the next
 * few five-star reviews come in, and never reads lower than reality.
 *
 * Idempotent: sets the field only if it's missing or differs from DEFAULT.
 * Safe to re-run.
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> node scripts/seed-five-star-review-count.mjs
 *
 * Maintenance: See /app/memory/RECURRING_MAINTENANCE.md item M2 — monthly drift audit.
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

const DEFAULT_SEED = 150

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function run() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('ERROR: SANITY_API_TOKEN not set. Cannot write to Sanity.')
    process.exit(1)
  }

  console.log('Fetching companyInfo doc...')
  const doc = await client.fetch(
    `*[_type == "companyInfo"][0] { _id, _type, fiveStarReviewCount, googleReviews, googleRating }`
  )

  if (!doc) {
    console.error('ERROR: No companyInfo document found.')
    process.exit(1)
  }

  console.log(`  _id: ${doc._id}`)
  console.log(`  googleRating: ${doc.googleRating}`)
  console.log(`  googleReviews (live): ${doc.googleReviews}`)
  console.log(`  fiveStarReviewCount (current): ${doc.fiveStarReviewCount ?? '(unset)'}`)

  if (doc.fiveStarReviewCount === DEFAULT_SEED) {
    console.log(`\nNo change needed — fiveStarReviewCount already equals ${DEFAULT_SEED}.`)
    return
  }

  if (typeof doc.fiveStarReviewCount === 'number' && doc.fiveStarReviewCount > 0) {
    console.log(`\nNOTE: fiveStarReviewCount is already set to ${doc.fiveStarReviewCount}. Leaving untouched.`)
    console.log(`      To reset to the seed value (${DEFAULT_SEED}), clear the field in Sanity Studio first.`)
    return
  }

  console.log(`\nSeeding fiveStarReviewCount = ${DEFAULT_SEED} ...`)
  await client
    .patch(doc._id)
    .set({ fiveStarReviewCount: DEFAULT_SEED })
    .commit()

  console.log(`  ✓ Patched doc ${doc._id} — fiveStarReviewCount is now ${DEFAULT_SEED}.`)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
