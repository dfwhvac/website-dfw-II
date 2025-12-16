const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'iar2b790',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skEMFTe8dtZ8M3tXWCgpOkYISQFJ6K185tkHuL0mCLF66hZSynZfzIpUsMMAinb6ZV4aPz6z7weWg1mVO3OBqK9s3qQZsHMni0flOXCp8eQdmrqA8jQJs1WSQYqc1rdpW2z1lcgaEUbKSLJr6qOS8X7TZtAbIFU1Pw2eTSl0eW2SptMD0EsS',
  useCdn: false,
})

async function importData() {
  try {
    // Import Company Info
    console.log('Importing Company Information...')
    await client.createOrReplace({
      _id: 'companyInfo',
      _type: 'companyInfo',
      name: 'DFW HVAC',
      tagline: 'Family Owned Since 1974',
      phone: '(972) 777-COOL',
      phoneDisplay: '(817) 242-6688',
      email: 'info@dfwhvac.com',
      address: '556 S Coppell Rd Ste 103, Coppell, TX 75019',
      description: 'Family owned Air Conditioning and Heating contractor serving Dallas - Fort Worth and surrounding areas since 1974.',
      googleRating: 5.0,
      googleReviews: 118,
      womenOwned: true,
      established: '1974',
      businessHours: {
        monday: '7AM-7PM',
        tuesday: '7AM-7PM',
        wednesday: '7AM-7PM',
        thursday: '7AM-7PM',
        friday: '7AM-7PM',
        saturday: '8AM-1PM',
        sunday: 'Closed'
      },
      serviceAreas: ['Dallas', 'Fort Worth', 'Arlington', 'Plano', 'Irving', 'Garland', 'Grand Prairie', 'Mesquite', 'Carrollton', 'Richardson', 'Lewisville', 'Coppell']
    })
    console.log('✓ Company Information imported')

    // Import Residential Services
    const residentialServices = [
      { title: 'Air Conditioning', slug: 'air-conditioning', description: 'Complete AC installation, repair, and replacement services', icon: 'snowflake', features: ['Fast Response Time', 'Energy Efficient Systems', 'Licensed Technicians', 'Warranty Included'], order: 1 },
      { title: 'Heating', slug: 'heating', description: 'Furnace repair, heat pump service, and heating system installation', icon: 'flame', features: ['Furnace Repair', 'Heat Pump Service', 'System Installation', 'Maintenance Plans'], order: 2 },
      { title: 'Preventative Maintenance', slug: 'preventative-maintenance', description: 'Regular maintenance to keep your HVAC system running efficiently', icon: 'wrench', features: ['Bi-Annual Service', 'Filter Changes', 'System Tune-ups', 'Priority Scheduling'], order: 3 },
      { title: 'Indoor Air Quality', slug: 'indoor-air-quality', description: "Improve your home's air quality with our specialized solutions", icon: 'wind', features: ['Air Purifiers', 'Humidity Control', 'Duct Cleaning', 'UV Light Systems'], order: 4 }
    ]

    console.log('Importing Residential Services...')
    for (const service of residentialServices) {
      await client.createOrReplace({
        _id: `service-residential-${service.slug}`,
        _type: 'service',
        title: service.title,
        slug: { _type: 'slug', current: service.slug },
        category: 'residential',
        description: service.description,
        icon: service.icon,
        features: service.features,
        order: service.order
      })
      console.log(`  ✓ ${service.title}`)
    }

    // Import Commercial Services
    const commercialServices = [
      { title: 'Commercial Air Conditioning', slug: 'commercial-air-conditioning', description: 'Large-scale AC systems for commercial properties', icon: 'building', features: ['Rooftop Units', 'Chiller Systems', 'Professional Service', 'Preventive Maintenance'], order: 1 },
      { title: 'Commercial Heating', slug: 'commercial-heating', description: 'Commercial heating solutions and boiler services', icon: 'factory', features: ['Boiler Service', 'Heat Pumps', 'Radiant Heating', 'Energy Audits'], order: 2 },
      { title: 'Commercial Maintenance', slug: 'commercial-maintenance', description: 'Comprehensive maintenance programs for businesses', icon: 'clipboard-check', features: ['Scheduled Service', 'Fast Response', 'Equipment Monitoring', 'Cost Control'], order: 3 }
    ]

    console.log('Importing Commercial Services...')
    for (const service of commercialServices) {
      await client.createOrReplace({
        _id: `service-commercial-${service.slug}`,
        _type: 'service',
        title: service.title,
        slug: { _type: 'slug', current: service.slug },
        category: 'commercial',
        description: service.description,
        icon: service.icon,
        features: service.features,
        order: service.order
      })
      console.log(`  ✓ ${service.title}`)
    }

    // Import Testimonials
    const testimonials = [
      { name: 'Jesse D.', location: 'DFW Area', rating: 5, text: "I had an excellent experience with DFW HVAC! I just bought a home and needed my HVAC system checked out. They came out the very next day, clearly explained the issue, and provided me with multiple options for resolving it.", service: 'System Inspection', timeAgo: '7 months ago' },
      { name: 'Daniel Ryan', location: 'DFW Area', rating: 5, text: "Jonathan and DFW HVAC were great! We had our AC go out in the middle of the night and reached out to them first thing in the morning. They were responsive and able to get us on their schedule that afternoon. Jonathan was able to diagnose and fix the issue quickly.", service: 'AC Repair', timeAgo: '2 months ago' },
      { name: 'Beth Schneider', location: 'DFW Area', rating: 5, text: "Great experience! They were prompt to respond to initial call and arrange time to come out to assess the issue I was having. They did a great job and very fair price for all the work that was needed. I have complete confidence in the quality of their work.", service: 'HVAC Service', timeAgo: '2 months ago' },
      { name: 'Google Reviews', location: 'Verified Customers', rating: 5, text: "Service tech got there on time and solved the issue quickly. The service was excellent and the price fair. I'm so grateful to have a dependable company to work with.", service: 'Multiple Services', timeAgo: 'Recent reviews' }
    ]

    console.log('Importing Testimonials...')
    for (let i = 0; i < testimonials.length; i++) {
      const t = testimonials[i]
      await client.createOrReplace({
        _id: `testimonial-${i + 1}`,
        _type: 'testimonial',
        name: t.name,
        location: t.location,
        rating: t.rating,
        text: t.text,
        service: t.service,
        timeAgo: t.timeAgo,
        publishedAt: new Date().toISOString()
      })
      console.log(`  ✓ ${t.name}`)
    }

    console.log('\n✅ All data imported successfully!')
  } catch (error) {
    console.error('Error importing data:', error)
  }
}

importData()
