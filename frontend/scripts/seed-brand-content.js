/**
 * Seed script to populate Sanity CMS with new brand framework content
 * Run with: node scripts/seed-brand-content.js
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// About Page Content
const aboutPageContent = {
  _type: 'aboutPage',
  metaTitle: 'About Us | DFW HVAC - Three Generations of Trusted Service',
  metaDescription: 'Learn about DFW HVAC - a three-generation family commitment to trustworthy, high-quality HVAC service in Dallas-Fort Worth. Expert service with integrity and care.',
  
  // Hero
  heroTitle: 'About DFW HVAC',
  heroSubtitle: 'Three Generations of Trusted HVAC Service',
  heroDescription: 'DFW HVAC delivers expert HVAC service with integrity and care—earning trust and long-term customer satisfaction through quality workmanship.',
  
  // Story
  storyTitle: 'Our Story',
  storyHighlight: 'Three-Generation Family Legacy',
  storyContent: [
    {
      _type: 'block',
      _key: 'story1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story1span',
          text: 'DFW HVAC was founded in 2020 as the natural evolution of a three-generation family commitment to trustworthy, high-quality HVAC service in the Dallas–Fort Worth Metroplex.',
        },
      ],
    },
    {
      _type: 'block',
      _key: 'story2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story2span',
          text: 'This commitment began in 1972 when Garland Nevil started A-1 Air Conditioning & Heating. It continued through his son, Ronny Grubb, who spent over 50 years building Alpine Heating & Air Conditioning on honest assessments, fair pricing, and meticulous workmanship.',
        },
      ],
    },
    {
      _type: 'block',
      _key: 'story3',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story3span',
          text: 'The founder grew up learning the trade at his father\'s side before pursuing a corporate career. He was ultimately drawn back by a desire to make a direct, meaningful impact in his community.',
        },
      ],
    },
    {
      _type: 'block',
      _key: 'story4',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story4span',
          text: 'In 2019, the founder left the corporate world to return to the field full-time, combining his family\'s hard-earned technical expertise with modern systems, training, and processes designed to support technicians and protect customers.',
        },
      ],
    },
    {
      _type: 'block',
      _key: 'story5',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'story5span',
          text: 'DFW HVAC was created to empower skilled professionals to deliver expert service with integrity and care—putting people, safety, and long-term satisfaction over short-term profit.',
        },
      ],
    },
  ],
  
  // Legacy Timeline
  legacyTimeline: [
    {
      _key: 'timeline1',
      year: '1972',
      title: 'The Legacy Begins',
      description: 'Garland Nevil starts A-1 Air Conditioning & Heating, establishing the family\'s commitment to quality HVAC service.',
      person: 'Garland Nevil',
    },
    {
      _key: 'timeline2',
      year: '1970s-2010s',
      title: '50+ Years of Excellence',
      description: 'Ronny Grubb builds Alpine Heating & Air Conditioning on honest assessments, fair pricing, and meticulous workmanship.',
      person: 'Ronny Grubb',
    },
    {
      _key: 'timeline3',
      year: '2019',
      title: 'Return to Roots',
      description: 'The founder leaves corporate career to return to the field full-time, combining family expertise with modern systems.',
      person: '',
    },
    {
      _key: 'timeline4',
      year: '2020',
      title: 'DFW HVAC Founded',
      description: 'DFW HVAC launches to deliver expert service with integrity and care throughout Dallas-Fort Worth.',
      person: '',
    },
  ],
  
  // Brand Pillars
  valuesTitle: 'Our Values',
  valuesSubtitle: 'The pillars that guide everything we do',
  brandPillars: [
    {
      _key: 'pillar1',
      title: 'Trust',
      tagline: 'Honest, Transparent, Ethical',
      description: 'We provide honest assessments and fair pricing. No hidden fees, no unnecessary repairs—just straightforward service you can count on.',
      icon: 'shield',
      proofPoints: [
        'Transparent, flat-rate pricing with no hidden fees',
        'Honest assessment of your system\'s needs',
        'Clear documentation of all work performed',
        'Customer-first recommendations, not upsells',
      ],
    },
    {
      _key: 'pillar2',
      title: 'Excellence',
      tagline: 'Skilled, Professional, Safe',
      description: 'Our technicians are fully licensed, trained, and committed to delivering top-quality work with expert problem-solving.',
      icon: 'award',
      proofPoints: [
        'Licensed and insured technicians',
        'Ongoing training on latest HVAC technology',
        'Quality parts and meticulous workmanship',
        'Optimal system design for your specific needs',
      ],
    },
    {
      _key: 'pillar3',
      title: 'Care',
      tagline: 'Attentive, Consultative, Convenient',
      description: 'We treat every customer like family, ensuring a seamless and satisfying experience from first call to completed service.',
      icon: 'heart',
      proofPoints: [
        'Easy online booking and flexible scheduling',
        'Proactive communication throughout service',
        'Respectful of your home and time',
        'Comprehensive warranties on all work',
      ],
    },
  ],
  
  // Statistics
  statistics: [
    { _key: 'stat1', value: '50+', label: 'Years of Family Legacy', suffix: '' },
    { _key: 'stat2', value: '5.0', label: 'Google Rating', suffix: 'Stars' },
    { _key: 'stat3', value: '130+', label: 'Customer Reviews', suffix: '' },
    { _key: 'stat4', value: 'Same-Day', label: 'Service Available', suffix: '' },
  ],
  
  // Display options
  showTeamSection: false,
  teamTitle: 'Meet Our Team',
  showTestimonials: true,
  showContactForm: true,
}

// Contact Page Content
const contactPageContent = {
  _type: 'contactPage',
  metaTitle: 'Contact Us | DFW HVAC - Expert HVAC Service',
  metaDescription: 'Contact DFW HVAC for expert heating and cooling services in Dallas-Fort Worth. Same-day service available Monday-Friday. Call (972) 777-COOL.',
  
  heroTitle: 'Contact Us',
  heroSubtitle: "We're Here to Help",
  heroDescription: 'Have a question or need service? Our team is ready to provide expert HVAC service with integrity and care.',
  
  contactSectionTitle: 'Get In Touch',
  phoneDescription: 'Same-day service available Monday-Friday',
  emailDescription: 'We respond within 24 hours',
  emergencyText: 'Same-Day Service Available',
  
  formTitle: 'Send Us a Message',
  formDescription: "Fill out the form below and we'll get back to you within 24 hours",
  
  ctaTitle: 'Ready to Experience the DFW HVAC Difference?',
  ctaDescription: 'Expert service with integrity and care—call us today',
}

// Trust Signals Content
const trustSignalsContent = {
  _type: 'trustSignals',
  title: 'Site Trust Signals',
  
  primaryBadges: [
    { _key: 'badge1', text: 'Licensed & Insured', icon: 'shield', order: 1 },
    { _key: 'badge2', text: 'Three-Generation Legacy', icon: 'award', order: 2 },
    { _key: 'badge3', text: '5.0 Google Rating', icon: 'star', order: 3 },
    { _key: 'badge4', text: 'Same-Day Service Available', icon: 'clock', order: 4 },
  ],
  
  whyChooseUsItems: [
    { 
      _key: 'why1', 
      title: 'Three-Generation Legacy', 
      description: 'A family commitment to HVAC excellence', 
      icon: 'years', 
      order: 1 
    },
    { 
      _key: 'why2', 
      title: 'Licensed & Insured', 
      description: 'Fully licensed technicians you can trust', 
      icon: 'shield', 
      order: 2 
    },
    { 
      _key: 'why3', 
      title: 'Fast Response', 
      description: 'Quick, reliable service when you need it', 
      icon: 'clock', 
      order: 3 
    },
    { 
      _key: 'why4', 
      title: 'Guaranteed Work', 
      description: 'Quality workmanship backed by comprehensive warranties', 
      icon: 'trending', 
      order: 4 
    },
  ],
  
  servicePageReasons: [
    'Honest assessments and transparent pricing',
    'Licensed, trained, and insured technicians',
    'Quality parts and meticulous workmanship',
    'Comprehensive warranties on all work',
    'Respectful of your home and time',
    'Same-day service available Monday-Friday',
  ],
  
  emergencyServiceTitle: 'Fast Response Service',
  emergencyServiceDescription: 'When your HVAC system breaks down, you need fast, reliable service you can count on. Our team responds quickly with expert solutions.',
  emergencyServiceFeatures: [
    'Same-day service availability',
    'Fast response Monday-Friday',
    'Transparent pricing before work begins',
    'Expert diagnosis and repair',
  ],
  
  ctaTitle: 'Ready to Get Started?',
  ctaDescription: 'Contact us today for expert HVAC service with integrity and care.',
  
  footerTrustText: 'Licensed • Insured • Satisfaction Guaranteed',
}

// Site Settings Updates
const siteSettingsUpdates = {
  logoTagline: 'Three Generations of Trusted Service',
  legacyStatement: 'A three-generation family commitment to trustworthy HVAC service',
  missionStatement: 'DFW HVAC delivers expert HVAC service with integrity and care—earning trust and long-term customer satisfaction through quality workmanship.',
  companyFoundedYear: '2020',
  legacyStartYear: '1972',
  headerTagline: 'Three Generations of Trusted HVAC Service in DFW',
  footerTagline: 'Expert HVAC service with integrity and care. A three-generation family commitment to quality workmanship in Dallas-Fort Worth.',
  defaultMetaDescription: 'DFW HVAC delivers expert HVAC service with integrity and care. Three generations of trusted heating & cooling service in Dallas-Fort Worth. Call (972) 777-COOL.',
}

// Homepage Updates
const homepageUpdates = {
  heroBadge: 'Three Generations of Trust',
  heroTitle: "Dallas-Fort Worth's",
  heroTitleHighlight: 'Trusted HVAC',
  heroTitleLine3: 'Experts',
  heroDescription: 'Expert HVAC service with integrity and care. A three-generation family commitment to quality workmanship throughout Dallas-Fort Worth.',
  whyUsTitle: 'Why Dallas-Fort Worth Trusts DFW HVAC',
  whyUsSubtitle: 'Expert service with integrity and care',
  whyUsItems: [
    { 
      _key: 'item1',
      title: 'Three-Generation Legacy', 
      description: 'A family commitment to HVAC excellence', 
      icon: 'years' 
    },
    { 
      _key: 'item2',
      title: 'Licensed & Insured', 
      description: 'Fully licensed technicians you can trust', 
      icon: 'shield' 
    },
    { 
      _key: 'item3',
      title: 'Fast Response', 
      description: 'Quick, reliable service when you need it', 
      icon: 'clock' 
    },
    { 
      _key: 'item4',
      title: 'Guaranteed Work', 
      description: 'Quality workmanship backed by comprehensive warranties', 
      icon: 'trending' 
    },
  ],
  ctaTitle: 'Ready to Get Started?',
  ctaDescription: 'Contact DFW HVAC today for expert service with integrity and care.',
}

// Company Info Updates
const companyInfoUpdates = {
  tagline: 'Three Generations of Trusted Service',
  established: '2020',
  legacyStartYear: '1972',
  legacyDescription: 'A three-generation family commitment to trustworthy, high-quality HVAC service in the Dallas–Fort Worth Metroplex.',
  description: 'DFW HVAC delivers expert HVAC service with integrity and care—earning trust and long-term customer satisfaction through quality workmanship.',
}

async function seedBrandContent() {
  console.log('🚀 Starting brand content migration...\n')
  
  try {
    // 1. Create/Update About Page
    console.log('📄 Creating About Page content...')
    const existingAbout = await client.fetch('*[_type == "aboutPage"][0]._id')
    if (existingAbout) {
      await client.patch(existingAbout).set(aboutPageContent).commit()
      console.log('   ✅ About Page updated')
    } else {
      await client.create(aboutPageContent)
      console.log('   ✅ About Page created')
    }
    
    // 2. Create/Update Contact Page
    console.log('📄 Creating Contact Page content...')
    const existingContact = await client.fetch('*[_type == "contactPage"][0]._id')
    if (existingContact) {
      await client.patch(existingContact).set(contactPageContent).commit()
      console.log('   ✅ Contact Page updated')
    } else {
      await client.create(contactPageContent)
      console.log('   ✅ Contact Page created')
    }
    
    // 3. Create/Update Trust Signals
    console.log('📄 Creating Trust Signals...')
    const existingTrust = await client.fetch('*[_type == "trustSignals"][0]._id')
    if (existingTrust) {
      await client.patch(existingTrust).set(trustSignalsContent).commit()
      console.log('   ✅ Trust Signals updated')
    } else {
      await client.create(trustSignalsContent)
      console.log('   ✅ Trust Signals created')
    }
    
    // 4. Update Site Settings
    console.log('⚙️  Updating Site Settings...')
    const existingSettings = await client.fetch('*[_type == "siteSettings"][0]._id')
    if (existingSettings) {
      await client.patch(existingSettings).set(siteSettingsUpdates).commit()
      console.log('   ✅ Site Settings updated')
    } else {
      console.log('   ⚠️  No Site Settings found - please create in Sanity Studio first')
    }
    
    // 5. Update Homepage
    console.log('🏠 Updating Homepage content...')
    const existingHomepage = await client.fetch('*[_type == "homepage"][0]._id')
    if (existingHomepage) {
      await client.patch(existingHomepage).set(homepageUpdates).commit()
      console.log('   ✅ Homepage updated')
    } else {
      console.log('   ⚠️  No Homepage found - please create in Sanity Studio first')
    }
    
    // 6. Update Company Info
    console.log('🏢 Updating Company Info...')
    const existingCompany = await client.fetch('*[_type == "companyInfo"][0]._id')
    if (existingCompany) {
      await client.patch(existingCompany).set(companyInfoUpdates).commit()
      console.log('   ✅ Company Info updated')
    } else {
      console.log('   ⚠️  No Company Info found - please create in Sanity Studio first')
    }
    
    console.log('\n✨ Brand content migration complete!')
    console.log('\nContent updated:')
    console.log('  • About Page - Three-generation story, brand pillars, statistics')
    console.log('  • Contact Page - Updated messaging')
    console.log('  • Trust Signals - New badges and "Why Choose Us" items')
    console.log('  • Site Settings - Logo tagline, mission statement, legacy info')
    console.log('  • Homepage - Hero content, Why Us section')
    console.log('  • Company Info - Founding dates, description')
    
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

seedBrandContent()
