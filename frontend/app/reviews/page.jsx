import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompanyPageTemplate from '@/components/CompanyPageTemplate'
import { getCompanyInfo, getTestimonials } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'

export const metadata = {
  title: 'Reviews | DFW HVAC',
  description: 'See what our customers say about DFW HVAC. 5-star rated HVAC service in Dallas-Fort Worth.',
}

export default async function ReviewsPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  let testimonials = await getTestimonials()
  if (!testimonials || testimonials.length === 0) {
    testimonials = mockTestimonials
  }

  const pageData = {
    title: 'Customer Reviews',
    pageType: 'reviews',
    heroTitle: 'Customer Reviews',
    heroSubtitle: '5-Star Rated Service',
    heroDescription: 'Don\'t just take our word for it - see what our customers have to say about their experience with DFW HVAC.',
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
