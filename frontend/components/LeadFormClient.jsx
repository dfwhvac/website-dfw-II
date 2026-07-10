'use client'

import dynamic from 'next/dynamic'
import LeadFormSkeleton from './LeadFormSkeleton'

// LeadForm pulls Radix Select, AddressAutocomplete, sonner, and reCAPTCHA hooks.
// Defer past first paint so the hero H1 stays the LCP candidate and first-load JS
// stays smaller (desktop Speed Insights RES drag on `/` and `/contact`).
const LeadForm = dynamic(() => import('./LeadForm'), {
  ssr: false,
  loading: () => <LeadFormSkeleton />,
})

export default function LeadFormClient(props) {
  return <LeadForm {...props} />
}
