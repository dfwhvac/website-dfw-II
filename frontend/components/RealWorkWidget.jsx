'use client'

import { useEffect, useRef } from 'react'

/**
 * RealWork Widget Component
 * 
 * Embeds the RealWork project map widget showing completed HVAC jobs across DFW.
 * This is a third-party widget that displays an interactive map with job locations,
 * filters, and project photos.
 */
const RealWorkWidget = () => {
  const containerRef = useRef(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (scriptLoadedRef.current) return
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
        window.rwlPlugin.init('https://app.realworklabs.com', 'mTNPdsX-K4WXweP6')
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
  }, [])

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
