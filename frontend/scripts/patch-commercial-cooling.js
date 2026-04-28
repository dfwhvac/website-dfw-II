/**
 * One-time Sanity content patch for the `commercial-air-conditioning` service.
 *
 * Mirrors `patch-commercial-heating.js` (Apr 27, 2026). As of Feb 2026 the
 * `commercial-air-conditioning` Sanity doc only had `title`, `description`,
 * and `heroBenefits` populated — every other structured field was null, so
 * `app/services/[category]/[slug]/page.jsx` rendered the generic placeholder
 * fallbacks. That makes the page nearly indistinguishable from the residential
 * `air-conditioning` page in Google's eyes (same risk that hit
 * commercial-heating in the Apr 27 indexing audit).
 *
 * Run from /app/frontend with SANITY_API_TOKEN in .env.local:
 *
 *   node scripts/patch-commercial-cooling.js
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

// ---------- Differentiated commercial-air-conditioning content ----------
const patch = {
  description:
    'Commercial AC service for DFW businesses — rooftop units, packaged systems, chillers, VRF/VRV, and multi-zone setups. Same-day response, after-hours coverage, certificates of insurance on file.',

  metaDescription:
    'Commercial AC repair, installation & service for DFW businesses. Rooftop units, chillers, multi-zone, after-hours dispatch. Call (972) 777-2665.',

  heroSubtitle: 'Commercial Cooling That Keeps Your Business Open',

  heroDescription:
    'When your AC goes down, customer comfort, employee productivity, and refrigerated inventory are all on the clock. Our commercial team services rooftop package units (RTUs), chillers, VRF/VRV systems, ductless mini-splits, and multi-zone setups across Dallas-Fort Worth — with same-day response and after-hours availability for facilities that can\'t wait until Monday.',

  heroBenefits: [
    'Same-day commercial response across DFW',
    'After-hours, weekend, and holiday coverage',
    'Rooftop units (RTUs), chillers, VRF/VRV, mini-splits',
    'Multi-zone and VAV system experience',
    'Certificates of insurance on file for property managers',
  ],

  whatWeDoItems: [
    'Rooftop package unit (RTU) repair and replacement — gas/electric and heat pump',
    'Chiller troubleshooting, repair, and seasonal start-up (air- and water-cooled)',
    'VRF / VRV system service for office build-outs and large facilities',
    'Ductless mini-split installation and service for retail and tenant suites',
    'Multi-zone and VAV (variable air volume) system tuning',
    'Refrigerant leak detection, recovery, and EPA-compliant recharge',
    'Building automation and thermostat integration (Honeywell, BACnet)',
    'Preventative maintenance contracts with priority emergency response',
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
        'A licensed tech evaluates the unit, checks refrigerant pressures, electrical, and condenser/evaporator condition, and identifies the root cause — not just the symptom.',
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
    'Licensed, insured, EPA 608-certified technicians',
    'Certificates of insurance available on file for property managers',
    'After-hours and weekend response with priority dispatch',
    'Not-to-exceed (NTE) quotes available for facilities teams',
    'Honest assessments — we tell you when a repair beats replacement',
  ],

  emergencyTitle: 'Commercial AC Emergency Response',

  emergencyDescription:
    'When commercial cooling fails in a Texas summer, every hour of downtime has a cost — lost customers walking out of a hot dining room, refrigerated inventory at risk, OSHA-relevant indoor temperatures, or production halts. Our priority commercial dispatch is built for these calls: same-day during business hours, after-hours and weekend coverage, and the diagnostic tools to repair on the first visit whenever parts allow.',

  emergencyFeatures: [
    'Same-day commercial dispatch across DFW',
    'After-hours, weekend, and holiday coverage',
    'Trucks stocked with common RTU and chiller parts',
    'Refrigerant leak detection and EPA-compliant recovery',
    'Direct line for property managers and facilities teams',
  ],

  faqs: [
    {
      _key: 'cc-faq-1',
      question: 'What types of commercial cooling systems do you service?',
      answer:
        'We work on rooftop package units (gas/electric and heat pump), air- and water-cooled chillers, VRF/VRV systems, ductless mini-splits, and multi-zone/VAV setups. From small light-commercial 5-ton RTUs up through 100+ ton chiller plants, we\'ve almost certainly serviced your equipment class somewhere across the DFW metro.',
    },
    {
      _key: 'cc-faq-2',
      question: 'Do you offer after-hours commercial AC service?',
      answer:
        'Yes — we maintain after-hours dispatch for commercial customers, including weekends and holidays. There is a dispatch fee for off-hours response that\'s disclosed when you call. Facilities and property-management clients on a maintenance contract receive prioritized after-hours response.',
    },
    {
      _key: 'cc-faq-3',
      question: 'Can you provide a certificate of insurance for our property manager?',
      answer:
        'Yes. We carry general liability and workers\' compensation, and we\'ll send a certificate of insurance (COI) naming your property manager or building owner as the certificate holder before we arrive on site. Most COIs we handle within one business day of the request.',
    },
    {
      _key: 'cc-faq-4',
      question: 'Do you handle EPA-regulated refrigerant recovery and recharge?',
      answer:
        'Yes. All our commercial techs are EPA Section 608 certified for refrigerant handling, and we maintain recovery cylinders and leak-detection equipment on every commercial truck. Refrigerant logs are documented for any required compliance reporting.',
    },
    {
      _key: 'cc-faq-5',
      question: 'How fast can you respond to a commercial no-cool call?',
      answer:
        'During business hours we typically dispatch same-day across the DFW metro, with most calls receiving a tech on site within 4 hours. After-hours, dispatch depends on call volume and your distance from our service center, but we maintain a posted response-time target for contracted clients.',
    },
    {
      _key: 'cc-faq-6',
      question: 'Do you offer commercial preventative maintenance contracts?',
      answer:
        'Yes. We size contracts to your equipment count and runtime — typically two visits per year for light commercial (one pre-cooling-season, one pre-heating-season), with quarterly visits for higher-runtime facilities. Contracts include priority dispatch, discounted parts, and a written equipment inventory after each visit.',
    },
  ],
}

async function run() {
  const doc = await client.fetch(
    `*[_type == "service" && slug.current == "commercial-air-conditioning"][0]{ _id, title }`,
  )
  if (!doc?._id) {
    console.error('No service document found with slug "commercial-air-conditioning".')
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
