'use client'

// Schema markup component that generates JSON-LD structured data
// All values are pulled from Sanity companyInfo

export function LocalBusinessSchema({ companyInfo }) {
  if (!companyInfo) return null

  // Parse address into components
  const addressParts = (companyInfo.address || '').split(',').map(s => s.trim())
  const streetAddress = addressParts[0] || ''
  const cityStateZip = addressParts.slice(1).join(', ')
  const cityMatch = cityStateZip.match(/^([^,]+),?\s*([A-Z]{2})\s*(\d{5})?/)
  const city = cityMatch?.[1] || ''
  const state = cityMatch?.[2] || ''
  const zip = cityMatch?.[3] || ''

  // Build hours specification
  const hoursSpec = []
  const hours = companyInfo.businessHours || {}
  const dayMap = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  }

  for (const [key, day] of Object.entries(dayMap)) {
    const value = hours[key]
    if (value && value.toLowerCase() !== 'closed') {
      // Parse "7AM-7PM" format
      const match = value.match(/(\d+(?::\d+)?(?:AM|PM)?)\s*-\s*(\d+(?::\d+)?(?:AM|PM)?)/i)
      if (match) {
        hoursSpec.push({
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": day,
          "opens": match[1],
          "closes": match[2]
        })
      }
    }
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": companyInfo.name || "DFW HVAC",
    "description": companyInfo.description || "",
    "url": "https://dfwhvac.com",
    "telephone": companyInfo.phone || "",
    "email": companyInfo.email || "",
    "foundingDate": companyInfo.established || "1974",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "32.9545",
      "longitude": "-96.9903"
    },
    "areaServed": (companyInfo.serviceAreas || []).map(area => ({
      "@type": "City",
      "name": area
    })),
    "openingHoursSpecification": hoursSpec,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (companyInfo.googleRating || 5.0).toString(),
      "reviewCount": (companyInfo.googleReviews || 130).toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, Check",
    "currenciesAccepted": "USD"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function FAQSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ReviewSchema({ companyInfo, reviewCount }) {
  if (!companyInfo) return null

  // Parse address
  const addressParts = (companyInfo.address || '').split(',').map(s => s.trim())
  const streetAddress = addressParts[0] || ''
  const cityStateZip = addressParts.slice(1).join(', ')
  const cityMatch = cityStateZip.match(/^([^,]+),?\s*([A-Z]{2})\s*(\d{5})?/)
  const city = cityMatch?.[1] || ''
  const state = cityMatch?.[2] || ''
  const zip = cityMatch?.[3] || ''

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyInfo.name || "DFW HVAC",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": zip,
      "addressCountry": "US"
    },
    "telephone": companyInfo.phone || "",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (companyInfo.googleRating || 5.0).toString(),
      "reviewCount": (reviewCount || companyInfo.googleReviews || 130).toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
