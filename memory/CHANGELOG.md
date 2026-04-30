# DFW HVAC — Changelog

**Last reviewed:** February 28, 2026
**⚠️ Read `/app/memory/00_START_HERE.md` first for the Agent SOP.**

Reverse-chronological record of everything shipped to production. When adding entries, append to the top of the appropriate session block (newest first).

---

## February 28, 2026 — Phase 1 + 2a finishing sprint

Six agent-shipped items + three user-action checklists closing out **Phase 1 (~95% complete)** and **Phase 2a (100% complete, 12/12)**. Total agent build time: ~5 hrs.

### P3-a11y — Skip-to-main link (WCAG 2.1 SC 2.4.1)
- New `.skip-link` CSS rule in `app/globals.css` (visually hidden until keyboard-focused, snaps in with prussian-blue background + growth-green outline).
- New skip link `<a href="#main-content">Skip to main content</a>` injected as the first focusable element in `<body>` of `app/layout.js`. `{children}` wrapped in `<div id="main-content" tabIndex={-1}>` so it works regardless of any internal page's own `<main>` structure.
- Pushes Lighthouse Accessibility toward 100 sitewide; lets screen-reader and keyboard-only users bypass the global header nav.

### F6 — 404 page UX upgrade
- Added a second 4-link grid below the existing popular-pages grid in `app/not-found.jsx`: **Replacement Estimator**, **0% Financing**, **Repair or Replace?**, **FAQ**. Filled-prussian-blue style differentiates it from the white outline-style "Home / Services / Cities / Reviews" grid above.
- Surfaces the Apr 24 funnel cluster (financing + replacement + decision-guide) so a 404 visitor lands on a revenue page instead of bouncing.
- All 4 new links ship with `data-testid` values for analytics segmentation if/when we want to track 404→funnel conversion.
- Page bundle still tiny (404 not in the sitemap, won't affect First-Load JS budgets on indexed pages).

### F8 — Dependabot config + gitleaks GitHub Action
- New `.github/dependabot.yml`: weekly Monday 8 AM Central npm grouped updates (production-deps + development-deps), open-PR limit 5, security advisories fire as individual PRs (Dependabot default behavior). `@sanity/*` major bumps ignored as accepted risk per Apr 21 audit.
- New `.github/workflows/security.yml`: runs gitleaks on every push to main/preview + every PR + weekly Monday cron. Uses default ruleset (AWS, GCP, Azure, Stripe, Slack, GitHub PAT, SSH keys, generic high-entropy strings).

### F3d — `yarn audit` CI gate
- Same `security.yml` workflow runs `yarn audit --groups dependencies --level high` on every push/PR/cron. Bitwise exit-code parsing fails the build only on **high (4)** or **critical (8)** advisories — moderate/low never block. Sanity Studio dev advisories are scoped out via `--groups dependencies`.

### F4 — Backup & DR checklist
- New canonical doc `/app/memory/BACKUP_AND_DR.md`: 4 state stores (GitHub, Sanity dataset, MongoDB Atlas, Vercel config) × RTO/RPO targets × backup procedure × recovery runbook for 5 disaster scenarios. Annual DR-drill protocol + emergency contacts quick-reference card included.

### S3 — AEO citation tracking baseline
- New audit doc `/app/memory/audits/2026-02-28_AEO_Citation_Baseline.md`: 20 queries categorized into Locational/Transactional (8), Decision-Framework (6), Educational/Informational (6). Methodology covers all 4 major answer engines (ChatGPT, Perplexity, Google AI Overviews, Gemini) with quarterly re-run cadence. Phase 2 KPI target: 5+ of 20 queries cite DFW HVAC by Sep 1, 2026.

### P1.5 — GSC weekly trend doc
- New audit doc `/app/memory/audits/2026-02-28_GSC_Weekly_Trend.md`: weekly 5-min glance template + monthly 30-min deep-dive sections + top-10-priority-queries position-tracker + quarterly comparison anchor table. Red-flag triggers documented (impressions drop >20% wk-over-wk, position drop >2 places, GSC errors flagged).

### User-action checklists
- New consolidated doc `/app/memory/USER_ACTIONS_2026-02-28.md` covering the 3 user tasks (~50 min total): **P1.6f** Rich Results validation on 7 URLs · **A3** May 5 GSC re-audit · **F3b** HSTS Preload submission to hstspreload.org. Each has step-by-step instructions, expected outcomes, and rollback considerations.

### ROADMAP updates
- P1.A: 6 new shipped rows (P3-a11y, F6, F4, F8, F3d) — the agent items in this sprint.
- P1.D: trimmed from 13 pending items → 8 pending items (closes P3-a11y, F6, F4, F8, F3d). F3b moved to top of remaining list as user-action ready.
- P2.A: 3 new shipped rows (S3 baseline doc, P1.5 trend doc, sitemap parity 51/51 confirmed).
- P2.D Phase 2a: marked **COMPLETE 12/12**, P1.6f + A3 moved to user-action queue.

### Verification
- `yarn build`: clean, 22.34s, no regressions. All 51 sitemap routes still ship correct sizes.
- Skip link verified live at `/`: `class="skip-link"` + `id="main-content"` + `Skip to main content` text all present in rendered HTML.
- 404 page verified at `/this-page-does-not-exist`: HTTP 404, 27 KB rendered (vs prior ~13 KB), all 4 new funnel links + their `data-testid` attributes in payload, all 4 original links retained.
- YAML files validated via `python3 -c "import yaml; yaml.safe_load(...)"` for both `dependabot.yml` and `security.yml`.

### Files shipped
- `app/globals.css` (`.skip-link` block)
- `app/layout.js` (skip-link element + `#main-content` wrapper)
- `app/not-found.jsx` (4 funnel-cluster links + testids)
- `.github/dependabot.yml` (new)
- `.github/workflows/security.yml` (new)
- `memory/BACKUP_AND_DR.md` (new)
- `memory/audits/2026-02-28_AEO_Citation_Baseline.md` (new)
- `memory/audits/2026-02-28_GSC_Weekly_Trend.md` (new)
- `memory/USER_ACTIONS_2026-02-28.md` (new)
- `memory/ROADMAP.md` (updated)

### Next user actions
1. Push to main → Vercel deploys. Confirm `/` still shows skip-link element on Tab keypress, confirm `/this-page-does-not-exist` shows the 6-link 404. Confirm GitHub picks up `.github/` configs (Repo → Insights → Dependency Graph + Repo → Security → Code scanning).
2. Walk through `USER_ACTIONS_2026-02-28.md` (~50 min): Rich Results, GSC re-audit, HSTS Preload submission.
3. Once those land, **Phase 1+2a are formally closed.** Next batch: Phase 3 conversion (C7 + C8) or Phase 2b kickoff (P1.8 GBP optimization — 5–14 day verification clock recommended starting ASAP).

---

## February 28, 2026 — Phase 2a finish + Phase 3 first ship

### A4 (round 2) — Commercial-cooling and commercial-maintenance differentiation
- Same Sanity-vacuum issue that hit `commercial-heating` on Apr 27 was still live on `commercial-air-conditioning` and `commercial-maintenance` (only `title`/`description`/`heroBenefits` populated; every other field rendering generic template fallbacks). Both were near-duplicates to their residential siblings in Google's eyes.
- Mirrored the Apr 27 `patch-commercial-heating.js` pattern with two new idempotent scripts: `frontend/scripts/patch-commercial-cooling.js` and `frontend/scripts/patch-commercial-maintenance.js`. Each writes 12 fields of differentiated B2B-keyword-rich content: cooling targets RTUs, chillers, VRF/VRV, EPA 608, mini-splits, refrigerant compliance; maintenance targets PM contracts, NTE thresholds, equipment inventories, priority dispatch, COIs, season-aware checklists.
- Both pages now ship 6 service-specific FAQs each → automatically FAQPage-schema eligible via the existing `ServiceTemplate` conditional.
- Verified live: cooling renders "Commercial AC Emergency Response", "EPA 608", "Refrigerant leak detection"; maintenance renders "Priority Dispatch for PM Contract", "Spring cooling-season tune-ups", "equipment inventory".
- Phase 2a content cluster (commercial-heating, commercial-cooling, commercial-maintenance) now fully populated. Should clear the duplicate-content rejection signal for the entire commercial silo on the next GSC re-audit.

### P1.11 — `/thanks` post-submit page + Resend customer auto-reply
- New route `app/thanks/page.jsx` (server component) + `app/thanks/ThanksAnalytics.jsx` (small client component for GA4). Server-rendered, `noindex, follow` robots tag (post-conversion landmark, not an SEO target — but we want crawlers to follow internal links back into the site).
- Three dynamic copy variants by `?type=` querystring: `service`, `estimate`, `contact`, `estimator`. Each variant gets a tailored badge, headline, and 1-business-hour expectation line. Falls back to `service` for unknown values.
- Page sections: confirmation hero (gradient, badge, dynamic headline, prominent red phone CTA, queue-skip subhead) → "What happens next" 3-card explainer (call within 1 hr, same-day DFW, honest quote) → "While you wait" 4-link grid (`/repair-or-replace`, `/financing`, `/replacement-estimator`, `/reviews`) → back-to-home link.
- `LeadForm.jsx` and `SimpleContactForm.jsx` now `router.push('/thanks?type={leadType}')` after successful submit. Both still fire `form_submit_lead` GA4 event before redirecting, so the conversion event is captured even if the redirect fails.
- `ThanksAnalytics` fires a new `thanks_page_view` GA4 event on hydration with `lead_type` param — durable conversion landmark complementing `form_submit_lead`. Surfaces in P5.L6 ("Toggle remaining GA4 key events as they fire").
- `app/api/leads/route.js` now sends a customer-facing auto-reply via Resend immediately after the internal lead notification. Plain CAN-SPAM-clean template: brand header, `Hi {firstName}` greeting, type-aware response-time copy, prominent click-to-call button, three-generation family pull-quote, NAP + license # footer. Wrapped in its own try/catch — if the customer email is malformed/bounced, the internal lead notification is unaffected. Same preview-env `IS_PRODUCTION_DEPLOY` guard as the internal email (preview branches and `localhost` skip Resend entirely; lead still persists to MongoDB).
- Verified locally: `POST /api/leads` returns `{success:true, lead_id}`, MongoDB lead persisted, log line confirms Resend skipped on local. `/thanks?type=service|estimate|contact` all render correctly with `<meta name="robots" content="noindex, follow"/>`.

---

## April 27, 2026 — Phase 2a SEO/AEO Quick Wins shipped (Batch 1 + 2)

**8 of 12 Phase 2a items shipped in one pass.** Remaining 4 require user data (GSC export, AEO query runs) or calendar-gated re-audit; queued for Phase 2a residual work.

### A4 + P1.4 — Commercial-heating differentiation
- Sanity `commercial-heating` document was 75% empty (only 4 of 16 fields populated). Page was rendering near-duplicate to siblings; the single URL Google explicitly rejected ("Crawled — currently not indexed") in the Apr 27 indexing audit.
- Created `frontend/scripts/patch-commercial-heating.js` (idempotent, dotenv-based) and committed 12 fields of differentiated, B2B-keyword-rich commercial-only content: 5 hero benefits (RTU, after-hours, multi-zone, COIs), 8 what-we-do items (RTUs, gas-fired furnaces, boilers, VAV, BACnet), 5 process steps (triage, on-site diagnosis, NTE-friendly written quote, repair/staged replacement, handoff), 6 why-choose-us, dedicated emergency block, **6 commercial-only FAQs** (after-hours, COIs, NTE thresholds, response time, contracts).
- ServiceTemplate page at `app/services/[category]/[slug]/page.jsx` now imports `FAQSchema` and conditionally emits `FAQPage` JSON-LD when the service has FAQs — **all service pages with FAQs are now FAQPage rich-result eligible** (commercial-heating immediately benefits with 6 questions).
- Verified live: 9 distinct commercial-only phrases (rooftop, RTU, boiler, NTE, VAV, after-hours, COI, property manager, three-generation) confirmed in rendered HTML.

### S1 — AI crawler `robots.txt` opened up
- `app/robots.js` rewritten. Default `User-agent: *` retains the prior allow/disallow list. Added 15 named UAs with explicit `Allow: /` blocks: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Bytespider, Diffbot, FacebookBot, Meta-ExternalAgent.
- Posture: most agencies block these by default. We choose visibility — AI answer engines are an emerging top-of-funnel channel for "hvac contractor near me" / "best ac repair dallas" queries. Self-documenting comment in code lays out reversal procedure if business decision changes.

### S2 — Schema completion
- `/replacement-estimator` gained two new JSON-LD blocks: **WebApplication** (signals interactive in-browser tool, `applicationCategory: UtilitiesApplication`, `isAccessibleForFree: true`, `audience` scoped to DFW homeowners) and **HowTo** (6-step procedure: home size → system type → tier → SEER2 → ductwork → see range; `totalTime: PT1M`, `estimatedCost: $6k–$25k`).
- FAQPage now emitted from `ServiceTemplate` (see A4 above).
- All schemas validated via Python `json.loads()` post-render: commercial-heating now ships 4 valid JSON-LD blocks (HVACBusiness, Service, FAQPage with 6 Q's, BreadcrumbList); estimator ships 3 (BreadcrumbList, WebApplication, HowTo with 6 steps).

### S5 — Alt-text audit
- Sitewide grep for `<img>` tags and empty `alt=""` returned ZERO matches. Codebase already passes — all images use Next.js `<Image>` with non-empty alt. Closed.

### S6 — OG / Twitter card defaults enriched
- `lib/metadata.js` `defaultMetadata.openGraph` and `defaultMetadata.twitter` now include default `images` (1200×630, alt set), `url`, `siteName`, `locale`, default title + description, `twitter.card: 'summary_large_image'`, `twitter.site` + `twitter.creator`. Pages that don't call `buildPageMetadata()` now produce complete cards on Facebook/LinkedIn/Slack/iMessage shares.
- Verified live on `/`: 7 `og:*` meta tags + 4 `twitter:*` meta tags rendered correctly.

### S7 — Sitemap lastmod tiering
- `app/sitemap.js`: pinned `POLICY_LASTMOD = '2026-04-27T00:00:00.000Z'` constant for `/privacy-policy` and `/terms-of-service`. Reason: when EVERY URL in a sitemap shows lastmod = today, Google's sitemap parser tends to ignore lastmod as a freshness signal. Tiering preserves the signal for pages that genuinely changed.
- Sitemap still emits 51 URLs total. Sanity-driven pages keep using `_updatedAt`.

### P2.1 — "50+ cities" copy cleanup
- False alarm. Sitewide grep for "50+" surfaces only "50+ Years of Family Legacy" — accurate (three-generation family business). No claims about city count to fix. Closed.

### Files touched (memory only — code already deployed)
- `frontend/app/robots.js` (rewrite)
- `frontend/app/replacement-estimator/page.jsx` (+ WebApplication + HowTo schema)
- `frontend/app/services/[category]/[slug]/page.jsx` (+ conditional FAQPage)
- `frontend/lib/metadata.js` (defaultMetadata enriched)
- `frontend/app/sitemap.js` (POLICY_LASTMOD tier)
- `frontend/scripts/patch-commercial-heating.js` (new, run once)

---

## April 27, 2026 — F3 verified live + `X-Powered-By` stripped

- **SecurityHeaders.com graded `https://dfwhvac.com` an `A`** post-deploy (capped at A solely by the documented `unsafe-inline`/`unsafe-eval` accepted-risk warning on `script-src`). Path to A+ is the queued **F3c** ticket (CSP nonce migration via Next.js middleware).
- **`poweredByHeader: false` shipped** in `next.config.js` to strip the `X-Powered-By: Next.js` framework-fingerprint leak that the same report flagged. Trivial defense-in-depth.
- **Re-verified live Apr 27, 20:24 UTC** — securityheaders.com Raw Headers no longer list `x-powered-by`; "Additional Information" hardening tip for it has dropped off the report.
- **C8 ticket added to ROADMAP.md** Priority 3 — "🔒 Secured" footer trust microcopy (30 min, soft trust signal targeting hesitant homeowners on financing/contact forms).
- **KPI Baseline §1.5 updated** — Grade A logged as the post-F3 baseline; `X-Powered-By` row updated with verification timestamp.

---

## April 27, 2026 — F3 Security Headers Hardened

- **`next.config.js` `headers()` upgraded.** Closes the gaps surfaced in the F3 audit on the live `https://dfwhvac.com` response. SecurityHeaders.com / Mozilla Observatory grade target: **A+ / A**.
- **HSTS hardened to `max-age=63072000; includeSubDomains; preload`** (2 yr + apex+subdomains + preload-list eligible). Was previously `max-age=63072000` only (Vercel default).
- **Cross-Origin-Opener-Policy: `same-origin`** added — blocks Spectre-class side-channel + cross-tab `window.opener` tabnapping.
- **Cross-Origin-Resource-Policy: `same-site`** added — prevents same-document cross-origin asset leaks. Avoids `same-origin` because Next.js `_next/*` chunks are served from the same site but technically separate origins on Vercel.
- **CSP extended:**
  - `frame-ancestors 'none'` — clickjacking lockdown (CSP-level; supersedes legacy `X-Frame-Options: DENY` which is retained for IE/legacy UA defense-in-depth).
  - `form-action 'self'` — locks down POST destinations to first-party only.
  - `upgrade-insecure-requests` — auto-upgrades any stray `http://` resource references to HTTPS.
  - `connect-src` extended for `vitals.vercel-insights.com` + `vercel.live` so Speed Insights RUM beacon doesn't trigger CSP violations now that `@vercel/speed-insights` is installed.
- **COEP intentionally omitted.** `require-corp` would break Google Maps tiles, GTM, Sanity CDN, RealWorkLabs review widget. Documented as accepted architectural risk in `audits/2026-04-27_KPI_Baseline.md` §1.5.
- **`unsafe-inline` + `unsafe-eval` retained on `script-src`.** Required by Next.js inline RSC payloads + GTM. Tracked as accepted risk; future migration path = nonce-based CSP via Next.js middleware (queued as **F3c** in roadmap, Phase 4 candidate).
- **Verified locally:** `curl -I http://localhost:3000` returns all 9 hardened headers cleanly. Build time 19.15s (no regression).
- **KPI Baseline §1.5 added** — captures SecurityHeaders/Observatory/SSL Labs grade targets, dependency-vuln target (0 high+), gitleaks target (0), reCAPTCHA score threshold, and lead-form rate-limit gap.
- **Roadmap updated:** F3 marked shipped in P1.A. New P1.D action items queued: **F3b** (HSTS Preload List submission once headers verified live for 30+ days, user task), **F3c** (CSP nonce migration to retire `unsafe-inline`), **F3d** (`yarn audit` CI gate). Quarterly cadence in P1.C extended to require SecurityHeaders/Observatory/SSL Labs re-grade + CSP review + gitleaks scan.
- **Files touched:** `frontend/next.config.js`, `memory/audits/2026-04-27_KPI_Baseline.md`, `memory/ROADMAP.md`, `memory/CHANGELOG.md`.

---

### April 24, 2026 — P1.17a GSC indexing — Day 3 sprint executed

- **User submitted Day 3 batch to Google Search Console URL Inspector** — 10 URLs total. From the planned Day 3 list: 9 of 10 went through, `cities-served/grapevine` was already indexed (no submission needed). Slot freed by grapevine was used to promote `cities-served/colleyville` from Day 4.
- **Submitted (10):** `/services/commercial/commercial-heating`, `/cities-served/argyle`, `/recent-projects`, `/cities-served/north-richland-hills`, `/cities-served/hurst`, `/cities-served/carrollton`, `/cities-served/flower-mound`, `/cities-served/euless`, `/cities-served/bedford`, `/cities-served/colleyville`.
- **Confirmed indexed without submission:** `/cities-served/grapevine` (joins `/cities-served/lewisville` from 4/23 as the second self-indexed city).
- **Running totals:** 29 of 47 sitemap URLs submitted (62%); 2 confirmed-indexed-without-submission; 16 remaining (5 Day-4 leftovers + 4 brand-new Apr 24 pages awaiting merge + 7 to-spot-check).
- **Tracker updated:** `/app/memory/audits/2026-04-23_GSC_Indexing_Tracker.md` — Day 3 results logged, Day 4 bucket reorganized with the 4 brand-new Apr 24 URLs queued behind the 5 leftover entries, running summary table refreshed.

## April 24, 2026 — P1.14 `/replacement-estimator` shipped (scope-narrowed MVP)

- **Interactive 5-field cost estimator** shipped to the `preview` branch. Route: `/replacement-estimator` (top-level, keyword-rich URL per user direction). Scope narrowed per user request from the original 4-flow plan to **replacement-only**: service-call, repair, and maintenance calculators deferred to future P2. No PDF generation. **Option C hybrid:** range displays on screen immediately, soft opt-in ("Book my free on-site estimate") appears below the range for voluntary lead capture.
- **Wizard UX:** server-component shell with client `EstimatorWizard.jsx` for state. Progress bar across the top (`Step N of 5 · XX% complete`), question card with help copy, radio-group styled as large touch targets with selected-state animations. Back button active from step 2 onward. Final step CTA says "See My Range" with a calculating-spinner loading state. Error state on validation failure.
- **5 questions:** Home sqft (5 buckets) → System type (6 options incl. "not sure") → Equipment tier (value/standard/premium/not sure) → Efficiency SEER2 (baseline/mid/high/not sure) → Ductwork condition (5 options incl. "don't know"). All fields include a "not sure" escape so the wizard never dead-ends a user.
- **Results screen:** 3 sections stacked. (1) **Range hero** — navy-to-cyan gradient background with giant lime-accented `$X,XXX – $Y,YYY` figure, "Based on your answers" caption, disclaimer. (2) **"Why we gave you this range"** — factor-by-factor breakdown of the 5 inputs (builds trust, explains the variance). (3) **CTAs grid** — 3 buttons: Book Free Written Estimate (routes to `/estimate`) · Call (972) 777-COOL · See Financing Options (routes to `/financing`). Below the grid: **soft opt-in accordion** that expands into a 3-field form (first name + phone required, email optional). Submitted state shows a green lime confirmation card. "Start over with different answers" reset button at the bottom.
- **Pricing matrix:** kept server-side in `/app/frontend/lib/estimator-matrix.js`. Six sections (A: sqft→tonnage, B: system-type base $/ton, C: stage multiplier, D: SEER flat-add, E: duct condition low/high add, F: global ±8% variance band). Example for 4-ton standard-matched mid-SEER older-OK-ducts: **$11,800 – $19,400** (verified via curl). Current values are conservative DFW-market placeholders; user will override with their own numbers via the Google Sheet template.
- **Pricing matrix Google Sheet template** shipped at `/app/memory/ESTIMATOR_PRICING_SHEET_TEMPLATE.md`. Six tables mapping 1:1 to the six sections of `estimator-matrix.js`, worked example showing how the numbers combine, edit checklist for the user. Total user edit time: ~30 minutes. Agent re-imports into the matrix file, rebuilds, user verifies on preview.
- **API routes:**
  - `POST /api/estimator/calculate` — validates all 5 inputs against server-side enum sets, rejects unknown keys, returns `{ low, high, tonnage, breakdown }`. Pricing matrix never touches the client bundle.
  - `POST /api/estimator/lead` — soft opt-in save. Minimal required fields (firstName + phone); email + estimate + wizard-answers are optional/bundled. Persists to MongoDB `leads` collection with `leadType: 'estimator_replacement'`. Preview-env guard (same `SHOULD_SEND_LEAD_EMAIL` pattern as `/api/leads`) skips Resend on non-production. Rich HTML email on production containing contact, range, tonnage, and full wizard answer trace for the tech prepping the on-site visit.
- **GA4 events added:** `estimator_complete` fires on range display (not key event yet — mark when ingested, ~24–48 hr lag). `estimator_opt_in` fires when soft-opt-in form submits (same note). Both gated by `typeof window.gtag === 'function'` — preview-env guard already mutes them on non-production hostnames.
- **Cross-linking:** `/services/system-replacement` gained a prominent lime "See Your Replacement Cost Range →" CTA below the "Is it time to replace?" signal grid, with "Free instant estimator · No email required · Under 60 seconds" subtext. `/repair-or-replace` final-CTA section gained a third inline link "Try our replacement estimator →" alongside the existing system-replacement and financing links. Both cross-links verified live via curl.
- **Sitemap updated:** `/replacement-estimator` registered at priority 0.8 (high — competes with `/estimate` for interactive-tool keyword cluster).
- **Color-coded sitemap** (`/public/sitemap-preview.html`) updated: four original estimator sub-flows (`/estimator/service-call`, `/repair`, `/replacement`, `/maintenance`, `/results/[id]`) collapsed into the single `/replacement-estimator` row marked 🟢 LIVE; two API routes marked 🟢 LIVE; summary table updated (shipped count: 3 → 4; remaining: 7 → 3); header meta strip + footer timestamp bumped.
- **Nav deferred** per plan: Header reorg with "Planning to Replace?" grouped dropdown deferred to a follow-up PR to avoid shipping mid-progress. Footer already covers estimator discovery via "Our Services" → "System Replacement" (which now cross-links to the estimator). Direct `/replacement-estimator` discovery routes available via sitemap, cross-links from 2 existing Apr 24 pages, and the footer path.
- **Verified:** `next build` clean — `/replacement-estimator` at 7.31 kB route / 133 kB first-load JS (well under 180 kB pre-merge gate). HTTP 200 + correct title. API calc returns sensible ranges + validates inputs (rejects unknown enum values with a clear error message). API lead POST persists to Mongo + skips Resend on preview (guard working). ESLint clean on all 4 new files. Screenshot confirms hero composition, progress bar, and radio group styling.
- **Files shipped:**
  - `/app/frontend/lib/estimator-matrix.js` (new, 97 lines — server-only pricing config)
  - `/app/frontend/app/api/estimator/calculate/route.js` (new, 42 lines)
  - `/app/frontend/app/api/estimator/lead/route.js` (new, 121 lines)
  - `/app/frontend/app/replacement-estimator/page.jsx` (new, 47 lines — server shell)
  - `/app/frontend/app/replacement-estimator/EstimatorWizard.jsx` (new, 411 lines — client wizard + results + opt-in)
  - `/app/frontend/app/sitemap.js` (entry added)
  - `/app/frontend/public/sitemap-preview.html` (updated)
  - `/app/frontend/app/services/system-replacement/page.jsx` (prominent lime estimator CTA added)
  - `/app/frontend/app/repair-or-replace/page.jsx` (third inline cross-link added)
  - `/app/memory/ESTIMATOR_PRICING_SHEET_TEMPLATE.md` (new, Google Sheet template for the user)

- **Next user actions:**
  1. Push `preview` branch to GitHub → Vercel auto-builds a fresh preview deploy covering today's full stack (5 pages + 3 APIs + guards + sitemap + FAQ rewrite + cross-links).
  2. QA `/replacement-estimator` on phone + desktop: run through 3–5 answer combinations, confirm ranges feel credible for DFW, verify soft opt-in form submits without sending an email (preview env guard).
  3. Open `/app/memory/ESTIMATOR_PRICING_SHEET_TEMPLATE.md` and fill the 6 tables with your real numbers. Send back. Agent imports, you verify, merge.
  4. When `estimator_complete` appears in GA4 Events (24–48 hrs after first preview QA submission with `FORCE_LEAD_EMAIL_IN_PREVIEW=true`, or after merge to prod), flip "Mark as key event" toggle.

## April 24, 2026 — P1.13 `/services/system-replacement` + P1.15 `/repair-or-replace` shipped

- **Two new revenue-center pages** shipped together. Both follow the exact same architecture pattern as `/financing` (server component, Sanity fallback for companyInfo, Option C review-badge title, BreadcrumbList schema, footer integration, sitemap entry, `dynamic = 'force-dynamic'`). They cross-link to each other and both funnel into `/estimate` + `/financing` for conversion.

- **`/services/system-replacement`** (P1.13) — the replacement revenue center. 10 sections: hero with dual CTA → "Is it time to replace?" 6-signal grid → "What affects the cost" 6-factor value-proof block (no $ figures, per user pricing-not-published constraint) → 4-step replacement process → 24-month 0% financing preview linking to `/financing` → 12-city service area strip with `/cities-served` link → 5-question replacement FAQ → final dual-CTA. Title: `HVAC System Replacement — Free Written Estimate | 147 Five-Star Reviews | DFW HVAC`. Priority 0.9 in sitemap (highest-ticket page). Route at `/services/system-replacement/page.jsx` — Next.js static-segment priority ensures it wins over the dynamic `[category]/[slug]` route.

- **`/repair-or-replace`** (P1.15) — AEO decision-framework article. 7 sections: hero → lime-strip "Short Answer" TL;DR → "5 Signs It's Time to Replace" numbered list → cost-benefit age-bracket table (0–7 / 8–11 / 12–15 / 16+ years) → 5-step decision flow with ✓/✗ visual branches → "Still uncertain?" free-estimate callout → 6-question FAQ → final CTA with inline cross-links to `/services/system-replacement` + `/financing`. Title: `Repair or Replace Your HVAC? A DFW Decision Guide | 147 Five-Star Reviews | DFW HVAC`. Schema: `Article` + `FAQPage` (via `FAQSchema` helper) + `BreadcrumbList`. Priority 0.7. Route at top level `/repair-or-replace/page.jsx` for SEO clarity (matches the raw search query).

- **Cross-linking shipped:** `/services/system-replacement` has "Not sure yet? Use our repair-or-replace decision guide →" below the 6-signal grid; `/repair-or-replace` has two cross-links below the final CTA ("Explore system replacement →" and "See financing options →"). Closes the replacement-consideration funnel.

- **Legacy-redirect update:** `next.config.js` — `/installation` now 308-redirects to `/services/system-replacement` (previously pointed to `/estimate` as a placeholder). Old `TODO` comment removed. `/ducting` stays at `/estimate` until a dedicated duct page ships (future P2). Verified live: `curl /installation → HTTP 308 location: /services/system-replacement`.

- **Footer updated:** "Our Services" section gained "System Replacement"; "Quick Links" gained "Repair or Replace?". Both live sitewide on every page.

- **Sitemap updated:** Both pages registered with appropriate priorities (0.9 / 0.7) and monthly change frequency.

- **Verified:** `next build` clean — `/services/system-replacement` and `/repair-or-replace` both at 1.87 kB / 127 kB first-load JS (identical to `/financing`). HTTP 200 + title + sitemap + redirect all confirmed via curl. Desktop screenshots at 1920×800 confirm hero composition, lime-on-navy emphasis treatment, and decision-flow visual branching. ESLint clean on both files.

- **Shipped on existing `preview` branch** (stacked with `/financing`, preview-env guards, and FAQ rp3 rewrite). Next push to `preview` will trigger a fresh Vercel preview deploy covering all 5 changes.

- **Files shipped:**
  - `/app/frontend/app/services/system-replacement/page.jsx` (new, 332 lines)
  - `/app/frontend/app/repair-or-replace/page.jsx` (new, 376 lines)
  - `/app/frontend/app/sitemap.js` (2 entries added)
  - `/app/frontend/components/Footer.jsx` (2 links added)
  - `/app/frontend/next.config.js` (`/installation` target updated, TODO removed)

- **Expected SEO impact:** `/repair-or-replace` targets a top-volume AEO decision-framework query ("should I repair or replace my ac/hvac/furnace") with structured answers, tables, flow steps, and `Article`+`FAQPage` schema — high odds of AI Overview citation. `/services/system-replacement` captures the highest-ticket commercial-investigation queries ("hvac replacement dallas", "new furnace dfw", "ac replacement cost") and now has a proper conversion page rather than dumping traffic into the generic `/estimate` form. The two pages combine with `/financing` to form a complete replacement funnel (decision → page → financing → estimate).

- **Next user actions:**
  1. Push to GitHub `preview` branch (via Save to Github) → Vercel auto-builds a new preview URL.
  2. QA the new routes: `/services/system-replacement`, `/repair-or-replace`, `/installation` (should 308 redirect).
  3. Verify `/repair-or-replace` passes the [Google Rich Results Test](https://search.google.com/test/rich-results) for `Article` + `FAQPage` schemas — AI Overview eligibility depends on this.
  4. Merge `preview` → `main` (single merge ships all 5 Apr 24 changes together).
  5. Submit both new URLs to GSC URL Inspector for indexing (continues the P1.17a sprint).

## April 24, 2026 — P1.16 sandbox deploy live, awaiting user QA

- **Pushed `/financing` to a `preview` branch** on GitHub (`dfwhvac/website-dfw-II`). Vercel auto-built the preview deployment (visible in the repo's Deployments sidebar, 5 min after push). Preview URL pattern: `https://website-dfw-ii-git-preview-<team>.vercel.app/financing`.
- **Session paused here** — user will resume QA on the preview URL on their own schedule. No code changes pending on this branch; guards + financing page + FAQ link all bundled in the same branch push.
- **What's on `preview` branch but NOT yet on `main`:**
  1. GA4 preview-env guard (`app/layout.js` — `ga-preview-guard` script)
  2. Resend preview-env guard (`app/api/leads/route.js` — `SHOULD_SEND_LEAD_EMAIL` check)
  3. `/financing` page (`app/financing/page.jsx` + sitemap entry + footer Quick Links entry)
  4. FAQ rp3 Wisetack rewrite + internal link to `/financing` (`app/faq/page.jsx` override + generalized `FAQAccordion.jsx` link rules)
- **When user resumes, next steps in order:**
  1. User opens preview URL → QAs `/financing`, `/faq`, hero CTA fallback routing, footer link, sitemap entry.
  2. User sets `NEXT_PUBLIC_WISETACK_APPLY_URL` in Vercel env (all environments) to the live Wisetack merchant application URL. Without this, the "Pre-Qualify Now" CTA falls back to `/estimate` — safe but not functional for lead generation.
  3. User opens the GitHub "Compare & pull request" button → merges `preview` → `main` → production deploy fires.
  4. User submits `/financing` to GSC URL Inspector for indexing.
  5. User flips `phone_click` "Mark as key event" toggle in GA4 Admin → Events (expected to appear Apr 25–26 after 24–48 hr ingestion lag from the Apr 24 first fire).

## April 24, 2026 — P1.16 /financing page shipped

- **New page `/financing`** — full Wisetack-powered financing marketing page with hero, benefits, 3-step process, eligible-project list, FAQ-lite (5 Q&A), final CTA section, and legal disclosure footer. Designed for highest-intent financing searches ("hvac financing dallas", "0% hvac financing dfw") and on-page conversion via soft-credit pre-qualification flow.
- **Key specs per user:** Wisetack as financing partner; "Up to 24 Months 0% Financing" as headline promo; "Subject to approval through financing partner" as credit-framing copy; no monthly payment calculator; primary CTA stubbed behind `NEXT_PUBLIC_WISETACK_APPLY_URL` env var with a safe fallback to `/estimate` until the live Wisetack merchant link is dropped into Vercel env.
- **SEO** — `generateMetadata()` uses the Option C review-badge helper for the title `"HVAC Financing — 0% for 24 Months | 147 Five-Star Reviews | DFW HVAC"`. BreadcrumbList JSON-LD schema included. Page registered in `sitemap.xml` at priority 0.7. Footer "Quick Links" section now includes a Financing entry on every page sitewide.
- **Legal disclosures** baked in both inline (hero subtext) and in a dedicated grey disclosure strip above the footer: Wisetack is the lender, DFW HVAC is not; pre-qualification is a soft credit check (no score impact); hard pull only upon offer acceptance; 0% APR is promotional, subject to credit approval; rates/amounts/terms vary.
- **Files shipped:** `/app/frontend/app/financing/page.jsx` (new, 312 lines with inline Benefit/Step/Faq subcomponents), `/app/frontend/app/sitemap.js` (entry added), `/app/frontend/components/Footer.jsx` (Quick Links entry added).
- **Verified:** `next build` clean, `/financing` route size 1.87 kB / 127 kB first-load JS, curl returns HTTP 200 + correct `<title>`, sitemap includes `<loc>https://dfwhvac.com/financing</loc>`, ESLint clean. Desktop screenshot at 1920x800 confirms hero composition, lime-on-navy emphasis treatment matching `/reviews` / `/cities-served` hero pattern, and CTA button hierarchy.
- **Sandbox workflow note:** Built on `main` but ready for deployment via a `feat/p1-16-financing-page` branch for Vercel preview QA. GA4 + Resend preview-env guards shipped earlier today ensure sandbox traffic won't contaminate analytics or inbox.
- **Next user actions:**
  1. (Required before prod merge) Set `NEXT_PUBLIC_WISETACK_APPLY_URL` in Vercel env (all environments) to the live Wisetack merchant application URL. Until then, the "Pre-Qualify Now" CTA routes to `/estimate` as a safe fallback.
  2. (Optional) Add a "Financing" card to the homepage services grid when the page is production-verified.

### April 24, 2026 — Follow-up: /financing internal link from FAQ rp3

- **Updated `/faq` page (Apr 24, 2026, Sprint 3b P1.16 polish).** Replaced the generic "we offer flexible financing" answer in FAQ rp3 (`Do you offer financing for new HVAC systems?`) with Wisetack-specific copy mentioning 24-month 0% APR, soft-credit pre-qualification, and a trailing link to `/financing`. Updated in two places to guarantee the answer ships correctly regardless of data source:
  - `app/faq/page.jsx` `defaultFaqs[rp3]` — the fallback used when Sanity FAQs are empty.
  - `app/faq/page.jsx` runtime override block — detects any FAQ whose question contains "financing" and swaps the answer at fetch time, ensuring Sanity-sourced FAQs are also upgraded without waiting for a Sanity edit.
- **Generalized `FAQAccordion.jsx` `renderAnswerWithLinks`** from a single hardcoded pattern to a `LINK_RULES` array supporting multiple phrase → link rules. Added a `"Learn more about our financing options at /financing"` rule alongside the existing cities-served rule. Any future FAQ-embedded internal link can be added with a new `{ pattern, linkText }` entry.
- **Verified:** rebuilt + restarted; curl-grep on `/faq` HTML confirms `Wisetack`, `Learn more about our financing`, and `href="/financing"` all present. ESLint clean.
- **Files shipped:** `/app/frontend/app/faq/page.jsx`, `/app/frontend/components/FAQAccordion.jsx`.
- **SEO impact:** creates the first intra-site inbound link to `/financing` from a page that already ranks and has internal link authority, helping the new page index faster + pass topical relevance to its first GSC impressions.

## April 24, 2026 — Preview-env guards shipped (sandbox workflow prereq)

- **GA4 preview-env guard** — added `ga-preview-guard` inline `<Script strategy="beforeInteractive">` at the top of `<head>` in `/app/frontend/app/layout.js`. Uses Google's documented opt-out flag (`window['ga-disable-G-5MX2NE7C73'] = true`) set before `gtag.js` evaluates its `config` call, so all non-production hosts (Vercel preview URLs, localhost, any future staging domain) are fully muted at the SDK level. Production allow-list is a narrow `hostname === 'www.dfwhvac.com' || hostname === 'dfwhvac.com'` match. Zero hits reach GA4 property `G-5MX2NE7C73` from sandboxes — baseline data integrity preserved during the 70-day pre-Ads-launch window.
- **Resend preview-env guard** — added server-side `VERCEL_ENV === 'production'` check in `/app/frontend/app/api/leads/route.js`. On preview/dev, the lead is still persisted to MongoDB (full pipeline verification remains possible) but `resend.emails.send` is skipped and a structured `console.log` records what *would* have been sent (recipient, leadId, leadType, fullName). Escape hatch: set `FORCE_LEAD_EMAIL_IN_PREVIEW=true` in a specific Vercel env to force real send from a preview branch (e.g., for end-to-end email template QA).
- **Verified:** `next build` succeeded; grep confirms `ga-disable-G-5MX2NE7C73` baked into static HTML output; runtime curl on the dev server confirms both `ga-preview-guard` script ID and the disable flag render in every served page's `<head>`.
- **Files shipped:** `/app/frontend/app/layout.js` (GA4 guard), `/app/frontend/app/api/leads/route.js` (Resend guard + env var constants).
- **Why shipped now:** unblocks the approved sandbox workflow for upcoming P1.13–P1.16 pages. Each new page will now land on a feature branch, auto-deploy to a Vercel preview URL, and be QA'd on real devices with zero contamination of production analytics or inbox.

## April 24, 2026 — GA4 key-event activation (P1.7 partial)

- **User flipped `generate_lead` → "Mark as key event: ON"** in GA4 (Admin → Events). This is the code-side `form_submit_lead` event renamed by a pre-existing GA4 Modify Event rule (Data Stream → Events → Modify events). Kept the rename intentionally — `generate_lead` is one of Google's recommended event names, so Ads Smart Bidding treats it as a first-class signal.
- **Verified `phone_click` firing in GA4 Realtime** (tap of `tel:+19727772665` in production header produced event within ~30 sec). Not yet visible in the **Admin → Events** list — normal 24–48 hr ingestion lag. User to flip its toggle once it appears.
- **Decision logged:** NOT renaming `phone_click` → `contact`. Specificity (per-channel breakdown for future email/chat additions) beats the marginal recommended-event ML uplift. If Ads needs a bundled signal, we'll aggregate `generate_lead` + `phone_click` under a single Conversion Goal at Ads-side import time.
- **Diagnostic trail:** Confirmed production bundles (`/_next/static/chunks/*.js`) contain both `form_submit_lead` and `phone_click` strings — code is deployed. Tracked renaming mystery to the GA4 Modify Event rule (not a code bug). Baseline clock resumes: 70+ days of conversion data runway until Google Ads launch.
- **Files touched (tracking only, no code):** `/app/memory/ROADMAP.md` (P1.7 updated), `/app/memory/RECURRING_MAINTENANCE.md` (M6 last-done stamped), `/app/memory/CHANGELOG.md` (this), `/app/memory/POST_DEPLOY_ACTION_ITEMS_PR2.md` (Steps 1–2 checked off, Step 2 partially complete).
- **Next user action (P1.7 tail):** Check GA4 → Admin → Events in 24–48 hrs → when `phone_click` appears, flip "Mark as key event" → ON. Then close out P1.7 entirely.

## April 23, 2026 — P1.6a Title Tag Rewrite shipped (47 pages, Option C hybrid review-count logic)

- **Shipped all 47 finalized SEO titles** per `/app/memory/audits/2026-04-23_Title_Tag_Final.csv` (home + 11 utility + 2 hubs + 7 services + 28 cities). All CTR-sensitive pages (38 of 47) now carry a dynamic "{N} Five-Star Reviews" badge that reads live from Sanity `companyInfo.googleReviews` when `googleRating >= 4.95`, with fallback to manually-curated `fiveStarReviewCount`.
- **New helpers in `lib/metadata.js`:** `getReviewBadgeCount()` implements Option C hybrid logic (live → safety-net → null); `buildTitleWithBadge()` composes the canonical `"{prefix} | {N} Five-Star Reviews | DFW HVAC"` shape with optional brand drop for overflow-constrained rows (`/`, `/cities-served/dallas`, `/cities-served/north-richland-hills`).
- **New Sanity schema field:** `companyInfo.fiveStarReviewCount` (number, optional). Seeded to **150** via `scripts/seed-five-star-review-count.mjs` — slight forward-looking buffer over the current live count of 147. Maintenance: monthly drift audit now tracked as item M2 in `/app/memory/RECURRING_MAINTENANCE.md`.
- **Stopped honoring Sanity `metaTitle` overrides** on all affected routes. The CSV is now the single authoritative source for page titles. Sanity `metaTitle` field is effectively deprecated for titles (kept in schema for legacy reads — removal tracked as a P2 cleanup).
- **GSC-refined rows** applied: `/` → "AC, HVAC & Furnace Repair | 147 Five-Star Reviews" (brand dropped, captures 3 dominant keyword clusters from GSC); `/services/residential/heating` → "Furnace & Heating Repair" (captures 400+/mo "furnace" imp); `/services/residential/preventative-maintenance` → "HVAC Maintenance" (maintenance = 450+/mo imp vs tune-up = 0); `/cities-served/dallas` → "Dallas HVAC & AC Repair" (captures 1,021 combined imp for "hvac dallas"/"dallas hvac").
- **Redundancy cleanup** on `/request-service` and `/estimate`: replaced `"in DFW | DFW HVAC"` redundancy with full `"Dallas-Fort Worth"` phrase, giving stronger geo signal without wasted characters.
- **Files shipped:** `lib/metadata.js` (helpers), `lib/sanity.js` (GROQ), `sanity/schemas/companyInfo.js` (new field), `scripts/seed-five-star-review-count.mjs` (new, idempotent), `app/page.js`, `app/about/page.jsx`, `app/contact/page.jsx`, `app/estimate/page.js`, `app/faq/page.jsx`, `app/recent-projects/page.jsx`, `app/request-service/page.jsx`, `app/reviews/page.jsx`, `app/services/page.jsx`, `app/cities-served/page.jsx`, `app/privacy-policy/page.jsx`, `app/terms-of-service/page.jsx`, `app/services/[category]/[slug]/page.jsx`, `app/cities-served/[slug]/page.jsx`, `app/memory/audits/2026-04-23_Title_Tag_Final.csv` (finalized), `app/memory/RECURRING_MAINTENANCE.md` (new, 20+ items).
- **Verification:** Full `next build` succeeded in 37s. Ran `curl | grep <title>` across all 47 routes — every title matches CSV exactly. 38 pages carry the dynamic "147 Five-Star Reviews" badge; 9 do not (about, contact, estimate, request-service, faq, services, cities-served, privacy, terms — per CSV intent).
- **Kept architecture:** Left existing `dynamic = 'force-dynamic'; revalidate = 0` on all pages — review-count badge updates immediately after any Sanity edit instead of lagging 24h. Switching to `revalidate: 86400` ISR is logged as a P2 optimization (reduces server cost, accepts up-to-24h title staleness).
- **Expected SEO impact:** Measurable CTR lift on Coppell (1,200 monthly imp @ pos 1 → 0 clicks today); homepage "hvac dfw" (286 imp @ pos 2.78 → 1% CTR today); Dallas page now captures "hvac dallas" (1,021 combined imp). Quarterly GSC CTR review scheduled for July 23, 2026 (item Q4 in RECURRING_MAINTENANCE.md).

## April 23, 2026 — Legacy Wix URL redirect + 410 deployment (P1.17d complete)

- **Shipped full legacy URL redirect map.** Extracted the complete inventory of 14 pages from the offline Wix admin (via user-provided SEO Settings + Site Menu + URL Redirect Manager screenshots), cross-referenced with user's intent decisions on 6 ambiguous mappings, and deployed a single-pass fix covering every known legacy Wix URL. All 18 verification test cases passed.
- **`next.config.js`** — added 5 new 301 redirects: `/aboutus` → `/about`, `/servicecall` → `/request-service`, `/haloled` → `/services/residential/indoor-air-quality`, `/copy-of-ac-furnace-repair` → `/services/residential/preventative-maintenance`, `/products` → `/services`. Flagged `/installation` + `/ducting` with `// TODO` comments to update when P1.13 `/services/system-replacement` / dedicated install or ducting pages ship. Total: 11 permanent redirects in config.
- **`middleware.js`** — new file. Returns HTTP 410 Gone (stronger-than-404 permanent-removal signal) with a branded helpful HTML body + `X-Robots-Tag: noindex, nofollow` for: `/equipment`, `/signup`, `/login`, `/my-account`, `/copy-of-*` (except the explicit 301), `/_files/ugd/*` (Wix CDN PDF phantoms catch-all), `/post/*`, `/blog/*` (blog never existed; 3 Wix-era test posts permanently killed).
- **Rebuilt + restarted** cleanly. Middleware compiled at 34.7 kB. All existing routes unchanged.
- **Files shipped:** `/app/frontend/next.config.js`, `/app/frontend/middleware.js` (new), `/app/memory/audits/2026-04-23_Legacy_URL_Redirect_Map.md` (new audit doc with full verification log), `/app/memory/CHANGELOG.md` (this), `/app/memory/ROADMAP.md` (P1.17d marked done), `/app/memory/audits/README.md` (index updated).
- **Expected SEO impact:** Clears at least 2 URLs from the "Crawled – currently not indexed" GSC bucket (`/aboutus`) + "Not Found 404" bucket (`/servicecall`). Recovers backlink equity from any external sites still pointing at legacy Wix URLs. Wix CDN phantoms auto-prune from Google's memory over 60–180 days as crawler re-hits them and sees 410s. Branding consistency restored — legacy URLs now 301 to current DFW HVAC pages, no more "Alpine HVAC Pros" titles in search snippets.
- **Still outstanding (P1.17a, user-led):** Manual indexing requests for the 27 "Discovered – currently not indexed" URLs in GSC. Separate workstream, not addressed by this redirect fix.

## April 23, 2026 — GSC indexing diagnosis + P1.17 Indexing Recovery Sprint added to roadmap

- **Diagnosed GSC indexing state.** 27 of 47 sitemap URLs indexed (57%) vs 80%+ target. Root cause identified as crawl budget (not content quality) — 27 URLs in the "Discovered – currently not indexed" bucket all show `Last Crawled: N/A`, meaning Google has never crawled them. The Apr 21 content push added URLs to the discovery queue faster than Google could process them.
- **Key finding on the "5 reasons" breakdown:** only 2 URLs are "Crawled – currently not indexed" (actual quality judgments) — `/cities-served/argyle` (judged pre-Apr-21 snapshot, will re-index on next crawl) and `www.dfwhvac.com/aboutus` (legacy Wix URL, fixed via redirect in the Apr 23 legacy redirect deploy).
- **Captured full 27-URL list** of stuck pages including high-value entries: `/about`, `/reviews`, `/faq`, both residential AC+Heating+IAQ service pages, both commercial service pages, 18 city pages incl Frisco/Lewisville/Richardson/Irving/Mansfield.
- **Roadmap updated** with new P1.17 Indexing Recovery Sprint containing four sub-tasks: P1.17a (user-led manual indexing requests — 90 min over 3 days), P1.17b (crawl budget lift via GBP + NAP consistency), P1.17c (internal linking audit), P1.17d (legacy Wix URL redirects — completed same day, see separate entry above).
- **Discovered legacy Wix branding** — old entity "Alpine HVAC Pros" has been abandoned per user; confirmed not to associate going forward. All redirect targets point to current DFW HVAC pages.

## April 22, 2026 — Strategic planning session — Sitemap expansion + competitor audit

- **Saved competitor title-tag + trust-signal audit** at `/app/memory/audits/2026-04-22_Competitor_Title_Audit.md`. Re-crawled A#1 Air, Milestone, Coppell AC, and Andy's Sprinkler homepages. Key finding: **industry-wide blind spot — none of the 4 put their star rating + review count in the `<title>` tag.** DFW HVAC's 145/145 five-star reviews (zero negatives) is an unclaimed CTR weapon. Three of four competitors also exceed the 60-char SERP limit. Coppell AC (our direct geo rival) has a 93-char keyword-stuffed title with zero review signal — materially weaker than anything we're about to publish.
- **Published color-coded internal sitemap preview** at `/app/frontend/public/sitemap-preview.html` — self-contained HTML with brand styling (Prussian / Electric Blue / Vivid Red), sticky TOC nav, color-coded legend (🟢 LIVE / 🟡 EDIT / 🔴 NEW / 🔵 STUB), full ASCII tree, Mermaid mind map (CDN), summary table, and strategic notes. Set to `noindex, nofollow`. Reachable at `{preview-url}/sitemap-preview.html`. Meant for user review only.
- **Roadmap expanded with four new P1 items** (see ROADMAP.md): P1.13 `/services/system-replacement` dedicated replacement page, P1.14 `/estimator` multi-step pricing tool (lead-gated at results step), P1.15 `/repair-or-replace` AEO decision-framework article, P1.16 `/financing` page (promoted from P2 backlog — replacement conversion depends on it). `/pricing` reserved as STUB under P2 — URL locked, content Phase 2.
- **Strategic notes captured during session:**
  - Company does NOT offer 24/7 service — language is "same-day when available" + "within 24 hours response." All keyword recommendations updated to honor this.
  - Actual service architecture: 7 service pages + 2 category hubs + 1 services hub = 10 service-related pages (was misstated as 7 earlier). Residential: air-conditioning, heating, indoor-air-quality, maintenance-plans. Commercial: commercial-hvac, commercial-maintenance, new-construction.
  - System replacement is the under-weighted revenue center on the current site (5–15× service-call ticket). Free-estimate offer is currently a hidden asset. Both get promoted in the new sitemap.
  - Keyword framework established: **Appointment-First** (transactional intent → AEO question-twin → first-100-words proof-point with `145 ★★★★★`). Documented in conversation; to be formalized on the eventual pricing/services refresh.
  - Top-line nav grows by only 1 item ("Estimator"). Everything else lives inside existing dropdowns / footer / inline. 7 → 8 nav items.
- **P1.6a (Title tag audit + rewrite) status:** strategy locked (audit complete, formulas drafted), code execution **deferred** pending user sign-off on sitemap expansion. Once sitemap is approved, P1.6a title rewrites will cover the new pages as well, single deploy.
- **Files shipped:** `/app/memory/audits/2026-04-22_Competitor_Title_Audit.md`, `/app/frontend/public/sitemap-preview.html`, `/app/memory/audits/README.md` (index updated), `/app/memory/ROADMAP.md` (new P1 items), `/app/memory/CHANGELOG.md` (this entry).

## April 21, 2026 — Late evening — Documentation system migration

- **Consolidated project memory into 5 canonical files** (this file + ROADMAP + 00_START_HERE + PRD shim + audits/). Retired: `/app/memory/NEXT_SESSION_PRIORITIES.md` (1,064 lines), `/app/frontend/internal/PRD.md` (623 lines, stale from early Apr 21). Content preserved here and in ROADMAP.
- **Created `/app/memory/audits/`** as the single long-term archive for all audit artifacts. Moved: technical audit, QA sweep, mobile form UX audit, performance scorecard, action items, site audit xlsx, Lighthouse CSV, baseline screenshots. Added audits/README.md index. Non-audit reference docs (brand framework, service-area CSVs, competitor analysis) intentionally left in `/app/frontend/internal/`.
- **Established Agent SOP at `/app/memory/00_START_HERE.md`** with session-start and session-end integrity checklists (ROADMAP/CHANGELOG freshness, no phantom files, audit discipline, handoff-summary SOP reference).
- **Numeric-prefixed filename** ensures `00_START_HERE.md` sorts first in `ls`, so new forks encounter it before anything else.
- **Captured Tier 1 Lighthouse scorecard** as `/app/memory/audits/2026-04-21_Lighthouse_Tier1_Production.md` — 12 pages × mobile+desktop post-RSC migration baseline.

## April 21, 2026 — Evening — Server Components migration (P2.4b early batch)

- **Converted 4 page templates from client → server components** — removed unnecessary `'use client'` from `ServiceTemplate.jsx` (474L), `CompanyPageTemplate.jsx` (431L), `HomePage.jsx` (405L), `DynamicPage.jsx` (318L). Total ~1,628 lines of JSX moved server-side.
- **Verification:** All 4 templates use zero React hooks, zero event handlers, zero function props, zero browser APIs — pure presentational. Radix Accordion (interactive, via `@radix-ui/react-accordion` which self-declares `'use client'`) continues to function; LeadForm + AddressAutocomplete remain client components with their reCAPTCHA focus gate intact.
- **Production impact (verified via Lighthouse):** `/contact` mobile TBT 330ms → 190ms 🟢 (first page to cross into Good). `/about` TBT 520ms → 270ms (-48%). Home + service pages held at 95 / 94 Perf with TBT within run variance.
- **Files:** components/ServiceTemplate.jsx, CompanyPageTemplate.jsx, HomePage.jsx, DynamicPage.jsx

## April 21, 2026 — Evening — reCAPTCHA focus-gated loading

- **Root-caused Tier-1 audit findings:** home BP 93 (was 100) caused by reCAPTCHA iframe triggering Google's own report-only `frame-ancestors` CSP violation in the console; service pages mobile Perf 80–84 with TBT 590–710ms dominated by reCAPTCHA's 840–1,077ms main-thread bootup (lazyOnload insufficient for Lighthouse's TBT window).
- **Fix:** `components/RecaptchaScript.jsx` refactored from auto-rendering `<Script>` to exported `loadRecaptchaOnce()` helper (idempotent, SSR-safe). Wired `<form onFocus={loadRecaptchaOnce}>` on LeadForm.jsx + SimpleContactForm.jsx. reCAPTCHA now only downloads when a user focuses a form field. Graceful fallback preserved in `/api/leads` (skip token → IP rate limit).
- **Verification:** DOM 0 reCAPTCHA scripts on mount → 2 after focus → 2 after 2nd focus (idempotent). Service page local TBT 710ms → 330ms (-54%). Home mobile BP **93 → 100**.
- **Files:** components/RecaptchaScript.jsx, LeadForm.jsx, SimpleContactForm.jsx

## April 21, 2026 — Evening — Brand color migration completion

- **Uncovered incomplete Apr 21 brand migration:** CSS token change in `globals.css` was effective but **21 hardcoded `#00B8FF` hex references across 20 files** bypassed tokens and still rendered old cyan. Header "Request Service" outline button (`components/ui/button.jsx`) with `text-[#00B8FF]` caused desktop `/` A11y 96 (contrast 2.25:1 on white). Also `ColorProvider.jsx` defaults still pointed at old hexes — runtime-override landmine if Sanity `brandColors` ever gets populated.
- **Sweep:** sed replacement `#00B8FF` → `#0077B6` in 13 components + 7 app page files (ui/button, HomePage, DynamicPage, ServiceTemplate, LeadForm, SimpleContactForm, LinkedCityList, CompanyPageTemplate, BookServicePage, services pages, cities-served pages, recent-projects, request-service, terms, privacy, not-found). Updated ColorProvider defaults to match globals.css tokens.
- **Verification:** Rendered production HTML contains 0 `#00B8FF` + 0 `#FF0606`, 16 `#0077B6` + 2 `#D30000`. Desktop `/` Lighthouse: Perf 100 · A11y 100 · BP 100 · SEO 100.

## April 21, 2026 — Afternoon — Home A11y + SEO fix pack

- **Darkened brand tokens in `globals.css`:** `--electric-blue` `#00B8FF → #0077B6` (4.77:1 WCAG AA), `--vivid-red` `#FF0606 → #D30000` (5.22:1 AA). Resolves 5 WCAG contrast failures site-wide.
- **TestimonialCarousel:** dots wrapped in 24×24 clickable buttons with `aria-label="Go to review slide N"` + `aria-current`. Prev/next ChevronLeft/Right buttons got aria-labels. Fixes button-name + target-size audits.
- **LeadForm:** `aria-label="Number of HVAC systems"` on Radix SelectTrigger.
- **HomePage:** 2× generic "Learn More" → "Explore {service.name}" (SEO descriptive link-text).
- **Header:** desktop nav links `inline-flex items-center min-h-[44px]` for target-size compliance.
- **Red button swap across 6 files:** `bg-[#FF0000]` → `#D30000` (StickyMobileCTA, BookServicePage, 4 page files).
- **Verified:** Home mobile A11y 88 → **100** ⭐, SEO 92 → **100** ⭐.

## April 21, 2026 — Afternoon — RealWork widget CSP fix

- **Root cause:** Content-Security-Policy `connect-src` directive in `next.config.js` missing `https://app.realworklabs.com`. Plugin's `loader.js` + main bundle executed (script-src OK), but the follow-up fetch to `app.realworklabs.com/plugin/config?key=...` was blocked. 3 retries then silent failure. Broken since CSP tightening Apr 17.
- **Fix:** Added `https://app.realworklabs.com` to `connect-src` + `img-src` in `next.config.js`. `script-src` + `frame-src` already allowed it.
- **Verification:** `/recent-projects` post-deploy shows map rendering with all project markers, 267 project images, filter chips, 28-city breakdown. Honest TBT regression: +160ms desktop (widget's actual execution cost; masked before by IntersectionObserver never firing the broken plugin).
- **User decision:** accepted the honest TBT (Option A — push as-is, don't click-gate yet).

## April 21, 2026 — Earlier — UX-1 iPhone header cramping

- Hidden top bar below 640px (`hidden sm:flex`) to fix cramped layout on iPhone 16 Pro. Dark mode logged to P2 backlog.
- **Files:** components/Header.jsx

## April 21, 2026 — Earlier — Branding correction: retire "since 1972" shorthand

- Removed false "serving since 1972" claims across code, seed data, Sanity fallbacks, live Sanity CMS.
- Adopted canonical tagline: **"Keeping it Cool — For Three Generations."**
- Family-legacy craftsmanship dates to 1972 (factually correct); the business founded in **2020**.
- Removed `legacyStartYear` from schema/scripts.
- **Built `/api/canonical-description`** endpoint returning live business description with current review count pulled from Sanity.
- Migrated live Sanity documents to new messaging.

## April 21, 2026 — Earlier — P1.3 Post-Launch QA Sweep

- Completed 🟢 PASS. 0 broken links across 46 internal URLs. Form endpoint healthy.
- Found + fixed 1 click-to-call regression (2 pages using non-E.164 `tel:` format; standardized to `+19727772665`).
- Logged 1 minor mobile UX (UX-1 header cramping — fixed same day).
- Device-based validation (M1–M5) handed to user.
- **Findings:** `/app/memory/audits/DFW_HVAC_QA_Sweep_2026-04-21.md`

## April 21, 2026 — Earlier — PR #3 (Sprint 2a code response to P1.2 audit)

- **R1.1 — JSON-LD schema on city + service pages.** City pages now render 3 blocks (HVACBusiness + city-scoped Service + BreadcrumbList). Service pages render 3 blocks (HVACBusiness with all 28 cities in areaServed + Service with provider rating + BreadcrumbList). New components: `components/SchemaMarkup.jsx` → `BreadcrumbListSchema`, `CityServiceSchema`, `ServiceSchema`.
- **R1.2 — Hub-and-spoke internal linking.** City pages link to all 7 services with city-specific anchors ("AC Repair in Plano, TX"). Service pages link to all 28 cities with service-specific anchors ("Heating in Plano"). Closes biggest local-SEO structural gap.
- **R2.1 — Branded `app/not-found.jsx`.** Replaces Next.js generic 404 with conversion-first: big phone CTA, 5-star trust bar, 4 destination links, tertiary request-service link. Returns proper HTTP 404.

## April 21, 2026 — Earlier — P1.2 Deep Technical Audit

- 13-category technical SEO + architecture sweep completed. Overall 🟡 B+ (89/100).
- Three high-priority gaps uncovered: R1.1, R1.2, R2.1 — all closed via PR #3 above.
- Confirmed: zero secret leakage in client bundles, all 6 security headers present, 6 legacy Wix 308 redirects working, canonicals apex + unique.
- Sanity Studio dependencies account for all 28 High CVEs (dev/admin tooling only; accept risk until Sanity 3.50+ upgrade ~summer 2026).
- **Findings:** `/app/memory/audits/DFW_HVAC_Technical_Audit_2026-04-21.md`

## April 21, 2026 — PR #2 / Sprint 1 Completion (Week 1 of 12-Week Ad Launch Roadmap)

Six tasks shipped in one PR:

1. **P1.9a** aggregateRating schema fix: `lib/metadata.js` `reviewCount: '118'` → `'145'`.
2. **P1.6g** `lib/metadata.js` fallback parity: `openingHours` `Mo-Fr 09:00-18:00` → `Mo-Fr 07:00-18:00`; `areaServed` 12 cities → full 28.
3. **P1.3a** Accessibility fix pack (Lighthouse a11y 87 → 95+): 6× `text-gray-400` → `text-gray-600` on white backgrounds; 3× social-icon aria-labels in Footer; 1× mobile hamburger aria-label + aria-expanded + aria-controls.
4. **P1.7** GA4 conversion events: `PhoneClickTracker.jsx` (single-listener event delegation for all `tel:` links); `form_submit_lead` event in both forms (fires only on verified `success: true`).
5. **P1.1 (final)** 7 service page meta descriptions via code fallback — `buildServiceMetaDescription()` + `SERVICE_META_COPY` map in `app/services/[category]/[slug]/page.jsx`.
6. **P1.3-scoped** Mobile Form UX audit — 7× `autoComplete` + 3× `inputMode` attrs on all form inputs. Findings: `/app/memory/audits/Mobile_Form_UX_Audit_2026-04-21.md`. Deeper UX deferred to P1.10.

User action required (still pending): GA4 → Admin → Events → mark `form_submit_lead` and `phone_click` as conversions after 24h of events.

## April 20, 2026 — Python backend deletion (P2.17)

- Deleted `/app/backend/` entirely — 374-line FastAPI server + requirements + .env. Verified 100% dead: zero frontend references, no cron/CI/Docker calling it.
- Preserved integration test via `git mv backend/tests/test_dfw_hvac.py → frontend/tests/test_dfw_hvac.py` (history intact).
- Post-deletion: `yarn build` ✓ 30s clean.
- **Result:** single-stack Next.js codebase.

## April 20, 2026 — Code Review Response

- Applied legit fixes: `safeJsonLd()` helper in `SchemaMarkup.jsx` (escapes `<` to `\u003c` — prevents `</script>` breakout from CMS strings). Truthy-check fix in test.
- Declined false positives (DOMPurify for JSON, React state setters in deps, module constants in deps, ref in deps, mass index-as-key rewrites without context).
- Added legit-but-deferred items to backlog: P2.15 (decomposition), P2.16 (/api/leads POST complexity), P2.17 (backend deletion — done), P2.18 (index-as-key audit).

## April 20, 2026 — TBT Optimization (PR #1)

- Lazy-loaded 3 third-party scripts. GA4 left as `afterInteractive` (already optimal).
- **Google Maps / Places:** removed mount-time eager load; `onFocus` handler in `AddressAutocomplete.jsx`. Bounced visitors save ~800–1,200ms TBT. Added inline "Powered by Google" attribution.
- **reCAPTCHA v3:** removed from root layout; extracted to `components/RecaptchaScript.jsx` with `next/script strategy="lazyOnload"`. Pages without forms no longer load reCAPTCHA at all.
- **RealWork widget:** IntersectionObserver with 200px rootMargin. Only loads when container enters viewport.
- **Result:** TBT ~2,300ms → ~500–800ms expected on prod.

## April 20, 2026 — P1.1 City Meta Descriptions (Path A)

- **Discovery:** all 28 cities had `metaDescription: null` in Sanity. "Denton gold template" was a code fallback at line 64 of `app/cities-served/[slug]/page.jsx`.
- **Implementation:** `buildCityMetaDescription(cityName, zipCodes)` helper with adaptive zip-line format. Fallback `city.metaDescription || buildCityMetaDescription(...)` — still allows per-city Sanity override.
- **New template:** `[City], TX AC & heating repair, install & maintenance. Same-day service. Call (972) 777-2665. Licensed, family-owned. [Zip line].`
- **Verification:** 12 sampled cities render correctly; all 28 descriptions 128–158 chars.

## April 20, 2026 — Click-to-Call Bug Fix

- **Root cause:** `companyInfo.phone` in Sanity stores vanity `(972) 777-COOL`. Two pages + LocalBusiness schema used it directly in `tel:` hrefs. Mobile browsers can't dial letters — every "Call Now" tap dead since launch Apr 16.
- **Fix:** Repurposed existing `phoneDisplay` Sanity field (populated with `(972) 777-2665`) as canonical dialable. Updated 5 call sites. Hardcoded E.164 format in `lib/metadata.js` JSON-LD telephone.

## April 19, 2026 — Next.js 14 → 15 Upgrade

- `next` 14.2.35 → **15.5.5**, `react` 18.2.0 → **19.2.5**, `react-dom` 18.2.0 → **19.2.5**, `eslint-config-next` 14 → **15.5.15**.
- Dynamic routes already used Next 15 `await params` async pattern — no code changes needed.
- Removed extraneous lockfiles that confused Next.js workspace detection.
- **Testing:** 26/26 pytest cases pass; zero React 19 hydration warnings; zero visual regressions vs baseline screenshots.
- Resolves 5 known Next.js 14 CVEs + 23 npm vulnerabilities.

## April 17–18, 2026

- Address autocomplete verified on all 5 form pages
- Removed all "since 1974" false claims (code, seed data, fallbacks, live Sanity)
- Updated business hours to Mon–Fri 7AM–6PM
- Updated googleReviews count from 130 → 145
- Removed stale `realPhone` field from mockData
- Implemented Google reCAPTCHA v3 (threshold 0.4, graceful fallback, no-token blocking, [BLOCKED]-tagged entries still saved)
- Recent Projects page live with RealWork widget
- Security audit — 6 of 8 issues fixed: cron endpoint locked with CRON_SECRET; CSP + X-Frame-Options + X-Content-Type-Options + Referrer-Policy + Permissions-Policy headers; `escapeHtml` on email templates; rate limit 5/15min per IP on `/api/leads`; sensitive docs moved `/public/` → `/internal/`; RealWork plugin ID moved to env var.
- Performance baseline captured (Lighthouse on 13 pages)

---

## Earlier Milestones (Feb 2025 – April 16, 2026)

Site launch date: **April 16, 2026** (Wix → Next.js migration, confirmed via Let's Encrypt `notBefore=Apr 16, 2026 20:04:44 GMT`).

### Pre-launch architecture work (Feb 2025)

- **Header Button Hover Fix** — Added `outlineBlue` variant to `ui/button.jsx`; cyan border/text default, cyan background/white text on hover.
- **Canonical URL Fix (Feb 23)** — critical SEO bug: all pages showed root URL as canonical. Implemented page-specific `generateMetadata()` with `alternates.canonical`. Updated all static + dynamic pages. Root layout exports `metadataBase`.
- **Request Service Page & CTA Consolidation (Feb 23)** — dedicated `/request-service` page (lead form + phone CTA + trust signals). All site-wide "Request Service" / "Book Now" buttons now target it. Added to footer + sitemap (priority 0.9).
- **Header Navigation Cleanup (Feb 23–24)** — tagline changed "Three Generations of Trusted Service" → "Trust. Excellence. Care." Moved "Cities Served" to footer. Removed "Contact" from main nav.
- **Estimate Page Rebrand (Feb 24)** — brand color consistency; 12-city service area list.
- **Site-Wide CTA Audit (Feb 24)** — fixed 8 locations incorrectly pointing at `/contact` instead of `/request-service`.
- **Phone-First Conversion Strategy** — removed Housecall Pro integration (operational constraints). Implemented site-wide phone-first CTA pattern. Created reusable `ServiceFirstCTA` component.
- **Recent Projects Page** — created with RealWork widget (500+ jobs across DFW), conversion-optimized structure.
- **RealWork Widget temporarily decommissioned (Feb 2025)** → later restored at launch.
- **Sticky Mobile CTA Bar** — click-to-call, appears after 100px scroll, session-dismissible.
- **Lead Capture System** — `/api/leads` endpoint, MongoDB storage, three-funnel Resend email routing (service@, estimate@, contact@).
- **Date Reference Cleanup** — removed all "1974" references (incorrect); "1972" kept (legacy start year).
- **Legal Pages** — `/privacy-policy`, `/terms-of-service` from user-provided PDFs.

### CMS + content (Feb 2025)

- **Phase 1: CMS Architecture** — created `aboutPage`, `contactPage`, `trustSignals` schemas. Extended `siteSettings` and `companyInfo` with legacy statement, mission, start year.
- **Phase 2: Brand Content Migration** — seeded Sanity with brand framework content. Created AboutPageTemplate with brand pillars + Legacy Timeline. Fixed Portable Text paragraph spacing.
- **Google Reviews Auto-Sync** — Google Places API + daily cron at 6 AM UTC. Live data (5.0 rating, 135+ reviews initial, now 145). Removed all hardcoded review counts.
- **City Pages** — added 31 missing zip codes. Created 4 new city pages (Lewisville, Arlington, Haslet, Mansfield). Connected trust badges to CMS.
- **UI Fixes** — logo white edges in footer (clip path); created Services hub at `/services`; removed "Write a Google Review" button.
- **About Page Reorder** — Our Values → Our Legacy → Our Story (values-first for conversion).

### Launch-day wiring (early Apr 2026)

- **DNS cutover** to GoDaddy + SSL verification
- **Resend domain verification**
- **Google Places API** billing + Vercel Cron setup
- **GA4** tracking installed (`G-5MX2NE7C73`)
- **Phone number auto-formatting** on forms
- **Address Autocomplete** with DFW bias
- **SEO audit spreadsheet** generated (`2026-04-20_DFW_HVAC_Site_Audit.xlsx` in audits/)
- **6 legacy 301 redirects** from old Wix URLs: `/scheduleservicecall`, `/installation`, `/iaq`, `/ducting`, `/seasonalmaintenance`, `/testresults`

### Earlier foundation (2024–early 2025)

- Sanity CMS Migration (all content)
- Service Area Analysis (4-zone model, 139 zip codes across 28 cities)
- Google Reviews Import (130 reviews initial seed)
- Dynamic Page System
- SEO Schema Markup (LocalBusiness, Review, FAQ)
- TTS Voice Previews (9 samples)
- Brand Strategy & Competitor Analysis
- OG Image & Favicon generated
- FastAPI → Next.js API route migration
- Vercel deployment & environment variables
