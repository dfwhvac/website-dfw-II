import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceTemplate from '@/components/ServiceTemplate'
import { client } from '@/lib/sanity'
import { getCompanyInfo, getTestimonials, getSiteSettings, getCityPages } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { LocalBusinessSchema, BreadcrumbListSchema, ServiceSchema } from '@/components/SchemaMarkup'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getReviewBadgeCount, buildTitleWithBadge } from '@/lib/metadata'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Category label map for breadcrumb + anchor text
const CATEGORY_LABEL = {
  residential: 'Residential',
  commercial: 'Commercial',
}

// P1.6a title prefix map (Apr 23, 2026) — keyword-first per finalized CSV
// (/app/memory/audits/2026-04-23_Title_Tag_Final.csv). The prefix replaces the
// raw service.title in titles so "Heating" becomes "Furnace & Heating Repair",
// "Preventative Maintenance" becomes "HVAC Maintenance" (GSC-refined), etc.
// Pipes through buildTitleWithBadge() → "{prefix} | {count} Five-Star Reviews | DFW HVAC".
const SERVICE_TITLE_PREFIX = {
  'residential/air-conditioning': 'AC Repair in DFW',
  'residential/heating': 'Furnace & Heating Repair',
  'residential/indoor-air-quality': 'Indoor Air Quality',
  'residential/preventative-maintenance': 'HVAC Maintenance',
  'commercial/commercial-air-conditioning': 'Commercial AC Repair',
  'commercial/commercial-heating': 'Commercial Heating',
  'commercial/commercial-maintenance': 'Commercial HVAC Service',
}

// Generate metadata for SEO
//
// Meta description fallback strategy (Apr 21, 2026 — PR #2, P1.1 final):
// If Sanity `metaDescription` is missing, generate a custom, service-specific
// description via `buildServiceMetaDescription()`. This mirrors the Path A
// pattern shipped for city pages on Apr 20 — eliminates the generic duplicate
// fallback ("We offer comprehensive HVAC services...") that was hurting CTR
// across all 7 service pages.
//
// Template: "[Service value prop + DFW/Texas hook]. Same-day service.
//   Call (972) 777-2665. Licensed, family-owned."
// Kept at <160 chars to avoid SERP truncation on desktop; mobile-safe too.
const SERVICE_META_COPY = {
  // Residential
  'residential/air-conditioning':
    'AC repair, installation & maintenance across Dallas-Fort Worth. Same-day service. Call (972) 777-2665. Licensed, family-owned.',
  'residential/heating':
    'Furnace & heat pump repair, installation & service in Dallas-Fort Worth. Same-day help. Call (972) 777-2665. Licensed, family-owned.',
  'residential/indoor-air-quality':
    'DFW indoor air quality: filtration, purifiers, humidifiers & duct solutions. Breathe cleaner. Call (972) 777-2665. Licensed, family-owned.',
  'residential/preventative-maintenance':
    'DFW HVAC tune-ups & preventative maintenance plans. Stop breakdowns before they start. Call (972) 777-2665. Licensed, family-owned.',
  // Commercial
  'commercial/commercial-air-conditioning':
    'Commercial AC repair, installation & service for DFW businesses. Minimize downtime. Call (972) 777-2665. Licensed, family-owned.',
  'commercial/commercial-heating':
    'Commercial heating repair, installation & service for DFW businesses. Same-day response. Call (972) 777-2665. Licensed, family-owned.',
  'commercial/commercial-maintenance':
    'Commercial HVAC preventative maintenance for DFW businesses. Scheduled visits, flat pricing. Call (972) 777-2665. Licensed, family-owned.',
}

function buildServiceMetaDescription(category, slug, serviceTitle) {
  const key = `${category}/${slug}`
  if (SERVICE_META_COPY[key]) return SERVICE_META_COPY[key]
  // Safe generic fallback for unknown future services (still service-named to
  // avoid the "27-cities-share-one-description" anti-pattern).
  return `${serviceTitle} in Dallas-Fort Worth. Same-day service available. Call (972) 777-2665. Licensed, family-owned.`
}

export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const [service, companyInfo] = await Promise.all([
    client.fetch(
      `*[_type == "service" && category == $category && slug.current == $slug][0] {
        title,
        description,
        metaDescription
      }`,
      { category, slug }
    ),
    getCompanyInfo(),
  ])

  if (!service) {
    return { title: 'Service Not Found' }
  }

  const description =
    service.metaDescription ||
    buildServiceMetaDescription(category, slug, service.title)

  // P1.6a title rewrite (Apr 23, 2026) — keyword-first prefix + dynamic review badge. CSV rows 14–20.
  const key = `${category}/${slug}`
  const prefix = SERVICE_TITLE_PREFIX[key] || service.title
  const count = getReviewBadgeCount(companyInfo)
  const title = buildTitleWithBadge({ prefix, count })

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${category}/${slug}`,
    },
  }
}

export default async function ServicePage({ params }) {
  const { category, slug } = await params
  
  // Fetch service data from Sanity
  const service = await client.fetch(
    `*[_type == "service" && category == $category && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      category,
      description,
      icon,
      features,
      heroSubtitle,
      heroDescription,
      heroBenefits,
      whatWeDoItems,
      processSteps,
      whyChooseUsReasons,
      emergencyTitle,
      emergencyDescription,
      emergencyFeatures,
      pricingTiers,
      faqs
    }`,
    { category, slug }
  )
  
  if (!service) {
    notFound()
  }
  
  // Fetch company info
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  // Fetch testimonials
  let testimonials = await getTestimonials()
  if (!testimonials || testimonials.length === 0) {
    testimonials = mockTestimonials
  }
  
  // Fetch site settings
  const siteSettings = await getSiteSettings()

  // Fetch full city list for hub-and-spoke internal linking + schema areaServed.
  // Added PR #3, R1.2 (Apr 21, 2026). Falls back gracefully if Sanity errors.
  let cityPages = []
  try {
    cityPages = await getCityPages()
    if (!Array.isArray(cityPages)) cityPages = []
  } catch {
    cityPages = []
  }
  
  // Transform service data to match template structure
  const serviceData = {
    title: service.title,
    icon: service.icon || 'wrench',
    heroContent: {
      title: service.title,
      subtitle: service.heroSubtitle || `Expert ${service.title} for DFW`,
      description: service.heroDescription || service.description,
      benefits: service.heroBenefits || service.features || [],
    },
    sections: {
      whatWeDo: {
        title: 'What We Do',
        items: service.whatWeDoItems || service.features || [],
      },
      ourProcess: {
        title: 'Our Process',
        steps: service.processSteps || [
          { step: 1, title: 'Contact Us', description: 'Call or book online for fast service' },
          { step: 2, title: 'Diagnosis', description: 'Our technicians diagnose the issue' },
          { step: 3, title: 'Solution', description: 'We provide options and pricing' },
          { step: 4, title: 'Service', description: 'Expert repair or installation' },
        ],
      },
      whyChooseUs: {
        title: 'Why Choose Us',
        reasons: service.whyChooseUsReasons || [
          'Licensed & Insured Technicians',
          'Three-Generation Family Legacy',
          'Honest Assessments & Fair Pricing',
          'Same-Day Service Available',
          'Comprehensive Warranty on All Work',
        ],
      },
      emergencyService: {
        title: service.emergencyTitle || 'Fast Response Service',
        description: service.emergencyDescription || 'When your HVAC system fails, you need fast, reliable service you can trust. Our team responds quickly with honest solutions.',
        features: service.emergencyFeatures || [
          'Same-Day Service Available',
          'Fast Response Time',
          'Honest Diagnosis & Fair Pricing',
        ],
      },
    },
    pricing: service.pricingTiers ? 
      Object.fromEntries(service.pricingTiers.map((tier, i) => [
        `tier${i + 1}`,
        { title: tier.title, startingPrice: tier.startingPrice, includes: tier.includes }
      ])) : {
        diagnostic: {
          title: 'Diagnostic',
          startingPrice: 'From $89',
          includes: ['Full system inspection', 'Problem diagnosis', 'Repair estimate'],
        },
        repair: {
          title: 'Repair',
          startingPrice: 'From $150',
          includes: ['Expert repair', 'Quality parts', '1-year warranty'],
        },
        replacement: {
          title: 'Replacement',
          startingPrice: 'Free Estimate',
          includes: ['System assessment', 'Multiple options', 'Financing available'],
        },
      },
    faqs: service.faqs || [
      { question: `How often should I service my ${service.title.toLowerCase()}?`, answer: 'We recommend annual maintenance to keep your system running efficiently and prevent costly repairs.' },
      { question: 'Do you offer financing?', answer: 'Yes! We offer flexible financing options to make your HVAC investment affordable.' },
      { question: 'Are your technicians licensed?', answer: 'Absolutely. All our technicians are fully licensed, insured, and background-checked.' },
    ],
  }
  
  return (
    <div className="min-h-screen">
      {/* JSON-LD schema — added PR #3, R1.1 (Apr 21, 2026) */}
      <LocalBusinessSchema companyInfo={companyInfo} cityPages={cityPages} />
      <ServiceSchema
        serviceName={service.title}
        serviceDescription={service.description}
        category={category}
        companyInfo={companyInfo}
        areaServedCities={cityPages}
      />
      <BreadcrumbListSchema
        items={[
          { name: 'Home', url: 'https://dfwhvac.com' },
          { name: 'Services', url: 'https://dfwhvac.com/services' },
          { name: CATEGORY_LABEL[category] || category, url: `https://dfwhvac.com/services/${category}` },
          { name: service.title, url: `https://dfwhvac.com/services/${category}/${slug}` },
        ]}
      />

      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <ServiceTemplate 
          service={serviceData} 
          companyInfo={companyInfo}
          testimonials={testimonials}
          maintenanceSignup={slug === 'preventative-maintenance'}
        />

        {/* Cities served grid — hub-and-spoke internal linking back to
            every DFW city page with service-specific anchor text.
            Added PR #3, R1.2 (Apr 21, 2026). */}
        {cityPages.length > 0 && (
          <section className="bg-gray-50 py-16 border-t" aria-labelledby="cities-heading">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <h2 id="cities-heading" className="text-2xl md:text-3xl font-bold text-[#003153] mb-3 text-center">
                  {service.title} Across the DFW Metroplex
                </h2>
                <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                  We deliver same-day {service.title.toLowerCase()} to homes and businesses in every city below. Tap your city to see local details, zip-code coverage, and customer reviews.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {cityPages.map((cp) => (
                    <Link
                      key={cp.slug}
                      href={`/cities-served/${cp.slug}`}
                      className="group flex items-center justify-between bg-white border border-gray-200 text-[#003153] px-4 py-3 rounded-lg hover:border-[#0077B6] hover:shadow-md transition-all"
                      data-testid={`service-city-link-${cp.slug}`}
                    >
                      <span className="font-medium text-sm">
                        {service.title.split(' ').slice(0, 2).join(' ')} in {cp.cityName}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0077B6] transition-colors flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/cities-served" className="text-[#0077B6] font-semibold hover:underline">
                    View all DFW cities we serve →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
