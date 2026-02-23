import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AboutPageTemplate from '@/components/AboutPageTemplate'
import { getCompanyInfo, getTestimonials, getSiteSettings, getCityPages, getAboutPage } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { buildPageMetadata } from '@/lib/metadata'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const aboutPage = await getAboutPage()
  return buildPageMetadata({
    title: aboutPage?.metaTitle || 'About Us | DFW HVAC - Three Generations of Trust',
    description: aboutPage?.metaDescription || 'Learn about DFW HVAC - a three-generation family commitment to trustworthy, high-quality HVAC service in Dallas-Fort Worth.',
    path: '/about',
  })
}

export default async function AboutPage() {
  const [companyInfoData, testimonialData, siteSettings, cityPages, aboutPage] = await Promise.all([
    getCompanyInfo(),
    getTestimonials(),
    getSiteSettings(),
    getCityPages(),
    getAboutPage(),
  ])
  
  const companyInfo = companyInfoData || mockCompanyInfo
  const testimonials = testimonialData?.length > 0 ? testimonialData : mockTestimonials

  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        <AboutPageTemplate 
          aboutPage={aboutPage}
          companyInfo={companyInfo}
          testimonials={testimonials}
          cityPages={cityPages}
          siteSettings={siteSettings}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
