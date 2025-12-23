import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReviewsGrid from '@/components/ReviewsGrid'
import { ReviewSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings, getReviewsPage, getAllTestimonials } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { Shield, Award, Star } from 'lucide-react'

// ISR: Revalidate every hour
export const revalidate = 3600

export async function generateMetadata() {
  const reviewsPage = await getReviewsPage()
  return {
    title: reviewsPage?.metaTitle || '5-Star HVAC Reviews Dallas | Customer Testimonials | DFW HVAC',
    description: reviewsPage?.metaDescription || 'Read 130+ 5-star reviews from real DFW HVAC customers. Family-owned HVAC contractor serving Dallas-Fort Worth since 1974.',
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

  // Parse address into components (expected format: "Street, City, ST ZIP")
  const addressParts = (companyInfo?.address || '556 S Coppell Rd Ste 103, Coppell, TX 75019').split(',').map(s => s.trim())
  const streetAddress = addressParts[0] || ''
  const cityStateZip = addressParts.slice(1).join(', ')
  const cityMatch = cityStateZip.match(/^([^,]+),?\s*([A-Z]{2})\s*(\d{5})?/)
  const city = cityMatch?.[1] || 'Coppell'
  const state = cityMatch?.[2] || 'TX'
  const zip = cityMatch?.[3] || '75019'

  // Generate Review Schema JSON-LD for SEO - pulls from Sanity
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": companyInfo?.name || "DFW HVAC",
    "image": "https://dfwhvac.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": zip,
      "addressCountry": "US"
    },
    "telephone": companyInfo?.phone || "+1-972-777-2665",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": (companyInfo?.googleRating || 5.0).toString(),
      "reviewCount": googleReviews.toString(),
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Review Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

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
          pageSettings={reviewsPage}
        />
      </main>
      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
