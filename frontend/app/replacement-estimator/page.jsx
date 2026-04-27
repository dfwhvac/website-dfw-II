import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BreadcrumbListSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { getReviewBadgeCount, buildTitleWithBadge } from '@/lib/metadata'
import EstimatorWizard from './EstimatorWizard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  // P1.14 replacement estimator (Apr 24, 2026). Title targets the
  // interactive-tool query cluster ("hvac replacement cost calculator dallas",
  // "ac replacement estimate dfw"). Option C review-badge logic applies.
  const companyInfo = await getCompanyInfo()
  const count = getReviewBadgeCount(companyInfo || mockCompanyInfo)
  return {
    title: buildTitleWithBadge({
      prefix: 'HVAC Replacement Cost Estimator — Free Instant Range',
      count,
      includeBrand: true,
    }),
    description:
      'Free online HVAC replacement cost estimator for Dallas-Fort Worth homeowners. Answer 5 quick questions, get your price range on screen in under 60 seconds. No signup required.',
    alternates: {
      canonical: '/replacement-estimator',
    },
  }
}

// S2 (Apr 27, 2026) — WebApplication + HowTo schema for the interactive estimator.
// WebApplication: signals to Google + AI engines that this is a usable in-browser
// tool, not a static article. Eligible for "Interactive content" rich treatments.
// HowTo: lists the 5 wizard steps so AI engines can quote the procedure verbatim
// when answering "how do I estimate hvac replacement cost in dallas" queries.
const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HVAC Replacement Cost Estimator',
  url: 'https://dfwhvac.com/replacement-estimator',
  description:
    'Free interactive HVAC system replacement cost estimator for Dallas-Fort Worth homeowners. Five-question wizard returns a calibrated $-range in under 60 seconds. No signup, no email gate.',
  applicationCategory: 'UtilitiesApplication',
  applicationSubCategory: 'HomeServiceCalculator',
  operatingSystem: 'Web',
  browserRequirements: 'Requires JavaScript (modern evergreen browser)',
  isAccessibleForFree: true,
  inLanguage: 'en-US',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: 'DFW HVAC',
    url: 'https://dfwhvac.com',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Dallas-Fort Worth homeowners considering HVAC system replacement',
    geographicArea: {
      '@type': 'AdministrativeArea',
      name: 'Dallas-Fort Worth Metroplex, TX',
    },
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to estimate the cost of replacing your HVAC system in Dallas-Fort Worth',
  description:
    'Get a calibrated cost range for replacing your residential HVAC system by answering five quick questions about your home, system type, equipment tier, efficiency, and ductwork.',
  totalTime: 'PT1M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    minValue: '6000',
    maxValue: '25000',
  },
  tool: [
    { '@type': 'HowToTool', name: 'Web browser' },
    { '@type': 'HowToTool', name: 'Approximate home square footage' },
    { '@type': 'HowToTool', name: 'Existing HVAC nameplate (optional, for SEER and refrigerant lookup)' },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Enter your home size',
      text: 'Pick the square-footage bucket that best matches your home (under 1,200 / 1,200–1,800 / 1,800–2,500 / 2,500–3,500 / 3,500+). This determines the tonnage your system needs.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose the system type to replace',
      text: 'Select AC-only, AC + furnace match, heat pump, packaged unit, mini-split, or "not sure". Different system types have different base costs in the DFW market.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Pick an equipment tier',
      text: 'Value (single-stage), standard (two-stage), or premium (variable-speed/inverter). Or "not sure" — the wizard will assume standard.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Select an efficiency level (SEER2)',
      text: 'Baseline (~14.3 SEER2 — the federal minimum for the South region), mid (16–17), or high (18+). Higher SEER2 reduces summer cooling costs but raises upfront equipment price.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Tell us about your ductwork',
      text: 'New/excellent, older but OK, signs of leaks, full replacement needed, or "don\'t know". Ductwork condition is the single largest swing factor on the upper bound of the estimate.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'See your range',
      text: 'A $-range appears on screen with a factor-by-factor breakdown showing why the wizard landed on it. Optionally, opt in for a free on-site estimate to convert the range into a binding written quote.',
    },
  ],
}

export default async function ReplacementEstimatorPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) companyInfo = mockCompanyInfo
  const siteSettings = await getSiteSettings()

  const breadcrumbs = [
    { name: 'Home', url: 'https://dfwhvac.com/' },
    { name: 'Replacement Estimator', url: 'https://dfwhvac.com/replacement-estimator' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbListSchema items={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, '\\u003c') }}
      />
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <EstimatorWizard />
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
