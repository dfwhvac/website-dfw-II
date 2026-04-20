# DFW HVAC — Prioritized Backlog (for next session)

**Last updated:** April 20, 2026
**Previous session accomplishments:** Next.js 14 → 15.5.9 + React 19 upgrade deployed, CVE-2025-66478 patched, www→apex 308 redirect live, `/_next/` robots.txt bug fixed and deployed, GSC sitemap cleaned up and resubmitted at apex URL, 10 priority URLs submitted for indexing, post-upgrade Lighthouse scorecard captured (performance-neutral as expected).

**Site launch date:** April 16, 2026 (Wix → Next.js migration). GSC data before Apr 16 reflects the old Wix site.

**Production:** `https://dfwhvac.com` (Vercel, auto-deploys from `main` branch on GitHub).

---

## 🔴 P1 — High Priority (pick these first)

### P1.1 — Custom meta descriptions for 27 cities + 7 service pages ⭐ TOP PICK

**Why this is #1:** This is the single highest-leverage SEO task on the board. We discovered during the GSC audit that 27 of 28 city pages share an **identical generic fallback** description:
> *"We offer comprehensive HVAC services including AC repair, heating system installation, preventive maintenance, and indoor air quality solutions. As a three-..."*

This kills search CTR (users see the same blurb multiple times in one SERP), signals duplicate content to Google, and wastes city-specific local-SEO opportunities. **Denton is the one city done correctly** — use it as the template:

> *"Professional heating and air conditioning services in Denton, Texas. Same-day HVAC repair, installation, and maintenance. Serving zip codes: 76210."*

**Template structure (per city):** City name + "Texas" + value prop ("Same-day HVAC repair, installation, and maintenance") + specific zip codes.

**Template structure (per service):** Service name + location hook + what's included + differentiator (e.g., "serving DFW since 1974" — **verify claim is true**, previous session removed "since 1974" claims so DOUBLE-CHECK before reusing).

**Cities needing rewrites (27):** allen, argyle, arlington, bedford, carrollton, colleyville, coppell, dallas, euless, farmers-branch, flower-mound, fort-worth, frisco, grapevine, haslet, hurst, irving, keller, lake-dallas, lewisville, mansfield, north-richland-hills, plano, richardson, roanoke, southlake, the-colony.
(Denton is done; do NOT re-rewrite unless user asks.)

**Service pages needing rewrites (7):** All 7 currently have generic fallbacks:
- `/services/residential/air-conditioning`
- `/services/residential/heating`
- `/services/residential/indoor-air-quality`
- `/services/residential/preventative-maintenance`
- `/services/commercial/commercial-air-conditioning`
- `/services/commercial/commercial-heating`
- `/services/commercial/commercial-maintenance`

**Where to update:** Sanity CMS. Each city/service doc has a `metaDescription` field. Zip codes per city are already in Sanity (used on each city page). Main agent should draft all 34 descriptions in one batch, present to user for approval, then help user paste them into Sanity one at a time (or script via Sanity client if user wants bulk automation).

**Expected effort:** ~1 hour (draft + review + paste). User controls pace of Sanity updates.
**Expected impact:** CTR lift of 10-30% on organic impressions; measurable in GSC within 4-6 weeks.
**Prerequisites:** None. Can start immediately. GSC baseline numbers should be captured before changes so we can measure impact — see P1.5 for baseline capture.

---

### P1.2 — Deep technical SEO & architecture audit ⭐ HIGH VALUE, HAS A CHECKLIST

**Why this exists:** During the Apr 20 session we discovered `Disallow: /_next/` silently blocking Googlebot from rendering all our pages. That was a legacy anti-pattern that survived through multiple agent sessions because no one explicitly audited for it. This task forces a systematic sweep.

**Scope — 13 categories (full detail in `/app/frontend/internal/DFW_HVAC_Action_Items.md` item 2a):**
1. robots.txt / meta robots / sitemap consistency
2. HTTP headers (CSP not blocking Googlebot resources, no stray X-Robots-Tag)
3. Canonical tags (one per page, apex form, no trailing slash)
4. Structured data / JSON-LD (LocalBusiness, Service, FAQ, BreadcrumbList)
5. OG / Twitter meta (unique per page)
6. Internal linking (service↔city coverage, no orphans, descriptive anchors)
7. Image optimization (`next/image` usage, alt text, priority props)
8. Third-party script loading (next/script strategies — ties to P2.4 TBT task)
9. 404 / redirect coverage (all old Wix URLs handled)
10. Mobile / accessibility (44px touch targets, WCAG AA contrast, keyboard nav)
11. HTML validation (W3C validator, top 10 pages)
12. Security (no secrets in client bundles, env var safety)
13. Dependency supply chain (`yarn audit`, unmaintained packages)

**Deliverable:** `/app/frontend/internal/DFW_HVAC_Technical_Audit_YYYY-MM-DD.md` with pass/fail per check, evidence, remediation plan for each failure.

**Expected effort:** 3-5 hours. Many checks can be scripted via Playwright/curl for future quarterly re-runs.
**Cadence:** Quarterly.
**Prerequisites:** None. Can interleave with other tasks.

---

### P1.3 — Post-launch QA sweep

**Why:** Site launched Apr 16, 2026 and hasn't had a formal cross-device/cross-browser verification. The Apr 20 Lighthouse run confirmed scores are healthy but it only tests desktop Chrome. Real user traffic is 60-70% mobile.

**Checklist:**
- Mobile responsive spot-check on real devices (iPhone Safari, Android Chrome) — focus on /contact, /request-service, /estimate forms (phone input, address autocomplete, submit buttons at thumb reach)
- Cross-browser: Chrome, Safari (desktop + iOS), Firefox, Edge. Load home + one city + one service + one form page in each.
- Broken-link scan — run `linkinator` or similar across the live site, fix any 404s found
- Click-to-call links — tap phone numbers on mobile, verify dialer opens with correct number (`tel:9724123000` or whatever is live)
- Google Maps embed works in all browsers
- Form submission end-to-end on real mobile (not just desktop)
- 404 page is well-designed and offers navigation back

**Expected effort:** 1-2 hours.
**Prerequisites:** None.

---

### P1.4 — Internal linking audit

**Why:** Local SEO is massively amplified by a tight internal link graph. Service pages should link to relevant city pages and vice versa, with descriptive anchor text.

**What to check / fix:**
- Each of 7 service pages links to all 28 city pages where that service is offered
- Each of 28 city pages links to all service pages relevant to that city
- Footer or sidebar has a site map of services + cities
- No orphan pages (pages not linked from anywhere internally)
- Anchor text is descriptive: "AC repair in Plano" not "click here" or "learn more"
- Breadcrumbs present on all deep pages

**Deliverable:** Add missing links to Sanity data or component templates. Document coverage matrix (service × city) in scorecard.

**Expected effort:** 2-3 hours depending on component depth.
**Prerequisites:** Can run in parallel with meta description work.

---

### P1.5 — Post-migration GSC health check + baseline capture

**Why:** Site is 4 days post-launch. Google is still recrawling. We need to:
1. Capture baseline GSC Performance numbers NOW so later changes can be measured against the starting point.
2. Watch indexing progress weekly for 4 weeks (target: 40-47 of 47 URLs indexed).
3. Catch any 404s on old Wix URLs that need new 301 redirects in `next.config.js`.

**Actions for next agent to guide user through:**
- Open GSC → Performance → note: Total clicks / Total impressions / Avg CTR / Avg position (last 28 days). Add these numbers to `/app/frontend/internal/DFW_HVAC_Performance_Scorecard.md` as "GSC Apr 20 baseline."
- Open GSC → Pages → "Indexed" count. Confirm trending upward toward 47. Note any "Not indexed" entries with reason.
- If any old Wix URLs appear as 404s, add redirects to `/app/frontend/next.config.js` (current redirects: `/scheduleservicecall`, `/installation`, `/iaq`, `/ducting`, `/seasonalmaintenance`, `/testresults`).
- Clean comparison window will be ~May 14, 2026 (28 days post-launch). Document in scorecard.

**User-controlled steps:** User must be logged into GSC. Agent can interpret screenshots and recommend redirects.

**Expected effort:** 30 min for baseline capture; recurring 10-min weekly checks.

---

### P1.6 — Page-by-page ranking factor audit ⭐ SYSTEMATIC SWEEP

**Why this exists:** Meta descriptions (P1.1) drive CTR but are **not a ranking factor**. To actually move rankings we have to audit the factors Google *does* weight. This task is a per-page matrix so nothing gets missed across the ~47 indexed URLs (home + about + 7 services + 27 cities + 5 utility pages + blog, etc.).

**Reference source:** Based on the Apr 20, 2026 agent-user conversation evaluating what Google actually uses vs. the meta description myth. Google has confirmed publicly (Mueller 2020; Search Central docs) that meta description is NOT a ranking factor — it influences CTR only. The factors below ARE ranking signals.

**The 10 ranking factors — audit each, page by page:**

| # | Factor | Is it a ranking signal? | Scope | Cross-ref |
|---|--------|-------------------------|-------|-----------|
| 1 | **Title tag** (`<title>`) | YES (strong) | Per-page audit: unique, front-loads city + primary keyword, <60 chars, no duplicates across 27 cities | NEW — highest priority sub-task |
| 2 | **Page body content** | YES (strongest) | Depth, uniqueness, topical relevance, entity coverage. City pages need 300–500 words of unique copy. | Partly in P3 "Expand city page content" — promote to P1 |
| 3 | **Google Business Profile** | YES (critical for local + map pack) | Claim, NAP, hours, services, photos, service-area cities, review response | P2.2 |
| 4 | **Backlinks** | YES (strong) | Local + industry sources. Audit current profile (Ahrefs/Moz free tier), identify 10–20 realistic targets (local chambers, trade orgs, supplier sites, press) | NEW |
| 5 | **Core Web Vitals** (LCP, INP, CLS) | YES (medium, INP replaced FID Mar 2024) | LCP + CLS currently passing. INP needs specific measurement (different from TBT). | Related to P2.4 TBT but INP audit is distinct |
| 6 | **NAP consistency** | YES (local factor) | Name / Address / Phone identical across web (Yelp, BBB, Angi, Bing, Apple Maps) | P2.3 |
| 7 | **Internal linking structure** | YES (medium) | Service ↔ city cross-links, descriptive anchors, no orphans | P1.4 (already captured) |
| 8 | **Reviews** | YES (local factor) | Quantity + recency + response rate on GBP. Count + response cadence. | Partly in P2.2 — pull out as sub-task |
| 9 | **Schema markup** | YES (medium — indirect via rich results eligibility) | LocalBusiness, Service, FAQ, BreadcrumbList per page. | Captured in P1.2 item 4, but needs per-page verification |
| 10 | **Meta description** | NO (CTR only) | Covered in P1.1 — not a ranking factor but worth doing for CTR lift | P1.1 |

**Sub-tasks to execute (in order of ROI):**

**P1.6a — Title tag audit (highest leverage, easiest)**
- Extract current `<title>` for all ~47 pages (scriptable via curl + cheerio or a quick Next.js build-time log)
- Flag duplicates and over-60-char titles
- Rewrite template (city pages): `[City] HVAC Repair & Installation | DFW HVAC`
- Rewrite template (service pages): `[Service Name] in Dallas-Fort Worth | DFW HVAC`
- Update `generateMetadata()` in `app/cities-served/[slug]/page.jsx` and `app/services/[category]/[slug]/page.jsx`
- **Expected effort:** 1 hour. **Expected impact:** Can directly move rankings (unlike meta desc).

**P1.6b — Body content depth audit (per city + per service)**
- Grep current body word count per city page (target 300–500 unique words)
- Identify pages with thin content or heavy reuse of boilerplate
- Plan: add 1–2 unique paragraphs per city (local landmark, common HVAC issue in that zip, typical age of housing stock, etc.)
- **Expected effort:** 4–6 hours (can batch via Sanity). **Expected impact:** High — this is the biggest untapped ranking lever after titles.

**P1.6c — Backlink profile audit + target list**
- Run free Ahrefs/Moz backlink checker on dfwhvac.com
- Document current referring domains count + DA
- Build target list: Coppell Chamber of Commerce, Dallas BBB, DFW trade associations, HVAC supplier "where to buy" pages, local news sites (PR angle: 3-generation family business story)
- **Expected effort:** 2 hours audit + ongoing outreach. **Expected impact:** Medium-long term.

**P1.6d — INP (Interaction to Next Paint) measurement**
- Distinct from TBT (P2.4). INP is a field metric from real users via CrUX / GSC Core Web Vitals report.
- Check GSC → Experience → Core Web Vitals for current INP status on mobile + desktop
- If "Needs improvement" or "Poor," investigate input handlers (form inputs, button clicks, reCAPTCHA callbacks)
- **Expected effort:** 30 min diagnosis + variable fix time. **Prerequisite:** Need 28 days of field data, so may not show for any new pages yet.

**P1.6e — Review audit + response cadence**
- Count current Google reviews on GBP (dashboard has 80+ reviews historically)
- Check response rate (ideal: respond to 100%, priority negative/4-star)
- Audit review freshness (Google weights recency)
- Document cadence goal: 2–5 new reviews per month minimum
- Cross-reference to P2.2 GBP setup.
- **Expected effort:** 1 hour audit + ongoing. **User-controlled** (requires GBP admin access).

**P1.6f — Schema markup per-page verification**
- Use Google Rich Results Test or Schema.org validator on 5 sample pages (home, 1 service, 1 city, /contact, /about)
- Verify: LocalBusiness on home + contact, Service schema on service pages, BreadcrumbList on deep pages, FAQ on /faq
- Flag missing or invalid schema; remediate in component templates
- **Expected effort:** 2 hours. **Expected impact:** Unlocks rich results (review stars, FAQ dropdowns) which lift CTR indirectly.

**P1.6g — Fallback data parity audit (`lib/metadata.js` + `lib/mockData.js`)**
- Added Apr 20, 2026 after spotting stale values during click-to-call bug fix.
- **Known stale values in `lib/metadata.js` JSON-LD fallback (lines ~120–196):**
  - `reviewCount: '118'` → should be `145` (matches mockData + live Sanity)
  - `areaServed`: hardcoded 12-city list → should be the full 27-city list or sourced from Sanity `serviceAreas`
  - `openingHours: 'Mo-Fr 09:00-18:00'` → should be `'Mo-Fr 07:00-18:00'` (7AM–6PM per current business hours)
- **Why this matters:** These are *fallback* values used only when Sanity is unreachable, but any CMS hiccup causes Google to index incorrect structured data → could surface wrong hours / review count / service areas in SERP rich results and Knowledge Panel. Low frequency, high blast radius.
- **Fix approach:** Drive the JSON-LD from `companyInfo` prop (pattern `SchemaMarkup.jsx` already uses) instead of hardcoded literals in `lib/metadata.js`. Or deprecate the hardcoded schema in `lib/metadata.js` entirely if `SchemaMarkup.jsx` already covers the same pages (likely overlap — audit both).
- **Also re-verify:** `companyInfo.established: '2020'` (correct), `legacyStartYear: '1972'` (correct), `phoneDisplay` now wired into schema (fixed Apr 20, 2026).
- **Expected effort:** 30 min. **Expected impact:** Defensive — prevents stale data from leaking into Google if Sanity fails.



**Deliverable:** `/app/frontend/internal/DFW_HVAC_Ranking_Factor_Audit_YYYY-MM-DD.md` with:
- Matrix of all ~47 pages × 10 factors
- Pass/fail per cell with evidence
- Prioritized remediation queue
- Baseline metrics (GSC avg position per query, CTR per page) captured at start of audit for later delta measurement

**Total expected effort:** 10–15 hours, spread across sessions. Highest-ROI sub-tasks first (P1.6a titles, P1.6b body content).

**Cadence:** First full pass now. Re-audit quarterly alongside P1.2 technical SEO audit.

**Prerequisites:** Capture GSC baseline (P1.5) before making changes so delta is measurable.

---

### P1.7 — GA4 conversion event setup

**Why:** GA4 is installed (`G-5MX2NE7C73`) but no conversion events configured. Without conversions, we can't measure:
- Form submission rate per landing page
- Click-to-call rate per device type
- Which traffic sources convert best

**Events to set up (in GA4, not code — they fire from existing `gtag('event', ...)` in LeadForm.jsx):**
- `form_submit_lead` (fires on successful /api/leads submission) → mark as conversion
- `click_to_call` (fires when user taps `tel:` link) → mark as conversion
- `request_service_submit` / `estimate_submit` / `contact_submit` variants if we want per-form granularity

**Verify:** Agent should confirm gtag events are already firing by searching LeadForm.jsx, SimpleContactForm.jsx, and any click-to-call components. If not firing, add them (component code change, small).

**Expected effort:** 30 min GA4 config + 30 min verifying gtag events in code. User does GA4 dashboard config; agent does code.

---

## 🟡 P2 — Important (but wait until P1 is largely done)

### P2.1 — "50+ cities" copy cleanup

**Why:** Marketing copy in multiple places claims "50+ cities" but Sanity only has 28 city pages. Brand accuracy matters.

**Where to audit:** Search the codebase and Sanity for `"50+"`, `"50 cities"`, `"50 DFW cities"`, etc. Common hiding spots:
- Hero components on home and city pages
- Footer area descriptions
- About page
- Service area descriptions in CMS

**Fix:** Replace with accurate phrasing. Options: "28+ DFW cities", "across the DFW Metroplex", "throughout North Texas". User should pick tone.

**Expected effort:** 30 min.

---

### P2.2 — Google Business Profile (GBP) setup + optimization

**Why:** GBP is the #1 driver of local SEO traffic for home services. Without it, you're invisible in the Google Maps pack for "HVAC near me" searches.

**Actions:**
- Claim or verify existing GBP for DFW HVAC at 556 S Coppell Rd
- Verify business hours match site (Mon-Fri 7AM-6PM)
- Add services list matching site
- Upload 10-20 photos (before/after jobs, team, trucks, office)
- Add service area (list 28 cities)
- Request reviews from recent customers
- Set up GBP Messages and respond to review prompts

**User-controlled:** Google requires user to have admin access to the GBP account.
**Expected effort:** 2-3 hours (spread over a week).

---

### P2.3 — Local citations (NAP consistency)

**Why:** Google ranks local businesses partly on consistent Name / Address / Phone across the web. Common citation sites for HVAC:
- Yelp, BBB (Better Business Bureau), Angi (formerly Angie's List), HomeAdvisor, Thumbtack, Nextdoor, Facebook Business, Bing Places, Apple Maps Connect

**Audit first:** Use a free NAP consistency tool (e.g., whitespark.ca citation audit, moz.com local search). Identify listings with wrong phone/address.

**Fix:** Correct or create listings. Ensure identical NAP across all.

**Expected effort:** 3-4 hours; can batch over several sessions.

---

### P2.4 — TBT optimization (lazy-load third-party scripts)

**Why this is P2, not P1:** Google's Core Web Vitals signals for ranking are LCP and CLS — both passing. TBT is a UX concern (page unresponsive for ~2 sec on mobile) but not directly an SEO ranking factor. Fix when conversion-rate data shows slow-page drop-off, OR when starting paid ads.

**Scope (full detail in `/app/frontend/internal/DFW_HVAC_Action_Items.md` item 13b):**
- Google Maps: lazy-load on form focus, not page load (~800-1,200 ms TBT win)
- reCAPTCHA: `next/script strategy="lazyOnload"` (~300-500 ms)
- GA4 / gtag: `strategy="afterInteractive"` (~100-200 ms)
- RealWork widget on /recent-projects: IntersectionObserver (~200-400 ms)

**Target:** TBT 2,300 ms → ~400 ms; Perf score 69 → 85+.
**Expected effort:** ~3 hours.
**Prerequisites:** Do NOT start until meta descriptions (P1.1) and technical audit (P1.2) are done — those are higher ROI.

---

### P2.5 — Production caching mode (Sanity webhook revalidation)

**Why:** Currently every page uses `export const dynamic = 'force-dynamic'` which re-fetches Sanity on every request. Safe but slower than necessary. Should switch to ISR (Incremental Static Regeneration) with webhook revalidation: pages static-generated at build, revalidate on-demand when Sanity content changes.

**Scope:**
- Remove `force-dynamic` from pages (keep for `/contact`, `/request-service`, `/estimate` if they have any per-request logic)
- Add `export const revalidate = 3600` (1-hour fallback) or appropriate value
- Create `/api/revalidate` route with secret token auth
- Configure Sanity webhook to hit `/api/revalidate` on document publish
- Test flow: edit a Sanity doc → webhook fires → page updates in production within seconds

**Expected effort:** 2-3 hours.
**Payoff:** Faster page loads, lower Vercel function invocation costs.

---

### P2.6 — GTM + Facebook Pixel

**Why:** If user ever plans to run paid social (Facebook/Instagram ads) or wants centralized tag management beyond just GA4. Not urgent; install when needed for a specific campaign.

**Expected effort:** 1-2 hours (GTM container + FB Pixel install + conversion events).

---

### P2.7 — Code cleanup / unused dependency audit

**Why:** Clean codebase = faster builds, fewer supply-chain CVE risks, easier next upgrade.

**Scope:**
- Run `yarn depcheck` or manual review of package.json — remove anything unused
- Switch Sanity client to production mode if currently dev
- Remove any dead mock data or unused components
- Consolidate duplicate CSS / component patterns

**Expected effort:** 1-2 hours.

---

## 🔵 P3 — Backlog (wait until P1+P2 largely done)

- Next.js 15 → 16 upgrade (+ Sanity 3.50+) — revisit summer 2026
- DNS records upgrade (Vercel CNAME-based) at GoDaddy — 10 min, low-risk
- Expand city page content (300-500 words each) for better local SEO
- AI Readiness / AEO work (NAP audit, review responses, schema depth)
- Content hub / blog / HVAC resources section
- Case studies + financing page content
- YouTube video embeds on Indoor Air Quality page
- Housecall Pro direct API integration (replace manual entry)
- RealWork subscription evaluation (keep or cut based on /recent-projects analytics)
- Latent Sanity null-handling bug in `lib/sanity.js`
- Cancel Wix subscription (once new site stable 2+ weeks post-launch)

## 🔁 Recurring

- Annual fallback/seed data review (`lib/mockData.js` accuracy vs Sanity + Google)
- Quarterly technical audit re-run (after P1.2 first run completes)

---

## Key files / context for the next agent

- `/app/frontend/internal/DFW_HVAC_Action_Items.md` — full detailed task log (this doc is the summary)
- `/app/frontend/internal/DFW_HVAC_Performance_Scorecard.md` — v14 + v15 Lighthouse numbers, security posture
- `/app/frontend/internal/baseline-screenshots/` — 13 pre-upgrade visual baselines
- `/app/memory/PRD.md` — product requirements doc with roadmap section
- `/app/memory/CHANGELOG.md` — dated implementation history
- `/app/frontend/app/robots.js` — now correctly allows `/_next/`
- `/app/frontend/app/sitemap.js` — generates 47 URL sitemap at apex
- `/app/frontend/next.config.js` — security headers + 6 legacy 301 redirects from Wix URLs

## Credentials / integrations in use

- Sanity.io (headless CMS)
- Vercel (hosting + cron)
- MongoDB Atlas (lead storage)
- Google Places + Maps JS API (address autocomplete on forms)
- Resend (transactional email for lead notifications)
- Google Analytics 4 (`G-5MX2NE7C73`) — events fire, conversions not yet configured (see P1.6)
- Google reCAPTCHA v3 (on lead forms, graceful fallback on preview domain)
- RealWork widget (on /recent-projects, via `NEXT_PUBLIC_REALWORK_ID`)
- Google Search Console (Domain property verified Feb 20, 2026; GA4 linked)

All API keys live in Vercel env vars and locally in `/app/frontend/.env.local`. Never commit keys to git.
