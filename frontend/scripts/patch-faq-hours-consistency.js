/**
 * Patch the Sanity `faq-c3` and `faq-rsc3` FAQ docs so their business hours
 * match the Footer + JSON-LD schema (Mon–Thu 8 AM – 6 PM, Fri 8 AM – 5 PM).
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
      'Absolutely. We understand business disruption costs money. We offer flexible scheduling within our operating hours (Monday–Thursday, 8 AM – 6 PM, and Friday, 8 AM – 5 PM) to minimize impact on your operations.',
  },
  {
    _id: 'faq-rsc3',
    answer:
      'Our regular business hours are Monday through Thursday, 8:00 AM to 6:00 PM, and Friday, 8:00 AM to 5:00 PM. We are closed on Saturday and Sunday.',
  },
  {
    _id: '2b207bd8-9bd7-40e3-82fa-6264e4704b10',
    answer:
      'Our office is open Monday through Thursday from 8 AM to 6 PM, and Friday from 8 AM to 5 PM. Emergency calls placed during business hours are dispatched same-day when available; voicemails left after hours are returned the next business morning.',
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
