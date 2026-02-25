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
  async redirects() {
    return [
      // ============================================
      // TEMPORARY REDIRECT (302) - Remove when Showcase page is built
      // See PRD.md "RealWork Widget Decommissioning" for undo steps
      // ============================================
      {
        source: '/recent-projects',
        destination: '/reviews',
        permanent: false,
      },
      
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