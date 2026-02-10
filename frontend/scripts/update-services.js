/**
 * Update service documents in Sanity with new brand messaging
 * Run with: node scripts/update-services.js
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

// Brand-aligned service updates
const serviceUpdates = {
  'residential': {
    'air-conditioning': {
      heroSubtitle: 'Expert Service with Integrity and Care',
      heroDescription: 'From routine maintenance to emergency repairs, our licensed technicians deliver honest assessments and quality workmanship for your home\'s cooling needs.',
      heroBenefits: [
        'Honest assessments with transparent pricing',
        'Licensed & insured technicians',
        'Quality parts and meticulous workmanship',
        'Comprehensive warranty coverage'
      ],
      whyChooseUsReasons: [
        'Three-generation family legacy of HVAC excellence',
        '5.0-star Google rating',
        'Licensed, bonded, and insured technicians',
        'Transparent pricing with no hidden fees',
        'Respectful of your home and time',
        'Comprehensive warranty on all work'
      ],
      emergencyTitle: 'Fast Response Service',
      emergencyDescription: 'When your AC breaks down during a Texas heatwave, you need fast, reliable service you can trust.',
      emergencyFeatures: [
        'Same-day service when available',
        'Honest diagnosis—no unnecessary repairs',
        'Quality parts that last',
        'Clear pricing before work begins'
      ],
      processSteps: [
        { step: 1, title: 'Honest Assessment', description: 'Thorough evaluation of your system with transparent findings' },
        { step: 2, title: 'Expert Diagnosis', description: 'Licensed technicians using advanced diagnostic equipment' },
        { step: 3, title: 'Clear Recommendations', description: 'Customer-first options with upfront pricing' },
        { step: 4, title: 'Quality Workmanship', description: 'Meticulous installation or repair with guaranteed results' }
      ]
    },
    'heating': {
      heroSubtitle: 'Trustworthy Service When You Need It Most',
      heroDescription: 'Expert heating system installation, repair, and maintenance delivered with the care and integrity you deserve.',
      heroBenefits: [
        'Gas furnace and heat pump expertise',
        'Honest assessments—no unnecessary repairs',
        'Energy-efficient heating solutions',
        'Comprehensive warranty coverage'
      ],
      whyChooseUsReasons: [
        'Three-generation family legacy of HVAC excellence',
        '5.0-star Google rating',
        'Licensed, bonded, and insured technicians',
        'Transparent pricing with no hidden fees',
        'Respectful of your home and time',
        'Comprehensive warranty on all work'
      ],
      emergencyTitle: 'Fast Response Service',
      emergencyDescription: 'When your heating fails on a cold Texas night, you need a team you can trust for fast, reliable service.',
      emergencyFeatures: [
        'Same-day service when available',
        'Safety-first approach',
        'Honest diagnosis and fair pricing',
        'Quality repairs that last'
      ],
      processSteps: [
        { step: 1, title: 'Thorough Evaluation', description: 'Complete inspection of your heating system with honest findings' },
        { step: 2, title: 'Safety Testing', description: 'Advanced diagnostics prioritizing your family\'s safety' },
        { step: 3, title: 'Transparent Options', description: 'Clear recommendations with upfront pricing—no pressure' },
        { step: 4, title: 'Quality Service', description: 'Meticulous workmanship with guaranteed results' }
      ]
    },
    'indoor-air-quality': {
      heroSubtitle: 'Breathe Easier with Expert Care',
      heroDescription: 'Your family\'s health matters. We provide honest assessments and effective solutions to improve the air quality in your home.',
      heroBenefits: [
        'Comprehensive air quality assessments',
        'Honest recommendations—not upsells',
        'Professional installation and service',
        'Solutions for allergies, asthma, and more'
      ],
      whyChooseUsReasons: [
        'Three-generation family legacy of HVAC excellence',
        'Honest assessments—we only recommend what you need',
        'Licensed, certified air quality specialists',
        'Solutions for allergies, asthma, and respiratory concerns',
        'Quality products from trusted manufacturers',
        'Comprehensive warranty on all installations'
      ]
    },
    'maintenance-plans': {
      heroSubtitle: 'Proactive Care for Long-Term Comfort',
      heroDescription: 'Regular maintenance extends system life, improves efficiency, and prevents costly breakdowns. Our plans deliver honest, thorough service twice a year.',
      heroBenefits: [
        'Twice-yearly comprehensive tune-ups',
        'Priority scheduling and service',
        'Discounts on repairs',
        'No hidden fees or gimmicks'
      ],
      whyChooseUsReasons: [
        'Extends equipment life and prevents breakdowns',
        'Maintains manufacturer warranty requirements',
        'Improves energy efficiency and lowers bills',
        'Priority service when you need it most',
        'Honest assessments—we won\'t invent problems',
        'Comprehensive coverage at a fair price'
      ]
    }
  },
  'commercial': {
    'commercial-hvac': {
      heroSubtitle: 'Expert Service for Your Business',
      heroDescription: 'Minimize downtime and maximize comfort for your employees and customers with honest, reliable commercial HVAC service.',
      heroBenefits: [
        'Minimal disruption to your business',
        'Honest assessments and fair pricing',
        'Licensed commercial HVAC specialists',
        'Preventive maintenance programs'
      ],
      whyChooseUsReasons: [
        'Three-generation legacy of HVAC excellence',
        'Experience with diverse commercial applications',
        'Honest assessments—we respect your budget',
        'Flexible scheduling to minimize business disruption',
        'Licensed and insured commercial specialists',
        'Comprehensive maintenance programs'
      ]
    },
    'commercial-maintenance': {
      heroSubtitle: 'Proactive Care for Your Business',
      heroDescription: 'Prevent costly breakdowns and extend equipment life with our comprehensive commercial maintenance programs.',
      heroBenefits: [
        'Prevent unexpected downtime',
        'Extend equipment lifespan',
        'Maintain energy efficiency',
        'Priority emergency service'
      ]
    },
    'new-construction': {
      heroSubtitle: 'Building Comfort from the Ground Up',
      heroDescription: 'Expert HVAC system design and installation for new commercial construction projects. We provide honest guidance to get it right the first time.',
      heroBenefits: [
        'Custom system design',
        'Energy efficiency focus',
        'Code compliance expertise',
        'Coordination with builders'
      ]
    }
  }
}

async function updateServices() {
  console.log('🚀 Updating service documents with brand messaging...\n')
  
  try {
    // Get all services from Sanity
    const services = await client.fetch(`*[_type == "service"] { _id, category, "slug": slug.current, title }`)
    
    console.log(`Found ${services.length} services in Sanity\n`)
    
    for (const service of services) {
      const updates = serviceUpdates[service.category]?.[service.slug]
      
      if (updates) {
        console.log(`📝 Updating: ${service.title} (${service.category}/${service.slug})`)
        await client.patch(service._id).set(updates).commit()
        console.log(`   ✅ Updated successfully`)
      } else {
        console.log(`⏭️  Skipping: ${service.title} (no updates defined)`)
      }
    }
    
    console.log('\n✨ Service updates complete!')
    
  } catch (error) {
    console.error('❌ Error updating services:', error)
    process.exit(1)
  }
}

updateServices()
