/**
 * Patch the Sanity `faq-c3` and `faq-rsc3` FAQ docs so their business hours
 * match the Footer + JSON-LD schema (Mon-Fri 7 AM - 6 PM, not 9 AM). These
 * two docs were missed in the initial Feb 28 hours-consistency audit.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-faq-hours-consistency.js
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

const patches = [
  {
    _id: 'faq-c3',
    answer:
      'Absolutely. We understand business disruption costs money. We offer flexible scheduling within our operating hours (Monday-Friday, 7 AM - 6 PM) to minimize impact on your operations.',
  },
  {
    _id: 'faq-rsc3',
    answer:
      'Our regular business hours are Monday through Friday, 7:00 AM to 6:00 PM. We are closed on Saturday and Sunday.',
  },
  {
    _id: '2b207bd8-9bd7-40e3-82fa-6264e4704b10',
    answer:
      'We schedule service calls between 7 AM and 6 PM, Monday through Friday. Emergency calls placed during business hours are dispatched same-day; voicemails left after hours are returned the next business morning.',
  },
]

async function run() {
  for (const p of patches) {
    const { _id, ...fields } = p
    const result = await client.patch(_id).set(fields).commit()
    console.log(_id, '→ rev', result._rev)
  }
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
