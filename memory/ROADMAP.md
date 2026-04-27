# DFW HVAC — Roadmap

**Last reviewed:** April 27, 2026
**⚠️ Read `/app/memory/00_START_HERE.md` first for the Agent SOP.**
**Source of truth for design decisions:** `/app/design_guidelines.md`
**Companion files:** `CHANGELOG.md` (shipped items), `RECURRING_MAINTENANCE.md` (ongoing cadences), `audits/` (KPI baselines).

This file contains ONLY future-facing work, organized strictly by the 5-priority business framework.

---

## 🎯 Priority Framework (adopted Apr 27, 2026)

The site goal is **organic traffic that converts**, with paid ads as a force multiplier on a foundation-strong site, NOT a substitute for one. Each priority is a discrete layer; advance only after the previous layer's KPI baseline is captured and healthy.

| Priority | Layer | Outcome |
|---|---|---|
| **P1** | High-Performing Website Foundation | Site loads fast, never breaks, fully accessible, mobile-perfect, zero architectural debt. |
| **P2** | Best-in-class SEO + AEO | Maximum organic discoverability across Google, Google AI Overviews, ChatGPT, Perplexity, Gemini, GBP, Bing, Apple Maps. |
| **P3** | Conversion Optimization | Highest possible % of visitors take a conversion action (form, phone, estimator, financing). |
| **P4** | Ad-Measurable Infrastructure | Every conversion path attributable; pre-launch campaign infrastructure ready. |
| **P5** | Launch + Track Ads | Spend live; optimize ruthlessly on ground-truth data. |

Each priority requires its own KPI baseline + reevaluation cadence. See `/app/memory/audits/2026-04-27_KPI_Baseline.md` (to be created in Phase 1).

---

## 🧪 Sandbox Workflow (adopted Apr 24, 2026)

**Default for all new pages and non-trivial UI changes:** build on a feature branch → Vercel Preview Deployment → user QA on phone + desktop + Lighthouse → merge to `main` for production.

| Guardrail | Status | Ref |
|---|---|---|
| GA4 preview-env mute | ✅ Shipped Apr 24 | `app/layout.js` |
| Resend preview-env mute | ✅ Shipped Apr 24 | `app/api/leads/route.js` |
| Vercel auto-`noindex` on preview URLs | ✅ Vercel default | — |
| Sanity dataset isolation | ⏸️ Deferred | — |

**Escape hatch:** `FORCE_LEAD_EMAIL_IN_PREVIEW=true` in Vercel preview env to force real email send (E2E template QA).

---

# 🏗️ Priority 1: High-Performing Website Foundation

**Definition.** Site loads fast, never breaks, is fully accessible, works perfectly on every device, and has no architectural debt.

## P1.A — Already shipped

| ID | Item | Date |
|---|---|---|
| ✅ | Brand cohesion refactor (M7) | Apr 27, 2026 |
| ✅ | RSC conversion (60% TBT savings) | Apr 21, 2026 |
| ✅ | Legacy URL redirects (20 URLs) | Apr 23, 2026 |
| ✅ | Header nav reorg (M6) | Apr 27, 2026 |
| ✅ | WCAG AA contrast fixes on `electric-blue` + `vivid-red` | Apr 21, 2026 |
| ✅ | `/app/design_guidelines.md` published | Apr 27, 2026 |
| ✅ F0 | KPI baseline file `audits/2026-04-27_KPI_Baseline.md` | Apr 27, 2026 |
| ✅ F5 | Vercel Analytics + Speed Insights enabled | Apr 27, 2026 |
| ✅ F1 | Mobile UX deep audit + fixes (sticky CTA safe-area, 44px tap targets, inputMode/autoComplete) | Apr 27, 2026 |
| ✅ F2 | Image audit + LCP `priority` on Header logo + 1.4 MB unused PNGs purged | Apr 27, 2026 |
| ✅ P2.4b | Bundle reduction — homepage 180 → 172 kB, 38 shadcn + 27 npm deps removed | Apr 27, 2026 |
| ✅ F3 | **Security headers hardened** — HSTS+preload, COOP/CORP, CSP `frame-ancestors`/`form-action`/`upgrade-insecure-requests` | Apr 27, 2026 |

## P1.B — KPI baseline (capture in Phase 1, week 1)

Document captures live in `/app/memory/audits/2026-04-27_KPI_Baseline.md`.

| KPI | Target | Source |
|---|---|---|
| Lighthouse Performance (mobile) | ≥90 on /home, /plano, /financing, /replacement-estimator, /request-service | Lighthouse mobile audit |
| Lighthouse Accessibility | ≥95 sitewide | Lighthouse |
| Lighthouse Best Practices | ≥95 sitewide | Lighthouse |
| Lighthouse SEO | 100 sitewide | Lighthouse |
| CWV LCP p75 | <2.5s | GSC Experience (CrUX field) |
| CWV INP p75 | <200ms | GSC Experience |
| CWV CLS p75 | <0.1 | GSC Experience |
| First Load JS (homepage) | <150 kB | `yarn build` |
| TBT (lab) | <200ms | Lighthouse |
| Error rate | <0.1% requests | Vercel Analytics |
| Build time | <30s | `yarn build` (currently 22.7s ✅) |
| Uptime | 99.95%+ | Vercel SLA |
| Mobile vs desktop CWV gap | <20% delta | CrUX |
| **SecurityHeaders.com grade** | **A+** | securityheaders.com (post-deploy) |
| **Mozilla Observatory grade** | **A or higher** | observatory.mozilla.org |
| **Qualys SSL Labs TLS grade** | **A or higher** | ssllabs.com |
| **Dependency vulns (high+critical)** | **0** | GitHub Dependabot / `yarn audit` |
| **Public secret leaks (`gitleaks`)** | **0** | gitleaks scan |

## P1.C — Reevaluation cadence

- **Weekly (5 min):** glance at Vercel Analytics RUM + GSC Experience
- **Monthly (30 min):** full Lighthouse audit on 5 representative pages; compare to baseline; `yarn audit` deps scan
- **Quarterly:** comprehensive tech-SEO sweep + bundle analyzer; bundle-size delta tracked; **SecurityHeaders.com + Mozilla Observatory + SSL Labs re-grade; CSP review (can `unsafe-inline` be retired via nonces?); gitleaks scan of repo**
- **Annual:** API key rotation; HSTS Preload List re-verify
- **Per-PR (if Lighthouse CI installed):** automated regression catch

## P1.D — Action items (in execution order)

| # | ID | Item | Effort | Owner |
|---|---|---|---|---|
| 1 | P2.7 | Code cleanup / unused dep audit (`yarn depcheck`, dead `mockData.js`) | 1–2 hrs | Agent |
| 2 | P2.15 | Component decomposition (templates >300 lines) | variable | Agent |
| 3 | P2.4c | Lighthouse all-green verification on /cities-served/plano + /request-service | 1 hr | Agent |
| 4 | P3-a11y | Skip-to-main content link (push A11y to 100) | 15 min | Agent |
| 5 | F6 | 404 page UX upgrade — popular pages, search, CTA | 1 hr | Agent |
| 6 | F4 | Backup/disaster recovery checklist documented in `RECURRING_MAINTENANCE.md` | 1 hr docs | Agent |
| 7 | F8 | **Dependency security scan** — Dependabot + `gitleaks` GH Action on repo | 30 min | User + agent |
| 8 | F3b | **HSTS Preload List submission** — submit `dfwhvac.com` to hstspreload.org once headers verified live for 30+ days | 10 min | User |
| 9 | F3c | **CSP nonce migration** (retire `unsafe-inline` on script-src) — Next.js middleware-injected nonces | 4–6 hrs | Agent (Phase 4 candidate) |
| 10 | F3d | **`yarn audit --groups dependencies` CI gate** — fail build on high/critical advisories | 30 min | Agent |
| 11 | F7 | Lighthouse CI gate (optional) — Vercel build fails if Lighthouse drops below thresholds | 2 hrs | Agent |
| 12 | P1.6d | INP field measurement after CrUX populates (28+ days) | 30 min + variable | Agent |
| 13 | P1.3 | User-led device QA: iOS Safari, Android Chrome, address autocomplete | 1 hr | User |

**Phase 1 exit criteria:** All P1.B KPIs measured + meet target (or have ticketed plan to meet). Site is bulletproof. Estimated 15–20 hrs total.

---

# 🔍 Priority 2: SEO + AEO

**Definition.** Maximum organic discoverability across Google search, Google AI Overviews, ChatGPT, Perplexity, Gemini, GBP, Bing, Apple Maps.

## P2.A — Already shipped

| ID | Item | Date |
|---|---|---|
| ✅ P1.6a | Title tag audit (47 finalized titles, Option C hybrid review-count) | Apr 23, 2026 |
| ✅ P1.17a | Manual GSC indexing requests (~95% of sitemap submitted) | Apr 21–27, 2026 |
| ✅ Apr 27 audit | Site-wide indexing audit completed (89.4% indexed, 93.6% effective) | Apr 27, 2026 |
| ✅ A1, A2 | `the-colony` + `commercial-heating` GSC re-submitted | Apr 27, 2026 |

## P2.B — KPI baseline (capture in Phase 2a)

| KPI | Current | Target | Source |
|---|---|---|---|
| Sitemap indexing rate | 89.4% (42/47) | 100% by Jul 1 | GSC Pages |
| GSC impressions (28-day) | TBD | +30% in 90 days | GSC Performance |
| GSC clicks (28-day) | TBD | +50% in 90 days | GSC Performance |
| GSC avg CTR | TBD | +0.5pp absolute | GSC Performance |
| GSC avg position (top 20 queries) | TBD | top 10 for ≥50% branded; top 20 for ≥70% "[service] [city]" | GSC Performance |
| Backlink count (DR≥20) | TBD | +15 in 6 months | Ahrefs/Moz |
| GBP impressions | TBD post-verify | +50% in 60 days | GBP Insights |
| GBP calls | TBD | +30% in 60 days | GBP Insights |
| GBP direction requests | TBD | +30% in 60 days | GBP Insights |
| Google reviews count | 145 | 165 by Sep 1 | GBP |
| Review response rate | TBD | 100% | GBP |
| AEO citation rate | TBD via S3 | 5+/20 queries cite DFW HVAC by Sep 1 | Manual audit (S3) |
| Featured snippets owned | 0 (assumed) | 3–5 by Sep 1 | GSC + manual |
| Schema coverage | TBD | 100% pages have ≥2 schema types | Rich Results Test |

## P2.C — Reevaluation cadence

- **Weekly (5 min):** GSC dashboard glance — impressions, indexed-URL count, errors
- **Monthly (30 min):** full GSC report deep-dive (Performance + Pages + Experience); compare to baseline
- **Quarterly (3–4 hrs):** AEO citation audit (S3), competitor audit (S10), schema validation, NAP recheck, backlink growth
- **Semi-annual:** Title-tag CTR review, full SEO audit refresh

## P2.D — Action items

### Phase 2a: SEO/AEO Quick Wins (~5 hrs, agent-led, ship next)

| # | ID | Item | Effort |
|---|---|---|---|
| 1 | A4 | `commercial-heating` content differentiation + internal linking (the only page Google explicitly rejected) | 45 min |
| 2 | S1 | **AI crawler robots.txt policy** — verify GPTBot, ClaudeBot, PerplexityBot, Google-Extended `Allow: /` | 30 min |
| 3 | S2 | Schema audit + completion (esp. `WebApplication`/`HowTo` on `/replacement-estimator`) | 2 hrs |
| 4 | P1.6f | Rich Results validation on home, plano, AC, contact, repair-or-replace | 30 min |
| 5 | P1.4 | Internal linking matrix (overlaps with A4) | 2–3 hrs |
| 6 | S3 | AEO citation tracking baseline — 15–20 queries logged | 1 hr |
| 7 | P1.5 | GSC baseline capture + weekly trend doc | 30 min |
| 8 | A3 | May 5 GSC re-audit (re-export 6 reports → diff vs Apr 27 baseline) | 10 min user + 30 min agent |
| 9 | P2.1 | "50+ cities" copy cleanup (actual = 28) | 30 min |
| 10 | S5 | Image alt-text sitewide audit (LLM-assisted) | 1 hr |
| 11 | S6 | OG / Twitter card audit | 1 hr |
| 12 | S7 | Sitemap priority + lastmod accuracy | 1 hr |

### Phase 2b: SEO Content Cadence (weeks 4–24, runs parallel to Phase 3)

| # | ID | Item | Cadence | Owner |
|---|---|---|---|---|
| 13 | P1.8 | **Google Business Profile optimization (start ASAP — verification takes 5–14 days)** | 4 hrs initial + 30 min/wk | User-led, agent-supported |
| 14 | P1.6e | Review response audit + ongoing cadence (target 2–5 new reviews/mo) | 1 hr + ongoing | User |
| 15 | P1.6b | City page body content rewrite (28 cities × 300–500 unique words) | 1–2 hrs/city × 28 = 28–56 hrs over 6 mo | Agent drafts → user reviews |
| 16 | P1.6c | Backlink profile audit + outreach (Coppell Chamber, Dallas BBB, trade press, supplier "where to buy") | 2 hrs audit + ongoing | Agent + user |
| 17 | P2.3 | NAP consistency audit (Yelp, BBB, Angi, HomeAdvisor, Thumbtack, Nextdoor, Bing, Apple Maps) | 3–4 hrs | User-led |
| 18 | S4 | Programmatic SEO opportunity audit — identify high-value (city × service) combos | 2 hrs | Agent |
| 19 | S8 | Featured snippet opportunity audit | 2 hrs | Agent |
| 20 | S9 | Bing Webmaster Tools + Apple Maps Connect setup | 1 hr | User-led |
| 21 | P2.9 | Blog launch + 4 seasonal posts (only after all 28 city pages rewritten) | 6 hrs infra + 3 hrs/post | Agent + user |
| 22 | P2.2 | `/pricing` page launch (currently STUB; awaits user $ data) | 4–6 hrs | Agent (when user ready) |
| 23 | S10 | Quarterly competitor SEO audit | 2 hrs/qtr | Agent |
| 24 | P2.17 | Deprecate Sanity `metaTitle` field (titles now code-side authoritative) | 30 min | Agent |
| 25 | F9 | **Live KPI widget on roadmap-preview.html** — pull Vercel Speed Insights p75 (LCP/INP/CLS) + GA4 conversion rate via API; auto-replace "TBD" cells with live values. Phase 2b deliverable, after Vercel Analytics has 7+ days of RUM data. | 2 hrs | Agent |

**Phase 2 exit criteria:** P2.B baseline captured + all targets either met or trending. Phase 2a fully complete; Phase 2b ongoing.

---

# 💰 Priority 3: Conversion Optimization

**Definition.** Of every visitor reaching the site, the highest possible % takes a conversion action.

## P3.A — Already shipped

| ID | Item | Date |
|---|---|---|
| ✅ P1.14 | `/replacement-estimator` 5-step wizard with Option C hybrid lead gate | Apr 24, 2026 |
| ✅ P1.16 | `/financing` page (Wisetack, 0% APR 24mo) | Apr 24, 2026 |
| ✅ P1.13 | `/services/system-replacement` revenue-center page | Apr 24, 2026 |
| ✅ P1.15 | `/repair-or-replace` AEO decision-framework article | Apr 24, 2026 |
| ✅ P1.7 | GA4 key events: `generate_lead`, `phone_click` | Apr 24, 2026 |

## P3.B — KPI baseline (capture in Phase 3 week 1)

| KPI | Current | Target | Source |
|---|---|---|---|
| Overall conversion rate | TBD | +25% by Sep 1 | GA4: (form_submit + phone_click) ÷ unique sessions |
| Form submission rate | TBD | +40% post P1.10 | GA4 `form_submit_lead` ÷ form views |
| Phone click rate | TBD | +20% by Sep 1 | GA4 `phone_click` ÷ unique sessions |
| Per-page conversion rate (top 10 entry pages) | TBD | identify worst 3, lift each 50% | GA4 Pages |
| Mobile vs desktop conversion | TBD | parity within 10% | GA4 Devices |
| Estimator completion rate | TBD | ≥30% of starts | GA4 funnel |
| Estimator → opt-in rate | TBD | ≥15% of completions | GA4 funnel |
| Bounce rate (top 5 entry pages) | TBD | <60% each | GA4 Engagement |
| Time on page (key pages) | TBD | >45s services, >2 min /repair-or-replace + /estimator | GA4 |
| Lead → booked-job rate | TBD | tracked for ad ROI | User CRM |

## P3.C — Reevaluation cadence

- **Weekly (5 min):** GA4 Realtime + Conversions glance
- **Monthly (1 hr):** full conversion review — by-page, by-device, by-source; identify biggest drop-offs
- **Quarterly:** A/B test cycle (1 test/month max for solo); review heatmaps; identify next bottleneck
- **Pre/post any conversion-affecting deploy:** verify GA4 events still firing within 48 hrs

## P3.D — Action items (in execution order)

| # | ID | Item | Effort | Owner |
|---|---|---|---|---|
| 1 | C1 | **Microsoft Clarity heatmap + session recording installed (FREE; needs 30+ days runtime to gather data — install FIRST)** | 30 min | Agent |
| 2 | M5 | Conversion baseline captured in `/app/memory/audits/2026-04-27_KPI_Baseline.md` | 30 min | User + agent |
| 3 | P1.11 | `/thanks` post-submit page + Resend auto-reply (kills post-submit ghosting) | 4 hrs | Agent |
| 4 | C7 | "What happens next" copy below every form ("we'll call within 1 business hour") | 1 hr | Agent |
| 5 | P1.10 | **Progressive form redesign** (2-field → expand; expected 30–50% submit lift) | 4–6 hrs | Agent |
| 6 | C4 | Form abandonment tracking — GA4 events on field-blur | 1 hr | Agent |
| 7 | P1.9b | Review badge in every page hero | 2 hrs | Agent |
| 8 | P1.9e | Footer + sticky bottom-bar trust signals | 1 hr | Agent |
| 9 | P1.9c | Inline review carousel near every form | 2 hrs | Agent |
| 10 | P1.9d | City-filtered reviews page | 3 hrs | Agent |
| 11 | P1.9f | Post-submit rotating review (merge with P1.11) | (combined) | Agent |
| 12 | C2 | Click-to-call CTA placement audit (verify red phone reachable in <3s on every mobile page) | 1 hr | Agent |
| 13 | C5 | A/B testing framework — Vercel Edge Config or Sanity-driven variants | 2 hrs | Agent |
| 14 | C3 | Estimator pricing matrix populated with REAL DFW HVAC numbers (replace placeholders in `lib/estimator-matrix.js`) | 30 min user + 30 min agent | User → agent |
| 15 | C6 | Mobile sticky-CTA conversion lift verification (already shipped; segment in GA4) | 30 min | Agent |
| 16 | P2.10 | Lead magnets (AC age lookup, replacement timing calc) | 8–12 hrs each | Defer until Phase 3 KPIs trending |
| 17 | P2.13 | Exit intent modal | 3–4 hrs | Defer until Phase 3 KPIs trending |
| 18 | P2.14 | Urgency signals | 3–4 hrs | Defer until Phase 3 KPIs trending |
| 19 | P2.12 | SMS text-back via Twilio | 4–6 hrs | Defer post-ad-launch |

**Phase 3 exit criteria:** P3.B baseline captured. P1.11 + P1.10 + P1.9b/c/d/e/f + C1–C7 all shipped. Conversion rate trending positive.

---

# 📊 Priority 4: Ad-Measurable Infrastructure

**Definition.** Pre-launch measurement pipeline so every conversion path is attributable to source channel. Built BEFORE any ad dollar is spent.

## P4.A — Already shipped

| ID | Item | Date |
|---|---|---|
| ✅ P1.7 | GA4 `generate_lead` + `phone_click` key events | Apr 24, 2026 |

## P4.B — KPI baseline (pre-launch validation)

| KPI | Pre-launch target | Source |
|---|---|---|
| CallRail/DNI installed and routing 100% of phone CTAs | Yes | CallRail dashboard |
| GCLID capture rate on `/quote-*` LPs | 100% of GCLID visits → MongoDB | MongoDB query |
| Enhanced Conversions match rate | ≥70% (Smart Bidding floor) | Google Ads diagnostics |
| GA4 ↔ Google Ads link verified | Yes | Google Ads UI |
| GA4 ↔ Facebook Pixel parity | <10% delta on lead events | GA4 vs FB Events Manager |
| Ad LPs Quality Score (lab) | All ≥7/10 | Google Ads Editor |
| Ad LPs Lighthouse Perf | ≥85 each | Lighthouse |
| All conversion events firing within 48 hrs of test | Pass | GA4 DebugView |

## P4.C — Reevaluation cadence

- **Pre-launch:** 100% test pass before any spend authorized
- **Daily during first 14 days of ads:** CallRail call quality, GCLID rate, conversion event firing
- **Weekly thereafter:** full ad-platform reconciliation (GA4 ↔ Google Ads ↔ FB Ads)

## P4.D — Action items (only after Phase 3 baseline trending positive)

| # | ID | Item | Effort | Owner |
|---|---|---|---|---|
| 1 | P2.19 | **CallRail or Twilio DNI** — call tracking (~60–80% of HVAC conversions are calls) | 3–6 hrs | Agent + user |
| 2 | P2.20 | Enhanced Conversions + Offline Conversion Upload | 3–4 hrs | Agent |
| 3 | A1 | GA4 Enhanced E-commerce event taxonomy | 1 hr | Agent |
| 4 | P1.12a | Dedicated ad LP template (`app/(ads)/[campaign]/page.jsx`) | 4–6 hrs | Agent |
| 5 | A4-LP | Build `/quote-emergency-ac-repair`, `/quote-furnace-replacement`, `/quote-spring-tuneup` LPs | 3 hrs each = 9 hrs | Agent |
| 6 | P1.12b | GCLID + UTM capture → sessionStorage → MongoDB lead record | 2–3 hrs | Agent |
| 7 | P1.12c | Landing page Quality Score checklist validation | 1 hr | Agent + user |
| 8 | P2.6 | Google Tag Manager + Facebook Pixel | 1–2 hrs | Agent |
| 9 | A3-fb | Facebook Pixel + Conversions API (server-side, bypasses iOS 14 ATT) | 2 hrs | Agent |
| 10 | A5 | UTM parameter standardization doc (utm_source/medium/campaign/content/term naming) | 1 hr | Agent docs |
| 11 | A6 | Ad-budget tracking dashboard (Google Sheet pulling GA4 + Google Ads + FB Ads + lead-to-booked) | 2 hrs | Agent + user |
| 12 | M4 | **Pre-launch deploy freeze policy formalized in `RECURRING_MAINTENANCE.md`** (10 days before Day 1) | 30 min docs | Agent |

**Phase 4 exit criteria:** All P4.B targets met. Dry-run-ready.

---

# 🚀 Priority 5: Launch + Track Ads

**Definition.** Spend live. Optimize ruthlessly on Priority 4's instrumentation.

## P5.A — KPI baseline (track from Day 1)

| KPI | Target |
|---|---|
| CPC (Google Search) | <$8 (HVAC DFW typical $4–$12) |
| CTR (Google Search) | >5% |
| Conversion rate (LP → form/call) | >8% |
| Cost per lead (CPL) | <$60 |
| Cost per booked job (CAC) | <$200 (assuming avg ticket >$1,000) |
| Quality Score (Google) | ≥7 |
| Relevance Score (FB) | ≥7 |
| LTV : CAC ratio | ≥3:1 within 90 days |

## P5.B — Reevaluation cadence

- **Daily (first 14 days):** spend pacing, anomalies, junk traffic
- **Daily (always):** budget alerts via Google Ads Scripts
- **Weekly:** negative keywords audit, ad copy refresh, audience refinement
- **Monthly:** full creative refresh, ROI review against P1–P3 KPIs (did ads accelerate organic, or just shift attribution?)

## P5.C — Action items

| # | ID | Item | When |
|---|---|---|---|
| 1 | L1 | $10/day Google Search dry run × 5 days | Week 1 of launch |
| 2 | L2 | $10/day Facebook dry run × 5 days | Week 1 of launch |
| 3 | L3 | Verify all attribution paths (P4 KPIs hold under live spend) | Throughout dry run |
| 4 | L6 | Toggle remaining GA4 key events as they fire (`thanks_page_view`, `form_step_1_complete`, `estimator_complete`) | After 24 hrs spend |
| 5 | L4 | Scale spend on winning ad sets | Week 2+ |
| 6 | L5 | Cull underperforming creative | Week 2+ |
| 7 | L7 | Negative keyword audit weekly (HVAC has heavy junk: DIY, parts) | 30 min/wk × 60 days |
| 8 | L8 | Ad creative refresh cadence — 30-day rotation (esp. FB, ad fatigue) | 2 hrs/mo |
| 9 | L9 | Lead-to-booked-job tracking — CRM tags → Offline Conversion Upload | 30 min/wk ongoing |
| 10 | L10 | Monthly ad ROI review against P1–P3 KPIs | 1 hr/mo |
| 11 | P2.21 | Server-Side GTM — only if ad-blocker data loss >10% after 60 days | Month 4+ contingency |

---

# 🟦 Recurring Maintenance

**Full checklist:** `/app/memory/RECURRING_MAINTENANCE.md`

| Cadence | Headline examples |
|---|---|
| Daily (automated) | `/api/cron/sync-reviews` |
| Weekly | GBP Posts, GBP review-reply SLA, CrUX glance, GSC dashboard glance, GA4 conversion check |
| Monthly | Lighthouse audit, review-count drift, GSC not-indexed review, Places API billing, M1–M5 device matrix, full conversion review |
| Quarterly | Tech-SEO audit, AEO citation audit, competitor SEO audit, listings description refresh, title-tag CTR review, schema validation, sitemap/robots scan |
| Semi-annual | NAP consistency audit, seasonal title/promo refresh, broken internal-link crawl |
| Annual | Seed/mock data review, API key rotation, Sanity dataset backup, 301/410 prune, MongoDB retention review, Maps API referrer allowlist |

---

# 🗑️ Dropped from active roadmap (moved to P3 backlog only)

These items don't materially serve any of the 5 priorities; revisit only if context changes.

| Item | Reason |
|---|---|
| Dark mode support | Zero SEO/conversion impact for HVAC audience (~6–10 hrs saved) |
| P2.8 Video testimonials | Marginal vs existing 145 reviews; capital-intensive ($500–1,500) |
| Next.js 15→16 upgrade | Premature; wait until forced by security or peer-dep |
| DNS GoDaddy → Vercel CNAME | Zero SEO/conversion impact; ops cleanup only |
| P2.5 Sanity webhook ISR | Optimization without measurable benefit; defer unless TTFB surfaces as CWV issue |
| P3 Housecall Pro API integration | Operations efficiency, not SEO/conversion |
| P2.21 Server-Side GTM | Correctly already deferred to Month 4+ contingency |
| Wix subscription cancellation | Operational; user-led, no roadmap dependency |
| RealWork subscription evaluation | Operational; user decision |
| Case studies page, YouTube embed on IAQ | P3 backlog; revisit after Phase 2b cadence is mature |

---

# 📍 Strategic Phase Sequencing

**Phase 1 — Foundation Lock-In** (~15–20 hrs, agent-led, ~2–3 weeks)
Capture baseline → ship F0–F8 → close P2.4b/c/7/15. Site is bulletproof. **Exit:** P1.B all measured.

**Phase 2a — SEO/AEO Quick Wins** (~5 hrs, week 3) 
A4 + S1–S10 + P1.4/5/6f. **Exit:** P2.B baseline captured + AI crawlers verified open.

**Phase 2b — SEO Content Cadence** (ongoing 6+ months, 1–2 hrs/wk) 
P1.8 GBP starts ASAP (5–14 day verification clock!) · P1.6b 1-city-per-week · P1.6c/e ongoing · P2.3 · S4/8/9.

**Phase 3 — Conversion Optimization** (~25 hrs, runs parallel to Phase 2b after Phase 2a quick wins) 
C1 Clarity (install FIRST, 30-day data gather) → P1.11 → P1.10 → P1.9b/c/d/e/f → C2–C7. **Exit:** P3.B trending positive.

**Phase 4 — Ad Infrastructure** (~25 hrs, after Phase 3 baseline trending positive) 
P2.19 CallRail · P2.20 Enhanced Conv · P1.12a/b/c · A1/3/4-LP/5/6 · M4. **Exit:** All P4.B targets pass.

**Phase 5 — Launch + Track Ads** (ongoing) 
$10/day dry run × 5 days × 2 channels → scale → optimize on data.

**Critical sequencing rules:**
1. **GBP verification (P1.8) starts on Day 1 of Phase 2b** — verification takes 5–14 days, blocks the 60-day GBP uplift compounding window. Do not delay.
2. **Microsoft Clarity (C1) installs on Day 1 of Phase 3** — needs 30+ days runtime to produce useful heatmaps before P1.10/P1.9 changes ship.
3. **CallRail/DNI (P2.19) must be live before Day 1 of Phase 5** — without it, optimizing ads on 20–40% of conversion signal.
4. **Phase 2b runs parallel with Phase 3** — don't wait for 28-week city content sprint to finish before shipping conversion fixes.
5. **No two phases skip ahead.** Phase 1 must complete (or have ticketed plan) before Phase 2a starts. Phase 4 must NOT start before Phase 3 baseline trending.
