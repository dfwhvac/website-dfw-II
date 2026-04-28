import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getCompanyInfo, getSiteSettings } from '@/lib/sanity'
import { companyInfo as mockCompanyInfo } from '@/lib/mockData'
import { Phone, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import ThanksAnalytics from './ThanksAnalytics'

// Confirmation page is intentionally `noindex` — it's a post-conversion
// destination, not an SEO target. We DO want it crawlable so Googlebot can
// follow internal links back into the site, hence `index: false, follow: true`.
export const metadata = {
  title: "Thanks — We've Got Your Request | DFW HVAC",
  description:
    "Your request was received. A DFW HVAC team member will call you within 2 business hours. In the meantime, here's what to expect.",
  alternates: { canonical: '/thanks' },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
}

const PHONE_TEL = 'tel:+19727772665'
const PHONE_DISPLAY = '(972) 777-COOL'

const TYPE_COPY = {
  service: {
    badge: 'Service Request Received',
    headline: "We've got your service request.",
    sub: "A licensed technician will call you within 2 business hours to confirm details and book your visit.",
  },
  estimate: {
    badge: 'Estimate Request Received',
    headline: "Your estimate request is in.",
    sub: "Our system replacement specialist will call you within 2 business hours to schedule your in-home assessment.",
  },
  contact: {
    badge: 'Message Received',
    headline: "Thanks — your message is in.",
    sub: "Someone from our team will call or email you within 2 business hours during normal hours, or first thing the next business morning.",
  },
  estimator: {
    badge: 'Estimator Lead Received',
    headline: "Your estimate is on its way.",
    sub: "We'll follow up within 2 business hours with a detailed walk-through tailored to your home and system.",
  },
}

const NEXT_STEPS = [
  {
    icon: Phone,
    title: 'Expect a call within 2 business hours',
    body:
      "Our dispatcher will confirm your address, the issue, and book the soonest visit window. If you missed our call, we'll text and try again.",
  },
  {
    icon: Clock,
    title: 'Same-day service across DFW',
    body:
      'For service calls placed before 2pm on a weekday, we get a tech on-site the same day. After-hours and weekend dispatch is available — ask when we call.',
  },
  {
    icon: CheckCircle2,
    title: 'Honest quote — no pressure',
    body:
      'Diagnostic first, written line-itemed quote second, work approved third. Three-generation family business; we\'d rather earn your next call than oversell you on this one.',
  },
]

export default async function ThanksPage({ searchParams }) {
  const params = (await searchParams) || {}
  const rawType = typeof params.type === 'string' ? params.type : 'service'
  const leadType = TYPE_COPY[rawType] ? rawType : 'service'
  const copy = TYPE_COPY[leadType]

  let companyInfo = await getCompanyInfo()
  if (!companyInfo) companyInfo = mockCompanyInfo
  const siteSettings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} siteSettings={siteSettings} />
      <ThanksAnalytics leadType={leadType} />

      {/* Confirmation Hero */}
      <section
        className="relative py-20 lg:py-28 text-white overflow-hidden bg-gradient-to-br from-prussian-blue to-electric-blue"
        data-testid="thanks-hero"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-6">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              {copy.badge}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5" data-testid="thanks-headline">
              {copy.headline}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              {copy.sub}
            </p>
            <a
              href={PHONE_TEL}
              className="inline-flex items-center justify-center gap-3 bg-vivid-red hover:bg-red-700 text-white font-semibold text-lg px-8 py-4 rounded-lg shadow-lg transition-all hover:shadow-xl"
              data-testid="thanks-call-cta"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              Call Now: {PHONE_DISPLAY}
            </a>
            <p className="text-sm text-blue-100 mt-4">
              Need us right now? Skip the queue and call directly.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-16 lg:py-20 bg-gray-50" data-testid="thanks-next-steps">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-prussian-blue text-center mb-3">
              What happens next
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              You skipped the boilerplate "we'll get back to you eventually" — here's the actual playbook from this moment forward.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {NEXT_STEPS.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-7 flex flex-col"
                  data-testid={`thanks-next-step-${i + 1}`}
                >
                  <div className="w-12 h-12 rounded-lg bg-electric-blue/10 text-electric-blue flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-prussian-blue mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* While you wait — useful internal links */}
      <section className="py-16 lg:py-20 bg-white" data-testid="thanks-while-you-wait">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-prussian-blue text-center mb-3">
              While you wait
            </h2>
            <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
              A few resources that homeowners ask us about every week.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/repair-or-replace"
                className="group flex items-center justify-between border border-gray-200 hover:border-electric-blue rounded-lg p-5 transition-all hover:shadow-md"
                data-testid="thanks-link-repair-or-replace"
              >
                <div>
                  <p className="font-semibold text-prussian-blue mb-1">Repair or Replace?</p>
                  <p className="text-sm text-gray-600">A 2-minute decision framework with the math we walk customers through.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-electric-blue transition-colors flex-shrink-0 ml-4" />
              </Link>

              <Link
                href="/financing"
                className="group flex items-center justify-between border border-gray-200 hover:border-electric-blue rounded-lg p-5 transition-all hover:shadow-md"
                data-testid="thanks-link-financing"
              >
                <div>
                  <p className="font-semibold text-prussian-blue mb-1">0% APR Financing</p>
                  <p className="text-sm text-gray-600">Up to 24 months, soft credit check via Wisetack — no impact to your score.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-electric-blue transition-colors flex-shrink-0 ml-4" />
              </Link>

              <Link
                href="/replacement-estimator"
                className="group flex items-center justify-between border border-gray-200 hover:border-electric-blue rounded-lg p-5 transition-all hover:shadow-md"
                data-testid="thanks-link-estimator"
              >
                <div>
                  <p className="font-semibold text-prussian-blue mb-1">Replacement Estimator</p>
                  <p className="text-sm text-gray-600">A 5-question wizard with a real DFW price range — no email required.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-electric-blue transition-colors flex-shrink-0 ml-4" />
              </Link>

              <Link
                href="/reviews"
                className="group flex items-center justify-between border border-gray-200 hover:border-electric-blue rounded-lg p-5 transition-all hover:shadow-md"
                data-testid="thanks-link-reviews"
              >
                <div>
                  <p className="font-semibold text-prussian-blue mb-1">Read the Reviews</p>
                  <p className="text-sm text-gray-600">145+ five-star Google reviews from neighbors across the DFW metroplex.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-electric-blue transition-colors flex-shrink-0 ml-4" />
              </Link>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/"
                className="text-electric-blue font-semibold hover:underline"
                data-testid="thanks-link-home"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer companyInfo={companyInfo} siteSettings={siteSettings} />
    </div>
  )
}
