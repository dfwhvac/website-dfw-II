# DFW HVAC — Roadmap

**Last reviewed:** May 22, 2026 (SEC-1-A firewall done; P1.16-url live; SEC-2 shipped; KPI-DASH-AUTO deferred)
**⚠️ Read `memory/00_START_HERE.md` first for the Agent SOP.**

> **Future work only.** Shipped history → [`CHANGELOG.md`](CHANGELOG.md) (baseline: May 21, 2026). Pre-reset agent logs → [`CHANGELOG-legacy-pre-2026-05-21.md`](CHANGELOG-legacy-pre-2026-05-21.md).

**Design source of truth:** `design_guidelines.md`  
**GA4 event names:** `GA4_EVENTS.md` (code registry — do not invent events in this file)

---

## One-line goal

**Organic traffic that converts**, with paid ads as a force multiplier after measurement and conversion foundations are honest.

---

## Priority framework

| Priority | Layer | Outcome |
|---|---|---|
| **P1** | High-performing foundation | Fast, accessible, secure, mobile-perfect |
| **P2** | SEO + AEO | Discoverability (Google, GBP, AI crawlers, Bing/Apple) |
| **P3** | Conversion optimization | More form submits + phone clicks per session |
| **P4** | Ad-measurable infrastructure | Attribution before ad spend |
| **P5** | Launch + track ads | Spend live on ground-truth data |

Advance when the previous layer’s KPIs are measured and trending — not when docs say a tier is “complete.”

---

## KPI gates (measurable “done”)

| Gate | ID | Target / signal | Source |
|---|---|---|---|
| P3 → P4 | **P3-BASELINE** | Key events live (G3–G6); 30d rolling baselines captured for form + phone + thanks + estimator; monthly review shows CR not regressing | GA4 + `POST_DEPLOY_ACTION_ITEMS_PR2.md` |
| P2 AEO | **S3-AEO** | **5+ of 20** baseline queries cite DFW HVAC across engines by **Sep 1, 2026** | `audits/2026-02-28_AEO_Citation_Baseline.md` |
| P4 → P5 | **P5-LAUNCH-GATE** | All prerequisites in P5 section green; **≥60 days** of key-event data (stretch: 80+ days to ad target) | GA4 + CallRail + dry-run checklist |

SEC-2 (estimator `/api/estimator/lead` hardening) shipped May 22, 2026 → see `CHANGELOG.md`.

---

## Active execution queue

Pick from the top. When an item ships, remove it here and add a dated entry to `CHANGELOG.md`.

| # | ID | Item | Owner | Effort |
|---|---|---|---|---|
| 1 | **SEC-1** | Security & data-hygiene — **SEC-1-A done** (geo-block + custom rules removed); remaining: GA4/Clarity non-US filters; Sanity 2FA; SEC-1-C GSC spot-check ~May 29; optional B2/B3 | User + agent | ~20 min user + doc pass |
| 2 | **P3-BASELINE** | Conversion measurement program — finish GA4 key events (G4 `phone_click`, G5 `thanks_page_view`, G6 `estimator_opt_in`); snapshot 7d/30d/60d rates; monthly CR review vs KPI dashboard | User + agent | 1 hr setup + 30 min/mo |
| 3 | **P1.8** | Google Business Profile audit + optimization (verified; needs ongoing Posts/Q&A/photos) | User-led | 20 min + 4 hr initial |
| 4 | **S3-AEO** | Run quarterly AEO citation audit (20 queries × 4 engines); log results in `audits/2026-02-28_AEO_Citation_Baseline.md` — **next due May 31, 2026** | User-led | 2–3 hr/qtr |
| 5 | **F3b** | HSTS Preload List submission (`hstspreload.org`) | User | 10 min |
| 6 | **F12** | GitHub Actions Node 20 → 24 (Dependabot PR or manual bump) | User or agent | 5–10 min |
| 7 | **P1.6f** | Rich Results validation on 7 high-value URLs | User | 30 min |
| 8 | **A3** | GSC re-audit — diff vs Apr 27 indexing baseline | User + agent | 40 min |
| 9 | **P1.10** | Progressive form redesign (2-field → expand) | Agent | 4–6 hr — **hold until Clarity baseline ~Jun 3, 2026** (14d after May 13 CSP fix) |
| 10 | **P1.9b** | Review badge in every page hero (currently partial) | Agent | 2 hr |
| 11 | **P1.9c** | Inline review carousel near every form (currently partial) | Agent | 2 hr |
| 12 | **C4** | Form abandonment tracking — GA4 on field blur | Agent | 1 hr |
| 13 | **P2.19-scope** | CallRail vs Twilio DNI **decision** (not build) — **required before P5-LAUNCH-GATE** | User | 30 min |
| 14 | **C3** | Estimator pricing matrix — real DFW numbers | User → agent | 1 hr — **blocked on user sheet** |
| 15 | **P2.23** | `@sanity/image-url` → `createImageUrlBuilder` named export | Agent | 10 min |
| 16 | **P2.20** | LCP push — code levers shipped; **target &lt;1.25s not met** (~2.7s mobile PSI May 2026) | Agent | As needed |
| 17 | **F13** | Architecture foundation re-audit (quarterly) | Agent | 3.5 hr — due **Aug 4, 2026** |
| 18 | **KPI-DASH-AUTO** | KPI dashboard automation — `vercel metrics` for Speed Insights (replace manual paste); snapshot hardening (CI-only canonical writes + archive fallback for GSC/GA4 when secrets missing); user adds `VERCEL_TOKEN` + project id to GitHub Secrets; one-time **KPI Audit** workflow run to restore Google metrics | Agent + user | 2–3 hr agent · 15 min user |

**Deferred — not blocking P1:** #18. Observability Plus + Speed Insights on `website-dfw-ii-b4zk` confirmed; manual paste still valid for P1 gates until this ships.

## P1 — Foundation (open)

| ID | Item | Owner | Notes |
|---|---|---|---|
| SEC-1-A2 | Vercel Bot Protection | User | **Deferred** — broke KPI audit runner when enabled; leave Off (AI Bots Off for AEO) |
| SEC-1-A4 | GA4 internal traffic filter (non-US) | User | |
| SEC-1-A5 | Clarity geo filter (US only) | User | |
| SEC-1-A6 | Sanity members 2FA + stale member cleanup | User | |
| SEC-1-B2 | Rate-limit `/api/leads` — Vercel Firewall (F1) or Upstash (F2) | User picks | reCAPTCHA `0.7` already shipped |
| SEC-1-B3 | IP-allowlist `/studio` | User picks G1/G2 + IPs | |
| SEC-1-C | Post-deploy: GSC re-request indexing; KPI crawl-to-index check | User + agent | |
| GCP-CLEANUP | Revoke abandoned GA4 service-account keys + org policy revert | User | `GCP_PRIVILEGE_CLEANUP.md` — ~5–8 min |
| F3b | HSTS preload submission | User | Eligibility verified |
| F12 | Node 24 in GitHub Actions | User/agent | Soft deadline Jun 2026 |
| P2.4c | Lighthouse all-green on `/cities-served/plano` + `/request-service` | Agent | |
| P2.7 | Unused dep audit (`depcheck`, dead `mockData.js`) | Agent | |
| P2.15 | Component decomposition (templates &gt;300 lines) | Agent | |
| P2.18 | `cacheComponents` migration | Agent | **Deferred** — see `P2.18_CACHE_COMPONENTS_SPIKE.md` |
| P2.20 | LCP optimization (ongoing) | Agent | See `P2.20_LCP_OPTIMIZATION_PLAN.md` |
| P2.23 | Sanity image-url deprecation fix | Agent | Warning-only today |
| F7 | Lighthouse CI gate (optional) | Agent | |
| P1.3 | Device QA matrix (iOS Safari, Android Chrome, autocomplete) | User | |
| P1.6d | INP field measurement after CrUX qualifies | Agent | Site below CrUX threshold today |
| INFRA-1 | Vercel DNS → per-tenant records (GoDaddy) | User | Low urgency; see legacy ROADMAP for record values |
| **KPI-DASH-AUTO** | Auto-pull Vercel Speed Insights + harden snapshot (see queue #18) | Agent + user | **Deferred** — manual RUM paste OK; Observability Plus enabled |

## P2 — SEO + AEO (open)

| ID | Item | Owner | Cadence |
|---|---|---|---|
| **S3-AEO** | **AEO citation audit** — 20 queries × ChatGPT, Perplexity, Google AI Overviews, Gemini; track citations + source URLs | User-led | Quarterly (May 31, Aug 31, Nov 30, Feb 28); target **5+/20 by Sep 1, 2026** |
| S3-AEO-next | **Next run due May 31, 2026** — first post-baseline measurement | User | Overdue if not run by Jun 7 |
| P1.6f | Rich Results Test on 7 URLs | User | Once |
| A3 | GSC indexing re-audit | User + agent | Once, then monthly glance |
| P1.8 | GBP optimization + weekly Posts | User | Ongoing |
| P1.6e | Review response cadence | User | Ongoing |
| P1.6b | City page unique body copy (28 cities) | Agent drafts → user | 1 city/wk |
| P1.6c | Backlink audit + outreach | Agent + user | Quarterly |
| P2.3 | NAP consistency audit | User-led | Semi-annual |
| S4 | Programmatic SEO opportunity audit | Agent | Once |
| S8 | Featured snippet audit | Agent | Quarterly |
| S9 | Bing Webmaster + Apple Maps Connect | User | Once |
| P2.9 | Blog launch (after city rewrites) | Agent + user | Deferred |
| P2.2 | `/pricing` page | Agent | **Blocked** on user pricing data |
| S10 | Competitor SEO audit | Agent | Quarterly |
| P2.17 | Deprecate Sanity `metaTitle` field | Agent | Low |
| F9 | Live KPI widget on `roadmap-preview.html` | Agent | After 7d RUM |

**User-action queue:** `USER_ACTIONS_2026-02-28.md` (residual P1.6f, A3)

---

## P3 — Conversion (open)

| ID | Item | Owner | Blocker |
|---|---|---|---|
| P1.10 | Progressive form | Agent | Clarity baseline |
| P1.9b | Hero review badges sitewide | Agent | — |
| P1.9c | Carousel adjacent to all LeadForms | Agent | — |
| C4 | Form abandonment events | Agent | — |
| C3 | Real estimator pricing | User → agent | User sheet |
| C5 | A/B testing framework | Agent | Optional |
| P1.9d | City-filtered reviews page | Agent | — |
| **P3-BASELINE** | **Pre-ad conversion baseline** — complete `POST_DEPLOY_ACTION_ITEMS_PR2.md`; record 7d/30d/60d: sessions, `form_submit_lead`, `phone_click`, `thanks_page_view`, `estimator_opt_in`, overall CR; compare monthly to KPI dashboard | User + agent | Blocks honest P3→P4 advance |
| **GA4-G4** | Mark `phone_click` as key event in GA4 Admin | User | Part of P3-BASELINE |
| **GA4-G5** | Mark `thanks_page_view` as key event | User | Part of P3-BASELINE |
| **GA4-G6** | Mark `estimator_opt_in` as key event | User | Part of P3-BASELINE |
| **GA4-G7** | Mark `estimator_complete` as key event (optional) | User | Funnel diagnostics |
| P2.10 | Lead magnets | Agent | Defer until P3 KPIs trend |
| P2.13 | Exit intent | Agent | Defer |
| P2.14 | Urgency signals | Agent | Defer |
| P2.12 | SMS text-back | Agent | Post-ad-launch |

**GA4 registry:** `GA4_EVENTS.md` · **User checklist:** `POST_DEPLOY_ACTION_ITEMS_PR2.md`

---

## P4 — Ad infrastructure (open — gated on P3-BASELINE)

| ID | Item | Owner |
|---|---|---|
| P2.19 | CallRail or Twilio DNI build | Agent + user |
| P2.20-ec | Enhanced Conversions + offline upload | Agent |
| P1.12a | Ad LP template | Agent |
| A4-LP | `/quote-emergency-ac-repair`, `/quote-furnace-replacement`, `/quote-spring-tuneup` | Agent |
| P1.12b | GCLID + UTM → MongoDB | Agent |
| P1.12c | LP Quality Score checklist | Agent + user |
| P2.6 | GTM + Facebook Pixel | Agent |
| A3-fb | FB Conversions API | Agent |
| A5 | UTM naming doc | Agent |
| A6 | Ad budget dashboard (Sheet) | Agent + user |
| M4 | Pre-launch deploy freeze in `RECURRING_MAINTENANCE.md` | Agent |

---

## P5 — Ads launch (gated on P4 + **P5-LAUNCH-GATE**)

**Target window:** ~**July 14, 2026** (12-week runway from Apr 2026 measurement start). Adjust date when P4 infra slips.

### P5-LAUNCH-GATE — prerequisites (all must be green before $1 of Search/FB spend)

| # | Prerequisite | Owner | Ref |
|---|---|---|---|
| 1 | **P3-BASELINE** complete — G3–G6 key events marked; ≥**60 days** of conversion data (stretch **80+** to target date) | User | P3 section |
| 2 | **P2.19** CallRail or Twilio DNI **live** on all `tel:` CTAs (~60–80% of HVAC leads are calls) | Agent + user | P4 |
| 3 | **P2.19-scope** vendor decision documented | User | Active queue #14 |
| 4 | **P2.20-ec** Enhanced Conversions + offline upload tested | Agent | P4 |
| 5 | **A4-LP** three quote LPs built + QS ≥7 lab check | Agent | P4 |
| 6 | **P1.12b** GCLID/UTM → MongoDB on ad traffic | Agent | P4 |
| 7 | **M4** deploy freeze policy in `RECURRING_MAINTENANCE.md` (10 days pre-launch) | Agent | P4 |
| 8 | Dry-run pass: $10/day × 5 days Google + FB — attribution reconciles GA4 ↔ ad platforms | User | L1–L3 (legacy) |

**Launch sequence (after gate):** L1–L2 dry runs → L3 attribution verify → L4 scale winners → L5 cull losers → L7–L10 ongoing (negatives, creative refresh, lead-to-booked, monthly ROI). Detail: `CHANGELOG-legacy-pre-2026-05-21.md` P5 tables · `RECURRING_MAINTENANCE.md`.

**Hard stop:** No spend without CallRail/DNI and key events — Smart Bidding flies blind otherwise.

---

## P6 — Deferred new pages

| ID | Page | Trigger |
|---|---|---|
| PG1 | `/careers` | P3 KPIs trending + P4 infra |
| PG2 | `/referrals` | After PG1 |

---

## Dropped / won't do (unless context changes)

| Item | Reason |
|---|---|
| Dark mode | No HVAC audience ROI |
| P2.8 Video testimonials | Cost vs 145+ text reviews |
| F3c CSP nonce migration | Mozilla Observatory B+ accepted May 14 |
| Next.js 15→16 | **Done** — on Next 16; remove if seen elsewhere |
| F10 Sanity v5 | **Done** — `sanity@^5.26.0` |
| P2.21 review cron → GH Actions | **Done** — `sync-reviews.yml` |
| P2.22 live review count in metadata | **Done** — `generateMetadata()` in `layout.js` |
| KPI-DASH static HTML | **Done** — `frontend/public/internal/kpi-dashboard.html` |
| C1 Clarity install | **Done** — `layout.js` |
| C6/C8/C2/P1.11 | **Done** — see CHANGELOG baseline |
| P1.16-url | **Done** — Wisetack pre-qual URL live in Vercel prod May 22, 2026 |
| SEC-1-A | **Done** — geo-block firewall deleted; no custom Vercel Firewall rules (May 22, 2026) |
| SEC-2 | **Done** — estimator + main lead APIs hardened May 22, 2026 |

---

## Recurring ops

**Full checklist:** `RECURRING_MAINTENANCE.md`

**Quarterly doc hygiene (30 min):** Reconcile ROADMAP open IDs vs `rg` in `frontend/` — any ID open &gt;90 days with code present → close in ROADMAP, note in CHANGELOG.
