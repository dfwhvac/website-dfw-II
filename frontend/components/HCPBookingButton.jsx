'use client'

import { Button } from './ui/button'

export function HCPBookingButton({ children, className, variant, size, asChild }) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => { if (typeof window !== 'undefined' && window.HCPWidget) window.HCPWidget.openModal() }}
    >
      {children}
    </Button>
  )
}

export function HCPBookingLink({ children, className }) {
  return (
    <button
      onClick={() => { if (typeof window !== 'undefined' && window.HCPWidget) window.HCPWidget.openModal() }}
      className={className}
    >
      {children}
    </button>
  )
}
