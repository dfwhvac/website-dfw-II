// Service data and utilities

const serviceData = {
  residential: {
    'air-conditioning': {
      title: 'Residential Air Conditioning',
      description: 'Professional AC installation, repair, and maintenance for maximum comfort during hot Texas summers.',
      keywords: 'residential ac repair, air conditioning installation, ac maintenance, dallas ac service',
      icon: 'snowflake',
      heroContent: {
        title: 'Professional Air Conditioning Services',
        subtitle: 'Keep Your Dallas Home Cool & Comfortable',
        description: 'Expert AC installation, repair, and maintenance services for residential properties throughout the Dallas-Fort Worth area.',
        benefits: [
          'Fast Response Time - Same day service available',
          'Licensed & Insured Technicians',
          'Energy Efficient System Recommendations',
          'Comprehensive Warranty Coverage'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'What We Do',
          items: [
            'Central air conditioning repair and installation',
            'Ductless mini-split systems',
            'AC unit replacement and upgrades',
            'Emergency AC repair services',
            'Preventive maintenance programs',
            'Energy efficiency assessments'
          ]
        },
        ourProcess: {
          title: 'Our Process',
          steps: [
            {
              step: 1,
              title: 'Initial Assessment',
              description: 'Comprehensive evaluation of your current system and cooling needs'
            },
            {
              step: 2,
              title: 'Professional Diagnosis',
              description: 'Detailed analysis using advanced diagnostic equipment'
            },
            {
              step: 3,
              title: 'Solution & Quote', 
              description: 'Clear explanation of issues and transparent pricing'
            },
            {
              step: 4,
              title: 'Expert Installation/Repair',
              description: 'Professional service with quality parts and workmanship'
            }
          ]
        },
        whyChooseUs: {
          title: 'Why Choose DFW HVAC',
          reasons: [
            '50+ years of experience in Dallas-Fort Worth area',
            '5.0-star Google rating with 118+ reviews',
            'Licensed, bonded, and insured technicians',
            'Transparent pricing with no hidden fees',
            'Same-day service availability',
            'Comprehensive warranty on all work'
          ]
        },
        emergencyService: {
          title: 'Fast Response Service',
          description: 'When your AC breaks down during a Texas heatwave, you need fast, reliable service.',
          features: [
            'Same-day service available',
            'Experienced diagnostic technicians',
            'Mobile service units fully stocked',
            'Quality repairs that last'
          ]
        }
      },
      pricing: {
        maintenance: {
          title: 'Maintenance',
          startingPrice: 'Starting at $149',
          includes: [
            'Complete system inspection',
            'Filter replacement',
            'Coil cleaning',
            'Performance testing'
          ]
        },
        repair: {
          title: 'Repair',
          startingPrice: 'Diagnostic $99',
          includes: [
            'Professional diagnosis',
            'Upfront pricing',
            'Quality parts',
            '1-year warranty'
          ]
        },
        installation: {
          title: 'Installation',
          startingPrice: 'Free Estimate',
          includes: [
            'In-home consultation',
            'Energy efficiency analysis',
            'Financing available',
            'Professional installation'
          ]
        }
      },
      faqs: [
        {
          question: 'How often should I replace my AC filter?',
          answer: 'Most filters should be replaced every 1-3 months, depending on usage, pets, and air quality. We\'ll check your filter during every service call and recommend the best replacement schedule for your home.'
        },
        {
          question: 'What size AC unit do I need for my home?',
          answer: 'AC sizing depends on square footage, insulation, windows, and other factors. Our technicians perform detailed load calculations to ensure you get the right size system for optimal efficiency and comfort.'
        },
        {
          question: 'How long do AC units typically last?',
          answer: 'With proper maintenance, most AC units last 12-15 years in Texas. Regular maintenance can extend the life of your system and help prevent costly breakdowns.'
        },
        {
          question: 'Do you service all AC brands?',
          answer: 'Yes, our experienced technicians work on all major AC brands including Trane, Carrier, Lennox, Goodman, Rheem, and more. We stock parts for most common systems.'
        }
      ]
    },
    'heating': {
      title: 'Residential Heating',
      description: 'Expert furnace repair, heat pump service, and heating system installation for comfortable winters.',
      keywords: 'furnace repair, heating installation, heat pump service, dallas heating contractor',
      icon: 'flame',
      heroContent: {
        title: 'Professional Heating Services',
        subtitle: 'Stay Warm All Winter Long',
        description: 'Expert heating system installation, repair, and maintenance for residential properties in Dallas-Fort Worth.',
        benefits: [
          'Gas furnace and heat pump expertise',
          'Emergency heating repair service',
          'Energy-efficient heating solutions',
          'Comprehensive warranty coverage'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'What We Do',
          items: [
            'Gas furnace installation and repair',
            'Heat pump systems and service',
            'Ductwork inspection and repair',
            'Thermostat installation and programming',
            'Heating system maintenance',
            'Indoor air quality improvements'
          ]
        },
        ourProcess: {
          title: 'Our Process',
          steps: [
            {
              step: 1,
              title: 'System Evaluation',
              description: 'Thorough inspection of your heating system and components'
            },
            {
              step: 2,
              title: 'Performance Testing',
              description: 'Advanced diagnostics to identify efficiency and safety issues'
            },
            {
              step: 3,
              title: 'Recommendations',
              description: 'Clear options for repair, replacement, or upgrades'
            },
            {
              step: 4,
              title: 'Professional Service',
              description: 'Quality installation or repair with guaranteed results'
            }
          ]
        }
      },
      pricing: {
        maintenance: {
          title: 'Maintenance',
          startingPrice: 'Starting at $129',
          includes: [
            'Complete system inspection',
            'Safety testing',
            'Filter replacement',
            'Performance optimization'
          ]
        },
        repair: {
          title: 'Repair',
          startingPrice: 'Diagnostic $99',
          includes: [
            'Professional diagnosis',
            'Safety inspection',
            'Transparent pricing',
            'Quality parts warranty'
          ]
        },
        installation: {
          title: 'Installation',
          startingPrice: 'Free Estimate',
          includes: [
            'In-home consultation',
            'Load calculation',
            'Financing options',
            'Professional installation'
          ]
        }
      },
      faqs: [
        {
          question: 'How often should I schedule heating maintenance?',
          answer: 'We recommend annual heating maintenance before winter to ensure safe, efficient operation and prevent breakdowns during cold weather.'
        },
        {
          question: 'What are signs my furnace needs repair?',
          answer: 'Common signs include strange noises, uneven heating, higher energy bills, frequent cycling, or the system not turning on. Call us for professional diagnosis.'
        }
      ]
    }
  }
}

export async function getServiceData(category, serviceSlug) {
  // In a real app, this might fetch from Sanity CMS
  return serviceData[category]?.[serviceSlug] || null
}

export function getAllServices(category) {
  return Object.entries(serviceData[category] || {}).map(([slug, data]) => ({
    slug,
    ...data
  }))
}