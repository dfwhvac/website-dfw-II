# DFW HVAC — KPI Baseline Document

**Established:** April 27, 2026
**Purpose:** Captures the starting numbers across all 5 priorities before any Phase 1+ optimization work begins. This is the comparison reference for every quarterly reevaluation.

**Reread protocol:** When updating, append a new dated section under each KPI rather than overwriting. Trends matter more than current values.

---

## 🏗️ Priority 1 — Foundation

### 1.1 Build & bundle (lab data, agent-measurable)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Build time (`yarn build`) | **22.29s** | <30s | `yarn build` |
| First Load JS — homepage | **180 kB** | <150 kB | `yarn build` output |
| First Load JS — top city (`/cities-served/[slug]`) | **129 kB** | <150 kB ✅ | same |
| First Load JS — `/financing` | **128 kB** | <150 kB ✅ | same |
| First Load JS — `/replacement-estimator` | **133 kB** | <150 kB ✅ | same |
| First Load JS — `/repair-or-replace` | **128 kB** | <150 kB ✅ | same |
| First Load JS — `/services/system-replacement` | **128 kB** | <150 kB ✅ | same |
| First Load JS — `/services/[category]/[slug]` | **174 kB** | <150 kB ⚠️ | same |
| First Load JS — `/about` | **177 kB** | <150 kB ⚠️ | same |
| First Load JS — `/contact` | **171 kB** | <150 kB ⚠️ | same |
| First Load JS — `/estimate` | **172 kB** | <150 kB ⚠️ | same |
| First Load JS — `/request-service` | **169 kB** | <150 kB ⚠️ | same |
| Shared baseline JS | **102 kB** | <100 kB | same |
| `/studio` (Sanity admin) | 1.04 MB | (admin only — no target) | same |

**Findings:**
- ⚠️ **6 pages over 150 kB target** (homepage, services/[category], about, contact, estimate, request-service). The shared 102 kB baseline + Radix/lucide imports are likely the drivers. **Action: P2.4b bundle reduction.**

### 1.2 Lighthouse (lab — pending capture)

| KPI | 2026-04-27 baseline | Target | Source | Note |
|---|:-:|:-:|---|---|
| Perf (mobile) — `/` | TBD | ≥90 | Lighthouse mobile | Capture in Phase 1 week 1 |
| Perf (mobile) — `/financing` | TBD | ≥90 | same | |
| Perf (mobile) — `/replacement-estimator` | TBD | ≥90 | same | |
| Perf (mobile) — `/cities-served/plano` | TBD | ≥90 | same | |
| Perf (mobile) — `/request-service` | TBD | ≥90 | same | |
| Accessibility — sitewide | TBD | ≥95 | Lighthouse | After F1 mobile fixes shipped |
| Best Practices — sitewide | TBD | ≥95 | same | |
| SEO — sitewide | TBD | 100 | same | |
| TBT (lab) | TBD | <200ms | Lighthouse | |

### 1.3 Core Web Vitals (CrUX field — pending CrUX populating, ~28 days)

| KPI | 2026-04-27 baseline | Target | Source | Note |
|---|:-:|:-:|---|---|
| LCP p75 (mobile) | TBD | <2.5s | GSC Experience report | Apr 24 stack pages won't have CrUX data until late May |
| INP p75 (mobile) | TBD | <200ms | GSC Experience | |
| CLS p75 (mobile) | TBD | <0.1 | GSC Experience | |
| Mobile vs desktop CWV gap | TBD | <20% delta | GSC Experience | |
| Vercel Speed Insights p75 (LCP/INP/CLS) | Just enabled Apr 27 | match GSC | Vercel Speed Insights | Real-user RUM |

### 1.4 Reliability

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Uptime | 99.95%+ (Vercel SLA assumed) | 99.95%+ | Vercel SLA |
| Error rate | TBD | <0.1% | Vercel Analytics (just enabled) |
| Lead-form-error rate | TBD | <2% | MongoDB query / GA4 |

### 1.5 Mobile UX (F1 audit, Apr 27)

| Finding | Status |
|---|---|
| StickyMobileCTA: inline `bg-[#D30000]` hex bypassing token system | ✅ Fixed Apr 27 — now uses `bg-vivid-red` |
| StickyMobileCTA: dismiss button tap target ≈36px (fails 44×44 minimum) | ✅ Fixed Apr 27 — now `w-11 h-11` (44px) |
| StickyMobileCTA: `h-safe-area-inset-bottom` non-standard Tailwind class | ✅ Fixed Apr 27 — now uses inline `env(safe-area-inset-bottom)` |
| EstimatorWizard inputs: `py-2` (~36px) fails 44px minimum | ✅ Fixed Apr 27 — now `py-3 min-h-[44px]` |
| EstimatorWizard email/phone: missing `inputMode` for mobile keyboard | ✅ Fixed Apr 27 — `inputMode="tel"` and `inputMode="email"` |
| EstimatorWizard inputs: missing `autoComplete` attrs | ✅ Fixed Apr 27 — `given-name`, `tel`, `email` |
| LeadForm + SimpleContactForm | ✅ Already compliant (`h-12`, all `inputMode`/`autoComplete` set) |
| Estimator radio buttons (5 questions) | ✅ Already compliant (~48px) |

---

## 🔍 Priority 2 — SEO + AEO

### 2.1 Indexing

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Sitemap URL count | **51** (was 47 pre-Apr 24 stack merge) | n/a | `sitemap.xml` |
| Indexed URLs (per GSC report) | **42 of 47** = 89.4% | 100% by Jul 1 | GSC Pages export |
| Indexed URLs (live URL Inspection — effective) | **44 of 47** = 93.6% | n/a | URL Inspection |
| Total URLs Google knows about (incl. legacy) | **61** | naturally consolidates | GSC Pages |
| Total indexed (incl. legacy www-prefixed) | **50** | n/a | GSC Pages |
| Genuine indexing backlog | **3** (haslet, the-colony, commercial-heating; all submitted Apr 27) | 0 by May 5 | Audit |
| URL exclusion buckets (5) | 4 Discovered / 2 Crawled-not-indexed / 3 Page-w-redirect / 1 noindex (legacy PDF) / 1 404 | trend down | GSC |

### 2.2 GSC Performance (28-day rolling — pending user export)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Total impressions | TBD | +30% in 90 days | GSC Performance |
| Total clicks | TBD | +50% in 90 days | GSC Performance |
| Avg CTR | TBD | +0.5pp absolute | GSC Performance |
| Avg position | TBD | top 10 for ≥50% branded; top 20 for ≥70% "[service] [city]" | GSC Performance |
| Top 20 ranking queries (list captured) | TBD | improve avg position +3 | GSC Performance |

### 2.3 Backlinks (pending Ahrefs/Moz free check)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Total referring domains | TBD | +15 (DR≥20) in 6 mo | Ahrefs free |
| Domain Rating (DR) | TBD | +5 in 6 mo | Ahrefs free |
| Top 5 referring domains | TBD | catalog | Ahrefs |

### 2.4 Google Business Profile (pending P1.8 verification)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| GBP verified | NO (P1.8 starts Phase 2b) | YES by week 2 of Phase 2b | GBP dashboard |
| GBP impressions | TBD post-verify | +50% in 60 days | GBP Insights |
| GBP profile views | TBD | track | GBP |
| GBP calls (from listing) | TBD | +30% in 60 days | GBP |
| GBP direction requests | TBD | +30% in 60 days | GBP |
| GBP website clicks | TBD | +30% in 60 days | GBP |
| Posts published in last 30 days | 0 | 4–8/mo | GBP |

### 2.5 Reviews

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Total Google reviews | **145** | 165 by Sep 1 (~3/mo) | GBP |
| Average rating | 5.0★ (assumed) | maintain | GBP |
| Reviews replied to (% of last 50) | TBD | 100% within 48 hrs | GBP |
| New reviews/month (last 6 mo avg) | TBD | 2–5/mo | GBP |

### 2.6 AEO Citation Tracking (S3 baseline — pending agent execution)

Manual audit on 15–20 representative queries across Google AI Overviews, ChatGPT, Perplexity, Gemini.

| Query | AI Overviews | ChatGPT | Perplexity | Gemini |
|---|:-:|:-:|:-:|:-:|
| `ac repair plano cost` | TBD | TBD | TBD | TBD |
| `should i repair or replace my hvac dfw` | TBD | TBD | TBD | TBD |
| `furnace replacement cost dallas` | TBD | TBD | TBD | TBD |
| `hvac financing 0 apr texas` | TBD | TBD | TBD | TBD |
| `r-22 refrigerant illegal hvac` | TBD | TBD | TBD | TBD |
| `best hvac contractor coppell tx` | TBD | TBD | TBD | TBD |
| `furnace tune up cost dfw` | TBD | TBD | TBD | TBD |
| `iaq indoor air quality testing dallas` | TBD | TBD | TBD | TBD |
| `commercial hvac maintenance fort worth` | TBD | TBD | TBD | TBD |
| `hvac system replacement size 2000 sq ft home` | TBD | TBD | TBD | TBD |
| `seer rating new ac unit texas` | TBD | TBD | TBD | TBD |
| `heat pump vs furnace texas climate` | TBD | TBD | TBD | TBD |
| `ductwork inspection dfw` | TBD | TBD | TBD | TBD |
| `emergency ac repair after hours dallas` | TBD | TBD | TBD | TBD |
| `wisetack hvac financing application` | TBD | TBD | TBD | TBD |
| `hvac installation warranty texas` | TBD | TBD | TBD | TBD |
| `dfw hvac reviews family owned` | TBD | TBD | TBD | TBD |
| `replace ac and furnace together cost` | TBD | TBD | TBD | TBD |
| `freon r-410a replacement texas` | TBD | TBD | TBD | TBD |
| `nest thermostat install dfw` | TBD | TBD | TBD | TBD |

**Aggregate target:** 5+ of 20 queries cite DFW HVAC by Sep 1, 2026. Track quarterly.

### 2.7 Schema coverage

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Pages with LocalBusiness | TBD | 100% | Rich Results Test |
| Pages with BreadcrumbList | TBD | 100% | Rich Results Test |
| Pages with FAQPage / HowTo / Article schema where applicable | TBD | 100% applicable | Rich Results Test |
| `/replacement-estimator` schema | NONE | WebApplication or HowTo | Code audit |
| Featured snippets owned | 0 (assumed) | 3–5 by Sep 1 | GSC + manual |

---

## 💰 Priority 3 — Conversion (pending GA4 data capture)

### 3.1 Conversion rates (pending GA4 + Clarity)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Overall conversion rate | TBD | +25% by Sep 1 | GA4: (`form_submit` + `phone_click`) ÷ unique sessions |
| Form submit rate (homepage form) | TBD | +40% post P1.10 | GA4 `form_submit_lead` ÷ form views |
| Form submit rate (`/contact`) | TBD | +40% | same |
| Form submit rate (`/request-service`) | TBD | +40% | same |
| Phone click rate (CTR `tel:` from any page) | TBD | +20% | GA4 `phone_click` ÷ unique sessions |
| Estimator start rate (`/replacement-estimator` Q1 select ÷ pageviews) | TBD | track | GA4 funnel |
| Estimator completion rate (Q5 reached ÷ Q1 selected) | TBD | ≥30% | GA4 funnel |
| Estimator → opt-in conversion (lead capture ÷ completion) | TBD | ≥15% | GA4 |
| Estimator → financing click (financing CTA from result) | TBD | ≥10% | GA4 |

### 3.2 Engagement

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Bounce rate — homepage | TBD | <60% | GA4 |
| Bounce rate — top city page | TBD | <60% | GA4 |
| Bounce rate — service template | TBD | <60% | GA4 |
| Avg time on `/repair-or-replace` | TBD | >2 min | GA4 |
| Avg time on `/replacement-estimator` | TBD | >2 min | GA4 |
| Avg time on top service pages | TBD | >45s | GA4 |

### 3.3 Mobile vs desktop

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Mobile conversion rate | TBD | parity within 10% of desktop | GA4 Devices |
| Desktop conversion rate | TBD | n/a | GA4 |
| Mobile traffic % of total | TBD (~75% est.) | track | GA4 |
| Mobile sticky-CTA dismiss rate | TBD | <30% | GA4 + sessionStorage tracking |

### 3.4 Operational (user CRM tracking)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| Lead → booked-job rate | TBD | track | User CRM |
| Booked-job → completed-job rate | TBD | track | User CRM |
| Avg ticket value | TBD | track | User CRM |
| Lead-to-booked time (median) | TBD | <24 hrs business | User CRM |

---

## 📊 Priority 4 — Ad Infrastructure (pre-launch)

All P4 KPIs measured at the close of Phase 4. Listed here for completeness.

| KPI | Pre-launch target |
|---|:-:|
| CallRail/DNI installed routing 100% phone CTAs | YES |
| GCLID capture rate on `/quote-*` LPs | 100% → MongoDB |
| Enhanced Conversions match rate | ≥70% |
| GA4 ↔ Google Ads link | verified |
| GA4 ↔ Facebook Pixel parity | <10% delta |
| Ad LPs Quality Score (lab) | ≥7/10 each |
| Ad LPs Lighthouse Perf | ≥85 each |

---

## 🚀 Priority 5 — Live ads (post-launch)

All P5 KPIs measured from Day 1 of spend. Listed here for completeness.

| KPI | Target |
|---|:-:|
| CPC (Google Search) | <$8 |
| CTR (Google Search) | >5% |
| Conversion rate (LP → form/call) | >8% |
| Cost per lead (CPL) | <$60 |
| Cost per booked job (CAC) | <$200 (avg ticket >$1,000) |
| Quality Score (Google) | ≥7 |
| Relevance Score (FB) | ≥7 |
| LTV : CAC ratio | ≥3:1 within 90 days |

---

## 📅 Reevaluation Schedule (cumulative across priorities)

| Cadence | KPI groups | Cost in time |
|---|---|:-:|
| **Weekly (Tuesday AM, ~10 min)** | GSC dashboard glance · Vercel Analytics RUM · GA4 Realtime + Conversions glance · GBP review-reply SLA | 10 min |
| **Monthly (1st Tuesday, ~1.5 hrs)** | Lighthouse audit (5 pages) · GSC full report · GA4 conversion review by-page/by-device · Review count drift · GSC not-indexed bucket review | 90 min |
| **Quarterly (Mar 1, Jun 1, Sep 1, Dec 1, ~4 hrs)** | AEO citation audit (S3 — 20 queries) · Competitor SEO audit (S10) · Schema validation · NAP consistency recheck · Backlink growth audit · Tech-SEO sweep · Bundle analyzer delta · Title-tag CTR review | 4 hrs |
| **Semi-annual (Jan, Jul)** | Full SEO audit refresh · Seasonal title/promo refresh · Broken internal-link crawl · Conversion funnel deep-dive | 4 hrs |
| **Annual (Dec)** | API key rotation · Sanity dataset backup · 301/410 prune · MongoDB retention review · Maps API allowlist · seed/mock data review · KPI baseline refresh | 4 hrs |

---

## 🧱 Update history

| Date | Change |
|---|---|
| 2026-04-27 | File created. P1 build/bundle baseline captured. Sitemap, indexing rate, reviews count, F1 mobile findings + fixes all logged. P2/P3/P4/P5 baselines marked TBD pending user data captures. |
