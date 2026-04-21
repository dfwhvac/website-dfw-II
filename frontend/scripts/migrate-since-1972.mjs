#!/usr/bin/env node
/**
 * Migration: replace "A family commitment to HVAC excellence since 1972"
 *            with "Keeping it Cool — For Three Generations"
 *
 * Scope: Sanity documents only. Code fallbacks were already updated.
 *
 * Why this exists: The home page's `whyUsItems[].description` field lives in
 * Sanity. The code fallback in HomePage.jsx only runs if Sanity has no value.
 * Sanity currently has the stale "since 1972" string, so it overrides the
 * corrected code fallback. This script patches the Sanity document directly.
 *
 * Safety: Only modifies `whyUsItems` array items where `title == "Three-Generation Legacy"`.
 * Every other field, every other item, every other document is untouched.
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> node scripts/migrate-since-1972.mjs
 *
 * Added: April 21, 2026 (PR branding rewrite)
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env.local') })

const NEW_TEXT = 'Keeping it Cool — For Three Generations'
const OLD_TEXT_PATTERN = /since 1972/i
const TARGET_TITLE = 'Three-Generation Legacy'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function run() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('ERROR: SANITY_API_TOKEN not set. Cannot write to Sanity.')
    process.exit(1)
  }

  console.log('Fetching documents with whyUsItems...')
  const docs = await client.fetch(
    `*[defined(whyUsItems)] { _id, _type, whyUsItems }`
  )

  console.log(`Found ${docs.length} document(s) with whyUsItems field.`)

  let updatedCount = 0
  for (const doc of docs) {
    if (!Array.isArray(doc.whyUsItems)) continue

    let changed = false
    const newItems = doc.whyUsItems.map((item) => {
      const matches =
        item?.title === TARGET_TITLE &&
        typeof item?.description === 'string' &&
        OLD_TEXT_PATTERN.test(item.description)
      if (matches) {
        console.log(`  [${doc._id}] "${item.description}" → "${NEW_TEXT}"`)
        changed = true
        return { ...item, description: NEW_TEXT }
      }
      return item
    })

    if (changed) {
      await client
        .patch(doc._id)
        .set({ whyUsItems: newItems })
        .commit()
      updatedCount++
      console.log(`  ✓ Patched doc ${doc._id} (${doc._type})`)
    }
  }

  console.log(`\nDone. Updated ${updatedCount} document(s).`)
  if (updatedCount === 0) {
    console.log('(No documents required changes — may already be up-to-date.)')
  }
}

run().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
