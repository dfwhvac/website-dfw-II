# DFW HVAC — Site Performance Scorecard

**Purpose:** Recurring benchmark to track site health across performance, accessibility, best practices, and SEO. Run before/after major changes and on a quarterly schedule.

**Tool:** Google Lighthouse (via CLI or Chrome DevTools)

---

## Overall Scores (0-100)

| Category | Target | Baseline (Apr 17, 2026) | Post-Upgrade | Q3 2026 | Q4 2026 | Q1 2027 |
|----------|--------|------------------------|--------------|---------|---------|---------|
| Performance | 90+ | **70** | — | — | — | — |
| Accessibility | 90+ | **86** | — | — | — | — |
| Best Practices | 90+ | **99** | — | — | — | — |
| SEO | 90+ | **99** | — | — | — | — |

---

## Performance Metrics (Detail)

| Metric | What It Measures | Target | Baseline | Post-Upgrade | Q3 2026 | Q4 2026 | Q1 2027 |
|--------|-----------------|--------|----------|--------------|---------|---------|---------|
| First Contentful Paint (FCP) | Time to first visible content | < 1.8s | **1.6s avg** | — | — | — | — |
| Largest Contentful Paint (LCP) | Time to main content load | < 2.5s | **2.3s avg** | — | — | — | — |
| Total Blocking Time (TBT) | Duration page is unresponsive | < 200ms | **2,156ms avg** | — | — | — | — |
| Cumulative Layout Shift (CLS) | Visual stability during load | < 0.1 | **0** | — | — | — | — |
| Speed Index | How fast visible area fills in | < 3.4s | **2.3s avg** | — | — | — | — |

---

## Pages Tested

| Page | Type | Performance | LCP | CLS | Notes |
|------|------|-------------|-----|-----|-------|
| `/` | Homepage | 69 | 2.1s | 0 | Heaviest page, most components |
| `/request-service` | Lead form | 67 | 2.7s | 0 | Address autocomplete + Google Maps script |
| `/estimate` | Estimate form | 68 | 2.6s | 0 | BookServicePage variant |
| `/contact` | Contact | 72 | 2.3s | 0 | SimpleContactForm + CompanyPageTemplate |
| `/services` | Service index | 71 | 2.1s | 0 | Service listing page |
| `/services/residential/air-conditioning` | Service page (residential) | 67 | 2.4s | 0 | Residential service template |
| `/services/commercial/commercial-air-conditioning` | Service page (commercial) | 67 | 2.6s | 0 | Commercial service template |
| `/cities-served` | City index | 72 | 2.4s | 0 | City listing page |
| `/cities-served/dallas` | City page | 72 | 2.1s | 0 | Heaviest city page (most zip codes) |
| `/reviews` | Reviews | 71 | 2.1s | 0 | 100+ testimonials, heaviest data load |
| `/recent-projects` | Projects | 68 | 2.5s | 0 | RealWork 3rd party widget |
| `/about` | About | 71 | 1.8s | 0 | AboutPageTemplate — best LCP |
| `/faq` | FAQ | 73 | 2.4s | 0 | Accordion component — best performance |

---

## Conversion Metrics

*Source: Google Analytics 4 (GA4) — requires conversion event setup*

| Metric | What It Measures | Target | Baseline | Q3 2026 | Q4 2026 | Q1 2027 |
|--------|-----------------|--------|----------|---------|---------|---------|
| Form completion rate | % of visitors who start a form and submit | > 30% | Not yet tracked | — | — | — |
| Click-to-call rate (mobile) | % of mobile visitors who tap phone number | > 5% | Not yet tracked | — | — | — |
| Bounce rate | % of visitors who leave without interaction | < 50% | Not yet tracked | — | — | — |
| Pages per session | Average pages viewed per visit | > 2.0 | Not yet tracked | — | — | — |

**Action needed:** Set up GA4 conversion events for form submissions and click-to-call. Currently GA4 tracks pageviews only.

---

## Uptime & Reliability

| Metric | Target | Baseline (Apr 17, 2026) | Post-Upgrade | Q3 2026 | Q4 2026 | Q1 2027 |
|--------|--------|------------------------|--------------|---------|---------|---------|
| Site uptime | 99.9% | Vercel-managed (no incidents) | — | — | — | — |
| API response time (`/api/leads`) | < 500ms | **290ms** (warm) | — | — | — | — |
| Homepage response time | < 1s | **450ms** (warm) | — | — | — | — |
| Cron job (`sync-reviews`) | Runs daily at 6AM UTC | Authenticated, HTTP 200 | — | — | — | — |

---

## Security Posture

| Metric | Target | Baseline (Apr 17, 2026) | Post-Upgrade | Q3 2026 | Q4 2026 | Q1 2027 |
|--------|--------|------------------------|--------------|---------|---------|---------|
| Dependency vulnerabilities (total) | 0 | **23** (11 high, 12 moderate) | — | — | — | — |
| Security headers present | 6/6 | **6/6** | — | — | — | — |
| reCAPTCHA block rate | < 20% normal; investigate if > 50% | 0% (just deployed) | — | — | — | — |
| Rate limit triggers | Near 0 under normal traffic | 0 (just deployed) | — | — | — | — |
| Cron endpoint protected | Rejects unauthenticated requests | **Yes** (401 on unauth) | — | — | — | — |
| Input sanitization | All user input escaped in emails | **Yes** | — | — | — | — |

---

## Security Headers

| Header | Expected Value | Baseline | Post-Upgrade |
|--------|---------------|----------|--------------|
| X-Frame-Options | DENY | DENY | — |
| Content-Security-Policy | (full policy) | Present | — |
| X-Content-Type-Options | nosniff | nosniff | — |
| Referrer-Policy | strict-origin-when-cross-origin | Present | — |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Present | — |
| Strict-Transport-Security | max-age=63072000 | Present | — |

---

## Schedule

| Frequency | Trigger |
|-----------|---------|
| Before/after major upgrades | Next.js version change, dependency updates |
| Quarterly | Standing review (Q1, Q2, Q3, Q4) |
| After significant content changes | New pages, large content additions |
| After security changes | Header updates, CSP modifications |

---

## History Log

| Date | Event | Performed By | Notes |
|------|-------|-------------|-------|
| Apr 17, 2026 | Baseline capture (pre-Next.js upgrade) | Emergent Agent | Next.js 14.2.35, all 13 pages tested |
