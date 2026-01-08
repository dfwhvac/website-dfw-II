import Header from '../components/Header'
import Footer from '../components/Footer'
import HomePage from '../components/HomePage'
import { LocalBusinessSchema } from '../components/SchemaMarkup'
import { getCompanyInfo, getServices, getSiteSettings, getHomepage, getAllTestimonials } from '../lib/sanity'
import { companyInfo as mockCompanyInfo, services as mockServices, testimonials as mockTestimonials } from '../lib/mockData'

// Force dynamic rendering to always fetch fresh Sanity content
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const homepage = await getHomepage()
  return {
    title: homepage?.metaTitle || 'DFW HVAC | Trusted HVAC Experts Since 1974',
    description: homepage?.metaDescription || 'Family-owned HVAC contractor serving Dallas-Fort Worth for 50+ years.',
  }
}

export default async function Home() {
  // Fetch data from Sanity (with fallback to mock data)
  const [companyInfoData, servicesData, siteSettings, homepage, sanityTestimonials] = await Promise.all([
    getCompanyInfo(),
    getServices(),
    getSiteSettings(),
    getHomepage(),
    getAllTestimonials(),
  ])
  
  // Use Sanity testimonials if available, otherwise mock data
  const testimonials = sanityTestimonials?.length > 0 ? sanityTestimonials : mockTestimonials
  
  // Use mock data if Sanity returns null/empty
  const companyInfo = companyInfoData || mockCompanyInfo
  
  let services
  if (!servicesData || servicesData.length === 0) {
    services = {
      residential: mockServices.residential,
      commercial: mockServices.commercial
    }
  } else {
    // Organize services by category
    services = {
      residential: servicesData.filter(s => s.category === 'residential'),
      commercial: servicesData.filter(s => s.category === 'commercial')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Global LocalBusiness Schema - pulls all data from Sanity */}
      <LocalBusinessSchema companyInfo={companyInfo} />
      
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <HomePage 
          companyInfo={companyInfo}
          services={services}
          testimonials={testimonials}
          homepage={homepage}
          siteSettings={siteSettings}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}