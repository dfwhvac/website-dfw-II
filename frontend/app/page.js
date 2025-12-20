import Header from '../components/Header'
import Footer from '../components/Footer'
import HomePage from '../components/HomePage'
import { getCompanyInfo, getServices, getTestimonials, getSiteSettings } from '../lib/sanity'
import { companyInfo as mockCompanyInfo, services as mockServices, testimonials as mockTestimonials } from '../lib/mockData'

// Revalidate every 60 seconds
export const revalidate = 60

export default async function Home() {
  // Fetch data from Sanity (with fallback to mock data)
  let companyInfo = await getCompanyInfo()
  let services = await getServices()
  const siteSettings = await getSiteSettings()
  
  // Always use mockTestimonials (contains 100 real Google reviews)
  const testimonials = mockTestimonials
  
  // Use mock data if Sanity returns null/empty
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  if (!services || services.length === 0) {
    services = {
      residential: mockServices.residential,
      commercial: mockServices.commercial
    }
  } else {
    // Organize services by category
    services = {
      residential: services.filter(s => s.category === 'residential'),
      commercial: services.filter(s => s.category === 'commercial')
    }
  }
  
  if (!testimonials || testimonials.length === 0) {
    testimonials = mockTestimonials
  }

  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <HomePage 
          companyInfo={companyInfo}
          services={services}
          testimonials={testimonials}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}