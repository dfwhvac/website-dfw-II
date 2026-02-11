/**
 * Update business hours in Sanity CMS
 * Run with: node scripts/update-business-hours.mjs
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

async function updateBusinessHours() {
  // Find the companyInfo document
  const docs = await client.fetch('*[_type == "companyInfo"]{ _id }')
  
  if (docs.length === 0) {
    console.log('No companyInfo document found')
    return
  }

  for (const doc of docs) {
    console.log(`Updating business hours for document: ${doc._id}`)
    await client
      .patch(doc._id)
      .set({
        businessHours: {
          monday: '9AM-6PM',
          tuesday: '9AM-6PM',
          wednesday: '9AM-6PM',
          thursday: '9AM-6PM',
          friday: '9AM-6PM',
          saturday: 'Closed',
          sunday: 'Closed',
        }
      })
      .commit()
    console.log('Business hours updated successfully')
  }
}

updateBusinessHours().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
