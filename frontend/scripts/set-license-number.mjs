/**
 * One-shot Sanity patch — sets companyInfo.licenseNumber to the DFW HVAC
 * TDLR HVAC license. After this runs, the footer + auto-reply email both
 * read the license number from Sanity instead of hardcoded values.
 *
 * Run once: `node scripts/set-license-number.mjs`
 * Idempotent: subsequent runs are safe (they just re-set the same value).
 *
 * Created: May 4, 2026.
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

const LICENSE_NUMBER = 'TACLB00136968E'

if (!TOKEN) {
  console.error('ERROR: SANITY_API_TOKEN missing from env. Add to .env.local and retry.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function main() {
  const doc = await client.fetch(`*[_type == "companyInfo"][0] { _id, licenseNumber }`)

  if (!doc) {
    console.error('ERROR: No companyInfo document found in Sanity.')
    process.exit(1)
  }

  console.log(`Found companyInfo doc: ${doc._id}`)
  console.log(`  licenseNumber (current): ${doc.licenseNumber ?? '(unset)'}`)
  console.log(`  licenseNumber (target):  ${LICENSE_NUMBER}`)

  if (doc.licenseNumber === LICENSE_NUMBER) {
    console.log('\nNo change needed — licenseNumber is already correct.')
    return
  }

  await client.patch(doc._id).set({ licenseNumber: LICENSE_NUMBER }).commit()
  console.log(`\n  ✓ Patched. Footer + auto-reply email will display "${LICENSE_NUMBER}" on next render.`)
}

main().catch((err) => {
  console.error('Patch failed:', err)
  process.exit(1)
})
