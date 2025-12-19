const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'iar2b790',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  title: 'Site Settings',
  
  // Header Settings
  headerTagline: 'Serving Dallas-Fort Worth Since 1974',
  headerCtaText: 'Call Now',
  showHeaderTagline: true,
  
  // Main Navigation
  mainNavigation: [
    { _key: 'nav1', label: 'Home', href: '/', isDropdown: false, isVisible: true, order: 1 },
    { 
      _key: 'nav2', 
      label: 'Residential Services', 
      href: '/services/residential', 
      isDropdown: true, 
      isVisible: true, 
      order: 2,
      dropdownItems: [
        { _key: 'res1', label: 'Air Conditioning', href: '/services/residential/air-conditioning' },
        { _key: 'res2', label: 'Heating', href: '/services/residential/heating' },
        { _key: 'res3', label: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance' },
        { _key: 'res4', label: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality' },
      ]
    },
    { 
      _key: 'nav3', 
      label: 'Commercial Services', 
      href: '/services/commercial', 
      isDropdown: true, 
      isVisible: true, 
      order: 3,
      dropdownItems: [
        { _key: 'com1', label: 'Commercial AC', href: '/services/commercial/air-conditioning' },
        { _key: 'com2', label: 'Commercial Heating', href: '/services/commercial/heating' },
        { _key: 'com3', label: 'Commercial Maintenance', href: '/services/commercial/maintenance' },
        { _key: 'com4', label: 'Commercial Air Quality', href: '/services/commercial/indoor-air-quality' },
      ]
    },
    { _key: 'nav4', label: 'About', href: '/about', isDropdown: false, isVisible: true, order: 4 },
    { _key: 'nav5', label: 'Reviews', href: '/reviews', isDropdown: false, isVisible: true, order: 5 },
    { _key: 'nav6', label: 'Contact', href: '/contact', isDropdown: false, isVisible: true, order: 6 },
  ],
  
  // CTA Buttons
  ctaButtons: [
    { _key: 'cta1', label: 'Get Estimate', href: '/contact', variant: 'outline', order: 1 },
    { _key: 'cta2', label: 'Book Service', href: '/book-service', variant: 'primary', order: 2 },
  ],
  
  // Footer Settings
  footerTagline: 'Trusted HVAC contractor serving Dallas-Fort Worth and surrounding areas for over 50 years. Quality service, reliable solutions.',
  
  footerSections: [
    {
      _key: 'section1',
      title: 'Our Services',
      order: 1,
      links: [
        { _key: 'svc1', label: 'Air Conditioning', href: '/services/residential/air-conditioning' },
        { _key: 'svc2', label: 'Heating Systems', href: '/services/residential/heating' },
        { _key: 'svc3', label: 'Preventative Maintenance', href: '/services/residential/preventative-maintenance' },
        { _key: 'svc4', label: 'Indoor Air Quality', href: '/services/residential/indoor-air-quality' },
        { _key: 'svc5', label: 'Commercial HVAC', href: '/services/commercial/air-conditioning' },
      ]
    },
    {
      _key: 'section2',
      title: 'Quick Links',
      order: 2,
      links: [
        { _key: 'ql1', label: 'About Us', href: '/about' },
        { _key: 'ql2', label: 'Customer Reviews', href: '/reviews' },
        { _key: 'ql3', label: 'Case Studies', href: '/case-studies' },
        { _key: 'ql4', label: 'Financing Options', href: '/financing' },
        { _key: 'ql5', label: 'Cities Served', href: '/cities-served' },
        { _key: 'ql6', label: 'FAQ', href: '/faq' },
      ]
    }
  ],
  
  socialLinks: [
    { _key: 'social1', platform: 'facebook', url: 'https://facebook.com/dfwhvac' },
    { _key: 'social2', platform: 'instagram', url: 'https://instagram.com/dfwhvac' },
    { _key: 'social3', platform: 'twitter', url: 'https://twitter.com/dfwhvac' },
  ],
  
  copyrightText: '© {year} DFW HVAC. All rights reserved.',
  showServiceAreas: true,
  showBusinessHours: true,
}

async function populateSiteSettings() {
  try {
    console.log('Creating/updating site settings document...')
    const result = await client.createOrReplace(siteSettings)
    console.log('Site settings populated successfully!')
    console.log('Document ID:', result._id)
  } catch (error) {
    console.error('Error populating site settings:', error.message)
    process.exit(1)
  }
}

populateSiteSettings()
