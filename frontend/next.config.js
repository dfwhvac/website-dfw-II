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
      // These preserve SEO value from the old site
      // ============================================
      {
        source: '/scheduleservicecall',
        destination: '/request-service',
        permanent: true,
      },
      {
        source: '/installation',
        destination: '/estimate',
        permanent: true,
      },
      {
        source: '/iaq',
        destination: '/services/residential/indoor-air-quality',
        permanent: true,
      },
      {
        source: '/ducting',
        destination: '/services/residential/indoor-air-quality',
        permanent: true,
      },
      {
        source: '/seasonalmaintenance',
        destination: '/services/residential/preventative-maintenance',
        permanent: true,
      },
      {
        source: '/testresults',
        destination: '/services/residential/indoor-air-quality',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;