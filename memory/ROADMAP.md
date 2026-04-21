# DFW HVAC — Roadmap

**Last reviewed:** April 21, 2026
**⚠️ Read `/app/memory/00_START_HERE.md` first for the Agent SOP.**

This file contains ONLY future-facing work. Shipped items live in `/app/memory/CHANGELOG.md`.

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
  - **P1.6a** — Title tag audit + rewrite ⭐ NEXT HIGHEST-LEVERAGE (titles ARE a ranking factor; meta desc isn't)
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

### P1.6a — Title tag audit + rewrite ⭐ NEXT TASK
- **Scope:** Extract `<title>` for all ~47 pages (home + 7 service + 28 city + utility). Flag duplicates + >60 char titles. Rewrite via `generateMetadata()` code-fallback pattern same as meta descriptions.
- **Template (city):** `[City] HVAC Repair & Installation | DFW HVAC`
- **Template (service):** `[Service] in Dallas-Fort Worth | DFW HVAC`
- **Deliverable:** Code changes + audit doc at `/app/memory/audits/YYYY-MM-DD_Title_Tag_Audit.md`
- **Effort:** 1 hr
- **Impact:** Direct ranking-factor lever (unlike meta descriptions)

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

### P1.7 — GA4 conversion toggle
- Toggle "Mark as conversion" on `form_submit_lead` and `phone_click` events in GA4 dashboard
- **Effort:** 5 min. User-led.

---

## 🟡 P2 — Important (wait until P1 largely done)

### P2.1 — "50+ cities" copy cleanup (actual = 28)
- Audit: hero components, footer, About page, service-area descriptions in Sanity
- Fix: "28+ DFW cities" or "across the DFW Metroplex"
- **Effort:** 30 min

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

| Cadence | Task |
|---|---|
| Daily (automated) | `/api/cron/sync-reviews` — Google Places API → Sanity → all on-site surfaces |
| Weekly | GBP Posts (once P1.8 live) |
| Monthly | Lighthouse scorecard (save to `/app/memory/audits/`) |
| Quarterly | P1.2 Technical SEO Audit re-run — next July 21, 2026 |
| Quarterly | P1.3 Post-launch QA Sweep re-run — next July 21, 2026 |
| Quarterly | External business listings refresh via `GET /api/canonical-description` (GBP, Yelp, Angi, HomeAdvisor, Nextdoor). Next: July 21, 2026 |
| Annual | Fallback/seed data review (`lib/mockData.js` vs Sanity + Google) |

---

## 📍 Strategic Phase Grouping (solo operator)

**Phase A — Architecture Lock-In** (code-heavy, agent-executable): audits, measurement, schema/fallback integrity, conversion infrastructure, deep perf, ops polish. **~45–60 hrs total. Realistic completion in 4–8 weeks at 1–2 sessions/week.**

**Phase B — Content Production** (slow, user-led, agent-supported): review weaponization, GBP, city body content, conversion copy, long-form assets. **Ongoing 3–6 months at 1–2 hrs/week.**

**Phase C — Deferred/Strategic P3:** framework upgrades, DNS, AEO, Housecall Pro API, Wix cancellation.

Finish Phase A fully before starting Phase B. Prevents architectural bugs from surfacing mid-content-sprint.
