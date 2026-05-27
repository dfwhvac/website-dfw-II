'use client'

import { useEffect, useState } from 'react'

const INTERACTION_EVENTS = ['touchstart', 'scroll', 'mousemove', 'keydown', 'pointerdown']

/**
 * Delays third-party script work until after the critical rendering window.
 *
 * @param {'interaction' | 'idle' | 'immediate'} [options.trigger]
 *   - interaction: first user gesture (Tier 3 — chat, heavy widgets)
 *   - idle: requestIdleCallback or timeout fallback (Tier 2 alternative)
 *   - immediate: resolve on mount (escape hatch)
 * @param {boolean} [options.enabled] — set false to noop
 * @param {number} [options.idleTimeoutMs] — max wait when trigger is idle
 */
export function useLazyScript({
  enabled = true,
  trigger = 'interaction',
  idleTimeoutMs = 3500,
} = {}) {
  const [ready, setReady] = useState(trigger === 'immediate')

  useEffect(() => {
    if (!enabled || ready) return

    let cancelled = false
    const activate = () => {
      if (!cancelled) setReady(true)
    }

    if (trigger === 'immediate') {
      activate()
      return
    }

    if (trigger === 'idle') {
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(activate, { timeout: idleTimeoutMs })
        return () => {
          cancelled = true
          window.cancelIdleCallback(id)
        }
      }
      const t = window.setTimeout(activate, idleTimeoutMs)
      return () => {
        cancelled = true
        window.clearTimeout(t)
      }
    }

    // interaction — zero main-thread third-party cost until engagement
    const opts = { capture: true, passive: true, once: true }
    for (const event of INTERACTION_EVENTS) {
      window.addEventListener(event, activate, opts)
    }

    return () => {
      cancelled = true
      for (const event of INTERACTION_EVENTS) {
        window.removeEventListener(event, activate, { capture: true })
      }
    }
  }, [enabled, ready, trigger, idleTimeoutMs])

  return ready
}
