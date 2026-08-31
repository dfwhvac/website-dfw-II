/**
 * Append-only Google review archive + disappearance detection.
 * Used by /api/cron/sync-reviews. Never deletes a row when Google drops a review.
 */

import {
  extractGbpReviewId,
  formatReviewDate,
  gbpReviewerDisplayName,
  starRatingToNumber,
} from './gbp-reviews.js'

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SANITY_API_VERSION = 'v2024-01-01'
const CHUNK_SIZE = 40

function sanityToken() {
  const token = process.env.SANITY_API_TOKEN
  if (!token) throw new Error('Missing env SANITY_API_TOKEN')
  return token
}

function mutateUrl() {
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`
}

function queryUrl(groq) {
  return `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groq)}`
}

async function sanityQuery(groq) {
  const res = await fetch(queryUrl(groq), {
    headers: { Authorization: `Bearer ${sanityToken()}` },
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Sanity query failed: ${res.status} ${JSON.stringify(data)}`)
  }
  return data.result
}

async function sanityMutate(mutations) {
  if (!mutations.length) return
  for (let i = 0; i < mutations.length; i += CHUNK_SIZE) {
    const chunk = mutations.slice(i, i + CHUNK_SIZE)
    const res = await fetch(mutateUrl(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sanityToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutations: chunk }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(
        `Sanity ledger mutate failed: ${res.status} ${JSON.stringify(result)}`
      )
    }
  }
}

export function googleReviewLedgerDocId(reviewId) {
  const safe = String(reviewId).replace(/[^a-zA-Z0-9._-]/g, '-')
  return `google-review-ledger-${safe}`
}

export function googleReviewSyncLogDocId(isoDate) {
  const day = String(isoDate).slice(0, 10)
  return `google-review-sync-${day}`
}

export function mapGbpReviewToLedger(review, nowIso) {
  const reviewId = extractGbpReviewId(review)
  if (!reviewId) return null

  const comment = (review.comment || '').trim()
  const reply = (review.reviewReply?.comment || '').trim()
  const resourceName = typeof review.name === 'string' ? review.name : ''

  return {
    _id: googleReviewLedgerDocId(reviewId),
    _type: 'googleReviewLedger',
    googleReviewId: reviewId,
    resourceName,
    reviewerName: gbpReviewerDisplayName(review),
    starRating: starRatingToNumber(review.starRating),
    comment,
    hasText: Boolean(comment),
    dateDisplay: formatReviewDate(review.createTime || review.updateTime),
    createTime: review.createTime || '',
    updateTime: review.updateTime || '',
    reviewReply: reply,
    status: 'live',
    lastSeenAt: nowIso,
    seededFrom: 'gbp',
  }
}

/**
 * Compare archive rows to tonight's live Google review IDs.
 * existingLedgers: [{ googleReviewId, status, ... }]
 * liveIdSet: Set<string>
 */
export function classifyLedgerDiff(existingLedgers, liveIdSet) {
  const newlyMissing = []
  const restored = []
  const stillMissing = []
  const existingIds = new Set()

  for (const row of existingLedgers || []) {
    const id = row.googleReviewId
    if (!id) continue
    existingIds.add(id)
    if (liveIdSet.has(id)) {
      if (row.status === 'missing') restored.push(row)
    } else if (row.status === 'missing') {
      stillMissing.push(row)
    } else {
      newlyMissing.push(row)
    }
  }

  return { newlyMissing, restored, stillMissing, existingIds }
}

export function shouldSendDisappearanceAlert({
  previousPlacesCount,
  livePlacesCount,
  newlyMissingCount,
}) {
  const placesDropped =
    typeof previousPlacesCount === 'number' &&
    typeof livePlacesCount === 'number' &&
    livePlacesCount < previousPlacesCount
  return placesDropped || newlyMissingCount > 0
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatReviewLine(row, index) {
  const name = row.reviewerName || 'Unknown reviewer'
  const stars = row.starRating || '?'
  const date = row.dateDisplay || row.createTime || 'unknown date'
  const text = (row.comment || '').trim() || '(star-only — no written comment)'
  const id = row.googleReviewId || 'unknown-id'
  return `${index + 1}. ${name} — ${stars} stars — ${date}
Review ID: ${id}
${text}`
}

export function buildGoogleSupportPacket({
  previousPlacesCount,
  livePlacesCount,
  snapshotAt,
  newlyMissing,
  gbpListCount,
  placeId,
  gbpLocationId,
}) {
  const delta =
    typeof previousPlacesCount === 'number' && typeof livePlacesCount === 'number'
      ? livePlacesCount - previousPlacesCount
      : null
  const deltaLabel = delta == null ? 'n/a' : delta > 0 ? `+${delta}` : String(delta)
  const lines = (newlyMissing || []).map((row, i) => formatReviewLine(row, i))

  return `DFW HVAC — missing Google reviews report
Business: DFW HVAC
Place ID: ${placeId || 'unknown'}
GBP location: ${gbpLocationId || 'unknown'}
Snapshot (UTC): ${snapshotAt}

Public Google review count before: ${previousPlacesCount ?? 'unknown'}
Public Google review count after: ${livePlacesCount ?? 'unknown'}
Change: ${deltaLabel}
GBP API list length tonight: ${gbpListCount ?? 'unknown'}
Named reviews missing from Google tonight: ${(newlyMissing || []).length}

Missing reviews:
${lines.length ? lines.join('\n\n') : '(none named — likely star-only reviews never captured before tonight)'}

These were genuine customer reviews previously present on this Business Profile.
Please restore any that were removed in error by automated spam detection.
`
}

export function buildDisappearanceAlertHtml(opts) {
  const {
    previousPlacesCount,
    livePlacesCount,
    newlyMissing = [],
    restored = [],
    gbpListCount,
    unnamedDropEstimate,
    packet,
  } = opts

  const delta =
    typeof previousPlacesCount === 'number' && typeof livePlacesCount === 'number'
      ? livePlacesCount - previousPlacesCount
      : null
  const rowsHtml = newlyMissing
    .map((row) => {
      const text = (row.comment || '').trim() || '(star-only — no written comment)'
      return `<tr>
        <td style="padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top;">${escapeHtml(row.reviewerName || 'Unknown')}</td>
        <td style="padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top;">${escapeHtml(row.starRating ?? '?')}★</td>
        <td style="padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top;">${escapeHtml(row.dateDisplay || row.createTime || '')}</td>
        <td style="padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top;">${escapeHtml(text)}</td>
        <td style="padding:8px 10px;border:1px solid #E2E8F0;vertical-align:top;font-family:monospace;font-size:12px;">${escapeHtml(row.googleReviewId || '')}</td>
      </tr>`
    })
    .join('')

  return `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 720px; padding: 24px; color: #2D3748;">
          <h2 style="color: #003153; margin-top: 0;">Google reviews disappeared from your profile</h2>
          <p>The nightly archive compared last night's record to what Google is showing now. Use the table and the copy-paste packet below when you contact Google.</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 12px; color: #4A5568;">Public count before:</td><td style="padding: 6px 12px; font-weight: 600;">${escapeHtml(previousPlacesCount ?? 'unknown')}</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">Public count now:</td><td style="padding: 6px 12px; font-weight: 600; color: #D30000;">${escapeHtml(livePlacesCount ?? 'unknown')}</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">Change:</td><td style="padding: 6px 12px; font-weight: 600;">${delta == null ? 'n/a' : delta}</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">Named missing reviews:</td><td style="padding: 6px 12px; font-weight: 600;">${newlyMissing.length}</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">GBP API list length:</td><td style="padding: 6px 12px;">${escapeHtml(gbpListCount ?? 'unknown')}</td></tr>
            ${unnamedDropEstimate > 0 ? `<tr><td style="padding: 6px 12px; color: #4A5568;">Unnamed count gap:</td><td style="padding: 6px 12px;">~${escapeHtml(unnamedDropEstimate)} (likely star-only, never archived)</td></tr>` : ''}
            ${restored.length ? `<tr><td style="padding: 6px 12px; color: #4A5568;">Restored tonight:</td><td style="padding: 6px 12px;">${restored.length}</td></tr>` : ''}
          </table>
          ${
            newlyMissing.length
              ? `<table style="border-collapse: collapse; width: 100%; font-size: 14px; margin: 16px 0;">
            <tr style="background:#F7FAFC;">
              <th style="padding:8px 10px;border:1px solid #E2E8F0;text-align:left;">Reviewer</th>
              <th style="padding:8px 10px;border:1px solid #E2E8F0;text-align:left;">Stars</th>
              <th style="padding:8px 10px;border:1px solid #E2E8F0;text-align:left;">Date</th>
              <th style="padding:8px 10px;border:1px solid #E2E8F0;text-align:left;">Text</th>
              <th style="padding:8px 10px;border:1px solid #E2E8F0;text-align:left;">Google review ID</th>
            </tr>
            ${rowsHtml}
          </table>`
              : '<p>No named reviews in the archive match this drop. After tonight’s seed, future drops will list names, dates, text, and IDs.</p>'
          }
          <h3 style="color:#003153;">What to do</h3>
          <ol>
            <li>Wait 48–72 hours if this is the first night — filtered reviews sometimes return on their own.</li>
            <li>If they are still gone, sign in as the <strong>profile owner</strong> and open <a href="https://support.google.com/business/gethelp">Google Business Profile support</a>. Choose DFW HVAC, then <strong>Missing reviews</strong>.</li>
            <li>Paste the packet below. If you can reach any of these customers, ask them to screenshot the review on their Google Maps <em>Contributions</em> tab — that is the evidence Google acts on.</li>
          </ol>
          <h3 style="color:#003153;">Copy-paste for Google support</h3>
          <pre style="white-space: pre-wrap; background: #F7FAFC; border: 1px solid #E2E8F0; padding: 16px; font-size: 12px; line-height: 1.45;">${escapeHtml(packet)}</pre>
          <p style="color: #718096; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
            Sent automatically by /api/cron/sync-reviews from your Google Review Archive. Mute with <code>DISAPPEARANCE_ALERT_ENABLED=false</code>.
          </p>
        </div>
      `
}

export function disappearanceAlertSubject({ previousPlacesCount, livePlacesCount, newlyMissingCount }) {
  if (
    typeof previousPlacesCount === 'number' &&
    typeof livePlacesCount === 'number' &&
    livePlacesCount < previousPlacesCount
  ) {
    const drop = previousPlacesCount - livePlacesCount
    return `⚠️ DFW HVAC: Google review count dropped ${previousPlacesCount} → ${livePlacesCount} (−${drop})`
  }
  return `⚠️ DFW HVAC: ${newlyMissingCount} Google review${newlyMissingCount === 1 ? '' : 's'} missing from your profile`
}

export async function fetchPreviousPlacesCount() {
  const lastLog = await sanityQuery(
    `*[_type=="googleReviewSyncLog"]|order(snapshotAt desc)[0]{placesCount}`
  )
  if (typeof lastLog?.placesCount === 'number') return lastLog.placesCount
  const info = await sanityQuery(`*[_id=="companyInfo"][0]{googleReviews}`)
  return typeof info?.googleReviews === 'number' ? info.googleReviews : null
}

function livePatchFields(doc) {
  return {
    googleReviewId: doc.googleReviewId,
    resourceName: doc.resourceName,
    reviewerName: doc.reviewerName,
    starRating: doc.starRating,
    comment: doc.comment,
    hasText: doc.hasText,
    dateDisplay: doc.dateDisplay,
    createTime: doc.createTime,
    updateTime: doc.updateTime,
    reviewReply: doc.reviewReply,
    status: 'live',
    lastSeenAt: doc.lastSeenAt,
  }
}

/**
 * Upsert tonight's GBP reviews into the archive, mark missing IDs, seed from
 * website testimonials that Google no longer returns, write a daily sync log.
 */
export async function syncGoogleReviewLedger({
  reviews,
  previousPlacesCount,
  livePlacesCount,
}) {
  const nowIso = new Date().toISOString()
  const liveDocs = []
  let skippedBad = 0

  for (const review of reviews || []) {
    const doc = mapGbpReviewToLedger(review, nowIso)
    if (!doc) {
      skippedBad += 1
      continue
    }
    liveDocs.push(doc)
  }

  const liveIdSet = new Set(liveDocs.map((d) => d.googleReviewId))

  const existingLedgers =
    (await sanityQuery(
      `*[_type=="googleReviewLedger"]{_id,googleReviewId,status,missingSince,reviewerName,starRating,comment,dateDisplay,createTime}`
    )) || []

  const { newlyMissing, restored, stillMissing, existingIds } = classifyLedgerDiff(
    existingLedgers,
    liveIdSet
  )

  const testimonials =
    (await sanityQuery(
      `*[_type=="testimonial" && defined(googleReviewId)]{googleReviewId,name,rating,text,date}`
    )) || []

  const seededMissing = []
  for (const t of testimonials) {
    const id = t.googleReviewId ? String(t.googleReviewId) : ''
    if (!id || liveIdSet.has(id) || existingIds.has(id)) continue
    seededMissing.push({
      _id: googleReviewLedgerDocId(id),
      _type: 'googleReviewLedger',
      googleReviewId: id,
      reviewerName: String(t.name || 'Google Customer').slice(0, 200),
      starRating: typeof t.rating === 'number' ? t.rating : 5,
      comment: (t.text || '').trim(),
      hasText: Boolean((t.text || '').trim()),
      dateDisplay: t.date || '',
      createTime: '',
      updateTime: '',
      reviewReply: '',
      resourceName: '',
      status: 'missing',
      firstSeenAt: nowIso,
      missingSince: nowIso,
      seededFrom: 'testimonial',
    })
  }

  const mutations = []

  for (const doc of liveDocs) {
    mutations.push({
      createIfNotExists: {
        ...doc,
        firstSeenAt: nowIso,
      },
    })
    mutations.push({
      patch: {
        id: doc._id,
        set: livePatchFields(doc),
        unset: ['missingSince'],
      },
    })
  }

  for (const row of restored) {
    mutations.push({
      patch: {
        id: row._id,
        set: { restoredAt: nowIso },
      },
    })
  }

  for (const row of newlyMissing) {
    mutations.push({
      patch: {
        id: row._id,
        set: { status: 'missing' },
        setIfMissing: { missingSince: nowIso },
      },
    })
  }

  for (const doc of seededMissing) {
    mutations.push({ createIfNotExists: doc })
  }

  await sanityMutate(mutations)

  const allNewlyMissing = [...newlyMissing, ...seededMissing]
  const missingLedgerCount = stillMissing.length + allNewlyMissing.length
  const liveLedgerCount = liveDocs.length
  const placesDelta =
    typeof previousPlacesCount === 'number' && typeof livePlacesCount === 'number'
      ? livePlacesCount - previousPlacesCount
      : 0

  const unnamedDropEstimate =
    typeof previousPlacesCount === 'number' &&
    typeof livePlacesCount === 'number' &&
    livePlacesCount < previousPlacesCount
      ? Math.max(0, previousPlacesCount - livePlacesCount - allNewlyMissing.length)
      : 0

  const alertWouldSend = shouldSendDisappearanceAlert({
    previousPlacesCount,
    livePlacesCount,
    newlyMissingCount: allNewlyMissing.length,
  })

  const logId = googleReviewSyncLogDocId(nowIso)
  await sanityMutate([
    {
      createOrReplace: {
        _id: logId,
        _type: 'googleReviewSyncLog',
        snapshotAt: nowIso,
        placesCount: livePlacesCount,
        previousPlacesCount,
        placesDelta,
        gbpListCount: (reviews || []).length,
        liveLedgerCount,
        missingLedgerCount,
        newlyMissingCount: allNewlyMissing.length,
        restoredCount: restored.length,
        newlyMissingIds: allNewlyMissing.map((r) => r.googleReviewId),
        alertSent: false,
      },
    },
  ])

  return {
    gbpListCount: (reviews || []).length,
    liveLedgerCount,
    missingLedgerCount,
    newlyMissing: allNewlyMissing,
    newlyMissingCount: allNewlyMissing.length,
    restoredCount: restored.length,
    restored,
    seededFromTestimonials: seededMissing.length,
    skippedBad,
    previousPlacesCount,
    livePlacesCount,
    placesDelta,
    unnamedDropEstimate,
    alertWouldSend,
    syncLogId: logId,
  }
}

export async function markDisappearanceAlertSent(syncLogId) {
  if (!syncLogId) return
  await sanityMutate([
    {
      patch: {
        id: syncLogId,
        set: { alertSent: true },
      },
    },
  ])
}
