// Site-wide shared constants. Single source of truth for values that need
// to be consistent across the entire codebase.

/**
 * Fallback Google review count — **disaster-recovery only.**
 *
 * Real-time review count lives in Sanity (`companyInfo.googleReviews`) and is
 * synced nightly from the Google Places API by /api/cron/sync-reviews. Every
 * surface that previously baked this constant in at module-load time now
 * reads the live value at request time:
 *   - Title bars                      (`buildTitleWithBadge(companyInfo)`)
 *   - JSON-LD AggregateRating         (SchemaMarkup component)
 *   - Root layout OG/Twitter desc     (P2.22 — `buildDefaultMetadata(companyInfo)`)
 *   - `lib/metadata.createJsonLd()`   (P2.22 — accepts companyInfo)
 *
 * This constant is the **last-resort fallback** used only when Sanity
 * returns null (network blip, dataset misconfig, etc.). It is also the seed
 * for the still-exported `defaultMetadata` const that a few legacy/test
 * paths spread without an async data fetch.
 *
 * **HOW TO BUMP THIS NUMBER:** Post-P2.22 you almost never need to. The
 * daily cron still emits a Resend email when the live count drifts more
 * than 20 reviews from this constant — if you ever see that mail, it means
 * Sanity has been falling back for long enough to leak; investigate Sanity
 * first, only bump this as a stopgap.
 *
 * Last calibrated: Feb 16, 2026 (live = 155).
 */
export const REVIEW_COUNT_FALLBACK = 155

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
