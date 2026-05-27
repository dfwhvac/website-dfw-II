'use client'

import { useEffect, useRef } from 'react'
import { useLazyScript } from '../hooks/useLazyScript'

const REALWORK_ID = process.env.NEXT_PUBLIC_REALWORK_ID || ''

/**
 * RealWork project map widget (Tier 3).
 *
 * loader.js loads only after the first user interaction (scroll, touch, etc.),
 * so initial /recent-projects visits pay zero RealWork TBT until engagement.
 */
const RealWorkWidget = () => {
  const containerRef = useRef(null)
  const scriptLoadedRef = useRef(false)
  const shouldLoad = useLazyScript({
    enabled: Boolean(REALWORK_ID),
    trigger: 'interaction',
  })

  useEffect(() => {
    if (!shouldLoad || scriptLoadedRef.current) return
    scriptLoadedRef.current = true

    // Create the output container if it doesn't exist
    if (containerRef.current && !document.getElementById('rwl-output')) {
      const outputDiv = document.createElement('div')
      outputDiv.id = 'rwl-output'
      containerRef.current.appendChild(outputDiv)
    }

    // Add event listener for when the plugin is ready
    const handlePluginReady = () => {
      if (window.rwlPlugin) {
        window.rwlPlugin.init('https://app.realworklabs.com', REALWORK_ID)
      }
    }

    window.addEventListener('rwlPluginReady', handlePluginReady, false)

    // Load the RealWork script
    const script = document.createElement('script')
    script.src = 'https://app.realworklabs.com/static/plugin/loader.js?v=' + new Date().getTime()
    script.async = true
    document.body.appendChild(script)

    // Cleanup
    return () => {
      window.removeEventListener('rwlPluginReady', handlePluginReady)
      // Note: We don't remove the script on cleanup to avoid issues with re-mounting
    }
  }, [shouldLoad])

  return (
    <div 
      ref={containerRef}
      className="realwork-widget-container min-h-[600px]"
      data-testid="realwork-widget"
    >
      {/* The rwl-output div will be created here by the useEffect */}
      <div id="rwl-output"></div>
    </div>
  )
}

export default RealWorkWidget
