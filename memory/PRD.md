# DFW HVAC Website - Product Requirements Document

## Original Problem Statement
Build a premium, conversion-focused website for DFW HVAC company using Next.js frontend and Sanity.io for content management. The site follows a **phone-first conversion strategy** — funneling users to call the business directly or submit a lead form for a callback. The Housecall Pro booking integration was intentionally removed due to operational constraints.

## User Personas
- **Business Owner**: Needs strategic data to optimize service delivery and marketing
- **Potential Customers**: Looking for HVAC services in the DFW area
- **Marketing Team**: Requires data-driven insights for targeting campaigns

## Core Conversion Strategy
**Phone-First, Form-Second**
1. **Primary CTA**: "Call Now" (click-to-call)
2. **Secondary CTA**: "Request Service" (leads to contact form)
3. **Tertiary CTA**: Subtle link to `/estimate` for replacement quotes

## Core Requirements
1. Dynamic website with Sanity CMS for all content
2. Lead capture with email notifications
3. SEO-optimized pages with structured data
4. Service area definition with drive-time analysis
5. Phone-first conversion optimization

---

## Current Status
**Phase:** Development
**Caching Mode:** Development (No Cache) - optimized for content iteration
**Last Updated:** February 2025

---

## Completed Work

### Phase 1: CMS Architecture (Feb 2025)
- Created `aboutPage`, `contactPage`, `trustSignals` schemas
- Extended `siteSettings` with logo tagline, legacy statement, mission
- Extended `companyInfo` with legacy start year
- Updated all schema defaults to new brand messaging

### Phase 2: Brand Content Migration (Feb 2025)
- Seeded Sanity with brand framework content
- Updated all service pages, Header/Footer, HomePage
- Created AboutPageTemplate with brand pillars and Legacy Timeline
- Fixed Portable Text paragraph spacing

### Google Reviews Auto-Sync (Feb 2025)
- Google Places API integration (daily cron at 6 AM UTC)
- Live data: 5.0 rating, 135+ reviews
- Removed all hardcoded review counts

### City Pages (Feb 2025)
- Added 31 missing zip codes
- Created 4 new city pages (Lewisville, Arlington, Haslet, Mansfield)
- Updated priorities based on drive-time zones
- Connected trust badges to CMS

### UI Fixes (Feb 2025)
- Fixed logo white edges in footer (clip path)
- Created Services hub page (`/services`)
- Removed "Write a Google Review" button
- Added Handshake and Trending Up icons

### About Page Reorder (Feb 2025)
- Reordered content blocks to: Our Values -> Our Legacy -> Our Story
- Optimized for visitor conversion (values-first approach)

### Previous Completions
- Service Area Analysis (4-zone model, 139 zip codes)
- Sanity CMS Migration (all content)
- Google Reviews Import (130 reviews)
- Dynamic Page System
- SEO Schema Markup (LocalBusiness, Review, FAQ)
- TTS Voice Previews (9 samples)
- Brand Strategy & Competitor Analysis

---

## Pending Tasks

> **See `/app/frontend/PROJECT_TASKS.md` for the complete, authoritative checklist.**

### P0 - Critical
- [ ] **Lead Capture Form Backend** - Implement email notifications using Resend
- [ ] **Legal Pages** - Privacy Policy and Terms of Service
- [ ] **301 Redirects** - 6 redirects for old URLs before launch
- [ ] **Custom Domain Setup** - DNS, SSL, www redirect

### P1 - Important
- [ ] **SEO Implementation** - sitemap.xml, robots.txt, canonical URLs, structured data
- [ ] **Conversion Optimization** - Sticky mobile CTA, trust badges above fold
- [ ] **YouTube Video Embed** - Indoor Air Quality page
- [ ] **Content Creation** - Case studies, financing pages
- [ ] **Internal Linking** - Cross-link services ↔ cities
- [ ] **Performance Optimization** - Lighthouse audit
- [ ] **Pre-Launch Verification** - Mobile/browser testing, forms, broken links

### P2 - Post-Launch
- [ ] Production Caching Mode (webhook revalidation)
- [ ] Marketing & Analytics (GA4, GTM, Facebook Pixel)
- [ ] Google Business Profile setup
- [ ] Local Citations (Yelp, BBB, Angi, etc.)
- [ ] City Page SEO Enhancement (300-500 word descriptions)
- [ ] City + Service Combination Pages
- [ ] Feature Enhancements (clean URLs, seasonal strategy, etc.)
- [ ] Code Cleanup (remove mockData.js, unused deps)

---

## Technical Architecture

### Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Shadcn/UI
- **CMS:** Sanity.io (self-hosted studio at `/studio`)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Hosting:** Vercel

### 3rd Party Integrations
| Service | Status | Notes |
|---------|--------|-------|
| Sanity.io | Active | CMS |
| Google Places API | Active | Daily review sync |
| Vercel | Active | Hosting + cron jobs |
| Resend | Pending | Lead form emails |
| GA4/GTM | Future | Analytics |
| Facebook Pixel | Future | Marketing |

---

*Last Updated: February 11, 2025*
