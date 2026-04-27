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
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <EstimatorWizard />
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
