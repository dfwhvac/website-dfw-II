/**
 * Replace Sanity siteSettings.socialLinks[1] (instagram) with linkedin per
 * user direction Feb 28, 2026. Preserves the existing facebook entry (still
 * a placeholder URL `https://facebook.com` pending the real Page URL) and
 * google entry (already pointing at the live g.page review-prompt link).
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-sitesettings-social-links.js
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

const newSocialLinks = [
  {
    _key: 'social1',
    _type: 'object',
    platform: 'facebook',
    url: 'https://www.facebook.com/dfwhvacllc',
  },
  {
    _key: 'social2',
    _type: 'object',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/company/68683407/',
  },
  {
    _key: 'social3',
    _type: 'object',
    platform: 'google',
    // Updated Apr 30, 2026 — swapped from g.page/r/CcumMADJhchIEB0
    // (review-prompt) to share.google overview link per user direction.
    // Footer icon should route to GBP overview, not directly to rate-stars.
    url: 'https://share.google/6FhwhOPxWGKDg9vH8',
  },
]

async function run() {
  const result = await client
    .patch('siteSettings')
    .set({ socialLinks: newSocialLinks })
    .commit()
  console.log('siteSettings.socialLinks patched → rev', result._rev)
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
