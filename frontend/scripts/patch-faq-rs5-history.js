/**
 * Patch the Sanity `faq-rs5` doc so it reflects the canonical brand history
 * (founded 2020 by Jonathan Grubb; family legacy back to 1972). The previous
 * answer claimed "since 1974 - over 50 years of serving" which conflated the
 * company with the family legacy and used a year that appears nowhere else
 * on the site.
 *
 * Replacement copy authored Feb 28, 2026 (Option B from the user-approved
 * three-draft review). The "Read the whole three-generation history on our
 * About page at /about" phrase is matched by a LINK_RULE in
 * components/FAQAccordion.jsx and rendered as an internal Next.js Link.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-faq-rs5-history.js
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
  question: 'How long has DFW HVAC been in business?',
  answer:
    "DFW HVAC was founded in 2020 — the third generation of my family's 50-plus-year HVAC legacy in Texas. The legacy began in 1972 with my grandfather Garland Nevil, continued through my father Ronny Grubb, and now lives on at DFW HVAC. We hold to the customer-first standards I grew up with — every call, every diagnosis, every install. Read the whole three-generation history on our About page at /about",
}

async function run() {
  const result = await client.patch('faq-rs5').set(patch).commit()
  console.log('faq-rs5 patched. Revision:', result._rev)
  console.log('Fields written:', Object.keys(patch).join(', '))
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
