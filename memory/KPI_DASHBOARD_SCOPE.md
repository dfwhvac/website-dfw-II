# KPI Dashboard — Build Scope for Next Session

**Drafted:** May 8, 2026
**Estimated effort:** 3 hrs agent + 0 user (Phase 1 deliverables) · separate scope for Phase 2–5 token wiring

---

## Goal

Deliver a single internal dashboard at `https://dfwhvac.com/internal/kpi-dashboard.html` that visualizes the 5-Priority roadmap's KPIs in one glance. Phase 1 KPIs auto-populate without user credentials; Phases 2–5 are scaffolded with "Connect [Source]" CTAs documenting exactly what token is needed.

**Pattern reuse:** Same static-HTML + design idiom as the existing `roadmap-preview.html` (already at `/internal/roadmap-preview.html`). This avoids server-fetch complexity, plays nicely with Vercel's static optimization, and lets the page hit Edge cache.

---

## Architecture

```
/app/frontend/public/internal/
  ├── roadmap-preview.html        (existing — unchanged)
  ├── kpi-dashboard.html          (NEW — shipped this session)
  └── kpi-snapshot.json           (NEW — written by audit script, read by HTML at load)

/app/scripts/
  └── audit-kpis.mjs              (NEW — Phase 1 auto-pull, writes kpi-snapshot.json)

/app/memory/audits/
  └── kpi-snapshot-archive/       (NEW — weekly archived JSON snapshots for trend lines)
      ├── 2026-05-15.json
      └── 2026-05-22.json
```

**Update flow:**
1. Agent (or user) runs `node scripts/audit-kpis.mjs` weekly
2. Script pulls public APIs, writes `kpi-snapshot.json` + archive copy
3. User commits → push → page auto-updates on Vercel
4. Trend arrows compare current vs. last week's archived snapshot

---

## Visual Design

**Match existing roadmap-preview.html visual language:**
- Dark theme, vivid-red accents (matches site brand)
- 6-tier card grid (one card per Phase)
- Each KPI row: Label · Current Value · Target · Status Light · Trend Arrow

**Status traffic light:**
- 🟢 Green: meets or exceeds target
- 🟡 Yellow: within 20% of target OR not yet measured but baseline set
- 🔴 Red: misses target by >20%
- ⚪ Gray: not measured yet (no token / not shipped)

**Trend arrow:**
- ▲ improving (vs. last week)
- ▼ regressing
- → stable (within ±2%)
- — no prior datapoint

**Phase rollup header:**
- "Phase 1: 11 / 13 KPIs green · 1 yellow · 1 gray"
- Color-coded percentage bar

---

## Phase 1 — Auto-pulled by `scripts/audit-kpis.mjs`

These run on every script execution. No tokens required.

| KPI | Source | Implementation |
|---|---|---|
| SecurityHeaders.com grade | `https://securityheaders.com/?q=dfwhvac.com` (parse `X-Grade` response header) | `fetch()` + regex |
| Mozilla Observatory grade | `https://http-observatory.security.mozilla.org/api/v1/analyze?host=dfwhvac.com` (POST then GET) | JSON API |
| SSL Labs TLS grade | `https://api.ssllabs.com/api/v3/analyze?host=dfwhvac.com` (poll until READY) | JSON API |
| PageSpeed Performance (mobile) | `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=...&strategy=mobile` | Free, anon-rate-limited; with `PAGESPEED_API_KEY` env var → 25K/day |
| PageSpeed A11y / Best Practices / SEO | same call, parse `lighthouseResult.categories.{accessibility,best-practices,seo}.score` | same call, free metadata |
| Core Web Vitals (CrUX field) | `https://chromeuxreport.googleapis.com/v1/records:queryRecord` | needs `CRUX_API_KEY` (free) — gracefully degrades if missing |
| First Load JS / Build time | parse `.next/build-manifest.json` + `yarn build` stderr | runs locally in sandbox during audit |
| Dependency vulns (critical) | `yarn audit --json --groups dependencies` parse | runs locally |
| Public secret leaks | GitHub Actions API: latest `gitleaks` workflow run status | public for public repo, no auth |
| CSP whitelist host count | `curl -I` parse `content-security-policy` header | already proven |
| Schema coverage | crawl 5 representative pages, count distinct `@type` per page | already proven |
| Sitemap parity | `curl /sitemap.xml` count + verify each URL returns 200 | partial today (count only) |
| Robots.txt AI crawler allowlist | `curl /robots.txt` count `User-agent:` directives | already proven |
| Uptime (last 30 days) | Vercel public deployment status — none free; **gray** until upgrading or external uptime monitor added | scaffolded, not auto |
| Error rate | Vercel Analytics — Hobby tier has no API; **gray** until Pro upgrade or self-instrumented to MongoDB | scaffolded |

**Phase 1 deliverable: 13 of 15 KPIs auto-populated.** Uptime + error rate scaffolded with explanation.

---

## Phase 2 — Auto where free APIs exist, scaffolded otherwise

| KPI | Source | Status |
|---|---|---|
| Schema validation per-page | `https://search.google.com/test/rich-results` (no public API — would need headless browser) | scaffolded, manual run |
| Sitemap indexing rate | GSC API | **needs token** — see GA4_SERVICE_ACCOUNT_SETUP.md (same service account works) |
| GSC impressions / clicks / CTR / position | GSC Search Analytics API | **needs token** |
| GBP impressions / calls / directions | GBP Business Information API | **needs token** + admin auth |
| Reviews count | Already pulled from Google Places API in `/api/cron/sync-reviews` — read latest from MongoDB | ✅ already accessible |
| Review response rate | Manual — GBP doesn't expose responder identity via API | scaffolded |
| Backlink count (DR≥20) | Ahrefs API (paid) or fall back to manual | scaffolded |
| AEO citation rate | Manual quarterly run (S3 doc) | scaffolded |
| Featured snippets owned | GSC + manual | scaffolded |

**Phase 2 deliverable: 1 of 9 auto + 8 scaffolded with token requirements documented.**

---

## Phase 3 — Mostly scaffolded, single GA4 unlock

| KPI | Source | Status |
|---|---|---|
| Overall CR | GA4 Data API — `(form_submit_lead + phone_click) / sessionStart` | **needs token** |
| Form submission rate | GA4 — `form_submit_lead / form_views` | needs token |
| Phone click rate | GA4 — `phone_click / sessionStart` | needs token |
| Per-page CR | GA4 — top 10 entry pages | needs token |
| Mobile vs desktop CR | GA4 device dimension | needs token |
| Estimator completion / opt-in rate | GA4 — `estimator_opt_in / estimator_start` | needs token |
| Bounce rate / time on page | GA4 engagement metrics | needs token |
| Heatmap insights | Microsoft Clarity Data Export API | needs separate token; gates on May 22 baseline |
| Lead → booked-job rate | User CRM (no integration) | scaffolded — manual entry field |

**Phase 3 deliverable: 0 auto, 1 GA4 service-account unlocks 8 of 9.**

---

## Phase 4 / 5 — Scaffolded only

These mostly track items not yet built (CallRail, Google Ads, Meta Ads). Dashboard shows a clear "Phase gated on Phase 3 baseline trending positive" banner. Cards exist as visual placeholders for when ad spend goes live.

---

## Implementation Steps (next session)

1. **Build `scripts/audit-kpis.mjs`** — Node script, ESM, ~300 lines. Pulls all Phase 1 sources in parallel using `Promise.all`. Writes `kpi-snapshot.json` + dated archive copy. Logs traffic-light summary to stdout.
2. **Build `kpi-dashboard.html`** — single-file static HTML matching `roadmap-preview.html` styling. Reads `kpi-snapshot.json` via `fetch()` on load. Renders phase cards.
3. **Add `audit:kpis` script to `frontend/package.json`** — `"audit:kpis": "node ../scripts/audit-kpis.mjs"`.
4. **Run script once** to seed first snapshot.
5. **Commit + push** → verify live at `https://dfwhvac.com/internal/kpi-dashboard.html`.
6. **Document weekly cadence** in `RECURRING_MAINTENANCE.md` — "Mondays: run `yarn audit:kpis`; commit snapshot."

**Optional Tier 2** (after Tier 1 ships): Wire GA4 service account → adds Phase 3 auto-pull (8 KPIs). User must complete `GA4_SERVICE_ACCOUNT_SETUP.md` first.

---

## Out of scope

- Real-time live API pulls in browser (would expose tokens client-side; security risk)
- Self-hosted Grafana / Looker (overkill for 1-property)
- Alerting / paging (next iteration if KPI regressions become a thing)
- Public-facing version (this is internal-only)

---

## Acceptance criteria

- ☐ `https://dfwhvac.com/internal/kpi-dashboard.html` returns HTTP 200
- ☐ At least 13 Phase 1 KPIs render with current values + traffic-light status
- ☐ All Phase 2/3/4/5 KPI cards render as scaffolds with token-requirement documentation
- ☐ Page styling matches `roadmap-preview.html` visual language
- ☐ `node scripts/audit-kpis.mjs` runs to completion in <60s
- ☐ Snapshot archive directory created with first weekly entry
- ☐ Weekly cadence documented in `RECURRING_MAINTENANCE.md`
