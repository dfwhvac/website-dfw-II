import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-12-01',
  // Add token for write operations (in production)
  token: process.env.SANITY_API_TOKEN,
})

// Helper function for image URLs
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// GROQ queries for content
export const queries = {
  // Get all services
  allServices: `*[_type == "service"] {
    _id,
    title,
    slug,
    description,
    category,
    icon,
    heroContent,
    sections,
    pricing,
    faqs,
    "testimonials": testimonials[]->
  }`,
  
  // Get service by slug
  serviceBySlug: `*[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    category,
    icon,
    heroContent,
    sections,
    pricing,
    faqs,
    seo,
    "testimonials": testimonials[]->
  }`,
  
  // Get company information
  companyInfo: `*[_type == "companyInfo"][0] {
    _id,
    name,
    phone,
    email,
    address,
    businessHours,
    serviceAreas,
    socialMedia,
    googleRating,
    googleReviews
  }`,
  
  // Get testimonials
  testimonials: `*[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    customerName,
    location,
    rating,
    text,
    service,
    timeAgo
  }`,
  
  // Get site settings
  siteSettings: `*[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    keywords,
    ogImage,
    favicon
  }`
}

// Helper functions
export async function getServices() {
  return await client.fetch(queries.allServices)
}

export async function getServiceBySlug(slug) {
  return await client.fetch(queries.serviceBySlug, { slug })
}

export async function getCompanyInfo() {
  return await client.fetch(queries.companyInfo)
}

export async function getTestimonials() {
  return await client.fetch(queries.testimonials)
}

export async function getSiteSettings() {
  return await client.fetch(queries.siteSettings)
}