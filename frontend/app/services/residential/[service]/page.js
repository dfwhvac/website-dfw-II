import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceTemplate from '@/components/ServiceTemplate'
import { getServiceData } from '@/lib/services'
import { createMetadata } from '@/lib/metadata'
import { notFound } from 'next/navigation'

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const service = await getServiceData('residential', params.service)
  
  if (!service) {
    return createMetadata({
      title: 'Service Not Found | DFW HVAC',
      description: 'The requested service page could not be found.',
    })
  }

  return createMetadata({
    title: `${service.title} | DFW HVAC | Dallas-Fort Worth`,
    description: `Professional ${service.title.toLowerCase()} services in Dallas-Fort Worth. ${service.description}`,
    keywords: service.keywords,
  })
}

// Generate static paths for known services
export async function generateStaticParams() {
  return [
    { service: 'air-conditioning' },
    { service: 'heating' },
    { service: 'indoor-air-quality' },
    { service: 'preventative-maintenance' },
  ]
}

export default async function ResidentialServicePage({ params }) {
  const service = await getServiceData('residential', params.service)
  
  if (!service) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ServiceTemplate service={service} />
      </main>
      <Footer />
    </div>
  )
}