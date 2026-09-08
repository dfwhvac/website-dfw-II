#!/usr/bin/env node
/**
 * One-shot export — Google Review Archive → markdown for LLM voice training.
 *
 * Reads Sanity `googleReviewLedger` (seeded by nightly /api/cron/sync-reviews)
 * and writes a dated file under memory/audits/ with customer reviews + owner
 * replies. Default: only rows that have an owner reply (best signal for voice).
 *
 * Usage (from frontend/):
 *   node scripts/export-gbp-review-replies.mjs
 *   node scripts/export-gbp-review-replies.mjs --all
 *   node scripts/export-gbp-review-replies.mjs --json
 *
 * Flags:
 *   --all   Include reviews without an owner reply
 *   --json  Also write a companion .json next to the .md
 *
 * Requires SANITY_API_TOKEN (read is enough) in frontend/.env or .env.local.
 *
 * Created: Sep 8, 2026
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const frontendRoot = resolve(__dirname, '..')
const repoRoot = resolve(frontendRoot, '..')

config({ path: resolve(frontendRoot, '.env.local') })
config({ path: resolve(frontendRoot, '.env') })

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

const includeAll = process.argv.includes('--all')
const writeJson = process.argv.includes('--json')

if (!TOKEN) {
  console.error(
    'ERROR: SANITY_API_TOKEN missing. Add it to frontend/.env or .env.local and retry.'
  )
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const QUERY = `*[_type == "googleReviewLedger"] | order(createTime desc) {
  googleReviewId,
  reviewerName,
  starRating,
  dateDisplay,
  createTime,
  comment,
  reviewReply,
  status,
  hasText
}`

function todayIso() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function escapeFence(text) {
  return String(text || '').replace(/```/g, "'''")
}

function formatEntry(row, index) {
  const name = row.reviewerName || 'Unknown reviewer'
  const stars = row.starRating ?? '?'
  const date = row.dateDisplay || (row.createTime || '').slice(0, 10) || 'unknown date'
  const status = row.status === 'missing' ? ' · MISSING from Google' : ''
  const comment = (row.comment || '').trim() || '(star-only — no written comment)'
  const reply = (row.reviewReply || '').trim()

  const lines = [
    `### ${index}. ${name} · ${stars}★ · ${date}${status}`,
    '',
    '**Customer:**',
    '',
    `> ${escapeFence(comment).replace(/\n/g, '\n> ')}`,
    '',
  ]

  if (reply) {
    lines.push('**Our reply:**', '', escapeFence(reply), '')
  } else {
    lines.push('**Our reply:** _(none)_', '')
  }

  return lines.join('\n')
}

async function main() {
  console.log(`Fetching googleReviewLedger from ${PROJECT_ID}/${DATASET}…`)
  const rows = await client.fetch(QUERY)
  if (!Array.isArray(rows)) {
    console.error('Unexpected Sanity response — expected an array.')
    process.exit(1)
  }

  const withReply = rows.filter((r) => (r.reviewReply || '').trim())
  const selected = includeAll ? rows : withReply

  const day = todayIso()
  const suffix = includeAll ? 'gbp-reviews-all' : 'gbp-review-replies'
  const auditsDir = resolve(repoRoot, 'memory/audits')
  mkdirSync(auditsDir, { recursive: true })
  const mdPath = resolve(auditsDir, `${day}_${suffix}.md`)

  const md = [
    `# DFW HVAC — Google review replies (voice corpus)`,
    '',
    `**Exported:** ${day}`,
    `**Source:** Sanity \`googleReviewLedger\` (nightly GBP sync)`,
    `**Filter:** ${includeAll ? 'all archive rows' : 'rows with an owner reply only'}`,
    `**Counts:** ${selected.length} exported · ${withReply.length} with reply · ${rows.length} total in archive`,
    '',
    'Use this file to teach an LLM DFW HVAC’s reply voice. Prefer **Our reply** blocks over customer text.',
    '',
    '---',
    '',
    ...selected.map((row, i) => formatEntry(row, i + 1)),
  ].join('\n')

  writeFileSync(mdPath, md, 'utf8')
  console.log(`Wrote ${mdPath}`)
  console.log(
    `  exported=${selected.length} withReply=${withReply.length} archiveTotal=${rows.length}`
  )

  if (writeJson) {
    const jsonPath = resolve(auditsDir, `${day}_${suffix}.json`)
    writeFileSync(jsonPath, JSON.stringify(selected, null, 2), 'utf8')
    console.log(`Wrote ${jsonPath}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
