import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BreadcrumbListSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { getReviewBadgeCount, buildTitleWithBadge } from '@/lib/metadata'
import {
  Phone,
  Calendar,
  CheckCircle2,
  Flame,
  Snowflake,
  Wrench,
  Sparkles,
  AlertTriangle,
  Award,
  Clock,
  DollarSign,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const PHONE_TEL = 'tel:+19727772665'
const PHONE_DISPLAY = '(972) 777-COOL'

export async function generateMetadata() {
  // P1.13 system-replacement page (Apr 24, 2026). Title targets the highest-ticket
  // replacement searches ("hvac replacement dfw", "ac replacement dallas", "new
  // furnace cost dfw"). Option C review-badge logic applies.
  const companyInfo = await getCompanyInfo()
  const count = getReviewBadgeCount(companyInfo || mockCompanyInfo)
  return {
    title: buildTitleWithBadge({
      prefix: 'HVAC System Replacement — Free Written Estimate',
      count,
      includeBrand: true,
    }),
    description:
      'New AC, furnace, or full HVAC system replacement in Dallas-Fort Worth. Free written estimate, honest sizing, transparent install process, and 24-month 0% financing available through Wisetack.',
    alternates: {
      canonical: '/services/system-replacement',
    },
  }
}

export default async function SystemReplacementPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) companyInfo = mockCompanyInfo

  const siteSettings = await getSiteSettings()

  const breadcrumbs = [
    { name: 'Home', url: 'https://dfwhvac.com/' },
    { name: 'Services', url: 'https://dfwhvac.com/services' },
    { name: 'System Replacement', url: 'https://dfwhvac.com/services/system-replacement' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbListSchema items={breadcrumbs} />
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />

      {/* Hero */}
      <section
        className="relative py-20 lg:py-28 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #003153 0%, #0077B6 100%)' }}
        data-testid="system-replacement-hero"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              New HVAC System Installation in DFW
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Time for a New<br />
              <span className="text-lime-300">AC or Furnace?</span>
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
              Full HVAC replacements done right the first time — right-sized for your
              home, installed by licensed technicians, backed by a written estimate
              before any work begins. No surprise up-charges. No pushy sales tactics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-[#003153] font-bold px-8 py-4 rounded-md text-lg shadow-lg transition-colors"
                data-testid="system-replacement-estimate-cta"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Get a Free Written Estimate
              </Link>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-md text-lg border-2 border-white/40 transition-colors"
                data-testid="system-replacement-phone-cta"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              Licensed · Insured · Three-generation family craftsmanship · Up to 24-month 0% financing available
            </p>
          </div>
        </div>
      </section>

      {/* Is it time to replace */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Is It Time to Replace Your System?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Most DFW homeowners wait a summer or two too long. If any of these apply,
                replacement will usually cost less than a third large repair — and save
                real money on your electric bill.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: Clock,
                  title: 'Your system is 12+ years old',
                  body: 'Most DFW systems hit their reliability cliff between 12–15 years. Replacing before the cliff is cheaper than replacing after.',
                },
                {
                  icon: DollarSign,
                  title: 'Repair cost is 30%+ of replacement',
                  body: 'The "50% rule" updated for rising refrigerant costs. Big repairs on old systems rarely pay back.',
                },
                {
                  icon: AlertTriangle,
                  title: 'R-22 / R-410A refrigerant issues',
                  body: 'Phased-out refrigerants make repairs dramatically more expensive. Replacement drops you into a modern, supported refrigerant.',
                },
                {
                  icon: Snowflake,
                  title: 'Rooms are uneven — hot upstairs, cold downstairs',
                  body: 'Airflow imbalance often means the system is undersized, oversized, or the ducts have failed. Replacement is the fix.',
                },
                {
                  icon: Flame,
                  title: 'Electric bill climbed year over year',
                  body: 'A system running harder for the same result is a system losing efficiency. 14 SEER → 17 SEER drops cooling costs 20%+.',
                },
                {
                  icon: Wrench,
                  title: 'Multiple repair calls in 12 months',
                  body: 'Two or more repair visits in a single year is the clearest signal. Stacking repairs on a failing system is throwing good money after bad.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-[#0077B6]/20">
                    <Icon className="w-6 h-6 text-[#0077B6]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center space-y-3">
              <div>
                <Link
                  href="/replacement-estimator"
                  className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-[#003153] font-bold px-6 py-3 rounded-md shadow-md transition-colors"
                  data-testid="system-replacement-estimator-link"
                >
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  See Your Replacement Cost Range →
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  Free instant estimator · No email required · Under 60 seconds
                </p>
              </div>
              <Link
                href="/repair-or-replace"
                className="text-[#0077B6] hover:underline font-semibold text-lg block"
                data-testid="system-replacement-decision-link"
              >
                Not sure yet? Use our repair-or-replace decision guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What affects the cost */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What Affects the Cost of a Replacement
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Every home is different. Rather than quoting a number before we&apos;ve
                seen yours, we walk through the factors below during your free estimate
                and give you a written, line-itemed quote you can take your time with.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CostFactor
                title="Home size & load"
                body="A proper Manual J calculation sizes equipment to your square footage, insulation, window orientation, and DFW climate zone. Undersized = runs forever. Oversized = humid, short-cycling, and dies early."
              />
              <CostFactor
                title="Efficiency tier (SEER2 / AFUE)"
                body="Higher SEER2 cooling or AFUE heating costs more up front and saves more every month. We show you the payback math so you pick the tier that fits your plans for the home."
              />
              <CostFactor
                title="Duct condition & zoning"
                body="Old leaky ducts can waste 20–30% of what your new system produces. If your ducts need work, we'll flag it — replacing the system without addressing the ducts is money down the drain."
              />
              <CostFactor
                title="Single-stage vs variable-speed"
                body="Variable-speed compressors run longer at lower speeds — quieter, more even temperatures, better humidity control in summer. Single-stage is cheaper up front but noticeably less comfortable."
              />
              <CostFactor
                title="Brand & warranty tier"
                body="We install multiple major brands (Carrier, Trane, Lennox, Rheem, Goodman, American Standard). Premium brands carry longer parts warranties; value brands get the job done at a lower entry price."
              />
              <CostFactor
                title="Installation complexity"
                body="Attic vs. closet vs. roof units, electrical panel upgrades, thermostat rewiring, code-required permits. We handle all of it — and itemize every line so nothing's a mystery."
              />
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Our Replacement Process
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Four steps. Start to finish, most single-system replacements are done in
                one day; larger homes or dual-system swaps take two.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Step number="1" title="Free estimate visit" body="We measure, inspect ducts, test airflow, and walk your home. 45–60 minutes. No pressure, no trip fee." />
              <Step number="2" title="Written, line-itemed quote" body="Emailed the same day. Multiple options side-by-side (good / better / best). Take as long as you need to decide." />
              <Step number="3" title="Permits + scheduling" body="We pull the required permit, order your equipment, and lock in an install date that works for you." />
              <Step number="4" title="Install + commissioning" body="Licensed techs, drop cloths, clean job site, full system commissioning, and a walk-through of your new thermostat before we leave." />
            </div>
          </div>
        </div>
      </section>

      {/* Financing preview */}
      <section className="py-16 lg:py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-12 h-12 mx-auto mb-6 text-[#0077B6]" aria-hidden="true" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Up to 24 Months 0% APR on Approved Credit
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Replace your system now and spread the payments through Wisetack.
              Pre-qualify in under a minute with a soft credit check — no impact to
              your credit score.
            </p>
            <Link
              href="/financing"
              className="inline-flex items-center justify-center gap-2 bg-[#0077B6] hover:bg-[#003153] text-white font-bold px-8 py-4 rounded-md text-lg shadow-md transition-colors"
              data-testid="system-replacement-financing-link"
            >
              Learn More About Financing →
            </Link>
          </div>
        </div>
      </section>

      {/* Service area */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Replacement Installations Across Dallas-Fort Worth
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              From our Coppell headquarters we serve homeowners across the full DFW
              metroplex. Free estimate visits available in every city we cover.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-8">
              {[
                'Dallas', 'Fort Worth', 'Plano', 'Frisco', 'Irving', 'Arlington',
                'Carrollton', 'Lewisville', 'Richardson', 'Coppell', 'Grapevine', 'Flower Mound',
              ].map((city) => (
                <div key={city} className="py-2 px-3 bg-blue-50/60 border border-blue-100 rounded text-gray-800 font-medium text-sm">
                  {city}
                </div>
              ))}
            </div>
            <Link href="/cities-served" className="text-[#0077B6] hover:underline font-semibold">
              View all 28 cities we serve →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Common Replacement Questions
            </h2>
            <div className="space-y-6">
              <Faq
                q="How long does a full system replacement take?"
                a="Most single-system residential replacements (one condenser + one furnace or air handler) are completed in one day — typically 6–8 hours on site. Larger homes with dual systems, attic access challenges, or significant duct repairs can extend into a second day."
              />
              <Faq
                q="Do I need to replace both the AC and the furnace together?"
                a="Not always — but often. If your outdoor unit is the problem and your furnace is under 10 years old, a condenser-only replacement can make sense. However, modern AC and furnace pairings are engineered together; mismatched systems lose efficiency, and you'll often end up replacing the second half within 2–3 years anyway. We'll walk through the math with you during the free estimate."
              />
              <Faq
                q="What brands do you install?"
                a="We install multiple major brands including Carrier, Trane, Lennox, Rheem, Goodman, and American Standard. We're not locked to a single manufacturer, which means we can recommend the right system for your budget and goals rather than pushing whatever we get a spiff on."
              />
              <Faq
                q="Will you pull the permit?"
                a="Yes. Any HVAC replacement in the DFW metroplex requires a municipal permit, and pulling it is our responsibility — not yours. Working without a permit can void your homeowner's insurance and create issues when you sell. Every quote we write includes permit fees."
              />
              <Faq
                q="What warranty comes with the new system?"
                a="Equipment warranties vary by brand and tier, but most new systems carry a 10-year parts warranty from the manufacturer. We also provide our own labor warranty on top of the parts coverage. Specifics will be listed on your written quote before you sign anything."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16 lg:py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #003153 0%, #0077B6 100%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-6 text-lime-300" aria-hidden="true" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Start With a Free Estimate</h2>
            <p className="text-lg text-blue-100 mb-8">
              No obligation, no pushy sales. A licensed tech visits your home, assesses
              your system and ducts, and sends you a written quote the same day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-[#003153] font-bold px-8 py-4 rounded-md text-lg shadow-lg transition-colors"
                data-testid="system-replacement-final-estimate-cta"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                Request My Free Estimate
              </Link>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-md text-lg border-2 border-white/40 transition-colors"
                data-testid="system-replacement-final-phone-cta"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}

function CostFactor({ title, body }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function Step({ number, title, body }) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="absolute -top-4 left-6 w-10 h-10 bg-[#003153] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mt-4 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

function Faq({ q, a }) {
  return (
    <details className="group bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <summary className="cursor-pointer font-semibold text-gray-900 text-lg flex items-start justify-between gap-4">
        <span>{q}</span>
        <span className="text-[#0077B6] text-2xl leading-none group-open:rotate-45 transition-transform shrink-0" aria-hidden="true">+</span>
      </summary>
      <p className="text-gray-600 mt-3 leading-relaxed">{a}</p>
    </details>
  )
}
