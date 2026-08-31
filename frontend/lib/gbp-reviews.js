/**
 * Google Business Profile → review helpers for /api/cron/sync-reviews.
 * Phase C (Aug 2026): OAuth refresh + paginated reviews.list + Sanity upsert.
 */

const STAR_RATING = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

function requiredEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env ${name}`)
  return v
}

/** Exchange refresh token for a short-lived access token. */
export async function getGbpAccessToken() {
  const clientId = requiredEnv('GBP_OAUTH_CLIENT_ID')
  const clientSecret = requiredEnv('GBP_OAUTH_CLIENT_SECRET')
  const refreshToken = requiredEnv('GBP_OAUTH_REFRESH_TOKEN')

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json()
  if (!res.ok || !data.access_token) {
    throw new Error(
      `GBP OAuth token exchange failed: ${data.error || res.status} ${data.error_description || JSON.stringify(data)}`
    )
  }
  return data.access_token
}

/**
 * Paginate accounts.locations.reviews.list (pageSize max 50).
 * Returns raw review objects from Google.
 */
export async function fetchAllGbpReviews(accessToken) {
  const accountId = requiredEnv('GBP_ACCOUNT_ID').replace(/^accounts\//, '')
  const locationId = requiredEnv('GBP_LOCATION_ID').replace(/^locations\//, '')

  const all = []
  let pageToken = ''
  let pages = 0
  const maxPages = 40 // safety: 40 × 50 = 2000 reviews

  do {
    pages += 1
    if (pages > maxPages) {
      throw new Error(`GBP reviews pagination exceeded ${maxPages} pages`)
    }

    const url = new URL(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`
    )
    url.searchParams.set('pageSize', '50')
    url.searchParams.set('orderBy', 'updateTime desc')
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(
        `GBP reviews.list failed: ${res.status} ${JSON.stringify(data)}`
      )
    }

    const batch = data.reviews || []
    all.push(...batch)
    pageToken = data.nextPageToken || ''

    if (pageToken) {
      await new Promise((r) => setTimeout(r, 100))
    }
  } while (pageToken)

  return {
    reviews: all,
    totalReviewCount: all.length,
    averageRating: null,
  }
}

export function starRatingToNumber(starRating) {
  if (typeof starRating === 'number') return starRating
  return STAR_RATING[starRating] || 5
}

/** Match existing site convention: MM/DD/YY string. */
export function formatReviewDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${mm}/${dd}/${yy}`
}

export function googleReviewDocId(reviewId) {
  const safe = String(reviewId).replace(/[^a-zA-Z0-9._-]/g, '-')
  return `google-review-${safe}`
}

/** Stable Google review id from a GBP reviews.list object. */
export function extractGbpReviewId(review) {
  if (!review) return null
  if (review.reviewId) return String(review.reviewId)
  if (typeof review.name === 'string' && review.name.includes('/')) {
    const last = review.name.split('/').pop()
    return last || null
  }
  return null
}

export function gbpReviewerDisplayName(review) {
  const name = review?.reviewer?.displayName
  if (name && String(name).trim()) return String(name).trim().slice(0, 200)
  return 'Google Customer'
}

/**
 * Map a GBP review to a Sanity testimonial document (createOrReplace payload).
 * Returns null if there is no usable review text.
 */
export function mapGbpReviewToTestimonial(review) {
  const text = (review.comment || '').trim()
  if (!text) return null

  const reviewId = extractGbpReviewId(review)
  if (!reviewId) return null

  return {
    _id: googleReviewDocId(reviewId),
    _type: 'testimonial',
    name: gbpReviewerDisplayName(review),
    rating: starRatingToNumber(review.starRating),
    text,
    date: formatReviewDate(review.createTime || review.updateTime),
    source: 'google',
    isVisible: true,
    googleReviewId: String(reviewId),
  }
}

/**
 * Upsert reviews-with-text into Sanity; optionally soft-hide legacy Google
 * testimonials that lack googleReviewId (old CSV imports) once sync looks healthy.
 */
export async function upsertGbpReviewsToSanity(reviews) {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const token = process.env.SANITY_API_TOKEN
  if (!token) throw new Error('Missing env SANITY_API_TOKEN')

  const docs = []
  let skippedNoText = 0
  let skippedBad = 0

  for (const review of reviews) {
    const doc = mapGbpReviewToTestimonial(review)
    if (!doc) {
      if (!(review.comment || '').trim()) skippedNoText += 1
      else skippedBad += 1
      continue
    }
    docs.push(doc)
  }

  const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`
  const chunkSize = 40
  let createdOrUpdated = 0

  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize)
    const mutations = chunk.map((doc) => ({
      createOrReplace: doc,
    }))

    const res = await fetch(mutateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutations }),
    })
    const result = await res.json()
    if (!res.ok) {
      throw new Error(
        `Sanity testimonial upsert failed: ${res.status} ${JSON.stringify(result)}`
      )
    }
    createdOrUpdated += chunk.length
  }

  let legacyHidden = 0
  // Only hide old CSV-style Google testimonials after a solid first sync.
  if (docs.length >= 20) {
    const query = encodeURIComponent(
      `*[_type=="testimonial" && source=="google" && !defined(googleReviewId) && isVisible != false]._id`
    )
    const qRes = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const qData = await qRes.json()
    const legacyIds = Array.isArray(qData.result) ? qData.result : []

    for (let i = 0; i < legacyIds.length; i += chunkSize) {
      const chunk = legacyIds.slice(i, i + chunkSize)
      const mutations = chunk.map((id) => ({
        patch: {
          id,
          set: { isVisible: false },
        },
      }))
      const res = await fetch(mutateUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mutations }),
      })
      if (!res.ok) {
        const errBody = await res.text()
        console.error('[gbp-reviews] legacy hide failed:', errBody)
        break
      }
      legacyHidden += chunk.length
    }
  }

  return {
    upserted: createdOrUpdated,
    skippedNoText,
    skippedBad,
    legacyHidden,
  }
}

/** True when all GBP OAuth + account/location env vars are present. */
export function isGbpReviewSyncConfigured() {
  return Boolean(
    process.env.GBP_OAUTH_CLIENT_ID &&
      process.env.GBP_OAUTH_CLIENT_SECRET &&
      process.env.GBP_OAUTH_REFRESH_TOKEN &&
      process.env.GBP_ACCOUNT_ID &&
      process.env.GBP_LOCATION_ID
  )
}
