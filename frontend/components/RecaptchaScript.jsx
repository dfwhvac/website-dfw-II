'use client'

import Script from 'next/script'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

/**
 * Loads the Google reCAPTCHA v3 script lazily.
 *
 * Strategy: include this component only inside form components (LeadForm,
 * SimpleContactForm). Pages without forms never load the reCAPTCHA script,
 * and pages WITH forms defer the load until after the page is interactive.
 *
 * Same id across instances so next/script dedupes when multiple forms appear
 * on the same page (e.g., a service detail page embedding LeadForm twice).
 *
 * Graceful fallback: form submit handlers check `window.grecaptcha` before
 * calling `.execute()` — if the script hasn't finished loading yet (fast user,
 * slow network), the request proceeds without a token. The /api/leads endpoint
 * already handles `recaptcha.skipped` and falls back to IP rate limiting.
 */
export default function RecaptchaScript() {
  if (!RECAPTCHA_SITE_KEY) return null
  return (
    <Script
      id="recaptcha-v3"
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="lazyOnload"
    />
  )
}
