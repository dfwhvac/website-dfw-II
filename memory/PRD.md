# DFW HVAC Website - Product Requirements Document

---
## ⚡ NEXT ACTION (Resume Point - Feb 25, 2025)

**Completed:** FAQ page "What areas do you serve?" ✅ Already updated with link to `/cities-served`

**Next Priority Tasks:**
1. **301 Redirects** - Obtain list of old Wix URLs from owner, configure in `next.config.js`
2. **Go Live - DNS Cutover** - Change nameservers from Wix to Vercel in GoDaddy
3. **Google Search Console Setup** - Verify domain, submit sitemap

---

## Deployment Info

**Vercel Deploy Hook:** `https://api.vercel.com/v1/integrations/deploy/prj_yTjUnxmwjCsoARCD3EYvzPeK3ubf/RuXmoGHl40`
- Trigger manually: `curl -X POST "<hook-url>"`
- Auto-deploys should trigger on GitHub push to connected branch

---

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

### Header Button Hover Fix (Feb 2025)
- Fixed "Request Service" button in header becoming unreadable on hover (white text on white background)
- Added new `outlineBlue` variant to `/app/frontend/components/ui/button.jsx`
- Button now shows cyan border/text on default, cyan background/white text on hover
- Matches the styling of hero section button for visual consistency

### Canonical URL Fix (Feb 23, 2025)
- Fixed critical SEO bug: all pages were showing the root URL (`/`) as canonical
- Implemented page-specific `generateMetadata()` functions with correct `alternates.canonical` paths
- Updated all static pages: homepage, contact, about, faq, services, reviews, cities-served, estimate, recent-projects, privacy-policy, terms-of-service
- Updated all dynamic pages: `/cities-served/[slug]`, `/services/[category]/[slug]`, `/[slug]`
- Root layout now properly exports `metadataBase` from `defaultMetadata` for URL resolution
- Verified all pages return correct canonical URLs (e.g., `https://dfwhvac.com/contact`, `https://dfwhvac.com/services/residential/air-conditioning`)

### Request Service Page & CTA Consolidation (Feb 23, 2025)
- Created dedicated `/request-service` page as conversion landing page
- Page includes: Lead form, phone call CTA, trust signals, business hours
- Lightweight, focused page optimized for fast load and high conversion
- Updated all "Request Service" and "Book Now" buttons site-wide to point to `/request-service`
  - Header CTA button
  - Hero section button (homepage)
  - Service pricing buttons (Diagnostic, Repair → Request Service; Replacement → Get Free Estimate)
  - CTA sections in company page templates
- Added "Request Service" to footer Quick Links
- Added `/request-service` to sitemap.xml with 0.9 priority
- Hybrid accessibility: Not in main nav (CTA serves that purpose), but accessible via footer, sitemap, direct URL

### Header Navigation Cleanup (Feb 23-24, 2025)
- Changed logo tagline from "Three Generations of Trusted Service" to "Trust. Excellence. Care."
- Made header tagline "Three Generations of Trusted HVAC Service in DFW" link to About page
- Moved "Cities Served" from main nav to footer Quick Links (reduces nav crowding)
- Removed "Contact" from main nav (redundant with footer, funnels users to Call/Request Service CTAs)

### Estimate Page Rebrand (Feb 24, 2025)
- Updated `/estimate` page branding to match site colors (navy #003153, cyan #00B8FF, red #FF0000)
- Replaced old blue-600 styling with consistent brand colors
- Updated Service Areas section with condensed list of 12 major cities + "View all cities we serve →" link to `/cities-served`
- Removed FAQ section from estimate page (per user request)

### Site-Wide CTA Audit (Feb 24, 2025)
- Audited all "Request Service" buttons across entire site
- Fixed 8 locations that were incorrectly linking to `/contact` instead of `/request-service`
- Updated: Header defaults, HomePage, ServiceTemplate (2 locations), ServiceFirstCTA, AboutPageTemplate, cities-served/[slug], recent-projects
- Changed services page CTA from "Get Free Estimate" to "Request Service"

### Phone-First Conversion Strategy (Feb 2025)
- **Removed Housecall Pro integration entirely** (operational constraints)
- Implemented phone-first CTA pattern site-wide
- Created reusable `ServiceFirstCTA` client component
- All primary CTAs now prompt users to call

### Recent Projects Page (Feb 2025)
- Created `/recent-projects` page with conversion-optimized structure
- Hero section with phone-first CTAs
- Trust stats bar (500+ Projects, 50+ Cities, Family Owned, 3 Generations)
- **RealWork widget integrated** — Interactive map showing 500+ jobs across DFW
- SEO internal links to city pages
- Full conversion CTA section at bottom
- ~~Added "Recent Projects" link to header navigation and footer~~ (removed Feb 2025)

### RealWork Widget Decommissioning (Feb 2025)
**Status:** TEMPORARILY REDIRECTED - Widget removed, URL preserved for future use

**What was done:**
- `/recent-projects` now 302 redirects to `/reviews` (via `next.config.js`)
- Removed from sitemap.js
- Removed from Header navigation
- Removed from Footer Quick Links
- Page file (`/app/frontend/app/recent-projects/page.jsx`) preserved for reference

**⚠️ UNDO CHECKLIST - When Showcase Projects Page is Built:**
1. [ ] Build the static Showcase Projects page at `/app/frontend/app/recent-projects/page.jsx`
2. [ ] Remove redirect from `next.config.js` (delete the `redirects()` function)
3. [ ] Re-add to sitemap.js: `{ url: '/recent-projects', priority: 0.7, changeFrequency: 'weekly' }`
4. [ ] Re-add to Header.jsx defaultNavigation: `{ label: 'Recent Projects', href: '/recent-projects', isDropdown: false, isVisible: true }`
5. [ ] Re-add to Footer.jsx Quick Links: `{ label: 'Recent Projects', href: '/recent-projects' }`
6. [ ] Delete the old RealWorkWidget.jsx component (no longer needed)

**Showcase Page Content Plan:**
- Before/after photos of completed HVAC jobs
- Brief descriptions: job type, city, date
- Customer testimonials per project (if available)
- Format: Grid layout with lightbox for images
- Source: Owner to provide 6-12 high-quality project photos with details

### Sticky Mobile CTA Bar (Feb 2025)
- Created `StickyMobileCTA` component (site-wide)
- Appears on mobile after scrolling 100px
- Click-to-call with "(972) 777-COOL" display
- Dismissible (persists in session storage)
- Added to root layout for site-wide display

### Lead Capture System (Feb 2025)
- Implemented `/api/leads` endpoint with database storage
- Three-funnel email routing:
  - Service leads → `service@dfwhvac.com` (Subject: "🔧 Service Lead: {Name} - {Phone}")
  - Estimate leads → `estimate@dfwhvac.com` (Subject: "💰 Estimate Lead: {Name} - {Phone}")
  - Contact leads → `contact@dfwhvac.com` (Subject: "📬 Contact Form: {Name} - {Email}")
- Updated `LeadForm.jsx` and `SimpleContactForm.jsx` to use real API
- Resend integration configured (awaiting domain verification)

### Date Reference Cleanup (Feb 2025)
- Removed all "1974" references (incorrect)
- Preserved all "1972" references (correct legacy start year)
- Updated meta descriptions, FAQ answers, schema defaults

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
- [x] **Lead Capture Form Backend** - ✅ Implemented with MongoDB storage. Email notifications configured via Resend (pending domain verification).
- [ ] **Resend Domain Verification** - Verify `dfwhvac.com` in Resend to enable email notifications. **⚠️ BLOCKED:** Wix DNS doesn't support required records. Will be unblocked when DNS moves to Vercel at go-live. **This is the launch plan for lead notifications.**
- [ ] **301 Redirects** - Identify and configure redirects for old URLs before launch

### P1 - Important (Pre-Launch)
- [ ] **Google Search Console Setup & Verification** - Verify domain via GoDaddy DNS TXT record; check indexing status
- [x] **RealWork Widget SEO Evaluation** - ✅ CONFIRMED: Widget has **ZERO SEO value** (Google does not index the content). Value is purely visual trust for on-page visitors.
- [ ] **RealWork Subscription Cost Evaluation** - User to evaluate whether the subscription cost is justified by its trust/conversion value alone (not SEO)
- [x] **SEO Implementation** - ✅ sitemap.xml, robots.txt created; canonical URLs fixed across all pages (Feb 23, 2025)
- [ ] **Create OG Image** - Replace the placeholder logo with a proper Open Graph image. See instructions below.
- [ ] **YouTube Video Embed** - Indoor Air Quality page
- [ ] **Content Creation** - Case studies, financing pages
- [ ] **Internal Linking** - Cross-link services ↔ cities
- [ ] **Performance Optimization** - Lighthouse audit
- [ ] **Pre-Launch Verification** - Mobile/browser testing, forms, broken links
- [ ] **DNS Transition Planning** - Decide between Vercel nameservers vs. GoDaddy DNS approach

#### OG Image Instructions
The Open Graph (OG) image is displayed when your site is shared on social media (Facebook, LinkedIn, Twitter/X, iMessage, etc.).

**Current state:** Using company logo as placeholder at `/app/frontend/public/images/dfwhvac-og.jpg`

**To create a proper OG image:**
1. **Size:** 1200 x 630 pixels (required aspect ratio for social media)
2. **Content suggestions:**
   - Company logo prominently displayed
   - Tagline: "Trust. Excellence. Care." or "Three Generations of Trusted Service"
   - Professional HVAC imagery (AC unit, service truck, or happy homeowner)
   - Dallas-Fort Worth reference (subtle skyline or "Serving DFW" text)
   - Brand colors: Navy (#003153), Cyan (#00B8FF), Red (#FF0000)
3. **Format:** JPG or PNG
4. **File location:** Save as `/app/frontend/public/images/dfwhvac-og.jpg`
5. **Keep text minimal** - social platforms overlay their own title/description

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
- [ ] **Housecall Pro Direct Integration** - See details below
- [ ] **"50+ Cities" Claim Cleanup** - See details below
- [ ] **AI Readiness / AEO (Answer Engine Optimization)** - See details below
- [ ] **Content Hub / Resources Section** - `/resources` for authoritative articles

#### Housecall Pro API Integration (Post-Launch)
**Goal:** Automatically create customers/jobs in Housecall Pro when leads submit the Request Service form.

**Current launch plan:** Email notifications via Resend (manual entry into HCP)

**Future integration approach:** Direct API integration (no Zapier fees, instant, reliable)

**Questions to answer before implementation:**
1. Does HCP API support customer lookup by email/phone? (for deduplication)
2. Does it auto-deduplicate or do we need to handle that logic?
3. What fields are required to create a customer vs. a job?
4. What HCP subscription tier is needed for API access?
5. How to obtain API credentials?

**Proposed flow:**
```
Form submission
      ↓
Check if customer exists (by email OR phone)
      ↓
  ┌───┴───┐
  YES     NO
  ↓       ↓
Add job   Create new customer + job
      ↓
MongoDB backup (audit trail)
      ↓
Success response to user
```

**Benefits over Zapier:**
- No monthly fee ($240-600/yr saved)
- Instant (vs 1-15 min delay)
- More reliable (no middleman)
- Complete data mapping control

#### "50+ Cities" Claim Cleanup (Post-Launch)
**Issue:** The site references "50+ cities" in several places, but Sanity only has 28 cities configured.

**Files to update:**
1. `/app/frontend/app/recent-projects/page.jsx` - Meta description and page content
2. `/app/frontend/scripts/seed-brand-content.js` - Seed data references
3. `/app/frontend/components/HomePage.jsx` - Stats section
4. `/app/frontend/components/CompanyPageTemplate.jsx` - Stats section
5. `/app/frontend/components/AboutPageTemplate.jsx` - Stats references

**Resolution options:**
1. **Update copy to accurate language:** "We serve the Dallas-Fort Worth metroplex" (no specific number)
2. **Add more cities to Sanity:** Expand coverage to actually serve 50+ cities

**Recommendation:** Use option 1 (accurate language) unless business expansion warrants adding more city pages.

#### AI Readiness / AEO (Answer Engine Optimization)
**Goal:** Ensure DFW HVAC gets recommended when consumers ask AI assistants (ChatGPT, Claude, Gemini, Perplexity) for HVAC recommendations in the DFW area.

**Current Competitive Advantages:**
- 5.0★ Google rating with 136+ reviews
- "Three-generation family HVAC business since 1972"
- Headquartered in Coppell, serving DFW metroplex
- Trust pillars: "Trust. Excellence. Care."

**Tier 1 - Immediate (Pre/Post-Launch):**
- [ ] **Google Business Profile optimization** - Complete every field, add posts regularly, respond to all reviews
- [ ] **NAP consistency audit** - Ensure Name, Address, Phone match exactly across all sites
- [ ] **Citation listings** - Get listed on Yelp, BBB, Angi, HomeAdvisor, Thumbtack
- [ ] **Respond to every review** - Shows active engagement, AI sees this

**Tier 2 - Content Authority:**
- [ ] **Publish authoritative content** - Create `/resources` section with comprehensive HVAC guides
- [ ] **"Best answer" content** - Articles that definitively answer common HVAC questions
- [ ] **Local PR/mentions** - Chamber of commerce features, local business spotlights
- [ ] **YouTube presence** - "Meet the team", "How we work", educational videos

**Tier 3 - Technical:**
- [ ] **Structured data everywhere** - FAQ schema, LocalBusiness schema, Service schema (partially done)
- [ ] **Perplexity/Bing indexing** - Ensure site is crawlable by real-time AI search engines
- [ ] **Be the cited source** - Create content other sites want to link to

**Key Messaging for AI (use consistently everywhere):**
> "DFW HVAC is a three-generation family HVAC business headquartered in Coppell, Texas, serving the Dallas-Fort Worth metroplex since 1972. With a 5.0★ Google rating and 136+ reviews, we provide trusted heating and cooling services built on our pillars of Trust, Excellence, and Care."

#### Content Hub / Resources Section (Post-Launch)
**Goal:** Create authoritative content that ranks for informational queries and builds topical authority.

**Proposed structure:**
```
/resources
├── /understanding-hvac-system-components
├── /how-often-change-air-filter
├── /hvac-maintenance-checklist
├── /when-to-replace-ac-unit
├── /seer-rating-explained
└── (more articles over time)
```

**Benefits:**
- Ranks for long-tail keywords
- Builds topical authority
- Provides content for AI to cite
- Creates internal linking opportunities to service pages
- Positions DFW HVAC as the local HVAC expert

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
| RealWork | **Active** | Recent Projects widget (embedded, account ID: mTNPdsX-K4WXweP6) |
| Resend | **Configured** | Lead form emails (awaiting domain verification) |
| GA4/GTM | Future | Analytics |
| Facebook Pixel | Future | Marketing |

---

## Key Files Reference
- `/app/frontend/app/request-service/page.jsx` - Dedicated Request Service conversion page
- `/app/frontend/app/recent-projects/page.jsx` - Recent Projects page with RealWork widget
- `/app/frontend/components/RealWorkWidget.jsx` - RealWork widget component
- `/app/frontend/components/StickyMobileCTA.jsx` - Site-wide sticky mobile CTA bar
- `/app/frontend/components/ServiceFirstCTA.jsx` - Reusable phone-first CTA component
- `/app/frontend/components/LeadForm.jsx` - Lead capture form (supports leadType prop)
- `/app/frontend/components/SimpleContactForm.jsx` - Contact page form
- `/app/frontend/app/layout.js` - Root layout (includes StickyMobileCTA, metadataBase)
- `/app/frontend/lib/metadata.js` - SEO metadata utilities (buildPageMetadata, defaultMetadata)
- `/app/frontend/components/Header.jsx` - Navigation with phone-first CTAs
- `/app/frontend/components/ui/button.jsx` - Button component with custom outlineBlue variant
- `/app/backend/server.py` - API server with /api/leads endpoint
- `/app/frontend/components/Footer.jsx` - Footer with Quick Links (Cities Served, Request Service)
- `/app/frontend/app/sitemap.js` - Dynamic sitemap generation
- `/app/frontend/app/robots.js` - robots.txt generation

---

*Last Updated: February 23, 2025*
