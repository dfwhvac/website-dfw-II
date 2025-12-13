import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { createMetadata } from '../lib/metadata'

const inter = Inter({ subsets: ['latin'] })

export const metadata = createMetadata({
  title: 'DFW HVAC - Dallas-Fort Worth\'s Trusted HVAC Experts',
  description: 'Family owned Air Conditioning and Heating contractor serving Dallas - Fort Worth and surrounding areas since 1974. Professional HVAC service with 5.0 Google rating.',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}