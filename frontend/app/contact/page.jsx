import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyPageTemplate from '@/components/CompanyPageTemplate'
import { getCompanyInfo, getSiteSettings, getCityPages, getContactPage } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const contactPage = await getContactPage()
  return {
    title: contactPage?.metaTitle || 'Contact Us | DFW HVAC',
    description: contactPage?.metaDescription || 'Contact DFW HVAC for expert heating and cooling services in Dallas-Fort Worth. Same-day service available Monday-Saturday. Call (972) 777-COOL.',
  }
}

export default async function ContactPage() {
  const [companyInfoData, siteSettings, cityPages, contactPage] = await Promise.all([
    getCompanyInfo(),
    getSiteSettings(),
    getCityPages(),
    getContactPage(),
  ])
  
  const companyInfo = companyInfoData || mockCompanyInfo

  const pageData = {
    title: 'Contact Us',
    pageType: 'contact',
    heroTitle: contactPage?.heroTitle || 'Contact Us',
    heroSubtitle: contactPage?.heroSubtitle || "We're Here to Help",
    heroDescription: contactPage?.heroDescription || 'Have a question or need service? Our team is ready to provide expert HVAC service with integrity and care.',
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
