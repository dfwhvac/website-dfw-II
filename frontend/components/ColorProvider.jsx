'use client'

import { useEffect } from 'react'

// Default brand colors (fallback when Sanity data unavailable)
const defaultColors = {
  prussianBlue: { hex: '#003153' },
  electricBlue: { hex: '#00B8FF' },
  vividRed: { hex: '#FF0606' },
  limeGreen: { hex: '#00FF00' },
  goldAmber: { hex: '#F77F00' },
  charcoal: { hex: '#2D3748' },
  lightGray: { hex: '#F7FAFC' },
  white: { hex: '#FFFFFF' },
}

export default function ColorProvider({ brandColors, children }) {
  const colors = brandColors || defaultColors

  useEffect(() => {
    // Apply CSS variables to document root
    const root = document.documentElement
    
    if (colors.prussianBlue?.hex) {
      root.style.setProperty('--prussian-blue', colors.prussianBlue.hex)
    }
    if (colors.electricBlue?.hex) {
      root.style.setProperty('--electric-blue', colors.electricBlue.hex)
    }
    if (colors.vividRed?.hex) {
      root.style.setProperty('--vivid-red', colors.vividRed.hex)
    }
    if (colors.limeGreen?.hex) {
      root.style.setProperty('--lime-green', colors.limeGreen.hex)
    }
    if (colors.goldAmber?.hex) {
      root.style.setProperty('--gold-amber', colors.goldAmber.hex)
    }
    if (colors.charcoal?.hex) {
      root.style.setProperty('--charcoal', colors.charcoal.hex)
    }
    if (colors.lightGray?.hex) {
      root.style.setProperty('--light-gray', colors.lightGray.hex)
    }
    if (colors.white?.hex) {
      root.style.setProperty('--white', colors.white.hex)
    }
  }, [colors])

  return <>{children}</>
}
