'use client'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
let loadStarted = false

/**
 * Injects the Google reCAPTCHA v3 script into the DOM exactly once, on demand.
 *
 * Strategy: forms call this on first `onFocus` of any field instead of loading
 * reCAPTCHA on every page mount. Users who land on a form page but bounce
 * without interacting never pay the ~600–1,000ms TBT cost that reCAPTCHA's
 * bootup imposes. Same trade-off we already apply to Google Maps (onFocus gate
 * in AddressAutocomplete).
 *
 * Idempotent: subsequent calls are no-ops. Safe to attach to `<form onFocus>`
 * because focus events bubble from every child input.
 *
 * Graceful fallback: form submit handlers check `window.grecaptcha` before
 * calling `.execute()`. If a fast user submits before the script finishes
 * loading, the request proceeds without a token; /api/leads handles
 * `recaptcha.skipped` and falls back to IP rate limiting.
 */
export function loadRecaptchaOnce() {
  if (loadStarted) return
  if (!RECAPTCHA_SITE_KEY) return
  if (typeof window === 'undefined') return
  loadStarted = true
  const script = document.createElement('script')
  script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
  script.async = true
  script.defer = true
  document.body.appendChild(script)
}

// Default export retained so existing imports keep working but render nothing.
// Call loadRecaptchaOnce() from an onFocus handler instead of rendering this.
export default function RecaptchaScript() {
  return null
}
