// Service data and utilities - Updated with brand framework messaging
// Brand pillars: Trust, Excellence, Care

const serviceData = {
  residential: {
    'air-conditioning': {
      title: 'Residential Air Conditioning',
      description: 'Expert AC installation, repair, and maintenance with integrity and care. Keep your Dallas home cool and comfortable.',
      keywords: 'residential ac repair, air conditioning installation, ac maintenance, dallas ac service',
      icon: 'snowflake',
      heroContent: {
        title: 'Professional Air Conditioning Services',
        subtitle: 'Expert Service with Integrity and Care',
        description: 'From routine maintenance to emergency repairs, our licensed technicians deliver honest assessments and quality workmanship for your home\'s cooling needs.',
        benefits: [
          'Honest assessments with transparent pricing',
          'Licensed & insured technicians',
          'Quality parts and meticulous workmanship',
          'Comprehensive warranty coverage'
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
              title: 'Honest Assessment',
              description: 'Thorough evaluation of your system with transparent findings—no surprises'
            },
            {
              step: 2,
              title: 'Expert Diagnosis',
              description: 'Licensed technicians using advanced diagnostic equipment'
            },
            {
              step: 3,
              title: 'Clear Recommendations',
              description: 'Customer-first options with upfront, flat-rate pricing'
            },
            {
              step: 4,
              title: 'Quality Workmanship',
              description: 'Meticulous installation or repair with guaranteed results'
            }
          ]
        },
        whyChooseUs: {
          title: 'Why Choose DFW HVAC',
          reasons: [
            'Three-generation family legacy of HVAC excellence',
            '5.0-star Google rating with 130+ reviews',
            'Licensed, bonded, and insured technicians',
            'Transparent pricing with no hidden fees',
            'Respectful of your home and time',
            'Comprehensive warranty on all work'
          ]
        },
        emergencyService: {
          title: 'Fast Response Service',
          description: 'When your AC breaks down during a Texas heatwave, you need fast, reliable service you can trust.',
          features: [
            'Same-day service when available',
            'Honest diagnosis—no unnecessary repairs',
            'Quality parts that last',
            'Clear pricing before work begins'
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
            'Honest diagnosis',
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
          answer: 'Most filters should be replaced every 1-3 months, depending on usage, pets, and air quality. We\'ll check your filter during every service call and give you an honest recommendation for your specific situation.'
        },
        {
          question: 'What size AC unit do I need for my home?',
          answer: 'AC sizing depends on square footage, insulation, windows, and other factors. Our technicians perform detailed load calculations to ensure you get the right size system—we won\'t oversell you on a larger unit than you need.'
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
      description: 'Expert furnace repair, heat pump service, and heating installation with integrity and care for comfortable winters.',
      keywords: 'furnace repair, heating installation, heat pump service, dallas heating contractor',
      icon: 'flame',
      heroContent: {
        title: 'Professional Heating Services',
        subtitle: 'Trustworthy Service When You Need It Most',
        description: 'Expert heating system installation, repair, and maintenance delivered with the care and integrity you deserve.',
        benefits: [
          'Gas furnace and heat pump expertise',
          'Honest assessments—no unnecessary repairs',
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
              title: 'Thorough Evaluation',
              description: 'Complete inspection of your heating system with honest findings'
            },
            {
              step: 2,
              title: 'Safety Testing',
              description: 'Advanced diagnostics prioritizing your family\'s safety'
            },
            {
              step: 3,
              title: 'Transparent Options',
              description: 'Clear recommendations with upfront pricing—no pressure'
            },
            {
              step: 4,
              title: 'Quality Service',
              description: 'Meticulous workmanship with guaranteed results'
            }
          ]
        },
        whyChooseUs: {
          title: 'Why Choose DFW HVAC',
          reasons: [
            'Three-generation family legacy of HVAC excellence',
            '5.0-star Google rating with 130+ reviews',
            'Licensed, bonded, and insured technicians',
            'Transparent pricing with no hidden fees',
            'Respectful of your home and time',
            'Comprehensive warranty on all work'
          ]
        },
        emergencyService: {
          title: 'Fast Response Service',
          description: 'When your heating fails on a cold Texas night, you need a team you can trust for fast, reliable service.',
          features: [
            'Same-day service when available',
            'Safety-first approach',
            'Honest diagnosis and fair pricing',
            'Quality repairs that last'
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
            'Honest diagnosis',
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
          answer: 'We recommend annual heating maintenance before winter to ensure safe, efficient operation and prevent breakdowns during cold weather. Our maintenance includes safety testing and honest recommendations.'
        },
        {
          question: 'What are signs my furnace needs repair?',
          answer: 'Common signs include strange noises, uneven heating, higher energy bills, frequent cycling, or the system not turning on. We\'ll give you an honest diagnosis and only recommend repairs you actually need.'
        }
      ]
    },
    'indoor-air-quality': {
      title: 'Indoor Air Quality',
      description: 'Breathe easier with professional indoor air quality solutions. Expert assessments and honest recommendations for healthier indoor air.',
      keywords: 'indoor air quality, air purification, hvac air quality, dallas air quality service',
      icon: 'wind',
      heroContent: {
        title: 'Indoor Air Quality Solutions',
        subtitle: 'Breathe Easier with Expert Care',
        description: 'Your family\'s health matters. We provide honest assessments and effective solutions to improve the air quality in your home.',
        benefits: [
          'Comprehensive air quality assessments',
          'Honest recommendations—not upsells',
          'Professional installation and service',
          'Solutions for allergies, asthma, and more'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'What We Do',
          items: [
            'Air quality testing and assessment',
            'Air purification systems',
            'Whole-home humidifiers and dehumidifiers',
            'UV germicidal lights',
            'Duct cleaning and sanitization',
            'Ventilation improvements',
            'HEPA filtration systems'
          ]
        },
        ourProcess: {
          title: 'Our Process',
          steps: [
            {
              step: 1,
              title: 'Air Quality Assessment',
              description: 'Comprehensive evaluation of your home\'s air quality concerns'
            },
            {
              step: 2,
              title: 'Honest Analysis',
              description: 'Clear explanation of findings and what they mean for your family'
            },
            {
              step: 3,
              title: 'Tailored Solutions',
              description: 'Custom recommendations based on your specific needs and budget'
            },
            {
              step: 4,
              title: 'Professional Installation',
              description: 'Expert installation with thorough testing and verification'
            }
          ]
        },
        whyChooseUs: {
          title: 'Why Choose DFW HVAC',
          reasons: [
            'Three-generation family legacy of HVAC excellence',
            'Honest assessments—we only recommend what you need',
            'Licensed, certified air quality specialists',
            'Solutions for allergies, asthma, and respiratory concerns',
            'Quality products from trusted manufacturers',
            'Comprehensive warranty on all installations'
          ]
        }
      },
      pricing: {
        assessment: {
          title: 'Assessment',
          startingPrice: 'Starting at $99',
          includes: [
            'Comprehensive air quality evaluation',
            'Written findings report',
            'Honest recommendations',
            'No obligation quote'
          ]
        },
        airPurification: {
          title: 'Air Purification',
          startingPrice: 'From $299',
          includes: [
            'System recommendation',
            'Professional installation',
            'Performance testing',
            'Warranty coverage'
          ]
        },
        wholehome: {
          title: 'Whole-Home Solutions',
          startingPrice: 'Free Estimate',
          includes: [
            'Custom system design',
            'Professional installation',
            'Integration with existing HVAC',
            'Comprehensive warranty'
          ]
        }
      },
      faqs: [
        {
          question: 'How do I know if I need an air purification system?',
          answer: 'If you or family members suffer from allergies, asthma, or respiratory issues, or if you notice dust buildup, musty odors, or stale air, an air purification system may help. We\'ll provide an honest assessment of your needs.'
        },
        {
          question: 'What\'s the difference between air purifiers and air filters?',
          answer: 'Standard air filters capture larger particles, while air purifiers actively remove smaller pollutants, bacteria, and viruses. We\'ll explain which solution is right for your situation without pushing unnecessary upgrades.'
        },
        {
          question: 'How often should air purification systems be maintained?',
          answer: 'Most systems need annual maintenance and filter changes every 6-12 months. We\'ll set up a maintenance schedule that keeps your system working effectively.'
        }
      ]
    },
    'maintenance-plans': {
      title: 'Maintenance Plans',
      description: 'Protect your HVAC investment with our comprehensive maintenance plans. Honest service and priority care for your home comfort systems.',
      keywords: 'hvac maintenance plan, ac maintenance agreement, heating maintenance dallas',
      icon: 'clipboard-check',
      heroContent: {
        title: 'HVAC Maintenance Plans',
        subtitle: 'Proactive Care for Long-Term Comfort',
        description: 'Regular maintenance extends system life, improves efficiency, and prevents costly breakdowns. Our plans deliver honest, thorough service twice a year.',
        benefits: [
          'Twice-yearly comprehensive tune-ups',
          'Priority scheduling and service',
          'Discounts on repairs',
          'No hidden fees or gimmicks'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'What Our Plans Include',
          items: [
            'Spring AC tune-up and inspection',
            'Fall heating system tune-up',
            'Priority scheduling for members',
            '15% discount on repairs',
            'No overtime charges',
            'Filter replacements included',
            'Safety inspections',
            'Performance optimization'
          ]
        },
        ourProcess: {
          title: 'Our Maintenance Process',
          steps: [
            {
              step: 1,
              title: 'Comprehensive Inspection',
              description: 'Thorough evaluation of all system components'
            },
            {
              step: 2,
              title: 'Cleaning & Tune-Up',
              description: 'Professional cleaning and performance optimization'
            },
            {
              step: 3,
              title: 'Safety Testing',
              description: 'Complete safety checks for your peace of mind'
            },
            {
              step: 4,
              title: 'Honest Report',
              description: 'Clear findings and recommendations—no pressure tactics'
            }
          ]
        },
        whyChooseUs: {
          title: 'Why Choose Our Maintenance Plans',
          reasons: [
            'Extends equipment life and prevents breakdowns',
            'Maintains manufacturer warranty requirements',
            'Improves energy efficiency and lowers bills',
            'Priority service when you need it most',
            'Honest assessments—we won\'t invent problems',
            'Comprehensive coverage at a fair price'
          ]
        }
      },
      pricing: {
        basic: {
          title: 'Essential Plan',
          startingPrice: '$199/year',
          includes: [
            'Two seasonal tune-ups',
            '10% repair discount',
            'Priority scheduling',
            'Filter included'
          ]
        },
        premium: {
          title: 'Premium Plan',
          startingPrice: '$349/year',
          includes: [
            'Two seasonal tune-ups',
            '15% repair discount',
            'Priority scheduling',
            'Filters included',
            'No overtime charges'
          ]
        },
        complete: {
          title: 'Complete Care',
          startingPrice: '$499/year',
          includes: [
            'Two seasonal tune-ups',
            '20% repair discount',
            'Same-day priority service',
            'All filters included',
            'No overtime charges',
            'Annual duct inspection'
          ]
        }
      },
      faqs: [
        {
          question: 'Why should I sign up for a maintenance plan?',
          answer: 'Regular maintenance prevents costly breakdowns, extends equipment life, maintains warranty coverage, and keeps your system running efficiently. Our plans provide honest, comprehensive service at a fair price.'
        },
        {
          question: 'How often will you service my system?',
          answer: 'We perform two visits per year—one in spring for your AC and one in fall for your heating system. This ensures both systems are ready for peak season demands.'
        },
        {
          question: 'Can I cancel my plan at any time?',
          answer: 'Yes, you can cancel at any time. We don\'t believe in locking customers into contracts they don\'t want. We earn your business through quality service, not fine print.'
        }
      ]
    }
  },
  commercial: {
    'commercial-hvac': {
      title: 'Commercial HVAC Services',
      description: 'Expert commercial HVAC installation, repair, and maintenance. Honest service and quality workmanship for Dallas-Fort Worth businesses.',
      keywords: 'commercial hvac, business ac repair, commercial heating, dallas commercial hvac',
      icon: 'building',
      heroContent: {
        title: 'Commercial HVAC Services',
        subtitle: 'Expert Service for Your Business',
        description: 'Minimize downtime and maximize comfort for your employees and customers with honest, reliable commercial HVAC service.',
        benefits: [
          'Minimal disruption to your business',
          'Honest assessments and fair pricing',
          'Licensed commercial HVAC specialists',
          'Preventive maintenance programs'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'What We Do',
          items: [
            'Commercial AC and heating repair',
            'Rooftop unit (RTU) service',
            'Commercial system installation',
            'Preventive maintenance programs',
            'Energy efficiency upgrades',
            'Emergency commercial service',
            'Building automation systems'
          ]
        },
        ourProcess: {
          title: 'Our Process',
          steps: [
            {
              step: 1,
              title: 'Business Assessment',
              description: 'Understanding your operations and comfort requirements'
            },
            {
              step: 2,
              title: 'System Evaluation',
              description: 'Comprehensive inspection with honest findings'
            },
            {
              step: 3,
              title: 'Custom Solutions',
              description: 'Recommendations tailored to your business needs and budget'
            },
            {
              step: 4,
              title: 'Professional Service',
              description: 'Expert execution with minimal disruption to operations'
            }
          ]
        },
        whyChooseUs: {
          title: 'Why Choose DFW HVAC for Commercial',
          reasons: [
            'Three-generation legacy of HVAC excellence',
            'Experience with diverse commercial applications',
            'Honest assessments—we respect your budget',
            'Flexible scheduling to minimize business disruption',
            'Licensed and insured commercial specialists',
            'Comprehensive maintenance programs'
          ]
        }
      },
      pricing: {
        maintenance: {
          title: 'Commercial Maintenance',
          startingPrice: 'Custom Quote',
          includes: [
            'Quarterly inspections',
            'Priority service',
            'Discounted repairs',
            'Performance reporting'
          ]
        },
        repair: {
          title: 'Repair Service',
          startingPrice: 'Diagnostic from $149',
          includes: [
            'Honest diagnosis',
            'Upfront pricing',
            'Quality commercial parts',
            'Warranty coverage'
          ]
        },
        installation: {
          title: 'Installation',
          startingPrice: 'Free Consultation',
          includes: [
            'Site assessment',
            'Custom system design',
            'Competitive pricing',
            'Professional installation'
          ]
        }
      },
      faqs: [
        {
          question: 'Do you work with all types of commercial buildings?',
          answer: 'Yes, we service offices, retail spaces, restaurants, warehouses, and more. We\'ll assess your specific needs and provide honest recommendations for your situation.'
        },
        {
          question: 'Can you work around our business hours?',
          answer: 'Absolutely. We understand business disruption costs money. We offer flexible scheduling including evenings and weekends to minimize impact on your operations.'
        }
      ]
    },
    'commercial-maintenance': {
      title: 'Commercial Maintenance Programs',
      description: 'Protect your business investment with proactive commercial HVAC maintenance. Honest service that prevents costly downtime.',
      keywords: 'commercial hvac maintenance, business ac maintenance, preventive maintenance dallas',
      icon: 'settings',
      heroContent: {
        title: 'Commercial Maintenance Programs',
        subtitle: 'Proactive Care for Your Business',
        description: 'Prevent costly breakdowns and extend equipment life with our comprehensive commercial maintenance programs.',
        benefits: [
          'Prevent unexpected downtime',
          'Extend equipment lifespan',
          'Maintain energy efficiency',
          'Priority emergency service'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'Program Benefits',
          items: [
            'Scheduled preventive maintenance',
            'Priority emergency response',
            'Discounted repair rates',
            'Equipment performance tracking',
            'Energy efficiency monitoring',
            'Compliance documentation',
            'Budget-friendly pricing'
          ]
        },
        ourProcess: {
          title: 'Our Maintenance Approach',
          steps: [
            {
              step: 1,
              title: 'Initial Assessment',
              description: 'Complete evaluation of all commercial HVAC equipment'
            },
            {
              step: 2,
              title: 'Custom Plan Development',
              description: 'Maintenance schedule tailored to your equipment and operations'
            },
            {
              step: 3,
              title: 'Regular Service',
              description: 'Scheduled maintenance with detailed documentation'
            },
            {
              step: 4,
              title: 'Ongoing Communication',
              description: 'Proactive updates and honest recommendations'
            }
          ]
        }
      },
      pricing: {
        quarterly: {
          title: 'Quarterly Service',
          startingPrice: 'Custom Quote',
          includes: [
            'Four visits per year',
            'Comprehensive inspections',
            'Priority scheduling',
            '10% repair discount'
          ]
        },
        monthly: {
          title: 'Monthly Service',
          startingPrice: 'Custom Quote',
          includes: [
            'Monthly inspections',
            'Preventive maintenance',
            'Priority response',
            '15% repair discount'
          ]
        },
        enterprise: {
          title: 'Enterprise',
          startingPrice: 'Custom Quote',
          includes: [
            'Weekly inspections',
            'Dedicated account manager',
            '24/7 priority service',
            '20% repair discount'
          ]
        }
      },
      faqs: [
        {
          question: 'How do commercial maintenance programs save money?',
          answer: 'Regular maintenance prevents major breakdowns, extends equipment life, maintains efficiency (lowering energy costs), and catches small issues before they become expensive repairs. We\'ll always give you honest assessments of what your equipment actually needs.'
        },
        {
          question: 'What\'s included in a commercial maintenance visit?',
          answer: 'Each visit includes comprehensive inspection, cleaning, safety testing, performance optimization, and a detailed report. We\'ll provide honest findings and only recommend work that\'s actually needed.'
        }
      ]
    },
    'new-construction': {
      title: 'New Construction HVAC',
      description: 'Expert HVAC design and installation for new commercial construction. Quality systems with honest guidance from the start.',
      keywords: 'new construction hvac, commercial hvac installation, hvac contractor dallas',
      icon: 'hard-hat',
      heroContent: {
        title: 'New Construction HVAC',
        subtitle: 'Building Comfort from the Ground Up',
        description: 'Expert HVAC system design and installation for new commercial construction projects. We provide honest guidance to get it right the first time.',
        benefits: [
          'Custom system design',
          'Energy efficiency focus',
          'Code compliance expertise',
          'Coordination with builders'
        ]
      },
      sections: {
        whatWeDo: {
          title: 'What We Do',
          items: [
            'HVAC system design and engineering',
            'Load calculations and equipment sizing',
            'Ductwork design and installation',
            'Energy efficiency optimization',
            'Code compliance and permits',
            'Builder and contractor coordination',
            'Commissioning and testing'
          ]
        },
        ourProcess: {
          title: 'Our Process',
          steps: [
            {
              step: 1,
              title: 'Project Consultation',
              description: 'Understanding your building requirements and budget'
            },
            {
              step: 2,
              title: 'System Design',
              description: 'Custom HVAC design optimized for your specific needs'
            },
            {
              step: 3,
              title: 'Professional Installation',
              description: 'Expert installation coordinated with your construction timeline'
            },
            {
              step: 4,
              title: 'Testing & Handoff',
              description: 'Comprehensive commissioning and owner training'
            }
          ]
        }
      },
      faqs: [
        {
          question: 'When should we involve DFW HVAC in our construction project?',
          answer: 'The earlier the better. Involving us during the design phase ensures optimal system design, avoids costly changes later, and allows proper coordination with other trades.'
        },
        {
          question: 'Do you work with general contractors and builders?',
          answer: 'Yes, we have extensive experience coordinating with general contractors, architects, and other trades. We\'ll work within your project timeline and communicate proactively.'
        }
      ]
    }
  }
}

export async function getServiceData(category, serviceSlug) {
  // Return service data - in future could fetch from Sanity CMS
  return serviceData[category]?.[serviceSlug] || null
}

export function getAllServices(category) {
  return Object.entries(serviceData[category] || {}).map(([slug, data]) => ({
    slug,
    ...data
  }))
}

export function getAllServiceCategories() {
  return Object.keys(serviceData)
}

export function getServiceBySlug(slug) {
  for (const category of Object.keys(serviceData)) {
    if (serviceData[category][slug]) {
      return { category, ...serviceData[category][slug] }
    }
  }
  return null
}
