export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dfwhvac.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',      // Sanity Studio admin UI - no SEO value
          '/api/',         // API routes (leads, cron) - never index
          '/internal/',    // Internal review/planning files (audits, previews) - noindex
          '/sitemap-preview.html', // Internal sitemap preview - noindex
          // NOTE: /_next/ intentionally NOT blocked.
          // Next.js serves CSS, JS, images, and fonts from /_next/static/.
          // Googlebot needs these to render pages properly for indexing,
          // measure Core Web Vitals, and evaluate mobile-friendliness.
          // Blocking /_next/ is a common legacy anti-pattern that hurts SEO.
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
