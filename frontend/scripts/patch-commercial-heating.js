/**
 * One-time Sanity content patch for the `commercial-heating` service document.
 *
 * Why this script exists
 * ----------------------
 * As of Apr 27, 2026 the Sanity `commercial-heating` document had only `title`,
 * `description`, `heroSubtitle`, and `heroDescription` populated — every other
 * structured field (heroBenefits, whatWeDoItems, processSteps, whyChooseUsReasons,
 * emergencyTitle/Description/Features, faqs, metaDescription) was null. The dynamic
 * service template (`app/services/[category]/[slug]/page.jsx`) falls back to generic
 * placeholders for those nulls, which made the rendered page near-duplicate to
 * `commercial-air-conditioning` and `residential/heating`. This is the single page
 * Google explicitly rejected ("Crawled — currently not indexed") in the Apr 27
 * indexing audit (`/app/memory/audits/2026-04-27_Site_Indexing_Audit.md`).
 *
 * Run from /app/frontend with the SANITY_API_TOKEN already present in .env.local:
 *
 *   node scripts/patch-commercial-heating.js
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

// ---------- Differentiated commercial-heating content ----------
const patch = {
  // Slightly tightened description (kept short for cards/listings).
  description:
    'Commercial heating service for DFW businesses — rooftop units, gas-fired furnaces, packaged systems, boilers, and multi-zone setups. Same-day response, after-hours available, certificates of insurance on file.',

  metaDescription:
    'Commercial heating repair, installation & service for DFW businesses. Rooftop units, boilers, multi-zone, after-hours. Call (972) 777-2665.',

  heroSubtitle: 'Commercial Heating That Keeps Your Business Open',

  heroDescription:
    'When the heat goes out, your customers, employees, and bottom line all feel it. Our commercial team services rooftop package units, gas-fired furnaces, boilers, heat pumps, and multi-zone systems across Dallas-Fort Worth — with same-day response and after-hours availability for facilities that can\'t afford to wait until morning.',

  heroBenefits: [
    'Same-day commercial response across DFW',
    'After-hours and weekend service available',
    'Rooftop units (RTUs), boilers, package units, heat pumps',
    'Multi-zone and VAV system experience',
    'Certificates of insurance on file for property managers',
  ],

  whatWeDoItems: [
    'Rooftop package unit (RTU) repair and replacement — gas/electric, heat pump',
    'Commercial gas-fired furnace service, including high-efficiency condensing units',
    'Boiler diagnostics, repair, and seasonal start-up',
    'Multi-zone and VAV (variable air volume) system tuning',
    'Heat pump and ductless mini-split installation for office build-outs',
    'Preventative maintenance contracts with scheduled visits',
    'Building automation and thermostat integration (Honeywell, BACnet)',
    'Emergency no-heat response with priority dispatch',
  ],

  processSteps: [
    {
      step: 1,
      title: 'Triage call',
      description:
        'You call our commercial line. We confirm building access, on-site contact, and unit location, then quote a response window — typically same-day during business hours.',
    },
    {
      step: 2,
      title: 'On-site diagnosis',
      description:
        'A licensed tech evaluates the unit, checks gas/electrical, runs combustion analysis where applicable, and identifies the root cause — not just the symptom.',
    },
    {
      step: 3,
      title: 'Written quote with NTE option',
      description:
        'You receive a line-itemed quote. For property managers and facilities teams, we honor not-to-exceed (NTE) thresholds so approvals stay clean.',
    },
    {
      step: 4,
      title: 'Repair or scheduled replacement',
      description:
        'We complete the repair on the spot when parts are on the truck, or schedule replacement around your operating hours — overnight, weekends, or staged by zone if needed.',
    },
    {
      step: 5,
      title: 'Handoff and maintenance plan',
      description:
        'Tech walks you through what was done, leaves the written report for your records, and offers a preventative maintenance contract sized to your equipment and runtime.',
    },
  ],

  whyChooseUsReasons: [
    'Three-generation family business — same techs return to your facility',
    'Licensed, insured, and background-checked technicians',
    'Certificates of insurance available on file for property managers',
    'After-hours and weekend response with priority dispatch',
    'Not-to-exceed (NTE) quotes available for facilities teams',
    'Honest assessments — we tell you when a repair beats replacement',
  ],

  emergencyTitle: 'Commercial No-Heat Emergency Response',

  emergencyDescription:
    'When commercial heating fails, every hour of downtime has a cost — lost customers, frozen pipes, OSHA-relevant indoor temperatures, or production halts. Our priority commercial dispatch is built for these calls: same-day during business hours, after-hours and weekend coverage, and the diagnostic tools to repair on the first visit whenever parts allow.',

  emergencyFeatures: [
    'Same-day commercial dispatch across DFW',
    'After-hours, weekend, and holiday coverage',
    'Trucks stocked with common RTU and boiler parts',
    'Combustion analysis and gas-leak detection on every call',
    'Direct line for property managers and facilities teams',
  ],

  faqs: [
    {
      _key: 'ch-faq-1',
      question: 'What types of commercial heating systems do you service?',
      answer:
        'We work on rooftop package units (gas/electric and heat pump), commercial gas-fired furnaces (including high-efficiency condensing models), boilers, ductless mini-splits, multi-zone systems, and VAV setups. If your equipment is between 3 tons and 25 tons, we\'ve almost certainly serviced it across the DFW metro.',
    },
    {
      _key: 'ch-faq-2',
      question: 'Do you offer after-hours commercial heating service?',
      answer:
        'Yes — we maintain after-hours dispatch for commercial customers, including weekends and holidays. There is a dispatch fee for off-hours response that\'s disclosed when you call. For facilities and property-management clients on a maintenance contract, after-hours response is prioritized.',
    },
    {
      _key: 'ch-faq-3',
      question: 'Can you provide a certificate of insurance for our property manager?',
      answer:
        'Yes. We carry general liability and workers\' compensation, and we\'ll send a certificate of insurance (COI) naming your property manager or building owner as the certificate holder before we arrive on site. Most COIs we handle within one business day of the request.',
    },
    {
      _key: 'ch-faq-4',
      question: 'Do you honor not-to-exceed (NTE) thresholds for facility approvals?',
      answer:
        'Yes. Many of our facilities and property-management clients operate on NTE caps (often $500, $1,000, or $2,500). Our techs will diagnose, scope the repair, and stop at your NTE threshold for written approval before exceeding it. This keeps your approval process clean and predictable.',
    },
    {
      _key: 'ch-faq-5',
      question: 'How fast can you respond to a commercial no-heat call?',
      answer:
        'During business hours we typically dispatch same-day across the DFW metro, with most calls receiving a tech on site within 4 hours. After-hours, dispatch depends on call volume and your distance from our service center, but we maintain a posted response-time target for contracted clients.',
    },
    {
      _key: 'ch-faq-6',
      question: 'Do you offer commercial preventative maintenance contracts?',
      answer:
        'Yes. We size contracts to your equipment count and runtime — typically two visits per year for light commercial (one pre-cooling-season, one pre-heating-season), with quarterly visits for higher-runtime facilities. Contracts include priority dispatch, discounted parts, and a written equipment inventory after each visit.',
    },
  ],
}

async function run() {
  // First fetch the document by slug to get its _id (Sanity patches require _id, not slug).
  const doc = await client.fetch(
    `*[_type == "service" && slug.current == "commercial-heating"][0]{ _id, title }`,
  )
  if (!doc?._id) {
    console.error('No service document found with slug "commercial-heating".')
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
