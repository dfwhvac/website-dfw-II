import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyPageTemplate from '@/components/CompanyPageTemplate'
import { getCompanyInfo, getSiteSettings, getCityPages } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Contact Us | DFW HVAC',
  description: 'Contact DFW HVAC for all your heating and cooling needs. Available 24/7 for emergencies.',
}

export default async function ContactPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const cityPages = await getCityPages()

  const pageData = {
    title: 'Contact Us',
    pageType: 'contact',
    heroTitle: 'Contact Us',
    heroSubtitle: 'We\'re Here to Help',
    heroDescription: 'Have a question or need service? Reach out to our friendly team today.',
  }

  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <CompanyPageTemplate 
          page={pageData} 
          companyInfo={companyInfo}
          cityPages={cityPages}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
