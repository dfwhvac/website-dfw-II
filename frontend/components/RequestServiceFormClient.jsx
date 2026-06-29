'use client'

import dynamic from 'next/dynamic'
import LeadFormSkeleton from './LeadFormSkeleton'

// LeadForm pulls Radix Select, AddressAutocomplete, sonner, and reCAPTCHA hooks.
// Deferring it from the /request-service first-load bundle keeps the hero as LCP
// on desktop (Speed Insights RES was 55 vs homepage 99).
const LeadForm = dynamic(() => import('./LeadForm'), {
  ssr: false,
  loading: () => <LeadFormSkeleton />,
})

export default function RequestServiceFormClient(props) {
  return <LeadForm {...props} embedded />
}
