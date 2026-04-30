'use client'

// Schema markup component that generates JSON-LD structured data
// All values are pulled from Sanity companyInfo (with REVIEW_COUNT_FALLBACK
// from lib/constants.js as the last-resort fallback).

import { REVIEW_COUNT_FALLBACK } from '@/lib/constants'

/**
 * Safely stringify schema data for injection into a <script type="application/ld+json"> tag.
 *
 * Why this helper:
 * - JSON.stringify does NOT escape `</script>` inside string values. If any string value in
 *   the schema data contained `</script>`, it could break out of the <script> tag context.
 * - Our schema data currently comes exclusively from Sanity (CMS-controlled content, not user
 *   input), so the real attack surface is near-zero — but this is a cheap defensive measure
 *   that also satisfies static analyzers flagging dangerouslySetInnerHTML.
 * - We escape `<` globally (not just `</script>`) because it's the simplest, catches HTML-like
 *   payloads that might appear in descriptions/FAQs, and Google's JSON-LD parser accepts
 *   unicode escapes like \u003c identically to `<`.
 *
 * This is the canonical safe JSON-LD pattern for Next.js / React.
 */
function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function LocalBusinessSchema({ companyInfo, cityPages = [] }) {
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

  // Use cityPages if available, otherwise fall back to serviceAreas
  const areasServed = cityPages.length > 0 
    ? cityPages.map(city => ({
        "@type": "City",
        "name": city.cityName
      }))
    : (companyInfo.serviceAreas || []).map(area => ({
        "@type": "City",
        "name": area
      }))

  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": companyInfo.name || "DFW HVAC",
    "description": companyInfo.description || "",
    "url": "https://dfwhvac.com",
    "telephone": companyInfo.phoneDisplay || "+1-972-777-2665",
    "foundingDate": companyInfo.established || "2020",
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
    "areaServed": areasServed,
    "openingHoursSpecification": hoursSpec,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (companyInfo.googleRating || 5.0).toString(),
      "reviewCount": (companyInfo.googleReviews || REVIEW_COUNT_FALLBACK).toString(),
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
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
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
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
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
    "telephone": companyInfo.phoneDisplay || "+1-972-777-2665",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (companyInfo.googleRating || 5.0).toString(),
      "reviewCount": (reviewCount || companyInfo.googleReviews || REVIEW_COUNT_FALLBACK).toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}

/**
 * BreadcrumbListSchema — structured data for site breadcrumb navigation.
 *
 * Required by Google Rich Results for breadcrumb display in SERP snippets.
 * Pass an ordered array of `{ name, url }` items (first = root, last = current page).
 * URLs should be absolute (https://dfwhvac.com/...).
 *
 * Added Apr 21, 2026 (PR #3, R1.1) for city + service page schema coverage.
 */
export function BreadcrumbListSchema({ items }) {
  if (!items || items.length === 0) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}

/**
 * CityServiceSchema — Service schema anchored to a specific DFW city.
 *
 * Used on city pages (/cities-served/[slug]) to signal that DFW HVAC offers
 * HVAC services within that specific city. Combines `@type: Service` with
 * an `areaServed` City pointer and `provider` reference to the LocalBusiness.
 *
 * Added Apr 21, 2026 (PR #3, R1.1).
 */
export function CityServiceSchema({ cityName, zipCodes = [], companyInfo }) {
  if (!cityName || !companyInfo) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "HVAC",
    "name": `HVAC Services in ${cityName}, TX`,
    "description": `Professional heating, air conditioning, and indoor air quality services in ${cityName}, Texas. Same-day service, licensed, family-owned.`,
    "provider": {
      "@type": "HVACBusiness",
      "name": companyInfo.name || "DFW HVAC",
      "telephone": companyInfo.phoneDisplay || "+1-972-777-2665",
      "url": "https://dfwhvac.com",
    },
    "areaServed": {
      "@type": "City",
      "name": `${cityName}, TX`,
      ...(zipCodes.length > 0 && { "postalCode": zipCodes }),
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `HVAC Services Offered in ${cityName}`,
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Air Conditioning Repair" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Heating Installation & Repair" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Indoor Air Quality Solutions" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Preventative Maintenance" } },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}

/**
 * ServiceSchema — Service schema for a single HVAC service type.
 *
 * Used on service pages (/services/[category]/[slug]) to declare the specific
 * service (AC Repair, Heating Install, etc.) that DFW HVAC offers across the
 * full DFW metro. Combines `@type: Service` with a DFW-wide `areaServed` and
 * an `HVACBusiness` provider.
 *
 * Added Apr 21, 2026 (PR #3, R1.1).
 */
export function ServiceSchema({ serviceName, serviceDescription, category, companyInfo, areaServedCities = [] }) {
  if (!serviceName || !companyInfo) return null

  const areasServed = areaServedCities.length > 0
    ? areaServedCities.map(c => ({ "@type": "City", "name": `${c.cityName}, TX` }))
    : [{ "@type": "AdministrativeArea", "name": "Dallas-Fort Worth Metroplex, TX" }]

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": category === "commercial" ? "Commercial HVAC" : "HVAC",
    "name": serviceName,
    "description": serviceDescription || `${serviceName} in Dallas-Fort Worth. Same-day service, licensed, family-owned.`,
    "provider": {
      "@type": "HVACBusiness",
      "name": companyInfo.name || "DFW HVAC",
      "telephone": companyInfo.phoneDisplay || "+1-972-777-2665",
      "url": "https://dfwhvac.com",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": (companyInfo.googleRating || 5.0).toString(),
        "reviewCount": (companyInfo.googleReviews || REVIEW_COUNT_FALLBACK).toString(),
        "bestRating": "5",
        "worstRating": "1",
      },
    },
    "areaServed": areasServed,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}
