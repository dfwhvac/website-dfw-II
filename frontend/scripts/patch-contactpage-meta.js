/**
 * Patch the LIVE /contact metaDescription. The page reads from the
 * `contactPage` Sanity type (id: SeG5QqJ97GU5Q9mdCIVt9l), not the
 * `page-contact` companyPage doc (which is effectively shadowed by the
 * static /app/contact/page.jsx route).
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-contactpage-meta.js
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
  metaDescription:
    'Contact DFW HVAC for heating and cooling service across Dallas-Fort Worth. Open Monday–Friday, 7 AM – 6 PM. Same-day service available.',
}

async function run() {
  const doc = await client.fetch(`*[_type == "contactPage"][0]{ _id }`)
  if (!doc?._id) {
    console.error('No contactPage doc found.')
    process.exit(1)
  }
  const result = await client.patch(doc._id).set(patch).commit()
  console.log('contactPage metaDescription patched:', doc._id, '→ rev', result._rev)
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
