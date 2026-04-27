'use client'

import dynamic from 'next/dynamic'

// Embla-carousel-react is ~30 kB. Carousel renders below-the-fold on homepage
// and other templates, so SSR gives no LCP benefit. ssr:false here truly removes
// it from the First Load JS bundle — Next.js fetches it after hydration on demand.
const TestimonialCarousel = dynamic(() => import('./TestimonialCarousel'), {
  ssr: false,
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
})

export default function TestimonialCarouselClient(props) {
  return <TestimonialCarousel {...props} />
}
