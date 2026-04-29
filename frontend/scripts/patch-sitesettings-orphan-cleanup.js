/**
 * Final cleanup of orphaned siteSettings.leadForm* fields.
 *
 * A30 (leadFormDescription) was unset Feb 28, 2026 in the patch-hours-and-
 * dispatch.js script. A31 + A32 deferred pending user confirmation. User
 * confirmed Feb 28 (later same session) — unset both now.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-sitesettings-orphan-cleanup.js
 */
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('next-sanity')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function run() {
  const result = await client
    .patch('siteSettings')
    .unset(['leadFormFooterText', 'leadFormSuccessMessage'])
    .commit()
  console.log(
    'siteSettings.leadFormFooterText + leadFormSuccessMessage unset → rev',
    result._rev,
  )
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
