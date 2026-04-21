import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceTemplate from '@/components/ServiceTemplate'
import { client } from '@/lib/sanity'
import { getCompanyInfo, getTestimonials, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { notFound } from 'next/navigation'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  const service = await client.fetch(
    `*[_type == "service" && category == $category && slug.current == $slug][0] {
      title,
      description,
      metaDescription
    }`,
    { category, slug }
  )
  
  if (!service) {
    return { title: 'Service Not Found' }
  }
  
  const description =
    service.metaDescription ||
    buildServiceMetaDescription(category, slug, service.title)

  return {
    title: `${service.title} | DFW HVAC`,
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
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <ServiceTemplate 
          service={serviceData} 
          companyInfo={companyInfo}
          testimonials={testimonials}
          maintenanceSignup={slug === 'preventative-maintenance'}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
