'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

// Default footer sections (used as fallback when Sanity data not available)
const defaultFooterSections = [
  {
    title: 'Our Services',
    links: [
      { label: 'Air Conditioning', href: '/services/residential/air-conditioning' },
      { label: 'Heating Systems', href: '/services/residential/heating' },
      { label: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance' },
      { label: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality' },
      { label: 'Commercial HVAC', href: '/services/commercial/commercial-air-conditioning' },
    ]
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Customer Reviews', href: '/reviews' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Financing Options', href: '/financing' },
      { label: 'Cities Served', href: '/cities-served' },
      { label: 'FAQ', href: '/faq' },
    ]
  }
]

const defaultSocialLinks = [
  { platform: 'facebook', url: '#' },
  { platform: 'instagram', url: '#' },
  { platform: 'twitter', url: '#' },
]

// Social icon mapper
const SocialIcon = ({ platform, className }) => {
  const icons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    google: MapPin, // Using MapPin as placeholder for Google Business
    yelp: MapPin, // Using MapPin as placeholder for Yelp
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
  const footerSections = siteSettings?.footerSections || defaultFooterSections
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
    monday: '9am - 6pm',
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
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={social.platform || index}
                  href={social.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-electric-blue transition-colors"
                >
                  <SocialIcon platform={social.platform} className="w-8 h-8" />
                </a>
              ))}
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
                <div>
                  <div className="font-semibold underline underline-offset-2 decoration-gray-500">{phoneDisplay}</div>
                  <div className="text-gray-400 text-xs">(972) 777-2665</div>
                </div>
              </a>
              <a href="/contact" className="flex items-center gap-3 text-sm text-white underline underline-offset-2 decoration-gray-500 hover:decoration-white transition-colors">
                <Mail className="w-4 h-4 text-electric-blue" />
                <span>Send Us a Message</span>
              </a>
              {showServiceAreas && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-lime-green" />
                  <span className="text-gray-300">{address}</span>
                </div>
              )}
              {showBusinessHours && businessHours && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-yellow-500" />
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
