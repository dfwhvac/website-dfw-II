# DFW HVAC Website - Project Tasks

## Current Status
**Phase:** Development  
**Caching Mode:** Development (No Cache) - optimized for content iteration speed

---

## 🔴 Priority Tasks (P0)

### Lead Capture Form Backend
- [ ] Implement email notifications using Resend when lead form is submitted
- [ ] Configure Resend API integration
- [ ] Set up email templates for lead notifications
- [ ] Test form submission flow end-to-end

---

## 🟡 Upcoming Tasks (P1)

### Content Creation (In Sanity Studio)
- [ ] Create `/case-studies` page content
- [ ] Create `/financing` page content
- [ ] Create `/cities-served` page content
- [ ] Create `/privacy-policy` page content
- [ ] Create `/terms-of-service` page content

### SEO Enhancements
- [ ] Generate dynamic `sitemap.xml` from Sanity content
- [ ] Add structured data for service pages
- [ ] Optimize meta descriptions for all pages

---

## 🔵 Future Tasks (P2)

### Marketing & Analytics Integration
- [ ] Facebook Pixel integration
- [ ] Google Analytics 4 (GA4) integration
- [ ] Google Tag Manager (GTM) setup

### Performance & Launch Preparation
- [ ] **Switch to Production Caching Mode**
  - Create `/api/revalidate` webhook endpoint
  - Configure Sanity webhook for on-publish revalidation
  - Re-enable CDN caching (`useCdn: true`)
  - Set proper `revalidate` values on pages
  - Test webhook revalidation flow
  - *Estimated time: 15-20 minutes*
- [ ] Convert dynamic brand colors to static Tailwind CSS (performance optimization)
- [ ] Custom domain setup and configuration
- [ ] SSL certificate verification
- [ ] Performance audit (Core Web Vitals)

### Feature Enhancements
- [ ] Clean URLs - Remove `/services/` prefix from service page routes
- [ ] Service visibility toggle - Add publish/unpublish feature for individual services in Sanity
- [ ] Seasonal homepage strategy - Implement logic to show season-specific content (summer AC focus, winter heating focus)

### Code Cleanup
- [ ] Remove `/app/frontend/lib/mockData.js` (all data migrated to Sanity)
- [ ] Audit components for any remaining hardcoded content
- [ ] Remove unused dependencies from `package.json`

---

## ✅ Completed Tasks

### Sanity CMS Migration
- [x] Migrate all website content to Sanity Studio
- [x] Homepage content fully editable in Sanity
- [x] Service pages content in Sanity
- [x] Company pages (About, Contact) in Sanity
- [x] Navigation and footer editable in Sanity
- [x] Lead form text editable in Sanity
- [x] Brand colors configurable in Sanity

### Google Reviews Import
- [x] Import 130 customer reviews from CSV
- [x] Fix data alignment issues
- [x] Filter blank reviews from display

### Dynamic Page System
- [x] Create `/[slug]/page.jsx` for Sanity-driven pages
- [x] Allow new pages to be created entirely from Sanity

### SEO Implementation
- [x] Dynamic LocalBusiness schema markup
- [x] Dynamic Review schema markup
- [x] Dynamic FAQ schema markup
- [x] Page-specific meta tags from Sanity

### Sanity Studio Enhancements
- [x] Add "Unpublished Drafts" view to Studio sidebar
- [x] Clean up duplicate content entries

### Service Area Analysis
- [x] Generate high-accuracy drive-time analysis using OpenRouteService API
- [x] Create service area map with zip code boundaries
- [x] Export CSV with zone percentages per zip code

### Brand Strategy
- [x] Competitor analysis (12 DFW HVAC companies)
- [x] Three-pillar brand framework development
- [x] Brand messaging and positioning documentation

---

## 🔴 PRE-LAUNCH CHECKLIST (Do Not Skip Before Going Live)

> **Important:** Complete ALL items before removing development mode and launching to production.

---

### MIGRATION: Existing Site (www.dfwhvac.com)
*Critical steps to preserve SEO equity from current Wix site*

#### 301 Redirects (Must be configured before launch)
| Old URL | New URL | Status |
|---------|---------|--------|
| `/scheduleservicecall` | `/contact` | [ ] |
| `/installation` | `/services/residential/air-conditioning` | [ ] |
| `/iaq` | `/services/residential/indoor-air-quality` | [ ] |
| `/ducting` | `/services/residential/air-conditioning` | [ ] |
| `/seasonalmaintenance` | `/services/residential/preventative-maintenance` | [ ] |
| `/testresults` | `/services/residential/indoor-air-quality` | [ ] |

#### Redirect Implementation
- [ ] Create `/app/frontend/next.config.js` redirects array OR
- [ ] Configure redirects in Vercel dashboard (Settings → Redirects)
- [ ] Test all redirects before launch (visit old URLs, confirm they redirect)

#### Branding Cleanup
- [ ] **Remove "Alpine HVAC" references** - Current site has mixed branding
- [ ] **Confirm primary phone number** - Current site shows `(855)TEX-HVAC` and `972.999.0511`
- [ ] **Update booking links** - Old site uses HouseCall Pro/Jobber, new site uses lead form

#### Google Business Profile
- [ ] **Do NOT modify GBP until new site is live**
- [ ] **After launch:** Update website URL in GBP if changed
- [ ] **After launch:** Verify GBP links to correct pages (services, contact, etc.)
- [ ] **Monitor GBP insights** for 2 weeks post-launch for any traffic changes

#### Post-Migration Monitoring (First 2 Weeks)
- [ ] Check Google Search Console daily for crawl errors
- [ ] Monitor for 404 errors (indicates missed redirects)
- [ ] Watch for ranking drops on key terms
- [ ] Verify all old indexed URLs redirect properly (search `site:dfwhvac.com` in Google)

---

### PHASE 1: While Building (Do Now)
*Focus on things that are hard to change later*

- [ ] **Finalize URL Structure** - Changing URLs after Google indexes them hurts SEO
  - Lock in `/cities-served/[city]` structure ✅ Done
  - Lock in `/services/[category]/[service]` structure ✅ Done
- [ ] **Complete Legal Pages** (Required for compliance - Google may flag sites without them)
  - Create `/privacy-policy` content in Sanity
  - Create `/terms-of-service` content in Sanity
- [ ] **Ensure Mobile Responsiveness** - 60%+ of local searches are mobile
  - Test on actual mobile devices, not just DevTools
- [ ] **Verify Schema Markup** - Test at validator.schema.org
  - LocalBusiness schema ✅ Implemented
  - Review schema ✅ Implemented
  - FAQ schema ✅ Implemented

---

### PHASE 2: Pre-Launch (Content Finalized)

#### Required Blockers
- [ ] **Lead Capture Form Backend (Resend)**
  - Configure Resend API integration
  - Set up email templates for lead notifications
  - Test form submission flow end-to-end
  - Verify emails are delivered to correct recipient
- [ ] **Custom Domain Setup**
  - Configure DNS records (A record, CNAME)
  - Verify SSL certificate is active
  - Test www vs non-www redirect
  - Update all hardcoded URLs if any

#### Content Completion
- [ ] **Finalize All Service Pages** - Review and complete all service page content
- [ ] **Create Remaining Pages in Sanity**
  - `/case-studies` (if launching with this)
  - `/financing` (if launching with this)
- [ ] **Phone System Audio Files** (if needed for launch)
  - Get final scripts from stakeholder
  - Select voice (samples at `/public/voice-previews/`)
  - Generate production MP3 files

#### Performance Optimization
- [ ] **Run Lighthouse Audit** - Establish baseline
  - Target: Performance >90, SEO >95, Accessibility >90
- [ ] **Fix Critical Issues Flagged** - Address any red flags from Lighthouse
- [ ] **Switch to Production Caching Mode**
  - Re-enable `useCdn: true` in `/app/frontend/lib/sanity.js`
  - Change `export const dynamic = 'force-dynamic'` to `export const revalidate = 3600` on pages:
    - `/app/frontend/app/page.js`
    - `/app/frontend/app/services/[category]/[slug]/page.jsx`
    - `/app/frontend/app/[slug]/page.jsx`
    - `/app/frontend/app/faq/page.jsx`
    - `/app/frontend/app/reviews/page.jsx`
    - `/app/frontend/app/about/page.jsx`
    - `/app/frontend/app/contact/page.jsx`
    - `/app/frontend/app/cities-served/page.jsx`
    - `/app/frontend/app/cities-served/[slug]/page.jsx`
  - Create `/app/frontend/app/api/revalidate/route.js` webhook endpoint
  - Configure Sanity webhook: Settings → API → Webhooks → POST to `https://yourdomain.com/api/revalidate`
  - Test: publish in Sanity → verify instant update
- [ ] **Image Optimization**
  - Verify all images use Next.js `<Image>` with width/height
  - Confirm Sanity images use CDN with auto format/quality
  - Add `loading="lazy"` for below-fold images
- [ ] **Font Optimization** - Use `next/font` for self-hosted fonts
- [ ] **Bundle Analysis** - Run `yarn analyze`, reduce oversized dependencies
- [ ] **Convert Brand Colors to Static Tailwind** - Remove runtime CSS variable overhead

#### SEO Setup
- [ ] **Create XML Sitemap** - `/app/frontend/app/sitemap.js`
- [ ] **Create robots.txt** - `/app/frontend/public/robots.txt`
- [ ] **Canonical URLs** - Add to all pages
- [ ] **Open Graph Images** - Set in Sanity siteSettings
- [ ] **Service Schema Markup** - Add to each service page
- [ ] **Internal Linking** - Cross-link related services

#### Code Cleanup
- [ ] **Remove mockData.js** - `/app/frontend/lib/mockData.js` (all data in Sanity now)
- [ ] **Audit for Hardcoded Content** - Search for any remaining hardcoded text
- [ ] **Remove Unused Dependencies** - Audit `package.json`
- [ ] **Clean Up Analysis Scripts** - Move or archive `/app/*.py` scripts

#### Pre-Launch Verification
- [ ] **Core Web Vitals** - LCP <2.5s, FID <100ms, CLS <0.1
- [ ] **Mobile Test** - Test on real devices (iPhone, Android)
- [ ] **Cross-Browser Test** - Chrome, Safari, Firefox, Edge
- [ ] **Form Testing** - Verify lead submissions + email delivery
- [ ] **404 Page** - Confirm custom 404 exists and looks professional
- [ ] **All Links Working** - Check for broken internal/external links
- [ ] **Phone Number Click-to-Call** - Verify `tel:` links work on mobile

---

### PHASE 3: Launch Day
*The single most important action for a local HVAC company*

#### Google Business Profile (Critical - 80% of leads come from Google Maps / "near me" searches)
- [ ] **Claim & Verify Listing** - business.google.com
- [ ] **Complete All Business Info** - Name, address, phone, hours, website
- [ ] **Add All Services** - List every HVAC service offered
- [ ] **Add Service Areas** - All 24 target cities
- [ ] **Upload Photos** - Trucks, team, completed jobs, office
- [ ] **Link to Website** - Ensure URL is correct
- [ ] **Create First Post** - Announce website launch or seasonal promotion

---

### PHASE 4: Post-Launch (First 30 Days)

#### Week 1
- [ ] **Submit Sitemap to Google Search Console** (15 min)
  - Verify domain ownership
  - Submit sitemap.xml
  - Check for any crawl errors
- [ ] **Set Up Google Analytics 4** (30 min)
  - Verify tracking is firing on all pages
  - Set up conversion goals for form submissions
- [ ] **Facebook Pixel** - Verify firing (if applicable)
- [ ] **Monitor for Errors** - Check browser console, server logs first 24-48 hours

#### Week 2-4: Build Local Citations (2 hours total)
- [ ] **Yelp** - Claim/create listing
- [ ] **BBB (Better Business Bureau)** - Register business
- [ ] **Angi (formerly Angie's List)** - Create profile
- [ ] **HomeAdvisor** - Create profile
- [ ] **Thumbtack** - Create profile
- [ ] **Facebook Business Page** - Create/claim
- [ ] **Nextdoor Business** - Claim listing
- [ ] **Apple Maps** - Submit via Apple Business Connect
- [ ] **Bing Places** - Claim listing
- [ ] **Yellow Pages / YP.com** - Create listing

#### Reviews Strategy (Ongoing)
- [ ] **Request Reviews from 5 Happy Customers** - Direct link to Google review
- [ ] **Set Up Review Response Process** - Respond to all reviews within 48 hours
- [ ] **Create Review Request Email/Text Template** - For ongoing use

#### Week 3-4
- [ ] **Check Search Console for Crawl Errors** (15 min)
- [ ] **Review Which Pages Get Traffic** - Optimize those first (30 min)

---

### PHASE 5: Ongoing Monthly Maintenance (1-2 Hours/Month)

- [ ] Add 1-2 Google Business posts per month (signals activity to Google)
- [ ] Respond to all new reviews (improves local ranking)
- [ ] Check Search Console for new issues (catch problems early)
- [ ] Update seasonal content (AC focus in summer, heating in winter)
- [ ] Review analytics for top-performing pages

---

### What NOT to Spend Money On (Yet)

| Skip This | Why |
|-----------|-----|
| Paid SEO tools (Ahrefs, SEMrush) | Free tools are sufficient for a single-location business |
| Paid backlink building | Focus on citations and reviews first |
| PPC ads | Get organic foundation solid first |
| SEO agencies | You can do 90% of local SEO yourself |

---

### Minimum Viable SEO (If Nothing Else, Do These 5 Things)

1. ✅ **Google Business Profile** (claimed & optimized)
2. ✅ **Google Search Console** (sitemap submitted)
3. ✅ **10 local citations** (Yelp, BBB, Angi, etc.)
4. ✅ **5+ Google reviews** (ask customers)
5. ✅ **Mobile-friendly site** (test on real phone)

*This covers 80% of local SEO value with 20% of the effort.*

---

### Future Enhancements (Post-Launch)
- [ ] **Clean URLs** - Remove `/services/` prefix from routes
- [ ] **Service Visibility Toggle** - Add publish/unpublish in Sanity
- [ ] **Seasonal Homepage Strategy** - Summer AC focus / Winter heating focus
- [ ] **Auto-generated Cities Served Page** - List 200 zip codes by zone for local SEO

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

### Production Caching Configuration (To Be Implemented)
```javascript
// /app/frontend/lib/sanity.js
useCdn: true  // Use CDN for fast reads

// Page files
export const revalidate = 3600  // Static generation with ISR

// Plus webhook-based on-demand revalidation
// /api/revalidate endpoint
```

---

*Last Updated: January 2025*
