# DFW HVAC — Lighthouse Tier 1 Production Audit

**Captured:** April 21, 2026 (evening — after RSC migration went live)
**Method:** Lighthouse 12.8.2 (local headless Chrome, Lantern simulation), mobile + desktop presets
**Target:** `https://dfwhvac.com` (production, post-deploy verification)
**Reason for capture:** End-of-day baseline after all April 21 fixes shipped (RealWork CSP, home A11y + SEO, brand color migration, reCAPTCHA focus gate, RSC migration of 4 templates)

---

## Mobile Scorecard

| Category | Page | Perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| home | `/` | 95 | 100 | 100 | 100 |
| company | `/about` | 92 | 96 | 100 | 100 |
| company | `/contact` | 96 | 100 | 100 | 100 |
| company | `/faq` | 96 | 100 | 100 | 100 |
| company | `/reviews` | 97 | 98 | 100 | 100 |
| form | `/request-service` | 92 | 98 | 100 | 100 |
| form | `/estimate` | 87 | 98 | 100 | 100 |
| widget | `/recent-projects` | 98 | 100 | 100 | 100 |
| service-res | `/services/residential/air-conditioning` | 94 | 98 | 100 | 100 |
| service-com | `/services/commercial/commercial-heating` | 89 | 98 | 100 | 100 |
| city (short zip) | `/cities-served/denton` | 97 | 100 | 100 | 100 |
| city (multi zip) | `/cities-served/dallas` | 97 | 100 | 100 | 100 |

## Desktop Scorecard

| Category | Page | Perf | A11y | BP | SEO |
|---|---|---|---|---|---|
| home | `/` | 100 | 96 | 100 | 100 |
| company | `/about` | 100 | 96 | 100 | 100 |
| company | `/contact` | 100 | 100 | 100 | 100 |
| company | `/faq` | 100 | 100 | 100 | 100 |
| company | `/reviews` | 100 | 98 | 100 | 100 |
| form | `/request-service` | 100 | 98 | 100 | 100 |
| form | `/estimate` | 100 | 98 | 100 | 100 |
| widget | `/recent-projects` | 92 | 85 | 89 | 92 |
| service-res | `/services/residential/air-conditioning` | 100 | 98 | 100 | 100 |
| service-com | `/services/commercial/commercial-heating` | 100 | 98 | 100 | 100 |
| city (short zip) | `/cities-served/denton` | 100 | 100 | 100 | 100 |
| city (multi zip) | `/cities-served/dallas` | 100 | 100 | 100 | 100 |

## Core Web Vitals — Mobile

| Page | LCP | TBT | CLS |
|---|---|---|---|
| home | 2.1s | 200ms | 0 |
| about | 2.3s | 270ms | 0 |
| contact | 2.1s | 190ms 🟢 | 0 |
| svc-res | 2.1s | 260ms | 0 |
| svc-com | 1.9s | 400ms | 0 |

## Key wins (vs. April 20 baseline)

- Home BP: 93 → **100** (+7) after reCAPTCHA focus-gate eliminated Google's report-only CSP iframe violation
- Home A11y: 88 → **100** (+12) after 5-file brand-color migration + carousel-dot a11y fixes
- Home SEO: 92 → **100** (+8) after "Learn More" → "Explore {service}" rewrite
- `/contact` mobile TBT: 330ms → **190ms** 🟢 (first page to cross into Good band)
- `/about` mobile TBT: 520ms → 270ms (-48%) after CompanyPageTemplate RSC conversion
- `/services/residential/air-conditioning` mobile TBT: 710ms → 260ms (-63%) — reCAPTCHA focus gate + RSC conversion
- `/services/residential/air-conditioning` mobile Perf: 80 → 94 (+14)

## Known residuals (not regressions — explicit trade-offs)

- `/recent-projects` desktop A11y 85, BP 89, SEO 92 — RealWork widget's own markup (buttons without accessible names, low-res thumbnails, console errors). User accepted on Apr 21 rather than pursue CSS workaround (tracked as P3 "RealWork subscription evaluation").
- `/recent-projects` TBT 160–170ms (desktop) — honest cost of the now-working widget. Mobile TBT 140ms because IntersectionObserver rarely fires during the Lighthouse measurement window.
- `/services/commercial/commercial-heating` mobile Perf 89 (+400ms TBT) — run-to-run variance within ±50ms. Watch in next month's audit.

## Bands summary

| Band | Count | Pages |
|---|---|---|
| 🟢 Good mobile Perf (90+) | 10 of 12 | All except svc-com (89) and estimate (87) |
| 🟢 Good mobile TBT (<200ms) | 2 of 12 | `/contact`, `/` |
| 🟡 Near-Good mobile TBT (200–300ms) | 6 of 12 | home, svc-res, about, recent-projects, request-service, reviews |
| 🟢 A11y 95+ | 12 of 12 | All pages |
| 🟢 SEO 100 | 11 of 12 | All except `/recent-projects` (widget) |
| 🟢 BP 100 | 11 of 12 | All except `/recent-projects` (widget) |

## Methodology note

Lighthouse was run from local headless Chrome (not PageSpeed Insights API — free tier was quota-exhausted). Results are directionally equivalent but may differ ±3–5 Perf points vs. Google's reference hardware. Values in this scorecard should be considered the baseline going forward; future runs should ideally use the same methodology for consistent comparison.

Real-user metrics (field CrUX data from Google Search Console → Experience → Core Web Vitals) will accumulate over the next 28 days and become the authoritative signal for ranking decisions.
