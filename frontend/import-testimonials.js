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

// Calculate "time ago" from a date
function getTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays < 1) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  if (diffDays < 730) return '1 year ago'
  return `${Math.floor(diffDays / 365)} years ago`
}

async function importTestimonials() {
  // Check for token
  if (!process.env.SANITY_API_TOKEN) {
    console.error('Error: SANITY_API_TOKEN environment variable is required')
    console.log('\nUsage: SANITY_API_TOKEN=your_token node import-testimonials.js [path/to/file.csv]')
    process.exit(1)
  }

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
    
    // Parse the published date
    const publishedDate = t.publishedDate ? new Date(t.publishedDate) : new Date()
    const timeAgo = getTimeAgo(t.publishedDate || new Date().toISOString())
    
    await client.create({
      _type: 'testimonial',
      name: t.name,
      location: t.location || 'DFW Area',
      rating: parseInt(t.rating) || 5,
      service: t.service || 'HVAC Service',
      timeAgo: timeAgo,
      text: t.text,
      publishedAt: publishedDate.toISOString()
    })
    
    console.log(`  ✓ ${i + 1}. ${t.name} (${timeAgo})`)
  }
  
  console.log(`\n✅ Successfully imported ${testimonials.length} testimonials!`)
}

importTestimonials().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
