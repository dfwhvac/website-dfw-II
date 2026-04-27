import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BreadcrumbListSchema, FAQSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { getReviewBadgeCount, buildTitleWithBadge } from '@/lib/metadata'
import {
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Scale,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PHONE_TEL = 'tel:+19727772665'
const PHONE_DISPLAY = '(972) 777-COOL'

// FAQ content declared at module scope so it can be used for both schema + render.
const FAQS = [
  {
    _id: 'ror1',
    question: 'At what age is it usually smarter to replace than repair?',
    answer:
      'For most central AC systems in the DFW climate, the tipping point is around 12–15 years. Heat pumps hit the same range. Gas furnaces last longer — typically 15–20 years — but they often share a coil and blower with the AC, so if the AC dies on an older furnace, it can be cheaper to replace both together. The specific "replace now" decision depends more on the repair cost relative to replacement cost than on age alone.',
  },
  {
    _id: 'ror2',
    question: 'How do I know if the repair is worth it?',
    answer:
      'Run this quick math: multiply the repair quote by the system\'s age in years. If the result is more than $5,000, replacement almost always wins over the next 5 years. Example: a $1,500 compressor repair on a 10-year-old system → 1,500 × 10 = $15,000. That\'s the "50% rule" translated for current DFW equipment pricing.',
  },
  {
    _id: 'ror3',
    question: 'What about R-22 or older refrigerant systems?',
    answer:
      'R-22 was phased out for new production in 2020 and is now dramatically more expensive per pound — often $80–$150+ per pound versus $25–$50 for R-410A. Any significant R-22 leak repair can easily exceed $1,500 just in refrigerant. If your system still runs R-22 and needs a refrigerant-related repair, that usually tips straight to replacement.',
  },
  {
    _id: 'ror4',
    question: 'Will a new system actually lower my electric bill?',
    answer:
      'Yes, and often more than people expect. Upgrading from a 14-SEER system to a 17-SEER system drops cooling energy use by roughly 18%. Going to a 20-SEER variable-speed system can cut it by 30%+. In DFW where summer cooling runs 6 months a year, that difference shows up on every monthly bill from May through October.',
  },
  {
    _id: 'ror5',
    question: 'What if I can\'t afford a replacement right now?',
    answer:
      'We partner with Wisetack to offer up to 24 months at 0% APR on approved credit, plus longer-term options. Pre-qualification takes under a minute with a soft credit check (no impact to your score). For many homeowners, the monthly payment on a new, efficient system is close to — or even less than — what they were paying on repairs and inflated energy bills.',
  },
  {
    _id: 'ror6',
    question: 'Is there a time of year that\'s better for replacement?',
    answer:
      'Shoulder seasons (spring and fall) are ideal — installers have more schedule flexibility, and you\'re not racing a heat wave or freeze. That said, equipment pricing doesn\'t change seasonally, and if your system is failing mid-summer, waiting costs more in repairs and comfort than scheduling immediately.',
  },
]

export async function generateMetadata() {
  // P1.15 repair-or-replace article (Apr 24, 2026). Title targets the top-volume
  // decision-framework query for this category. AEO-oriented — Google and
  // ChatGPT both cite decision-framework content for these queries.
  const companyInfo = await getCompanyInfo()
  const count = getReviewBadgeCount(companyInfo || mockCompanyInfo)
  return {
    title: buildTitleWithBadge({
      prefix: 'Repair or Replace Your HVAC? A DFW Decision Guide',
      count,
      includeBrand: true,
    }),
    description:
      'Should you repair or replace your AC, furnace, or HVAC system? A practical cost-benefit framework from a three-generation DFW HVAC contractor. Age, repair cost, efficiency, refrigerant, and a clear decision flow.',
    alternates: {
      canonical: '/repair-or-replace',
    },
  }
}

export default async function RepairOrReplacePage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) companyInfo = mockCompanyInfo

  const siteSettings = await getSiteSettings()

  const breadcrumbs = [
    { name: 'Home', url: 'https://dfwhvac.com/' },
    { name: 'Repair or Replace', url: 'https://dfwhvac.com/repair-or-replace' },
  ]

  // Article schema — JSON-LD signals this is long-form editorial content to
  // AI answer engines. Improves odds of citation in AI Overviews for
  // "should I repair or replace my hvac" style queries.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Repair or Replace Your HVAC? A DFW Decision Guide',
    description:
      'A practical cost-benefit framework for deciding whether to repair or replace your AC, furnace, or HVAC system in Dallas-Fort Worth.',
    author: { '@type': 'Organization', name: 'DFW HVAC' },
    publisher: { '@type': 'Organization', name: 'DFW HVAC' },
    datePublished: '2026-04-24',
    dateModified: '2026-04-24',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://dfwhvac.com/repair-or-replace',
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbListSchema items={breadcrumbs} />
      <FAQSchema faqs={FAQS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />

      {/* Hero */}
      <section
        className="py-16 lg:py-24 text-white bg-gradient-to-br from-prussian-blue to-electric-blue"
        data-testid="repair-or-replace-hero"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-6">
              <Scale className="w-4 h-4" aria-hidden="true" />
              Decision Guide for DFW Homeowners
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Should You <span className="text-growth-green">Repair</span> or
              <span className="text-growth-green"> Replace</span> Your HVAC?
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
              A straightforward framework built from three generations of HVAC work
              in the DFW climate. No hard-sell. Just the math, the thresholds, and
              the honest answer for your situation.
            </p>
          </div>
        </div>
      </section>

      {/* TL;DR */}
      <section className="py-10 bg-growth-green/10 border-y border-growth-green/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-sm font-semibold text-prussian-blue uppercase tracking-wider mb-2">
              The Short Answer
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed">
              <strong>Replace if:</strong> your system is 12+ years old <em>and</em>
              the repair quote × age in years is over $5,000 <em>or</em> it uses R-22
              refrigerant <em>or</em> this is your second major repair in 12 months.
              Otherwise, repair — and plan for replacement inside 3 years.
            </p>
          </div>
        </div>
      </section>

      {/* 5 signs */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              5 Signs It&apos;s Time to Replace
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Any one of these is a yellow flag. Two or more is a clear green light
              for replacement.
            </p>
            <ol className="space-y-6">
              <Sign
                number="1"
                title="Your system is 12+ years old"
                body="DFW's summer load is brutal. Most central AC systems installed here hit a reliability cliff between years 12 and 15 — compressors start to fail, coils start to leak, and efficiency drops year over year. Gas furnaces last longer (15–20 years), but they often share components with the AC."
              />
              <Sign
                number="2"
                title="The repair quote × age in years exceeds $5,000"
                body={`This is the "50% rule" updated for 2025+ refrigerant and parts pricing. Example: a $1,500 repair on a 10-year-old system = $15,000 — replacement wins over the next 5 years. A $500 repair on a 6-year-old system = $3,000 — repair is the right call.`}
              />
              <Sign
                number="3"
                title="The system uses R-22 refrigerant"
                body="R-22 has been phased out and now costs 3–5× more per pound than modern refrigerants. Any sealed-system repair on an R-22 unit usually exceeds $1,500 in refrigerant alone. If your nameplate says R-22, assume replacement is the answer."
              />
              <Sign
                number="4"
                title="Two or more repair visits in the last 12 months"
                body="Cascading failures are how HVAC systems tell you they're done. Capacitor, then contactor, then blower motor — each repair individually is affordable; stacked together, you're paying for a new system one part at a time while enjoying none of the efficiency gains."
              />
              <Sign
                number="5"
                title="Your electric bill keeps climbing and rooms are uneven"
                body="Declining efficiency compounds. A 15-year-old 10-SEER system in DFW can cost $100–$200 more per summer month to cool the same house than a modern 17-SEER variable-speed unit. Uneven room temperatures usually indicate airflow imbalance that a new, properly-sized system resolves."
              />
            </ol>
          </div>
        </div>
      </section>

      {/* Cost-benefit table */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Cost-Benefit by System Age
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              General DFW-climate guidance. Your specific system, home, and refrigerant
              type will shift these brackets — but this is the shape of the decision.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
              <table className="w-full text-left">
                <thead className="bg-prussian-blue text-white">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold">System Age</th>
                    <th className="px-5 py-4 text-sm font-semibold">Typical Best Move</th>
                    <th className="px-5 py-4 text-sm font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <TableRow
                    age="0–7 years"
                    move="Repair"
                    moveColor="text-success-green"
                    why="Under warranty or near it. Parts are cheap, refrigerant is modern, efficiency is still competitive."
                  />
                  <TableRow
                    age="8–11 years"
                    move="Usually repair"
                    moveColor="text-success-green"
                    why="Evaluate using the age × quote ÷ $5,000 rule. Capacitors, contactors, and thermostat work almost always worth repairing at this age."
                  />
                  <TableRow
                    age="12–15 years"
                    move="Case-by-case"
                    moveColor="text-alert-amber"
                    why="Small repairs OK. Big-ticket repairs (compressor, evaporator coil, heat exchanger) — strongly consider replacement, especially if efficiency and refrigerant are outdated."
                  />
                  <TableRow
                    age="16+ years"
                    move="Replace"
                    moveColor="text-vivid-red"
                    why="Parts availability drops, warranty is long gone, SEER ratings are obsolete, and the next failure is a matter of when — not if."
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Decision flow */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Decision Flow
            </h2>
            <ol className="space-y-4">
              <FlowStep
                step="1"
                title="Is your system under 8 years old?"
                result="Yes → Repair. Move on with your day."
                resultIcon={CheckCircle2}
                resultColor="text-success-green"
              />
              <FlowStep
                step="2"
                title="Does it use R-22 refrigerant?"
                result="Yes → Replace. Repairs will keep getting more expensive every year."
                resultIcon={XCircle}
                resultColor="text-vivid-red"
              />
              <FlowStep
                step="3"
                title="Is the repair quote × age greater than $5,000?"
                result="Yes → Replace. The math doesn't recover."
                resultIcon={XCircle}
                resultColor="text-vivid-red"
              />
              <FlowStep
                step="4"
                title="Has it needed two or more repairs in the last 12 months?"
                result="Yes → Replace. You're buying a new system in installments — better to get the efficiency gains up front."
                resultIcon={XCircle}
                resultColor="text-vivid-red"
              />
              <FlowStep
                step="5"
                title="None of the above true?"
                result="Repair — and start budgeting for replacement inside 3 years."
                resultIcon={CheckCircle2}
                resultColor="text-success-green"
              />
            </ol>
            <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-electric-blue shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Still uncertain? That&apos;s what the free estimate is for.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  A licensed tech inspects the system, runs the numbers with you, and
                  gives you a written quote for either repair or replacement — no
                  obligation, no pushy sales. You decide on your schedule, not ours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (the rendered version — schema is emitted via FAQSchema above) */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((faq) => (
                <details key={faq._id} className="group bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                  <summary className="cursor-pointer font-semibold text-gray-900 text-lg flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-electric-blue text-2xl leading-none group-open:rotate-45 transition-transform shrink-0" aria-hidden="true">+</span>
                  </summary>
                  <p className="text-gray-600 mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-20 text-white bg-gradient-to-br from-prussian-blue to-electric-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready for a Real Answer?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Stop guessing. A 45-minute free estimate visit gets you a written,
              line-itemed quote for repair <em>and</em> replacement — so you can
              make the call with real numbers in front of you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 bg-growth-green hover:bg-growth-green/90 text-prussian-blue font-bold px-8 py-4 rounded-md text-lg shadow-lg transition-colors"
                data-testid="ror-final-estimate-cta"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Get a Free Written Estimate
              </Link>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-md text-lg border-2 border-white/40 transition-colors"
                data-testid="ror-final-phone-cta"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center text-sm text-blue-200">
              <Link href="/replacement-estimator" className="hover:text-white underline inline-flex items-center gap-1">
                Try our replacement estimator <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link href="/services/system-replacement" className="hover:text-white underline inline-flex items-center gap-1">
                Explore system replacement <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link href="/financing" className="hover:text-white underline inline-flex items-center gap-1">
                See financing options <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}

function Sign({ number, title, body }) {
  return (
    <li className="flex gap-5">
      <div className="shrink-0 w-12 h-12 rounded-full bg-prussian-blue text-white flex items-center justify-center font-bold text-lg shadow-md">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{body}</p>
      </div>
    </li>
  )
}

function TableRow({ age, move, moveColor, why }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">{age}</td>
      <td className={`px-5 py-4 font-bold ${moveColor} whitespace-nowrap`}>{move}</td>
      <td className="px-5 py-4 text-gray-600 text-sm">{why}</td>
    </tr>
  )
}

function FlowStep({ step, title, result, resultIcon: ResultIcon, resultColor }) {
  return (
    <li className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-50 border border-electric-blue text-electric-blue flex items-center justify-center font-bold text-sm">
          {step}
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 mb-2">{title}</p>
          <div className="flex items-start gap-2">
            <ResultIcon className={`w-5 h-5 ${resultColor} shrink-0 mt-0.5`} aria-hidden="true" />
            <p className="text-gray-700 leading-relaxed">{result}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
