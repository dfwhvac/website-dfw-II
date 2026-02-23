import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReviewsGrid from '@/components/ReviewsGrid'
import { ReviewSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings, getReviewsPage, getAllTestimonials } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { Shield, Award, Star } from 'lucide-react'

// ISR: Revalidate every hour
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const reviewsPage = await getReviewsPage()
  const companyInfo = await getCompanyInfo()
  const reviewCount = companyInfo?.googleReviews || 135
  
  return {
    title: reviewsPage?.metaTitle || '5-Star HVAC Reviews Dallas | Customer Testimonials | DFW HVAC',
    description: reviewsPage?.metaDescription || `Read ${reviewCount}+ 5-star reviews from real DFW HVAC customers. Three generations of trusted HVAC service in Dallas-Fort Worth.`,
    alternates: {
      canonical: '/reviews',
    },
  }
}

export default async function ReviewsPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const reviewsPage = await getReviewsPage()
  const sanityTestimonials = await getAllTestimonials()
  
  // Use Sanity testimonials if available, otherwise mock data
  const testimonials = sanityTestimonials?.length > 0 ? sanityTestimonials : mockTestimonials
  const googleReviews = companyInfo?.googleReviews || 130
  
  // Page content with fallbacks
  const pageContent = {
    heroTitle: reviewsPage?.heroTitle || 'Customer Reviews',
    heroSubtitle: reviewsPage?.heroSubtitle || 'See What Our Customers Say About Us',
    googleBadgeTitle: reviewsPage?.googleBadgeTitle || 'Based on Google Reviews',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Review Schema for SEO - pulls from Sanity */}
      <ReviewSchema companyInfo={companyInfo} reviewCount={googleReviews} />

      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {pageContent.heroTitle}
              </h1>
              <p className="text-xl lg:text-2xl text-blue-200 mb-6">
                {pageContent.heroSubtitle}
              </p>
              <p className="text-lg text-blue-100 mb-8">
                Don't just take our word for it - see what our customers have to say about their experience with DFW HVAC.
              </p>
              
              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Three-Generation Legacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-yellow-400" />
                  <span>5.0 Rating • {googleReviews} Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Grid with Load More */}
        <ReviewsGrid 
          testimonials={testimonials} 
          googleReviews={googleReviews}
          pageSettings={reviewsPage}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
