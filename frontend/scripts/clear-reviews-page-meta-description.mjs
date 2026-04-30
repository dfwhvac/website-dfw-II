/**
 * One-shot Sanity patch — clears the stale `reviewsPage.metaDescription` field
 * so the /reviews page falls through to its code-side dynamic description
 * (which pulls live review count via lib/constants.js + Sanity companyInfo).
 *
 * Run once: `node scripts/clear-reviews-page-meta-description.mjs`
 *
 * Why: the `/reviews` page meta description was authored in Sanity with a
 * hardcoded "145+" count. Code in app/reviews/page.jsx prefers Sanity-set
 * descriptions over its own dynamic fallback. Clearing the Sanity field flips
 * the priority so the code-side template (which reads live count) always wins.
 *
 * Idempotent: subsequent runs no-op once the field is unset.
 *
 * Created: Feb 28, 2026 (paired with the review-count drift-prevention sprint).
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!TOKEN) {
  console.error('ERROR: SANITY_API_TOKEN missing from env. Add to .env.local and retry.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function main() {
  const doc = await client.fetch(`*[_type == "reviewsPage"][0] { _id, metaDescription }`)

  if (!doc) {
    console.log('No reviewsPage document found — nothing to patch.')
    return
  }

  console.log(`Found reviewsPage doc: ${doc._id}`)
  console.log(`  metaDescription (current): ${doc.metaDescription ?? '(unset)'}`)

  if (!doc.metaDescription) {
    console.log('\nNo change needed — metaDescription is already unset.')
    return
  }

  console.log(`\nClearing metaDescription so /reviews falls through to dynamic code-side template...`)
  await client.patch(doc._id).unset(['metaDescription']).commit()
  console.log(`  ✓ Patched. /reviews will now render its dynamic meta description on next request.`)
}

main().catch((err) => {
  console.error('Patch failed:', err)
  process.exit(1)
})
