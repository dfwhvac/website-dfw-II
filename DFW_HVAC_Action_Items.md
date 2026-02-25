# DFW HVAC Website - Open Action Items
**Generated:** February 25, 2025  
**Project:** dfwhvac.com Website Launch

---

## Priority Legend
- 🔴 **P0 - Critical** (Must complete before launch)
- 🟠 **P1 - Important** (Should complete before/at launch)
- 🟡 **P2 - Launch Day** (Execute on go-live day)
- 🟢 **P3 - Post-Launch** (After site is live and stable)

---

## 🔴 P0 - Critical (Pre-Launch)

### 1. Resend Domain Verification
**Status:** BLOCKED (waiting for DNS migration)  
**Action:** Verify `dfwhvac.com` in Resend to enable lead notification emails  
**Blocked By:** Wix DNS doesn't support required records  
**Resolution:** Will be unblocked when DNS moves to Vercel  

### 2. 301 Redirects ✅ IMPLEMENTED
**Status:** COMPLETE  
**Details:** Old Wix URLs now redirect to new Next.js pages:
| Old URL | New URL |
|---------|---------|
| /scheduleservicecall | /request-service |
| /installation | /estimate |
| /iaq | /services/residential/indoor-air-quality |
| /ducting | /services/residential/indoor-air-quality |
| /seasonalmaintenance | /services/residential/preventative-maintenance |
| /testresults | /services/residential/indoor-air-quality |

---

## 🟠 P1 - Important (Pre-Launch)

### 3. Google Search Console Setup
**Action:** Verify domain ownership via GoDaddy DNS TXT record  
**Then:** Submit sitemap, check indexing status  

### 4. Create OG Image
**Current State:** Using logo as placeholder  
**Required:** Create 1200x630px branded image for social sharing  
**Specs:**
- Include company logo
- Tagline: "Trust. Excellence. Care."
- Brand colors: Navy (#003153), Cyan (#00B8FF), Red (#FF0000)
- Save to: `/public/images/dfwhvac-og.jpg`

### 5. RealWork Subscription Evaluation
**Action:** Owner to decide if subscription cost is justified  
**Context:** Widget has ZERO SEO value; value is visual trust only  

### 6. YouTube Video Embed
**Page:** Indoor Air Quality  
**Action:** Embed relevant IAQ video content  

### 7. Content Creation
**Items Needed:**
- Case studies
- Financing page content

### 8. Internal Linking Audit
**Action:** Cross-link services ↔ city pages for SEO  

### 9. Performance Optimization
**Action:** Run Lighthouse audit, optimize as needed  

### 10. Pre-Launch Verification
**Checklist:**
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] All forms submit correctly
- [ ] All phone links work
- [ ] Check for broken links

---

## 🟡 P2 - Launch Day

### 11. DNS Cutover
**Option A (Recommended):** Use Vercel Nameservers
1. Log into GoDaddy → My Products → dfwhvac.com → DNS → Nameservers
2. Change to Vercel nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. In Vercel: Add `dfwhvac.com` as production domain
4. Wait for DNS propagation (15 min - 48 hours)

**Option B:** Keep GoDaddy DNS
1. Add A record: `@` → `76.76.21.21`
2. Add CNAME: `www` → `cname.vercel-dns.com`
3. In Vercel: Add domain

### 12. Domain Configuration in Vercel
**Action:** Add dfwhvac.com as production domain in Vercel dashboard  

### 13. SSL Verification
**Action:** Confirm HTTPS working (automatic with Vercel)  

### 14. Post-Launch Testing
**Checklist:**
- [ ] Site loads at https://dfwhvac.com
- [ ] www.dfwhvac.com redirects properly
- [ ] All forms work
- [ ] All CTAs work
- [ ] 301 redirects working
- [ ] Lead emails being received

---

## 🟢 P3 - Post-Launch

### 15. Production Caching Mode
**Action:** Enable webhook revalidation for Sanity content updates  

### 16. Marketing & Analytics Setup
**Items:**
- [ ] Google Analytics 4 (GA4)
- [ ] Google Tag Manager (GTM)
- [ ] Facebook Pixel

### 17. Google Business Profile
**Action:** Set up and optimize GBP listing  

### 18. Local Citations
**Directories to list:**
- [ ] Yelp
- [ ] BBB (Better Business Bureau)
- [ ] Angi
- [ ] HomeAdvisor
- [ ] Thumbtack

### 19. City Page SEO Enhancement
**Action:** Add 300-500 word descriptions to each city page  

### 20. City + Service Combination Pages
**Example:** `/dallas-ac-repair/`  
**Benefit:** Target hyper-local search queries  

### 21. Code Cleanup
**Items:**
- [ ] Remove mockData.js
- [ ] Remove unused dependencies
- [ ] Switch Sanity client to production mode

### 22. Cancel Wix Subscription
**When:** After confirming new site is stable (1-2 weeks post-launch)  

### 23. Housecall Pro Direct Integration
**Goal:** Auto-create customers/jobs in HCP from form submissions  
**Benefit:** No Zapier fees, instant sync  
**Prerequisite:** Confirm HCP API access and credentials  

### 24. "50+ Cities" Claim Cleanup
**Issue:** Site references "50+ cities" but only 28 configured  
**Action:** Update copy to accurate language  

### 25. AI Readiness / AEO Strategy
**Tier 1:**
- [ ] Optimize Google Business Profile
- [ ] NAP consistency audit
- [ ] Respond to all reviews

**Tier 2:**
- [ ] Create /resources content hub
- [ ] Publish authoritative HVAC guides
- [ ] YouTube presence

### 26. Build Showcase Projects Page
**Status:** Redirect in place (/recent-projects → /reviews)  
**When:** Owner provides 6-12 project photos  
**Content Needed:**
- Before/after photos
- Job type, city, date for each
- Optional customer testimonials

---

## Quick Reference

**Preview URL:** https://dfw-hvac-preview-1.preview.emergentagent.com  
**Vercel Deploy Hook:** See PRD.md for URL  
**Domain Registrar:** GoDaddy  
**Current Hosting:** Wix (to be migrated)  
**New Hosting:** Vercel  

---

*Document generated from PRD.md - For full details see /app/memory/PRD.md*
