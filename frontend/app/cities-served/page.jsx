import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client, getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import Link from 'next/link'
import { Phone, MapPin, CheckCircle, ArrowRight } from 'lucide-react'
import ServiceFirstCTA from '@/components/ServiceFirstCTA'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const siteSettings = await getSiteSettings()
  const companyName = siteSettings?.companyName || 'DFW HVAC'
  
  return {
    title: `Cities We Serve | ${companyName}`,
    description: `${companyName} provides professional HVAC services across the Dallas-Fort Worth metroplex. Find heating and air conditioning services in your city.`,
    alternates: {
      canonical: '/cities-served',
    },
  }
}

async function getCityPages() {
  try {
    const cities = await client.fetch(`
      *[_type == "cityPage" && isPublished == true] | order(priority asc, cityName asc) {
        cityName,
        "slug": slug.current,
        zipCodes,
        headline,
        introText
      }
    `)
    return cities || []
  } catch (error) {
    console.error('Error fetching city pages:', error)
    return []
  }
}

export default async function CitiesServedPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const cities = await getCityPages()
  
  // Group cities by first letter for alphabetical display
  const groupedCities = cities.reduce((acc, city) => {
    const letter = city.cityName[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(city)
    return acc
  }, {})
  
  const totalZipCodes = cities.reduce((sum, city) => sum + (city.zipCodes?.length || 0), 0)

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cities We Serve in DFW
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Expert HVAC service with integrity and care throughout the Dallas-Fort Worth metroplex. 
              A three-generation family commitment to quality workmanship in your neighborhood.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-[#00B8FF]" />
                <span><strong>{cities.length}</strong> Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#32CD32]" />
                <span><strong>{totalZipCodes}</strong> Zip Codes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="bg-[#00B8FF] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white">
            <span className="font-semibold">Not sure if we serve your area?</span>
            <a 
              href={`tel:${companyInfo.phone}`}
              className="flex items-center gap-2 bg-white text-[#003153] px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call {companyInfo.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#003153] mb-8 text-center">
              Select Your City
            </h2>
            
            {cities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>City pages are being set up. Check back soon!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/cities-served/${city.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-[#00B8FF] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[#003153] group-hover:text-[#00B8FF] transition-colors">
                          {city.cityName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {city.zipCodes?.slice(0, 4).map((zip) => (
                            <span 
                              key={zip}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                            >
                              {zip}
                            </span>
                          ))}
                          {city.zipCodes?.length > 4 && (
                            <span className="text-gray-400 text-xs py-1">
                              +{city.zipCodes.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#00B8FF] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Zip Codes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#003153] mb-4">
              Complete Zip Code Coverage
            </h2>
            <p className="text-gray-600 mb-8">
              We provide HVAC services to the following zip codes across the DFW metroplex.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {cities.flatMap(city => city.zipCodes || []).sort().map((zip) => (
                <span 
                  key={zip}
                  className="bg-white border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {zip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#003153] mb-8">
              Services Available in All Locations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {[
                { title: 'AC Repair', desc: 'Fast, same-day air conditioning repair' },
                { title: 'AC Installation', desc: 'New system installation and replacement' },
                { title: 'Heating Repair', desc: 'Furnace and heat pump repairs' },
                { title: 'Heating Installation', desc: 'New heating system installation' },
                { title: 'Maintenance', desc: 'Preventive maintenance plans' },
                { title: 'Indoor Air Quality', desc: 'Air purification and filtration' },
              ].map((service) => (
                <div key={service.title} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#32CD32] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#003153]">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Service-first strategy */}
      <ServiceFirstCTA 
        title="Ready to Schedule Service?"
        description="Our expert technicians are standing by to help with all your heating and cooling needs."
        variant="dark"
      />

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
