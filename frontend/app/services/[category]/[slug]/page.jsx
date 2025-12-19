import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceTemplate from '@/components/ServiceTemplate'
import { client } from '@/lib/sanity'
import { getCompanyInfo, getTestimonials, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import { notFound } from 'next/navigation'

// Generate static params for all services
export async function generateStaticParams() {
  const services = await client.fetch(`*[_type == "service"] { 
    category,
    "slug": slug.current 
  }`)
  
  return services.map((service) => ({
    category: service.category,
    slug: service.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const service = await client.fetch(
    `*[_type == "service" && category == $category && slug.current == $slug][0] {
      title,
      description
    }`,
    { category, slug }
  )
  
  if (!service) {
    return { title: 'Service Not Found' }
  }
  
  return {
    title: `${service.title} | DFW HVAC`,
    description: service.description,
  }
}

export default async function ServicePage({ params }) {
  const { category, slug } = await params
  
  // Fetch service data from Sanity
  const service = await client.fetch(
    `*[_type == "service" && category == $category && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      category,
      description,
      icon,
      features,
      heroSubtitle,
      heroDescription,
      heroBenefits,
      whatWeDoItems,
      processSteps,
      whyChooseUsReasons,
      emergencyTitle,
      emergencyDescription,
      emergencyFeatures,
      pricingTiers,
      faqs
    }`,
    { category, slug }
  )
  
  if (!service) {
    notFound()
  }
  
  // Fetch company info
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) {
    companyInfo = mockCompanyInfo
  }
  
  // Fetch testimonials
  let testimonials = await getTestimonials()
  if (!testimonials || testimonials.length === 0) {
    testimonials = mockTestimonials
  }
  
  // Transform service data to match template structure
  const serviceData = {
    title: service.title,
    icon: service.icon || 'wrench',
    heroContent: {
      title: service.title,
      subtitle: service.heroSubtitle || `Expert ${service.title} for DFW`,
      description: service.heroDescription || service.description,
      benefits: service.heroBenefits || service.features || [],
    },
    sections: {
      whatWeDo: {
        title: 'What We Do',
        items: service.whatWeDoItems || service.features || [],
      },
      ourProcess: {
        title: 'Our Process',
        steps: service.processSteps || [
          { step: 1, title: 'Contact Us', description: 'Call or book online for fast service' },
          { step: 2, title: 'Diagnosis', description: 'Our technicians diagnose the issue' },
          { step: 3, title: 'Solution', description: 'We provide options and pricing' },
          { step: 4, title: 'Service', description: 'Expert repair or installation' },
        ],
      },
      whyChooseUs: {
        title: 'Why Choose Us',
        reasons: service.whyChooseUsReasons || [
          'Licensed & Insured Technicians',
          '50+ Years of Experience',
          'Upfront Pricing - No Hidden Fees',
          'Same-Day Service Available',
          '100% Satisfaction Guarantee',
        ],
      },
      emergencyService: {
        title: service.emergencyTitle || '24/7 Emergency Service',
        description: service.emergencyDescription || 'HVAC emergencies don\'t wait, and neither do we. Our team is available around the clock.',
        features: service.emergencyFeatures || [
          'Available 24/7/365',
          'Fast Response Time',
          'No Extra Weekend Charges',
        ],
      },
    },
    pricing: service.pricingTiers ? 
      Object.fromEntries(service.pricingTiers.map((tier, i) => [
        `tier${i + 1}`,
        { title: tier.title, startingPrice: tier.startingPrice, includes: tier.includes }
      ])) : {
        diagnostic: {
          title: 'Diagnostic',
          startingPrice: 'From $89',
          includes: ['Full system inspection', 'Problem diagnosis', 'Repair estimate'],
        },
        repair: {
          title: 'Repair',
          startingPrice: 'From $150',
          includes: ['Expert repair', 'Quality parts', '1-year warranty'],
        },
        replacement: {
          title: 'Replacement',
          startingPrice: 'Free Estimate',
          includes: ['System assessment', 'Multiple options', 'Financing available'],
        },
      },
    faqs: service.faqs || [
      { question: `How often should I service my ${service.title.toLowerCase()}?`, answer: 'We recommend annual maintenance to keep your system running efficiently and prevent costly repairs.' },
      { question: 'Do you offer financing?', answer: 'Yes! We offer flexible financing options to make your HVAC investment affordable.' },
      { question: 'Are your technicians licensed?', answer: 'Absolutely. All our technicians are fully licensed, insured, and background-checked.' },
    ],
  }
  
  return (
    <div className="min-h-screen">
      <Header companyInfo={companyInfo} />
      <main>
        <ServiceTemplate 
          service={serviceData} 
          companyInfo={companyInfo}
          testimonials={testimonials}
        />
      </main>
      <Footer companyInfo={companyInfo} />
    </div>
  )
}
