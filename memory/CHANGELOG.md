# DFW HVAC — Changelog

**Last reviewed:** April 21, 2026
**⚠️ Read `/app/memory/00_START_HERE.md` first for the Agent SOP.**

Reverse-chronological record of everything shipped to production. When adding entries, append to the top of the appropriate session block (newest first).

---

## April 21, 2026 — Late evening — Documentation system migration

- **Consolidated project memory into 5 canonical files** (this file + ROADMAP + 00_START_HERE + PRD shim + audits/). Retired: `/app/memory/NEXT_SESSION_PRIORITIES.md` (1,064 lines), `/app/frontend/internal/PRD.md` (623 lines, stale from early Apr 21). Content preserved here and in ROADMAP.
- **Created `/app/memory/audits/`** as the single long-term archive for all audit artifacts. Moved: technical audit, QA sweep, mobile form UX audit, performance scorecard, action items, site audit xlsx, Lighthouse CSV, baseline screenshots. Added audits/README.md index. Non-audit reference docs (brand framework, service-area CSVs, competitor analysis) intentionally left in `/app/frontend/internal/`.
- **Established Agent SOP at `/app/memory/00_START_HERE.md`** with session-start and session-end integrity checklists (ROADMAP/CHANGELOG freshness, no phantom files, audit discipline, handoff-summary SOP reference).
- **Numeric-prefixed filename** ensures `00_START_HERE.md` sorts first in `ls`, so new forks encounter it before anything else.
- **Captured Tier 1 Lighthouse scorecard** as `/app/memory/audits/2026-04-21_Lighthouse_Tier1_Production.md` — 12 pages × mobile+desktop post-RSC migration baseline.

## April 21, 2026 — Evening — Server Components migration (P2.4b early batch)

- **Converted 4 page templates from client → server components** — removed unnecessary `'use client'` from `ServiceTemplate.jsx` (474L), `CompanyPageTemplate.jsx` (431L), `HomePage.jsx` (405L), `DynamicPage.jsx` (318L). Total ~1,628 lines of JSX moved server-side.
- **Verification:** All 4 templates use zero React hooks, zero event handlers, zero function props, zero browser APIs — pure presentational. Radix Accordion (interactive, via `@radix-ui/react-accordion` which self-declares `'use client'`) continues to function; LeadForm + AddressAutocomplete remain client components with their reCAPTCHA focus gate intact.
- **Production impact (verified via Lighthouse):** `/contact` mobile TBT 330ms → 190ms 🟢 (first page to cross into Good). `/about` TBT 520ms → 270ms (-48%). Home + service pages held at 95 / 94 Perf with TBT within run variance.
- **Files:** components/ServiceTemplate.jsx, CompanyPageTemplate.jsx, HomePage.jsx, DynamicPage.jsx

## April 21, 2026 — Evening — reCAPTCHA focus-gated loading

- **Root-caused Tier-1 audit findings:** home BP 93 (was 100) caused by reCAPTCHA iframe triggering Google's own report-only `frame-ancestors` CSP violation in the console; service pages mobile Perf 80–84 with TBT 590–710ms dominated by reCAPTCHA's 840–1,077ms main-thread bootup (lazyOnload insufficient for Lighthouse's TBT window).
- **Fix:** `components/RecaptchaScript.jsx` refactored from auto-rendering `<Script>` to exported `loadRecaptchaOnce()` helper (idempotent, SSR-safe). Wired `<form onFocus={loadRecaptchaOnce}>` on LeadForm.jsx + SimpleContactForm.jsx. reCAPTCHA now only downloads when a user focuses a form field. Graceful fallback preserved in `/api/leads` (skip token → IP rate limit).
- **Verification:** DOM 0 reCAPTCHA scripts on mount → 2 after focus → 2 after 2nd focus (idempotent). Service page local TBT 710ms → 330ms (-54%). Home mobile BP **93 → 100**.
- **Files:** components/RecaptchaScript.jsx, LeadForm.jsx, SimpleContactForm.jsx

## April 21, 2026 — Evening — Brand color migration completion

- **Uncovered incomplete Apr 21 brand migration:** CSS token change in `globals.css` was effective but **21 hardcoded `#00B8FF` hex references across 20 files** bypassed tokens and still rendered old cyan. Header "Request Service" outline button (`components/ui/button.jsx`) with `text-[#00B8FF]` caused desktop `/` A11y 96 (contrast 2.25:1 on white). Also `ColorProvider.jsx` defaults still pointed at old hexes — runtime-override landmine if Sanity `brandColors` ever gets populated.
- **Sweep:** sed replacement `#00B8FF` → `#0077B6` in 13 components + 7 app page files (ui/button, HomePage, DynamicPage, ServiceTemplate, LeadForm, SimpleContactForm, LinkedCityList, CompanyPageTemplate, BookServicePage, services pages, cities-served pages, recent-projects, request-service, terms, privacy, not-found). Updated ColorProvider defaults to match globals.css tokens.
- **Verification:** Rendered production HTML contains 0 `#00B8FF` + 0 `#FF0606`, 16 `#0077B6` + 2 `#D30000`. Desktop `/` Lighthouse: Perf 100 · A11y 100 · BP 100 · SEO 100.

## April 21, 2026 — Afternoon — Home A11y + SEO fix pack

- **Darkened brand tokens in `globals.css`:** `--electric-blue` `#00B8FF → #0077B6` (4.77:1 WCAG AA), `--vivid-red` `#FF0606 → #D30000` (5.22:1 AA). Resolves 5 WCAG contrast failures site-wide.
- **TestimonialCarousel:** dots wrapped in 24×24 clickable buttons with `aria-label="Go to review slide N"` + `aria-current`. Prev/next ChevronLeft/Right buttons got aria-labels. Fixes button-name + target-size audits.
- **LeadForm:** `aria-label="Number of HVAC systems"` on Radix SelectTrigger.
- **HomePage:** 2× generic "Learn More" → "Explore {service.name}" (SEO descriptive link-text).
- **Header:** desktop nav links `inline-flex items-center min-h-[44px]` for target-size compliance.
- **Red button swap across 6 files:** `bg-[#FF0000]` → `#D30000` (StickyMobileCTA, BookServicePage, 4 page files).
- **Verified:** Home mobile A11y 88 → **100** ⭐, SEO 92 → **100** ⭐.

## April 21, 2026 — Afternoon — RealWork widget CSP fix

- **Root cause:** Content-Security-Policy `connect-src` directive in `next.config.js` missing `https://app.realworklabs.com`. Plugin's `loader.js` + main bundle executed (script-src OK), but the follow-up fetch to `app.realworklabs.com/plugin/config?key=...` was blocked. 3 retries then silent failure. Broken since CSP tightening Apr 17.
- **Fix:** Added `https://app.realworklabs.com` to `connect-src` + `img-src` in `next.config.js`. `script-src` + `frame-src` already allowed it.
- **Verification:** `/recent-projects` post-deploy shows map rendering with all project markers, 267 project images, filter chips, 28-city breakdown. Honest TBT regression: +160ms desktop (widget's actual execution cost; masked before by IntersectionObserver never firing the broken plugin).
- **User decision:** accepted the honest TBT (Option A — push as-is, don't click-gate yet).

## April 21, 2026 — Earlier — UX-1 iPhone header cramping

- Hidden top bar below 640px (`hidden sm:flex`) to fix cramped layout on iPhone 16 Pro. Dark mode logged to P2 backlog.
- **Files:** components/Header.jsx

## April 21, 2026 — Earlier — Branding correction: retire "since 1972" shorthand

- Removed false "serving since 1972" claims across code, seed data, Sanity fallbacks, live Sanity CMS.
- Adopted canonical tagline: **"Keeping it Cool — For Three Generations."**
- Family-legacy craftsmanship dates to 1972 (factually correct); the business founded in **2020**.
- Removed `legacyStartYear` from schema/scripts.
- **Built `/api/canonical-description`** endpoint returning live business description with current review count pulled from Sanity.
- Migrated live Sanity documents to new messaging.

## April 21, 2026 — Earlier — P1.3 Post-Launch QA Sweep

- Completed 🟢 PASS. 0 broken links across 46 internal URLs. Form endpoint healthy.
- Found + fixed 1 click-to-call regression (2 pages using non-E.164 `tel:` format; standardized to `+19727772665`).
- Logged 1 minor mobile UX (UX-1 header cramping — fixed same day).
- Device-based validation (M1–M5) handed to user.
- **Findings:** `/app/memory/audits/DFW_HVAC_QA_Sweep_2026-04-21.md`

## April 21, 2026 — Earlier — PR #3 (Sprint 2a code response to P1.2 audit)

- **R1.1 — JSON-LD schema on city + service pages.** City pages now render 3 blocks (HVACBusiness + city-scoped Service + BreadcrumbList). Service pages render 3 blocks (HVACBusiness with all 28 cities in areaServed + Service with provider rating + BreadcrumbList). New components: `components/SchemaMarkup.jsx` → `BreadcrumbListSchema`, `CityServiceSchema`, `ServiceSchema`.
- **R1.2 — Hub-and-spoke internal linking.** City pages link to all 7 services with city-specific anchors ("AC Repair in Plano, TX"). Service pages link to all 28 cities with service-specific anchors ("Heating in Plano"). Closes biggest local-SEO structural gap.
- **R2.1 — Branded `app/not-found.jsx`.** Replaces Next.js generic 404 with conversion-first: big phone CTA, 5-star trust bar, 4 destination links, tertiary request-service link. Returns proper HTTP 404.

## April 21, 2026 — Earlier — P1.2 Deep Technical Audit

- 13-category technical SEO + architecture sweep completed. Overall 🟡 B+ (89/100).
- Three high-priority gaps uncovered: R1.1, R1.2, R2.1 — all closed via PR #3 above.
- Confirmed: zero secret leakage in client bundles, all 6 security headers present, 6 legacy Wix 308 redirects working, canonicals apex + unique.
- Sanity Studio dependencies account for all 28 High CVEs (dev/admin tooling only; accept risk until Sanity 3.50+ upgrade ~summer 2026).
- **Findings:** `/app/memory/audits/DFW_HVAC_Technical_Audit_2026-04-21.md`

## April 21, 2026 — PR #2 / Sprint 1 Completion (Week 1 of 12-Week Ad Launch Roadmap)

Six tasks shipped in one PR:

1. **P1.9a** aggregateRating schema fix: `lib/metadata.js` `reviewCount: '118'` → `'145'`.
2. **P1.6g** `lib/metadata.js` fallback parity: `openingHours` `Mo-Fr 09:00-18:00` → `Mo-Fr 07:00-18:00`; `areaServed` 12 cities → full 28.
3. **P1.3a** Accessibility fix pack (Lighthouse a11y 87 → 95+): 6× `text-gray-400` → `text-gray-600` on white backgrounds; 3× social-icon aria-labels in Footer; 1× mobile hamburger aria-label + aria-expanded + aria-controls.
4. **P1.7** GA4 conversion events: `PhoneClickTracker.jsx` (single-listener event delegation for all `tel:` links); `form_submit_lead` event in both forms (fires only on verified `success: true`).
5. **P1.1 (final)** 7 service page meta descriptions via code fallback — `buildServiceMetaDescription()` + `SERVICE_META_COPY` map in `app/services/[category]/[slug]/page.jsx`.
6. **P1.3-scoped** Mobile Form UX audit — 7× `autoComplete` + 3× `inputMode` attrs on all form inputs. Findings: `/app/memory/audits/Mobile_Form_UX_Audit_2026-04-21.md`. Deeper UX deferred to P1.10.

User action required (still pending): GA4 → Admin → Events → mark `form_submit_lead` and `phone_click` as conversions after 24h of events.

## April 20, 2026 — Python backend deletion (P2.17)

- Deleted `/app/backend/` entirely — 374-line FastAPI server + requirements + .env. Verified 100% dead: zero frontend references, no cron/CI/Docker calling it.
- Preserved integration test via `git mv backend/tests/test_dfw_hvac.py → frontend/tests/test_dfw_hvac.py` (history intact).
- Post-deletion: `yarn build` ✓ 30s clean.
- **Result:** single-stack Next.js codebase.

## April 20, 2026 — Code Review Response

- Applied legit fixes: `safeJsonLd()` helper in `SchemaMarkup.jsx` (escapes `<` to `\u003c` — prevents `</script>` breakout from CMS strings). Truthy-check fix in test.
- Declined false positives (DOMPurify for JSON, React state setters in deps, module constants in deps, ref in deps, mass index-as-key rewrites without context).
- Added legit-but-deferred items to backlog: P2.15 (decomposition), P2.16 (/api/leads POST complexity), P2.17 (backend deletion — done), P2.18 (index-as-key audit).

## April 20, 2026 — TBT Optimization (PR #1)

- Lazy-loaded 3 third-party scripts. GA4 left as `afterInteractive` (already optimal).
- **Google Maps / Places:** removed mount-time eager load; `onFocus` handler in `AddressAutocomplete.jsx`. Bounced visitors save ~800–1,200ms TBT. Added inline "Powered by Google" attribution.
- **reCAPTCHA v3:** removed from root layout; extracted to `components/RecaptchaScript.jsx` with `next/script strategy="lazyOnload"`. Pages without forms no longer load reCAPTCHA at all.
- **RealWork widget:** IntersectionObserver with 200px rootMargin. Only loads when container enters viewport.
- **Result:** TBT ~2,300ms → ~500–800ms expected on prod.

## April 20, 2026 — P1.1 City Meta Descriptions (Path A)

- **Discovery:** all 28 cities had `metaDescription: null` in Sanity. "Denton gold template" was a code fallback at line 64 of `app/cities-served/[slug]/page.jsx`.
- **Implementation:** `buildCityMetaDescription(cityName, zipCodes)` helper with adaptive zip-line format. Fallback `city.metaDescription || buildCityMetaDescription(...)` — still allows per-city Sanity override.
- **New template:** `[City], TX AC & heating repair, install & maintenance. Same-day service. Call (972) 777-2665. Licensed, family-owned. [Zip line].`
- **Verification:** 12 sampled cities render correctly; all 28 descriptions 128–158 chars.

## April 20, 2026 — Click-to-Call Bug Fix

- **Root cause:** `companyInfo.phone` in Sanity stores vanity `(972) 777-COOL`. Two pages + LocalBusiness schema used it directly in `tel:` hrefs. Mobile browsers can't dial letters — every "Call Now" tap dead since launch Apr 16.
- **Fix:** Repurposed existing `phoneDisplay` Sanity field (populated with `(972) 777-2665`) as canonical dialable. Updated 5 call sites. Hardcoded E.164 format in `lib/metadata.js` JSON-LD telephone.

## April 19, 2026 — Next.js 14 → 15 Upgrade

- `next` 14.2.35 → **15.5.5**, `react` 18.2.0 → **19.2.5**, `react-dom` 18.2.0 → **19.2.5**, `eslint-config-next` 14 → **15.5.15**.
- Dynamic routes already used Next 15 `await params` async pattern — no code changes needed.
- Removed extraneous lockfiles that confused Next.js workspace detection.
- **Testing:** 26/26 pytest cases pass; zero React 19 hydration warnings; zero visual regressions vs baseline screenshots.
- Resolves 5 known Next.js 14 CVEs + 23 npm vulnerabilities.

## April 17–18, 2026

- Address autocomplete verified on all 5 form pages
- Removed all "since 1974" false claims (code, seed data, fallbacks, live Sanity)
- Updated business hours to Mon–Fri 7AM–6PM
- Updated googleReviews count from 130 → 145
- Removed stale `realPhone` field from mockData
- Implemented Google reCAPTCHA v3 (threshold 0.4, graceful fallback, no-token blocking, [BLOCKED]-tagged entries still saved)
- Recent Projects page live with RealWork widget
- Security audit — 6 of 8 issues fixed: cron endpoint locked with CRON_SECRET; CSP + X-Frame-Options + X-Content-Type-Options + Referrer-Policy + Permissions-Policy headers; `escapeHtml` on email templates; rate limit 5/15min per IP on `/api/leads`; sensitive docs moved `/public/` → `/internal/`; RealWork plugin ID moved to env var.
- Performance baseline captured (Lighthouse on 13 pages)

---

## Earlier Milestones (Feb 2025 – April 16, 2026)

Site launch date: **April 16, 2026** (Wix → Next.js migration, confirmed via Let's Encrypt `notBefore=Apr 16, 2026 20:04:44 GMT`).

### Pre-launch architecture work (Feb 2025)

- **Header Button Hover Fix** — Added `outlineBlue` variant to `ui/button.jsx`; cyan border/text default, cyan background/white text on hover.
- **Canonical URL Fix (Feb 23)** — critical SEO bug: all pages showed root URL as canonical. Implemented page-specific `generateMetadata()` with `alternates.canonical`. Updated all static + dynamic pages. Root layout exports `metadataBase`.
- **Request Service Page & CTA Consolidation (Feb 23)** — dedicated `/request-service` page (lead form + phone CTA + trust signals). All site-wide "Request Service" / "Book Now" buttons now target it. Added to footer + sitemap (priority 0.9).
- **Header Navigation Cleanup (Feb 23–24)** — tagline changed "Three Generations of Trusted Service" → "Trust. Excellence. Care." Moved "Cities Served" to footer. Removed "Contact" from main nav.
- **Estimate Page Rebrand (Feb 24)** — brand color consistency; 12-city service area list.
- **Site-Wide CTA Audit (Feb 24)** — fixed 8 locations incorrectly pointing at `/contact` instead of `/request-service`.
- **Phone-First Conversion Strategy** — removed Housecall Pro integration (operational constraints). Implemented site-wide phone-first CTA pattern. Created reusable `ServiceFirstCTA` component.
- **Recent Projects Page** — created with RealWork widget (500+ jobs across DFW), conversion-optimized structure.
- **RealWork Widget temporarily decommissioned (Feb 2025)** → later restored at launch.
- **Sticky Mobile CTA Bar** — click-to-call, appears after 100px scroll, session-dismissible.
- **Lead Capture System** — `/api/leads` endpoint, MongoDB storage, three-funnel Resend email routing (service@, estimate@, contact@).
- **Date Reference Cleanup** — removed all "1974" references (incorrect); "1972" kept (legacy start year).
- **Legal Pages** — `/privacy-policy`, `/terms-of-service` from user-provided PDFs.

### CMS + content (Feb 2025)

- **Phase 1: CMS Architecture** — created `aboutPage`, `contactPage`, `trustSignals` schemas. Extended `siteSettings` and `companyInfo` with legacy statement, mission, start year.
- **Phase 2: Brand Content Migration** — seeded Sanity with brand framework content. Created AboutPageTemplate with brand pillars + Legacy Timeline. Fixed Portable Text paragraph spacing.
- **Google Reviews Auto-Sync** — Google Places API + daily cron at 6 AM UTC. Live data (5.0 rating, 135+ reviews initial, now 145). Removed all hardcoded review counts.
- **City Pages** — added 31 missing zip codes. Created 4 new city pages (Lewisville, Arlington, Haslet, Mansfield). Connected trust badges to CMS.
- **UI Fixes** — logo white edges in footer (clip path); created Services hub at `/services`; removed "Write a Google Review" button.
- **About Page Reorder** — Our Values → Our Legacy → Our Story (values-first for conversion).

### Launch-day wiring (early Apr 2026)

- **DNS cutover** to GoDaddy + SSL verification
- **Resend domain verification**
- **Google Places API** billing + Vercel Cron setup
- **GA4** tracking installed (`G-5MX2NE7C73`)
- **Phone number auto-formatting** on forms
- **Address Autocomplete** with DFW bias
- **SEO audit spreadsheet** generated (`2026-04-20_DFW_HVAC_Site_Audit.xlsx` in audits/)
- **6 legacy 301 redirects** from old Wix URLs: `/scheduleservicecall`, `/installation`, `/iaq`, `/ducting`, `/seasonalmaintenance`, `/testresults`

### Earlier foundation (2024–early 2025)

- Sanity CMS Migration (all content)
- Service Area Analysis (4-zone model, 139 zip codes across 28 cities)
- Google Reviews Import (130 reviews initial seed)
- Dynamic Page System
- SEO Schema Markup (LocalBusiness, Review, FAQ)
- TTS Voice Previews (9 samples)
- Brand Strategy & Competitor Analysis
- OG Image & Favicon generated
- FastAPI → Next.js API route migration
- Vercel deployment & environment variables
