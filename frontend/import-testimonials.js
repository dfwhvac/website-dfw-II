const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Sanity client setup
const client = createClient({
  projectId: 'iar2b790',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Parse CSV (simple parser for this format)
function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim())
  const headers = parseCSVLine(lines[0])
  const records = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const record = {}
    headers.forEach((header, index) => {
      record[header.trim()] = values[index]?.trim() || ''
    })
    records.push(record)
  }
  return records
}

// Parse a single CSV line (handles quoted values with commas)
function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

async function importTestimonials() {
  // Read the CSV file
  const csvPath = process.argv[2] || path.join(__dirname, 'testimonials-template.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error(`File not found: ${csvPath}`)
    console.log('\nUsage: SANITY_API_TOKEN=your_token node import-testimonials.js [path/to/file.csv]')
    process.exit(1)
  }
  
  console.log(`Reading: ${csvPath}\n`)
  const content = fs.readFileSync(csvPath, 'utf-8')
  const testimonials = parseCSV(content)
  
  console.log(`Found ${testimonials.length} testimonials to import\n`)
  
  // First, delete existing testimonials
  console.log('Removing existing testimonials...')
  const existing = await client.fetch('*[_type == "testimonial"]._id')
  for (const id of existing) {
    await client.delete(id)
  }
  console.log(`Deleted ${existing.length} existing testimonials\n`)
  
  // Import new testimonials
  console.log('Importing new testimonials...')
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    
    // Create a date offset so they sort properly (newest first)
    const date = new Date()
    date.setDate(date.getDate() - i) // Each review is 1 day older
    
    await client.create({
      _type: 'testimonial',
      name: t.name,
      location: t.location || 'DFW Area',
      rating: parseInt(t.rating) || 5,
      service: t.service || 'HVAC Service',
      timeAgo: t.timeAgo || 'Recently',
      text: t.text,
      publishedAt: date.toISOString()
    })
    
    console.log(`  ✓ ${i + 1}. ${t.name}`)
  }
  
  console.log(`\n✅ Successfully imported ${testimonials.length} testimonials!`)
}

importTestimonials().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
