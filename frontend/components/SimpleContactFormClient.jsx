'use client'

import dynamic from 'next/dynamic'
import SimpleContactFormSkeleton from './SimpleContactFormSkeleton'

// Same deferral pattern as LeadFormClient — keeps `/contact` desktop first paint light.
const SimpleContactForm = dynamic(() => import('./SimpleContactForm'), {
  ssr: false,
  loading: () => <SimpleContactFormSkeleton />,
})

export default function SimpleContactFormClient(props) {
  return <SimpleContactForm {...props} />
}
