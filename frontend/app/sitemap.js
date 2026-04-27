import { client } from '../lib/sanity'

// Base URL - will be dfwhvac.com in production
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'

// S7 (Apr 27, 2026) — Truly stable pages get a hard-coded lastModified instead
// of reusing `currentDate` on every build. Reason: when EVERY URL in a sitemap
// shows lastmod = "today", Google's sitemap parser tends to ignore lastmod as a
// freshness signal entirely (treats the file as auto-stamped). Tiering tells
// Google "the homepage really did change recently; the privacy-policy did not."
// Update this constant when policy/terms copy actually changes.
const POLICY_LASTMOD = '2026-04-27T00:00:00.000Z'

export default async function sitemap() {
  // Static pages with their priorities and change frequencies.
  // `lastMod`: when omitted, sitemap stamps with today's date (currentDate);
  // when set, the page declares its true last-changed timestamp.
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/request-service', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/reviews', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/estimate', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/financing', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/services/system-replacement', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/repair-or-replace', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/replacement-estimator', priority: 0.8, changeFrequency: 'monthly' },
    // /recent-projects is live with RealWork widget
    { url: '/recent-projects', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/cities-served', priority: 0.8, changeFrequency: 'monthly' },
    // Stable policy pages — pinned lastModified so Google's freshness signal stays honest.
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly', lastMod: POLICY_LASTMOD },
    { url: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly', lastMod: POLICY_LASTMOD },
  ]

  // Fetch dynamic content from Sanity
  let cityPages = []
  let services = []

  try {
    // Fetch city pages
    cityPages = await client.fetch(`*[_type == "cityPage"] { 
      "slug": slug.current,
      _updatedAt
    }`) || []

    // Fetch services
    services = await client.fetch(`*[_type == "service"] { 
      "slug": slug.current,
      category,
      _updatedAt
    }`) || []
  } catch (error) {
    console.error('Error fetching sitemap data:', error)
  }

  // Build sitemap entries
  const currentDate = new Date().toISOString()

  // Static pages
  const staticEntries = staticPages.map(page => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: page.lastMod || currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // City pages
  const cityEntries = cityPages.map(city => ({
    url: `${BASE_URL}/cities-served/${city.slug}`,
    lastModified: city._updatedAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Service pages
  const serviceEntries = services.map(service => ({
    url: `${BASE_URL}/services/${service.category}/${service.slug}`,
    lastModified: service._updatedAt || currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...cityEntries, ...serviceEntries]
}
