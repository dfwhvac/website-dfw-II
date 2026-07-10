'use client'

import Script from 'next/script'
import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
  CLARITY_PROJECT_ID,
  GA_MEASUREMENT_ID,
  isAnalyticsExcludedPath,
  PRODUCTION_HOSTNAMES,
} from '../lib/analytics'

function isProductionHostname() {
  if (typeof window === 'undefined') return false
  return PRODUCTION_HOSTNAMES.includes(window.location.hostname)
}

/**
 * Mutes GA on /studio, /internal, /api while keeping the tag loaded elsewhere.
 * Complements @next/third-parties auto pageviews on App Router navigations.
 */
function GaExcludedPathGuard({ measurementId }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return
    const key = `ga-disable-${measurementId}`
    const blocked =
      !isProductionHostname() || isAnalyticsExcludedPath(pathname)
    window[key] = blocked
  }, [pathname, measurementId])

  return null
}

/**
 * Tier 2 — Microsoft Clarity (recording / heatmaps). lazyOnload = outside critical window.
 */
function ClarityPixel({ clarityId }) {
  if (!clarityId) return null

  return (
    <Script id="ms-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){var h=l.location.hostname;var ok=${JSON.stringify(PRODUCTION_HOSTNAMES)};if(ok.indexOf(h)===-1)return;c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
    </Script>
  )
}

/**
 * Tiered third-party loading (production Vercel only — gated in root layout).
 *
 * Tier 1 — GA4: @next/third-parties <GoogleAnalytics /> (optimized gtag, post-hydration).
 *          Auto pageviews on App Router route changes (/cities-served/[slug], etc.).
 * Tier 2 — Clarity: next/script strategy="lazyOnload".
 * Tier 3 — Heavy widgets (RealWork, Maps): hooks/useLazyScript.js + components/LazyScript.jsx.
 *
 * Not in repo (no action): Meta Pixel, Google Ads, Hotjar, LinkedIn Insight, HubSpot chat.
 * reCAPTCHA: on-demand in RecaptchaScript.jsx (form focus path).
 * Google Maps: on-demand in AddressAutocomplete.jsx (input focus).
 */
export default function ProductionAnalytics({
  measurementId = GA_MEASUREMENT_ID,
  clarityId = CLARITY_PROJECT_ID,
}) {
  if (!measurementId) return null

  return (
    <>
      {/* Hostname guard before gtag — lazyOnload so it stays out of TBT */}
      <Script id="ga-hostname-guard" strategy="lazyOnload">
        {`(function(){try{var h=location.hostname;var ok=${JSON.stringify(PRODUCTION_HOSTNAMES)};if(ok.indexOf(h)===-1){window['ga-disable-${measurementId}']=true;}}catch(e){}})();`}
      </Script>
      {/* GA4 after hydration (next/third-parties). Collect hosts must be in CSP connect-src
          (analytics.google.com + stats.g.doubleclick.net) or hits are silently dropped. */}
      <GoogleAnalytics gaId={measurementId} />
      <GaExcludedPathGuard measurementId={measurementId} />
      {/* Clarity already lazyOnload — keep out of LCP critical window */}
      <ClarityPixel clarityId={clarityId} />
    </>
  )
}
