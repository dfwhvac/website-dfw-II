/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Strip `X-Powered-By: Next.js` — minor framework-fingerprint leak (flagged Apr 27 by securityheaders.com).
  poweredByHeader: false,
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
  // ISR via per-page `export const revalidate = 3600` (May 11, 2026 — flipped from force-dynamic).
  experimental: {
    // P2.20 Step 2 (Feb 2026): inline critical above-the-fold CSS, defer the rest.
    // Targets the 14.5 KiB render-blocking CSS chunk that's contributing to the H1
    // LCP element's 770ms render delay (per PSI May 14 2026). Next.js uses beasties
    // (formerly critters) internally to extract used selectors above the fold and
    // inline them in <head>, while async-loading the remainder. Predicted gain:
    // -160 to -300ms LCP on text-LCP pages like the homepage.
    optimizeCss: true,
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
          // HSTS: 2-year max-age + includeSubDomains + preload (HSTS preload list eligible).
          // Note: Vercel injects HSTS automatically; this declaration ensures parity across hosts.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Cross-origin isolation hardening (COEP intentionally omitted — `require-corp` would break
          // cross-origin Maps tiles, GTM, Sanity CDN). COOP + CORP cover Spectre / tabnapping vectors.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          // Block legacy DNS prefetch leaks; we control prefetching explicitly via <link rel="preconnect">.
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 'unsafe-inline' + 'unsafe-eval' retained for Next.js inline RSC payloads + GTM/GA.
              // Tracked as accepted risk in /app/memory/audits/2026-04-27_KPI_Baseline.md (Security section).
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://app.realworklabs.com https://maps.googleapis.com https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // c.bing.com: Clarity ↔ Bing sync tracking pixel (CSP violation surfaced
              // in PSI May 14 2026 — non-functional, cosmetic console noise only).
              // www.googletagmanager.com: GTM serves a 1×1 tracking pixel + noscript
              // fallback image from this host (Feb 16, 2026 — was being blocked,
              // breaking GA4/Ads conversion pixel fires).
              "img-src 'self' data: blob: https://cdn.sanity.io https://images.unsplash.com https://maps.googleapis.com https://maps.gstatic.com https://*.google.com https://*.googleusercontent.com https://www.googletagmanager.com https://app.realworklabs.com https://*.clarity.ms https://c.bing.com",
              "font-src 'self' https://fonts.gstatic.com",
              // analytics.google.com + stats.g.doubleclick.net: GA4 Measurement Protocol /
              // gtag collect endpoints (PSI Jul 9 2026 — www.google-analytics.com alone was
              // insufficient; collect calls were CSP-blocked and never reached GA4).
              "connect-src 'self' https://iar2b790.api.sanity.io https://iar2b790.apicdn.sanity.io https://www.google.com https://maps.googleapis.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://stats.g.doubleclick.net https://www.googletagmanager.com https://app.realworklabs.com https://vitals.vercel-insights.com https://vercel.live https://www.clarity.ms https://c.clarity.ms https://*.clarity.ms",
              "frame-src 'self' https://www.google.com https://app.realworklabs.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
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

      // System-level work (installation, ducting) → dedicated system-replacement page
      // Apr 24, 2026: P1.13 shipped → /installation now targets /services/system-replacement.
      // /ducting stays at /estimate until a dedicated duct page ships (future P2).
      {
        source: '/installation',
        destination: '/services/system-replacement',
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

      // May 2026 — Legacy aliases from GA4 tag-coverage audit (Wix bookmarks, typos, QA paths)
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/our-company', destination: '/about', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/contactus', destination: '/contact', permanent: true },
      { source: '/pages/contact', destination: '/contact', permanent: true },
      { source: '/reach-us', destination: '/contact', permanent: true },
      { source: '/get-in-touch', destination: '/contact', permanent: true },
      { source: '/connect', destination: '/contact', permanent: true },
      { source: '/help', destination: '/faq', permanent: true },
      { source: '/support', destination: '/contact', permanent: true },
      { source: '/team', destination: '/about', permanent: true },
      { source: '/our-team', destination: '/about', permanent: true },
      { source: '/fleet', destination: '/about', permanent: true },
      { source: '/our-fleet', destination: '/about', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
      { source: '/blogs', destination: '/', permanent: true },
      {
        source: '/services/ac-repair',
        destination: '/services/residential/air-conditioning',
        permanent: true,
      },
      {
        source: '/services/residential/ac-repair',
        destination: '/services/residential/air-conditioning',
        permanent: true,
      },
      {
        source: '/cities-served/richardson/:uuid',
        destination: '/cities-served/richardson',
        permanent: true,
      },
      { source: '/abctest', destination: '/', permanent: true },
      { source: '/xyztest', destination: '/', permanent: true },
      { source: '/xyz-test', destination: '/', permanent: true },
      { source: '/nonexistent-404-test-page', destination: '/', permanent: true },
    ]
  },
};

// @next/bundle-analyzer wrapper — activates only when ANALYZE=true is set in the env.
// Standard usage: ANALYZE=true yarn build → opens an interactive treemap of the bundle.
// Added May 4, 2026 (F13 architecture audit).
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);