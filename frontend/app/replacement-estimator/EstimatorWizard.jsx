'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Calendar,
  Sparkles,
  RotateCcw,
  Info,
  Loader2,
} from 'lucide-react'

const PHONE_TEL = 'tel:+19727772665'
const PHONE_DISPLAY = '(972) 777-COOL'

// ─── Question schema ────────────────────────────────────────────────
// Kept here (client-side) as a data structure rather than hand-rolled
// JSX per step. Adding a future field is a one-line change + a bump
// of the validation enum in /api/estimator/calculate.
const QUESTIONS = [
  {
    id: 'sqft',
    label: 'How large is your home?',
    help: 'Square footage helps us size the system. A rough estimate is fine — we refine it during the free on-site visit.',
    options: [
      { value: 'under_1500', label: 'Under 1,500 sqft' },
      { value: '1500_2500', label: '1,500 – 2,500 sqft' },
      { value: '2500_3500', label: '2,500 – 3,500 sqft' },
      { value: '3500_5000', label: '3,500 – 5,000 sqft' },
      { value: 'over_5000', label: 'Over 5,000 sqft' },
    ],
  },
  {
    id: 'systemType',
    label: 'What are you replacing?',
    help: 'Matched means AC and furnace together — most common in DFW. Not sure? Pick the closest and we refine in person.',
    options: [
      { value: 'matched', label: 'AC + Furnace (matched system)' },
      { value: 'ac_only', label: 'AC only' },
      { value: 'furnace_only', label: 'Furnace only' },
      { value: 'heat_pump', label: 'Heat pump (all-electric)' },
      { value: 'mini_split', label: 'Ductless mini-split' },
      { value: 'not_sure', label: 'Not sure — help me figure it out' },
    ],
  },
  {
    id: 'stage',
    label: 'Equipment tier?',
    help: 'Single-stage is the value option; variable-speed is the quietest and most efficient. Most DFW homeowners land on standard.',
    options: [
      { value: 'value', label: 'Value — single-stage' },
      { value: 'standard', label: 'Standard — two-stage' },
      { value: 'premium', label: 'Premium — variable-speed' },
      { value: 'not_sure', label: 'Not sure — pick mid-range' },
    ],
  },
  {
    id: 'seer',
    label: 'Efficiency target?',
    help: 'Higher SEER2 costs a bit more up front and lowers your monthly bill. Baseline meets DFW code; mid is the sweet spot for most homes.',
    options: [
      { value: 'baseline', label: 'Baseline — 14 SEER2' },
      { value: 'mid', label: 'Mid — 17 SEER2' },
      { value: 'high', label: 'High — 20+ SEER2' },
      { value: 'not_sure', label: 'Not sure — show me options' },
    ],
  },
  {
    id: 'ducts',
    label: 'Ductwork condition?',
    help: 'Old or leaky ducts can waste 20–30% of what your new system produces. If you are unsure, pick Don\u2019t know — we\u2019ll inspect during the estimate.',
    options: [
      { value: 'newer_fine', label: 'Newer / in great shape' },
      { value: 'older_ok', label: 'Older but working OK' },
      { value: 'needs_work', label: 'Probably needs some work' },
      { value: 'full_replacement', label: 'Needs full replacement' },
      { value: 'unknown', label: 'Don\u2019t know' },
    ],
  },
]

const initialAnswers = () => Object.fromEntries(QUESTIONS.map((q) => [q.id, null]))

export default function EstimatorWizard() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers())
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { low, high, tonnage, breakdown }
  const [error, setError] = useState(null)

  // Opt-in form state (post-result)
  const [optInOpen, setOptInOpen] = useState(false)
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState(null)
  const [leadForm, setLeadForm] = useState({ firstName: '', phone: '', email: '' })

  const totalSteps = QUESTIONS.length
  const currentQuestion = QUESTIONS[stepIndex]
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null
  const canAdvance = Boolean(currentAnswer)
  const progressPct = useMemo(() => Math.round((stepIndex / totalSteps) * 100), [stepIndex, totalSteps])

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
    setError(null)
  }

  const handleNext = async () => {
    if (!canAdvance) return
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1)
      return
    }
    // Last step → submit for calculation
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/estimator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      const data = await res.json()
      setResult(data)
      // Fire GA4 custom event for estimator completion — joins generate_lead
      // and phone_click as a signal. Toggle as key event in GA4 once ingested.
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        try {
          window.gtag('event', 'estimator_complete', {
            estimate_low: data.low,
            estimate_high: data.high,
          })
        } catch (_e) {
          /* non-fatal */
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to calculate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1)
  }

  const handleReset = () => {
    setStepIndex(0)
    setAnswers(initialAnswers())
    setResult(null)
    setError(null)
    setOptInOpen(false)
    setLeadSubmitted(false)
    setLeadError(null)
    setLeadForm({ firstName: '', phone: '', email: '' })
  }

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    if (!leadForm.firstName.trim() || !leadForm.phone.trim()) {
      setLeadError('Please enter at least your first name and phone number.')
      return
    }
    setLeadSubmitting(true)
    setLeadError(null)
    try {
      const res = await fetch('/api/estimator/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: leadForm.firstName.trim(),
          phone: leadForm.phone.trim(),
          email: leadForm.email.trim() || null,
          estimate: result,
          inputs: answers,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Unable to submit.')
      }
      setLeadSubmitted(true)
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        try {
          window.gtag('event', 'estimator_opt_in', {})
        } catch (_e) {
          /* non-fatal */
        }
      }
    } catch (err) {
      setLeadError(err.message)
    } finally {
      setLeadSubmitting(false)
    }
  }

  // ─── Render: Results view ───────────────────────────────────────
  if (result) {
    return (
      <>
        {/* Results hero */}
        <section
          className="py-14 lg:py-20 text-white bg-gradient-to-br from-prussian-blue to-electric-blue"
          data-testid="estimator-result"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-6">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Your Estimated Range
              </div>
              <p className="text-lg text-blue-100 mb-2">Based on your answers</p>
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none mb-4">
                <span className="text-growth-green">
                  ${result.low.toLocaleString()}
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl text-blue-200 mx-3">–</span>
                <span className="text-growth-green">
                  ${result.high.toLocaleString()}
                </span>
              </p>
              <p className="text-base text-blue-200 mt-4 max-w-xl mx-auto">
                Ranges are installed cost estimates for DFW homeowners. Your actual quote is
                confirmed at a free on-site visit — no surprise charges, no pressure.
              </p>
              <button
                onClick={handleReset}
                className="mt-6 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white underline underline-offset-4 transition-colors"
                data-testid="estimator-reset-hero"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Edit my answers
              </button>
            </div>
          </div>
        </section>

        {/* Breakdown */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Why we gave you this range
              </h2>
              <div className="space-y-3">
                <BreakdownRow label="Sized for" value={result.breakdown.sizing} />
                <BreakdownRow label="System type" value={labelFor('systemType', answers.systemType)} />
                <BreakdownRow label="Equipment tier" value={labelFor('stage', answers.stage)} />
                <BreakdownRow label="Efficiency" value={labelFor('seer', answers.seer)} />
                <BreakdownRow label="Ductwork" value={labelFor('ducts', answers.ducts)} />
              </div>
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5 flex gap-3">
                <Info className="w-5 h-5 text-electric-blue shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  These figures are estimates based on DFW market averages and your answers. The
                  actual installed price depends on attic access, electrical panel capacity,
                  permits, and brand choice. Our free on-site written estimate is the only way
                  to pin down your exact number — and there&apos;s no charge, no pressure,
                  and no obligation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="py-12 lg:py-16 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center">
                What&apos;s Next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link
                  href="/estimate"
                  className="inline-flex flex-col items-center justify-center gap-2 bg-prussian-blue hover:bg-electric-blue text-white font-bold px-6 py-6 rounded-md text-base shadow-lg transition-colors text-center"
                  data-testid="estimator-book-estimate"
                >
                  <Calendar className="w-6 h-6" aria-hidden="true" />
                  <span>Book Free Written Estimate</span>
                </Link>
                <a
                  href={PHONE_TEL}
                  className="inline-flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 text-prussian-blue font-bold px-6 py-6 rounded-md text-base shadow-md border-2 border-prussian-blue transition-colors text-center"
                  data-testid="estimator-call"
                >
                  <Phone className="w-6 h-6" aria-hidden="true" />
                  <span>Call {PHONE_DISPLAY}</span>
                </a>
                <Link
                  href="/financing"
                  className="inline-flex flex-col items-center justify-center gap-2 bg-growth-green hover:bg-growth-green/90 text-prussian-blue font-bold px-6 py-6 rounded-md text-base shadow-md transition-colors text-center"
                  data-testid="estimator-financing"
                >
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                  <span>See Financing Options</span>
                </Link>
              </div>

              {/* Soft opt-in (Option C hybrid) */}
              {!leadSubmitted ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  {!optInOpen ? (
                    <button
                      onClick={() => setOptInOpen(true)}
                      className="w-full text-left flex items-center justify-between gap-3 group"
                      data-testid="estimator-optin-toggle"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Want us to call and schedule your free written estimate?
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Optional — we&apos;ll reach out within 2 business hours. No obligation.
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-electric-blue shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </button>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4" data-testid="estimator-optin-form">
                      <h3 className="text-lg font-bold text-gray-900">
                        Book My Free On-Site Estimate
                      </h3>
                      <p className="text-sm text-gray-600">
                        We&apos;ll call within 2 business hours to schedule. Your estimator
                        answers come with us so the visit stays short.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="estim-fname" className="block text-sm font-medium text-gray-700 mb-1">
                            First name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="estim-fname"
                            type="text"
                            autoComplete="given-name"
                            required
                            value={leadForm.firstName}
                            onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                            className="w-full px-3 py-3 min-h-[44px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue"
                            data-testid="estimator-optin-firstname"
                          />
                        </div>
                        <div>
                          <label htmlFor="estim-phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="estim-phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            required
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                            className="w-full px-3 py-3 min-h-[44px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue"
                            data-testid="estimator-optin-phone"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="estim-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-gray-400 text-xs">(optional)</span>
                        </label>
                        <input
                          id="estim-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                          className="w-full px-3 py-3 min-h-[44px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric-blue"
                          data-testid="estimator-optin-email"
                        />
                      </div>
                      {leadError && (
                        <p className="text-red-600 text-sm" data-testid="estimator-optin-error">{leadError}</p>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={leadSubmitting}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-prussian-blue hover:bg-electric-blue disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-md transition-colors"
                          data-testid="estimator-optin-submit"
                        >
                          {leadSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                          {leadSubmitting ? 'Sending...' : 'Request My Estimate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOptInOpen(false)}
                          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-growth-green/10 border border-growth-green/30 rounded-xl p-6 text-center" data-testid="estimator-optin-success">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success-green" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">You&apos;re on the schedule.</h3>
                  <p className="text-gray-700">
                    Thanks, {leadForm.firstName}! We&apos;ll call you within 2 business hours to
                    book your free on-site written estimate.
                  </p>
                </div>
              )}

              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-prussian-blue font-medium"
                  data-testid="estimator-reset"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Start over with different answers
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ─── Render: Wizard view ───────────────────────────────────────
  return (
    <>
      {/* Hero */}
      <section className="py-12 lg:py-16 text-white bg-gradient-to-br from-prussian-blue to-electric-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium border border-white/20 mb-6">
              <Calculator className="w-4 h-4" aria-hidden="true" />
              Free Instant Estimate · No Signup
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              HVAC Replacement <span className="text-growth-green">Cost Estimator</span>
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Answer 5 quick questions and see your installed-price range on screen in under a minute.
              No email required, no surprise follow-ups. Actual quote confirmed at a free on-site visit.
            </p>
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-12 lg:py-16 bg-gray-50" data-testid="estimator-wizard">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2 text-sm font-medium text-gray-600">
                <span data-testid="estimator-step-label">
                  Step {stepIndex + 1} of {totalSteps}
                </span>
                <span>{progressPct}% complete</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-electric-blue to-growth-green transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.label}
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {currentQuestion.help}
              </p>
              <div className="space-y-2" role="radiogroup" aria-label={currentQuestion.label}>
                {currentQuestion.options.map((opt) => {
                  const selected = currentAnswer === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selected
                          ? 'bg-blue-50 border-electric-blue text-prussian-blue font-semibold shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                      data-testid={`estimator-option-${currentQuestion.id}-${opt.value}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selected ? 'border-electric-blue bg-electric-blue' : 'border-gray-300 bg-white'
                          }`}
                          aria-hidden="true"
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                        </span>
                        <span>{opt.label}</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {error && (
                <p className="mt-4 text-red-600 text-sm" data-testid="estimator-error">{error}</p>
              )}
            </div>

            {/* Nav */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleBack}
                disabled={stepIndex === 0 || loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-prussian-blue font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="estimator-back"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canAdvance || loading}
                className="inline-flex items-center gap-2 bg-prussian-blue hover:bg-electric-blue disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-md shadow-md transition-colors"
                data-testid="estimator-next"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    Calculating...
                  </>
                ) : stepIndex === totalSteps - 1 ? (
                  <>
                    See My Range
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              No email required · Results show instantly on this screen · Your answers stay on your device until you opt in
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function BreakdownRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-gray-100">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold text-right">{value}</span>
    </div>
  )
}

// Translate raw enum value back to display label using the QUESTIONS schema.
function labelFor(questionId, value) {
  const q = QUESTIONS.find((qq) => qq.id === questionId)
  if (!q) return value
  const opt = q.options.find((o) => o.value === value)
  return opt ? opt.label : value
}
