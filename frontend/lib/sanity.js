// Mock Sanity client for Phase 1 testing
// Replace with actual Sanity integration when ready

// Placeholder client (not used in Phase 1)
export const client = null

// Helper function for image URLs (returns placeholder)
export function urlFor(source) {
  return {
    url: () => source || '/placeholder.jpg'
  }
}

// GROQ queries (for future use)
export const queries = {
  allServices: '',
  serviceBySlug: '',
  companyInfo: '',
  testimonials: '',
  siteSettings: ''
}

// Helper functions return null (data comes from mockData.js)
export async function getServices() {
  return null
}

export async function getServiceBySlug(slug) {
  return null
}

export async function getCompanyInfo() {
  return null
}

export async function getTestimonials() {
  return null
}

export async function getSiteSettings() {
  return null
}
