'use client'

import { sendGAEvent } from '@next/third-parties/google'

/**
 * Fire a GA4 custom event via @next/third-parties (requires <GoogleAnalytics /> in layout).
 * No-ops safely when the tag is not loaded (local dev, Vercel preview).
 */
export function trackEvent(eventName, params = {}) {
  if (!eventName || typeof window === 'undefined') return
  try {
    sendGAEvent('event', eventName, params)
  } catch {
    // GoogleAnalytics not mounted
  }
}
