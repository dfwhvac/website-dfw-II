# DFW HVAC — Site Performance Scorecard

**Purpose:** Recurring benchmark to track site health across performance, accessibility, best practices, and SEO. Run before/after major changes and on a quarterly schedule.

**Tool:** Google Lighthouse (via CLI or Chrome DevTools)

---

## Overall Scores (0-100)

| Category | Target | Baseline (Pre-Upgrade) | Post-Upgrade | Q3 2026 | Q4 2026 | Q1 2027 |
|----------|--------|----------------------|--------------|---------|---------|---------|
| Performance | 90+ | — | — | — | — | — |
| Accessibility | 90+ | — | — | — | — | — |
| Best Practices | 90+ | — | — | — | — | — |
| SEO | 90+ | — | — | — | — | — |

---

## Performance Metrics (Detail)

| Metric | What It Measures | Target | Baseline | Post-Upgrade | Q3 2026 | Q4 2026 | Q1 2027 |
|--------|-----------------|--------|----------|--------------|---------|---------|---------|
| First Contentful Paint (FCP) | Time to first visible content | < 1.8s | — | — | — | — | — |
| Largest Contentful Paint (LCP) | Time to main content load | < 2.5s | — | — | — | — | — |
| Total Blocking Time (TBT) | Duration page is unresponsive | < 200ms | — | — | — | — | — |
| Cumulative Layout Shift (CLS) | Visual stability during load | < 0.1 | — | — | — | — | — |
| Speed Index | How fast visible area fills in | < 3.4s | — | — | — | — | — |

---

## Pages Tested

| Page | Type | Performance | LCP | CLS | Notes |
|------|------|-------------|-----|-----|-------|
| `/` | Homepage | — | — | — | Primary landing page |
| `/request-service` | Lead form | — | — | — | Key conversion page |
| `/services/residential/air-conditioning` | Service page | — | — | — | Representative service page |
| `/cities-served/dallas` | City page | — | — | — | Representative city page |
| `/reviews` | Reviews | — | — | — | Heavy content load |
| `/contact` | Contact | — | — | — | SimpleContactForm |
| `/recent-projects` | Projects | — | — | — | RealWork widget (3rd party) |
| `/about` | About | — | — | — | Company info |
| `/faq` | FAQ | — | — | — | Accordion content |

---

## Security Headers

| Header | Expected Value | Baseline | Post-Upgrade |
|--------|---------------|----------|--------------|
| X-Frame-Options | DENY | — | — |
| Content-Security-Policy | (full policy) | — | — |
| X-Content-Type-Options | nosniff | — | — |
| Referrer-Policy | strict-origin-when-cross-origin | — | — |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | — | — |
| Strict-Transport-Security | max-age=63072000 | — | — |

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
| — | Baseline capture (pre-Next.js upgrade) | — | — |
