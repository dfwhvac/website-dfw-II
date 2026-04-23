# DFW HVAC — Product Requirements Document (shim)

**⚠️ NEW AGENTS — read `/app/memory/00_START_HERE.md` first for the Agent SOP.**

This file is a minimal index. The live content lives in three places:

- **Current priorities + roadmap:** `/app/memory/ROADMAP.md`
- **What's been shipped (dated):** `/app/memory/CHANGELOG.md`
- **Past audits + performance baselines:** `/app/memory/audits/`

---

## Original Problem Statement

Build a premium, conversion-focused website for DFW HVAC using Next.js frontend and Sanity.io CMS. The site is a lead funnel for the HVAC business (service pages, city pages, reviews, lead capture forms). **Phone-first** conversion strategy: primary CTA is click-to-call, secondary is the form, tertiary is `/estimate`.

## User Personas

- **Business Owner** — needs strategic data to optimize service delivery and marketing
- **Potential Customers** — searching for HVAC services in the Dallas-Fort Worth metroplex
- **Marketing Team** — requires data-driven insights for targeting campaigns

## Core Requirements

1. Dynamic, content-managed site (Sanity CMS drives all copy)
2. Lead capture with email notifications (Resend)
3. SEO-optimized pages with structured JSON-LD data
4. Service-area-aware (DFW metroplex, 28 cities, 4 drive-time zones, 139 ZIPs)
5. Phone-first conversion optimization sitewide

## Architecture

- **Frontend:** Next.js 15.5.9 (App Router) + React 19.2.5 — deployed on Vercel from `main` branch
- **CMS:** Sanity.io (headless, studio at `/studio`)
- **Database:** MongoDB Atlas (leads collection)
- **Email:** Resend (domain-verified at `dfwhvac.com`)
- **Domain:** dfwhvac.com (GoDaddy registrar → Vercel DNS)
- **Integrations:** Google Maps/Places, Google reCAPTCHA v3, RealWork widget, GA4 (`G-5MX2NE7C73`), Google Search Console (verified Feb 20, 2026)

## Brand Messaging (canonical)

- **Tagline:** "Keeping it Cool — For Three Generations."
- **Founded:** 2020 (do NOT claim "serving since 1972"). Family-legacy craftsmanship dates to 1972; three-generation story is accurate.
- **Headquartered:** Coppell, TX. Serves full DFW metroplex.
- **Reviews:** 5.0★ with 147 Google reviews (live from Sanity, auto-synced daily). Page titles use Option C hybrid logic — see `lib/metadata.js::getReviewBadgeCount` and `fiveStarReviewCount` safety-net field (seeded at 150).
- **Live description endpoint:** `GET https://dfwhvac.com/api/canonical-description`

## Critical Context for New Agents

- **Site is LIVE on Vercel.** Push to `main` triggers production build. No staging.
- **Single-stack:** Next.js only. Python `/app/backend/` was deleted April 20, 2026.
- **All API routes under `/app/frontend/app/api/`.** Never create new Python services.
- **Non-audit reference docs** (brand framework, service-area CSVs, competitor analysis, legacy PRD snapshots) live in `/app/frontend/internal/` — left there intentionally.
