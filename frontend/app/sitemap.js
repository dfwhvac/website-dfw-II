import { client } from '../lib/sanity'

// Base URL - will be dfwhvac.com in production
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'

export default async function sitemap() {
  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/request-service', priority: 0.9, changeFrequency: 'monthly' },
    { url: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/reviews', priority: 0.7, changeFrequency: 'weekly' },
    { url: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/estimate', priority: 0.8, changeFrequency: 'monthly' },
    // NOTE: /recent-projects temporarily redirects to /reviews (see next.config.js)
    // Re-add when static Showcase Projects page is built
    { url: '/cities-served', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
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
    lastModified: currentDate,
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
