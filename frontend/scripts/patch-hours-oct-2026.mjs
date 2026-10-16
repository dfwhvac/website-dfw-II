/**
 * Write the Oct 16, 2026 operating hours into Sanity.
 * Mon–Thu 8AM–6PM, Friday 8AM–5PM, weekends closed.
 *
 * Run from frontend/ with SANITY_API_TOKEN in .env.local:
 *   node scripts/patch-hours-oct-2026.mjs
 *
 * Does not unset other fields. Safe to re-run.
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'iar2b790'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('ERROR: SANITY_API_TOKEN missing. Add it to frontend/.env.local and retry.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

const BUSINESS_HOURS = {
  monday: '8AM-6PM',
  tuesday: '8AM-6PM',
  wednesday: '8AM-6PM',
  thursday: '8AM-6PM',
  friday: '8AM-5PM',
  saturday: 'Closed',
  sunday: 'Closed',
}

const CONTACT_META =
  'Contact DFW HVAC for heating and cooling service across Dallas-Fort Worth. Open Mon–Thu 8 AM–6 PM, Fri 8 AM–5 PM. Same-day service available.'

const FAQ_PATCHES = [
  {
    _id: 'faq-rs3',
    answer:
      'Yes, we offer same-day HVAC repair services throughout the Dallas-Fort Worth area during our business hours (Monday–Thursday, 8 AM – 6 PM, and Friday, 8 AM – 5 PM). When your AC fails on a hot Texas summer day or your heater stops working during a cold snap, call us and we will get a technician to you as quickly as possible.',
  },
  {
    _id: 'faq-c3',
    answer:
      'Absolutely. We understand business disruption costs money. We offer flexible scheduling within our operating hours (Monday–Thursday, 8 AM – 6 PM, and Friday, 8 AM – 5 PM) to minimize impact on your operations.',
  },
  {
    _id: 'faq-rsc3',
    answer:
      'Our regular business hours are Monday through Thursday, 8:00 AM to 6:00 PM, and Friday, 8:00 AM to 5:00 PM. We are closed on Saturday and Sunday.',
  },
  {
    _id: '2b207bd8-9bd7-40e3-82fa-6264e4704b10',
    answer:
      'Our office is open Monday through Thursday from 8 AM to 6 PM, and Friday from 8 AM to 5 PM. Emergency calls placed during business hours are dispatched same-day when available; voicemails left after hours are returned the next business morning.',
  },
]

async function run() {
  const company = await client.patch('companyInfo').set({ businessHours: BUSINESS_HOURS }).commit()
  console.log('companyInfo hours →', company._rev)

  const contact = await client.fetch('*[_type == "contactPage"][0]{_id}')
  if (contact?._id) {
    const result = await client
      .patch(contact._id)
      .set({
        metaDescription: CONTACT_META,
        phoneDescription: 'Same-day service Mon–Fri',
      })
      .commit()
    console.log('contactPage →', result._rev)
  } else {
    console.log('No contactPage document found')
  }

  const pageContact = await client.fetch('*[_id == "page-contact"][0]{_id}')
  if (pageContact?._id) {
    const result = await client.patch(pageContact._id).set({ metaDescription: CONTACT_META }).commit()
    console.log('page-contact →', result._rev)
  }

  for (const patch of FAQ_PATCHES) {
    const { _id, ...fields } = patch
    const result = await client.patch(_id).set(fields).commit()
    console.log(_id, '→', result._rev)
  }

  console.log('Hours patch committed.')
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
