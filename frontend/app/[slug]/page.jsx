import { notFound } from 'next/navigation'
import { getCompanyPage, getAllCompanyPageSlugs, getCompanyInfo, getSiteSettings, getAllTestimonials } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo, testimonials as mockTestimonials } from '@/lib/mockData'
import DynamicPage from '@/components/DynamicPage'

// ISR: Revalidate every hour
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Generate static paths for all published company pages
export async function generateStaticParams() {
  const pages = await getAllCompanyPageSlugs()
  return pages.map((page) => ({
    slug: page.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = await getCompanyPage(slug)
  
  if (!page) {
    return {
      title: 'Page Not Found | DFW HVAC',
    }
  }

  return {
    title: page.metaTitle || `${page.title} | DFW HVAC`,
    description: page.metaDescription || page.heroDescription || `${page.title} - DFW HVAC serving Dallas-Fort Worth.`,
    alternates: {
      canonical: `/${slug}`,
    },
  }
}

export default async function CompanyPageRoute({ params }) {
  const { slug } = await params
  
  // Fetch page data from Sanity
  const page = await getCompanyPage(slug)
  
  // If page doesn't exist, show 404
  if (!page) {
    notFound()
  }

  // Fetch additional data needed for the page
  const [companyInfo, siteSettings, sanityTestimonials] = await Promise.all([
    getCompanyInfo(),
    getSiteSettings(),
    page.showTestimonials ? getAllTestimonials() : null,
  ])

  // Use Sanity data with fallbacks to mock data
  const finalCompanyInfo = companyInfo || mockCompanyInfo
  const finalTestimonials = sanityTestimonials?.length > 0 ? sanityTestimonials : mockTestimonials

  return (
    <DynamicPage 
      page={page} 
      companyInfo={finalCompanyInfo}
      testimonials={finalTestimonials}
    />
  )
}
