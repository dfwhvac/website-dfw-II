// SEO metadata utilities for DFW HVAC

export function createMetadata({
  title,
  description,
  keywords = 'hvac, air conditioning, heating, dallas, fort worth, texas, repair, installation, maintenance',
  image = '/images/dfwhvac-og.jpg',
  url = 'https://dfwhvac.com'
}) {
  return {
    title,
    description,
    keywords,
    authors: [{ name: 'DFW HVAC' }],
    creator: 'DFW HVAC',
    publisher: 'DFW HVAC',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'DFW HVAC',
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@dfwhvac',
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
  }
}

export function createJsonLd(data) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://dfwhvac.com/#organization',
      name: 'DFW HVAC',
      description: 'Family owned Air Conditioning and Heating contractor serving Dallas - Fort Worth and surrounding areas since 1974.',
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