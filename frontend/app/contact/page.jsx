import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyPageTemplate from '@/components/CompanyPageTemplate'
import { getCompanyInfo, getSiteSettings, getCityPages, getContactPage } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { buildPageMetadata } from '@/lib/metadata'
import { HOURS_CONTACT_META, rewriteLegacyHoursCopy } from '@/lib/businessHours'

export const revalidate = 3600 // ISR — page regenerates at most once per hour with fresh Sanity content

export async function generateMetadata() {
  // P1.6a title rewrite (Apr 23, 2026) — brand-first, no trailing pipe. CSV row 4.
  const contactPage = await getContactPage()
  return buildPageMetadata({
    title: 'Contact DFW HVAC - Coppell, TX Office',
    description: rewriteLegacyHoursCopy(contactPage?.metaDescription) || HOURS_CONTACT_META,
    path: '/contact',
  })
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
