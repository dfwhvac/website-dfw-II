/**
 * Combined Sanity content patch executed Feb 28, 2026.
 *
 * Three concurrent updates per user direction:
 *
 * 1) HOURS — Operating hours are Mon–Thu 8 AM – 6 PM and Friday 8 AM – 5 PM
 *    (updated Oct 16, 2026; replaces the Feb 28 office-vs-9 AM split).
 *
 * 2) SAME-DAY HEDGING — Specific operational dispatch promises now carry
 *    "when available" to set expectations honestly. Marketing positioning
 *    ("same-day service" as a category claim) is intentionally NOT hedged.
 *
 * 3) PAGE-CONTACT META — States Mon–Thu 8 AM–6 PM, Fri 8 AM–5 PM.
 *
 * 4) ORPHAN CLEANUP — siteSettings.leadFormDescription removed (zero code
 *    consumers; tracked under audit row A30). leadFormFooterText (A31) and
 *    leadFormSuccessMessage (A32) deliberately retained pending user
 *    confirmation that they should also be removed.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-hours-and-dispatch.js
 *
 * Idempotent on the patch operations; the unset() call is also safe to re-run.
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

// ─── FAQ patches: current operating hours ───
const FAQ_PATCHES = [
  {
    _id: 'faq-rs3',
    answer:
      'Yes, we offer same-day HVAC repair services throughout the Dallas-Fort Worth area during our business hours (Monday–Thursday, 8 AM – 6 PM, and Friday, 8 AM – 5 PM). When your AC fails on a hot Texas summer day or your heater stops working during a cold snap, call us and we will get a technician to you as quickly as possible.',
  },
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
  {
    _id: 'faq-rsc1',
    answer:
      'For routine maintenance and non-emergency repairs, we typically schedule appointments within 1-3 business days. During peak season, wait times may be slightly longer. Emergency calls are prioritized and addressed same-day or next-day when available.',
  },
]

// ─── page-contact metaDescription enrichment (B16) ───
const PAGE_CONTACT_PATCH = {
  metaDescription:
    'Contact DFW HVAC for heating and cooling service across Dallas-Fort Worth. Open Mon–Thu 8 AM–6 PM, Fri 8 AM–5 PM. Same-day service available.',
}

async function run() {
  // 1) FAQ patches
  for (const p of FAQ_PATCHES) {
    const { _id, ...fields } = p
    const result = await client.patch(_id).set(fields).commit()
    console.log('FAQ patched:', _id, '→ rev', result._rev)
  }

  // 2) page-contact patch
  const cp = await client.patch('page-contact').set(PAGE_CONTACT_PATCH).commit()
  console.log('page-contact patched → rev', cp._rev)

  // 3) Orphan cleanup — A30 only (per user direction; A31/A32 deferred)
  const ss = await client
    .patch('siteSettings')
    .unset(['leadFormDescription'])
    .commit()
  console.log('siteSettings.leadFormDescription unset → rev', ss._rev)

  console.log('\nAll patches committed successfully.')
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
