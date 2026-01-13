'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'

// Default navigation data (used as fallback when Sanity data not available)
const defaultNavigation = [
  { label: 'Home', href: '/', isDropdown: false, isVisible: true },
  { 
    label: 'Residential Services', 
    href: '/services/residential', 
    isDropdown: true, 
    isVisible: true,
    dropdownItems: [
      { label: 'Air Conditioning', href: '/services/residential/air-conditioning' },
      { label: 'Heating', href: '/services/residential/heating' },
      { label: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance' },
      { label: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality' },
    ]
  },
  { 
    label: 'Commercial Services', 
    href: '/services/commercial', 
    isDropdown: true, 
    isVisible: true,
    dropdownItems: [
      { label: 'Commercial AC', href: '/services/commercial/commercial-air-conditioning' },
      { label: 'Commercial Heating', href: '/services/commercial/commercial-heating' },
      { label: 'Commercial Maintenance', href: '/services/commercial/commercial-maintenance' },
    ]
  },
  { label: 'Cities Served', href: '/cities-served', isDropdown: false, isVisible: true },
  { label: 'About', href: '/about', isDropdown: false, isVisible: true },
  { label: 'Reviews', href: '/reviews', isDropdown: false, isVisible: true },
  { label: 'Contact', href: '/contact', isDropdown: false, isVisible: true },
]

const defaultCtaButtons = [
  { label: 'Get Estimate', href: '/contact', variant: 'outline' },
  { label: 'Book Service', href: '/book-service', variant: 'primary' },
]

// Custom dropdown component with proper alignment
const NavDropdown = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:text-electric-blue transition-colors"
      >
        {item.label}
        <ChevronDown 
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 top-full mt-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-full">
          <div className="py-2">
            {item.dropdownItems?.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Header = ({ companyInfo = {}, siteSettings = null }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const phone = companyInfo?.phone || '(972) 777-COOL'
  
  // Use Sanity data if available, otherwise use defaults
  const headerTagline = siteSettings?.headerTagline || 'Serving Dallas-Fort Worth Since 1974'
  const headerCtaText = siteSettings?.headerCtaText || 'Call Now'
  const showHeaderTagline = siteSettings?.showHeaderTagline !== false
  const navigation = siteSettings?.mainNavigation?.filter(item => item.isVisible !== false) || defaultNavigation
  const ctaButtons = siteSettings?.ctaButtons || defaultCtaButtons

  return (
    <header className="bg-white shadow-lg border-b-2 border-electric-blue sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        {showHeaderTagline && (
          <div className="flex justify-between items-center py-2 text-sm border-b border-gray-200">
            <div className="text-gray-600">
              {headerTagline}
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:+19727772665" className="flex items-center gap-2 text-vivid-red font-semibold hover:underline">
                <Phone className="w-4 h-4" />
                <span>{phone}</span>
              </a>
              <Button 
                size="sm" 
                className="bg-vivid-red hover:bg-vivid-red text-white"
                asChild
              >
                <a href="tel:+19727772665">
                  {headerCtaText}
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="DFW HVAC Logo" 
              width={60} 
              height={60}
              className="rounded-lg"
            />
            <div>
              <div className="text-xl font-bold text-gray-800">DFW HVAC</div>
              <div className="text-sm text-gray-600">Family Owned Since 1974</div>
            </div>
          </Link>

          {/* Desktop Navigation - excludes "Home" (logo serves as home link) */}
          <nav className="hidden lg:flex items-center">
            {navigation
              .filter(item => item.label !== 'Home')
              .map((item, index) => (
              <div key={item.href || index}>
                {item.isDropdown && item.dropdownItems?.length > 0 ? (
                  <NavDropdown item={item} />
                ) : (
                  <Link 
                    href={item.href} 
                    className="px-4 py-2 text-sm font-medium hover:text-electric-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {ctaButtons.map((btn, index) => (
              <Button 
                key={btn.href || index}
                variant={btn.variant === 'outline' ? 'outline' : 'default'}
                className={btn.variant !== 'outline' ? 'bg-electric-blue hover:bg-electric-blue text-white' : ''}
                asChild
              >
                <Link href={btn.href}>{btn.label}</Link>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item, index) => (
              <div key={item.href || index}>
                {item.isDropdown && item.dropdownItems?.length > 0 ? (
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-800">{item.label}</div>
                    {item.dropdownItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block pl-4 py-1 text-gray-600 hover:text-electric-blue text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="block py-2 text-gray-700 hover:text-electric-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 space-y-2">
              {ctaButtons.map((btn, index) => (
                <Button 
                  key={btn.href || index}
                  variant={btn.variant === 'outline' ? 'outline' : 'default'}
                  className={`w-full ${btn.variant !== 'outline' ? 'bg-electric-blue hover:bg-electric-blue text-white' : ''}`}
                  asChild
                >
                  <Link href={btn.href}>{btn.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
