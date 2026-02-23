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
    title: `Privacy Policy | ${companyName}`,
    description: `Privacy Policy for ${companyName}. Learn how we collect, use, and protect your personal information.`,
    alternates: {
      canonical: '/privacy-policy',
    },
  }
}

export default async function PrivacyPolicyPage() {
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
              Privacy Policy
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
              DFW HVAC, LLC (&quot;DFW HVAC,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website, request service, or communicate with us.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Service and billing address</li>
              <li>Details about your HVAC needs</li>
              <li>Information you submit through forms, scheduling tools, or communications</li>
            </ul>
            
            <p className="text-gray-600 mb-4">We may also automatically collect limited technical information such as:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Pages visited and website activity</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1 ml-4">
              <li>Respond to inquiries and service requests</li>
              <li>Schedule and perform HVAC services</li>
              <li>Provide estimates, invoices, and customer support</li>
              <li>Send appointment reminders and service updates</li>
              <li>Improve our website and customer experience</li>
              <li>Send promotions, service reminders, or updates (you may opt out at any time)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Text Messaging and Communications</h2>
            <p className="text-gray-600 mb-6">
              By providing your phone number and submitting a form on our website or contacting us, you consent to receive calls and text messages from DFW HVAC, LLC regarding appointment confirmations, service updates, customer support, and promotions. Message and data rates may apply. You may opt out at any time by replying STOP to any text message or by contacting us directly.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Sharing of Information</h2>
            <p className="text-gray-600 mb-6">
              We do not sell or share your personal information for monetary compensation. We may share your information only as necessary with service providers, financing or payment partners, subcontractors, or legal authorities when required by law.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Financing and Payment Partners</h2>
            <p className="text-gray-600 mb-6">
              If you apply for financing or use third-party payment services, your information may be shared with lending or payment providers. These companies maintain their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-600 mb-6">
              Our website may use cookies and similar technologies to improve functionality and analyze website usage.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-6">
              We take reasonable administrative, technical, and physical safeguards to protect your personal information.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Privacy Rights for Texas Residents</h2>
            <p className="text-gray-600 mb-6">
              Texas residents may request access, correction, or deletion of their personal information and opt out of marketing communications.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Call Recording</h2>
            <p className="text-gray-600 mb-6">
              For quality assurance and training purposes, phone calls with DFW HVAC, LLC may be recorded.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-600 mb-6">
              Our services are not directed to individuals under the age of 13.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Third-Party Links</h2>
            <p className="text-gray-600 mb-6">
              Our website may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-[#003153] mt-10 mb-4">Contact Us</h2>
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
