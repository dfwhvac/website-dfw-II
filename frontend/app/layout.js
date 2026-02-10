import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '../components/ui/sonner'
import { createMetadata } from '../lib/metadata'
import ColorProvider from '../components/ColorProvider'
import { getBrandColors } from '../lib/sanity'

const inter = Inter({ subsets: ['latin'] })

export const metadata = createMetadata({
  title: 'DFW HVAC - Dallas-Fort Worth\'s Trusted HVAC Experts',
  description: 'Expert HVAC service with integrity and care. Three generations of trusted heating & cooling service in Dallas-Fort Worth. Call (972) 777-COOL.',
})

export default async function RootLayout({ children }) {
  const brandColors = await getBrandColors()
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorProvider brandColors={brandColors}>
          {children}
        </ColorProvider>
        <Toaster />
      </body>
    </html>
  )
}