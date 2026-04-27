// SEO metadata utilities for DFW HVAC

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'

/**
 * Option C hybrid review-count logic — shipped with P1.6a (Apr 23, 2026).
 *
 * The page title badge "{N} Five-Star Reviews" is a major CTR driver and must
 * never go stale or embarrassing. Source-of-truth priority:
 *
 *   1. If googleRating >= 4.95 → use live googleReviews count (synced daily
 *      via /api/cron/sync-reviews from Google Places API).
 *   2. Else → fall back to manually-curated fiveStarReviewCount (seeded at 150,
 *      editable in Sanity Studio).
 *   3. Else → return null. Caller should render title WITHOUT the badge.
 *
 * The rationale: as long as the true average stays at or near 5.0, every review
 * is effectively a five-star review, so the total count equals the five-star
 * count. If a 4-star or lower review lands and the rating dips, the total no
 * longer equals the five-star count, so we read from a human-maintained field.
 *
 * @param {Object|null} companyInfo - Sanity companyInfo doc with googleRating, googleReviews, fiveStarReviewCount
 * @returns {number|null} Count to display in title, or null if no valid count available
 */
export function getReviewBadgeCount(companyInfo) {
  if (!companyInfo) return null
  const rating = typeof companyInfo.googleRating === 'number' ? companyInfo.googleRating : null
  const total = typeof companyInfo.googleReviews === 'number' ? companyInfo.googleReviews : null
  const fiveStar = typeof companyInfo.fiveStarReviewCount === 'number' ? companyInfo.fiveStarReviewCount : null

  if (rating !== null && rating >= 4.95 && total !== null && total > 0) {
    return total
  }
  if (fiveStar !== null && fiveStar > 0) {
    return fiveStar
  }
  return null
}

/**
 * Compose a page title with an optional review-count badge, following the
 * formats finalized in /app/memory/audits/2026-04-23_Title_Tag_Final.csv.
 *
 * Canonical shape:  "{prefix} | {N} Five-Star Reviews | {brand}"
 * When count is null the badge segment is omitted: "{prefix} | {brand}"
 * When includeBrand is false the brand segment is omitted (used for longest
 * city titles like North Richland Hills and the GSC-refined /, /dallas rows
 * where the brand is dropped to keep under 60 chars).
 *
 * @param {Object} opts
 * @param {string} opts.prefix - Keyword-first segment (e.g. "Dallas AC Repair")
 * @param {number|null} opts.count - Review count from getReviewBadgeCount()
 * @param {boolean} [opts.includeBrand=true] - Append "| DFW HVAC" suffix
 * @param {string} [opts.brand='DFW HVAC'] - Brand suffix text
 * @returns {string}
 */
export function buildTitleWithBadge({ prefix, count, includeBrand = true, brand = 'DFW HVAC' }) {
  const parts = [prefix]
  if (count && Number.isFinite(count) && count > 0) {
    parts.push(`${count} Five-Star Reviews`)
  }
  if (includeBrand) {
    parts.push(brand)
  }
  return parts.join(' | ')
}

/**
 * Default metadata for the root layout.
 * Individual pages should use generateMetadata() with buildPageMetadata().
 */
export const defaultMetadata = {
  metadataBase: new URL(BASE_URL),
  authors: [{ name: 'DFW HVAC' }],
  creator: 'DFW HVAC',
  publisher: 'DFW HVAC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // S6 (Apr 27, 2026) — defaults enriched so any page that does NOT call
  // buildPageMetadata() still produces a complete OG/Twitter card on social
  // shares (Facebook, LinkedIn, iMessage, Slack, X). Page-level metadata in
  // generateMetadata() can override these per-route.
  twitter: {
    card: 'summary_large_image',
    site: '@dfwhvac',
    creator: '@dfwhvac',
    title: 'DFW HVAC — Three-Generation HVAC Service in Dallas-Fort Worth',
    description:
      'Same-day HVAC repair, installation & maintenance across Dallas-Fort Worth. Licensed, family-owned, 145+ five-star reviews. Call (972) 777-COOL.',
    images: [
      {
        url: '/images/dfwhvac-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DFW HVAC — Dallas-Fort Worth HVAC Experts',
      },
    ],
  },
  openGraph: {
    siteName: 'DFW HVAC',
    locale: 'en_US',
    type: 'website',
    url: BASE_URL,
    title: 'DFW HVAC — Three-Generation HVAC Service in Dallas-Fort Worth',
    description:
      'Same-day HVAC repair, installation & maintenance across Dallas-Fort Worth. Licensed, family-owned, 145+ five-star reviews. Call (972) 777-COOL.',
    images: [
      {
        url: '/images/dfwhvac-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DFW HVAC — Dallas-Fort Worth HVAC Experts',
      },
    ],
  },
}

/**
 * Build page-specific metadata with proper canonical URL.
 * Use this in each page's generateMetadata() function.
 * 
 * @param {Object} options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.path - Canonical path (e.g., '/contact', '/services/residential/air-conditioning')
 * @param {string} [options.image] - OG image path
 * @returns {Object} Next.js metadata object
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image = '/images/dfwhvac-og.jpg',
}) {
  const url = `${BASE_URL}${path}`
  
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
  }
}

/**
 * @deprecated Use buildPageMetadata() instead for page-level metadata.
 * This is kept for backwards compatibility with layout.js
 */
export function createMetadata({
  title,
  description,
  keywords = 'hvac, air conditioning, heating, dallas, fort worth, texas, repair, installation, maintenance',
  image = '/images/dfwhvac-og.jpg',
}) {
  return {
    ...defaultMetadata,
    title,
    description,
    keywords,
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [image],
    },
  }
}

export function createJsonLd(data) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://dfwhvac.com/#organization',
      name: 'DFW HVAC',
      description: 'Family owned Air Conditioning and Heating contractor serving Dallas - Fort Worth and surrounding areas.',
      url: 'https://dfwhvac.com',
      telephone: '+1-972-777-2665',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '556 S Coppell Rd Ste 103',
        addressLocality: 'Coppell',
        addressRegion: 'TX',
        postalCode: '75019',
        addressCountry: 'US'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '32.9668',
        longitude: '-97.0195'
      },
      areaServed: [
        'Allen, TX',
        'Argyle, TX',
        'Arlington, TX',
        'Bedford, TX',
        'Carrollton, TX',
        'Colleyville, TX',
        'Coppell, TX',
        'Dallas, TX',
        'Denton, TX',
        'Euless, TX',
        'Farmers Branch, TX',
        'Flower Mound, TX',
        'Fort Worth, TX',
        'Frisco, TX',
        'Grapevine, TX',
        'Haslet, TX',
        'Hurst, TX',
        'Irving, TX',
        'Keller, TX',
        'Lake Dallas, TX',
        'Lewisville, TX',
        'Mansfield, TX',
        'North Richland Hills, TX',
        'Plano, TX',
        'Richardson, TX',
        'Roanoke, TX',
        'Southlake, TX',
        'The Colony, TX'
      ],
      openingHours: [
        'Mo-Fr 07:00-18:00'
      ],
      priceRange: '$$',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '145'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'HVAC Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Air Conditioning Repair',
              description: 'Professional AC repair services'
            }
          },
          {
            '@type': 'Offer', 
            itemOffered: {
              '@type': 'Service',
              name: 'Heating System Installation',
              description: 'Complete heating system installation'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service', 
              name: 'Preventative Maintenance',
              description: 'Regular HVAC maintenance services'
            }
          }
        ]
      },
      ...data
    })
  }
}