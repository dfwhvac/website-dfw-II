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
  - Re-enable `useCdn: true` in `/app/frontend/lib/sanity.js`
  - Change `export const dynamic = 'force-dynamic'` to `export const revalidate = 3600` on pages:
    - `/app/frontend/app/page.js`
    - `/app/frontend/app/services/[category]/[slug]/page.jsx`
    - `/app/frontend/app/[slug]/page.jsx`
    - `/app/frontend/app/faq/page.jsx`
    - `/app/frontend/app/reviews/page.jsx`
    - `/app/frontend/app/about/page.jsx`
    - `/app/frontend/app/contact/page.jsx`
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

### SEO Optimization
- [ ] **Dynamic sitemap.xml** - Create `/app/frontend/app/sitemap.js`
- [ ] **robots.txt** - Create `/app/frontend/public/robots.txt`
- [ ] **Canonical URLs** - Add to all pages
- [ ] **Open Graph Images** - Set in Sanity siteSettings
- [ ] **Service Schema Markup** - Add to each service page
- [ ] **Internal Linking** - Cross-link related services

### Code Cleanup
- [ ] **Remove mockData.js** - `/app/frontend/lib/mockData.js` (all data in Sanity now)
- [ ] **Audit for Hardcoded Content** - Search for any remaining hardcoded text
- [ ] **Remove Unused Dependencies** - Audit `package.json`
- [ ] **Clean Up Analysis Scripts** - Move or archive `/app/*.py` scripts

### Pre-Launch Verification
- [ ] **Lighthouse Audit** - Target: Performance >90, SEO >95, Accessibility >90
- [ ] **Core Web Vitals** - LCP <2.5s, FID <100ms, CLS <0.1
- [ ] **Mobile Test** - Test on real devices (iPhone, Android)
- [ ] **Cross-Browser Test** - Chrome, Safari, Firefox, Edge
- [ ] **Form Testing** - Verify lead submissions + email delivery
- [ ] **404 Page** - Confirm custom 404 exists and looks professional
- [ ] **All Links Working** - Check for broken internal/external links
- [ ] **Phone Number Click-to-Call** - Verify `tel:` links work on mobile

### Post-Launch
- [ ] **Google Search Console** - Verify domain, submit sitemap
- [ ] **Google Analytics / GTM** - Verify tracking + conversion goals
- [ ] **Facebook Pixel** - Verify firing (if applicable)
- [ ] **Monitor for Errors** - Check browser console, server logs first 24-48 hours

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
