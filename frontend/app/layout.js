import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '../components/ui/sonner'
import { defaultMetadata } from '../lib/metadata'
import ColorProvider from '../components/ColorProvider'
import { getBrandColors } from '../lib/sanity'
import StickyMobileCTAClient from '../components/StickyMobileCTAClient'
import PhoneClickTracker from '../components/PhoneClickTracker'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const GA_ID = 'G-5MX2NE7C73'
const CLARITY_ID = 'wjyapvd6n7'

// Inter font — only the weights the codebase actually uses, explicit preload.
// P2.20 Step 1a (Feb 2026): hero is text-LCP (no image above-the-fold), so font
// strategy is the single biggest LCP lever. Default Inter() loads all 9 weights
// (100-900); we audited the codebase and only 4 are used:
//   font-normal (400)  · 1 use
//   font-medium (500)  · 72 uses
//   font-semibold (600) · 107 uses
//   font-bold (700)    · 195 uses
// Loading just these 4 cuts the woff2 payload ~55% vs the default 9-weight load
// while preserving every existing visual rendering. If a future component starts
// using font-thin / font-light / font-extrabold etc., add that weight here
// AND verify LCP stays under target.
// Predicted gain: -150 to -300ms LCP on slow mobile connections.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

// Root layout metadata sets metadataBase for all pages
// Individual pages should use generateMetadata() with their own canonical paths
export const metadata = {
  ...defaultMetadata,
  title: 'DFW HVAC - Dallas-Fort Worth\'s Trusted HVAC Experts',
  description: 'Expert HVAC service with integrity and care. Three generations of trusted heating & cooling service in Dallas-Fort Worth. Call (972) 777-COOL.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout({ children }) {
  const brandColors = await getBrandColors()
  
  return (
    <html lang="en">
      <head>
        {/* reCAPTCHA v3 is NOT loaded here. It's loaded on-demand by LeadForm.jsx
            and SimpleContactForm.jsx with strategy="lazyOnload" so pages without
            forms (home, about, reviews, cities, etc.) don't incur the TBT hit.
            See: TBT optimization, Apr 20 2026. */}
        {/* GA4 preview-env guard. Uses Google's official opt-out flag
            window['ga-disable-<ID>'] = true to mute hits on Vercel preview
            URLs, localhost, and any non-production host. Production host
            allow-list is kept narrow on purpose.

            P2.20 Step 1b (Feb 2026): demoted from beforeInteractive →
            afterInteractive. The original strategy was render-blocking by
            design (beforeInteractive injects into the document head and
            blocks all rendering until the script evaluates). The gtag
            scripts BELOW are lazyOnload (fire at browser-idle, well after
            page-interactive), so afterInteractive still guarantees this
            guard runs before any gtag config call — preserving the original
            intent without the LCP cost. Predicted gain: -30 to -100ms LCP. */}
        <Script id="ga-preview-guard" strategy="afterInteractive">
          {`(function(){try{var h=location.hostname;var ok=(h==='www.dfwhvac.com'||h==='dfwhvac.com');if(!ok){window['ga-disable-${GA_ID}']=true;}}catch(e){}})();`}
        </Script>
        {/* GA4 + Clarity — lazyOnload (F13-P1.1, May 4, 2026). Both were on
            'afterInteractive' which fires during React hydration and was a
            major TBT contributor (332ms+249ms long tasks per page from
            googletagmanager.com per Lighthouse). lazyOnload defers until
            browser-idle, removing the TBT hit while still capturing analytics
            (1-2 sec delay is invisible to the user and irrelevant to GA/Clarity). */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');`}
        </Script>
        {/* Microsoft Clarity heatmaps + session recordings (Phase 3 P3.D-C1, Feb 28, 2026).
            Production-only via hostname allow-list — same pattern as ga-preview-guard above.
            FREE forever (Microsoft Advertising funds it). GDPR/CCPA-compliant out of the box,
            anonymized PII automatically masked. lazyOnload mirrors GA4 — also was a TBT
            contributor before F13-P1.1. Used to capture pre-P1.10 (progressive form
            redesign) baseline of where users click, scroll, and abandon. */}
        <Script id="ms-clarity" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){
            var h=l.location.hostname;
            if(h!=='www.dfwhvac.com'&&h!=='dfwhvac.com')return;
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");`}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Skip-to-main link — first focusable element on every page (WCAG 2.1 SC 2.4.1).
            Visually hidden until keyboard-focused (see .skip-link in globals.css).
            Targets the #main-content wrapper below so screen-reader and keyboard-only
            users can bypass the global header nav. Added Feb 28, 2026 (P3-a11y). */}
        <a href="#main-content" className="skip-link" data-testid="skip-to-main-link">
          Skip to main content
        </a>
        <ColorProvider brandColors={brandColors}>
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
        </ColorProvider>
        <Toaster />
        <PhoneClickTracker />
        <StickyMobileCTAClient 
          phone="(972) 777-COOL"
          phoneNumber="+19727772665"
          ctaText="Call Now for Service"
        />
        {/* Vercel Analytics + Speed Insights — RUM for CWV (LCP/INP/CLS p75 in field).
            Free on hobby + pro plans. Auto-disabled on preview URLs by Vercel.
            See: P1 Foundation, F5, Apr 27 2026. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}