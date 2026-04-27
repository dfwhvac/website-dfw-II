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
    sections: [
      {
        heading: 'Services',
        items: [
          { label: 'Air Conditioning', href: '/services/residential/air-conditioning' },
          { label: 'Heating', href: '/services/residential/heating' },
          { label: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance' },
          { label: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality' },
        ],
      },
      {
        heading: 'Planning to Replace?',
        items: [
          { label: 'System Replacement', href: '/services/system-replacement' },
          { label: 'Replacement Estimator', href: '/replacement-estimator' },
          { label: 'Repair or Replace?', href: '/repair-or-replace' },
          { label: 'Financing Options', href: '/financing' },
        ],
      },
    ],
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
    ],
  },
  { label: 'About', href: '/about', isDropdown: false, isVisible: true },
  { label: 'Reviews', href: '/reviews', isDropdown: false, isVisible: true },
  { label: 'Recent Projects', href: '/recent-projects', isDropdown: false, isVisible: true },
  { label: 'FAQ', href: '/faq', isDropdown: false, isVisible: true },
]

const defaultCtaButtons = [
  { label: 'Call Now', href: 'tel:+19727772665', variant: 'primary', isPhone: true },
  { label: 'Request Service', href: '/request-service', variant: 'outline' },
]

// Normalize an item to always expose a `sections` array for unified rendering
const getSections = (item) => {
  if (Array.isArray(item.sections) && item.sections.length > 0) return item.sections
  if (Array.isArray(item.dropdownItems) && item.dropdownItems.length > 0) {
    return [{ heading: null, items: item.dropdownItems }]
  }
  return []
}

// Custom dropdown component with proper alignment + section support
const NavDropdown = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const sections = getSections(item)
  const hasMultipleSections = sections.length > 1

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-testid={`nav-dropdown-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:text-electric-blue transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && sections.length > 0 && (
        <div
          className={`absolute left-0 top-full mt-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${
            hasMultipleSections ? 'min-w-[260px]' : 'min-w-full'
          }`}
        >
          <div className="py-2">
            {sections.map((section, sIdx) => (
              <div key={section.heading || `section-${sIdx}`}>
                {sIdx > 0 && <div className="my-2 border-t border-gray-100" aria-hidden="true" />}
                {section.heading && (
                  <div className="px-4 pt-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {section.heading}
                  </div>
                )}
                {section.items.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-electric-blue transition-colors whitespace-nowrap"
                    data-testid={`nav-link-${subItem.href.replace(/\//g, '-').replace(/^-/, '')}`}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
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
  const headerTagline = siteSettings?.headerTagline || 'Three Generations of Trusted HVAC Service in DFW'
  const headerCtaText = siteSettings?.headerCtaText || 'Call Now'
  const showHeaderTagline = siteSettings?.showHeaderTagline !== false
  const logoTagline = siteSettings?.logoTagline || 'Trust. Excellence. Care.'

  // Get base navigation from Sanity or defaults
  let navigation = siteSettings?.mainNavigation?.filter(item => item.isVisible !== false) || defaultNavigation

  // If Sanity didn't provide sections for Residential Services, splice in our default sections
  // so the new funnel pages always appear in the dropdown.
  navigation = navigation.map(item => {
    if (item.label === 'Residential Services') {
      const hasSections = Array.isArray(item.sections) && item.sections.length > 0
      if (!hasSections) {
        const fallback = defaultNavigation.find(n => n.label === 'Residential Services')
        if (fallback?.sections) {
          return { ...item, sections: fallback.sections, dropdownItems: undefined }
        }
      }
    }
    return item
  })

  // Remove "Cities Served" and "Contact" from header nav
  navigation = navigation.filter(item =>
    item.href !== '/cities-served' &&
    item.href !== '/contact'
  )

  // Phone-first CTA strategy: Call Now (red) → Request Service (outline)
  const ctaButtons = [
    { label: 'Call Now', href: 'tel:+19727772665', variant: 'primary', isPhone: true },
    { label: 'Request Service', href: '/request-service', variant: 'outline' },
  ]

  return (
    <header className="bg-white shadow-lg border-b-2 border-electric-blue sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Bar (hidden on mobile — redundant with StickyMobileCTA; see QA Sweep UX-1) */}
        {showHeaderTagline && (
          <div className="hidden sm:flex justify-between items-center py-2 text-sm border-b border-gray-200">
            <Link href="/about" className="text-gray-600 hover:text-electric-blue transition-colors">
              {headerTagline}
            </Link>
            <div className="flex items-center gap-4">
              <a href="tel:+19727772665" className="flex items-center gap-2 text-vivid-red font-semibold hover:underline">
                <Phone className="w-4 h-4" />
                <span>{phone} <span className="text-gray-600 font-normal text-xs">(2665)</span></span>
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
              <div className="text-sm text-gray-600">{logoTagline}</div>
            </div>
          </Link>

          {/* Desktop Navigation - excludes "Home" (logo serves as home link) */}
          <nav className="hidden lg:flex items-center">
            {navigation
              .filter(item => item.label !== 'Home')
              .map((item, index) => (
              <div key={item.href || index}>
                {item.isDropdown && (item.sections?.length > 0 || item.dropdownItems?.length > 0) ? (
                  <NavDropdown item={item} />
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center min-h-[44px] px-4 py-2 text-sm font-medium hover:text-electric-blue transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons - Phone-first strategy */}
          <div className="hidden lg:flex items-center gap-3">
            {ctaButtons.map((btn, index) => (
              btn.isPhone ? (
                <Button
                  key={btn.href || index}
                  className="bg-vivid-red hover:bg-red-700 text-white font-semibold"
                  asChild
                >
                  <a href={btn.href}>{btn.label}</a>
                </Button>
              ) : (
                <Button
                  key={btn.href || index}
                  variant="outlineBlue"
                  className="font-semibold"
                  asChild
                >
                  <Link href={btn.href}>{btn.label}</Link>
                </Button>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item, index) => {
              const sections = item.isDropdown ? getSections(item) : []
              if (item.isDropdown && sections.length > 0) {
                return (
                  <div key={item.href || index} className="space-y-3">
                    <div className="font-semibold text-gray-800">{item.label}</div>
                    {sections.map((section, sIdx) => (
                      <div key={section.heading || `m-section-${sIdx}`} className="space-y-1">
                        {section.heading && (
                          <div className="pl-4 pt-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            {section.heading}
                          </div>
                        )}
                        {section.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block pl-4 py-1 text-gray-600 hover:text-electric-blue text-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                            data-testid={`mobile-nav-link-${subItem.href.replace(/\//g, '-').replace(/^-/, '')}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              }
              return (
                <div key={item.href || index}>
                  <Link
                    href={item.href}
                    className="block py-2 text-gray-700 hover:text-electric-blue"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              )
            })}

            <div className="pt-4 space-y-2">
              {ctaButtons.map((btn, index) => (
                btn.isPhone ? (
                  <Button
                    key={btn.href || index}
                    className="w-full bg-vivid-red hover:bg-red-700 text-white font-semibold"
                    asChild
                  >
                    <a href={btn.href}>{btn.label}</a>
                  </Button>
                ) : (
                  <Button
                    key={btn.href || index}
                    variant="outlineBlue"
                    className="w-full font-semibold"
                    asChild
                  >
                    <Link href={btn.href}>{btn.label}</Link>
                  </Button>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
