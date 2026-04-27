'use client'

import dynamic from 'next/dynamic'

// Mobile-only sticky CTA. ssr:false is allowed here in a client component,
// which lets Next.js split this out of the First Load JS bundle.
// The component itself is mobile-only (lg:hidden) and only visible after
// 100px scroll, so SSR provides no SEO/UX value here.
const StickyMobileCTA = dynamic(() => import('./StickyMobileCTA'), {
  ssr: false,
})

export default function StickyMobileCTAClient(props) {
  return <StickyMobileCTA {...props} />
}
