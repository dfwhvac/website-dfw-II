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
