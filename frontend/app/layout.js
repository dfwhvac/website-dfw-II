import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '../components/ui/sonner'
import { defaultMetadata } from '../lib/metadata'
import ColorProvider from '../components/ColorProvider'
import { getBrandColors } from '../lib/sanity'
import StickyMobileCTA from '../components/StickyMobileCTA'
import PhoneClickTracker from '../components/PhoneClickTracker'

const GA_ID = 'G-5MX2NE7C73'

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
      </head>
      <body className={inter.className}>
        <ColorProvider brandColors={brandColors}>
          {children}
        </ColorProvider>
        <Toaster />
        <PhoneClickTracker />
        <StickyMobileCTA 
          phone="(972) 777-COOL"
          phoneNumber="+19727772665"
          ctaText="Call Now for Service"
        />
      </body>
    </html>
  )
}