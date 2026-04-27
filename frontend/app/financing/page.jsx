import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { BreadcrumbListSchema } from '@/components/SchemaMarkup'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { getReviewBadgeCount, buildTitleWithBadge } from '@/lib/metadata'
import { Phone, Clock, CheckCircle2, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// TODO(P1.16): replace with live Wisetack merchant application link once provided.
// Fallback path keeps the CTA functional — routes to /estimate (the lead form).
// Set NEXT_PUBLIC_WISETACK_APPLY_URL in Vercel env to go live with a real URL.
const WISETACK_APPLY_URL = process.env.NEXT_PUBLIC_WISETACK_APPLY_URL || '/estimate'
const PHONE_TEL = 'tel:+19727772665'
const PHONE_DISPLAY = '(972) 777-COOL'

export async function generateMetadata() {
  // P1.16 — financing page (Apr 24, 2026). Title targets "hvac financing dfw" +
  // the 0% promo hook, which is the single highest-intent financing search
  // cluster for this category. Badge uses Option C review-count logic.
  const companyInfo = await getCompanyInfo()
  const count = getReviewBadgeCount(companyInfo || mockCompanyInfo)
  return {
    title: buildTitleWithBadge({
      prefix: 'HVAC Financing — 0% for 24 Months',
      count,
      includeBrand: true,
    }),
    description:
      'Up to 24 months 0% APR financing on qualifying new HVAC systems in Dallas-Fort Worth. Pre-qualify in seconds with a soft credit check through Wisetack — no impact to your credit score.',
    alternates: {
      canonical: '/financing',
    },
  }
}

export default async function FinancingPage() {
  let companyInfo = await getCompanyInfo()
  if (!companyInfo) companyInfo = mockCompanyInfo

  const siteSettings = await getSiteSettings()

  const breadcrumbs = [
    { name: 'Home', url: 'https://dfwhvac.com/' },
    { name: 'Financing', url: 'https://dfwhvac.com/financing' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <BreadcrumbListSchema items={breadcrumbs} />
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />

      {/* Hero */}
      <section
        className="relative py-20 lg:py-28 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #003153 0%, #0077B6 100%)' }}
        data-testid="financing-hero"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Flexible HVAC Financing in Dallas-Fort Worth
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Up to <span className="text-lime-300">24 Months 0% APR</span><br />
              on a New HVAC System
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
              Replace your AC or furnace without paying everything up front. Pre-qualify
              in seconds through Wisetack — a quick soft credit check that won&apos;t
              impact your credit score, so you can see your real options before you commit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={WISETACK_APPLY_URL}
                target={WISETACK_APPLY_URL.startsWith('http') ? '_blank' : undefined}
                rel={WISETACK_APPLY_URL.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-[#003153] font-bold px-8 py-4 rounded-md text-lg shadow-lg transition-colors"
                data-testid="financing-apply-cta"
              >
                Pre-Qualify Now
              </a>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-md text-lg border-2 border-white/40 transition-colors"
                data-testid="financing-phone-cta"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              Subject to approval through financing partner. Terms and rates vary based on creditworthiness.
            </p>
          </div>
        </div>
      </section>

      {/* Why finance */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Finance Through DFW HVAC
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A failing HVAC system rarely waits for a convenient paycheck. Financing
                lets you put the right equipment in right now — and pay for it on a
                schedule that works.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Benefit
                icon={Clock}
                title="Seconds to pre-qualify"
                body="Wisetack runs a soft credit check that doesn't impact your credit score. You'll see rates and terms before you decide."
              />
              <Benefit
                icon={ShieldCheck}
                title="No prepayment penalties"
                body="Pay off early whenever you like — there are no hidden fees for finishing ahead of schedule."
              />
              <Benefit
                icon={CheckCircle2}
                title="Install first, pay over time"
                body="Get the right-sized system installed now and spread payments across up to 24 months at 0% APR for qualified buyers."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our Wisetack-powered process is built for homeowners in the middle of an
                HVAC emergency — fast, transparent, and no paperwork pile.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Step
                number="1"
                title="Tell us about your project"
                body="Call us or request an estimate online. We&apos;ll match you to the right system and give you an honest installed price."
              />
              <Step
                number="2"
                title="Get a text from Wisetack"
                body="We&apos;ll send a pre-qualification link to your phone. Soft credit check, under 60 seconds, no impact on your credit score."
              />
              <Step
                number="3"
                title="Pick your term and schedule install"
                body="Choose the payment plan that fits — up to 24 months at 0% APR for qualified buyers — and we&apos;ll get your install on the calendar."
              />
            </div>
          </div>
        </div>
      </section>

      {/* What you can finance */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What You Can Finance
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Financing applies to qualifying installations, replacements, and major
                repairs. Ask us which options work for your project.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'Full AC system replacement',
                'Furnace replacement',
                'Complete heat pump installations',
                'Ductless mini-split systems',
                'Indoor air quality (HALO-LED, REME-HALO)',
                'Whole-home duct replacement',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-lg p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-lime-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-lite */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
              Common Questions
            </h2>
            <div className="space-y-6">
              <Faq
                q="Will pre-qualifying affect my credit score?"
                a="No. Wisetack uses a soft credit check to show you rates and terms. It does not impact your credit score. A hard pull only happens if you decide to accept an offer."
              />
              <Faq
                q="How fast is approval?"
                a="Most homeowners see their options within 60 seconds of submitting the pre-qualification form. Funds are released to us once you accept a loan and we've completed your install — you won't handle the paperwork or payments directly during the job."
              />
              <Faq
                q="What credit score do I need?"
                a="Wisetack works with a range of credit profiles, but approval, loan amount, APR, and term length are all subject to credit review. The only way to know what you qualify for is to run the soft-check pre-qualification — it takes under a minute and costs nothing."
              />
              <Faq
                q="Is the 0% APR offer guaranteed?"
                a="The 0% APR for up to 24 months is a promotional rate available to qualified buyers on approved credit. Actual rates, terms, and amounts vary based on your credit profile and the amount financed. Your exact offer will be shown before you accept."
              />
              <Faq
                q="Can I pay off the loan early?"
                a="Yes. There are no prepayment penalties on Wisetack loans — pay extra any month, or pay it all off, with no additional fees."
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
            <MessageSquare className="w-12 h-12 mx-auto mb-6 text-lime-300" aria-hidden="true" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to See Your Options?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Start with a free written estimate. We&apos;ll build your quote and text
              you the Wisetack pre-qualification link in the same visit — no obligation,
              no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 bg-lime-400 hover:bg-lime-300 text-[#003153] font-bold px-8 py-4 rounded-md text-lg shadow-lg transition-colors"
                data-testid="financing-estimate-cta"
              >
                Get a Free Estimate
              </Link>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-8 py-4 rounded-md text-lg border-2 border-white/40 transition-colors"
                data-testid="financing-footer-phone-cta"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Legal disclosure */}
      <section className="py-8 bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-xs text-gray-500 leading-relaxed">
            <p className="mb-2">
              <strong className="text-gray-700">Financing Disclosure:</strong> All financing
              is provided by Wisetack, Inc. and its lending partners. Loans through Wisetack
              are subject to credit approval; amounts, rates, and lender assignments vary
              based on creditworthiness, loan term, and state of residence. Promotional 0%
              APR offer applies to terms up to 24 months on approved credit for qualifying
              purchases; other terms and rates may be offered. Pre-qualification uses a soft
              credit inquiry that does not affect your credit score; a hard inquiry occurs
              only if you accept a loan offer. DFW HVAC, LLC is not the lender and does not
              make credit decisions. See{' '}
              <a href="https://wisetack.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
                wisetack.com
              </a>{' '}
              for full terms.
            </p>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}

function Benefit({ icon: Icon, title, body }) {
  return (
    <div className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center border border-[#0077B6]/20">
        <Icon className="w-7 h-7 text-[#0077B6]" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}

function Step({ number, title, body }) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="absolute -top-4 left-6 w-10 h-10 bg-[#003153] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mt-4 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{body}</p>
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
