/**
 * Patch the Sanity `faq-rs3` doc so its business hours match the Footer +
 * JSON-LD schema (Mon–Thu 8 AM – 6 PM, Fri 8 AM – 5 PM). Inconsistency caught Feb 28,
 * 2026 during the discrete-timeline audit.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-faq-rs3-hours.js
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

const patch = {
  answer:
    'Yes, we offer same-day HVAC repair services throughout the Dallas-Fort Worth area during our business hours (Monday–Thursday, 8 AM – 6 PM, and Friday, 8 AM – 5 PM). When your AC fails on a hot Texas summer day or your heater stops working during a cold snap, call us and we will get a technician to you as quickly as possible.',
}

async function run() {
  const result = await client.patch('faq-rs3').set(patch).commit()
  console.log('faq-rs3 patched. Revision:', result._rev)
  console.log('Fields written:', Object.keys(patch).join(', '))
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
