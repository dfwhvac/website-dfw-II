'use client'

import LeadFormClient from './LeadFormClient'

// Thin wrapper so /request-service keeps embedded layout props.
export default function RequestServiceFormClient(props) {
  return <LeadFormClient {...props} embedded />
}
