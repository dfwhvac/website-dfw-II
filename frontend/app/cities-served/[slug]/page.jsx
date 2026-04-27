import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client, getCompanyInfo, getSiteSettings, getTrustSignals } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { LocalBusinessSchema, BreadcrumbListSchema, CityServiceSchema } from '@/components/SchemaMarkup'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone, MapPin, CheckCircle, ArrowRight, Clock, Shield, Star, Award, Users, Calendar, TrendingUp } from 'lucide-react'
import ServiceFirstCTA from '@/components/ServiceFirstCTA'
import { getReviewBadgeCount, buildTitleWithBadge } from '@/lib/metadata'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Full list of HVAC services offered in every DFW city — used for
// hub-and-spoke internal linking from city pages back to deep service pages.
// Maps to PR #3, R1.2 (Apr 21, 2026 — closes audit finding from P1.2).
const ALL_SERVICES = [
  { title: 'Air Conditioning Repair & Install', href: '/services/residential/air-conditioning', blurb: 'Same-day AC diagnosis, repair, and full-system replacement.' },
  { title: 'Heating & Furnace Service', href: '/services/residential/heating', blurb: 'Furnace, heat pump, and gas line repair and installation.' },
  { title: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality', blurb: 'Filtration, purifiers, humidifiers, and duct solutions.' },
  { title: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance', blurb: 'Tune-ups and maintenance plans that prevent breakdowns.' },
  { title: 'Commercial Air Conditioning', href: '/services/commercial/commercial-air-conditioning', blurb: 'Rooftop unit and split-system service for DFW businesses.' },
  { title: 'Commercial Heating', href: '/services/commercial/commercial-heating', blurb: 'Commercial furnace, boiler, and heat pump service.' },
  { title: 'Commercial Maintenance', href: '/services/commercial/commercial-maintenance', blurb: 'Scheduled preventative service agreements for commercial HVAC.' },
]

async function getCityPage(slug) {
  try {
    const city = await client.fetch(`
      *[_type == "cityPage" && slug.current == $slug && isPublished == true][0] {
        cityName,
        "slug": slug.current,
        zipCodes,
        headline,
        subheadline,
        introText,
        cityDescription,
        servicesHighlight,
        whyChooseUs,
        featuredServices,
        localTestimonial,
        metaTitle,
        metaDescription
      }
    `, { slug })
    return city
  } catch (error) {
    console.error('Error fetching city page:', error)
    return null
  }
}

async function getOtherCities(currentSlug) {
  try {
    const cities = await client.fetch(`
      *[_type == "cityPage" && slug.current != $currentSlug && isPublished == true] | order(priority asc, cityName asc) [0...8] {
        cityName,
        "slug": slug.current
      }
    `, { currentSlug })
    return cities || []
  } catch (error) {
    return []
  }
}

/**
 * Build an SEO-optimized meta description for a city page.
 * Uses an adaptive zip-line format so each city gets hyper-local signals
 * without generic templating. Drafted Apr 20, 2026 to replace the prior
 * "Professional heating and air conditioning services..." fallback, which
 * Google was treating as near-duplicate across all 28 cities.
 *
 * Template: "[City], TX AC & heating repair, install & maintenance.
 *   Same-day service. Call (972) 777-2665. Licensed, family-owned. [Zip line]."
 *
 * Zip line rules:
 *   0 zips  -> "" (skip — avoid empty "Zip: ." tail)
 *   1 zip   -> "Zip: XXXXX."
 *   2 zips  -> "Zips: X, Y."
 *   3 zips  -> "Zips: X, Y, Z."        (show all)
 *   4+ zips -> "Zips: X, Y, Z & more." (first 3 + "& more")
 *
 * Phone number uses dialable digits (972) 777-2665 — required for Google's
 * mobile SERP click-to-call detection. The vanity "(972) 777-COOL" display
 * is preserved on-site but kept out of meta descriptions.
 */
function buildCityMetaDescription(cityName, zipCodes) {
  const zips = Array.isArray(zipCodes) ? zipCodes : []
  let zipLine = ''
  if (zips.length === 1) zipLine = `Zip: ${zips[0]}.`
  else if (zips.length === 2) zipLine = `Zips: ${zips[0]}, ${zips[1]}.`
  else if (zips.length === 3) zipLine = `Zips: ${zips[0]}, ${zips[1]}, ${zips[2]}.`
  else if (zips.length >= 4) zipLine = `Zips: ${zips[0]}, ${zips[1]}, ${zips[2]} & more.`

  const base = `${cityName}, TX AC & heating repair, install & maintenance. Same-day service. Call (972) 777-2665. Licensed, family-owned.`
  return zipLine ? `${base} ${zipLine}` : base
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const [city, companyInfo] = await Promise.all([
    getCityPage(slug),
    getCompanyInfo(),
  ])

  if (!city) {
    return { title: 'City Not Found' }
  }

  // P1.6a title rewrite (Apr 23, 2026) — keyword-first prefix + dynamic review badge.
  // Two exceptions drop the brand suffix to stay under 60 chars / match GSC-refined CSV:
  //   • dallas (GSC-refined "Dallas HVAC & AC Repair" — "HVAC" is the dominant keyword)
  //   • north-richland-hills (longest city name — can't fit "| DFW HVAC")
  // All other 26 cities use the standard "{City} AC Repair | {N} Five-Star Reviews | DFW HVAC" shape.
  const count = getReviewBadgeCount(companyInfo)
  const CITY_PREFIX_OVERRIDES = {
    dallas: 'Dallas HVAC & AC Repair',
  }
  const prefix = CITY_PREFIX_OVERRIDES[slug] || `${city.cityName} AC Repair`
  const includeBrand = slug !== 'dallas' && slug !== 'north-richland-hills'
  const title = buildTitleWithBadge({ prefix, count, includeBrand })

  const description = city.metaDescription || buildCityMetaDescription(city.cityName, city.zipCodes)

  return {
    title,
    description,
    alternates: {
      canonical: `/cities-served/${slug}`,
    },
    openGraph: {
      title,
      description,
    },
  }
}

export default async function CityPage({ params }) {
  const { slug } = await params
  const city = await getCityPage(slug)
  
  if (!city) {
    notFound()
  }
  
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const otherCities = await getOtherCities(slug)
  const trustSignals = await getTrustSignals()
  
  // Icon mapping for trust badges
  const iconMap = {
    'shield': Shield,
    'award': Award,
    'star': Star,
    'clock': Clock,
    'check-circle': CheckCircle,
    'users': Users,
    'phone': Phone,
    'calendar': Calendar,
    'trending-up': TrendingUp,
  }
  
  // Default trust badges
  const defaultTrustBadges = [
    { text: 'Same-Day Service', icon: 'clock' },
    { text: 'Licensed & Insured', icon: 'shield' },
    { text: '5-Star Rated', icon: 'star' },
    { text: 'Satisfaction Guaranteed', icon: 'check-circle' },
  ]
  
  const trustBadges = trustSignals?.primaryBadges?.length > 0 
    ? trustSignals.primaryBadges.sort((a, b) => (a.order || 0) - (b.order || 0))
    : defaultTrustBadges
  
  // Default content if not provided in Sanity
  const headline = city.headline || `HVAC Services in ${city.cityName}, TX`
  const subheadline = city.subheadline || `Professional Heating & Air Conditioning for ${city.cityName} Residents`
  
  const introText = city.introText || 
    `Looking for reliable HVAC services in ${city.cityName}? DFW HVAC delivers expert heating and air conditioning service with integrity and care. Our licensed technicians provide honest assessments, transparent pricing, and quality workmanship to homeowners and businesses throughout ${city.cityName}. Same-day service available Monday through Friday.`
  
  const servicesHighlight = city.servicesHighlight ||
    `We offer comprehensive HVAC services including AC repair, heating system installation, preventive maintenance, and indoor air quality solutions. As a three-generation family business, we believe in doing the job right the first time with meticulous workmanship and customer-first service.`
  
  const whyChooseUs = city.whyChooseUs ||
    `When you choose DFW HVAC for your ${city.cityName} home or business, you're choosing a company with a three-generation family commitment to trustworthy, high-quality service. We provide honest assessments, transparent pricing with no hidden fees, and stand behind our work with comprehensive warranties.`

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD schema — added PR #3, R1.1 (Apr 21, 2026) */}
      <LocalBusinessSchema companyInfo={companyInfo} />
      <CityServiceSchema cityName={city.cityName} zipCodes={city.zipCodes} companyInfo={companyInfo} />
      <BreadcrumbListSchema
        items={[
          { name: 'Home', url: 'https://dfwhvac.com' },
          { name: 'Cities Served', url: 'https://dfwhvac.com/cities-served' },
          { name: city.cityName, url: `https://dfwhvac.com/cities-served/${slug}` },
        ]}
      />

      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-blue-200 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/cities-served" className="hover:text-white">Cities Served</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{city.cityName}</span>
            </nav>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {headline}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {subheadline}
            </p>
            
            {/* Zip Codes Badge */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-5 h-5" />
                <span>Serving zip codes:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {city.zipCodes?.map((zip) => (
                  <span 
                    key={zip}
                    className="bg-white/10 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons - Phone-first strategy */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+19727772665"
                className="inline-flex items-center justify-center gap-2 bg-[#D30000] hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call {companyInfo.phone}
              </a>
              <Link
                href="/request-service"
                className="inline-flex items-center justify-center gap-2 bg-white text-prussian-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Request Service
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Subtle estimate link */}
            <p className="text-blue-200 text-sm mt-4">
              Considering a new system? <Link href="/estimate" className="text-white underline hover:text-blue-100">Get a Free Replacement Estimate →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            {trustBadges.map((badge, index) => {
              const IconComponent = iconMap[badge.icon] || CheckCircle
              const iconColors = {
                'clock': 'text-electric-blue',
                'shield': 'text-electric-blue',
                'star': 'text-[#F77F00]',
                'check-circle': 'text-[#32CD32]',
                'award': 'text-electric-blue',
                'users': 'text-electric-blue',
                'phone': 'text-electric-blue',
                'calendar': 'text-electric-blue',
                'trending-up': 'text-[#32CD32]',
              }
              return (
                <div key={index} className="flex items-center gap-2">
                  <IconComponent className={`w-5 h-5 ${iconColors[badge.icon] || 'text-electric-blue'}`} />
                  <span>{badge.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 text-lg leading-relaxed">
                {introText}
              </p>
            </div>
            
            {/* City Description */}
            {city.cityDescription && (
              <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-prussian-blue mb-4">
                  About {city.cityName}, Texas
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {city.cityDescription}
                </p>
              </div>
            )}
            
            {/* Services (hub-and-spoke — links to ALL 7 services with
                city-specific anchor text for local SEO internal linking).
                Added PR #3, R1.2 (Apr 21, 2026). */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-prussian-blue mb-6">
                HVAC Services in {city.cityName}
              </h2>
              <p className="text-gray-700 mb-8">
                {servicesHighlight}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {ALL_SERVICES.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-electric-blue hover:shadow-lg transition-all"
                    data-testid={`city-service-link-${service.href.split('/').pop()}`}
                  >
                    <h3 className="text-lg font-bold text-prussian-blue group-hover:text-electric-blue mb-2">
                      {service.title} in {city.cityName}, TX
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.blurb}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-electric-blue text-sm font-semibold">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Why Choose Us */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-prussian-blue mb-4">
                Why {city.cityName} Homeowners Choose Us
              </h2>
              <p className="text-gray-700 mb-6">
                {whyChooseUs}
              </p>
              <ul className="space-y-3">
                {[
                  'Three-generation family legacy of excellence',
                  'Honest assessments with transparent pricing',
                  'Licensed, bonded, and insured technicians',
                  'Same-day service when available',
                  'All major brands serviced',
                  'Comprehensive warranty on all work',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#32CD32] flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Local Testimonial */}
            {city.localTestimonial?.quote && (
              <div className="bg-prussian-blue text-white rounded-xl p-8 mb-12">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F77F00] text-[#F77F00]" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-4">
                  "{city.localTestimonial.quote}"
                </blockquote>
                <div className="text-blue-200">
                  <span className="font-semibold text-white">{city.localTestimonial.author}</span>
                  {city.localTestimonial.location && (
                    <span> — {city.localTestimonial.location}</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Zip Codes Served */}
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-prussian-blue mb-4">
                Zip Codes We Serve in {city.cityName}
              </h2>
              <div className="flex flex-wrap gap-3">
                {city.zipCodes?.map((zip) => (
                  <span 
                    key={zip}
                    className="bg-white border border-gray-200 text-prussian-blue font-semibold px-4 py-2 rounded-lg"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Service-first strategy */}
      <ServiceFirstCTA 
        title={`Need HVAC Service in ${city.cityName}?`}
        description="Our team is ready to help with all your heating and cooling needs. Expert service with integrity and care—that's our commitment to you."
        variant="blue"
        className="bg-electric-blue"
      />

      {/* Other Cities */}
      {otherCities.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-prussian-blue mb-6 text-center">
                We Also Serve These Cities
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {otherCities.map((otherCity) => (
                  <Link
                    key={otherCity.slug}
                    href={`/cities-served/${otherCity.slug}`}
                    className="bg-white border border-gray-200 text-prussian-blue px-4 py-2 rounded-lg hover:border-electric-blue hover:text-electric-blue transition-colors"
                  >
                    {otherCity.cityName}
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link
                  href="/cities-served"
                  className="text-electric-blue font-semibold hover:underline"
                >
                  View All Cities →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
