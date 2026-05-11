# DFW HVAC — PRD

**Last reviewed:** May 11, 2026

## Original Problem Statement
Finalize a premium Next.js / Sanity website for **DFW HVAC**. Execute a 5-Priority tier roadmap (Foundation → SEO/AEO → Conversion → Ad Infra → Launch) focused on deep SEO, accessibility, Core Web Vitals, and conversion-rate optimization. Maintain a high-converting, secure, performant HVAC lead-generation funnel.

## Architecture
- **Stack:** Next.js 15.5.9 (App Router) + React 19.2.5
- **CMS:** Sanity.io (headless)
- **DB:** MongoDB Atlas (`leads` collection)
- **Hosting:** Vercel (Production: https://dfwhvac.com)
- **Forms:** reCAPTCHA v3
- **Email:** Resend
- **Analytics:** GA4, Microsoft Clarity, Vercel Analytics + Speed Insights
- **Financing:** Wisetack
- **Maps/Places:** Google Places API

## Production State (May 8, 2026)
- ✅ All Phase 1 (Foundation) shipped — security headers Grade A on securityheaders.com
- ✅ Phase 2a SEO/AEO Quick Wins shipped (S1, S2, S6, S7, A4 + earlier batch)
- ✅ F11 Security Remediation complete (all keys rotated, gitleaks gating CI)
- ✅ F13 Architecture Foundation Audit fixes shipped (CSP/Clarity, lazyOnload, schema, HTML validation)
- ✅ C2/C6/C8 Conversion Sprint Tier 1 shipped
- ✅ CI hardened against recurring yarn.lock/package.json web-editor conflict pattern
- ✅ **KPI Dashboard shipped (May 11)** — `/internal/kpi-dashboard.html` auto-pulls 6 Phase 1 KPIs green, 2 yellow, 8 gray (PageSpeed/SSL Labs gated on API keys/host restrictions). `yarn audit:kpis` Mondays.
- 🕐 Microsoft Clarity 14-day baseline clock active since May 8 (gates P1.10 progressive form redesign)

## Active Roadmap Source of Truth
`/app/memory/ROADMAP.md` — strictly governs all work. Five-tier priority system.

## Currently Blocked / User Action Required
- **GBP Audit (P1.8)**: Awaiting user-supplied Google Business Profile admin screenshots (Info / Insights / Posts / Reviews / Q&A tabs)
- **Estimator Pricing Matrix**: Awaiting user-completed `estimator-pricing-template.csv` to replace placeholder DFW averages in `lib/estimator-matrix.js`
- **F3b HSTS Preload submission**: Submit `dfwhvac.com` at https://hstspreload.org/ (user-led)
- **F12 GH Actions Node bump**: Review pending Dependabot PRs (user-led)
- **P1.6f Rich Results validation**: Run live URLs through https://search.google.com/test/rich-results (user-led)
- **A3 GSC re-audit**: Refresh Google Search Console coverage report (user-led)

## Tier 3 Next Up (Agent-led after current PRs land)
- **🆕 GA4-SVC-SETUP (user-led, ~15 min)**: GA4 + GSC service account setup. User follows `/app/memory/GA4_SERVICE_ACCOUNT_SETUP.md` Steps 1–7. Async — can be done anytime. **Blocked May 8** by user's Google Workspace org policy on service-account key creation; revisit when policy adjusted or use personal Google account.
- **🆕 GA4-SVC-VERIFY (agent-led, ~30 min)**: Once user confirms setup, agent verifies env vars + makes test API calls + wires credentials into `scripts/audit-kpis.mjs`. Unlocks 17 KPIs across Phases 2 + 3 of the now-live dashboard.
- **🆕 KPI-DASH** *(SHIPPED May 11)*: ✅ Phase 1 auto-pull live at `/internal/kpi-dashboard.html`. Source: `scripts/audit-kpis.mjs`. Cadence row W4 added to `RECURRING_MAINTENANCE.md`. Optional next: add `PAGESPEED_API_KEY` env var to light up 4 PageSpeed KPIs.
- **F13-P1.4**: Mozilla Observatory uplift from B+ (80) → A. Add COEP / Permissions-Policy / additional headers to clear remaining failed test.
- **P1.9b**: Review badge in homepage hero (5-star + count, sourced from Google Places via existing `lib/google-reviews.js`)
- **P1.9c**: Inline review carousel on services pages
- **C4**: Form abandonment tracking (compatible with the active Clarity baseline window — events only, no UX changes)
- **P2.19**: CallRail / Twilio DNI scoping doc (no implementation yet)

## Backlog
- **Phase 3 (Conversion)**: P1.10 progressive form redesign (gated on Clarity 14-day baseline)
- **Phase 4 (Ad Infra)**: Ad landing pages, GA4 Enhanced Ecommerce
- **Phase 5**: Launch + Track
- **Phase 6 (New pages)**: PG1 Careers, PG2 Referrals
- **F10**: Sanity v5.22 upgrade (deferred, dedicated session)
- **P2.15**: Component decomposition (oversized templates >300 lines)

## Known Minor Drift (May 8 session)
- `@next/bundle-analyzer` dropped from `main`'s `package.json` during PR #68 conflict resolution. Local `yarn.lock` still references it. Next session: either re-add it cleanly via PR or strip lockfile entries to align with main.

## Key Files
- `/app/memory/ROADMAP.md` (definitive priority source)
- `/app/memory/CHANGELOG.md` (shipped history)
- `/app/memory/RECURRING_MAINTENANCE.md` (weekly KPI snapshot row W4 + cadences)
- `/app/scripts/audit-kpis.mjs` (KPI auto-pull, Phase 1)
- `/app/frontend/public/internal/kpi-dashboard.html` (live dashboard)
- `/app/frontend/public/internal/kpi-snapshot.json` (current snapshot)
- `/app/memory/audits/kpi-snapshot-archive/` (weekly archived snapshots)
- `/app/memory/audits/2026-05-04_F13_Architecture_Foundation.md`
- `/app/.github/workflows/security.yml` (CI gate)
- `/app/frontend/next.config.js` (security headers)
- `/app/frontend/app/layout.js` (script loading strategy)
- `/app/frontend/lib/metadata.js` (SEO defaults)
- `/app/frontend/components/SchemaMarkup.jsx` (JSON-LD)

## Key API Endpoints
- `POST /api/leads` (lead capture, reCAPTCHA-protected)
- `POST /api/estimator/calculate` (replacement estimator)
- `POST /api/estimator/lead` (estimator → lead)
- `GET /api/cron/sync-reviews` (CRON_SECRET-protected)

## DB Schema
```
leads (MongoDB):
  firstName, lastName, phone, email, address, message,
  recaptchaScore, status, createdAt, source
```
