'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Phone } from 'lucide-react'

/**
 * Phone-First CTA Component
 * Consistent CTA pattern across all pages:
 * 1. Call Now (RED, click-to-call) - Primary
 * 2. Request Service (outline, links to contact) - Secondary
 * 3. Subtle estimate link - Tertiary
 */
const ServiceFirstCTA = ({ 
  title = "Need HVAC Service? We're Ready.",
  description = "Fast, reliable service from technicians you can trust.",
  phone = "(972) 777-COOL",
  variant = "blue", // "blue" | "red" | "dark"
  showEstimateLink = true,
  className = "",
}) => {

  const bgStyles = {
    blue: "bg-gradient-to-r from-prussian-blue to-electric-blue",
    red: "bg-vivid-red",
    dark: "bg-prussian-blue",
  }

  const primaryBtnStyles = {
    blue: "bg-vivid-red hover:bg-red-700 text-white",
    red: "bg-white text-vivid-red hover:bg-gray-100",
    dark: "bg-vivid-red hover:bg-red-700 text-white",
  }

  const secondaryBtnStyles = {
    blue: "border-2 border-white text-white hover:bg-white hover:text-prussian-blue",
    red: "border-2 border-white text-white hover:bg-white hover:text-vivid-red",
    dark: "border-2 border-white text-white hover:bg-white hover:text-prussian-blue",
  }

  const linkStyles = {
    blue: "text-white/70 hover:text-white",
    red: "text-white/70 hover:text-white",
    dark: "text-blue-200/70 hover:text-blue-100",
  }

  return (
    <section className={`py-16 ${bgStyles[variant]} text-white ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className={`text-xl mb-8 max-w-2xl mx-auto ${variant === 'red' ? 'text-red-100' : 'text-white/90'}`}>
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className={`${primaryBtnStyles[variant]} font-semibold`}
            asChild
          >
            <a href="tel:+19727772665">
              <Phone className="w-5 h-5 mr-2" />
              Call {phone}
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className={`${secondaryBtnStyles[variant]} font-semibold`}
            asChild
          >
            <Link href="/request-service">
              Request Service
            </Link>
          </Button>
        </div>
        
        {showEstimateLink && (
          <p className={`mt-6 text-sm ${linkStyles[variant]}`}>
            Considering a system upgrade?{' '}
            <Link href="/estimate" className="text-white underline hover:text-white/90">
              Get a Free Estimate →
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

export default ServiceFirstCTA
