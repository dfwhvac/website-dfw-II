# DFW HVAC — Roadmap

**Last reviewed:** April 24, 2026
**⚠️ Read `/app/memory/00_START_HERE.md` first for the Agent SOP.**

This file contains ONLY future-facing work. Shipped items live in `/app/memory/CHANGELOG.md`.

---

## 🧪 Sandbox Workflow (adopted Apr 24, 2026)

**Default for all new pages and non-trivial UI changes:** build on a feature branch → Vercel Preview Deployment → user QA on phone + desktop + Lighthouse → merge to `main` for production.

| Guardrail | Status | Ref |
|---|---|---|
| GA4 preview-env mute (no hits to `G-5MX2NE7C73` from preview URLs) | ✅ Shipped Apr 24, 2026 | `app/layout.js` `ga-preview-guard` |
| Resend preview-env mute (no real emails from preview lead submissions) | ✅ Shipped Apr 24, 2026 | `app/api/leads/route.js` `SHOULD_SEND_LEAD_EMAIL` |
| Vercel auto-`noindex` on preview URLs | ✅ Vercel default | No code required |
| Sanity dataset isolation (preview vs. production content) | ⏸️ Not needed yet — would be Option 3 | Deferred until content-experiment pain emerges |

**Escape hatch:** set `FORCE_LEAD_EMAIL_IN_PREVIEW=true` in a Vercel preview env to force real email send (useful for end-to-end email template QA).

**First sandbox build:** P1.16 `/financing` page (branch `preview`, deployed Apr 24, 2026 — awaiting user QA before merge to `main`).

---

## ⏭️ Queued Merge + Post-Merge Actions (Apr 24, 2026 preview stack)

The `preview` branch carries 5 stacked Apr 24 shipments: preview-env guards + `/financing` + FAQ rp3 rewrite + `/services/system-replacement` + `/repair-or-replace`. Remaining user-led sequence once the user pushes to GitHub:

- **M1 — Sandbox QA on the Vercel preview URL (~10 min)**
  - Test `/services/system-replacement`, `/repair-or-replace`, `/financing` — visual + CTA routing
  - Confirm `/installation` returns HTTP 308 → `/services/system-replacement`
  - Confirm footer shows "System Replacement" (Our Services) and "Repair or Replace?" (Quick Links) sitewide
  - Confirm FAQ rp3 ("Do you offer financing for new HVAC systems?") renders Wisetack copy + "Learn more about our financing options →" internal link
  - Confirm "Pre-Qualify Now" on `/financing` routes to the live Wisetack URL (since `NEXT_PUBLIC_WISETACK_APPLY_URL` was set in Vercel env on Apr 24)

- **M2 — Google Rich Results validation on `/repair-or-replace` (~5 min, user-led)**
  - [search.google.com/test/rich-results](https://search.google.com/test/rich-results) → paste the preview URL
  - Verify eligibility for both `Article` schema and `FAQPage` schema. AEO citation in AI Overviews depends on both being valid.
  - If validation fails, escalate back to agent for schema fix before merge.

- **M3 — Merge `preview` → `main` (~2 min)**
  - One merge ships all 5 Apr 24 changes to production simultaneously.
  - Vercel auto-builds and deploys to dfwhvac.com.

- **M4 — GSC URL Inspector submissions for the 4 new URLs (~3 min, user-led)** — queued for Day 4 of P1.17a sprint
  - `/financing`, `/services/system-replacement`, `/repair-or-replace`, `/replacement-estimator`
  - Slot in alongside the 5 Day-4 leftovers (the-colony, lake-dallas, haslet, roanoke, privacy-policy) — total 9 URLs, fits comfortably under the 10/day cap.
  - **Submit AFTER `preview → main` merge completes and Vercel finishes propagating** (~5 min after merge); URL Inspector won't find them otherwise.
  - Tracked in `/app/memory/audits/2026-04-23_GSC_Indexing_Tracker.md` Day 4 section.

- **M5 — Log Apr 24 baseline in CHANGELOG (~automatic via agent)**
  - Agent marks P1.13, P1.14, P1.15, P1.16 as ✅ in production the next session after merge is confirmed.

- **M6 — Header nav reorg** ✅ SHIPPED Apr 27, 2026 (`components/Header.jsx`)
  - Residential Services dropdown reorganized into two sections with headers + divider: "Services" (AC, Heating, Preventative Maintenance, IAQ) above, "Planning to Replace?" (System Replacement, Replacement Estimator, Repair or Replace?, Financing Options) below. Mobile menu mirrors the same grouping.
  - Live on preview URL; verified all 8 dropdown links return 200.

---

## 🟢 GSC Indexing Action Items (Apr 27, 2026 audit)

Authoritative source: `/app/memory/audits/2026-04-27_Site_Indexing_Audit.md`. Headline: **42 of 47 sitemap URLs indexed (89.4%); 44 effective (93.6%) per live URL Inspection.**

### A1 — Submit `the-colony` to GSC (P1, ~30 sec, user-led)
- **URL:** `https://dfwhvac.com/cities-served/the-colony`
- **Bucket:** Discovered – currently not indexed (last_crawled: never)
- **Action:** GSC → URL Inspection → paste URL → Request Indexing
- **Why:** Last remaining un-submitted city page in the Day-4 backlog. Small market but completes geographic coverage for ad-targeting purposes.
- **Status:** ⏳ Pending user

### A2 — Submit `commercial-heating` to GSC (P1, ~30 sec, user-led)
- **URL:** `https://dfwhvac.com/services/commercial/commercial-heating`
- **Bucket:** Crawled – currently not indexed (Validation FAILED Apr 24)
- **Action:** GSC → URL Inspection → paste URL → Request Indexing
- **Why:** Google explicitly rejected this page on Apr 24 validation. A re-submit may push it through, but the long-term fix is content differentiation (see A4 below).
- **Status:** ⏳ Pending user

### A3 — May 5, 2026 indexing audit re-run (P1, ~10 min, agent-led)
- **What:** Re-export the 6 GSC Pages reports (Indexed + 5 not-indexed buckets), diff against the Apr 27 baseline, update `/app/memory/audits/2026-04-27_Site_Indexing_Audit.md` (or create `2026-05-05_Site_Indexing_Audit.md` if material changes).
- **Expected deltas:**
  - Indexed: 50 → 54+ (Apr 24 stack lands once `preview → main` merges)
  - Discovered – not indexed: 4 → 0–1 (haslet, the-colony, AC, IAQ should all clear)
  - Crawled – not indexed: 2 → 0–1 (`/aboutus` should reclassify to Page-with-redirect; `commercial-heating` may stick if A4 not yet shipped)
  - Page with redirect: 3 → 11+ (legacy www-prefixed Wix URLs reclassify here as Google recrawls them)
- **Status:** 📅 Calendar reminder for May 5
- **Inputs needed:** User exports the 6 reports (Indexed Table + 5 bucket Drilldowns) → uploads to chat → agent runs diff script.

### A4 — Internal-linking audit + content differentiation for `commercial-heating` (P1, ~45 min, agent-led)
- **Why:** Only sitemap page Google explicitly rejected as "not worth indexing." Likely too template-similar to `/services/commercial/commercial-air-conditioning` for Google's quality model.
- **Scope:**
  - **Content:** Audit `commercial-heating` body copy vs. `commercial-ac`. If >70% structural overlap, add 200–300 words of heating-specific content (boiler vs. furnace decision tree, commercial-grade BTU sizing, after-hours emergency tier-pricing).
  - **Internal links:** Add inbound links from FAQ, `/services`, the City pages' "commercial services available" CTA, and `/repair-or-replace` (once that's merged).
  - Tied to broader **P1.17c (internal-linking audit on stuck URLs)** — execute as one combined sweep.
- **Status:** 📋 Queued; recommend executing post `preview → main` merge so we can include cross-links from the 4 new Apr 24 pages in the same pass.

---

## 🎯 Prime Directive

**Business goal:** Pull high-intent local traffic → convert into form fills / phone calls.

**Strategic asset:** **145 five-star Google reviews, zero negative.** Outlier-tier social proof. Must be pervasive sitewide, in schema markup, in SERP snippets, and weaponized at every conversion moment.

**Two pillars:**
1. **Traffic** — GBP + local SEO + city-specific content + review-signaled title tags
2. **Conversion** — review social proof sitewide + progressive forms + urgency signals + clear "what happens next" + financing visibility

**"Relevant" traffic:** purchase-intent + local. `"ac repair plano"`, `"hvac near me"`, `"emergency ac [city]"`. NOT `"how does HVAC work"`.

---

## 🗓️ 12-Week Ad Launch Roadmap

User plans Google Ads in ~12 weeks. Sequence architecture → content → data → ads-specific infra so Day 1 of spend hits an instrumented, <200ms TBT, content-rich site with 70+ days of GA4 baseline.

### Month 1 — Foundation + Measurement + GBP Head-Start (Weeks 1–4)

- **Week 1 — Sprint 1** ✅ SHIPPED Apr 21, 2026
- **Week 2 — Sprint 2a audits** ✅ SHIPPED Apr 21, 2026 (P1.2 technical audit, PR #3 closing R1.1/R1.2/R2.1)
- **Week 3 — Sprint 2b audits** 🟡 IN FLIGHT
  - **P1.6a** — Title tag audit + rewrite ✅ SHIPPED Apr 23, 2026 — all 47 titles live, Option C hybrid review-count logic, `fiveStarReviewCount` seeded at 150 in Sanity
  - **P1.13** — `/services/system-replacement` new page ✅ SHIPPED Apr 24, 2026 (on `preview` branch, stacked with P1.16)
  - **P1.14** — `/replacement-estimator` pricing tool ✅ SHIPPED Apr 24, 2026 (MVP scope: replacement-only, Option C hybrid, inline range display + soft opt-in). Pricing matrix uses conservative DFW placeholders; user to override via `/app/memory/ESTIMATOR_PRICING_SHEET_TEMPLATE.md`.
  - **P1.15** — `/repair-or-replace` AEO article ✅ SHIPPED Apr 24, 2026 (on `preview` branch, stacked with P1.16 + P1.13)
  - **P1.16** — `/financing` page ✅ SHIPPED Apr 24, 2026 (Wisetack partner, 0% for 24mo headline, `NEXT_PUBLIC_WISETACK_APPLY_URL` env var now set in Vercel)
  - **P1.6f** — Google Rich Results validation on the new JSON-LD schemas (user-led)
- **Week 4 — P1.8 GBP optimization kickoff**
  - Claim, verify NAP, upload 20+ photos, populate services + service area
  - Begin weekly GBP Posts cadence
  - Respond to all 145 reviews
- **Content cadence Month 1:** 1 city page body content rewrite per week (P1.6b)

### Month 2 — Architecture to <200ms TBT + Content Rhythm (Weeks 5–8)

- **Week 5 — Sprint 3a review leverage UI**
  - **P1.9b** Review badge component (every page hero, footer, sticky CTA)
  - **P1.9e** Footer + sticky bottom bar trust signals
- **Week 6 — Sprint 3b conversion UI**
  - **P1.10** Progressive form (2-field → expand, expected 30–50% form submit lift)
  - **P1.11 / P1.9f** `/thanks` success page + Resend email auto-reply
- **Week 7 — Sprint 4a TBT path to 🟢 Good**
  - **P2.4b** Bundle reduction (lucide-react tree-shake, unused Radix primitive removal) — now the next-biggest TBT lever since Apr 21 RSC batch covered ~60% of server-component work
  - **P2.15** Component decomposition (any templates still >300 lines)
- **Week 8 — Sprint 4b ISR + re-measure**
  - **P2.5** Sanity webhook ISR revalidation (eliminate `force-dynamic` on public routes)
  - **P2.4c** Lighthouse "all-green" verification — success = Perf 90+, TBT <200ms, TTI <3.8s, A11y 90+, BP 90+, SEO 100 on /cities-served/plano + /request-service
- **Content cadence Month 2:** 1 city + 1 blog post per week (P2.9 blog launch)

### Month 3 — Ad-Readiness Polish + Dry Run (Weeks 9–12)

- **Week 9 — Sprint 5 SEO polish**
  - **P1.4** Internal linking matrix (service ↔ city cross-links)
  - **P2.3** NAP consistency audit (Yelp, BBB, Angi, HomeAdvisor)
  - **P2.1** "50+ cities" copy cleanup (actual = 28)
- **Week 10 — P1.12 Google Ads architecture**
  - Dedicated ad landing pages (2–3 templates: `/quote-ac-repair`, `/quote-furnace-install`, `/emergency-hvac-dfw`)
  - GCLID + UTM capture + storage in MongoDB lead records
- **Week 11 — P2.19 + P2.20 conversion accuracy**
  - **P2.19** CallRail (or Twilio custom DNI) call tracking
  - **P2.20** Enhanced Conversions + Offline Conversion Upload
- **Week 12 — Pre-launch dry run**
  - $10/day trial campaign × 3–5 days → validate tracking, landing page QS, conversion events
  - Capture pre-launch GSC + GA4 snapshot
- **Content cadence Month 3:** 1 city + 1 blog per 2 weeks. By Week 12: all 28 cities rewritten, 4 blog posts live, 60–70+ days GA4 baseline.

### Post-Launch (Month 4+)

Only revisit once ads running at stable spend:
- **P2.21** Server-Side GTM — reconsider if ad-blocker data loss >10% after 60 days
- **P2.8** Video testimonials
- **P2.9** Blog cadence continued
- **P2.10** Lead magnets (AC age lookup, replacement calculator)
- **P2.11** Financing prominence
- **P2.12** SMS text-back
- **P2.13** Exit intent
- **P2.14** Urgency signals
- **P2.16** `/api/leads` POST refactor
- **P2.18** Index-as-key audit

---

## 🔴 P1 — High Priority

### P1.17 — GSC Indexing Recovery Sprint ⭐ NEW P0 — INDEXING RATE 57% → 80%+
- **Status:** Started Apr 23 — diagnosis complete, execution in progress.
- **Diagnosis:** GSC shows 27 of 47 sitemap URLs indexed (57%). The 34 "not indexed" URLs break down as: 27 "Discovered – currently not indexed" (all with **Last Crawled: N/A** — Google has NEVER crawled them), 3 "Page with redirect" (optimal — canonical variants), 2 "Crawled – currently not indexed" (1 legacy URL + 1 pre-push-snapshot), 1 "Excluded by noindex" (old Wix PDF, harmless), 1 "Not Found 404" (`/servicecall` legacy Wix URL). Root cause is **crawl budget, not content quality** — Google's bot hasn't gotten to the 27 discovered URLs yet after the Apr 21 burst added them to the queue.
- **Full list of 27 stuck URLs captured** in `/app/memory/audits/2026-04-23_GSC_Indexing_Diagnosis.md` (to be written next session). High-business-value entries: `/about`, `/reviews`, `/faq`, `/services/residential/air-conditioning`, `/services/residential/heating`, `/services/residential/indoor-air-quality`, `/services/commercial/commercial-air-conditioning`, `/services/commercial/commercial-heating`, plus 18 city pages including Frisco, Lewisville, Richardson, Irving, Mansfield, North Richland Hills.

**P1.17a — Manual indexing requests (user-led, ~90 min, 3-day cadence)** 🟡 IN PROGRESS
- Cap is ~10 requests/day per site. Spread 27 URLs across 3 days.
- Day 1 — high-value (10) ✅ SUBMITTED Apr 21, 2026: /, /services/residential/air-conditioning, /services/residential/heating, /request-service, /services/residential/indoor-air-quality, /services/residential/preventative-maintenance, /cities-served/coppell, /estimate, /cities-served/arlington, /contact
- Day 2 — high-value batch 2 (9) ✅ SUBMITTED Apr 23, 2026: /reviews, /about, /faq, /services/commercial/commercial-air-conditioning, /cities-served/frisco, /cities-served/lewisville, /cities-served/richardson, /cities-served/irving, /cities-served/mansfield
- Day 3 — mid-priority batch (10) ✅ SUBMITTED Apr 24, 2026: /services/commercial/commercial-heating, /cities-served/argyle, /recent-projects, /cities-served/north-richland-hills, /cities-served/hurst, /cities-served/carrollton, /cities-served/flower-mound, /cities-served/euless, /cities-served/bedford, /cities-served/colleyville. NOTE: `/cities-served/grapevine` from the Day 3 plan was already indexed → slot freed and used for Colleyville (promoted from Day 4).
- Day 4 — remaining (target 4/25/2026) — 9 URLs: 5 leftover (/cities-served/the-colony, /lake-dallas, /haslet, /roanoke, /privacy-policy) + 4 brand-new Apr 24 production URLs once `preview` merges to `main` (/services/system-replacement, /replacement-estimator, /repair-or-replace, /financing).
- Day 5–7 — spot-check batch (12 URLs): hubs (`/services`, `/cities-served`, `/terms-of-service`, `/services/commercial/commercial-maintenance`) + 8 high-volume cities (allen, dallas, denton, farmers-branch, fort-worth, keller, plano, southlake). Use URL Inspection only — submit only if result shows "URL is not on Google".
- **Running totals (as of 4/24):** 29 of 47 sitemap URLs submitted (62%); 2 confirmed-indexed without submission needed (lewisville 4/23, grapevine 4/24); 16 remaining (5 Day-4 leftovers + 4 brand-new + 7 spot-check work).
- **Tracker:** `/app/memory/audits/2026-04-23_GSC_Indexing_Tracker.md`
- **Expected outcome:** 60–80% of submitted URLs indexed within 7 days of request. Final aggregate target: 80%+ indexing rate (38–44 of 47 URLs).

**P1.17b — Crawl-budget lift (compounding signal upgrades)**
- **Tie into P1.8 GBP kickoff** — GBP verification alone typically doubles crawl rate in 60 days. Biggest single lever.
- **P2.3 NAP consistency audit → move up** — Yelp, BBB, Angi, HomeAdvisor, Nextdoor citations each feed a backlink and authority signal that Google uses to budget crawl.
- **Freeze sitemap submissions for 2–3 weeks** — repeated resubmission resets discovery queue. Let current push digest before adding P1.13–P1.16 pages.
- Server response already optimized (CWV 🟢); no action there.

**P1.17c — Internal linking audit on the 27 stuck URLs**
- For each un-crawled URL: verify ≥3 inbound internal links from established pages (home, services hub, cities hub, sibling pages).
- Expected finding: the Apr 21 PR #3 cross-linking grid already covers most cases; 2–3 outliers likely need reinforcement.
- **Effort:** 1–2 hrs scripted audit + spot fixes.

**P1.17d — Legacy Wix URL redirect + 410 fixes** ✅ **COMPLETED Apr 23, 2026**
- Confirmed bugs: `/aboutus` (404 — was legacy Wix `/aboutus`, should 301 → `/about`), `/servicecall` (404 — legacy Wix, should 301 → `/request-service`), `/_files/ugd/*` (Wix CDN phantom PDFs — should return 410 Gone to clear forever).
- **Resolution:** Single deploy covering all 20 legacy Wix URLs. See `/app/memory/audits/2026-04-23_Legacy_URL_Redirect_Map.md` for full mapping, verification log, and source data. `next.config.js` expanded with 5 new 301s (11 total); new `middleware.js` handles 410 Gone responses for non-applicable URLs + catch-all patterns (`/copy-of-*`, `/_files/ugd/*`, `/post/*`, `/blog/*`). All 18 curl verification tests passed.
- **TODO:** update `/installation` + `/ducting` 308 targets when P1.13 `/services/system-replacement` (or dedicated install/ducting pages) ship.

### P1.6a — Title tag audit + rewrite ✅ SHIPPED Apr 23, 2026
- **Delivered:** All 47 finalized titles live per `/app/memory/audits/2026-04-23_Title_Tag_Final.csv`. Option C hybrid review-count logic (rating ≥ 4.95 → live `googleReviews`; else → Sanity `fiveStarReviewCount`; else → no badge). `fiveStarReviewCount` seeded at 150.
- **Key helpers:** `lib/metadata.js::getReviewBadgeCount()`, `lib/metadata.js::buildTitleWithBadge()`. Title-prefix maps live inside `app/services/[category]/[slug]/page.jsx` (SERVICE_TITLE_PREFIX) and `app/cities-served/[slug]/page.jsx` (CITY_PREFIX_OVERRIDES + dallas/north-richland-hills brand-drop exceptions).
- **Follow-up:** Quarterly GSC CTR review scheduled July 23, 2026 (item Q4 in `/app/memory/RECURRING_MAINTENANCE.md`). Monthly `fiveStarReviewCount` drift audit (item M2).

### P1.13 — `/services/system-replacement` dedicated page ⭐ NEW REVENUE CENTER
- **Why:** Replacement is 5–15× the ticket of a service call. Currently has no dedicated page. Free-estimate offer is a hidden asset. Biggest single-conversion-surface gap on the site.
- **Scope:** New page at `/services/system-replacement`. Sections: "Is it time to replace?" decision block · "What affects replacement cost" value-proof (no $ yet) · "Free written estimate" primary CTA · financing preview linking to `/financing` · city-served cross-links · FAQ schema.
- **Deliverables:** Next.js page + Sanity `systemReplacement` schema (or reuse existing `companyPage` if matched) + nav/header update (inside Residential dropdown) + hero block on `/services`.
- **Effort:** 4–6 hrs
- **Impact:** Directly captures the highest-ticket buyer journey. Combined with estimator (P1.14) + financing (P1.16) = complete replacement funnel.

### P1.14 — Pricing Estimator Tool ⭐ NEW P1 (solves the "not ready to publish prices" constraint)
- **Why:** User wants groundwork for transparent pricing without committing to published numbers yet. Estimator gives users a RANGE from factor inputs, captures a lead at the results step, and serves as AEO citation bait (AI engines cite interactive cost tools over static articles).
- **Scope:** New top-line nav item `/estimator` — multi-step wizard with 4 flows:
  - `/estimator/service-call`
  - `/estimator/repair`
  - `/estimator/replacement` ★ (highest-value flow — feeds P1.13)
  - `/estimator/maintenance`
  - `/estimator/results/[id]` (shareable, ISR-cached, emailed via Resend)
- **UX pattern:** Open exploration (3–5 factor questions, sessionStorage autosave) → **gate at results step** (name/email/phone required before showing range) → lead written to MongoDB with all inputs + computed range + email PDF.
- **Technical:** Client wizard component + `POST /api/estimator/calculate` (pricing matrix in JSON config, server-side compute so formula isn't exposed) + `POST /api/estimator/lead` (MongoDB write + Resend email).
- **Scope options:**
  - MVP (~6–8 hrs): 3 calculators — Service Call, Repair, Replacement
  - Standard (~12–16 hrs): + Maintenance, more inputs (system age, home size, brand tier), PDF email, shareable link
  - Advanced (~24–32 hrs): + financing monthly-payment calc, photo upload, embedded scheduler
- **Requires from user:** pricing matrix (dollar ranges). Tool is buildable without it; calibration needs user domain input.
- **Impact:** Every completion = qualified lead. AEO gold on `"[service] cost dfw"` queries. Differentiator — no competitor has this.

### P1.15 — `/repair-or-replace` decision-framework article ⭐ NEW AEO ambush
- **Why:** "Should I repair or replace my AC?" is a top-volume commercial-investigation query in the DFW market. AI Overviews cite decision-framework content, and no local competitor answers it on-page. Low direct conversion, but captures top-of-funnel replacement shoppers and routes them down to P1.13.
- **Scope:** Single long-form article page. Sections: cost-benefit table (repair vs replace at various ages), "5 signs it's time to replace," decision flowchart, call-to-book-estimate. Schema: `Article` + `FAQPage`.
- **Effort:** 3–4 hrs
- **Impact:** AI Overviews citation surface + internal routing to `/services/system-replacement` and `/estimator/replacement`.

### P1.16 — `/financing` page — PROMOTED from P2 to P1
- **Why:** Replacement conversion ($6K–$18K tickets) depends heavily on "can I afford it this month" — financing availability is the make-or-break moment. No sense shipping `/services/system-replacement` or `/estimator/replacement` without financing reachable in one click.
- **Scope:** New page at `/financing` — partner info, "as low as $X/month" calculator preview, application link. Schema: `FinancialProduct`.
- **Requires from user:** Confirmed financing partner + terms.
- **Effort:** 4 hrs
- **Impact:** Unlocks replacement conversion; promotes credibility on every service page via inline callouts.

### P1.6b — City page body content depth (300–500 unique words × 28 cities)
- Local landmarks, housing stock, common HVAC issues, zip-specific context
- Biggest untapped on-site ranking lever
- **Effort:** 4–6 hrs drafting; cadence = 1/week during Month 1–2
- **Impact:** High — combines with P1.6a titles for compounding local-SEO gains

### P1.6c — Backlink profile audit + target list
- Run Ahrefs/Moz free tier on dfwhvac.com
- Build target list: Coppell Chamber, Dallas BBB, DFW trade associations, HVAC supplier "where to buy" pages, local news (PR angle: 3-gen family story)
- **Effort:** 2 hrs audit + ongoing outreach
- **Impact:** Medium-long term

### P1.6d — INP (Interaction to Next Paint) field measurement
- Check GSC → Experience → Core Web Vitals for mobile + desktop INP
- Requires 28+ days of field data — not action-able until CrUX populates
- **Effort:** 30 min diagnosis + variable fix

### P1.6e — Review response audit + ongoing cadence
- Count current Google reviews + response rate (ideal 100%, priority negative/4-star)
- Document cadence goal: 2–5 new reviews/mo minimum
- **Effort:** 1 hr initial + ongoing. User-controlled (needs GBP admin).

### P1.6f — Google Rich Results validation
- Use Google Rich Results Test on home, 1 city (plano), 1 service (air-conditioning), /contact, /about
- Verify LocalBusiness, Service, BreadcrumbList, FAQ schemas eligible
- **Effort:** 30 min (user-led)

### P1.8 — Google Business Profile full optimization ⭐ BIGGEST TRAFFIC LEVER
- Claim/verify GBP at 556 S Coppell Rd Ste 103, Coppell, TX 75019
- Verify NAP exactly matches site + schema
- Hours: Mon–Fri 7AM–6PM
- Upload 20+ photos (before/after jobs, trucks, techs, office)
- Service area: list all 28 cities
- Attributes: family-owned, licensed, etc.
- Weekly GBP Posts cadence
- Respond to 100% of reviews
- Enable Messages
- **Effort:** 4 hrs initial + 30 min/week ongoing
- **Impact:** 30–80% local traffic uplift in 60 days (typical). User-led (needs GBP admin).

### P1.9 — Leverage 145 five-star reviews sitewide ⭐ BIGGEST ON-SITE CONVERSION LEVER
- **P1.9b** Review badge in every page hero (2 hrs)
- **P1.9c** Inline review carousel near every form (2 hrs)
- **P1.9d** City-filtered reviews page (3 hrs)
- **P1.9e** Footer + sticky bottom bar trust signals (1 hr)
- **P1.9f** Post-submit success page with rotating review (3 hrs — merge with P1.11)
- **Total:** ~11 hrs
- **Impact:** 15–25% conversion-rate lift sitewide

### P1.10 — Progressive form redesign ⭐ CONVERSION LIFT
- Step 1: name + phone only → "Continue"
- Step 2: email + address + problem → "Complete Request"
- Submit step 1 data to `/api/leads` as "quick-lead" so abandons still capture
- Move `AddressAutocomplete` into step 2 (additional TBT win)
- **Effort:** 4–6 hrs
- **Impact:** 30–50% form submission lift

### P1.11 — "What happens next" post-submit flow
- `/thanks` page: confirmation + response-time expectation + emergency phone + rotating review + next-steps list + "save our number" CTA
- Email auto-reply via Resend (existing infra)
- Future: SMS auto-reply via Twilio
- Redirect LeadForm + SimpleContactForm to `/thanks` instead of toast
- GA4 conversion event fires on `/thanks` load
- **Effort:** 4 hrs
- **Impact:** Conversion cleanup (fewer ghosted-after-submit leads)

### P1.12 — Google Ads architecture (Weeks 10–12)
- **P1.12a** Dedicated ad landing pages: `/quote-ac-repair`, `/quote-furnace-install`, `/emergency-hvac-dfw` via `app/(ads)/[campaign]/page.jsx` template
- **P1.12b** GCLID + UTM capture → sessionStorage → lead record → Google Ads conversion tag
- **P1.12c** Landing page Quality Score checklist validation
- **Effort:** 8–12 hrs
- **Impact:** QS 7+/10 vs. 4–5 on generic = 30–50% CPC reduction

### P1.4 — Internal linking matrix
- Service ↔ city cross-links, descriptive anchors, no orphans (mostly done via Apr 21 PR #3, final audit pending)
- **Effort:** 2–3 hrs

### P1.5 — GSC baseline capture + weekly indexing trend
- Capture current Performance numbers (clicks/impressions/CTR/position, last 28 days)
- Watch index count trend toward 47 of 47 URLs over 4 weeks
- **Effort:** 30 min + 10 min weekly. User-led.

### P1.3 — User-led device QA (M1–M5)
- iOS Safari, Android Chrome, address autocomplete cross-device
- Not automatable reliably (API referrer restrictions)
- **Effort:** 1 hr. User-led.

### P1.7 — GA4 key event toggle ✅ COMPLETE Apr 24, 2026
- ✅ `generate_lead` marked as key event Apr 24. (GA4 "Modify event" rule renames our code-side `form_submit_lead` → `generate_lead`, Google's recommended event name — kept the rename for Smart Bidding ML affinity.)
- ✅ `phone_click` marked as key event Apr 24 (same session, after Realtime confirmation + ingestion).
- **Future key events to toggle when the backing feature ships:**
  - `thanks_page_view` — when P1.11 `/thanks` ships
  - `form_step_1_complete` — when P1.10 progressive form ships
  - `estimator_complete` — when P1.14 `/estimator` ships
  - Do NOT toggle preemptively. GA4 requires an event to fire at least once before the toggle is available.

---

## 🟡 P2 — Important (wait until P1 largely done)

### P2.1 — "50+ cities" copy cleanup (actual = 28)
- Audit: hero components, footer, About page, service-area descriptions in Sanity
- Fix: "28+ DFW cities" or "across the DFW Metroplex"
- **Effort:** 30 min

### P2.2 — `/pricing` page (STUB now, launch later)
- **Status:** URL reserved by STUB route that returns `noindex,nofollow`. Architecture slot protected.
- **Phase 2 launch:** Single source-of-truth transparent pricing directory — full services with "starting from $X" + filtering + `Offer`/`PriceSpecification` schema for AEO citation. Every service page + estimator pulls from this as shared data.
- **Dependencies:** User ready to publish numbers + internal pricing sheet locked down.
- **Effort:** 4–6 hrs once user green-lights.
- **Impact:** Definitive AI Overview citation + conversion trust lever.

### P2.3 — NAP consistency audit
- Yelp, BBB, Angi, HomeAdvisor, Thumbtack, Nextdoor, Bing Places, Apple Maps
- Use whitespark.ca citation audit or moz.com local search
- **Effort:** 3–4 hrs

### P2.4b — Deeper TBT optimization (lucide + Radix + Sanity bundle)
- `@next/bundle-analyzer` → identify heaviest client modules
- Tree-shake lucide-react unused icons (~20 of ~50 imported likely unused)
- Audit shadcn/ui imports — remove components not rendered
- Split `/studio` (Sanity admin, 932KB) behind dynamic import
- **Effort:** 4–6 hrs (was 6–10 but Apr 21 RSC batch already covered ~60%)
- **Impact:** TBT into consistent 🟢 Good band

### P2.5 — Sanity webhook ISR revalidation
- Remove `force-dynamic` from pages (keep for `/contact`, `/request-service`, `/estimate` if per-request logic)
- `export const revalidate = 3600`
- `/api/revalidate` route with secret token
- Sanity webhook → `/api/revalidate` on publish
- **Effort:** 2–3 hrs
- **Sub-item (Apr 23, 2026):** Migrate all title-bearing pages from `force-dynamic` → `revalidate: 86400` once webhook path is in place. Keeps Option C review-count badges fresh within 24h, cuts per-request Sanity fetches by ~97%. Low-risk because the daily `/api/cron/sync-reviews` already aligns with a 24h cadence.

### P2.17 — Deprecate / remove Sanity `metaTitle` field (title rewrite cleanup)
- **Context:** P1.6a (Apr 23, 2026) made the code-side titles the single authoritative source. The Sanity `metaTitle` field on homepage/aboutPage/contactPage/faqPage/reviewsPage/companyPage/cityPage/service is no longer read by any route.
- **Scope:** Remove the `metaTitle` field from all Sanity schemas (or mark `readOnly: true` + `hidden: true`) and drop it from GROQ projections in `lib/sanity.js`. Document the removal in CHANGELOG + audits.
- **Effort:** 30 min
- **Impact:** Prevents future content editors from accidentally overriding the audited titles. Eliminates schema drift confusion.

### P2.6 — GTM + Facebook Pixel
- When paid social campaign warrants it
- **Effort:** 1–2 hrs

### P2.7 — Code cleanup / unused dependency audit
- `yarn depcheck` or manual review
- Remove dead `mockData.js` / unused components
- **Effort:** 1–2 hrs

### P2.9 — Blog launch + 4 seasonal posts
- `/blog` route + Sanity `blogPost` schema
- First 4 posts: summer prep, AC freeze-up, replace vs repair, 2021 freeze retrospective
- **Effort:** 6 hrs infra + ~3 hrs/post

### P2.11 — Financing prominence
- `/financing` page + service-page callouts ("as low as $X/month")
- Schema: `FinancialProduct` or `Offer`
- **Effort:** 4 hrs (needs user to confirm financing partner)

### P2.15 — Oversized component decomposition
- Partially addressed Apr 21 (4 templates converted to RSC, 1,628 lines moved server-side)
- Remaining: split any still-large client components into smaller modules
- **Effort:** variable — scope after bundle analysis in P2.4b

### Post-ad-launch P2s
- **P2.8** Video testimonials (4 hrs + $500–1,500 external)
- **P2.10** Lead magnets (8–12 hrs each)
- **P2.12** SMS text-back (4–6 hrs)
- **P2.13** Exit intent modal (3–4 hrs)
- **P2.14** Urgency signals (3–4 hrs)
- **P2.16** `/api/leads` POST handler complexity reduction (3–4 hrs)
- **P2.18** Index-as-key audit (2 hrs)
- **P2.19** CallRail call tracking
- **P2.20** Enhanced Conversions + Offline Conversion Upload
- **P2.21** Server-Side GTM (reconsider post-60-day ad data)

### P2 — Dark mode support
- `darkMode: 'class'` in `tailwind.config.js` + `dark:` variants across ~15 components + theme toggle
- **Effort:** 6–10 hrs
- **Impact:** Modern polish; matches iOS 18+/Android 14+ expectations; eliminates browser force-dark artifacts

---

## 🔵 P3 — Backlog / Strategic

- **Skip-to-main content link (a11y polish)** — 15 min; pushes Lighthouse A11y to a full 100. WCAG 2.1 SC 2.4.1 Bypass Blocks.
- **Next.js 15 → 16 upgrade + Sanity 3.50+** — summer 2026 for stability. Clears React 19 peer-dep warnings and 28 dev-only CVE alerts.
- **DNS records upgrade** (GoDaddy A-records → Vercel CNAME) — 10 min, low-risk
- **Expanded city page content** beyond P1.6b (neighborhood sub-pages)
- **AI Readiness / AEO** — structured answers for AI Overviews, generative search
- **Content Hub / `/resources`** — authoritative HVAC guides for topical authority
- **Housecall Pro direct API integration** — replace manual entry / Zapier
- **RealWork subscription evaluation** — keep or cut based on `/recent-projects` analytics + widget TBT cost
- **Latent Sanity null-handling bug in `lib/sanity.js`**
- **Cancel Wix subscription** (2+ weeks post-launch stability)
- **Case studies page**
- **YouTube video embed on Indoor Air Quality page**

---

## 🔁 Recurring Maintenance

**Full checklist:** → `/app/memory/RECURRING_MAINTENANCE.md` (living document — 20+ tasks across Daily / Weekly / Monthly / Quarterly / Semi-annual / Annual / Ad-hoc cadences)

Summary of cadences:
| Cadence | Headline examples |
|---|---|
| Daily (automated) | `/api/cron/sync-reviews` |
| Weekly | GBP Posts, GBP review-reply SLA, CrUX glance |
| Monthly | Lighthouse, review-count drift audit, GSC not-indexed review, Places API billing, M1–M5 device matrix, GA4 conversion fire check |
| Quarterly | Tech SEO audit, QA sweep, listings description refresh, title-tag CTR review, Rich Results validation, sitemap/robots scan, competitor audit |
| Semi-annual | NAP consistency audit, seasonal title/promo refresh, broken internal link crawl |
| Annual | Seed/mock data review, API key rotation, Sanity dataset backup, 301/410 prune, MongoDB retention review, Maps API referrer allowlist |
| Ad-hoc | After any form edit — re-verify `/api/leads` + reCAPTCHA + GA4 |

---

## 📍 Strategic Phase Grouping (solo operator)

**Phase A — Architecture Lock-In** (code-heavy, agent-executable): audits, measurement, schema/fallback integrity, conversion infrastructure, deep perf, ops polish. **~45–60 hrs total. Realistic completion in 4–8 weeks at 1–2 sessions/week.**

**Phase B — Content Production** (slow, user-led, agent-supported): review weaponization, GBP, city body content, conversion copy, long-form assets. **Ongoing 3–6 months at 1–2 hrs/week.**

**Phase C — Deferred/Strategic P3:** framework upgrades, DNS, AEO, Housecall Pro API, Wix cancellation.

Finish Phase A fully before starting Phase B. Prevents architectural bugs from surfacing mid-content-sprint.
