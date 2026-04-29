'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react'

// Inline Google "G" logo SVG. Lucide-react doesn't ship brand logos for
// licensing reasons, so we keep this minimal inline component (~700 bytes,
// no extra HTTP request). Google's brand guidelines explicitly permit using
// the G logo to link to one's own Google Business Profile.
const GoogleG = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M21.35 11.1H12v3.2h5.35c-.25 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.66-5.85-5.95S8.78 6.8 12 6.8c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.74 4.27 14.55 3.3 12 3.3 6.92 3.3 2.8 7.42 2.8 12.5S6.92 21.7 12 21.7c6.93 0 9.5-4.85 9.5-7.39 0-.5-.05-.88-.15-1.21z" />
  </svg>
)

// Default footer sections (used as fallback when Sanity data not available)
const defaultFooterSections = [
  {
    title: 'Our Services',
    links: [
      { label: 'Air Conditioning', href: '/services/residential/air-conditioning' },
      { label: 'Heating Systems', href: '/services/residential/heating' },
      { label: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance' },
      { label: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality' },
      { label: 'System Replacement', href: '/services/system-replacement' },
      { label: 'Commercial HVAC', href: '/services/commercial/commercial-air-conditioning' },
    ]
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about' },
      // NOTE: Recent Projects temporarily removed - redirects to /reviews
      // Re-add when static Showcase Projects page is built (see PRD.md)
      { label: 'Customer Reviews', href: '/reviews' },
      { label: 'Cities Served', href: '/cities-served' },
      { label: 'Repair or Replace?', href: '/repair-or-replace' },
      { label: 'Financing', href: '/financing' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ]
  }
]

// Social row order: Facebook → LinkedIn → Google. URLs are placeholders
// pending owner provisioning (see ROADMAP S-FOOTER-1). Once URLs are pasted
// in here (or set in Sanity siteSettings.socialLinks), the icons go live.
const defaultSocialLinks = [
  { platform: 'facebook', url: '#' },
  { platform: 'linkedin', url: '#' },
  { platform: 'google', url: '#' },
]

// Social icon mapper
const SocialIcon = ({ platform, className }) => {
  const icons = {
    facebook: Facebook,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    google: GoogleG,
  }
  const Icon = icons[platform] || Facebook
  return <Icon className={className} />
}

const Footer = ({ companyInfo = {}, siteSettings = null }) => {
  const currentYear = new Date().getFullYear()
  
  // Use Sanity data if available, otherwise use defaults
  const footerTagline = siteSettings?.footerTagline || 
    'Expert HVAC service with integrity and care. A three-generation family commitment to quality workmanship in Dallas-Fort Worth.'
  const logoTagline = siteSettings?.logoTagline || 'Three Generations of Trusted Service'
  let footerSections = siteSettings?.footerSections || defaultFooterSections
  
  // Ensure "Cities Served" and "Request Service" are in Quick Links section
  footerSections = footerSections.map(section => {
    if (section.title === 'Quick Links') {
      let links = [...(section.links || [])]
      
      // Add Cities Served if missing
      if (!links.some(link => link.href === '/cities-served')) {
        links.push({ label: 'Cities Served', href: '/cities-served' })
      }
      
      // Add Request Service if missing
      if (!links.some(link => link.href === '/request-service')) {
        links.push({ label: 'Request Service', href: '/request-service' })
      }
      
      return { ...section, links }
    }
    return section
  })
  
  const socialLinks = siteSettings?.socialLinks || defaultSocialLinks
  const copyrightText = (siteSettings?.copyrightText || '© {year} DFW HVAC. All rights reserved.')
    .replace('{year}', currentYear)
  const showServiceAreas = siteSettings?.showServiceAreas !== false
  const showBusinessHours = siteSettings?.showBusinessHours !== false

  // Default company info fallbacks
  const phoneVanity = companyInfo?.phone || '(972) 777-COOL'
  const phoneDigits = companyInfo?.phoneDisplay || '(972) 777-2665'
  const address = companyInfo?.address || 'Dallas-Fort Worth Area'
  const businessHours = companyInfo?.businessHours || {
    monday: '7AM-6PM',
    saturday: 'Closed',
    sunday: 'Closed'
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="DFW HVAC Logo" 
                width={60} 
                height={60}
                className="rounded-lg"
                style={{ clipPath: 'inset(1px)' }}
              />
              <div>
                <div className="text-lg font-bold">DFW HVAC</div>
                <div className="text-sm text-gray-400">{logoTagline}</div>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {footerTagline}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const platformName = social.platform
                  ? social.platform.charAt(0).toUpperCase() + social.platform.slice(1)
                  : 'Social media'
                return (
                  <a
                    key={social.platform || index}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`DFW HVAC on ${platformName}`}
                    data-testid={`footer-social-${social.platform || 'link'}`}
                    className="w-9 h-9 rounded-full bg-white text-prussian-blue hover:bg-electric-blue hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <SocialIcon platform={social.platform} className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Dynamic Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={section.title || index} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-2 text-sm">
                {section.links?.map((link, linkIndex) => (
                  <li key={link.href || linkIndex}>
                    <Link 
                      href={link.href || '#'} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <a href="tel:+19727772665" className="flex items-center gap-3 text-sm text-white hover:decoration-white transition-colors">
                <Phone className="w-4 h-4 text-vivid-red" />
                <div className="font-semibold underline underline-offset-2 decoration-gray-500">{phoneDigits}</div>
              </a>
              <a href="/contact" className="flex items-center gap-3 text-sm text-white underline underline-offset-2 decoration-gray-500 hover:decoration-white transition-colors">
                <Mail className="w-4 h-4 text-vivid-red" />
                <span>Send Us a Message</span>
              </a>
              {showServiceAreas && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-alert-amber" />
                  <span className="text-gray-300">{address}</span>
                </div>
              )}
              {showBusinessHours && businessHours && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-alert-amber" />
                  <div className="text-gray-300">
                    <div>Mon-Fri: {businessHours.monday}</div>
                    <div>Sat-Sun: Closed</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            {copyrightText}
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
