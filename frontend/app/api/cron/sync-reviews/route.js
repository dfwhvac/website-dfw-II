import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { REVIEW_COUNT_FALLBACK, REVIEW_DRIFT_ALERT_THRESHOLD } from '@/lib/constants'
import {
  fetchAllGbpReviews,
  getGbpAccessToken,
  isGbpReviewSyncConfigured,
  upsertGbpReviewsToSanity,
} from '@/lib/gbp-reviews'
import {
  buildDisappearanceAlertHtml,
  buildGoogleSupportPacket,
  disappearanceAlertSubject,
  fetchPreviousPlacesCount,
  markDisappearanceAlertSent,
  shouldSendDisappearanceAlert,
  syncGoogleReviewLedger,
} from '@/lib/google-review-ledger'

// Allow full GBP pagination + Sanity upserts on scheduled runs (Pro/Fluid).
export const maxDuration = 300

/** Paths that read companyInfo review count and/or testimonial lists. */
const REVIEW_DEPENDENT_PATHS = [
  '/reviews',
  '/',
  '/about',
  '/services',
]

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJoSn502QpTIYRy6YwoMmFyCE'
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN

const CRON_SECRET = process.env.CRON_SECRET

// Drift alert wiring (Feb 28, 2026). Reuses the same Resend account already
// configured for lead emails — zero new infra. Disabled when DRIFT_ALERT_ENABLED
// is set to "false" (any other value, including unset, leaves it enabled).
const RESEND_API_KEY = process.env.RESEND_API_KEY
const DRIFT_ALERT_TO = process.env.DRIFT_ALERT_TO || process.env.NOTIFICATION_EMAIL || 'support@dfwhvac.com'
const DRIFT_ALERT_FROM = process.env.DRIFT_ALERT_FROM || process.env.NOTIFICATION_FROM || 'notifications@dfwhvac.com'
const DRIFT_ALERT_ENABLED = process.env.DRIFT_ALERT_ENABLED !== 'false'
const DISAPPEARANCE_ALERT_ENABLED = process.env.DISAPPEARANCE_ALERT_ENABLED !== 'false'
const IS_PRODUCTION_DEPLOY = process.env.VERCEL_ENV === 'production'
const GBP_LOCATION_ID = process.env.GBP_LOCATION_ID || ''

/**
 * If the live Google review count has drifted >REVIEW_DRIFT_ALERT_THRESHOLD
 * reviews from the hardcoded REVIEW_COUNT_FALLBACK, send a one-line maintenance
 * email to the owner. Used to nudge a dev to bump REVIEW_COUNT_FALLBACK in
 * lib/constants.js before any Sanity outage causes user-visible drift on the
 * fallback paths.
 *
 * Runs only in production (preview/dev short-circuit) and only when Resend
 * credentials are configured — silent no-op otherwise. Cron success is never
 * gated on alert delivery.
 */
async function maybeSendDriftAlert(liveCount) {
  if (!DRIFT_ALERT_ENABLED) return { skipped: 'disabled' }
  if (!IS_PRODUCTION_DEPLOY) return { skipped: 'non-production' }
  if (!RESEND_API_KEY || !DRIFT_ALERT_TO) return { skipped: 'missing-credentials' }

  const drift = Math.abs(liveCount - REVIEW_COUNT_FALLBACK)
  if (drift <= REVIEW_DRIFT_ALERT_THRESHOLD) {
    return { skipped: 'within-threshold', drift, threshold: REVIEW_DRIFT_ALERT_THRESHOLD }
  }

  try {
    const resend = new Resend(RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: DRIFT_ALERT_FROM,
      to: DRIFT_ALERT_TO,
      subject: `⚠️ DFW HVAC review-count drift — backup is ${drift} behind live`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; padding: 24px; color: #2D3748;">
          <h2 style="color: #003153; margin-top: 0;">Review count drift detected</h2>
          <p>Heads up — your hardcoded backup review count is now <strong>${drift} reviews</strong> behind the live Google count.</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 12px; color: #4A5568;">Backup constant:</td><td style="padding: 6px 12px; font-weight: 600;">${REVIEW_COUNT_FALLBACK}</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">Live count:</td><td style="padding: 6px 12px; font-weight: 600; color: #16A34A;">${liveCount}</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">Drift:</td><td style="padding: 6px 12px; font-weight: 600; color: #D30000;">${drift} reviews</td></tr>
            <tr><td style="padding: 6px 12px; color: #4A5568;">Threshold:</td><td style="padding: 6px 12px;">${REVIEW_DRIFT_ALERT_THRESHOLD} reviews</td></tr>
          </table>
          <p>The website itself will keep displaying the live number correctly on every page that successfully reads from Sanity. But if Sanity ever has an outage, your fallback pages would render the stale ${REVIEW_COUNT_FALLBACK}.</p>
          <p><strong>What to do:</strong> bump <code>REVIEW_COUNT_FALLBACK</code> in <code>frontend/lib/constants.js</code> to roughly <strong>${liveCount}</strong> at your convenience. Any value within the threshold of live is fine — this is a maintenance reminder, not an outage.</p>
          <p style="color: #718096; font-size: 12px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
            Sent automatically by /api/cron/sync-reviews. To mute, set <code>DRIFT_ALERT_ENABLED=false</code> in Vercel env. To change the threshold, edit <code>REVIEW_DRIFT_ALERT_THRESHOLD</code> in <code>lib/constants.js</code>.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('[drift-alert] Resend error:', error)
      return { sent: false, error: error.message || String(error) }
    }
    return { sent: true, id: data?.id, drift, liveCount, fallback: REVIEW_COUNT_FALLBACK }
  } catch (err) {
    console.error('[drift-alert] Unexpected error:', err)
    return { sent: false, error: err.message || String(err) }
  }
}

/**
 * Email the owner when the public Google count drops or named reviews leave
 * the live GBP list. Includes a copy-paste packet for Google support.
 * Never blocks cron success.
 */
async function maybeSendDisappearanceAlert(ledger) {
  if (!DISAPPEARANCE_ALERT_ENABLED) return { skipped: 'disabled' }
  if (!IS_PRODUCTION_DEPLOY) return { skipped: 'non-production' }
  if (!RESEND_API_KEY || !DRIFT_ALERT_TO) return { skipped: 'missing-credentials' }

  const newlyMissing = ledger?.newlyMissing || []
  if (
    !shouldSendDisappearanceAlert({
      previousPlacesCount: ledger.previousPlacesCount,
      livePlacesCount: ledger.livePlacesCount,
      newlyMissingCount: newlyMissing.length,
    })
  ) {
    return { skipped: 'no-drop' }
  }

  const packet = buildGoogleSupportPacket({
    previousPlacesCount: ledger.previousPlacesCount,
    livePlacesCount: ledger.livePlacesCount,
    snapshotAt: new Date().toISOString(),
    newlyMissing,
    gbpListCount: ledger.gbpListCount,
    placeId: GOOGLE_PLACE_ID,
    gbpLocationId: GBP_LOCATION_ID,
  })

  try {
    const resend = new Resend(RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: DRIFT_ALERT_FROM,
      to: DRIFT_ALERT_TO,
      subject: disappearanceAlertSubject({
        previousPlacesCount: ledger.previousPlacesCount,
        livePlacesCount: ledger.livePlacesCount,
        newlyMissingCount: newlyMissing.length,
      }),
      html: buildDisappearanceAlertHtml({
        previousPlacesCount: ledger.previousPlacesCount,
        livePlacesCount: ledger.livePlacesCount,
        newlyMissing,
        restored: ledger.restored || [],
        gbpListCount: ledger.gbpListCount,
        unnamedDropEstimate: ledger.unnamedDropEstimate,
        packet,
      }),
    })

    if (error) {
      console.error('[disappearance-alert] Resend error:', error)
      return { sent: false, error: error.message || String(error) }
    }

    try {
      await markDisappearanceAlertSent(ledger.syncLogId)
    } catch (err) {
      console.error('[disappearance-alert] failed to mark sync log:', err)
    }

    return {
      sent: true,
      id: data?.id,
      newlyMissingCount: newlyMissing.length,
      previousPlacesCount: ledger.previousPlacesCount,
      livePlacesCount: ledger.livePlacesCount,
    }
  } catch (err) {
    console.error('[disappearance-alert] Unexpected error:', err)
    return { sent: false, error: err.message || String(err) }
  }
}

export async function GET(request) {
  // Verify cron secret — reject unauthorized requests
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch rating + total count from Google Places API (unchanged Phase A path)
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`
    )
    const googleData = await googleResponse.json()

    if (googleData.status !== 'OK') {
      return NextResponse.json({ error: 'Google API error', details: googleData }, { status: 500 })
    }

    const { rating, user_ratings_total } = googleData.result

    let previousPlacesCount = null
    try {
      previousPlacesCount = await fetchPreviousPlacesCount()
    } catch (err) {
      console.error('[review-ledger] previous count lookup failed:', err)
    }

    // Update Sanity companyInfo rating/count
    const sanityResponse = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${SANITY_DATASET}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mutations: [
            {
              patch: {
                id: 'companyInfo',
                set: {
                  googleRating: rating,
                  googleReviews: user_ratings_total,
                },
              },
            },
          ],
        }),
      }
    )

    const sanityResult = await sanityResponse.json()

    // Phase C — GBP reviews → website testimonials + append-only archive.
    // Does not fail the cron if either step throws.
    let reviewTextSync = { skipped: 'not-run' }
    let reviewLedger = { skipped: 'not-run' }
    try {
      if (!isGbpReviewSyncConfigured()) {
        reviewTextSync = { skipped: 'gbp-env-not-configured' }
        reviewLedger = { skipped: 'gbp-env-not-configured' }
      } else {
        const accessToken = await getGbpAccessToken()
        const { reviews } = await fetchAllGbpReviews(accessToken)
        const upsert = await upsertGbpReviewsToSanity(reviews)
        reviewTextSync = { fetched: reviews.length, ...upsert }
        reviewLedger = await syncGoogleReviewLedger({
          reviews,
          previousPlacesCount,
          livePlacesCount: user_ratings_total,
        })
      }
    } catch (err) {
      console.error('[gbp-reviews] text/ledger sync failed:', err)
      if (reviewTextSync.skipped === 'not-run') {
        reviewTextSync = {
          success: false,
          error: err.message || String(err),
        }
      }
      if (reviewLedger.skipped === 'not-run') {
        reviewLedger = {
          success: false,
          error: err.message || String(err),
          previousPlacesCount,
          livePlacesCount: user_ratings_total,
          newlyMissing: [],
        }
      }
    }

    // Count-drop / missing-review alert — never blocks cron success.
    const disappearanceAlert = await maybeSendDisappearanceAlert({
      ...reviewLedger,
      previousPlacesCount: reviewLedger.previousPlacesCount ?? previousPlacesCount,
      livePlacesCount: reviewLedger.livePlacesCount ?? user_ratings_total,
      newlyMissing: reviewLedger.newlyMissing || [],
    })

    // Drift alert (Feb 28, 2026) — never blocks cron success.
    const driftAlert = await maybeSendDriftAlert(user_ratings_total)

    // Bust ISR so /reviews (and other surfaces) show fresh Sanity data
    // immediately instead of waiting up to revalidate=3600.
    const revalidated = []
    for (const path of REVIEW_DEPENDENT_PATHS) {
      try {
        revalidatePath(path)
        revalidated.push(path)
      } catch (err) {
        console.error(`[sync-reviews] revalidatePath(${path}) failed:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      rating,
      reviewCount: user_ratings_total,
      sanityUpdated: sanityResult,
      reviewTextSync,
      reviewLedger:
        reviewLedger.success === false || reviewLedger.skipped
          ? {
              skipped: reviewLedger.skipped,
              success: reviewLedger.success,
              error: reviewLedger.error,
            }
          : {
              gbpListCount: reviewLedger.gbpListCount,
              liveLedgerCount: reviewLedger.liveLedgerCount,
              missingLedgerCount: reviewLedger.missingLedgerCount,
              newlyMissingCount: reviewLedger.newlyMissingCount,
              restoredCount: reviewLedger.restoredCount,
              seededFromTestimonials: reviewLedger.seededFromTestimonials,
              placesDelta: reviewLedger.placesDelta,
              unnamedDropEstimate: reviewLedger.unnamedDropEstimate,
              alertWouldSend: reviewLedger.alertWouldSend,
            },
      disappearanceAlert,
      revalidated,
      driftAlert,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
