const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'iar2b790',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-01-01',
})

// Priority target list: 24 cities, 47 zip codes
const cities = [
  { cityName: 'Allen', zipCodes: ['75013'], priority: 5 },
  { cityName: 'Argyle', zipCodes: ['76226'], priority: 8 },
  { cityName: 'Bedford', zipCodes: ['76021'], priority: 6 },
  { cityName: 'Carrollton', zipCodes: ['75007', '75010'], priority: 3 },
  { cityName: 'Colleyville', zipCodes: ['76034'], priority: 5 },
  { cityName: 'Coppell', zipCodes: ['75019'], priority: 1 },
  { cityName: 'Dallas', zipCodes: ['75205', '75206', '75209', '75214', '75225', '75229', '75230', '75244', '75248'], priority: 2 },
  { cityName: 'Denton', zipCodes: ['76210'], priority: 7 },
  { cityName: 'Euless', zipCodes: ['76039'], priority: 6 },
  { cityName: 'Farmers Branch', zipCodes: ['75234'], priority: 4 },
  { cityName: 'Flower Mound', zipCodes: ['75022', '75028', '75077'], priority: 3 },
  { cityName: 'Fort Worth', zipCodes: ['76118', '76137', '76177'], priority: 6 },
  { cityName: 'Frisco', zipCodes: ['75033', '75034', '75035', '75036'], priority: 4 },
  { cityName: 'Grapevine', zipCodes: ['76051'], priority: 2 },
  { cityName: 'Hurst', zipCodes: ['76054'], priority: 6 },
  { cityName: 'Irving', zipCodes: ['75063'], priority: 3 },
  { cityName: 'Keller', zipCodes: ['76244', '76248'], priority: 5 },
  { cityName: 'Lake Dallas', zipCodes: ['75065'], priority: 7 },
  { cityName: 'North Richland Hills', zipCodes: ['76148', '76182'], priority: 6 },
  { cityName: 'Plano', zipCodes: ['75023', '75024', '75025', '75075', '75093'], priority: 3 },
  { cityName: 'Richardson', zipCodes: ['75080', '75081'], priority: 4 },
  { cityName: 'Roanoke', zipCodes: ['76262'], priority: 7 },
  { cityName: 'Southlake', zipCodes: ['76092'], priority: 4 },
  { cityName: 'The Colony', zipCodes: ['75056'], priority: 5 },
]

// City descriptions for local SEO
const cityDescriptions = {
  'Coppell': 'Located in the heart of the DFW metroplex, Coppell is known for its excellent schools, family-friendly neighborhoods, and convenient access to both Dallas and Fort Worth. Originally a small farming community, Coppell has grown into one of the most desirable suburbs in North Texas.',
  'Dallas': 'As the heart of the DFW metroplex, Dallas is a vibrant city known for its diverse neighborhoods, world-class dining, and thriving business community. From the historic homes of Highland Park to the modern developments of North Dallas, our team provides HVAC services across the city.',
  'Grapevine': 'Grapevine combines small-town Texas charm with modern amenities, featuring a historic downtown, excellent wineries, and proximity to DFW International Airport. The city\'s unique character and growing population make it one of our most valued service areas.',
  'Flower Mound': 'Nestled along the shores of Grapevine Lake, Flower Mound offers residents beautiful natural surroundings, top-rated schools, and a strong sense of community. The town\'s commitment to preserving green spaces makes it a unique suburb in the DFW area.',
  'Plano': 'Plano has evolved from a small farming community to one of the largest cities in Texas, known for its corporate headquarters, excellent schools, and diverse population. The city offers a mix of established neighborhoods and new developments.',
  'Frisco': 'One of the fastest-growing cities in America, Frisco is known for its professional sports venues, upscale shopping, and family-oriented communities. The city\'s rapid growth brings both new construction and established homes needing HVAC services.',
  'Carrollton': 'Carrollton offers a central location in the metroplex with easy access to major highways and DART rail service. The city features diverse neighborhoods ranging from historic areas to new developments.',
  'Irving': 'Home to the Las Colinas urban center and numerous Fortune 500 companies, Irving combines business sophistication with residential comfort. The city\'s diverse housing stock includes everything from apartments to luxury homes.',
  'Richardson': 'Known as the "Telecom Corridor," Richardson is home to numerous technology companies and the University of Texas at Dallas. The city offers well-established neighborhoods with mature trees and excellent community amenities.',
  'Southlake': 'Southlake is one of the most affluent communities in Texas, known for its award-winning schools, upscale shopping at Southlake Town Square, and beautiful residential areas. Homeowners here expect premium service.',
}

function createSlug(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function seedCities() {
  console.log('Starting to seed city pages...\n')
  
  for (const city of cities) {
    const slug = createSlug(city.cityName)
    const doc = {
      _type: 'cityPage',
      _id: `city-${slug}`,
      cityName: city.cityName,
      slug: { _type: 'slug', current: slug },
      zipCodes: city.zipCodes,
      isPublished: true,
      priority: city.priority,
      cityDescription: cityDescriptions[city.cityName] || null,
    }
    
    try {
      const result = await client.createOrReplace(doc)
      console.log(`✓ Created: ${city.cityName} (${city.zipCodes.length} zip codes)`)
    } catch (error) {
      console.error(`✗ Error creating ${city.cityName}:`, error.message)
    }
  }
  
  console.log('\n✅ Seeding complete!')
  console.log(`Total cities: ${cities.length}`)
  console.log(`Total zip codes: ${cities.reduce((sum, c) => sum + c.zipCodes.length, 0)}`)
}

seedCities()
