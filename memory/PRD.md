# DFW HVAC — Product Requirements Document

**Last Updated:** April 20, 2026 (click-to-call bug fix + P1.6 ranking factor audit added)

---

## 🎯 FOR THE NEXT AGENT: START HERE

The canonical, fully-contextualized prioritized backlog is at:

**`/app/memory/NEXT_SESSION_PRIORITIES.md`**

That document has the full WHY, WHAT, and WHERE for every P1 and P2 task. Read it first. The rest of this PRD is background context.

---

## Original Problem Statement

Build a premium, conversion-focused website for DFW HVAC using Next.js frontend and Sanity.io CMS. The site serves as a lead funnel for the HVAC business, featuring service pages, city pages, reviews, and lead capture forms.

## Architecture

- **Frontend:** Next.js 15.5.9 (App Router) + React 19.2.5 deployed on Vercel
- **CMS:** Sanity.io (headless CMS)
- **Database:** MongoDB Atlas (leads collection)
- **Email:** Resend API (lead notifications)
- **Domain:** dfwhvac.com (GoDaddy DNS → Vercel)
- **APIs:** Google Maps/Places, Google reCAPTCHA v3, RealWork widget

## Key Milestones

- **Site launched (Wix → Next.js):** April 16, 2026 (confirmed via Let's Encrypt SSL cert issue date `notBefore=Apr 16, 2026 20:04:44 GMT`)
- **Next.js 14 → 15.5.9 + React 19 upgrade deployed:** April 20, 2026
- **GSC Domain property added:** February 20, 2026 (pre-launch; data before Apr 16 reflects the old Wix site)

## What's Been Implemented

### Session: April 20, 2026 (continued) — Click-to-Call Bug Fix
- **Root cause:** `companyInfo.phone` in Sanity stores the vanity format `(972) 777-COOL`. Two pages (`/services`, `/cities-served`) and the LocalBusiness schema (`SchemaMarkup.jsx` x2, `lib/metadata.js`) used this value directly in `tel:` hrefs. Mobile browsers cannot dial letters — every tap on "Call Now" was a dead-end conversion since site launch Apr 16.
- **Fix (Option B — clean architecture, single source of truth):**
  - Repurposed existing `phoneDisplay` Sanity field (already populated with `(972) 777-2665`) as the canonical dialable value
  - Updated 5 call sites to use `companyInfo.phoneDisplay || '+1-972-777-2665'` fallback
  - Improved Sanity schema field descriptions so future editors know which field goes where (vanity text vs. tel: hrefs)
  - Hardcoded E.164 format in `lib/metadata.js` JSON-LD telephone field for schema parser compatibility
- **Verified:** `yarn build` passes (no regressions, all 11 static pages + dynamic routes compile). Local `next start` + curl confirms:
  - `/services` + `/cities-served` "Call Now" hrefs now render `tel:(972) 777-2665` ✓
  - LocalBusiness schema `telephone` now renders `(972) 777-2665` ✓
  - 22 hardcoded `tel:+19727772665` links across Header/Footer/etc. unchanged (were already correct)
- **Impact:** Restores mobile click-to-call conversion on two of the highest-intent landing pages. Ready for merge to main → Vercel auto-deploy.

### Session: April 19, 2026 — Next.js 14 → 15 Upgrade
- Upgraded `next` 14.2.35 → **15.5.5**, `react` 18.2.0 → **19.2.5**, `react-dom` 18.2.0 → **19.2.5**, `eslint-config-next` 14 → **15.5.15**
- Verified all dynamic route pages already use the Next 15 `await params` async pattern — no code changes needed
- Removed extraneous lockfiles (`/app/frontend/package-lock.json`, empty `/app/yarn.lock`) that confused Next.js workspace detection
- `yarn build` passes with no errors; all 11 static pages + dynamic routes compile successfully
- **Testing (testing_agent_v3_fork iteration_1):** 26/26 pytest cases pass; all critical flows verified end-to-end
  - All 14 page routes HTTP 200 (home, about, contact, services, service detail, cities-served, city detail, reviews, faq, estimate, request-service, recent-projects, privacy, terms)
  - `/api/leads` validation (400), happy-path (200 + MongoDB persistence), rate-limit (5/15min enforced), HTML sanitization — all pass
  - `/api/cron/sync-reviews` auth (401 without Bearer, proceeds with CRON_SECRET)
  - Lead forms on /contact, /request-service, /estimate submit successfully end-to-end
  - All 6 legacy redirects (301) still work (/scheduleservicecall, /installation, /iaq, /ducting, /seasonalmaintenance, /testresults)
  - Security headers intact (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - **Zero React 19 hydration warnings, zero page errors, zero visual regressions** vs baseline screenshots
- Pytest regression suite created at `/app/backend/tests/test_dfw_hvac.py` for future runs
- Resolves 5 known Next.js 14 CVEs (DoS, request smuggling) and 23 npm vulnerabilities

### Session: April 17-18, 2026
- Address autocomplete verified working on all 5 form pages
- Removed all "since 1974" false claims across code, seed data, fallbacks, and live Sanity CMS
- Updated business hours to Mon-Fri 7AM-6PM (code, seed, fallback, live Sanity)
- Updated googleReviews count from 130 to 145 (code, fallbacks, seed, live Sanity meta description)
- Removed stale `realPhone` field from mockData
- Implemented Google reCAPTCHA v3 on all forms (threshold 0.4, blocked email notifications, graceful fallback, no-token blocking)
- Recent Projects page live with RealWork widget, added to nav and sitemap
- Comprehensive security audit completed — 6 of 8 issues fixed:
  - Cron endpoint locked with CRON_SECRET
  - Security headers added (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - Input sanitization (escapeHtml) on all email template user fields
  - Rate limiting on /api/leads (5 per 15 min per IP)
  - Sensitive internal documents moved from /public/ to /internal/
  - RealWork plugin ID moved to env var
- Performance baseline captured (Lighthouse on 13 pages)
- Performance scorecard document created with 6 measurement categories
- Action items document consolidated and updated

### Prior Sessions
- Sanity Schema Data Patch (fixed missing keys on process steps)
- OG Image & Favicon generated
- FastAPI → Next.js API route migration
- Vercel deployment & environment variables
- DNS cutover to GoDaddy + SSL verification
- Resend domain verification
- Google Places API billing + Vercel Cron setup
- GA4 tracking installed
- Phone number auto-formatting on forms
- Address Autocomplete with DFW bias
- SEO audit spreadsheet generated

## Prioritized Backlog

### High Priority
1. ~~Next.js upgrade (14→15+) + npm vulnerability fixes~~ ✅ **DONE Apr 19, 2026** (now on 15.5.9 + React 19)
2. Audit site for speed, SEO, and conversion
2a. **Deep technical SEO & architecture audit** ⭐ Added Apr 20, 2026 after discovering `/_next/` robots.txt bug. Systematic sweep for legacy anti-patterns: robots.txt/meta-robots consistency, HTTP headers, canonical tags, structured data (JSON-LD), OG/Twitter meta, internal linking, image optimization, 3rd-party scripts, 404/redirect coverage, mobile/a11y, HTML validation, security, supply-chain. Deliverable: `/app/frontend/internal/DFW_HVAC_Technical_Audit_YYYY-MM-DD.md` (3-5 hrs, quarterly cadence). Details in Action_Items.md item 2a.
2b. **Page-by-page ranking factor audit** ⭐ Added Apr 20, 2026 to address the meta-description-is-not-ranking-factor gap. Systematic matrix of ~47 pages × 10 ranking factors (title tag, body content depth, GBP, backlinks, Core Web Vitals/INP, NAP, internal linking, reviews, schema, meta desc). Sub-tasks P1.6a–f: title audit (highest leverage), body content depth, backlink profile, INP measurement, review cadence, schema verification. Deliverable: `/app/frontend/internal/DFW_HVAC_Ranking_Factor_Audit_YYYY-MM-DD.md`. ~10–15 hrs across sessions. Full context in NEXT_SESSION_PRIORITIES.md § P1.6.
3. ~~Google Search Console setup~~ ✅ **MOSTLY DONE** (verified Apr 20, 2026 — Domain property, GA4 linked, crawling active)
3a. **Post-migration GSC health check** — Site launched Apr 16, 2026. Submit sitemap, verify all 47 URLs index within 4 weeks, watch for 404s on old Wix URLs, use URL Inspection to request indexing on top ~10 pages. Capture baseline Performance numbers. Wait until ~May 14 for clean 28-day "new vs old" comparison. Details in Action_Items.md item 3a.
4. Pre-launch verification (mobile, cross-browser, broken links)
5. Internal linking audit

### P2 — Important
6. Custom Meta Descriptions — 7 Service Pages & 28 City Pages
7. "50+ cities" claim cleanup
8. Google Business Profile setup
9. Local citations (Yelp, BBB, Angi, HomeAdvisor, Thumbtack)
10. Production caching mode (webhook revalidation)
11. Code cleanup (unused dependencies, Sanity production mode)
12. Google Tag Manager setup
13. Facebook Pixel setup
14. GA4 conversion event setup (form submissions, click-to-call)
15. **Next.js 15 → 16 upgrade (+ Sanity 3.50+)** — Revisit ~summer 2026 once Next 16.3+ ships with more bake time. Bundle with Sanity upgrade to clear React 19 peer-dep warnings. Expected effort: 30–60 min (async params already done, no middleware, no parallel routes). Trigger earlier if 15.x CVE isn't backported or we need 16-only features (Cache Components, View Transitions).
16. **TBT optimization — lazy-load 3rd-party scripts** — Reduce TBT from ~2,300ms → ~400ms and Perf score 69 → 85+ by lazy-loading Google Maps (on form focus), reCAPTCHA (lazyOnload), GA4 (afterInteractive), and RealWork widget (IntersectionObserver). ~3 hrs. UX-only win (LCP + CLS already passing, so no SEO impact). Details in Action_Items.md item 13b.

### P3 — Backlog
15. AI Readiness / AEO
16. Expand City Page Content (300-500 words per city)
17. Content Hub / Resources Section
18. Content creation (case studies, financing page)
19. YouTube video embed (IAQ page)
20. Housecall Pro Direct API Integration
21. RealWork subscription evaluation
22. Latent Sanity data bug (graceful null handling)
23. Cancel Wix subscription

### Recurring
24. Analyze fallback / seed data for inaccuracies — Annual

## Key Documents (in /frontend/internal/)
- DFW_HVAC_Action_Items.md — Master task list
- DFW_HVAC_Performance_Scorecard.md — Lighthouse baselines & recurring metrics
- DFW_HVAC_Site_Audit.xlsx — SEO status spreadsheet
- baseline-screenshots/ — 13 page screenshots for pre-upgrade comparison
- package.json.backup-v14 — Dependency backup before upgrade
- yarn.lock.backup-v14 — Lock file backup before upgrade

## Key Technical Notes
- THE SITE IS LIVE ON VERCEL. Changes pushed to GitHub trigger production builds.
- Address Autocomplete will NOT work in preview environments (Google API key referrer restrictions)
- FastAPI is deprecated. All API routes are Next.js native.
- Vercel token for CLI access: user must provide each session
- Sanity project: iar2b790, dataset: production
- CRON_SECRET protects /api/cron/sync-reviews
- reCAPTCHA threshold: 0.4 (blocked submissions still saved + emailed with [BLOCKED] tag)
- Rate limit: 5 submissions per IP per 15 minutes
