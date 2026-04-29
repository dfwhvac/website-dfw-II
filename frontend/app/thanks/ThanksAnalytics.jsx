'use client'

import { useEffect } from 'react'

/**
 * ThanksAnalytics — fires a GA4 `thanks_page_view` event once the post-submit
 * confirmation page has hydrated. Used as a Google Ads / GA4 conversion
 * signal complementing `form_submit_lead` (which fires from the form itself).
 * Having both lets us reconcile in case the form-side event drops on a slow
 * network — the redirect to /thanks is the durable conversion proof.
 *
 * Added Feb 2026 (P1.11).
 */
export default function ThanksAnalytics({ leadType }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof window.gtag !== 'function') return
    try {
      window.gtag('event', 'thanks_page_view', {
        lead_type: leadType || 'service',
        page_path: '/thanks',
      })
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('thanks_page_view tracking failed:', err)
      }
    }
  }, [leadType])

  return null
}
