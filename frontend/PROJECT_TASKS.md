# DFW HVAC Website - Consolidated Task List

**Last Updated:** February 2025  
**Status:** Development Phase  
**Caching Mode:** Development (No Cache)

---

## 🔴 P0 - Critical / Pre-Launch Blockers

### Lead Capture Form Backend
- [ ] Implement email notifications using Resend when lead form is submitted
- [ ] Configure Resend API integration
- [ ] Set up email templates for lead notifications
- [ ] Test form submission flow end-to-end
- [ ] Verify emails are delivered to correct recipient

### Legal Pages (Required for Compliance)
- [ ] Create `/privacy-policy` content in Sanity
- [ ] Create `/terms-of-service` content in Sanity

### 301 Redirects (Must be configured before launch)
| Old URL | New URL | Status |
|---------|---------|--------|
| `/scheduleservicecall` | `/contact` | [ ] |
| `/installation` | `/services/residential/air-conditioning` | [ ] |
| `/iaq` | `/services/residential/indoor-air-quality` | [ ] |
| `/ducting` | `/services/residential/air-conditioning` | [ ] |
| `/seasonalmaintenance` | `/services/residential/preventative-maintenance` | [ ] |
| `/testresults` | `/services/residential/indoor-air-quality` | [ ] |

- [ ] Create redirects in `next.config.js` OR Vercel dashboard
- [ ] Test all redirects before launch

### Custom Domain Setup
- [ ] Configure DNS records (A record, CNAME)
- [ ] Verify SSL certificate is active
- [ ] Test www vs non-www redirect

---

## 🟡 P1 - Important / Pre-Launch

### Content Creation (In Sanity Studio)
- [ ] Create `/case-studies` page content
- [ ] Create `/financing` page content
- [ ] Finalize all service page content

### SEO Implementation (Structural)
- [ ] Generate dynamic `sitemap.xml` from Sanity content
- [ ] Create `robots.txt`
- [ ] Add canonical URL tags to all pages
- [ ] Add Service schema markup to service pages
- [ ] Add BreadcrumbList schema to service pages
- [ ] Expand structured data (Review schema on more pages)

### YouTube Video Embed
- [ ] Add YouTube video to Indoor Air Quality page
- [ ] Use Lite YouTube Embed method for performance
- [ ] Video URL: https://www.youtube.com/watch?v=1ChdZMrkLeM

### Conversion Optimization
- [ ] Add sticky mobile CTA bar with click-to-call
- [ ] Ensure trust badges visible above fold on all pages
- [ ] Add scroll-triggered secondary CTA on long pages

### Internal Linking
- [ ] Cross-link service pages to relevant city pages
- [ ] Cross-link city pages to relevant service pages
- [ ] Add "Nearby Cities" sections on city pages

### Performance Optimization
- [ ] Run Lighthouse audit - Target: Performance >90, SEO >95, Accessibility >90
- [ ] Fix any critical issues flagged
- [ ] Image optimization - verify all use Next.js `<Image>`
- [ ] Font optimization - use `next/font`

### Pre-Launch Verification
- [ ] Mobile test on real devices (iPhone, Android)
- [ ] Cross-browser test (Chrome, Safari, Firefox, Edge)
- [ ] Verify all forms submit correctly
- [ ] Check for broken links
- [ ] Verify phone number click-to-call works on mobile
- [ ] Confirm custom 404 page exists

---

## 🔵 P2 - Post-Launch / Future

### Switch to Production Caching Mode
- [ ] Create `/api/revalidate` webhook endpoint
- [ ] Configure Sanity webhook for on-publish revalidation
- [ ] Re-enable CDN caching (`useCdn: true`)
- [ ] Set proper `revalidate` values on pages
- [ ] Test webhook revalidation flow

### Marketing & Analytics Integration
- [ ] Google Analytics 4 (GA4) integration
- [ ] Google Tag Manager (GTM) setup
- [ ] Facebook Pixel integration
- [ ] Set up conversion goals for form submissions

### Google Business Profile (Launch Day)
- [ ] Claim & verify listing at business.google.com
- [ ] Complete all business info (name, address, phone, hours, website)
- [ ] Add all HVAC services offered
- [ ] Add all 28 service area cities
- [ ] Upload photos (trucks, team, completed jobs, office)
- [ ] Create first post (website launch or seasonal promotion)

### Local Citations (First 30 Days)
- [ ] Yelp - Claim/create listing
- [ ] BBB (Better Business Bureau) - Register business
- [ ] Angi (formerly Angie's List) - Create profile
- [ ] HomeAdvisor - Create profile
- [ ] Thumbtack - Create profile
- [ ] Facebook Business Page - Create/claim
- [ ] Nextdoor Business - Claim listing
- [ ] Apple Maps - Submit via Apple Business Connect
- [ ] Bing Places - Claim listing
- [ ] Yellow Pages / YP.com - Create listing

### Reviews Strategy
- [ ] Request reviews from 5 happy customers
- [ ] Set up review response process (respond within 48 hours)
- [ ] Create review request email/text template

### Post-Migration Monitoring (First 2 Weeks)
- [ ] Check Google Search Console daily for crawl errors
- [ ] Monitor for 404 errors
- [ ] Watch for ranking drops on key terms
- [ ] Verify old indexed URLs redirect properly

### City Page SEO Enhancement
- [ ] Rewrite city descriptions to 300-500 words with HVAC keywords + local context
- [ ] Options: bottom of page, distributed throughout, or collapsible section
- [ ] Priority cities first: Coppell, Dallas, Grapevine, Lewisville, Carrollton, etc.

### City + Service Combination Pages (Local SEO)
- [ ] Create pages like `/dallas-ac-repair/`, `/plano-heating-service/`
- [ ] Target high-converting local search terms

### Feature Enhancements
- [ ] Clean URLs - Remove `/services/` prefix from service page routes
- [ ] Service visibility toggle - Add publish/unpublish feature in Sanity
- [ ] Seasonal homepage strategy - Summer AC focus / Winter heating focus
- [ ] Service area map on Cities Served hub page
- [ ] Add Google Business Profile link in footer

### Code Cleanup
- [ ] Remove `/app/frontend/lib/mockData.js` (data migrated to Sanity)
- [ ] Audit components for remaining hardcoded content
- [ ] Remove unused dependencies from `package.json`
- [ ] Archive analysis scripts (`/app/*.py`)
- [ ] Convert dynamic brand colors to static Tailwind CSS

### Phone System Audio (Awaiting User Input)
- [ ] Get final scripts from stakeholder
- [ ] Select voice (samples at `/public/voice-previews/`)
- [ ] Generate production MP3 files

---

## 🟢 Ongoing Monthly Maintenance

- [ ] Add 1-2 Google Business posts per month
- [ ] Respond to all new reviews within 48 hours
- [ ] Check Search Console for new issues
- [ ] Update seasonal content (AC in summer, heating in winter)
- [ ] Review analytics for top-performing pages

---

## ✅ Completed

### Phase 1: CMS Architecture (Feb 2025)
- [x] Created `aboutPage` schema with brand pillars, timeline, statistics
- [x] Created `contactPage` schema
- [x] Created `trustSignals` schema
- [x] Extended `siteSettings` with logo tagline, legacy statement, mission
- [x] Extended `companyInfo` with legacy start year
- [x] Updated all schema defaults to new brand messaging

### Phase 2: Brand Content Migration (Feb 2025)
- [x] Seeded Sanity with brand framework content
- [x] Updated all service pages with brand messaging
- [x] Updated Header/Footer with new taglines
- [x] Updated HomePage fallback content
- [x] Updated CompanyPageTemplate (story, values)
- [x] Created AboutPageTemplate with brand pillars
- [x] Added Legacy Timeline to About page
- [x] Fixed Portable Text paragraph spacing

### Google Reviews Auto-Sync (Feb 2025)
- [x] Configured new Google Places API key
- [x] Tested sync endpoint - live data (5.0 rating, 135 reviews)
- [x] Updated Sanity CMS with live data
- [x] Removed hardcoded review counts
- [x] Connected About page stats to dynamic data
- [x] Vercel cron configured for daily sync at 6 AM UTC

### City Pages (Feb 2025)
- [x] Added 31 missing zip codes to website
- [x] Created 4 new city pages (Lewisville, Arlington, Haslet, Mansfield)
- [x] Updated priorities based on drive-time zones
- [x] Connected trust badges to CMS
- [x] Removed zip code count display

### UI Fixes (Feb 2025)
- [x] Fixed logo white edges in footer (clip path)
- [x] Created Services hub page (`/services`)
- [x] Removed "Write a Google Review" button from reviews page
- [x] Added Handshake icon option to homepage trust items
- [x] Added Trending Up icon to trust badges

### Previous Completions
- [x] Service Area Analysis (4-zone model)
- [x] Sanity CMS Migration (all content)
- [x] Google Reviews Import (130 reviews)
- [x] Dynamic Page System
- [x] SEO Schema Markup (LocalBusiness, Review, FAQ)
- [x] TTS Voice Previews (9 samples)
- [x] Brand Strategy & Competitor Analysis

---

## 📝 Notes

### Current Caching Configuration (Development Mode)
```javascript
// /app/frontend/lib/sanity.js
useCdn: false  // Fresh content on every request

// Page files
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

### Google Places API
- Key configured in `.env.local`
- Auto-sync runs daily at 6 AM UTC via Vercel cron
- Endpoint: `/api/cron/sync-reviews`

### Preview URLs
- **Site:** https://hvac-evolution.preview.emergentagent.com
- **CMS:** https://hvac-evolution.preview.emergentagent.com/studio
- **Vercel:** https://website-dfw-ii-b4zk.vercel.app

---

*This is the single source of truth for all project tasks.*
