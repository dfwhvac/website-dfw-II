import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyPageTemplate from '@/components/CompanyPageTemplate'
import { getCompanyInfo, getTestimonials, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'

export const metadata = {
  title: 'About Us | DFW HVAC',
  description: 'Learn about DFW HVAC - Family owned HVAC contractor serving Dallas-Fort Worth since 1974.',
}

export default async function AboutPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  let testimonials = await getTestimonials()
  if (!testimonials || testimonials.length === 0) {
    testimonials = mockTestimonials
  }

  const pageData = {
    title: 'About Us',
    pageType: 'about',
    heroTitle: 'About DFW HVAC',
    heroSubtitle: 'Family Owned Since 1974',
    heroDescription: 'For over 50 years, we\'ve been the trusted choice for heating and cooling services in the Dallas-Fort Worth area.',
    showTestimonials: true,
    showContactForm: true,
  }

  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} />
      <main>
        <CompanyPageTemplate 
          page={pageData} 
          companyInfo={companyInfo}
          testimonials={testimonials}
        />
      </main>
      <Footer companyInfo={companyInfo} />
    </div>
  )
}
