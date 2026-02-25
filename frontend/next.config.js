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
  // Temporary redirect: /recent-projects -> /reviews
  // UNDO THIS when the static Showcase Projects page is built
  // See PRD.md "Showcase Projects Page Plan" for details
  async redirects() {
    return [
      {
        source: '/recent-projects',
        destination: '/reviews',
        permanent: false, // 302 temporary redirect (preserves SEO value of URL)
      },
    ]
  },
};

module.exports = nextConfig;