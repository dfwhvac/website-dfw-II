import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

// Create the Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

// Image URL builder
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  if (!source) return null
  return builder.image(source)
}

// GROQ Queries
export const queries = {
  // Brand Colors
  brandColors: `*[_type == "brandColors"][0] {
    prussianBlue { hex },
    electricBlue { hex },
    vividRed { hex },
    limeGreen { hex },
    goldAmber { hex },
    charcoal { hex },
    lightGray { hex },
    white { hex }
  }`,

  // Company Info
  companyInfo: `*[_type == "companyInfo"][0] {
    name,
    tagline,
    phone,
    phoneDisplay,
    email,
    address,
    description,
    googleRating,
    googleReviews,
    established,
    businessHours,
    serviceAreas
  }`,

  // All Services
  allServices: `*[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    category,
    icon,
    features
  }`,

  // Testimonials
  testimonials: `*[_type == "testimonial"] | order(publishedAt desc) {
    _id,
    name,
    location,
    rating,
    text,
    service,
    timeAgo
  }`,

  // Site Settings
  siteSettings: `*[_type == "siteSettings"][0] {
    headerTagline,
    headerCtaText,
    showHeaderTagline,
    mainNavigation[] | order(order asc) {
      label,
      href,
      isDropdown,
      dropdownItems[] {
        label,
        href
      },
      isVisible
    },
    ctaButtons[] | order(order asc) {
      label,
      href,
      variant
    },
    footerTagline,
    footerSections[] | order(order asc) {
      title,
      links[] {
        label,
        href
      }
    },
    socialLinks[] {
      platform,
      url
    },
    copyrightText,
    showServiceAreas,
    showBusinessHours
  }`,

  // FAQs
  faqs: `*[_type == "faq" && isPublished == true] | order(category asc, order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`,

  // Testimonials (updated schema)
  allTestimonials: `*[_type == "testimonial" && isVisible == true] | order(date desc) {
    _id,
    name,
    rating,
    text,
    services,
    date,
    source
  }`,

  // Company Pages
  companyPage: `*[_type == "companyPage" && slug.current == $slug && isPublished == true][0] {
    title,
    slug,
    pageType,
    metaTitle,
    metaDescription,
    heroTitle,
    heroSubtitle,
    heroDescription,
    heroCta,
    sections[] {
      sectionTitle,
      sectionContent,
      bulletPoints
    },
    teamMembers[] {
      name,
      role,
      bio
    },
    serviceAreasList[] {
      city,
      description
    },
    financingOptions[] {
      title,
      description,
      terms
    },
    caseStudies[] {
      title,
      client,
      challenge,
      solution,
      result
    },
    showContactForm,
    showTestimonials,
    showCtaBanner
  }`,

  // All published company page slugs (for static generation)
  allCompanyPageSlugs: `*[_type == "companyPage" && isPublished == true] {
    "slug": slug.current
  }`,

  // Homepage content
  homepage: `*[_type == "homepage"][0] {
    metaTitle,
    metaDescription,
    heroBadge,
    heroTitle,
    heroTitleHighlight,
    heroTitleLine3,
    heroDescription,
    heroPrimaryButton,
    heroSecondaryButton,
    servicesTitle,
    servicesDescription,
    whyUsTitle,
    whyUsSubtitle,
    whyUsItems,
    testimonialsTitle,
    testimonialsSubtitle,
    maxTestimonials,
    ctaTitle,
    ctaDescription
  }`,
}

// Helper functions to fetch data
export async function getCompanyInfo() {
  try {
    const data = await client.fetch(queries.companyInfo)
    return data
  } catch (error) {
    console.error('Error fetching company info:', error)
    return null
  }
}

export async function getServices() {
  try {
    const data = await client.fetch(queries.allServices)
    return data
  } catch (error) {
    console.error('Error fetching services:', error)
    return null
  }
}

export async function getTestimonials() {
  try {
    const data = await client.fetch(queries.testimonials)
    return data
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return null
  }
}

export async function getSiteSettings() {
  try {
    const data = await client.fetch(queries.siteSettings)
    return data
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export async function getBrandColors() {
  try {
    const data = await client.fetch(queries.brandColors)
    return data
  } catch (error) {
    console.error('Error fetching brand colors:', error)
    return null
  }
}

export async function getFaqs() {
  try {
    const data = await client.fetch(queries.faqs)
    return data
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return null
  }
}

export async function getAllTestimonials() {
  try {
    const data = await client.fetch(queries.allTestimonials)
    return data
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return null
  }
}

export async function getCompanyPage(slug) {
  try {
    const data = await client.fetch(queries.companyPage, { slug })
    return data
  } catch (error) {
    console.error('Error fetching company page:', error)
    return null
  }
}

export async function getAllCompanyPageSlugs() {
  try {
    const data = await client.fetch(queries.allCompanyPageSlugs)
    return data
  } catch (error) {
    console.error('Error fetching company page slugs:', error)
    return []
  }
}
