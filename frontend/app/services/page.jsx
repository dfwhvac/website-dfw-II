import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { client, getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import Link from 'next/link'
import { Phone, ArrowRight, Snowflake, Flame, Wind, ClipboardCheck, Building, Settings, HardHat, CheckCircle, Shield, Award, Star } from 'lucide-react'

// Disable caching for instant Sanity updates
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'HVAC Services | DFW HVAC - Heating & Air Conditioning',
  description: 'Professional HVAC services in Dallas-Fort Worth. Residential & commercial air conditioning, heating, indoor air quality, and maintenance. Expert service with integrity and care.',
}

const iconMap = {
  snowflake: Snowflake,
  flame: Flame,
  wind: Wind,
  'clipboard-check': ClipboardCheck,
  building: Building,
  settings: Settings,
  'hard-hat': HardHat,
}

async function getServices() {
  try {
    const services = await client.fetch(`
      *[_type == "service"] | order(category asc, title asc) {
        title,
        "slug": slug.current,
        category,
        description,
        icon,
        features
      }
    `)
    return services || []
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export default async function ServicesPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const services = await getServices()
  
  // Group services by category
  const residentialServices = services.filter(s => s.category === 'residential')
  const commercialServices = services.filter(s => s.category === 'commercial')

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our HVAC Services
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Expert heating and cooling services with integrity and care. 
              A three-generation family commitment to quality workmanship in Dallas-Fort Worth.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00B8FF]" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00B8FF]" />
                <span>Three-Generation Legacy</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>5.0 Google Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Residential Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-electric-blue rounded-full flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Residential Services</h2>
                <p className="text-gray-600">Heating & cooling solutions for your home</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {residentialServices.map((service) => {
                const IconComponent = iconMap[service.icon] || Snowflake
                return (
                  <Link
                    key={service.slug}
                    href={`/services/residential/${service.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-electric-blue hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-electric-blue rounded-lg flex items-center justify-center transition-colors">
                        <IconComponent className="w-6 h-6 text-electric-blue group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-electric-blue mb-2 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {service.description}
                        </p>
                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-lime-green flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-4 flex items-center gap-1 text-electric-blue font-semibold text-sm">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Commercial Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-prussian-blue rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Commercial Services</h2>
                <p className="text-gray-600">HVAC solutions for your business</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {commercialServices.map((service) => {
                const IconComponent = iconMap[service.icon] || Building
                return (
                  <Link
                    key={service.slug}
                    href={`/services/commercial/${service.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-prussian-blue hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 group-hover:bg-prussian-blue rounded-lg flex items-center justify-center transition-colors">
                        <IconComponent className="w-6 h-6 text-prussian-blue group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-prussian-blue mb-2 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {service.description}
                        </p>
                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-lime-green flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-4 flex items-center gap-1 text-prussian-blue font-semibold text-sm">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose DFW HVAC?</h2>
            <p className="text-lg text-gray-600 mb-8">Expert service with integrity and care</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust</h3>
                <p className="text-gray-600 text-sm">Honest assessments, transparent pricing, no hidden fees</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">Licensed technicians, quality parts, meticulous workmanship</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Care</h3>
                <p className="text-gray-600 text-sm">Respectful of your home, proactive communication, comprehensive warranties</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-vivid-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-red-100">
            Contact DFW HVAC today for expert service with integrity and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${companyInfo.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-vivid-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call {companyInfo.phone}
            </a>
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-vivid-red transition-colors"
            >
              Get Free Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
