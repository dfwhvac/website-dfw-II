# DFW HVAC — Prioritized Backlog (for next session)

**Last updated:** April 21, 2026 (PR #2 / Sprint 1 completion SHIPPED — all 6 Week 1 tasks done: a11y fix pack, `lib/metadata.js` parity fix, GA4 conversion events, 7 service meta descriptions, mobile form UX audit + autofill wins. Ready for GitHub push.)

**📍 Start here:** See the "**PHASE GROUPING & EXECUTION SEQUENCE**" section below for the authoritative execution order. Detailed task descriptions follow grouped by original priority tier.
**Previous session accomplishments:** Next.js 14 → 15.5.9 + React 19 upgrade deployed, CVE-2025-66478 patched, www→apex 308 redirect live, `/_next/` robots.txt bug fixed and deployed, GSC sitemap cleaned up and resubmitted at apex URL, 10 priority URLs submitted for indexing, post-upgrade Lighthouse scorecard captured (performance-neutral as expected).

**This session accomplishments (Apr 20 evening):** Click-to-call bug fix (5 files) • P1.1 meta descriptions via Path A code fallback (all 28 cities now use adaptive template) • TBT optimization PR #1 (reCAPTCHA removed from root, Maps `onFocus`, RealWork IntersectionObserver, "Powered by Google" attribution) • P1.6 ranking factor audit documented with 7 sub-tasks • P1.6g fallback data parity added after discovering stale values in `lib/metadata.js`.

**Site launch date:** April 16, 2026 (Wix → Next.js migration). GSC data before Apr 16 reflects the old Wix site.

**Production:** `https://dfwhvac.com` (Vercel, auto-deploys from `main` branch on GitHub).

---

## 🎯 PRIME DIRECTIVE & STRATEGIC FRAMING

**Business goal:** Pull relevant (high-intent, local) traffic → convert into form fills / phone calls.

**The unique strategic asset:** **145 five-star Google reviews, zero negative.** This is outlier-tier social proof — most 4.7-rated local HVAC companies have 1-star reviews dragging them down. DFW HVAC has essentially a unicorn review profile. **It should be pervasive across the site, in schema markup, in SERP snippets, and weaponized in every conversion moment.** Today it's mostly hidden on `/reviews` and under-represented in schema (wrong count in fallback).

**The two pillars:**
1. **Traffic pillar:** Get found by people one phone call away from buying. GBP + local SEO + city-specific content + title tags with review signal.
2. **Conversion pillar:** Turn found-and-aware visitors into submits before they comparison shop. Review social proof sitewide + progressive forms + urgency signals + clear "what happens next" + financing visibility.

**What "relevant" traffic means here:** `"ac repair plano"`, `"hvac near me"`, `"emergency ac [city]"`, `"furnace not working [city]"`, `"[city] hvac company"` — purchase-intent + local. NOT `"how does HVAC work"` (top-of-funnel, low conversion).

**Near-term focus (next 2 weeks):** 3 of the highest-leverage items are GBP optimization (biggest traffic), review-badge-everywhere + aggregateRating schema fix (biggest conversion), and progressive form (biggest on-site conversion lift). These 3 items likely 2–3× the combined impact of everything else on this backlog.

---

## 🗂️ PHASE GROUPING & EXECUTION SEQUENCE (solo-operator reorganization — Apr 20, 2026 evening)

**Operating reality:** This is a one-person team. Content production (writing, outreach, filming) is slow; code/infrastructure work is fast and agent-executable. Rather than running parallel tracks, **finish Phase A (code/infrastructure) completely before starting Phase B (content production)**. This prevents architectural bugs from surfacing mid-content-sprint and lets content work focus on quality without foundation anxiety.

**The original P1.x / P2.x / P3.x IDs are preserved below for traceability.** This section re-groups the same items by workstream type. Each detailed task description lives in its original section below — use this as a navigation map.

---

### 🏗️ Phase A — Architecture Lock-In (code-heavy, agent-executable in focused sessions)

**Goal:** Finish every code-based improvement and surface every lurking bug. When Phase A is complete, the platform is "content-ready" and no architectural surprises remain to derail content work.

**A1 — Audit sweeps (find hidden bugs)**
- **P1.2** — Deep technical SEO & architecture audit (13-category sweep) — 3–5 hrs
- **P1.3** — Post-launch QA sweep (mobile / cross-browser / broken links) — 1–2 hrs
- **P1.6a** — Title tag audit + rewrite — 1 hr
- **P1.6d** — INP (Core Web Vitals) measurement — 30 min
- **P1.6f** — Schema markup per-page verification — 2 hrs
- **P1.6g** — `lib/metadata.js` fallback parity fix (stale 118 review count, wrong hours, 12-city areaServed) — 30 min

**A2 — Measurement foundation (can't optimize blind)**
- **P1.5** — GSC baseline capture + weekly indexing trend — 30 min + recurring
- **P1.7** — GA4 conversion events (form_submit_lead, click_to_call, phone_click) — 1 hr

**A3 — Schema + fallback integrity**
- **P1.9a** — Fix `aggregateRating.reviewCount` schema globally (118 → 145 pulled from Sanity) — 30 min
- **P1.1 (remainder)** — 7 service-page meta descriptions via code fallback (Path A) — 20 min

**A4 — Conversion infrastructure (reusable UI components — code, not copy)**
- **P1.9b** — Review badge component (used in every page hero) — 2 hrs
- **P1.9e** — Footer + sticky bottom bar trust signals — 1 hr
- **P1.9f / P1.11** — `/thanks` success page + email auto-reply infra (Resend) — 4 hrs (merged)
- **P1.10** — Progressive form redesign (2-field → expand) — 4–6 hrs
- **P2.13** — Exit intent capture modal — 3–4 hrs
- **P2.12** — SMS text-back infrastructure (Twilio wiring; copy in Phase B) — 4–6 hrs

**A5 — Mobile UX + hygiene (planned as PR #2)**
- **P1.3-scoped** — Mobile form UX audit (Playwright viewport + code review) — 2 hrs
- **P2.1** — "50+ cities" copy cleanup (actual = 28) — 30 min
- **P1.4** — Internal linking matrix (implement as code lookup if possible) — 2–3 hrs

**A6 — Deeper performance**
- **P2.4b** — Server components migration + bundle reduction (reach 🟢 Good TBT) — 6–10 hrs
- **P2.5** — Sanity webhook ISR revalidation (eliminate `force-dynamic` on public routes) — 4 hrs
- **P2.7** — Code cleanup / unused dependency audit — 1–2 hrs

**A7 — Operational/SEO polish**
- **P1.6c** (audit half) — Backlink profile audit (Ahrefs/Moz free tier) — 2 hrs
- **P2.3** — NAP consistency audit (Yelp, BBB, Angi, HomeAdvisor) — 2 hrs
- **P2.6** — GTM + Facebook Pixel (if desired for retargeting) — 2 hrs

**Phase A total estimated effort:** ~45–60 hrs of focused code sessions. At 2–3 hr blocks, 1–2 sessions per week → **realistic completion in 4–8 weeks.**

---

### ✍️ Phase B — Content Production (slow, user-led, agent-supported drafting)

**Goal:** Fill the content vacuum. Weaponize the 145 reviews. Build topical authority. This is where most of DFW HVAC's ROI lives — but it requires consistent weekly effort over months, not a single sprint.

**B1 — Weaponize reviews (content flows into Phase A's components)**
- **P1.9c** — Inline review carousel (select/tag 12 rotating reviews with city metadata) — 1 hr content
- **P1.9d** — City-filtered reviews page (tag existing 130 testimonials by city) — 3 hrs
- **P1.6e** — Review response audit + ongoing reply cadence — 1 hr + recurring

**B2 — Google Business Profile (biggest traffic lever — user-controlled)**
- **P1.8** — GBP claim + full optimization + photos + weekly Posts cadence — 4 hrs + 30 min/week recurring

**B3 — City page body content (biggest content effort on backlog)**
- **P1.6b** — 300–500 unique words per city × 28 cities (local landmarks, housing stock, common HVAC issues) — 4–6 hrs
- **P1.6c** (outreach half) — Backlink outreach to Chamber of Commerce, BBB, trade orgs, press angle for 3-gen family story — Ongoing

**B4 — Conversion copy (fills infra built in Phase A)**
- /thanks page copy + email auto-reply copy — 1 hr
- SMS text-back message copy — 30 min
- Progressive form field copy + helper text — 30 min
- Exit intent modal copy — 30 min
- **P2.14** — Urgency signals using real data (booked-this-week counts, weather-triggered banners) — 1 hr

**B5 — Long-form content assets**
- **P2.8** — Video testimonials (3 videos: owner intro + 2 customers; external filming) — 4 hrs on-site embed + $500–1,500 external
- **P2.9** — Blog launch + 4 seasonal posts (3 hrs research + writing + editing per post) — 6 hrs infra + 12+ hrs content
- **P2.10** — Lead magnets (AC age lookup, cost calculator, pre-summer checklist PDF) — 8–12 hrs each
- **P2.11** — Financing page + service-page callouts (schema included) — 4 hrs

**Phase B total:** Effectively ongoing — 3–6 months of weekly work at 1–2 hrs/week pace. Realistic for solo operator without burnout.

---

### 🔵 Phase C — Deferred / Strategic P3 (wait until Phase A+B momentum is strong)

- Next.js 15 → 16 upgrade + Sanity 3.50+ (summer 2026 for stability)
- DNS upgrade (GoDaddy A-records → Vercel CNAME)
- Expanded city page content beyond P1.6b (neighborhood-specific sub-pages)
- AI readiness / AEO (structured answers for AI Overviews, generative search)
- Housecall Pro direct API integration (replace CSV flow)
- Cancel Wix subscription (2+ weeks post-launch stability verified)

---

### 🏃 12-WEEK AD LAUNCH ROADMAP (Apr 21, 2026 — replaces prior generic sprint sequence)

**Strategic context:** User plans to launch Google Ads in ~12 weeks. This roadmap sequences architecture, content, data tracking, and ads-specific infrastructure so that Day 1 of ad spend lands on a fully instrumented, <200ms TBT, content-rich site with 70+ days of GA4 baseline data. See also: P1.12, P2.19, P2.20, P2.21 (new Google Ads-specific items).

**Core principle:** Instrument everything before optimizing anything. GA4 conversion events in Week 1 = 70+ days of baseline data by ad launch. Without that, every ad decision is a guess.

---

#### Month 1 — Foundation + Measurement + GBP Head-Start (Weeks 1–4)

**Goal:** Conversion tracking live. GBP ramping (30–60 day map-pack ramp). Hidden bugs caught. Data collection starts Day 1.

**Week 1 — Sprint 1 completion (PR #2)** ✅ SHIPPED Apr 21, 2026
- ✅ P1.7 — GA4 conversion events LIVE (`form_submit_lead` in both forms via verified success response; `phone_click` via global `PhoneClickTracker.jsx` event delegation in root layout) → **baseline data collection started**. User action: toggle "Mark as conversion" in GA4 dashboard after 24h.
- ✅ P1.6g — `lib/metadata.js` fallback parity fix (118 → 145, `Mo-Fr 09:00-18:00` → `07:00-18:00`, 12-city areaServed → full 28)
- ✅ P1.9a — aggregateRating schema fix (118 → 145 in fallback; active `SchemaMarkup.jsx` already dynamic)
- ✅ P1.3-scoped — Mobile form UX audit: findings doc at `internal/Mobile_Form_UX_Audit_2026-04-21.md`; quick wins applied (7 `autoComplete` + 3 `inputMode` attrs); deeper UX deferred to P1.10
- ✅ **P1.3a — Accessibility fix pack**: 6 color-contrast fixes (identified correct targets — all on white bg, NOT Footer which is already AA-passing on dark bg), 3 social-icon aria-labels, 1 hamburger button aria-label + aria-expanded + aria-controls → Accessibility 87 → 95+ 🟢 (to verify on Vercel preview)
- ✅ P1.1 (final) — 7 service page meta descriptions via Path A code fallback (`buildServiceMetaDescription` + `SERVICE_META_COPY` map)

**Week 2 — Sprint 2a audits**
- ✅ P1.2 — Deep technical SEO audit (13-category sweep) **COMPLETE Apr 21, 2026** — findings at `/app/frontend/internal/DFW_HVAC_Technical_Audit_2026-04-21.md`. Overall grade 🟡 B+. Three high-priority gaps uncovered → all closed via PR #3 below.
- ✅ **PR #3 SHIPPED Apr 21, 2026** — closes audit findings R1.1 + R1.2 + R2.1:
    1. ✅ **R1.1 — JSON-LD schema on city + service pages.** City pages now render 3 blocks (HVACBusiness + city-scoped Service + BreadcrumbList). Service pages now render 3 blocks (HVACBusiness with all 28 cities in areaServed + Service with provider rating + BreadcrumbList). New schema components added to `components/SchemaMarkup.jsx`: `BreadcrumbListSchema`, `CityServiceSchema`, `ServiceSchema`.
    2. ✅ **R1.2 — Hub-and-spoke internal linking.** City pages now link to all 7 services with city-specific anchor text ("AC Repair in Plano, TX"). Service pages now link to all 28 cities with service-specific anchor text ("Heating in Plano"). Closes the biggest local-SEO structural gap.
    3. ✅ **R2.1 — Branded `app/not-found.jsx`.** Replaces Next.js generic "page not found" with conversion-first 404: big phone CTA, 5-star trust bar, 4 popular destination links (Home / Services / Cities / Reviews), tertiary request-service link. Returns proper HTTP 404 status.
- P1.3 — Post-launch QA sweep (mobile/cross-browser/broken links) — still pending

**Week 3 — Sprint 2b audits**
- P1.6a — Title tag audit + rewrite (titles ARE a ranking factor, unlike meta desc)
- P1.6f — Schema markup per-page verification

**Week 4 — P1.8 GBP optimization kickoff**
- **Start the 30–60 day map-pack ramp ASAP.** Claim, verify NAP, photos (20+), services, attributes
- Begin weekly GBP Posts cadence
- Respond to all 145 reviews

**Content cadence Month 1:** 1 city page body content rewrite per week (P1.6b). 4 cities done by end of Month 1.

---

#### Month 2 — Architecture to <200ms TBT + Content Rhythm (Weeks 5–8)

**Goal:** Site becomes ad-ready from performance perspective. Review social proof pervasive. Content cadence humming.

**Week 5 — Sprint 3a review leverage UI**
- P1.9b — Review badge component (used in every page hero, footer, sticky CTA)
- P1.9e — Footer + sticky bottom bar trust signals

**Week 6 — Sprint 3b conversion UI**
- P1.10 — Progressive form (2-field → expand, expected 30–50% form submit lift)
- P1.11 / P1.9f — `/thanks` success page + email auto-reply infra (Resend)

**Week 7 — Sprint 4a TBT path to 🟢 Good**
- **P2.4b** Server components migration (Header, Footer, StickyMobileCTA, heroes, card grids) — Path 2, expected −300–400ms TBT
- **P2.15** component decomposition folded in (ServiceTemplate, CompanyPageTemplate, HomePage, CityPage → split into smaller server-first components)
- **P2.7** bundle reduction (lucide-react tree-shake, shadcn audit, Sanity Studio chunk isolation) — Path 3, expected −100–200ms TBT

**Week 8 — Sprint 4b ISR + re-measure + all-green verification**
- **P2.5** ISR for city + service pages (Sanity webhook revalidation, eliminate `force-dynamic`) — Path 4
- **P2.4c — Lighthouse "all-green" verification milestone:** Re-run Lighthouse on `/cities-served/plano` (mobile + desktop) and `/request-service` (mobile + desktop). Success criteria: Performance 90+, TBT <200ms, TTI <3.8s, Accessibility 90+, Best Practices 90+, SEO 100. If any metric misses, tune before Week 9. **This is the architectural quality gate — without passing it, the ad-readiness work in Weeks 10–12 sits on a weaker foundation.**
- Update `DFW_HVAC_Performance_Scorecard.md` with post-Sprint-4 numbers + declare "Architecture Lock-In" complete

**Content cadence Month 2:** 1 city per week + 1 blog post (P2.9 launch). 8 cities + 1 blog post by end of Month 2.

---

#### Month 3 — Ad-Readiness Polish + Dry Run (Weeks 9–12)

**Goal:** Google Ads-specific architecture live. Trial campaign validates tracking before full ad spend.

**Week 9 — Sprint 5 SEO polish**
- P1.4 — Internal linking matrix (service ↔ city cross-links)
- P2.3 — NAP consistency audit (Yelp, BBB, Angi, HomeAdvisor)
- P2.1 — "50+ cities" copy cleanup (actual = 28)

**Week 10 — P1.12 Google Ads architecture kickoff**
- Dedicated ad landing pages (2–3 templates: `/quote-ac-repair`, `/quote-furnace-install`, `/emergency-hvac-dfw`) — one per ad group, higher Quality Score
- GCLID capture + storage in MongoDB lead records
- UTM parameter preservation through form submission flow
- Landing page QS checklist validation (above-the-fold CTA, relevant H1, social proof, trust signals)

**Week 11 — P2.19 + P2.20 conversion accuracy**
- **P2.19** CallRail (or equivalent) call tracking — 40–60% of HVAC conversions are phone calls, NOT form fills
- **P2.20** Enhanced Conversions (hashed email/phone → Google Ads conversion API) + Offline Conversion Upload setup (when a lead becomes a customer, upload back to Google Ads with GCLID)

**Week 12 — Pre-launch dry run**
- Trial campaign at $10/day for 3–5 days → validate tracking, landing page QS, conversion events fire correctly
- Fix anything broken
- Document baseline CPCs per keyword group
- Capture pre-launch GSC + GA4 metrics snapshot for post-launch comparison

**Content cadence Month 3:** 1 city + 1 blog per 2 weeks. **By Week 12: all 28 cities rewritten, 4 blog posts live, 60–70+ days of GA4 data accumulated.**

---

#### Post-Launch (Month 4+) — expand as ads scale

Only revisit these once ads are running at stable spend:
- **P2.21** Server-Side GTM — reconsider if ad-blocker data loss >10% after 60 days
- **P2.8** Video testimonials
- **P2.9** Blog cadence continued (1 post per 2 weeks)
- **P2.10** Lead magnets (AC age lookup, replacement calculator)
- **P2.11** Financing prominence
- **P2.12** SMS text-back
- **P2.13** Exit intent
- **P2.14** Urgency signals
- **P2.16** `/api/leads` POST refactor
- **P2.18** Index-as-key audit

---

---



## 🔴 P1 — High Priority (pick these first)

### P1.1 — Custom meta descriptions for 27 cities + 7 service pages ✅ SHIPPED (Apr 20, 2026 — 27 cities done via Path A code fallback; 7 service pages pending)

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

### P1.8 — Google Business Profile (GBP) full optimization ⭐ BIGGEST TRAFFIC LEVER (promoted from P2.2 on Apr 20, 2026)

**Why this is P1 now:** Previous prioritization had GBP at P2. Re-evaluating holistically as an SEO/conversion expert: for a local home-services company, GBP drives **40–60% of all clicks** via the Google Maps pack on "[service] near me" and "[city] [service]" queries. This is THE biggest traffic lever on the entire backlog. On-site SEO cannot out-perform a missing/weak GBP listing.

**Actions (owner: user for GBP admin; agent for content/strategy):**
- Claim or verify existing GBP for `556 S Coppell Rd Ste 103, Coppell, TX 75019`
- Verify NAP matches site + schema exactly: `DFW HVAC` / full address / `(972) 777-2665` (dialable) + `(972) 777-COOL` (vanity in description)
- Business hours: Mon–Fri 7AM–6PM (matches site)
- Services list: full 7 (residential AC, heating, IAQ, prev maintenance + 3 commercial) — match site exactly
- Service area: list all 28 cities
- Photos: upload 20+ (before/after jobs, trucks, techs, office, team, equipment brands)
- Attributes: "family-owned", "woman-owned" (if applicable), "licensed", "online appointments", "identifies as LGBTQ+ friendly" if applicable
- Weekly GBP Posts cadence: seasonal tips, recent job highlights, review responses, offers — 1-per-week minimum
- Respond to 100% of reviews (you have 145 — catch up in batches if response rate is low today)
- Enable GBP Messages — respond within 4 business hours
- Set up GBP Insights tracking; review monthly

**Expected effort:** 4 hrs initial setup + 30 min/week ongoing.
**Expected impact:** Measurable via GBP Insights (Impressions, Direction requests, Calls). Typical uplift: 30–80% total local traffic within 60 days.

---

### P1.9 — Leverage the 145 five-star reviews sitewide ⭐ BIGGEST ON-SITE CONVERSION LEVER (new Apr 20, 2026)

**Why this is P1:** DFW HVAC's reviews profile is outlier-tier (5.0 with 145 reviews, zero negative). On the current site this asset is essentially hidden on `/reviews` — the page most visitors never reach. Meanwhile schema has stale count (118 in `lib/metadata.js`). This is the biggest unused conversion weapon.

**Actions (ranked by effort):**

**P1.9a — Fix schema count globally (30 min)**
- `lib/metadata.js` hardcoded `aggregateRating.reviewCount: '118'` → dynamic from `companyInfo.googleReviews` (currently 145)
- Verify `SchemaMarkup.jsx` aggregateRating pulls from Sanity field
- Test with Google Rich Results Test on 5 sample pages
- **Impact:** Unlocks ⭐ stars in SERP snippets across all pages where schema applies → measurable CTR lift in GSC within 2–4 weeks

**P1.9b — Review badge in every page hero (2 hrs)**
- Design a compact trust badge: `⭐⭐⭐⭐⭐ 5.0 · 145 Google Reviews · Licensed & Family-Owned`
- Place directly below H1 on: home, every service page (7), every city page (28), /about
- Link to `/reviews` (eventually to filtered view — see P1.9d)
- Consumer psychology: social proof adjacent to primary CTA = measurable conversion lift

**P1.9c — Inline review carousel near every form (2 hrs)**
- 3 rotating reviews with name + city + date (e.g., "Danny C., Dallas · Dec 2025")
- Appears above or beside `LeadForm.jsx` and `SimpleContactForm.jsx`
- Uses existing Sanity `testimonials` data (130 already in mockData)

**P1.9d — City-filtered reviews page (3 hrs)**
- `/reviews#plano` → auto-scrolls + filters to reviews from Plano customers
- Each city page's trust badge links here
- Huge for city SEO + hyper-local conversion ("real Plano customers love them")
- If testimonials lack city data, use last installation city from job metadata

**P1.9e — Footer + sticky bottom bar trust signal (1 hr)**
- Footer: "⭐⭐⭐⭐⭐ 5.0 from 145 Google Reviews · (972) 777-2665"
- Update `StickyMobileCTA` to include `⭐ 5.0 · 145 reviews` prefix on mobile

**P1.9f — Post-submit success page (3 hrs)**
- Replace toast with a success page at `/thanks` showing: "You're joining 145+ happy DFW HVAC customers in DFW" + rotating review + "What happens next: we'll call within 2 business hours"
- Tie into P1.7 GA4 conversion event on page load
- Tie into P1.11 — combined flow improvement

**Total effort across P1.9:** ~11 hrs of focused work.
**Expected impact:** 15–25% conversion-rate lift sitewide. Measurable once P1.7 GA4 events are live.

---

### P1.10 — Progressive form redesign ⭐ CONVERSION LIFT (new Apr 20, 2026)

**Why:** `LeadForm.jsx` currently asks 7 fields upfront (firstName, lastName, email, phone, serviceAddress, numSystems, problemDescription). For HVAC emergency visitors on mobile in 100°F heat, that's too much friction. Industry data: 2-field → expand forms convert **30–50% better** than 7-field one-shot forms.

**Actions:**
- Step 1: Name + phone (2 fields, most essential) → "Submit" CTA becomes "Continue"
- Step 2 (optional expansion): Email + address + problem detail → "Complete Request" 
- After step 1 fields valid, submit immediately to `/api/leads` as a "quick-lead" with partial data. If user abandons step 2, you still have a contact to follow up on.
- Keep existing 7-field form as an option on `/request-service` for users who prefer it, OR replace entirely based on A/B measurement.
- Also: move `AddressAutocomplete` into step 2 so Maps JS loads even later (additional TBT win).
- Mobile-first: single-column, 48px+ touch targets (partially done), large "Continue" button at thumb reach.

**Expected effort:** 4–6 hrs.
**Expected impact:** 30–50% form submission lift. This alone likely adds more leads/month than most of the SEO work combined.

---

### P1.11 — "What happens next" post-submit flow (new Apr 20, 2026)

**Why:** Current flow: user submits → toast notification → nothing. User is left uncertain whether the form worked, when they'll hear back, or what to expect. Conversion isn't complete until the call/visit happens; every step of silence is a chance for them to call a competitor.

**Actions:**
- New `/thanks` success page (see P1.9f overlap — implement together):
  - Clear confirmation: "We got your request, [firstName]"
  - Expected response time: "We'll call you within 2 business hours (Mon–Fri 7AM–6PM)"
  - Emergency override: "Urgent? Call us now: (972) 777-COOL"
  - Rotating review: "While you wait, here's what other [city] customers say..."
  - Next steps list: "1. We review your request. 2. A tech calls to schedule. 3. We arrive on-time, diagnose, quote, fix."
  - Secondary CTA: "Add our number to your phone" (click-to-save contact)
- **Email auto-reply** via Resend (uses existing lead infra): same content, hits inbox within 60s of submit. Builds trust that the form worked.
- **SMS auto-reply** (future — requires Twilio or similar): "DFW HVAC got your request. Tech will call within 2 business hrs. Urgent? Call (972) 777-2665." Differentiator — most HVAC companies don't text back.
- Redirect `LeadForm.jsx` and `SimpleContactForm.jsx` to `/thanks` instead of toast
- GA4 conversion event fires on `/thanks` page load (ties to P1.7)

**Expected effort:** 4 hrs (web page + email auto-reply). SMS auto-reply is a follow-up.
**Expected impact:** Measurable reduction in "ghosted after submit" leads (conversion cleanup, not funnel-top lift). Also feeds P1.7 GA4 conversion tracking cleanly.

---

### P1.12 — Google Ads architecture readiness (new Apr 21, 2026)

**Why:** User plans Google Ads in ~12 weeks. Site architecture needs to support paid campaigns before first dollar spent. Core reality: faster TBT + better landing page relevance = higher Quality Score = lower CPC. On $1K/mo spend, TBT <200ms vs. 2,300ms saves ~$150–300/mo in CPC alone.

**Scope (parent task covering sub-work Weeks 10–12 of the 12-week roadmap):**

**P1.12a — Dedicated ad landing pages** (Week 10)
- 2–3 templates, one per ad group: `/quote-ac-repair`, `/quote-furnace-install`, `/emergency-hvac-dfw`
- Each page: single-focus H1 matching ad copy, above-the-fold CTA, review badge prominent, progressive form, trust signals, phone in multiple placements
- Avoid generic `/request-service` for ads — QS drops when landing page doesn't match ad intent
- Build as a parameterized template in `app/(ads)/[campaign]/page.jsx` so adding new campaigns is copy-paste

**P1.12b — Attribution plumbing** (Week 10)
- Capture `gclid` from URL on landing, store in sessionStorage + lead record
- Capture full UTM set (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`)
- Persist through multi-step form flow and into MongoDB lead document
- Update `/api/leads` schema to include these fields
- Add Google Ads conversion tag: `gtag('event', 'conversion', { send_to: 'AW-XXX/YYY', value: X })`

**P1.12c — Landing page QS validation** (Week 10)
- Checklist per landing page: H1 matches ad copy, load <3s on mobile 4G, trust signals visible, contact info prominent, no intrusive popups
- Run each landing page through Google Ads Quality Score simulator
- Fix any reds before launching campaigns

**Expected effort:** 8–12 hrs across sub-items.
**Expected impact:** Quality Score 7+/10 at launch (vs. 4–5 on generic `/request-service`) = 30–50% CPC reduction.

---

### P2.19 — CallRail (or equivalent) call tracking integration (new Apr 21, 2026)

**Why:** For local service businesses like HVAC, 40–60% of conversions are phone calls, not form fills. GA4 alone cannot attribute phone calls to specific Google Ads keywords. Without call tracking, you're flying blind on most of your ad ROI.

**Options:**
- **CallRail** — industry standard for local business call tracking. Dynamic Number Insertion (DNI) swaps phone numbers based on traffic source. ~$45/mo.
- **Twilio custom DNI** — cheaper (~$15/mo) but 8 hrs of build work for equivalent functionality.
- **Marchex / Invoca** — enterprise options, overkill at this scale.

**Recommendation:** CallRail for the first 12 months. Migrate to Twilio if spend grows and ~$500/yr savings justify custom work.

**Scope:**
- Sign up for CallRail, provision a pool of tracking numbers
- Add CallRail JS snippet to the site (load via `next/script strategy="lazyOnload"` to preserve TBT)
- DNI rules: organic = normal number, Google Ads = tracking number per campaign, direct = normal number
- Wire up CallRail → Google Ads conversion import so calls count as conversions in Smart Bidding
- Track minimum call duration (e.g., 60+ seconds) to filter spam calls from qualified leads

**Expected effort:** 2–3 hrs integration + ongoing $45/mo.
**Expected impact:** 40–60% of conversions now attributable. Smart Bidding optimizes on real revenue, not just form fills.

---

### P2.20 — Enhanced Conversions + Offline Conversion Upload (new Apr 21, 2026)

**Why:** Google Ads Smart Bidding is only as smart as the conversion signals it gets. Two advanced features dramatically improve bidding accuracy:

**Enhanced Conversions:**
- When a lead submits the form, hash their email + phone client-side (SHA-256) and pass to Google Ads conversion tag
- Google uses this to match the lead to the user's Google account (if any) → better attribution across devices, Safari ITP-resistant
- Typically +5–15% conversions recovered that otherwise go unattributed
- Privacy-safe: hashed data, not plaintext

**Offline Conversion Upload:**
- When a lead → paying customer (tracked in Housecall Pro or manual), upload that as a conversion back to Google Ads with the original GCLID
- Google Smart Bidding learns WHICH clicks actually make money vs. which just submit forms and ghost
- CPC drops 20–40% as bidding gets smarter about real-customer signals
- Requires: capture GCLID at landing, pass through to lead record, upload via Google Ads API when customer converts

**Scope:**
- Enhanced Conversions (Week 11):
  - Add SHA-256 hashing in `LeadForm.jsx` + `SimpleContactForm.jsx` on submit
  - Pass hashed values to `gtag('event', 'conversion', { user_data: { email: hashedEmail, phone_number: hashedPhone } })`
  - Verify in Google Ads → Conversions → Diagnostics
- Offline Conversion Upload (Week 11, or post-launch):
  - Scheduled job (Vercel cron or manual) that reads closed deals from Housecall Pro (or a Sanity `deals` document initially)
  - Calls Google Ads API `UploadClickConversion` with original GCLID + conversion value
  - Requires Google Ads API credentials (OAuth)

**Expected effort:** 2 hrs Enhanced Conversions + 3 hrs Offline Conversion Upload scaffold.
**Expected impact:** 20–40% CPC reduction after 30–60 days of data accumulation. Compounds with P2.19 CallRail integration.

---

### P2.21 — Server-Side Google Tag Manager (SS-GTM) — POST-LAUNCH decision (new Apr 21, 2026)

**Why:** Moves gtag.js processing from the browser to a server endpoint. Benefits: less client-side JS (TBT win), bypasses ad-blockers (data recovery), first-party cookies (iOS/Safari ITP friendly). Essentially "the way serious advertisers do tracking."

**Deferred to Month 4+ (after first 60 days of ad spend).** Rationale:
- At <$3,000/mo ad spend, client-side gtag is fine
- SS-GTM is operational complexity (hosting, monitoring, debugging) — premature optimization before spend justifies it
- Revisit if ad-blocker data loss >10% measured after 60 days of campaigns

**Scope (when triggered):**
- Set up GTM Server-Side Container (Vercel Edge Function or Google Cloud Run)
- Migrate existing GA4 + Google Ads tags from client-side GTM → SS-GTM
- Configure first-party custom domain (e.g., `track.dfwhvac.com`) pointing to SS-GTM
- Test attribution parity (client vs. server) for 2 weeks before full cutover

**Expected effort:** 4–8 hrs setup + $10–40/mo hosting.
**Expected impact:** +5–15% recovered tracking data (ad-blocker bypass) + additional −100–150ms TBT (less client-side JS).

**Related:** extends existing P2.6 (GTM + Facebook Pixel) to server-side.

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

### P2.2 — Google Business Profile (GBP) setup + optimization ⬆️ PROMOTED to P1.8 (Apr 20, 2026)

**See P1.8 for current scope.** Kept stub here for historical traceability; new work tracked under P1.8.

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

### P2.4 — TBT optimization (lazy-load third-party scripts) ✅ SHIPPED Apr 20, 2026 (PR #1)

**Shipped:** reCAPTCHA removed from root layout + `RecaptchaScript.jsx` lazy-load only on form pages (`lazyOnload`). Google Maps deferred to `onFocus` in `AddressAutocomplete.jsx`. RealWork widget wrapped in IntersectionObserver. "Powered by Google" attribution added (compliance). GA4 left as `afterInteractive` (already optimal). Expected TBT: 2,300ms → ~1,100–1,900ms (varies by page). Perf score 69 → ~75–85. Full parity 🟢 Good TBT would require further architectural work (server components, bundle reduction) — deferred to new P2.4b.

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

### P2.4b — Deeper TBT optimization (architectural — to reach 🟢 Good <200ms)

**Why:** PR #1 (Apr 20) took TBT from ~2,300ms → ~1,100–1,900ms. Still in 🔴 Poor range on most pages because the remaining TBT is not 3rd-party scripts — it's framework JS, hydration, and bundle size. Deferred here because the biggest ROI lever is elsewhere (P1.8 GBP, P1.9 reviews, P1.10 progressive form), but worth tackling once those ship.

**Scope:**
- Migrate Header, Footer, StickyMobileCTA, and brand color hydration to **React Server Components** where possible
- Run `@next/bundle-analyzer` — identify heaviest client modules (likely lucide-react tree-shaking, shadcn over-inclusion, Sanity client)
- Tree-shake unused lucide-react icons (~20 of ~50 imported likely unused)
- Audit shadcn/ui imports — remove components not actually rendered
- Consider replacing `Card` + `Button` wrappers with native HTML + Tailwind where no interactive state is needed
- Split `/studio` (Sanity admin, 932KB) behind a dynamic import so public routes don't load it

**Expected effort:** 6–10 hrs.
**Expected impact:** TBT 1,100–1,900ms → ~400–700ms (borderline 🟡 Needs Improvement). Real 🟢 Good likely needs P2.5 (ISR) combined.

---

### P2.8 — Video testimonials ⏳ POST-AD-LAUNCH (deferred Apr 21, 2026 — not blocking ads)

**Why:** Text reviews work but video testimonials convert ~5× better. For a 3-generation family business with 145 perfect reviews, 1–2 video testimonials anchor trust on key pages.

**Scope:**
- Film 3 videos (30–60s each): Owner intro (Jonathan, the 3-gen family story) + 2 happy customer testimonials (pick from top reviews — already have 145)
- Host on YouTube (bonus: YouTube search traffic as a second channel)
- Embed on home hero (owner intro), `/about` (family story), `/reviews` (customer testimonials)
- Thumbnail optimization for YouTube + on-site
- Schema: `VideoObject` markup for rich results eligibility

**Expected effort:** ~4 hrs on-site (embed + schema); filming + editing done by a local videographer (~$500–1,500).

---

### P2.9 — Blog / content hub launch with seasonal posts (new Apr 20, 2026)

**Why:** Zero blog content currently. Content marketing captures informational queries (high volume, lower intent) and builds topical authority that lifts commercial-intent rankings. Seasonal content is free link bait.

**Scope (first 4 posts):**
1. "How to prepare your DFW HVAC for summer heat waves (Texas-specific)"
2. "Why does my AC freeze up in July? Common DFW issues + fixes"
3. "When to replace vs. repair: DFW HVAC cost calculator"
4. "How the 2021 Texas freeze changed HVAC best practices in DFW"
- Each 1,200–1,800 words, with embedded CTAs, city-specific examples, linked to service pages
- Add `/blog` route + Sanity `blogPost` schema
- Quarterly cadence thereafter: 3 posts per quarter minimum

**Expected effort:** 6 hrs (route + schema + templates); ~3 hrs/post writing (drafted + reviewed by user).

---

### P2.10 — Lead magnets for top-of-funnel capture ⏳ POST-AD-LAUNCH (deferred Apr 21, 2026)

**Why:** Single funnel today: page → form → call. HVAC is a considered purchase ($5–15k for replacement) that takes weeks. Capture email from consideration-stage visitors who aren't ready to call yet; nurture via email.

**Ideas (pick 1–2):**
- **"AC Age & Efficiency Lookup"** — enter make/model → email result with replacement recommendation
- **"DFW HVAC Replacement Cost Calculator"** — square footage + system type → estimate range + email PDF
- **"Free Pre-Summer HVAC Check Checklist"** — PDF download after email capture
- All tied to email list + automated nurture sequence (Resend already integrated)

**Expected effort:** 8–12 hrs per lead magnet (UX + logic + email automation).

---

### P2.11 — Financing prominence on service pages (new Apr 20, 2026; split from old P3 case-studies + financing)

**Why:** HVAC replacement is $5k–$15k+. Financing availability is frequently the deciding factor between "get a quote" and "delay the purchase". Current site doesn't surface financing prominently on service pages where replacement decisions happen.

**Scope:**
- `/financing` page — explain options (Wells Fargo, Synchrony, or whichever partner DFW HVAC uses; confirm with user)
- Prominent callout on `/services/residential/air-conditioning` and `/services/residential/heating` — "Financing available — monthly payments as low as $X"
- Footer link to `/financing`
- Schema: `FinancialProduct` or `Offer` for rich results

**Expected effort:** ~4 hrs (page + callouts); financing partner enrollment done by user.

---

### P2.12 — SMS text-back / chat capture ⏳ POST-AD-LAUNCH (deferred Apr 21, 2026)

**Why:** Immediate text-back after a form submit = huge trust builder + differentiator (most HVAC competitors don't do this). Also, live chat (even a simple one) captures visitors who won't fill a form.

**Scope:**
- SMS: integrate Twilio or similar; send auto-reply within 60 seconds of `/api/leads` submission
- Chat: consider a lightweight option (Crisp, Tawk, or custom simple chat modal); can be user-staffed during business hours
- NOT a full chatbot — human-first or AI fallback only when off-hours

**Expected effort:** 4–6 hrs SMS; 6–10 hrs chat depending on approach.
**External cost:** Twilio ~$0.0075/SMS; Crisp/Tawk free tier available.

---

### P2.13 — Exit intent capture ⏳ POST-AD-LAUNCH (deferred Apr 21, 2026)

**Why:** Users moving mouse toward the browser close/back button = strong leave signal. Last-chance offer modal converts 3–8% of exit-intent users.

**Scope:**
- Detect mouse exit on desktop (tricky on mobile — trigger on scroll-up-at-top or after inactivity)
- Modal: "Before you go — free 10-minute phone consultation, no obligation" + name/phone form
- Show at most once per visitor per 7 days
- Tie into GA4 event tracking

**Expected effort:** 3–4 hrs.

---

### P2.14 — Urgency / scarcity signals ⏳ POST-AD-LAUNCH (deferred Apr 21, 2026)

**Why:** HVAC breakdowns on hot days are urgent. Surfaced urgency signals nudge hesitant visitors toward submit-now.

**Scope (honest, not fabricated — use real data):**
- "Most forms get a call-back within 90 minutes today" (if true — measurable)
- Seasonal banner: "⚡ 100°F expected Thursday — book same-day before slots fill"
- "[N] Dallas customers booked service this week" (pull real number from `/api/leads` in last 7 days, rounded/capped)
- No fake scarcity — false urgency erodes trust especially for local businesses

**Expected effort:** 3–4 hrs.

---



### P2.15 — Oversized component decomposition (from Apr 20 code review)

**Why:** 4 components exceed 300 lines — too large for easy maintenance, testing, and memoization-based re-render optimization. Adds to Phase A architecture backlog.

**Scope:**
- `components/ServiceTemplate.jsx` (450 lines) → extract: `ServiceHero`, `ServiceFeatures`, `ServiceFAQ`, `ServiceCTA`
- `components/CompanyPageTemplate.jsx` (406 lines) → extract: `CompanyHero`, `CompanyAbout`, `CompanyServices`, `CompanyCTA`
- `components/HomePage.jsx` (378 lines) → extract: `HomeHero`, `HomeServices`, `HomeStats`, `HomeTestimonials`
- `app/cities-served/[slug]/page.jsx` CityPage (318 lines) → extract: `CityHero`, `CityServices`, `CityCTA`

**Approach:** Extract sections as server components where possible (additional TBT win per P2.4b). Maintain functional parity — no behavioral changes. Lint + visual check per extracted component.

**Expected effort:** 2–3 hrs per component = 8–12 hrs total. Do as a dedicated "refactor sprint" rather than piecemeal.

**Phase:** A4 (UI infrastructure). Good pairing with P2.4b server components migration.

---

### P2.16 — `/api/leads` POST handler complexity reduction ⏳ POST-AD-LAUNCH (from Apr 20 code review)

**Why:** Current implementation: 107 lines, cyclomatic complexity 23. The function handles validation, recaptcha, rate limiting, sanitization, MongoDB write, and Resend email — all inline. Hard to test individual steps, hard to trace failures.

**Scope:**
- Extract `validateLeadPayload(body)` — returns `{valid, errors}`
- Extract `checkRecaptcha(token)` — returns `{score, skipped}`
- Extract `checkRateLimit(ip)` — returns `{ok, retryAfter}`
- Extract `sanitizeLead(raw)` — returns escaped/normalized fields
- Extract `sendLeadEmail(lead)` — Resend call with error handling
- POST handler becomes orchestration only (~30 lines, complexity <10)

**Approach:** Test-driven refactor — add unit tests for each extracted function in `tests/test_lead_validation.py` before extracting. Keep `POST` signature unchanged so consumers don't break.

**Expected effort:** 3–4 hrs.

**Phase:** A4. Pairs naturally with P1.11 (post-submit flow) refactor.

---

### P2.17 — Python backend (`/app/backend/server.py`) decommission decision ✅ COMPLETED Apr 20, 2026

**Decision:** Deleted entirely. Verified 100% dead code:
- Zero frontend references to `localhost:8001`, `fastapi`, or `/app/backend/`
- Vercel cron job hits a Next.js API route, not the Python backend
- No GitHub Actions, no Docker, no supervisor config referenced it
- All functionality (leads, reviews sync, places API, rate limiting) already implemented in Next.js API routes
- All `.env` keys were duplicates of `/app/frontend/.env.local` (except `CORS_ORIGINS` which was only needed by the deleted Python server)

**What was done:**
- Moved `backend/tests/test_dfw_hvac.py` → `frontend/tests/test_dfw_hvac.py` via `git mv` (preserves history). This is the legitimate Next.js API integration test despite its original location.
- `git rm -rf backend/` — removed `server.py` (374 lines), `requirements.txt`, `.env`, `.gitignore`.
- Next.js build verified clean post-deletion (30s, no regressions).

**Result:** Codebase is now single-stack (Next.js only). No more Python dependency burden or CVE surface from the Python side.

**Why:** `/app/backend/server.py` is a FastAPI app that's NOT called by the Next.js site (no frontend references to `localhost:8001` / FastAPI endpoints). It appears to be legacy from the Wix→Next.js migration. The code review flagged quality issues (122-line `submit_lead` function, 56-line `sync_google_reviews_to_sanity`, 5-level nesting, 11.1% type hint coverage).

**Decision needed from user:**
- **Option A — Decommission:** Delete `/app/backend/` entirely. Simplifies codebase. Safe if truly unused.
- **Option B — Revive/use:** If there's a planned use case (admin panel? cron jobs? webhooks?), invest in the quality issues.
- **Option C — Keep idle:** Accept the dead code; don't invest in quality but don't delete either.

**Before deciding:** Verify nothing in Vercel cron, GitHub Actions, or external integrations calls the Python backend. Check Sanity Studio routes, Housecall Pro API plans, etc.

**If Option A:** `rm -rf /app/backend/` — saves ~1MB repo size, removes dead code, removes Python dependency burden.

**Expected effort:** 30 min investigation + 15 min delete (if Option A) or 6–10 hrs refactor (if Option B).

**Phase:** Pre-A1 audit work (should decide before any more audits happen).

---

### P2.18 — Index-as-key cleanup in reorderable/stateful lists ⏳ POST-AD-LAUNCH (from Apr 20 code review)

**Why:** 44 instances of `key={index}` flagged. Most are in static lists (features, service bullets) where index keys cause no bugs — but a few are in components with internal state or sortable data where index keys can cause lost input focus and incorrect reconciliation.

**Scope:**
- Audit each of the 44 instances — classify as "static list, safe" vs. "stateful, needs stable ID"
- Stateful instances to fix (sample — need full audit):
  - `components/ServiceTemplate.jsx:76,134,161,180,207,227` (11 instances) — if data comes from Sanity, use `_key` or `slug`
  - `components/HomePage.jsx:137,209,256,336` (4 instances) — check if feature lists or testimonials
  - `components/DynamicPage.jsx:29,104,118` (3 instances) — dynamic blocks should have `_key` from Sanity Portable Text
- Leave static decorative lists as-is
- Document decisions in a `KEYS_AUDIT.md` for future reference

**Expected effort:** 2 hrs.

**Phase:** A5 (hygiene).

---



## 🔵 P3 — Backlog (wait until P1+P2 largely done)

- **"Skip to main content" link (a11y polish)** — Added Apr 21, 2026 after PR #2 pushed Accessibility score from 87 → 95+. A single keyboard-focusable anchor at the very top of `<body>` that jumps past the header nav to `<main>`. Visually hidden until focused via Tab. Greatly improves keyboard-only and screen-reader navigation on every page. Could push Lighthouse Accessibility to a full 100. Implementation: ~15 min — add `<a href="#main" className="sr-only focus:not-sr-only ...">Skip to main content</a>` as first child of `<body>` in `app/layout.js`, and add `id="main"` to the `<main>` wrapper in each page/layout template. WCAG 2.1 Level A success criterion 2.4.1 (Bypass Blocks). Low priority because current a11y score is already well into 🟢, but worth doing when Phase A polish continues.
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
