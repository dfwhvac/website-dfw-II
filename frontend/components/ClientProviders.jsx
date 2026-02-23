'use client'

import { RequestServiceModalProvider } from './RequestServiceModal'

export default function ClientProviders({ children }) {
  return (
    <RequestServiceModalProvider>
      {children}
    </RequestServiceModalProvider>
  )
}
