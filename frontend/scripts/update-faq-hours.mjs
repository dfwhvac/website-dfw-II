/**
 * Update FAQ business hours in Sanity CMS
 * Run with: node scripts/update-faq-hours.mjs
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

async function updateFaqHours() {
  // Find all FAQ documents that mention old business hours
  const faqs = await client.fetch('*[_type == "faq"]{ _id, question, answer }')
  
  console.log(`Found ${faqs.length} FAQ documents total`)
  
  let updated = 0
  for (const faq of faqs) {
    let newAnswer = faq.answer
    let changed = false
    
    // Fix "What are your business hours?" answer
    if (faq.question && faq.question.toLowerCase().includes('business hours')) {
      newAnswer = 'Our regular business hours are Monday through Friday, 9:00 AM to 6:00 PM. We are closed on Saturday and Sunday.'
      changed = true
    }
    
    // Fix any references to old hours patterns
    if (newAnswer && (
      newAnswer.includes('7:00 AM to 7:00 PM') ||
      newAnswer.includes('8:00 AM to 5:00 PM') ||
      newAnswer.includes('8:00 AM to 1:00 PM') ||
      newAnswer.includes('Monday-Saturday') ||
      newAnswer.includes('Monday through Saturday') ||
      newAnswer.includes('24/7 service') ||
      newAnswer.includes('24/7 emergency') ||
      newAnswer.includes('emergency dispatch')
    )) {
      // Replace old hours patterns
      newAnswer = newAnswer.replace(/Monday through Friday,?\s*7:00 AM to 7:00 PM/gi, 'Monday through Friday, 9:00 AM to 6:00 PM')
      newAnswer = newAnswer.replace(/Saturday\s*8:00 AM to 5:00 PM/gi, 'Saturday and Sunday: Closed')
      newAnswer = newAnswer.replace(/Saturday\s*8:00 AM to 1:00 PM/gi, 'Saturday and Sunday: Closed')
      newAnswer = newAnswer.replace(/\(Monday-Saturday\)/gi, '(Monday-Friday, 9 AM - 6 PM)')
      newAnswer = newAnswer.replace(/Monday through Saturday/gi, 'Monday through Friday')
      newAnswer = newAnswer.replace(/For emergencies, we offer 24\/7 service\. Call our main line anytime and you'll reach our emergency dispatch during off-hours\./gi, '')
      newAnswer = newAnswer.replace(/For weekend issues, we prioritize Monday morning appointments( to get your system back up and running quickly)?\.?/gi, '')
      newAnswer = newAnswer.trim()
      changed = true
    }
    
    if (changed) {
      console.log(`Updating FAQ: "${faq.question}"`)
      console.log(`  New answer: ${newAnswer.substring(0, 100)}...`)
      await client.patch(faq._id).set({ answer: newAnswer }).commit()
      updated++
    }
  }
  
  console.log(`\nUpdated ${updated} FAQ documents`)
}

updateFaqHours().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
