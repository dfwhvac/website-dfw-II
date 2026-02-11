import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BookServicePage from '../../components/BookServicePage'
import { createMetadata } from '../../lib/metadata'
import { getCompanyInfo, getSiteSettings } from '../../lib/sanity'
import { companyInfo as mockCompanyInfo } from '../../lib/mockData'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = createMetadata({
  title: 'Free HVAC Estimate | DFW HVAC | Dallas-Fort Worth',
  description: 'Request a free HVAC estimate from DFW HVAC. Expert heating and cooling services in Dallas-Fort Worth. Honest assessments, transparent pricing.',
  keywords: 'free hvac estimate, ac repair quote, dallas hvac estimate, fort worth heating estimate',
})

export default async function EstimatePage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <BookServicePage />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
