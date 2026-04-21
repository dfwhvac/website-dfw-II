import { NextResponse } from 'next/server'
import { getCompanyInfo } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'

// Always serve fresh — review count changes daily via /api/cron/sync-reviews
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/canonical-description
 *
 * Returns the canonical brand description paragraph with a live, up-to-the-day
 * Google review count. Use this as the single source of truth when populating:
 *
 *   • Google Business Profile (About section)
 *   • Yelp / Angi / HomeAdvisor / Nextdoor business descriptions
 *   • Press releases / media kits
 *   • Partnership outreach
 *   • Anywhere you'd otherwise copy-paste stale marketing copy
 *
 * Workflow (quarterly):
 *   1. curl https://dfwhvac.com/api/canonical-description | jq
 *   2. Copy the `fullParagraph` value
 *   3. Paste into each external directory
 *   4. Re-use `metaDescription` for any platform with a short-description slot
 *
 * Response shape (JSON):
 *   {
 *     tagline: string,            // "Keeping it Cool — For Three Generations."
 *     fullParagraph: string,      // ~90-word canonical description with live review count
 *     metaDescription: string,    // ≤160 char SEO meta description variant
 *     reviewCount: number,        // Live Google review count from Sanity (synced daily)
 *     rating: number,             // e.g., 5.0
 *     asOfDate: string,           // ISO date — when this response was generated
 *     source: 'sanity' | 'fallback',
 *   }
 *
 * Added April 21, 2026 — solves the "how do we keep the canonical paragraph
 * fresh as review count grows?" problem (PR following QA sweep P1.3).
 */
export async function GET() {
  let companyInfo
  let source = 'sanity'

  try {
    companyInfo = await getCompanyInfo()
    if (!companyInfo) {
      companyInfo = mockCompanyInfo
      source = 'fallback'
    }
  } catch {
    companyInfo = mockCompanyInfo
    source = 'fallback'
  }

  const reviewCount = companyInfo.googleReviews || 145
  const rating = companyInfo.googleRating || 5.0
  const tagline = 'Keeping it Cool — For Three Generations.'

  const fullParagraph =
    `${tagline}\n\n` +
    `DFW HVAC is a family-owned, third-generation HVAC business headquartered in ` +
    `Coppell, Texas, carrying forward a legacy of craftsmanship that began in 1972. ` +
    `We serve the entire Dallas-Fort Worth metroplex with expert AC repair, heating ` +
    `service, and system installations — the kind of work a team does when they treat ` +
    `your home like a neighbor's, not a sales quota. No high-pressure pitches, no ` +
    `commission-driven upsells. Just honest diagnostics and workmanship that stands ` +
    `up to the Texas heat, backed by a ${rating.toFixed(1)}★ Google rating across ` +
    `${reviewCount}+ reviews. Built on our pillars of Trust, Excellence, and Care.\n\n` +
    `Text or call (972) 777-COOL for an honest diagnostic today.`

  // SEO meta description — kept at ≤160 chars to avoid SERP truncation.
  // Live review count substituted at request time.
  const metaDescription =
    `Family-owned, third-generation HVAC serving Dallas-Fort Worth. AC repair, ` +
    `heating, installations. ${rating.toFixed(1)}★ · ${reviewCount}+ reviews. ` +
    `Call (972) 777-COOL.`

  return NextResponse.json(
    {
      tagline,
      fullParagraph,
      metaDescription,
      reviewCount,
      rating,
      asOfDate: new Date().toISOString(),
      source,
    },
    {
      headers: {
        // Cache briefly at edge but always revalidate — review count is daily-fresh
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    }
  )
}
