/**
 * One-time Sanity content patch to unify response-time copy.
 *
 * The Sanity `siteSettings` doc had three lead-form copy fields drifted to
 * "within 24 hours" while the codebase standard is "within 2 business hours".
 * This script rewrites those three strings to align with the codebase, the
 * /thanks page, and the customer auto-reply email.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *
 *   node scripts/patch-sitesettings-response-time.js
 *
 * Idempotent: re-running overwrites the same fields with the same values.
 */
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('next-sanity')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity env vars.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const patch = {
  leadFormDescription:
    "Fill out the form below and we'll contact you within 2 business hours",
  leadFormFooterText:
    "We'll contact you within 2 business hours to schedule your appointment",
  leadFormSuccessMessage:
    "Thank you! We'll contact you within 2 business hours.",
}

async function run() {
  const result = await client.patch('siteSettings').set(patch).commit()
  console.log('siteSettings patched. Revision:', result._rev)
  console.log('Fields written:', Object.keys(patch).join(', '))
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
