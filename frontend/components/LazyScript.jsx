'use client'

import Script from 'next/script'
import { useLazyScript } from '../hooks/useLazyScript'

/**
 * Injects a Next.js <Script> only after the chosen deferral trigger fires.
 * Use for Tier 3 widgets (maps plugins, live chat) via trigger="interaction".
 */
export default function LazyScript({
  src,
  id,
  strategy = 'lazyOnload',
  trigger = 'interaction',
  enabled = true,
  onReady,
  children,
  ...scriptProps
}) {
  const ready = useLazyScript({ enabled, trigger })

  if (!enabled || !ready) return null

  if (children) {
    return (
      <Script id={id} strategy={strategy} onReady={onReady} {...scriptProps}>
        {children}
      </Script>
    )
  }

  if (!src) return null

  return (
    <Script
      id={id}
      src={src}
      strategy={strategy}
      onReady={onReady}
      {...scriptProps}
    />
  )
}
