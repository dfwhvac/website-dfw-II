# DFW HVAC — Roadmap

**Last reviewed:** May 21, 2026
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

## Active execution queue

Pick from the top. When an item ships, remove it here and add a dated entry to `CHANGELOG.md`.

| # | ID | Item | Owner | Effort |
|---|---|---|---|---|
| 1 | **SEC-1** | Security & data-hygiene — replace deleted geo-block firewall; GA4/Clarity non-US filters; Sanity 2FA audit; optional rate-limit + `/studio` IP allowlist | User + agent | ~30 min user + small PR |
| 2 | **P1.8** | Google Business Profile audit + optimization (verified; needs ongoing Posts/Q&A/photos) | User-led | 20 min + 4 hr initial |
| 3 | **F3b** | HSTS Preload List submission (`hstspreload.org`) | User | 10 min |
| 4 | **F12** | GitHub Actions Node 20 → 24 (Dependabot PR or manual bump) | User or agent | 5–10 min |
| 5 | **P1.6f** | Rich Results validation on 7 high-value URLs | User | 30 min |
| 6 | **A3** | GSC re-audit — diff vs Apr 27 indexing baseline | User + agent | 40 min |
| 7 | **P1.10** | Progressive form redesign (2-field → expand) | Agent | 4–6 hr — **hold until Clarity baseline ~Jun 3, 2026** (14d after May 13 CSP fix) |
| 8 | **P1.9b** | Review badge in every page hero (currently partial) | Agent | 2 hr |
| 9 | **P1.9c** | Inline review carousel near every form (currently partial) | Agent | 2 hr |
| 10 | **C4** | Form abandonment tracking — GA4 on field blur | Agent | 1 hr |
| 11 | **P2.19-scope** | CallRail vs Twilio DNI **decision** (not build) | User | 30 min |
| 12 | **C3** | Estimator pricing matrix — real DFW numbers | User → agent | 1 hr — **blocked on user sheet** |
| 13 | **P1.16-url** | Wisetack live merchant URL (`NEXT_PUBLIC_WISETACK_APPLY_URL`) | User | 5 min |
| 14 | **P2.23** | `@sanity/image-url` → `createImageUrlBuilder` named export | Agent | 10 min |
| 15 | **P2.20** | LCP push — code levers shipped; **target &lt;1.25s not met** (~2.7s mobile PSI May 2026) | Agent | As needed |
| 16 | **F13** | Architecture foundation re-audit (quarterly) | Agent | 3.5 hr — due **Aug 4, 2026** |

---

## P1 — Foundation (open)

| ID | Item | Owner | Notes |
|---|---|---|---|
| SEC-1-A | Delete “Block Non-US Traffic” Vercel Firewall rule (not just disable) | User | See SEC-1 substeps in legacy ROADMAP / user actions |
| SEC-1-A2 | Vercel Bot Protection | User | **Deferred** — broke KPI audit runner when enabled |
| SEC-1-A4 | GA4 internal traffic filter (non-US) | User | |
| SEC-1-A5 | Clarity geo filter (US only) | User | |
| SEC-1-A6 | Sanity members 2FA + stale member cleanup | User | |
| SEC-1-B2 | Rate-limit `/api/leads` — Vercel Firewall (F1) or Upstash (F2) | User picks | reCAPTCHA `0.7` already shipped |
| SEC-1-B3 | IP-allowlist `/studio` | User picks G1/G2 + IPs | |
| SEC-1-C | Post-deploy: GSC re-request indexing; KPI crawl-to-index check | User + agent | |
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

---

## P2 — SEO + AEO (open)

| ID | Item | Owner | Cadence |
|---|---|---|---|
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
| P1.16-url | Live Wisetack apply link | User | Merchant URL |
| C5 | A/B testing framework | Agent | Optional |
| P1.9d | City-filtered reviews page | Agent | — |
| P2.10 | Lead magnets | Agent | Defer until P3 KPIs trend |
| P2.13 | Exit intent | Agent | Defer |
| P2.14 | Urgency signals | Agent | Defer |
| P2.12 | SMS text-back | Agent | Post-ad-launch |

**GA4 user actions (not code):** Mark `thanks_page_view`, `estimator_opt_in` as key events when ready — see `GA4_EVENTS.md` and `POST_DEPLOY_ACTION_ITEMS_PR2.md`.

---

## P4 — Ad infrastructure (open — gated on P3 baseline)

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

## P5 — Ads launch (gated on P4)

Dry run → scale → optimize. See legacy ROADMAP / `RECURRING_MAINTENANCE.md` for L1–L10 detail. **Do not start spend without CallRail/DNI (P2.19) and key events live.**

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

---

## Recurring ops

**Full checklist:** `RECURRING_MAINTENANCE.md`

**Quarterly doc hygiene (30 min):** Reconcile ROADMAP open IDs vs `rg` in `frontend/` — any ID open &gt;90 days with code present → close in ROADMAP, note in CHANGELOG.
