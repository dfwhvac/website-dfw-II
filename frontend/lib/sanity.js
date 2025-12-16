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
    womenOwned,
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
