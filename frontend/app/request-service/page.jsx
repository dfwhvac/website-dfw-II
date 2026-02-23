import Header from '../../components/Header'
import Footer from '../../components/Footer'
import LeadForm from '../../components/LeadForm'
import { getCompanyInfo, getSiteSettings } from '../../lib/sanity'
import { Phone, Clock, Shield, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata() {
  return {
    title: 'Request HVAC Service | DFW HVAC | Dallas-Fort Worth',
    description: 'Request HVAC service from DFW HVAC. Fast response, licensed technicians, upfront pricing. Serving Dallas-Fort Worth. Call (972) 777-COOL or fill out our form.',
    keywords: 'request hvac service, schedule ac repair, hvac service request, dallas hvac service, fort worth ac repair',
    alternates: {
      canonical: '/request-service',
    },
  }
}

export default async function RequestServicePage() {
  const companyInfo = await getCompanyInfo()
  const siteSettings = await getSiteSettings()
  
  const phone = companyInfo?.phone || '(972) 777-COOL'
  const phoneNumber = '+19727772665'

  return (
    <div className="min-h-screen flex flex-col">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#003153] to-[#00496e] text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Request HVAC Service
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Fill out the form below and we'll call you within 2 business hours to schedule your appointment.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Form - Takes 2 columns */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <LeadForm 
                      title="Tell Us About Your HVAC Needs"
                      description="We'll contact you within 2 business hours to discuss your needs and schedule service."
                      leadType="service-request"
                      showTrustSignals={false}
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Call Option */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#00B8FF]" />
                      Need Faster Service?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Call us directly for immediate assistance:
                    </p>
                    <a 
                      href={`tel:${phoneNumber}`}
                      className="block w-full bg-[#FF0000] hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                    >
                      Call {phone}
                    </a>
                  </div>

                  {/* Trust Signals */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Why Choose DFW HVAC?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">Three generations of trusted service</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-[#00B8FF] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">Fast response within 2 business hours</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-[#003153] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">Licensed & insured technicians</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">Upfront, transparent pricing</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">Satisfaction guaranteed</span>
                      </li>
                    </ul>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#00B8FF]" />
                      Business Hours
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Monday - Friday: 9AM - 6PM</p>
                      <p>Saturday - Sunday: Closed</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Emergency service available for existing customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
