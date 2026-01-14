# DFW HVAC Website - Product Requirements Document

## Original Problem Statement
Build a premium, conversion-focused website for DFW HVAC company using Next.js frontend and Sanity.io for content management. The project expanded to include comprehensive data analysis for strategic planning including service area analysis, demographic analysis, and brand strategy development.

## User Personas
- **Business Owner**: Needs strategic data to optimize service delivery and marketing
- **Potential Customers**: Looking for HVAC services in the DFW area
- **Marketing Team**: Requires data-driven insights for targeting campaigns

## Core Requirements
1. Dynamic website with Sanity CMS for all content
2. Lead capture with email notifications
3. SEO-optimized pages with structured data
4. Service area definition with drive-time analysis
5. Demographic data for targeting decisions

---

## Current Status
**Phase:** Development
**Caching Mode:** Development (No Cache) - optimized for content iteration

---

## Completed Work

### ✅ Service Area Analysis (January 2025)
- **4-Zone Model Successfully Completed**
  - HQ: 556 S. Coppell Rd, Coppell, TX 75019
  - Zone 1 (<11 min): 4 zip codes | 86,923 housing units | Avg income: $106,384
  - Zone 2 (11-20 min): 34 zip codes | 489,498 housing units | Avg income: $97,543
  - Zone 3 (21-30 min): 67 zip codes | 966,255 housing units | Avg income: $90,355
  - Zone 4 (31-45 min): 34 zip codes | 489,950 housing units | Avg income: $102,333
  - Zone 5 (>45 min): Outside service area (no data)
  - **Total:** 139 zip codes | 2M+ housing units | 59.1% single-family homes
  
- **Output Files:**
  - `/app/frontend/public/DFW_HVAC_Service_Area_4Zone.csv` - Full data with demographics
  - `/app/frontend/public/dfw_service_area_map_4zone.png` - Visual map

### ✅ Sanity CMS Migration
- All website content editable in Sanity Studio
- Homepage, service pages, company pages complete
- Navigation and footer configurable
- Brand colors in Sanity (simplified schema)
- Lead form text editable

### ✅ Brand Strategy
- Competitor analysis (12 DFW HVAC companies)
- Three-pillar brand framework
- Brand messaging and positioning documentation

### ✅ Google Reviews Import
- 130 customer reviews imported
- Data alignment issues fixed

### ✅ Dynamic Page System
- `/[slug]/page.jsx` for Sanity-driven pages

### ✅ SEO Implementation
- LocalBusiness schema markup
- Review schema markup
- FAQ schema markup
- Page-specific meta tags

### ✅ TTS Voice Previews
- 9 voice samples generated from OpenAI TTS
- Located at `/app/frontend/public/voice-previews/`

---

## Pending Tasks

### P0 - Critical
- [ ] **Lead Capture Form Backend** - Implement email notifications using Resend

### P1 - Important  
- [ ] **Phone System Audio Files** - Generate MP3s with final scripts (awaiting user input on voice selection and scripts)
- [ ] **Build Remaining Pages** - Content creation in Sanity for:
  - `/case-studies`
  - `/financing`
  - `/privacy-policy`
  - `/terms-of-service`
- [ ] **Dynamic sitemap.xml** - Generate from Sanity content

### P2 - Future
- [ ] **Production Caching Mode** - Webhook-based on-demand revalidation
- [ ] **Marketing/Analytics** - Facebook Pixel, GA4/GTM integration
- [ ] **Auto-generated Cities Served Page** - List all 139 zip codes grouped by zone for local SEO
- [ ] **Clean URLs** - Remove `/services/` prefix from routes
- [ ] **Code Cleanup** - Remove unused files, audit hardcoded content

---

## 🚀 PRE-LAUNCH CHECKLIST (Do Not Skip)

> **Important:** Complete ALL items before removing development mode and launching to production.

### Required Before Launch (Blockers)
- [ ] **Lead Capture Form Backend (Resend)**
  - Configure Resend API integration
  - Set up email templates for lead notifications
  - Test form submission flow end-to-end
  - Verify emails are delivered to correct recipient
- [ ] **Legal Pages Content** (Required for compliance)
  - Create `/privacy-policy` content in Sanity
  - Create `/terms-of-service` content in Sanity
- [ ] **Custom Domain Setup**
  - Configure DNS records (A record, CNAME)
  - Verify SSL certificate is active
  - Test www vs non-www redirect
  - Update all hardcoded URLs if any

### Content Completion
- [ ] **Finalize All Service Pages** - Review and complete all service page content
- [ ] **Create Remaining Pages in Sanity**
  - `/case-studies` (if launching with this)
  - `/financing` (if launching with this)
  - `/cities-served` (can auto-generate from service area data)
- [ ] **Phone System Audio Files** (if needed for launch)
  - Get final scripts from stakeholder
  - Select voice (samples at `/public/voice-previews/`)
  - Generate production MP3 files

### Performance Optimization
- [ ] **Switch to Production Caching Mode**
  - Re-enable `useCdn: true` in `/lib/sanity.js`
  - Change `export const dynamic = 'force-dynamic'` to `export const revalidate = 3600` on all pages
  - Create `/api/revalidate` webhook endpoint for on-demand cache invalidation
  - Configure Sanity webhook (Settings → API → Webhooks) to POST to `/api/revalidate` on publish
  - Test: publish content in Sanity → verify site updates within seconds
- [ ] **Image Optimization**
  - Verify all images use Next.js `<Image>` component with explicit width/height
  - Confirm Sanity images use CDN transformations (auto format, quality)
  - Add `loading="lazy"` for below-fold images
- [ ] **Font Optimization**
  - Convert to `next/font` for self-hosted fonts (eliminates render-blocking)
- [ ] **Bundle Analysis**
  - Run `yarn analyze` and reduce any oversized dependencies
- [ ] **Convert Brand Colors to Static Tailwind** - Remove runtime CSS variable overhead

### SEO Optimization
- [ ] **Generate Dynamic sitemap.xml**
  - Create `/app/sitemap.js` that queries all pages from Sanity
  - Include all service pages, company pages, and blog posts
- [ ] **Add robots.txt**
  - Create `/public/robots.txt` allowing all crawlers
  - Reference sitemap location
- [ ] **Canonical URLs**
  - Add `<link rel="canonical">` to all pages
- [ ] **Open Graph Images**
  - Set default OG image in Sanity siteSettings
  - Ensure all pages have proper og:image meta tags
- [ ] **Service Schema Markup**
  - Add Service structured data to each service page
- [ ] **Internal Linking Audit**
  - Ensure services link to related services
  - Add contextual links within content

### Code Cleanup
- [ ] **Remove mockData.js** - `/app/frontend/lib/mockData.js` (all data in Sanity now)
- [ ] **Audit for Hardcoded Content** - Search for any remaining hardcoded text
- [ ] **Remove Unused Dependencies** - Audit `package.json`
- [ ] **Clean Up Analysis Scripts** - Move or archive `/app/*.py` scripts

### Pre-Launch Verification
- [ ] **Lighthouse Audit**
  - Run on homepage, 1 service page, contact page
  - Target: Performance >90, SEO >95, Accessibility >90
- [ ] **Core Web Vitals Check**
  - LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] **Mobile Responsiveness Test**
  - Test on actual mobile devices (iPhone, Android), not just DevTools
- [ ] **Cross-Browser Test** - Chrome, Safari, Firefox, Edge
- [ ] **Form Testing**
  - Verify lead form submissions work and send emails
- [ ] **404 Page**
  - Confirm custom 404 page exists and looks professional
- [ ] **All Links Working** - Check for broken internal/external links
- [ ] **Phone Number Click-to-Call** - Verify `tel:` links work on mobile

### Post-Launch (First 30 Days)
- [ ] **Google Search Console**
  - Verify domain ownership
  - Submit sitemap.xml
  - Monitor for crawl errors
- [ ] **Google Analytics / GTM**
  - Verify tracking is firing on all pages
  - Set up conversion goals for form submissions
- [ ] **Facebook Pixel** (if using)
  - Verify pixel fires correctly
- [ ] **Monitor for Errors** - Check browser console, server logs first 24-48 hours

### Google Business Profile (Critical for Local SEO)
- [ ] **Claim & Verify Listing** - business.google.com
- [ ] **Complete All Business Info** - Name, address, phone, hours, website
- [ ] **Add All Services** - List every HVAC service offered
- [ ] **Add Service Areas** - All 24 target cities
- [ ] **Upload Photos** - Trucks, team, completed jobs, office
- [ ] **Link to Website** - Ensure URL is correct
- [ ] **Create First Post** - Announce website launch or seasonal promotion

### Local Citations (Build in First 2 Weeks)
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

### Reviews Strategy
- [ ] **Request Reviews from 5 Happy Customers** - Direct link to Google review
- [ ] **Set Up Review Response Process** - Respond to all reviews within 48 hours
- [ ] **Create Review Request Email/Text Template** - For ongoing use

### Ongoing Monthly Tasks (Document for Reference)
- [ ] Add 1-2 Google Business posts per month
- [ ] Respond to all new reviews
- [ ] Check Search Console for crawl errors
- [ ] Update seasonal content (AC focus in summer, heating in winter)
- [ ] Review analytics for top-performing pages

### Future Enhancements (Post-Launch)
- [ ] **Clean URLs** - Remove `/services/` prefix from routes
- [ ] **Service Visibility Toggle** - Add publish/unpublish in Sanity
- [ ] **Seasonal Homepage Strategy** - Summer AC focus / Winter heating focus
- [ ] **Auto-generated Cities Served Page** - List 200 zip codes by zone for local SEO

---

## Technical Architecture

### Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Shadcn/UI
- **CMS:** Sanity.io (self-hosted studio at `/studio`)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Hosting:** Vercel

### Key Files
```
/app/frontend/
├── app/
│   ├── [slug]/page.jsx      # Dynamic pages from Sanity
│   ├── studio/              # Self-hosted Sanity Studio
│   └── ...
├── lib/
│   └── sanity.js            # Sanity client (useCdn: false for dev)
├── public/
│   ├── DFW_HVAC_Service_Area_4Zone.csv    # Latest service area data
│   ├── dfw_service_area_map_4zone.png     # Latest service area map
│   └── voice-previews/                     # TTS samples
└── sanity/
    └── schemas/             # Content schemas

/app/
├── service_area_4zone_memory_efficient.py  # Service area analysis script
└── ...
```

### 3rd Party Integrations
| Service | Status | Notes |
|---------|--------|-------|
| Sanity.io | ✅ Active | CMS |
| OpenRouteService | ✅ Active | Drive-time isochrones |
| US Census Bureau | ✅ Active | Demographics/geodata |
| OpenAI TTS | ✅ Tested | Via Emergent LLM Key |
| Resend | ⏳ Pending | For lead form emails |
| Facebook Pixel | ⏳ Future | Marketing |
| GA4/GTM | ⏳ Future | Analytics |

---

## Data Files Reference

| File | Description | Last Updated |
|------|-------------|--------------|
| `DFW_HVAC_Service_Area_4Zone.csv` | 4-zone service area with demographics | Jan 2025 |
| `dfw_service_area_map_4zone.png` | Service area visualization | Jan 2025 |
| `DFW_HVAC_Brand_Framework_3Pillar.csv` | Brand positioning | Previous |
| `DFW_HVAC_Competitor_Analysis.csv` | Competitive landscape | Previous |
| `DFW_HVAC_Housing_Types.csv` | Housing demographics | Previous |

---

*Last Updated: January 12, 2025*
