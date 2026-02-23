// SEO metadata utilities for DFW HVAC

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'

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
  twitter: {
    card: 'summary_large_image',
    creator: '@dfwhvac',
  },
  openGraph: {
    siteName: 'DFW HVAC',
    locale: 'en_US',
    type: 'website',
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
      telephone: '(972) 777-COOL',
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
        'Dallas, TX',
        'Fort Worth, TX',
        'Arlington, TX',
        'Plano, TX',
        'Irving, TX',
        'Garland, TX',
        'Grand Prairie, TX',
        'Mesquite, TX',
        'Carrollton, TX',
        'Richardson, TX',
        'Lewisville, TX',
        'Coppell, TX'
      ],
      openingHours: [
        'Mo-Fr 09:00-18:00'
      ],
      priceRange: '$$',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: '118'
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