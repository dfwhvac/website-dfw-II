/**
 * Patch the Sanity `contactPage` doc to align with the codebase response-time
 * standard ("within 2 business hours"). The doc had drifted to "within 24 hours"
 * in `formDescription` and `emailDescription`.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-contactpage-response-time.js
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
  formDescription:
    "Fill out the form below and we'll get back to you within 2 business hours",
  emailDescription: 'We respond within 2 business hours',
}

async function run() {
  const doc = await client.fetch(
    `*[_type == "contactPage"][0]{ _id }`,
  )
  if (!doc?._id) {
    console.error('No contactPage doc found.')
    process.exit(1)
  }
  const result = await client.patch(doc._id).set(patch).commit()
  console.log('contactPage patched:', doc._id, '→ rev', result._rev)
  console.log('Fields written:', Object.keys(patch).join(', '))
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
