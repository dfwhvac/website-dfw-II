import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client, getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Phone, MapPin, CheckCircle, ArrowRight, Clock, Shield, Star } from 'lucide-react'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCityPage(slug) {
  try {
    const city = await client.fetch(`
      *[_type == "cityPage" && slug.current == $slug && isPublished == true][0] {
        cityName,
        "slug": slug.current,
        zipCodes,
        headline,
        subheadline,
        introText,
        cityDescription,
        servicesHighlight,
        whyChooseUs,
        featuredServices,
        localTestimonial,
        metaTitle,
        metaDescription
      }
    `, { slug })
    return city
  } catch (error) {
    console.error('Error fetching city page:', error)
    return null
  }
}

async function getOtherCities(currentSlug) {
  try {
    const cities = await client.fetch(`
      *[_type == "cityPage" && slug.current != $currentSlug && isPublished == true] | order(priority asc, cityName asc) [0...8] {
        cityName,
        "slug": slug.current
      }
    `, { currentSlug })
    return cities || []
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const city = await getCityPage(slug)
  
  if (!city) {
    return { title: 'City Not Found' }
  }
  
  const title = city.metaTitle || `HVAC Services in ${city.cityName}, TX | DFW HVAC`
  const description = city.metaDescription || 
    `Professional heating and air conditioning services in ${city.cityName}, Texas. 24/7 emergency HVAC repair, installation, and maintenance. Serving zip codes: ${city.zipCodes?.join(', ')}.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function CityPage({ params }) {
  const { slug } = await params
  const city = await getCityPage(slug)
  
  if (!city) {
    notFound()
  }
  
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const otherCities = await getOtherCities(slug)
  
  // Default content if not provided in Sanity
  const headline = city.headline || `HVAC Services in ${city.cityName}, TX`
  const subheadline = city.subheadline || `Professional Heating & Air Conditioning for ${city.cityName} Residents`
  
  const introText = city.introText || 
    `Looking for reliable HVAC services in ${city.cityName}? DFW HVAC provides professional heating and air conditioning repair, installation, and maintenance to homeowners and businesses throughout ${city.cityName} and surrounding areas. Our experienced technicians are available 24/7 for emergency repairs.`
  
  const servicesHighlight = city.servicesHighlight ||
    `We offer comprehensive HVAC services including AC repair, heating system installation, preventive maintenance, and indoor air quality solutions. Whether you need a quick repair or a complete system replacement, our team has the expertise to get the job done right.`
  
  const whyChooseUs = city.whyChooseUs ||
    `When you choose DFW HVAC for your ${city.cityName} home or business, you're choosing a company that puts quality and customer satisfaction first. We're fully licensed and insured, offer upfront pricing with no hidden fees, and stand behind our work with comprehensive warranties.`

  const defaultServices = [
    { title: 'Air Conditioning Repair', description: '24/7 emergency AC repair services', link: '/services/residential/air-conditioning' },
    { title: 'Heating Services', description: 'Furnace repair, maintenance & installation', link: '/services/residential/heating' },
    { title: 'HVAC Installation', description: 'New system installation & replacement', link: '/services/residential/air-conditioning' },
    { title: 'Maintenance Plans', description: 'Preventive maintenance to extend system life', link: '/services/residential/air-conditioning' },
  ]
  
  const featuredServices = city.featuredServices?.length > 0 ? city.featuredServices : defaultServices

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6 text-blue-200 text-sm">
              <Link href="/" className="hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/cities-served" className="hover:text-white">Cities Served</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{city.cityName}</span>
            </nav>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {headline}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {subheadline}
            </p>
            
            {/* Zip Codes Badge */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-blue-100">
                <MapPin className="w-5 h-5" />
                <span>Serving zip codes:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {city.zipCodes?.map((zip) => (
                  <span 
                    key={zip}
                    className="bg-white/10 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${companyInfo.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call {companyInfo.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003153] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Schedule Service
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00B8FF]" />
              <span>24/7 Emergency Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00B8FF]" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F77F00]" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#32CD32]" />
              <span>Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 text-lg leading-relaxed">
                {introText}
              </p>
            </div>
            
            {/* City Description */}
            {city.cityDescription && (
              <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h2 className="text-2xl font-bold text-[#003153] mb-4">
                  About {city.cityName}, Texas
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {city.cityDescription}
                </p>
              </div>
            )}
            
            {/* Services */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#003153] mb-6">
                HVAC Services in {city.cityName}
              </h2>
              <p className="text-gray-700 mb-8">
                {servicesHighlight}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredServices.map((service, index) => (
                  <Link
                    key={index}
                    href={service.link || '/contact'}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#00B8FF] hover:shadow-lg transition-all"
                  >
                    <h3 className="text-lg font-bold text-[#003153] group-hover:text-[#00B8FF] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {service.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Why Choose Us */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#003153] mb-4">
                Why {city.cityName} Homeowners Choose Us
              </h2>
              <p className="text-gray-700 mb-6">
                {whyChooseUs}
              </p>
              <ul className="space-y-3">
                {[
                  'Experienced, NATE-certified technicians',
                  'Upfront pricing with no hidden fees',
                  'Same-day service available',
                  'All major brands serviced',
                  'Financing options available',
                  '100% satisfaction guarantee',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#32CD32] flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Local Testimonial */}
            {city.localTestimonial?.quote && (
              <div className="bg-[#003153] text-white rounded-xl p-8 mb-12">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F77F00] text-[#F77F00]" />
                  ))}
                </div>
                <blockquote className="text-lg italic mb-4">
                  "{city.localTestimonial.quote}"
                </blockquote>
                <div className="text-blue-200">
                  <span className="font-semibold text-white">{city.localTestimonial.author}</span>
                  {city.localTestimonial.location && (
                    <span> — {city.localTestimonial.location}</span>
                  )}
                </div>
              </div>
            )}
            
            {/* Zip Codes Served */}
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-[#003153] mb-4">
                Zip Codes We Serve in {city.cityName}
              </h2>
              <div className="flex flex-wrap gap-3">
                {city.zipCodes?.map((zip) => (
                  <span 
                    key={zip}
                    className="bg-white border border-gray-200 text-[#003153] font-semibold px-4 py-2 rounded-lg"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#00B8FF] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need HVAC Service in {city.cityName}?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is ready to help with all your heating and cooling needs. 
            Contact us today for fast, reliable service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${companyInfo.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#003153] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              {companyInfo.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#003153] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#00213a] transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Other Cities */}
      {otherCities.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-[#003153] mb-6 text-center">
                We Also Serve These Cities
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {otherCities.map((otherCity) => (
                  <Link
                    key={otherCity.slug}
                    href={`/cities-served/${otherCity.slug}`}
                    className="bg-white border border-gray-200 text-[#003153] px-4 py-2 rounded-lg hover:border-[#00B8FF] hover:text-[#00B8FF] transition-colors"
                  >
                    {otherCity.cityName}
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link
                  href="/cities-served"
                  className="text-[#00B8FF] font-semibold hover:underline"
                >
                  View All Cities →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
