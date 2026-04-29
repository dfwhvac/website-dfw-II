/**
 * One-time Sanity content patch for the `commercial-maintenance` service.
 *
 * Mirrors `patch-commercial-heating.js` and `patch-commercial-cooling.js`.
 * As of Feb 2026 the `commercial-maintenance` Sanity doc only had `title`,
 * `description`, and `heroBenefits` populated. Every other structured field
 * (whatWeDoItems, processSteps, whyChooseUsReasons, emergencyTitle/Desc/Features,
 * faqs, metaDescription) was null and rendered as the generic template
 * fallback — risking duplicate-content rejection in GSC.
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *
 *   node scripts/patch-commercial-maintenance.js
 *
 * Idempotent: re-running overwrites the same fields with the same values.
 */
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('next-sanity')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity env vars (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN).')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
})

// ---------- Differentiated commercial-maintenance content ----------
const patch = {
  description:
    'Commercial HVAC preventative maintenance for DFW businesses — scheduled rooftop, chiller, boiler, and split-system tune-ups under flat-rate contracts. Priority dispatch, written equipment reports, COIs on file.',

  metaDescription:
    'Commercial HVAC preventative maintenance contracts for DFW businesses. Rooftop, chiller, boiler tune-ups. Priority dispatch. Call (972) 777-2665.',

  heroSubtitle: 'Preventative Maintenance Built for Commercial Runtime',

  heroDescription:
    'Commercial HVAC failures rarely happen on schedule — they happen on the hottest day, the coldest night, or right before a Friday close. A structured preventative maintenance contract catches the small problems (a slipping belt, a 2-degree refrigerant subcool drift, a clogged condensate line) before they cascade into a no-cool, no-heat, or refrigerant leak. Our PM contracts are sized to your actual equipment and runtime, not a one-size brochure.',

  heroBenefits: [
    'Flat-rate maintenance contracts sized to your equipment',
    'Priority dispatch for contracted clients (24/7)',
    'Two visits per year minimum (more for higher-runtime sites)',
    'Written equipment inventory and condition report after every visit',
    'COIs and W-9s on file for facilities and property managers',
  ],

  whatWeDoItems: [
    'Spring cooling-season tune-ups: refrigerant pressures, condenser coil cleaning, capacitor and contactor check',
    'Fall heating-season tune-ups: combustion analysis, heat exchanger inspection, gas pressure verification',
    'Filter changes on every visit (we stock common 1", 2", and 4" sizes on the truck)',
    'Belt, bearing, and motor inspection on rooftop and AHU units',
    'Condensate drain flush and treatment to prevent overflow shutdowns',
    'Refrigerant leak inspection with EPA-compliant logging',
    'Thermostat and BMS calibration checks',
    'Equipment inventory updated after every visit (model, serial, install date, condition)',
  ],

  processSteps: [
    {
      step: 1,
      title: 'Walk-through and inventory',
      description:
        'A senior tech walks your facility, captures every unit (rooftop, split, chiller, boiler), photographs nameplates, and builds a baseline equipment inventory in our system.',
    },
    {
      step: 2,
      title: 'Right-sized contract proposal',
      description:
        'We propose a contract — typically two visits per year for light commercial, quarterly for higher-runtime sites — with flat per-visit pricing and clear inclusions/exclusions.',
    },
    {
      step: 3,
      title: 'Scheduled visits + reminder',
      description:
        'You receive a calendar with every visit pre-scheduled around your operating hours. We send a 7-day and 24-hour reminder before each visit so on-site contacts aren\'t surprised.',
    },
    {
      step: 4,
      title: 'On-site PM + written report',
      description:
        'Tech executes the season-appropriate PM checklist for each unit, replaces filters, cleans coils, and leaves a written condition report (with photos for any flagged issues) before they leave.',
    },
    {
      step: 5,
      title: 'Repair quotes and budget planning',
      description:
        'For any equipment flagged in the report, you receive a quote within 48 hours so capital planning, replacement budgeting, and approvals stay ahead of failure.',
    },
  ],

  whyChooseUsReasons: [
    'Three-generation family business — the same techs return for every PM visit',
    'Flat-rate per-visit pricing, no surprise charges on routine maintenance',
    'Priority emergency dispatch included for contracted clients',
    'Written equipment inventory and condition report after every visit',
    'EPA 608-certified refrigerant handling and logging on every PM',
    'Honest reports — we tell you when a unit is healthy, not just sell parts',
  ],

  emergencyTitle: 'Priority Dispatch for PM Contract Customers',

  emergencyDescription:
    'When a contracted unit goes down between scheduled visits, you skip the queue. PM contract customers get priority dispatch, including after-hours and weekends, and the on-call tech already has your equipment inventory on their tablet — no rediscovery, no guessing on model and serial. The result is faster diagnosis, lower truck-roll friction, and shorter downtime.',

  emergencyFeatures: [
    'Priority dispatch ahead of non-contracted calls',
    'After-hours, weekend, and holiday coverage',
    'On-call tech arrives with your full equipment inventory pre-loaded',
    'Discounted labor and parts during emergency calls',
    'Direct line for property managers and facilities teams',
  ],

  faqs: [
    {
      _key: 'cm-faq-1',
      question: 'How often should commercial HVAC equipment be serviced?',
      answer:
        'For light commercial (small offices, retail), two visits per year is standard — one pre-cooling-season (Feb–Mar) and one pre-heating-season (Sep–Oct). Higher-runtime facilities (restaurants, medical, 24/7 operations) typically run quarterly. Manufacturer warranties on most rooftop and chiller equipment require documented PM to remain valid, so the right cadence is the one that protects your warranty and uptime.',
    },
    {
      _key: 'cm-faq-2',
      question: 'What is included in a typical PM visit?',
      answer:
        'A season-appropriate checklist: filter change, coil inspection and cleaning, refrigerant pressure check (cooling season) or combustion analysis (heating season), electrical component test (capacitors, contactors, motor amp draw), belt and bearing inspection, condensate drain flush, thermostat calibration, and a written report with photos of anything flagged. We do NOT include parts/repairs in the PM fee — those are quoted separately and approved before any work happens.',
    },
    {
      _key: 'cm-faq-3',
      question: 'Do you cover multi-tenant or property-managed buildings?',
      answer:
        'Yes — we work with property managers, facilities teams, and multi-tenant landlords across DFW. We hold COIs on file naming the property manager and/or building owner, follow building-specific access protocols (after-hours card access, badge sign-in), and can provide consolidated invoicing across multiple tenant suites or properties.',
    },
    {
      _key: 'cm-faq-4',
      question: 'Do PM customers receive priority emergency response?',
      answer:
        'Yes. Contracted PM customers move ahead of non-contracted calls in our dispatch queue, including after-hours and weekends. The on-call tech also arrives with your full equipment inventory pre-loaded, so diagnosis and parts identification happen faster.',
    },
    {
      _key: 'cm-faq-5',
      question: 'Can you take over a PM contract from our current vendor?',
      answer:
        'Yes — we onboard new commercial accounts year-round. We\'ll do a no-charge walk-through, capture your equipment inventory, and propose a contract that matches or exceeds your current scope, typically with clearer pricing and a more detailed written report. We honor any existing manufacturer-warranty PM requirements during the transition.',
    },
    {
      _key: 'cm-faq-6',
      question: 'How is pricing structured on commercial maintenance contracts?',
      answer:
        'Flat per-visit pricing based on equipment count, equipment type, and visit frequency — billed quarterly or annually, your preference. We do not use surprise add-on fees on a routine PM visit. Repairs, parts, and emergency calls are quoted separately and require your approval before any work begins.',
    },
  ],
}

async function run() {
  const doc = await client.fetch(
    `*[_type == "service" && slug.current == "commercial-maintenance"][0]{ _id, title }`,
  )
  if (!doc?._id) {
    console.error('No service document found with slug "commercial-maintenance".')
    process.exit(1)
  }
  console.log('Patching service document', doc._id, '—', doc.title)

  const result = await client.patch(doc._id).set(patch).commit()
  console.log('Patch committed. Revision:', result._rev)
  console.log('Fields written:', Object.keys(patch).join(', '))
}

run().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
