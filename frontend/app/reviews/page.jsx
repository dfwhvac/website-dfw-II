import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReviewsGrid from '@/components/ReviewsGrid'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { Shield, Award, Star } from 'lucide-react'

export const metadata = {
  title: 'Reviews | DFW HVAC',
  description: 'See what our customers say about DFW HVAC. 5-star rated HVAC service in Dallas-Fort Worth.',
}

export default async function ReviewsPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  // Always use mockTestimonials (contains 100 real Google reviews)
  const testimonials = mockTestimonials
  
  const siteSettings = await getSiteSettings()
  const googleReviews = companyInfo?.googleReviews || 129

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Customer Reviews
              </h1>
              <p className="text-xl lg:text-2xl text-blue-200 mb-6">
                5-Star Rated Service
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
                  <span>50+ Years Experience</span>
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
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
