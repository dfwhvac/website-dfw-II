# DFW HVAC — PRD

**Last reviewed:** May 8, 2026

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
