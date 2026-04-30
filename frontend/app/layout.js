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

const inter = Inter({ subsets: ['latin'] })

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
        {/* GA4 preview-env guard (Apr 24, 2026). Uses Google's official opt-out
            flag window['ga-disable-<ID>'] = true to mute hits on Vercel preview
            URLs, localhost, and any non-production host. Runs inline (beforeInteractive)
            so it's set BEFORE the gtag script evaluates its config call.
            Production host allow-list is kept narrow on purpose. */}
        <Script id="ga-preview-guard" strategy="beforeInteractive">
          {`(function(){try{var h=location.hostname;var ok=(h==='www.dfwhvac.com'||h==='dfwhvac.com');if(!ok){window['ga-disable-${GA_ID}']=true;}}catch(e){}})();`}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');`}
        </Script>
        {/* Microsoft Clarity heatmaps + session recordings (Phase 3 P3.D-C1, Feb 28, 2026).
            Production-only via hostname allow-list — same pattern as ga-preview-guard above.
            FREE forever (Microsoft Advertising funds it). GDPR/CCPA-compliant out of the box,
            anonymized PII automatically masked. afterInteractive strategy mirrors GA4 so we
            capture the same session window across both tools. Used to capture pre-P1.10
            (progressive form redesign) baseline of where users click, scroll, and abandon. */}
        <Script id="ms-clarity" strategy="afterInteractive">
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