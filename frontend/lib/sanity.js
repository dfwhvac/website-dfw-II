import { cache } from 'react'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

// Published reads use Sanity CDN (apicdn) — ~50–150ms vs API origin. ISR revalidate=3600
// on pages bounds staleness; see P2.20 Step 4 / FOUNDATION_AUDIT_PROGRAM.md.
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
    licenseNumber,
    address,
    description,
    googleRating,
    googleReviews,
    fiveStarReviewCount,
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
    showBusinessHours,
    leadFormTitle,
    leadFormDescription,
    leadFormButtonText,
    leadFormSuccessMessage,
    leadFormTrustSignals,
    leadFormFooterText,
    siteNameSuffix,
    defaultMetaDescription,
    defaultOgImage,
    googleSiteVerification
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

  // FAQ Page settings
  faqPage: `*[_type == "faqPage"][0] {
    heroTitle,
    heroDescription,
    ctaTitle,
    ctaDescription,
    metaTitle,
    metaDescription
  }`,

  // Reviews Page settings
  reviewsPage: `*[_type == "reviewsPage"][0] {
    heroTitle,
    heroSubtitle,
    googleBadgeTitle,
    showAllText,
    loadMoreText,
    metaTitle,
    metaDescription
  }`,

  // City Pages (for service areas)
  cityPages: `*[_type == "cityPage" && isPublished == true] | order(priority asc, cityName asc) {
    cityName,
    "slug": slug.current,
    zipCodes
  }`,

  // About Page
  aboutPage: `*[_type == "aboutPage"][0] {
    metaTitle,
    metaDescription,
    heroTitle,
    heroSubtitle,
    heroDescription,
    storyTitle,
    storyContent,
    storyHighlight,
    legacyTimeline,
    valuesTitle,
    valuesSubtitle,
    brandPillars,
    statistics,
    showTeamSection,
    teamTitle,
    teamMembers,
    showTestimonials,
    showContactForm
  }`,

  // Contact Page
  contactPage: `*[_type == "contactPage"][0] {
    metaTitle,
    metaDescription,
    heroTitle,
    heroSubtitle,
    heroDescription,
    contactSectionTitle,
    phoneDescription,
    emailDescription,
    emergencyText,
    formTitle,
    formDescription,
    ctaTitle,
    ctaDescription
  }`,

  // Trust Signals
  trustSignals: `*[_type == "trustSignals"][0] {
    primaryBadges,
    whyChooseUsItems,
    servicePageReasons,
    emergencyServiceTitle,
    emergencyServiceDescription,
    emergencyServiceFeatures,
    ctaTitle,
    ctaDescription,
    footerTrustText
  }`,

  // Site Settings (extended)
  siteSettingsExtended: `*[_type == "siteSettings"][0] {
    logoTagline,
    legacyStatement,
    missionStatement,
    companyFoundedYear,
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
    showBusinessHours,
    leadFormTitle,
    leadFormDescription,
    leadFormButtonText,
    leadFormSuccessMessage,
    leadFormTrustSignals,
    leadFormFooterText,
    siteNameSuffix,
    defaultMetaDescription,
    defaultOgImage,
    googleSiteVerification
  }`,
}

// React cache() dedupes identical GROQ calls within one server render (e.g. layout
// generateMetadata + page both calling getCompanyInfo).
export const getCompanyInfo = cache(async function getCompanyInfo() {
  try {
    const data = await client.fetch(queries.companyInfo)
    return data
  } catch (error) {
    console.error('Error fetching company info:', error)
    return null
  }
})

export const getServices = cache(async function getServices() {
  try {
    const data = await client.fetch(queries.allServices)
    return data
  } catch (error) {
    console.error('Error fetching services:', error)
    return null
  }
})

export const getTestimonials = cache(async function getTestimonials() {
  try {
    const data = await client.fetch(queries.testimonials)
    return data
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return null
  }
})

export const getSiteSettings = cache(async function getSiteSettings() {
  try {
    const data = await client.fetch(queries.siteSettings)
    return data
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
})

export const getBrandColors = cache(async function getBrandColors() {
  try {
    const data = await client.fetch(queries.brandColors)
    return data
  } catch (error) {
    console.error('Error fetching brand colors:', error)
    return null
  }
})

export const getFaqs = cache(async function getFaqs() {
  try {
    const data = await client.fetch(queries.faqs)
    return data
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return null
  }
})

export const getAllTestimonials = cache(async function getAllTestimonials() {
  try {
    const data = await client.fetch(queries.allTestimonials)
    return data
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return null
  }
})

export const getCompanyPage = cache(async function getCompanyPage(slug) {
  try {
    const data = await client.fetch(queries.companyPage, { slug })
    return data
  } catch (error) {
    console.error('Error fetching company page:', error)
    return null
  }
})

export const getAllCompanyPageSlugs = cache(async function getAllCompanyPageSlugs() {
  try {
    const data = await client.fetch(queries.allCompanyPageSlugs)
    return data
  } catch (error) {
    console.error('Error fetching company page slugs:', error)
    return []
  }
})

export const getHomepage = cache(async function getHomepage() {
  try {
    const data = await client.fetch(queries.homepage)
    return data
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return null
  }
})

export const getFaqPage = cache(async function getFaqPage() {
  try {
    const data = await client.fetch(queries.faqPage)
    return data
  } catch (error) {
    console.error('Error fetching FAQ page:', error)
    return null
  }
})

export const getReviewsPage = cache(async function getReviewsPage() {
  try {
    const data = await client.fetch(queries.reviewsPage)
    return data
  } catch (error) {
    console.error('Error fetching reviews page:', error)
    return null
  }
})

export const getCityPages = cache(async function getCityPages() {
  try {
    const data = await client.fetch(queries.cityPages)
    return data || []
  } catch (error) {
    console.error('Error fetching city pages:', error)
    return []
  }
})

export const getAboutPage = cache(async function getAboutPage() {
  try {
    const data = await client.fetch(queries.aboutPage)
    return data
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
})

export const getContactPage = cache(async function getContactPage() {
  try {
    const data = await client.fetch(queries.contactPage)
    return data
  } catch (error) {
    console.error('Error fetching contact page:', error)
    return null
  }
})

export const getTrustSignals = cache(async function getTrustSignals() {
  try {
    const data = await client.fetch(queries.trustSignals)
    return data
  } catch (error) {
    console.error('Error fetching trust signals:', error)
    return null
  }
})

export const getSiteSettingsExtended = cache(async function getSiteSettingsExtended() {
  try {
    const data = await client.fetch(queries.siteSettingsExtended)
    return data
  } catch (error) {
    console.error('Error fetching extended site settings:', error)
    return null
  }
})
