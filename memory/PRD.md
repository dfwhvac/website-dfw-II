# DFW HVAC — Product Requirements Document

**Last Updated:** April 18, 2026

---

## Original Problem Statement

Build a premium, conversion-focused website for DFW HVAC using Next.js frontend and Sanity.io CMS. The site serves as a lead funnel for the HVAC business, featuring service pages, city pages, reviews, and lead capture forms.

## Architecture

- **Frontend:** Next.js 14.2.35 (App Router) deployed on Vercel
- **CMS:** Sanity.io (headless CMS)
- **Database:** MongoDB Atlas (leads collection)
- **Email:** Resend API (lead notifications)
- **Domain:** dfwhvac.com (GoDaddy DNS → Vercel)
- **APIs:** Google Maps/Places, Google reCAPTCHA v3, RealWork widget

## What's Been Implemented

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
1. Next.js upgrade (14→15+) + npm vulnerability fixes (23 vulnerabilities)
2. Audit site for speed, SEO, and conversion
3. Google Search Console setup
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
