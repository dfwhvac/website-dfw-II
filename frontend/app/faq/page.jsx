import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQAccordion from '@/components/FAQAccordion'
import { FAQSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings, getFaqs, getFaqPage } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { HelpCircle, Phone, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// ISR: Revalidate every hour
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata() {
  const faqPage = await getFaqPage()
  return {
    title: faqPage?.metaTitle || 'FAQ | DFW HVAC | Frequently Asked Questions',
    description: faqPage?.metaDescription || 'Find answers to common questions about HVAC services, pricing, scheduling, equipment, and maintenance from DFW HVAC - serving Dallas-Fort Worth since 1974.',
  }
}

// Default FAQs (used when Sanity data not available)
const defaultFaqs = [
  // Residential - Services (5)
  { _id: 'rs1', category: 'residential-services', order: 1,
    question: 'What HVAC services do you offer for homes?',
    answer: 'We offer comprehensive residential HVAC services including air conditioning repair, installation, and maintenance; heating system repair and installation; indoor air quality solutions; duct cleaning and sealing; thermostat installation; and same-day repairs. We service all major brands and system types.' },
  { _id: 'rs2', category: 'residential-services', order: 2,
    question: 'Do you service all HVAC brands?',
    answer: 'Yes, our technicians are trained and certified to work on all major HVAC brands including Carrier, Trane, Lennox, Rheem, Goodman, American Standard, York, Bryant, and many others. We can repair, maintain, or replace any residential heating or cooling system.' },
  { _id: 'rs3', category: 'residential-services', order: 3,
    question: 'Do you offer same-day HVAC repair services?',
    answer: 'Yes, we offer same-day HVAC repair services throughout the Dallas-Fort Worth area during our business hours (Monday-Friday, 9 AM - 6 PM). When your AC fails on a hot Texas summer day or your heater stops working during a cold snap, call us and we\'ll get a technician to you as quickly as possible.' },
  { _id: 'rs4', category: 'residential-services', order: 4,
    question: 'What areas do you serve?',
    answer: 'We serve the entire Dallas-Fort Worth metroplex including Dallas, Fort Worth, Arlington, Plano, Irving, Garland, Grand Prairie, McKinney, Frisco, Denton, Coppell, Lewisville, Carrollton, Richardson, and surrounding communities within approximately 30 miles of our location.' },
  { _id: 'rs5', category: 'residential-services', order: 5,
    question: 'How long has DFW HVAC been in business?',
    answer: 'DFW HVAC has been family-owned and operated since 1974 - that\'s over 50 years of serving the Dallas-Fort Worth community. Our longevity speaks to our commitment to quality service, fair pricing, and customer satisfaction.' },

  // Residential - Pricing (4)
  { _id: 'rp1', category: 'residential-pricing', order: 1,
    question: 'Do you offer free estimates?',
    answer: 'Yes, we provide free estimates for new system installations and major repairs. For service calls and diagnostics, we charge a flat diagnostic fee which is waived if you proceed with the recommended repair. We believe in transparent, upfront pricing with no hidden fees.' },
  { _id: 'rp2', category: 'residential-pricing', order: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), checks, and cash. For larger installations, we also offer financing options with approved credit to help make your investment more manageable.' },
  { _id: 'rp3', category: 'residential-pricing', order: 3,
    question: 'Do you offer financing for new HVAC systems?',
    answer: 'Yes, we offer flexible financing options for qualified buyers. This allows you to replace your aging system with a new, energy-efficient unit and pay over time with affordable monthly payments. Ask our team about current financing promotions and terms.' },
  { _id: 'rp4', category: 'residential-pricing', order: 4,
    question: 'How much does a new AC unit cost?',
    answer: 'The cost of a new AC system varies based on the size of your home, system efficiency rating (SEER), brand, and any additional work needed. Residential systems typically range from $4,500 to $12,000+ installed. We provide detailed quotes after assessing your specific needs.' },

  // Residential - Scheduling (3)
  { _id: 'rsc1', category: 'residential-scheduling', order: 1,
    question: 'How quickly can you schedule a service appointment?',
    answer: 'For routine maintenance and non-emergency repairs, we typically schedule appointments within 1-3 business days. During peak season (summer and winter), wait times may be slightly longer. Emergency calls are prioritized and usually addressed same-day or next-day.' },
  { _id: 'rsc2', category: 'residential-scheduling', order: 2,
    question: 'Do I need to be home during the service call?',
    answer: 'Yes, we require an adult (18+) to be present during service calls for safety and liability reasons. This also allows our technician to explain findings, discuss options, and answer any questions you may have about your system.' },
  { _id: 'rsc3', category: 'residential-scheduling', order: 3,
    question: 'What are your business hours?',
    answer: 'Our regular business hours are Monday through Friday, 9:00 AM to 6:00 PM. We are closed on Saturday and Sunday.' },

  // Residential - Equipment (4)
  { _id: 're1', category: 'residential-equipment', order: 1,
    question: 'How long do HVAC systems typically last?',
    answer: 'With proper maintenance, air conditioning systems typically last 15-20 years, while furnaces can last 20-25 years. Heat pumps average 15-18 years. Factors affecting lifespan include maintenance frequency, usage patterns, and local climate conditions.' },
  { _id: 're2', category: 'residential-equipment', order: 2,
    question: 'What size HVAC system do I need for my home?',
    answer: 'System sizing depends on your home\'s square footage, insulation, window placement, ceiling height, and other factors. An undersized system won\'t cool effectively; an oversized one cycles too frequently. We perform a detailed load calculation to recommend the right size for your home.' },
  { _id: 're3', category: 'residential-equipment', order: 3,
    question: 'What is a SEER rating and why does it matter?',
    answer: 'SEER (Seasonal Energy Efficiency Ratio) measures an air conditioner\'s cooling efficiency. Higher SEER ratings mean greater efficiency and lower energy bills. Current minimum standards require 14-15 SEER, while high-efficiency units reach 20+ SEER. Higher efficiency units cost more upfront but save money over time.' },
  { _id: 're4', category: 'residential-equipment', order: 4,
    question: 'Should I repair or replace my old HVAC system?',
    answer: 'Consider replacement if your system is 15+ years old, requires frequent repairs, uses R-22 refrigerant (phased out), or your energy bills are increasing. Generally, if a repair costs more than 50% of a new system\'s value, replacement is the better investment.' },

  // Residential - Maintenance (4)
  { _id: 'rm1', category: 'residential-maintenance', order: 1,
    question: 'How often should I have my HVAC system serviced?',
    answer: 'We recommend professional maintenance twice per year - once in spring for your AC before summer, and once in fall for your heating system before winter. Regular maintenance prevents breakdowns, extends equipment life, maintains efficiency, and keeps warranties valid.' },
  { _id: 'rm2', category: 'residential-maintenance', order: 2,
    question: 'How often should I change my air filter?',
    answer: 'Standard 1-inch filters should be changed every 30-60 days. Higher-quality 4-inch filters can last 3-6 months. Factors like pets, allergies, and home dustiness may require more frequent changes. A dirty filter restricts airflow, reduces efficiency, and can damage your system.' },
  { _id: 'rm3', category: 'residential-maintenance', order: 3,
    question: 'What does a maintenance visit include?',
    answer: 'Our comprehensive maintenance includes inspecting and cleaning components, checking refrigerant levels, testing electrical connections, lubricating moving parts, calibrating the thermostat, checking airflow, inspecting ductwork, and providing a detailed report of your system\'s condition.' },
  { _id: 'rm4', category: 'residential-maintenance', order: 4,
    question: 'Do you offer maintenance plans or service agreements?',
    answer: 'Yes, we offer annual maintenance plans that include two tune-ups per year, priority scheduling, discounts on repairs, and other benefits. Our plans help you budget for HVAC care while ensuring your system runs efficiently year-round.' },

  // Commercial (10)
  { _id: 'c1', category: 'commercial', order: 1,
    question: 'Do you service commercial HVAC systems?',
    answer: 'Yes, we provide comprehensive commercial HVAC services for systems under 20 tons, which covers most small to medium commercial buildings including offices, retail spaces, restaurants, medical facilities, and light industrial applications.' },
  { _id: 'c2', category: 'commercial', order: 2,
    question: 'What types of commercial buildings do you service?',
    answer: 'We service offices, retail stores, restaurants, medical and dental offices, churches, small warehouses, and other commercial spaces with rooftop units or split systems under 20 tons. For larger industrial systems, we can recommend specialized contractors.' },
  { _id: 'c3', category: 'commercial', order: 3,
    question: 'Can you work around our business hours?',
    answer: 'Absolutely. We understand that HVAC work can disrupt your business operations. We offer flexible scheduling including early morning, evening, and weekend appointments to minimize impact on your customers and employees.' },
  { _id: 'c4', category: 'commercial', order: 4,
    question: 'Do you offer commercial maintenance contracts?',
    answer: 'Yes, we offer customized maintenance agreements for commercial clients. These include scheduled preventive maintenance, priority service, detailed documentation for your records, and discounted labor rates. Regular maintenance is critical for commercial systems.' },
  { _id: 'c5', category: 'commercial', order: 5,
    question: 'How quickly can you respond to commercial HVAC issues?',
    answer: 'We prioritize commercial calls because we understand a failed HVAC system can mean lost revenue, uncomfortable customers, and employee productivity issues. We typically respond to commercial calls within 2-4 hours during business hours (Monday-Friday, 9 AM - 6 PM).' },
  { _id: 'c6', category: 'commercial', order: 6,
    question: 'What is the difference between commercial and residential HVAC service?',
    answer: 'Commercial systems are typically larger, more complex, and may include rooftop units, multi-zone systems, and building automation controls. They also face heavier usage demands. Our technicians are trained in both residential and light commercial applications.' },
  { _id: 'c7', category: 'commercial', order: 7,
    question: 'Can you help reduce our commercial energy costs?',
    answer: 'Yes, we can assess your current system\'s efficiency and recommend upgrades, programmable thermostats, zoning solutions, or replacement units that can significantly reduce energy consumption. Many commercial clients see 20-40% energy savings after upgrading to modern equipment.' },
  { _id: 'c8', category: 'commercial', order: 8,
    question: 'Do you handle new construction commercial HVAC installation?',
    answer: 'Yes, we work with contractors and business owners on new construction projects for light commercial applications. We can help with system design, equipment selection, installation, and initial setup to ensure your new space is comfortable from day one.' },
  { _id: 'c9', category: 'commercial', order: 9,
    question: 'What documentation do you provide for commercial service?',
    answer: 'We provide detailed service reports including work performed, parts used, system condition assessment, and recommendations. This documentation is valuable for your records, property management, insurance purposes, and planning future maintenance or capital expenditures.' },
  { _id: 'c10', category: 'commercial', order: 10,
    question: 'Are your technicians certified for commercial work?',
    answer: 'Yes, our technicians hold EPA certifications for refrigerant handling and are trained in commercial HVAC systems. Many hold additional certifications from manufacturers like Carrier, Trane, and Lennox for commercial equipment service and installation.' },
]

export default async function FAQPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  const siteSettings = await getSiteSettings()
  const faqPage = await getFaqPage()
  
  // Get page content with fallbacks
  const pageContent = {
    heroTitle: faqPage?.heroTitle || 'Frequently Asked Questions',
    heroDescription: faqPage?.heroDescription || 'Find answers to common questions about our HVAC services, pricing, scheduling, and more.',
    ctaTitle: faqPage?.ctaTitle || 'Still Have Questions?',
    ctaDescription: faqPage?.ctaDescription || 'Our friendly team is here to help. Give us a call or schedule a free consultation.',
  }
  
  // Fetch FAQs from Sanity, fall back to defaults
  let faqs = await getFaqs()
  if (!faqs || faqs.length === 0) {
    faqs = defaultFaqs
  }

  return (
    <div className="min-h-screen bg-white">
      {/* FAQ Schema for SEO - pulls from Sanity */}
      <FAQSchema faqs={faqs} />

      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-prussian-blue to-electric-blue text-white py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {pageContent.heroTitle}
              </h1>
              <p className="text-xl text-blue-100">
                {pageContent.heroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-gray-50 py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="#residential" className="text-electric-blue hover:underline font-medium">
                Residential FAQs
              </a>
              <span className="text-gray-300">|</span>
              <a href="#commercial" className="text-electric-blue hover:underline font-medium">
                Commercial FAQs
              </a>
              <span className="text-gray-300">|</span>
              <a href="tel:+19727772665" className="text-vivid-red hover:underline font-medium">
                Still have questions? Call us
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16" id="residential">
          <div className="container mx-auto px-4">
            <FAQAccordion faqs={faqs} />
          </div>
        </section>

        {/* Still Have Questions CTA - Service-first strategy */}
        <section className="bg-prussian-blue text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {pageContent.ctaTitle}
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              {pageContent.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-vivid-red hover:bg-red-700 text-white font-semibold"
                onClick={() => { if (typeof window !== 'undefined' && window.HCPWidget) window.HCPWidget.openModal() }}
              >
                <Wrench className="w-5 h-5 mr-2" />
                Book Service Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-prussian-blue font-semibold"
                asChild
              >
                <a href="tel:+19727772665">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (972) 777-COOL
                </a>
              </Button>
            </div>
            
            {/* Subtle estimate link */}
            <p className="mt-6 text-blue-200/70 text-sm">
              Considering a system upgrade? <Link href="/estimate" className="text-white underline hover:text-blue-100">Get a Free Estimate →</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
