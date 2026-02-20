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

## Domain & Hosting Configuration

### Current Setup (Wix)
| Item | Value |
|------|-------|
| Domain | `dfwhvac.com` |
| Registrar | **GoDaddy.com, LLC** |
| Current DNS | Wix DNS (`ns8.wixdns.net`, `ns9.wixdns.net`) |
| Current Hosting | Wix |
| Domain Created | April 19, 2019 |
| Domain Expires | April 19, 2031 |

### New Setup (Post-Launch)
| Item | Value |
|------|-------|
| Domain | `dfwhvac.com` (unchanged) |
| Registrar | **GoDaddy** (unchanged - no transfer needed) |
| New DNS | Vercel OR GoDaddy DNS |
| New Hosting | Vercel |

---

## Site Launch Transition Plan

### Phase 1: Pre-Launch Preparation
- [ ] Complete all development tasks (see Pending Tasks below)
- [ ] Set up Google Search Console and verify domain ownership
- [ ] Final testing on preview environment
- [ ] Create backup/export of current Wix site content (if needed)

### Phase 2: DNS Transition (Go-Live Day)

**Option A: Use Vercel Nameservers (Recommended - Simplest)**
1. Log into **GoDaddy** → My Products → dfwhvac.com → DNS → Nameservers
2. Change from Wix nameservers to Vercel nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. In Vercel dashboard: Add `dfwhvac.com` as production domain
4. Wait for DNS propagation (15 min - 48 hours)

**Option B: Keep GoDaddy DNS (More Control)**
1. Log into **GoDaddy** → My Products → dfwhvac.com → DNS → Nameservers
2. Change to GoDaddy nameservers (if not already)
3. Add DNS records pointing to Vercel:
   - `A` record: `@` → `76.76.21.21`
   - `CNAME` record: `www` → `cname.vercel-dns.com`
4. In Vercel dashboard: Add `dfwhvac.com` as production domain
5. Wait for DNS propagation

### Phase 3: Post-Launch Verification
- [ ] Verify site loads at `https://dfwhvac.com`
- [ ] Verify `www.dfwhvac.com` redirects properly
- [ ] Verify SSL certificate is active (automatic with Vercel)
- [ ] Test all forms, CTAs, and phone links
- [ ] Verify RealWork widget loads correctly
- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor for 404 errors (implement 301 redirects as needed)

### Phase 4: Cleanup
- [ ] Cancel Wix subscription (after confirming new site is stable)
- [ ] Update any external listings with new site info (if URLs changed)

---

## Current Status
**Phase:** Development
**Caching Mode:** Development (No Cache) - optimized for content iteration
**Last Updated:** February 2025

---

## Completed Work

### Phone-First Conversion Strategy (Feb 2025)
- **Removed Housecall Pro integration entirely** (operational constraints)
- Implemented phone-first CTA pattern site-wide
- Created reusable `ServiceFirstCTA` client component
- All primary CTAs now prompt users to call

### Recent Projects Page (Feb 2025)
- Created `/recent-projects` page with conversion-optimized structure
- Hero section with phone-first CTAs
- Trust stats bar (500+ Projects, 50+ Cities, Since 1974, 3 Generations)
- **RealWork widget placeholder** — awaiting embed code from provider
- SEO internal links to city pages
- Full conversion CTA section at bottom

### Sticky Mobile CTA Bar (Feb 2025)
- Created `StickyMobileCTA` component (site-wide)
- Appears on mobile after scrolling 100px
- Click-to-call with "(972) 777-COOL" display
- Dismissible (persists in session storage)
- Added to root layout for site-wide display

### Legal Pages (Feb 2025)
- Created `/privacy-policy` page from user-provided PDF
- Created `/terms-of-service` page from user-provided PDF
- Both linked in footer

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
- [x] **Lead Capture Form Backend** - ✅ Implemented with three-funnel email routing (service→service@, estimate→estimate@, contact→contact@)
- [ ] **Resend Domain Verification** - Verify `dfwhvac.com` in Resend to enable email notifications (requires DNS records in GoDaddy)
- [ ] **301 Redirects** - Identify and configure redirects for old URLs before launch

### P1 - Important (Pre-Launch)
- [ ] **Google Search Console Setup & Verification** - Verify domain via GoDaddy DNS TXT record; check indexing status
- [ ] **RealWork Widget SEO Evaluation** - Use Search Console to verify if widget content is indexed; determine ROI vs. subscription cost
- [ ] **SEO Implementation** - sitemap.xml, robots.txt, canonical URLs, structured data
- [ ] **YouTube Video Embed** - Indoor Air Quality page
- [ ] **Content Creation** - Case studies, financing pages
- [ ] **Internal Linking** - Cross-link services ↔ cities
- [ ] **Performance Optimization** - Lighthouse audit
- [ ] **Pre-Launch Verification** - Mobile/browser testing, forms, broken links
- [ ] **DNS Transition Planning** - Decide between Vercel nameservers vs. GoDaddy DNS approach

### P2 - Launch Day
- [ ] **DNS Cutover** - Change nameservers in GoDaddy from Wix to Vercel (or update A/CNAME records)
- [ ] **Domain Configuration in Vercel** - Add dfwhvac.com as production domain
- [ ] **SSL Verification** - Confirm HTTPS working on new domain
- [ ] **Post-Launch Testing** - Verify all pages, forms, RealWork widget, redirects

### P3 - Post-Launch
- [ ] Production Caching Mode (webhook revalidation)
- [ ] Marketing & Analytics (GA4, GTM, Facebook Pixel)
- [ ] Google Business Profile setup
- [ ] Local Citations (Yelp, BBB, Angi, etc.)
- [ ] City Page SEO Enhancement (300-500 word descriptions)
- [ ] City + Service Combination Pages (e.g., `/dallas-ac-repair/`)
- [ ] Feature Enhancements (clean URLs, seasonal strategy, etc.)
- [ ] Code Cleanup (remove mockData.js, unused deps)
- [ ] Cancel Wix Subscription (after confirming stability)

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
| RealWork | **Pending** | Recent Projects widget (awaiting embed code) |
| Resend | Pending | Lead form emails |
| GA4/GTM | Future | Analytics |
| Facebook Pixel | Future | Marketing |

---

## Key Files Reference
- `/app/frontend/app/recent-projects/page.jsx` - Recent Projects page with widget placeholder
- `/app/frontend/components/StickyMobileCTA.jsx` - Site-wide sticky mobile CTA bar
- `/app/frontend/components/ServiceFirstCTA.jsx` - Reusable phone-first CTA component
- `/app/frontend/app/layout.js` - Root layout (includes StickyMobileCTA)
- `/app/frontend/components/Header.jsx` - Navigation with phone-first CTAs
- `/app/frontend/components/Footer.jsx` - Footer with Recent Projects link

---

*Last Updated: February 20, 2025*
