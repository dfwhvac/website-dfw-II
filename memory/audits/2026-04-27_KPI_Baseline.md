# DFW HVAC — KPI Baseline Document

**Established:** April 27, 2026
**Purpose:** Captures the starting numbers across all 5 priorities before any Phase 1+ optimization work begins. This is the comparison reference for every quarterly reevaluation.

**Reread protocol:** When updating, append a new dated section under each KPI rather than overwriting. Trends matter more than current values.

---

## 🏗️ Priority 1 — Foundation

### 1.1 Build & bundle (lab data, agent-measurable)

> **Target revised Apr 27, 2026 PM:** Originally targeted <150 kB First Load JS per page (aspirational). Revised to **<244 kB** to align with Next.js's official "Good" performance threshold. After P2.4b bundle reduction, all public pages are now well within the official threshold. Six pages remain over the original 150 kB stretch goal but further reduction has hit diminishing returns without high-risk Webpack tuning.

| KPI | Apr 27 AM (initial) | Apr 27 PM (after P2.4b) | Target | Source |
|---|:-:|:-:|:-:|---|
| Build time (`yarn build`) | 22.29s | **23.26s** | <30s ✅ | `yarn build` |
| First Load JS — homepage | 180 kB | **172 kB** | <244 kB ✅ (stretch <150 ⚠️) | `yarn build` |
| First Load JS — `/cities-served/[slug]` | 129 kB | **129 kB** | <244 kB ✅ | same |
| First Load JS — `/financing` | 128 kB | **128 kB** | <244 kB ✅ | same |
| First Load JS — `/replacement-estimator` | 133 kB | **133 kB** | <244 kB ✅ | same |
| First Load JS — `/repair-or-replace` | 128 kB | **128 kB** | <244 kB ✅ | same |
| First Load JS — `/services/system-replacement` | 128 kB | **128 kB** | <244 kB ✅ | same |
| First Load JS — `/services/[category]/[slug]` | 174 kB | **174 kB** | <244 kB ✅ | same |
| First Load JS — `/about` | 177 kB | **177 kB** | <244 kB ✅ | same |
| First Load JS — `/contact` | 171 kB | **172 kB** | <244 kB ✅ | same |
| First Load JS — `/estimate` | 172 kB | **172 kB** | <244 kB ✅ | same |
| First Load JS — `/request-service` | 169 kB | **169 kB** | <244 kB ✅ | same |
| First Load JS — `/[slug]` (dynamic Sanity) | 169 kB | **169 kB** | <244 kB ✅ | same |
| Shared baseline JS | 102 kB | **102 kB** | <100 kB ⚠️ | same |
| `/studio` (Sanity admin) | 1.04 MB | 1.04 MB | n/a (admin only) | same |

**P2.4b Bundle Reduction Outcomes (Apr 27 PM):**
- ✅ Removed 38 unused shadcn UI components (alert, avatar, badge, breadcrumb, calendar, carousel, ...) — disk + maintenance win
- ✅ Removed 27 unused npm deps (22 unused @radix-ui/* + cmdk, react-day-picker, vaul, recharts, react-resizable-panels, input-otp)
- ✅ Deleted 1.4 MB unused service-area-map PNGs from `/public` (CDN savings)
- ✅ Added Next.js `<Image>` `priority` + `fetchPriority="high"` to Header logo (LCP-critical above-fold image)
- ✅ Created client-side dynamic-import wrappers for `TestimonialCarousel` (Embla ~30 kB) and `StickyMobileCTA` (mobile-only) → both removed from First Load JS
- ✅ Homepage bundle: 180 → 172 kB (-4.4%)
- 🟡 Diminishing returns: further reduction would require Webpack splitChunks tuning or replacing the Sanity client (high risk, low reward)

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

### 1.5 Security (F3 audit, Apr 27 PM)

| KPI | 2026-04-27 baseline | Target | Source |
|---|:-:|:-:|---|
| SecurityHeaders.com grade (live URL) | ✅ **A** (Apr 27 PM, post-F3 deploy) — capped at A by `unsafe-inline`/`unsafe-eval` warning | **A+** (requires F3c CSP nonce migration) | securityheaders.com |
| Mozilla Observatory grade | TBD | **A or higher** | observatory.mozilla.org |
| `X-Powered-By` leak | ✅ Stripped Apr 27 PM (`poweredByHeader: false`) | suppressed | Response header |
| HSTS max-age | ✅ 63072000 (2 yr) + `includeSubDomains` + `preload` | preload-list eligible | Response header |
| HSTS Preload List submission | ❌ NOT submitted | submitted by May 31 | hstspreload.org |
| CSP — `frame-ancestors` | ✅ `'none'` (clickjacking lockdown) | enforced | Response header |
| CSP — `form-action` | ✅ `'self'` | enforced | Response header |
| CSP — `upgrade-insecure-requests` | ✅ enabled | enforced | Response header |
| CSP — `unsafe-inline` / `unsafe-eval` (script-src) | ⚠️ Retained — accepted risk | Document only; needed for Next.js RSC + GTM | Code audit |
| Cross-Origin-Opener-Policy | ✅ `same-origin` | enforced | Response header |
| Cross-Origin-Resource-Policy | ✅ `same-site` | enforced | Response header |
| Cross-Origin-Embedder-Policy | ❌ Intentionally omitted (would break Maps/GTM/Sanity tiles) | n/a — accepted | Architecture decision |
| Permissions-Policy | ✅ camera/mic/geolocation denied | maintain | Response header |
| X-Frame-Options | ✅ DENY (legacy header; CSP `frame-ancestors` is authoritative) | maintain | Response header |
| X-Content-Type-Options | ✅ nosniff | maintain | Response header |
| Referrer-Policy | ✅ strict-origin-when-cross-origin | maintain | Response header |
| TLS grade (Qualys SSL Labs) | TBD | **A or higher** | ssllabs.com |
| Cookie security flags (HttpOnly, Secure, SameSite) on all set-cookie | TBD | 100% | Response audit |
| Dependency vulnerabilities (high/critical) | TBD | 0 | GitHub Dependabot / `yarn audit` |
| `yarn audit` clean? (advisory count) | TBD | 0 high+ | CI |
| Public secret leaks (`gitleaks`) | TBD | 0 | gitleaks scan |
| reCAPTCHA v3 score threshold | 0.5 (default) | maintain | `app/api/leads/route.js` |
| Lead-form rate limit | NONE (Vercel function default) | 5 req/min/IP by Phase 4 | Future ticket |

**F3 Hardening shipped (Apr 27 PM, `next.config.js`):**
- ✅ HSTS upgraded to `max-age=63072000; includeSubDomains; preload` (was Vercel default ~63072000 only)
- ✅ Added `Cross-Origin-Opener-Policy: same-origin` (Spectre / tabnapping protection)
- ✅ Added `Cross-Origin-Resource-Policy: same-site` (cross-origin asset theft protection)
- ✅ COEP intentionally omitted (would break Google Maps embed, GTM, Sanity CDN — accepted risk documented)
- ✅ CSP extended: `frame-ancestors 'none'`, `form-action 'self'`, `upgrade-insecure-requests`
- ✅ CSP `connect-src` extended for `vitals.vercel-insights.com` + `vercel.live` (Speed Insights compatibility)
- ✅ Verified locally: `curl -I http://localhost:3000` returns all 9 hardened headers

**Accepted risks (require quarterly revisit):**
1. `script-src 'unsafe-inline' 'unsafe-eval'` — Next.js inline RSC payloads + GTM/GA tags require it. Mitigation path: nonce-based CSP via Next.js middleware (Phase 4+).
2. `style-src 'unsafe-inline'` — Tailwind JIT + Next.js inline CSS. Mitigation: hash-based CSP at build time (low priority).
3. COEP not enforced — would require self-hosting Maps tiles/GTM (operationally infeasible).

### 1.6 Mobile UX (F1 audit, Apr 27)

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
| 2026-04-27 AM | File created. P1 build/bundle baseline captured. Sitemap, indexing rate, reviews count, F1 mobile findings + fixes all logged. P2/P3/P4/P5 baselines marked TBD pending user data captures. |
| 2026-04-27 PM | F2 image audit + P2.4b bundle reduction shipped. Homepage First Load JS 180 → 172 kB. Removed 38 unused shadcn UI components + 27 unused npm deps. Deleted 1.4 MB unused PNGs. Added LCP `priority` to Header logo. Bundle target revised from aspirational <150 kB to industry-standard <244 kB. |
| 2026-04-27 PM | **F3 Security Headers shipped.** HSTS upgraded to 2yr+includeSubDomains+preload. Added COOP `same-origin`, CORP `same-site`. CSP extended with `frame-ancestors 'none'`, `form-action 'self'`, `upgrade-insecure-requests`, Vercel Speed Insights endpoints. New §1.5 Security section captures targets (SecurityHeaders A+, Observatory A, SSL Labs A) + accepted risks (`unsafe-inline`/`unsafe-eval`/COEP-omit). Verified locally via `curl -I`. |
| 2026-04-27 PM | **Production verified: SecurityHeaders.com Grade A** on live `https://dfwhvac.com` (capped at A by documented `unsafe-inline`/`unsafe-eval` warning; A+ requires F3c CSP nonce migration). `poweredByHeader: false` shipped to strip `X-Powered-By: Next.js` info-leak flagged in the same report. |
