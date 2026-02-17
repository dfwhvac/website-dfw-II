import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const siteSettings = await getSiteSettings()
  const companyName = siteSettings?.companyName || 'DFW HVAC'
  
  return {
    title: `Terms of Service | ${companyName}`,
    description: `Terms of Service for ${companyName}. Review the terms and conditions governing your use of our website and HVAC services.`,
  }
}

export default async function TermsOfServicePage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#003153] to-[#00213a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100">
              Effective Date: February 17, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <p className="text-lg text-gray-600 mb-8">
              These Terms of Service (&quot;Terms&quot;) govern your use of the website and services provided by DFW HVAC, LLC (&quot;DFW HVAC,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing our website, requesting service, or engaging our company, you agree to these Terms.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">1. Services</h2>
            <p className="text-gray-600 mb-6">
              DFW HVAC, LLC provides residential and light commercial heating, ventilation, and air conditioning services, including repairs, maintenance, installations, inspections, and related work.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">2. Estimates and Pricing</h2>
            <p className="text-gray-600 mb-6">
              Estimates are based on available information and may change due to unforeseen conditions, scope changes, or code requirements. Final pricing will be confirmed whenever possible.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">3. Scheduling and Appointments</h2>
            <p className="text-gray-600 mb-6">
              We make reasonable efforts to meet scheduled windows but are not liable for delays due to emergencies, weather, or other factors.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">4. Customer Responsibilities</h2>
            <p className="text-gray-600 mb-6">
              Customers must provide accurate information, safe access, and disclose hazards. Failure to do so may delay or affect service.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">5. Payments</h2>
            <p className="text-gray-600 mb-6">
              Payment terms are outlined in estimates or invoices. Late payments may result in fees, service suspension, or collections.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">6. Financing</h2>
            <p className="text-gray-600 mb-6">
              Financing approvals and terms are determined by third-party lenders. DFW HVAC, LLC is not responsible for lender decisions.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">7. Equipment and Manufacturer Warranties</h2>
            <p className="text-gray-600 mb-6">
              Equipment warranties are provided by manufacturers. Customers must follow registration and maintenance requirements.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">8. Labor Warranty</h2>
            <p className="text-gray-600 mb-6">
              Limited labor warranties may apply as specified in written agreements and may be voided by misuse, modification, or lack of maintenance.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 mb-6">
              To the fullest extent permitted by law, DFW HVAC, LLC is not liable for indirect or consequential damages. Liability is limited to the amount paid for the specific service.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">10. Website Use</h2>
            <p className="text-gray-600 mb-6">
              Website content is for general information only. Users agree not to misuse the website or submit false information.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">11. Third-Party Services</h2>
            <p className="text-gray-600 mb-6">
              We are not responsible for third-party providers or linked services.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">12. Communications</h2>
            <p className="text-gray-600 mb-6">
              Calls and communications may be recorded. By contacting us, you consent to receive service-related communications.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">13. Force Majeure</h2>
            <p className="text-gray-600 mb-6">
              We are not responsible for delays caused by events beyond our control.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">14. Governing Law</h2>
            <p className="text-gray-600 mb-6">
              These Terms are governed by Texas law. Disputes shall be resolved in the Dallas-Fort Worth area.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">15. Changes</h2>
            <p className="text-gray-600 mb-6">
              We may update these Terms periodically. Continued use indicates acceptance.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">16. Contact</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold text-[#003153] text-lg mb-4">DFW HVAC, LLC</p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Phone:</strong> <a href="tel:+19727772665" className="text-[#00B8FF] hover:underline">(972) 777-2665</a></p>
                <p><strong>Email:</strong> <a href="mailto:web@dfwhvac.com" className="text-[#00B8FF] hover:underline">web@dfwhvac.com</a></p>
                <p><strong>Address:</strong> 556 S. Coppell Rd, Suite 103, Coppell TX 75019</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
