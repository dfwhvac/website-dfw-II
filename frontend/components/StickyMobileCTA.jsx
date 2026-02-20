'use client'

import React, { useState, useEffect } from 'react'
import { Phone, X } from 'lucide-react'

/**
 * Sticky Mobile CTA Bar
 * 
 * Phone-first conversion component that appears on mobile devices.
 * - Shows at bottom of screen on mobile only (hidden on desktop)
 * - Click-to-call functionality
 * - Can be dismissed by user (persists in session)
 * - Respects scroll position to avoid interfering with reading
 */
const StickyMobileCTA = ({ 
  phone = "(972) 777-COOL",
  phoneNumber = "+19727772665",
  ctaText = "Call Now for Service",
  showAfterScroll = 100, // Show after scrolling this many pixels
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user previously dismissed the bar in this session
    const dismissed = sessionStorage.getItem('stickyCtaDismissed')
    if (dismissed === 'true') {
      setIsDismissed(true)
      return
    }

    const handleScroll = () => {
      // Show after user scrolls past threshold
      if (window.scrollY > showAfterScroll) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('stickyCtaDismissed', 'true')
  }

  // Don't render on server or if dismissed
  if (isDismissed) return null

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        lg:hidden
        transform transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      data-testid="sticky-mobile-cta"
    >
      {/* Main CTA Bar */}
      <div className="bg-[#FF0000] shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Call Button - Takes most of the space */}
          <a
            href={`tel:${phoneNumber}`}
            className="flex-1 flex items-center justify-center gap-3 text-white font-bold text-lg"
            data-testid="sticky-cta-call-btn"
          >
            <Phone className="w-6 h-6 animate-pulse" />
            <span>{ctaText}</span>
          </a>
          
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="ml-3 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss"
            data-testid="sticky-cta-dismiss-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Phone Number Display */}
        <div className="bg-[#CC0000] text-white/90 text-center text-sm py-1 font-medium">
          {phone}
        </div>
      </div>
      
      {/* Safe area padding for devices with home indicator */}
      <div className="bg-[#CC0000] h-safe-area-inset-bottom" />
    </div>
  )
}

export default StickyMobileCTA
