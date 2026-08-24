# DFW HVAC — Changelog

**Last reviewed:** Aug 24, 2026
**⚠️ Read `memory/00_START_HERE.md` first for the Agent SOP.**

> **Shipped history before May 21, 2026** lives in [`CHANGELOG-legacy-pre-2026-05-21.md`](CHANGELOG-legacy-pre-2026-05-21.md) (1,737 lines, Feb–May 2026 agent logs). That file is archival context only — do not treat it as the live product state.

---

## Aug 24, 2026 — CI: Node 24 + gitleaks-action v3 (F12 + AH1)

**What changed:** Bumped `actions/setup-node` from Node 20 → **24** in KPI Audit, Security Audit (yarn job), and Lighthouse CI so installs match current dependency engines (fixes Monday KPI failure on `@sanity/visual-editing` requiring ≥22.12). Bumped `gitleaks/gitleaks-action` **v2 → v3** (Node 24 action runtime; no scan behavior change) to clear the deprecation warning and beat the Sep 16, 2026 Node-20 runner removal.

**Files:** `.github/workflows/kpi-audit.yml`, `.github/workflows/security.yml`, `.github/workflows/lighthouse-ci.yml`, `memory/CHANGELOG.md`, `memory/ROADMAP.md`, `memory/RECURRING_MAINTENANCE.md`, `memory/FOUNDATION_AUDIT_PROGRAM.md`

**Verification:** Grep confirms `node-version: "24"` and `gitleaks-action@v3`; F12 / AH1 removed from open queues.

**Caveats:** Confirm green Security Audit + re-run KPI Audit (workflow_dispatch) after merge to refresh this week’s snapshot.

---

## Aug 21, 2026 — Lead forms: require full Places address (city/state/ZIP)

**What changed:** Google Places autocomplete sometimes left `serviceAddress` as street-only (Enter without a real selection, or incomplete place payload). Autocomplete now rebuilds from `address_components` / Details when needed, LeadForm blocks submit until the address looks like `street, city, ST ZIP` (or was Places-resolved into that shape), and `/api/leads` rejects incomplete service/estimate addresses so notification emails stop arriving without city/state/ZIP.

**Files:** `frontend/lib/service-address.js`, `frontend/components/AddressAutocomplete.jsx`, `frontend/components/LeadForm.jsx`, `frontend/app/api/leads/route.js`, `memory/CHANGELOG.md`

**Verification:** Node smoke tests on `looksLikeFullUsAddress` / `buildServiceAddressFromPlace`; grep confirms LeadForm + API share the same incomplete message.

**Caveats:** Contact leads may still omit address. Manual QA: pick a DFW suggestion on `/request-service` and confirm the field fills with city/state/ZIP; type street-only and confirm submit is blocked.

---

## Aug 21, 2026 — Security Audit green: dep bumps + resolutions

**What changed:** Cleared Security Audit CI (high/critical yarn audit) by bumping production/dev deps (incl. `next`/`axios` and Dependabot #145/#143 ranges) and extending Yarn `resolutions` (`nanoid` 3.3.18, `tar` 7.5.22, `postcss` 8.5.26, `undici` 7.29.0, `linkify-it` 5.0.2, `brace-expansion` 2.1.4, `js-yaml` 3.15.1, `sharp` 0.35.3). Bumped `actions/setup-node` v5→v7 in CI workflows (supersedes Dependabot #142).

**Files:** `frontend/package.json`, `frontend/yarn.lock`, `.github/workflows/security.yml`, `.github/workflows/kpi-audit.yml`, `.github/workflows/lighthouse-ci.yml`, `memory/CHANGELOG.md`, `memory/ROADMAP.md`

**Verification:** `yarn audit --groups dependencies` → `critical=0 high=0` (CI-style grep counts).

**Caveats:** Close open Dependabot PRs #142/#143/#145 as superseded after this lands on `main`. Some resolution pins warn as semver-incompatible with nested requests (intentional until upstream catches up).

---

## Aug 21, 2026 — Security Audit CI: audit without yarn install

**What changed:** CI still failed because `yarn install --frozen-lockfile` itself exits non-zero on ubuntu (not the audit counts). Security Audit job now pins Yarn 1.22.22 via corepack and runs `yarn audit` against the lockfile with **no install step**.

**Files:** `.github/workflows/security.yml`, `memory/CHANGELOG.md`

**Verification:** Prior local audit parser critical=0 high=0; confirm Actions green on this push.

**Caveats:** None for the gate; Dependabot PRs still close manually when CI is green.

---

## Aug 21, 2026 — Security Audit CI: ignore-scripts + drop unused canvas

**What changed:** CI Security Audit was still red after the dep bump because `yarn install` on ubuntu failed (native builds / false “lockfile out of sync”), regenerated a dirtier tree, then failed audit. Fixed by (1) installing with `--frozen-lockfile --ignore-scripts` and failing hard on lock drift, (2) parsing audit JSON with Node instead of grep, (3) removing unused `canvas` dependency.

**Files:** `.github/workflows/security.yml`, `frontend/package.json`, `frontend/yarn.lock`, `memory/CHANGELOG.md`

**Verification:** Local frozen `--ignore-scripts` install exit 0; Node audit parser → critical=0 high=0 moderate=19.

**Caveats:** Confirm GitHub Actions Security Audit goes green on this commit; then close Dependabot PRs #142/#143/#145 if still open.

---

## Aug 21, 2026 — Security Audit green: dep bumps + resolutions (supersedes Dependabot #142–#145)

**What changed:** Cleared production `yarn audit` high/critical advisories that were failing Security Audit on `main` (next, axios, nanoid, tar, postcss, sharp, undici, linkify-it, brace-expansion, js-yaml, etc.). Bumped frontend deps (aligned with open Dependabot groups) and pinned patched nested packages via `resolutions`. Updated `actions/setup-node` v5 → **v7** in security/kpi/lighthouse workflows.

**Files:** `frontend/package.json`, `frontend/yarn.lock`, `.github/workflows/security.yml`, `.github/workflows/kpi-audit.yml`, `.github/workflows/lighthouse-ci.yml`, `memory/CHANGELOG.md`, `memory/ROADMAP.md`

**Verification:** `yarn audit --groups dependencies` → 0 high / 0 critical; `next build --webpack` exit 0.

**Caveats:** Close Dependabot PRs **#142**, **#143**, **#145** as superseded after this lands on `main`. Global `nanoid` resolution forces 3.3.18 (audit-clean; yarn may warn on packages requesting ^5).

---

## Aug 21, 2026 — ROADMAP: REVIEWS-CURATE promoted (docs)

**What changed:** Marked GBP review sync fully complete; moved **REVIEWS-CURATE** to active queue **#5** with SEO/AEO approach notes (intent-matched quotes per URL; keep `/reviews` paginated). Session todo list also tracks REVIEWS-CURATE (and deferred Security Audit CI).

**Files:** `memory/ROADMAP.md`, `memory/CHANGELOG.md`

**Verification:** Queue + detail section updated to match Aug 21 sync wrap-up.

**Caveats:** Inventory `.xlsx` may still be untracked locally until committed with curation work.

---

## Aug 21, 2026 — Review sync wrap-up: ISR revalidate + fallback 191

**What changed:** (1) After a successful `/api/cron/sync-reviews` run, call `revalidatePath` for `/reviews`, `/`, `/about`, and `/services` so the site does not keep serving the previous hour’s ISR snapshot. (2) Bumped `REVIEW_COUNT_FALLBACK` 176 → **191** to match live Google count from Actions #96.

**Files:** `frontend/app/api/cron/sync-reviews/route.js`, `frontend/lib/constants.js`, `memory/CHANGELOG.md`, `memory/ROADMAP.md`

**Verification:** Sanity CDN/API query confirmed `visible`/`withText`/`withGbpId` = 164 and `companyInfo.googleReviews` = 191 while the live page still showed 111 — ISR cache, not a failed upsert. Fallback constant now equals that live count.

**Caveats:** Needs deploy + one sync (or wait for ISR) to see ~164 text reviews on `/reviews`.

---

## Aug 21, 2026 — GBP Phase C validated in production (docs)

**What changed:** First production Sync Reviews run after Phase C deploy succeeded (GitHub Actions **#96**, commit `fc4aad7`): `live=191`, `drift=15`, `textUpsert=164`. ROADMAP open item **GBP-REVIEWS-SYNC** removed (shipped).

**Files:** `memory/ROADMAP.md`, `memory/CHANGELOG.md`

**Verification:** User screenshot of Actions success notice with those three metrics.

**Caveats:** Fallback bumped to 191 in wrap-up commit same day. Next open review work is **REVIEWS-CURATE**.

---

## Aug 21, 2026 — GBP Phase C: nightly review-text sync to Sanity

**What changed:** Extended `/api/cron/sync-reviews` to (1) keep Places API rating/count updates and (2) use Business Profile OAuth to paginate all location reviews, upsert those **with text** into Sanity `testimonial` docs (deterministic ids + `googleReviewId`), and soft-hide legacy Google testimonials lacking that id after a healthy sync. GitHub Actions sync workflow timeout/curl raised for longer runs.

**Files:**
- `frontend/lib/gbp-reviews.js` (new)
- `frontend/app/api/cron/sync-reviews/route.js`
- `frontend/sanity/schemas/testimonial.js` (`googleReviewId`)
- `.github/workflows/sync-reviews.yml`
- `frontend/.env.example`, `memory/ROADMAP.md`, `memory/CHANGELOG.md`

**Verification:** Mapper unit checks; `next build --webpack` exit 0; later validated by Actions #96 (`textUpsert=164`).

**Caveats:** Count sync still uses Places; text sync soft-fails so a GBP outage does not block rating updates.

---

## Aug 21, 2026 — GBP Phase B OAuth smoke tests passed (docs only)

**What changed:** User completed Phase B for **GBP-REVIEWS-SYNC**: OAuth client `DFW HVAC Review Sync`, Playground auth with `business.manage`, and successful `accounts` / `locations` / `reviews.list` calls for DFW HVAC (`accounts/114818860562564505726`, `locations/4714471983400937136`). ROADMAP advanced to **Phase C** (code).

**Files:** `memory/ROADMAP.md`, `memory/CHANGELOG.md`

**Verification:** User-confirmed HTTP 200 on reviews.list in OAuth Playground.

**Caveats:** `USER_ACTION` — add five `GBP_*` secrets to Vercel Production before / while Phase C ships. No review-text sync in production until Phase C code deploys.

---

## Aug 4, 2026 — GBP API allowlist approved (docs only)

**What changed:** User confirmed Google approved Business Profile API Basic Access for case **`6-6371000040573`**. ROADMAP **GBP-REVIEWS-SYNC** unblocked from allowlist wait → **Phase B OAuth** (user), then Phase C code (agent).

**Files:** `memory/ROADMAP.md`, `memory/CHANGELOG.md`

**Verification:** Status updated from pending to approved per user report Aug 4, 2026.

**Caveats:** `USER_ACTION` — Phase B (APIs, OAuth, smoke tests) still required before coding the review-text sync.

---

## Jul 20, 2026 — Pin adm-zip 0.6.0 for weekly Security Audit

**What changed:** Weekly Security Audit #273 failed on `yarn audit` (`0 critical + 1 high`) after [GHSA-xcpc-8h2w-3j85](https://github.com/advisories/GHSA-xcpc-8h2w-3j85) landed in the advisory DB (GitHub-reviewed Jul 17). Pinned production transitive `adm-zip` (via `sanity` → `@sanity/cli` → `@sanity/runtime-cli`) from `0.5.17` → `0.6.0` with a Yarn resolution.

**Files:** `frontend/package.json`, `frontend/yarn.lock`, `memory/CHANGELOG.md`

**Verification:** `yarn audit --json --groups dependencies` → `critical=0 high=0` (moderate allowed); `node_modules/adm-zip` resolves to **0.6.0**; lockfile integrity matches npm.

**Caveats:** None — resolution pin is intentional until `@sanity/runtime-cli` depends on `adm-zip@>=0.6.0` directly.

---

## Jul 15, 2026 — Review sync + curation tasks queued (docs only)

**What changed:** ROADMAP active queue updated: **GBP-REVIEWS-SYNC** (#20) scoped to finish automated Google review-text pull + Sanity incorporation; new **REVIEWS-CURATE** (#21) to curate per-page displayed reviews using `memory/audits/2026-07-15_Review_Display_Inventory.xlsx`. Earlier same day: allowlist case **`6-6371000040573`** logged.

**Files:** `memory/ROADMAP.md`, `memory/audits/2026-07-15_Review_Display_Inventory.xlsx`, `memory/audits/README.md`

**Verification:** Queue rows #20–#21 present; case ID unchanged.

**Caveats:** `USER_ACTION` / `INFRA` — sync blocked on Google approval; curation can use current inventory before sync ships.

---

## Jul 15, 2026 — Bump `REVIEW_COUNT_FALLBACK` after drift alert

**What changed:** Raised the disaster-recovery Google review fallback from **155 → 176** after the nightly sync-reviews cron reported 21 reviews of drift (threshold 20). Live pages still read Sanity; this only protects Sanity-outage fallback copy.

**Files:** `frontend/lib/constants.js`, `memory/CHANGELOG.md`

**Verification:** Grep shows `REVIEW_COUNT_FALLBACK = 176`; matches cron alert live count.

**Caveats:** None — routine maintenance. Next alert only if live drifts another ~20 past 176.

---

## Jul 9, 2026 — CSP GA collect fix + defer forms on `/` and `/contact`

**What changed:** Unblocked GA4/gtag collect calls that PSI logged as CSP violations (`analytics.google.com`, `stats.g.doubleclick.net`, plus `*.google-analytics.com`). Deferred `LeadForm` / `SimpleContactForm` past first paint on homepage and contact (same pattern as `/request-service`) so desktop first-load JS stays lighter while the hero H1 remains LCP.

**Files:**
- `frontend/next.config.js` — `connect-src` additions
- `frontend/components/LeadFormClient.jsx` (new), `SimpleContactFormClient.jsx` (new), `SimpleContactFormSkeleton.jsx` (new)
- `frontend/components/RequestServiceFormClient.jsx` — thin wrapper over `LeadFormClient`
- `frontend/components/HomePage.jsx`, `CompanyPageTemplate.jsx`, `LeadFormSkeleton.jsx`, `ProductionAnalytics.jsx`

**Verification:** `next build --webpack` succeeded (exit 0); `/` and `/contact` static. Grep confirms CSP hosts + `*FormClient` on homepage/contact.

**Caveats:** `PARTIAL` — field desktop RES improvement needs 7–14d Speed Insights after deploy. PSI lab desktop was already ~98 / LCP ~0.6s with H1 as LCP; this targets field JS cost + broken GA hits, not a guaranteed lab score bump. GTM unused-JS (~72 KiB) remains third-party.

---

## May 21, 2026 — MVP baseline reset (code-verified)

**Purpose:** Establish a single honest snapshot of what is live in `frontend/` and adjacent repo infrastructure. Prior CHANGELOG entries mixed shipped code, user-only GA4 admin steps, placeholder data, and stale ROADMAP duplicates.

**Verification method:** Static inspection of `frontend/app/`, `frontend/components/`, `frontend/lib/`, `frontend/package.json`, `.github/workflows/`, and `scripts/audit-kpis.mjs`. Cross-check registry: `memory/GA4_EVENTS.md`.

### Stack (production)

| Layer | Version / state | Evidence |
|---|---|---|
| Next.js | `^16.2.6` | `frontend/package.json` |
| React | `19` | `frontend/package.json` |
| Sanity Studio + client | `^5.26.0` / `^7.22.0` | `frontend/package.json` |
| Tailwind CSS | `^4.3.0` (CSS-first `@theme`) | `frontend/app/globals.css`, no `tailwind.config.js` |
| GA4 property | `G-5MX2NE7C73` | `frontend/app/layout.js` |
| Microsoft Clarity | `wjyapvd6n7` (production hostname only) | `frontend/app/layout.js` |
| Review sync cron | GitHub Actions daily → `/api/cron/sync-reviews` | `.github/workflows/sync-reviews.yml`; `frontend/vercel.json` is `{}` (no Vercel cron) |

### Live routes (App Router)

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Live | Homepage + hero critical CSS |
| `/about`, `/contact`, `/faq`, `/reviews` | ✅ Live | Sanity-driven or static templates |
| `/request-service`, `/estimate` | ✅ Live | Lead capture |
| `/replacement-estimator` | ✅ Live | 5-step wizard; **pricing matrix is placeholder** (`lib/estimator-matrix.js`) |
| `/services`, `/services/[category]/[slug]` | ✅ Live | ServiceTemplate + LeadForm |
| `/services/system-replacement` | ✅ Live | Revenue-center page |
| `/repair-or-replace`, `/financing` | ✅ Live | Wisetack pre-qual via `NEXT_PUBLIC_WISETACK_APPLY_URL` (live in prod May 22, 2026) |
| `/cities-served`, `/cities-served/[slug]` | ✅ Live | ~28 city pages |
| `/thanks` | ✅ Live | Post-submit + `thanks_page_view` GA4 |
| `/privacy-policy`, `/terms-of-service` | ✅ Live | Policy pages |
| `/recent-projects` | ✅ Live | Portfolio |
| `/studio` | ✅ Live | Sanity Studio |
| `/careers`, `/referrals`, `/pricing` | ❌ Not built | On ROADMAP (PG1, PG2, P2.2) |
| `/quote-*` ad LPs | ❌ Not built | Phase 4 (P4) |

### API routes

| Route | Status | Notes |
|---|---|---|
| `/api/leads` | ✅ Live | reCAPTCHA v3 threshold `0.7`; Resend + MongoDB; preview-env mute |
| `/api/estimator/calculate`, `/api/estimator/lead` | ✅ Live | Estimator backend |
| `/api/cron/sync-reviews` | ✅ Live | Bearer `CRON_SECRET`; drift alerts |
| `/api/canonical-description` | ✅ Live | Listings copy endpoint |

### GA4 events (code-fired only)

See **`memory/GA4_EVENTS.md`** for the full registry. Summary:

| Event (in code) | Files | Key event in GA4? |
|---|---|---|
| `form_submit_lead` | `LeadForm.jsx`, `SimpleContactForm.jsx` | User: mark G3 (may display as `generate_lead` if GA4 Modify Event rule active) |
| `phone_click` | `PhoneClickTracker.jsx` (global in `layout.js`) | User: mark G4 when ingested |
| `thanks_page_view` | `ThanksAnalytics.jsx` | User: mark G5 |
| `estimator_complete` | `EstimatorWizard.jsx` | Optional future key event |
| `estimator_opt_in` | `EstimatorWizard.jsx` | User: mark G6 when ready |

**Not in code:** `generate_lead` — only appears in GA4 if admin renames `form_submit_lead`.

### Conversion & trust (partial sitewide)

| Item | Status |
|---|---|
| Footer lock + “Your information is secure” (C8) | ✅ `Footer.jsx` |
| Phone click + `cta_source` (C6) | ✅ 7 tagged surfaces in Header, Footer, StickyMobileCTA |
| Click-to-call mobile reachability (C2) | ✅ Audited May 4 |
| Review badge in **every** hero (P1.9b) | ⏳ Partial — home, service sidebar, about/company; **not** financing, system-replacement, repair-or-replace, request-service, city heroes |
| Testimonial carousel near **every** form (P1.9c) | ⏳ Partial — homepage + `DynamicPage` only |
| Progressive form (P1.10) | ❌ Not built |
| Form abandonment GA4 (C4) | ❌ Not built |

### SEO / security (shipped in code)

- `robots.js` — AI crawler allow-list
- `sitemap.js` — tiered lastmod
- `lib/metadata.js` — live Sanity review count (P2.22), title badges, OG/Twitter defaults
- `next.config.js` — security headers (HSTS, CSP with `*.clarity.ms`), legacy redirects
- `not-found.jsx` — funnel links to estimator, financing, repair-or-replace, FAQ
- Preview guards — GA4 mute + lead-email skip on non-production hosts

### Infrastructure (repo-adjacent, not `/frontend`)

| Item | Status |
|---|---|
| KPI dashboard HTML | ✅ `frontend/public/internal/kpi-dashboard.html` |
| KPI audit workflow | ✅ `.github/workflows/kpi-audit.yml` + `scripts/audit-kpis.mjs` |
| Security / gitleaks CI | ✅ `.github/workflows/security.yml` |
| Dependabot | ✅ `.github/dependabot.yml` |

### Known stubs (shipped UI, incomplete business data)

| ID | What | Caveat |
|---|---|---|
| C3 | Estimator pricing | `lib/estimator-matrix.js` — placeholder DFW numbers |
| P1.16 | Wisetack pre-qual | Live in prod via Vercel env; code fallback `/estimate` for unset env |
| P2.23 | `@sanity/image-url` | Deprecated default import still in `lib/sanity.js` (warning only) |

### Performance honesty

LCP optimization work is in code (font `optional`, lazyOnload GA4/Clarity, hero critical CSS). **Lab LCP target &lt;1.25s is not met** — last documented PSI mobile LCP ~2.7s (May 2026). Treat P2.20 as ongoing, not complete.

### Documentation reset (this entry)

- Archived prior CHANGELOG → `CHANGELOG-legacy-pre-2026-05-21.md`
- Rewrote `ROADMAP.md` to future-only open work
- Created `GA4_EVENTS.md`
- Updated agent SOP + recurring checklists to match live code

**Next agent rule:** New shipped work gets a dated entry below this baseline. Do not resurrect pre-reset narrative into ROADMAP.

---

## May 26, 2026 — Foundation audit hardening (yarn audit re-verify + KPI collectors)

**What changed:** Re-examined Apr 2026 “28 high” Sanity CVE baseline after **Sanity 5.26** upgrade. **security.yml** now fails on **high OR critical** production advisories (JSON parse, not `yarn --level`). **audit-kpis.mjs** adds **`dependency-vulns-prod`** (P1-G10) and **`broken-internal-links`** (linkinator). KPI workflow runs `yarn install` before audit. New tracker: `memory/FOUNDATION_AUDIT_PROGRAM.md`.

**Verification:** Next **Security Audit** / **KPI Audit** Actions run on `main` — read `critical=X high=Y` in logs. Locally: `cd frontend && yarn audit --groups dependencies`.

**Caveats:** If `high > 0`, CI will fail until Dependabot/resolutions clear it — intentional. Vercel RUM rows still manual paste until KPI-DASH-AUTO.

**Follow-up (same day):** Cleared **11 high** production advisories after the stricter gate turned CI red on `main` (`lodash` CVE-2026-4800 via Yarn `resolutions` → 4.18.0; `picomatch` CVE-2026-33671 via `yarn.lock` → 2.3.2 / 4.0.4). Verified locally: `critical=0 high=0`.

**Files:** `.github/workflows/security.yml`, `.github/workflows/kpi-audit.yml`, `scripts/audit-kpis.mjs`, `frontend/package.json`, `frontend/yarn.lock`, `memory/FOUNDATION_AUDIT_PROGRAM.md`, `memory/RECURRING_MAINTENANCE.md`, `memory/ROADMAP.md`, `memory/audits/DFW_HVAC_Technical_Audit_2026-04-21.md`

---

## May 26, 2026 — FOUNDATION-SHORE (Sanity CDN, multi-URL PSI, Lighthouse CI)

**What changed:** `lib/sanity.js` — `useCdn: true` + React `cache()` on all fetch helpers. KPI audit: CrUX-auto LCP/INP/TTFB when PSI returns origin data; **psi-lab-worst-lcp** on 4 URLs; GSC/GA4 archive fallback when OAuth missing. New **Lighthouse CI** workflow on PRs (3 URLs, LCP ≤5.5s, perf ≥75).

**Files:** `frontend/lib/sanity.js`, `scripts/audit-kpis.mjs`, `.github/workflows/lighthouse-ci.yml`, `memory/FOUNDATION_AUDIT_PROGRAM.md`

**Verification:** Merge PR → Lighthouse CI runs; Monday KPI Audit shows `dependency-vulns-prod` + linkinator.

---

## May 22, 2026 — SEC-1-A: Vercel geo-block firewall removed

**What changed:** User confirmed **SEC-1-A** complete — “Block Non-US Traffic” firewall rule deleted; **no geo-block or custom Firewall rules** remain. Bot Protection and AI Bots left **Off** (KPI audit + AEO posture). **SEC-1** remains open for A4–A6, SEC-1-C (~May 29 GSC spot-check), and optional B2/B3.

**Verification:** User confirmed in Vercel Firewall (Rules + Overview); no custom rules.

**Files:** `memory/ROADMAP.md`, `memory/CHANGELOG.md`, `frontend/public/internal/roadmap-preview.html`

**Caveats:** GA4 non-US filter, Clarity US-only, and Sanity 2FA still pending.

---

## May 22, 2026 — P1.16-url: Wisetack pre-qual live in production

**What changed:** Verified production `/financing` “Pre-Qualify Now” links to DFW HVAC’s Wisetack merchant pre-qual URL (`NEXT_PUBLIC_WISETACK_APPLY_URL` in Vercel). Removed **P1.16-url** from active ROADMAP queue; updated financing page comment (no code behavior change).

**Verification:** Live HTML at https://dfwhvac.com/financing → `https://wisetack.us/#/uzzs02b/prequalify` (opens new tab; Wisetack soft-check form loads).

**Files:** `frontend/app/financing/page.jsx`, `memory/ROADMAP.md`, `memory/CHANGELOG.md`, `frontend/public/internal/roadmap-preview.html`

---

## May 22, 2026 — Roadmap preview HTML synced to clean ROADMAP

**What changed:** Rebuilt `frontend/public/internal/roadmap-preview.html` to match `memory/ROADMAP.md` (May 21 baseline + KPI gates). Removed stale May 8 tiers, “already shipped” tables, GA4-SVC/KPI-DASH queue items, and corrupted duplicate footer markup.

**Live URL (after deploy):** https://dfwhvac.com/internal/roadmap-preview.html

**Files:** `frontend/public/internal/roadmap-preview.html`

**Verification:** Static HTML; `noindex,nofollow`; TOC + active queue (19 items) + KPI gates + P5-LAUNCH-GATE.

**Note:** ROADMAP item **F9** (live KPI API widgets on roadmap preview) remains open — this pass is a manual doc sync, not auto-pull widgets.

---

## May 22, 2026 — KPI-DASH-AUTO deferred to ROADMAP (docs only)

**What changed:** Added **KPI-DASH-AUTO** (#19) — Vercel `vercel metrics` auto-pull, snapshot CI hardening, `VERCEL_TOKEN` GitHub secret. Deferred while P1 execution focuses on SEC-1 and trust/conversion items.

**Files:** `memory/ROADMAP.md`

---

## May 22, 2026 — SEC-2: estimator lead API hardened (P1 gate cleared)

**What changed:** `/api/estimator/lead` now matches `/api/leads` security posture — shared `lib/lead-security.js` (reCAPTCHA v3 threshold 0.7 + IP rate limit). `EstimatorWizard.jsx` sends `recaptchaToken` on opt-in. KPI dashboard P1 GATE: **10/10 met**.

**Files:**
- `frontend/lib/lead-security.js` (new)
- `frontend/app/api/estimator/lead/route.js`
- `frontend/app/api/leads/route.js` (refactored to shared lib)
- `frontend/app/replacement-estimator/EstimatorWizard.jsx`
- `scripts/audit-kpis.mjs` (SEC-2 code scan, sec-1-gsc gate green, archive fallback for uptime/Pa11y)
- `frontend/public/internal/kpi-snapshot.json`

**Verification:** KPI audit reports `P1 10/10`; `sec-2-estimator-lead` green; no GA4 event changes.

---

## May 22, 2026 — KPI dashboard dual-layer revision (schema v2)

**What changed:** Rebuilt graduation model for internal KPI dashboard — every metric tagged **GATE / SIGNAL / MAINTAIN / WATCH**; phase exit checklists separate from engineering health; P2-tech vs P2-growth and P3-MEASURE vs P3-OPTIMIZE split.

**New GATE KPIs:** `leads-api-recaptcha`, `sec-2-estimator-lead` (code scan), `sec-1-gsc-indexing`, `s3-aeo-citation`, P3-BASELINE manual rows (G3–G6 + 28d data).

**Live URL (after deploy):** https://dfwhvac.com/internal/kpi-dashboard.html

**Files:**
- `scripts/audit-kpis.mjs` — `KPI_META`, `graduation` rollups, `schemaVersion: 2`
- `frontend/public/internal/kpi-dashboard.html` — gate strip, checklists, role filters
- `memory/KPI_DASHBOARD_GUIDE.md` — owner + agent guide (new)
- `memory/KPI_DASHBOARD_SCOPE.md` — classification table

**Verification:** Run `GITHUB_ACTIONS=true node scripts/audit-kpis.mjs`; confirm P1 gate shows SEC-2 red until shipped.

**Note:** ROADMAP item **F9** (live KPI API widgets on this page) remains open — this pass is a manual doc sync, not auto-pull widgets.

---

## May 21, 2026 — ROADMAP gap-fill (docs only)

**What changed:** Added four missing workstreams to `memory/ROADMAP.md` after goal-vs-roadmap review: **S3-AEO** (quarterly citation program), **P3-BASELINE** (GA4 key events + pre-ad CR baselines), **SEC-2** (`/api/estimator/lead` reCAPTCHA + rate limit), **P5-LAUNCH-GATE** (Jul 2026 target + spend prerequisites). New **KPI gates** section defines measurable tier advancement.

**Files:** `memory/ROADMAP.md`

**Verification:** ROADMAP active queue renumbered; P1/P2/P3/P5 sections cross-reference `audits/2026-02-28_AEO_Citation_Baseline.md`, `POST_DEPLOY_ACTION_ITEMS_PR2.md`, `app/api/estimator/lead/route.js`.

---
