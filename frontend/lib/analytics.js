/**
 * GA4 / Clarity inclusion rules (server-safe).
 *
 * Scripts are omitted entirely from preview and local builds so gtag never
 * loads on *.vercel.app or emergent preview hosts. Production Vercel must set
 * NEXT_PUBLIC_GA_ID (and optionally NEXT_PUBLIC_CLARITY_ID) in the Production
 * environment only.
 *
 * Loading tiers (see ProductionAnalytics.jsx):
 *   Tier 1 — GA4 via @next/third-parties/google <GoogleAnalytics />
 *   Tier 2 — Clarity via next/script strategy="lazyOnload"
 *   Tier 3 — RealWork, Maps, reCAPTCHA via useLazyScript / on-demand focus
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? ''

export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_ID?.trim() ?? 'wjyapvd6n7'

/** Hostnames that may send analytics hits (client guard). */
export const PRODUCTION_HOSTNAMES = ['dfwhvac.com', 'www.dfwhvac.com']

/**
 * True when this server render should include analytics <Script> tags.
 * Matches Vercel production deploys with a measurement ID configured.
 */
export function shouldIncludeAnalyticsScripts() {
  if (!GA_MEASUREMENT_ID) return false

  const vercelEnv =
    process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENV ?? ''

  if (vercelEnv === 'preview' || vercelEnv === 'development') {
    return false
  }

  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  return true
}

/** Paths that should not emit GA4 page_view (admin / internal / CMS). */
export const ANALYTICS_EXCLUDED_PATH_PREFIXES = ['/studio', '/internal', '/api']

export function isAnalyticsExcludedPath(pathname) {
  if (!pathname) return true
  return ANALYTICS_EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}
