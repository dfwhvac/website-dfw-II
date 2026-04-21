'use client'

import { useEffect } from 'react'

/**
 * PhoneClickTracker — global GA4 event tracker for `tel:` link clicks.
 *
 * Mounted once in the root layout. Uses a single document-level click listener
 * (event delegation) so every `<a href="tel:...">` across the site gets tracked
 * without touching each component. Zero impact on TBT (listener attaches after
 * hydration; handler body is trivial).
 *
 * Fires GA4 event: `phone_click`
 *   Params:
 *     - phone_number: the normalized phone number (digits only)
 *     - link_text:    the anchor's visible text (trimmed, first 80 chars)
 *     - page_path:    current pathname
 *
 * Added: Apr 21, 2026 (PR #2, P1.7) — baseline for Google Ads launch in ~12 weeks.
 */
export default function PhoneClickTracker() {
  useEffect(() => {
    const handler = (event) => {
      const anchor = event.target?.closest?.('a[href^="tel:"]')
      if (!anchor) return
      if (typeof window.gtag !== 'function') return

      const rawHref = anchor.getAttribute('href') || ''
      const phoneNumber = rawHref.replace(/^tel:/i, '').replace(/\D/g, '')
      const linkText = (anchor.textContent || '').trim().slice(0, 80)

      try {
        window.gtag('event', 'phone_click', {
          phone_number: phoneNumber,
          link_text: linkText,
          page_path: window.location.pathname,
        })
      } catch (err) {
        // Swallow — tracking must never break user interaction
        if (process.env.NODE_ENV !== 'production') {
          console.warn('phone_click tracking failed:', err)
        }
      }
    }

    document.addEventListener('click', handler, { capture: true })
    return () => document.removeEventListener('click', handler, { capture: true })
  }, [])

  return null
}
