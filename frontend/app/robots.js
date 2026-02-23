export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',      // Sanity Studio - no need to index
          '/api/',         // API routes
          '/_next/',       // Next.js internals
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
