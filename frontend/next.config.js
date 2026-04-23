/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'cdn-jdaij.nitrocdn.com',
      'avatars.githubusercontent.com',
      'cdn.sanity.io'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Compress images and assets
  compress: true,
  // Disable static page caching to ensure fresh Sanity content
  experimental: {
    // Force dynamic rendering for all pages
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://app.realworklabs.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://maps.googleapis.com https://maps.gstatic.com https://*.google.com https://*.googleusercontent.com https://app.realworklabs.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://iar2b790.api.sanity.io https://iar2b790.apicdn.sanity.io https://www.google.com https://maps.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com https://app.realworklabs.com",
              "frame-src 'self' https://www.google.com https://app.realworklabs.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; ')
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // ============================================
      // PERMANENT REDIRECTS (301) - Old Wix URLs → New Next.js URLs
      // These preserve SEO value from the old Wix site.
      // Last updated: Apr 23, 2026 — legacy URL audit (see /app/memory/audits/2026-04-23_Legacy_URL_Redirect_Map.md)
      // ============================================

      // Brand/About
      {
        source: '/aboutus',
        destination: '/about',
        permanent: true,
      },

      // Service-call intent → book a technician
      {
        source: '/servicecall',
        destination: '/request-service',
        permanent: true,
      },
      {
        source: '/scheduleservicecall',
        destination: '/request-service',
        permanent: true,
      },

      // System-level work (installation, ducting) → free estimate is the first-step conversion
      // TODO: When P1.13 /services/system-replacement (or dedicated /services/system-installation) ships,
      // update /installation + /ducting to point there.
      {
        source: '/installation',
        destination: '/estimate',
        permanent: true,
      },
      {
        source: '/ducting',
        destination: '/estimate',
        permanent: true,
      },

      // Indoor Air Quality cluster
      {
        source: '/iaq',
        destination: '/services/residential/indoor-air-quality',
        permanent: true,
      },
      {
        source: '/testresults',
        destination: '/services/residential/indoor-air-quality',
        permanent: true,
      },
      {
        source: '/haloled',
        destination: '/services/residential/indoor-air-quality',
        permanent: true,
      },

      // Maintenance (Wix had 'seasonalmaintenance', current slug is 'preventative-maintenance')
      {
        source: '/seasonalmaintenance',
        destination: '/services/residential/preventative-maintenance',
        permanent: true,
      },

      // Wix auto-generated duplicate page that was legitimately redirected by the prior admin.
      // Preserve the intent with a single-hop redirect straight to the current target.
      {
        source: '/copy-of-ac-furnace-repair',
        destination: '/services/residential/preventative-maintenance',
        permanent: true,
      },

      // Products page on old site → services hub on current site
      {
        source: '/products',
        destination: '/services',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;