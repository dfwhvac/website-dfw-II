'use client'

import { useEffect, useRef, useState } from 'react'

const REALWORK_ID = process.env.NEXT_PUBLIC_REALWORK_ID || ''

/**
 * RealWork Widget Component
 * 
 * Embeds the RealWork project map widget showing completed HVAC jobs across DFW.
 * This is a third-party widget that displays an interactive map with job locations,
 * filters, and project photos.
 *
 * Performance: the 3rd-party script (loader.js) is loaded via IntersectionObserver
 * when the widget container enters the viewport. Saves ~200–400ms TBT for users
 * who land on /recent-projects but bounce before scrolling to the map.
 */
const RealWorkWidget = () => {
  const containerRef = useRef(null)
  const scriptLoadedRef = useRef(false)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Watch for the container entering the viewport; only then start loading.
  useEffect(() => {
    if (!containerRef.current || shouldLoad) return

    // Fallback for older browsers: just load on mount (matches pre-optimization behavior).
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // start loading ~200px before the widget scrolls into view
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [shouldLoad])

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
