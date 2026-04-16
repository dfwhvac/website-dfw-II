import Script from 'next/script'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '../components/ui/sonner'
import { defaultMetadata } from '../lib/metadata'
import ColorProvider from '../components/ColorProvider'
import { getBrandColors } from '../lib/sanity'
import StickyMobileCTA from '../components/StickyMobileCTA'

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
        <StickyMobileCTA 
          phone="(972) 777-COOL"
          phoneNumber="+19727772665"
          ctaText="Call Now for Service"
        />
      </body>
    </html>
  )
}