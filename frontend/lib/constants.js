// Site-wide shared constants. Single source of truth for values that need
// to be consistent across the entire codebase.

/**
 * Fallback Google review count.
 *
 * Real-time review count lives in Sanity (`companyInfo.googleReviews`) and is
 * synced nightly from the Google Places API by /api/cron/sync-reviews.
 * Templates render that live value at request time.
 *
 * This constant is the **last-resort fallback** used only when the Sanity fetch
 * fails (network blip, dataset misconfig, build-time render with no live data).
 * It also seeds the static metadata exports in `lib/metadata.js` that get
 * generated at module-load time before any per-request data is available.
 *
 * **HOW TO BUMP THIS NUMBER:** the daily cron now emits a Resend email when
 * the live count drifts more than 20 reviews from this constant — that's your
 * cue to update this value to roughly the live count and ship a one-line PR.
 *
 * Last calibrated: Feb 28, 2026 (live = 149).
 */
export const REVIEW_COUNT_FALLBACK = 149

/**
 * Drift alert threshold. The cron sends a one-line email to the owner when
 * |live count − REVIEW_COUNT_FALLBACK| exceeds this number.
 *
 * Why 20? Reviews accrue at ~2–4/month for an active DFW HVAC business, so
 * 20 reviews is roughly 5–10 months of drift — long enough that a stale
 * fallback could become embarrassing on a Sanity outage, short enough that
 * the maintenance email doesn't become noise.
 */
export const REVIEW_DRIFT_ALERT_THRESHOLD = 20
