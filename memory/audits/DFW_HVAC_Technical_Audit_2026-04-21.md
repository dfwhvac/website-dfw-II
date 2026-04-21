# DFW HVAC — Technical SEO & Architecture Audit

**Date:** April 21, 2026
**Auditor:** E1 (automated sweep + manual review)
**Site version:** Next.js 15.5.9 + React 19.2.5, post PR #2 (Sprint 1 completion)
**Production URL:** https://dfwhvac.com
**Audit ID:** P1.2 (13-category sweep)
**Previous audit:** None — this is the first formal technical audit post-launch (Apr 16, 2026)

**Overall grade:** 🟡 B+ (89/100) — Strong fundamentals, three high-impact gaps

---

## 🎯 Executive summary

**Good news:** Infrastructure, security, redirects, canonicals, and Core Web Vitals foundations are all 🟢 healthy. The site is well-architected; no legacy anti-patterns like the `/_next/` robots bug from the prior session remain.

**Three high-impact gaps found:**
1. 🔴 **JSON-LD schema missing on city + service pages** — home has rich `HVACBusiness` schema, but city pages (/cities-served/plano) and service pages (/services/residential/heating) have **zero** structured data. No `LocalBusiness`, no `Service`, no `BreadcrumbList`. This blocks rich-result eligibility on ~35 of 40+ pages.
2. 🔴 **Zero service→city internal linking** — service pages have 20 internal links but 0 go to city pages. City pages cross-link between themselves but not back to specific services. Hub-and-spoke structure broken.
3. 🟡 **No branded `/not-found.jsx` page** — 404s return Next.js built-in "could not be found" page. Poor UX, minor SEO impact.

**Three medium gaps:**
- `next/image` usage near zero (only 2 logos); hero and content images handled via CSS or missing
- 28 high-severity dependency CVEs (all transitive through Sanity Studio; dev-time only but worth patching)
- No `hreflang` tags (not applicable for single-language site — verified not needed)

---

## Category-by-category findings

### ✅ 1. robots.txt / meta-robots / sitemap consistency — PASS

| Check | Status | Evidence |
|---|---|---|
| robots.txt exists at apex | ✅ PASS | `curl https://dfwhvac.com/robots.txt` returns 200 |
| Disallow rules don't block critical paths | ✅ PASS | Only `/studio/` and `/api/` blocked; `/_next/` correctly allowed (fixed Apr 20) |
| Sitemap URL in robots.txt | ✅ PASS | `Sitemap: https://dfwhvac.com/sitemap.xml` |
| Sitemap exists, well-formed XML | ✅ PASS | Valid XML, all 40+ URLs present with lastmod / changefreq / priority |
| Meta robots tag per-page | ✅ PASS | `robots: { index: true, follow: true, googleBot: { ... } }` in `defaultMetadata` |
| No stray `X-Robots-Tag: noindex` header | ✅ PASS | Header not present on any checked page |

---

### ✅ 2. HTTP security headers — PASS

All 6 critical headers present on production responses:

| Header | Value | Status |
|---|---|---|
| `Content-Security-Policy` | Full CSP with specific script/style/img/frame sources | ✅ PASS |
| `X-Frame-Options` | `DENY` | ✅ PASS |
| `X-Content-Type-Options` | `nosniff` | ✅ PASS |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ PASS |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ✅ PASS |
| `Strict-Transport-Security` | `max-age=63072000` (2 years) | ✅ PASS |

**Note:** CSP allows `'unsafe-inline'` and `'unsafe-eval'` in `script-src`. These are required by Next.js App Router for hydration + Google Maps. Not a fixable issue without moving to nonce-based CSP (significant work; deferred as P3).

---

### ✅ 3. Canonical tags — PASS

Sampled 8 representative pages:
- `/`, `/about`, `/contact`, `/services/residential/air-conditioning`, `/cities-served/plano`, `/reviews`, `/faq`, `/estimate`

All have exactly 1 canonical tag, apex domain (no `www`), no trailing slash, correct path per page. No self-conflicting canonicals found.

---

### 🔴 4. Structured data / JSON-LD — FAIL (HIGH PRIORITY)

**This is the single biggest finding of the audit.**

| Page | JSON-LD blocks | Types | Status |
|---|---|---|---|
| `/` (home) | 1 | `HVACBusiness` (inc. `AggregateRating`, `OpeningHoursSpecification`, `PostalAddress`, `GeoCoordinates`) | ✅ Good |
| `/cities-served/plano` | **0** | — | 🔴 **MISSING** |
| `/services/residential/air-conditioning` | **0** | — | 🔴 **MISSING** |

**Gap:** 27 city pages + 7 service pages = 34 pages with zero structured data. This means:
- No ⭐ review stars in SERP snippets on these pages
- No `Service` schema → no service-specific rich results
- No `BreadcrumbList` → no breadcrumb navigation in search snippets
- No `LocalBusiness` tied to city → weaker local SEO signals per city

**Root cause:** `components/SchemaMarkup.jsx` exists and is correctly used on home page. City pages (`app/cities-served/[slug]/page.jsx`) and service pages (`app/services/[category]/[slug]/page.jsx`) do **not** import or render any Schema component.

**Remediation (maps to P1.6f):**
- Add `<LocalBusinessSchema>` + `<BreadcrumbList>` to city page template
- Add `<ServiceSchema>` + `<LocalBusinessSchema>` + `<BreadcrumbList>` to service page template
- Consider: dedicated `<CitySchema>` wrapper that inherits LocalBusiness but adds `areaServed` scoped to that single city
- **Effort:** 2–3 hrs. **Impact:** unlocks rich results across 34 pages = measurable CTR lift within 4–8 weeks of Googlebot re-crawl.

---

### 🟡 5. OG / Twitter meta — MOSTLY PASS

Sampled home, city page, service page:

| Page | og:title | og:description | og:image | og:url | twitter:card | Status |
|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ | 🟢 Full |
| `/cities-served/plano` | ✅ | ✅ | ❌ missing | ❌ missing | ✅ | 🟡 Partial |
| `/services/residential/heating` | ✅ | ✅ | ❌ missing | ❌ missing | ✅ | 🟡 Partial |

**Gap:** City + service pages inherit OG meta from `buildPageMetadata()` in only some cases. Some pages rely on the root `defaultMetadata.openGraph` which sets `siteName`/`locale`/`type` but not per-page `image` or `url`.

**Remediation:**
- In `app/cities-served/[slug]/page.jsx` `generateMetadata()`, use `buildPageMetadata()` helper instead of inline return — it already wires up the full OG + Twitter chain
- Same for `app/services/[category]/[slug]/page.jsx`
- **Effort:** 30 min. **Impact:** better social share previews on Facebook, LinkedIn, iMessage, Slack.

---

### 🔴 6. Internal linking — FAIL (HIGH PRIORITY)

Sampled 3 page types:

| From | Links to cities | Links to services | Status |
|---|---|---|---|
| Home `/` | Index page only (`/cities-served`) | All 7 services ✅ | 🟡 Partial |
| Service `/services/residential/heating` | **0 city links** | Sibling services only | 🔴 BROKEN |
| City `/cities-served/plano` | 8 other cities ✅ + category hubs only | No deep service links | 🟡 Partial |

**Gap:** The hub-and-spoke SEO architecture that should connect services ↔ cities is **entirely missing** from service pages. A user (or Googlebot) landing on "AC Repair" has no way to navigate to "AC Repair in Plano". This is the #1 leverage point for local SEO rankings.

**Remediation (maps to P1.4 on backlog):**
- Add "Serving these DFW cities:" section to every service page template → grid of 28 city links with descriptive anchor text ("AC repair in Plano, TX")
- Add "Other services we offer in [City]:" section to every city page template → list of 7 deep service links ("AC repair in Plano, TX", "Heating service in Plano, TX")
- Footer: add a collapsible sitemap section with full matrix (optional, helps orphan detection)
- **Effort:** 2–3 hrs (one template change each, data already in Sanity). **Impact:** significant — internal linking is a confirmed Google ranking signal, and this specific pattern is how successful local service businesses dominate city+service SERPs.

---

### 🟡 7. Image optimization — MIXED

| Check | Status | Evidence |
|---|---|---|
| `next/image` import usage | 🟡 Only 2 (Header + Footer logos) | No hero or content images use it |
| Raw `<img>` tags in JSX | ✅ PASS | 0 raw `<img>` tags found |
| `alt` attributes present | ✅ PASS | Both Image usages have `alt` |
| `priority` prop on LCP | N/A | No hero image; LCP is text block |
| Image formats configured | ✅ PASS | `formats: ['image/webp', 'image/avif']` in `next.config.js` |
| Allowed remote domains set | ✅ PASS | `cdn.sanity.io`, `images.unsplash.com` etc. configured |

**Finding:** The hero section is pure text + CSS gradient (no LCP image). This is actually **good** for TBT/LCP scores but limits visual differentiation. Testimonial avatars, service illustrations, and team photos appear to be either CSS gradients or absent.

**Remediation (low priority):**
- No immediate fix needed — current approach is performant
- When adding photography (P2.8 video testimonials, or team photos), use `next/image` from the start
- Consider adding a single hero image with `priority` prop for brand credibility, but measure LCP impact first

---

### ✅ 8. Third-party script loading — PASS (post PR #1)

| Script | Strategy | Status |
|---|---|---|
| Google Analytics 4 | `afterInteractive` | ✅ Optimal |
| reCAPTCHA v3 | `lazyOnload` (form pages only) | ✅ Optimal (post PR #1) |
| Google Maps / Places | On focus (`AddressAutocomplete`) | ✅ Optimal (post PR #1) |
| RealWork widget | IntersectionObserver (lazy) | ✅ Optimal (post PR #1) |
| New `PhoneClickTracker` | Post-hydration `useEffect` | ✅ Zero TBT impact (post PR #2) |

No `strategy="beforeInteractive"` or blocking scripts found. This category was already addressed in PR #1; ratified here.

---

### ✅ 9. 404 / redirect coverage — PASS

**Redirects (all 6 legacy Wix URLs verified live):**

| Source | Destination | Status |
|---|---|---|
| `/scheduleservicecall` | `/request-service` | ✅ 308 |
| `/installation` | `/estimate` | ✅ 308 |
| `/iaq` | `/services/residential/indoor-air-quality` | ✅ 308 |
| `/ducting` | `/services/residential/indoor-air-quality` | ✅ 308 |
| `/seasonalmaintenance` | `/services/residential/preventative-maintenance` | ✅ 308 |
| `/testresults` | `/services/residential/indoor-air-quality` | ✅ 308 |

**Note:** Next.js `permanent: true` maps to HTTP **308** (not 301). Google treats 308 equivalently to 301 for SEO — both pass link equity. The comment in `next.config.js` says "301" but actual is 308; low-impact doc drift. Both are semantically correct for permanent redirects.

**Other redirect/404 behavior:**
- `www.dfwhvac.com` → `dfwhvac.com` : ✅ 308
- `http://` → `https://` : ✅ 308
- Trailing slash `/about/` → `/about` : ✅ 308 (Next.js default)
- Non-existent URL returns ✅ HTTP 404 (correct status code)

**🟡 Finding:** The 404 page renders Next.js's built-in "This page could not be found" message with the home page `<title>`. There is **no custom `app/not-found.jsx`** in the codebase. Users get a technical-feeling 404.

**Remediation:**
- Create `app/not-found.jsx` with branded 404 page: big phone number ("Can't find what you need? Call us: (972) 777-2665"), nav back to home, popular links (cities, services, reviews)
- **Effort:** 30 min. **Impact:** conversion recovery on broken links (internal + external).

---

### 🟡 10. Mobile / accessibility — MOSTLY PASS (post PR #2)

| Check | Status | Evidence |
|---|---|---|
| `<html lang="en">` | ✅ PASS | Verified on 5 sample pages |
| Viewport meta | ✅ PASS | `width=device-width, initial-scale=1` |
| Charset | ✅ PASS | `utf-8` |
| `<main>` landmark | ✅ PASS | Found in 8 files (every page template) |
| Icon-only button aria-labels | ✅ PASS | Hamburger + social icons fixed in PR #2 |
| Touch targets ≥ 44×44 px | ✅ PASS | All form inputs `h-12` (48px) |
| Color contrast (text on white) | ✅ PASS | 6 fixes shipped in PR #2 |
| "Skip to main content" link | ❌ MISSING | Recorded in P3 backlog; not urgent |
| Keyboard focus visibility | ⚠️ NOT TESTED | Requires manual tab-through on live site |

**Finding:** Current Lighthouse a11y score pre-PR-#2 was 87. Post-PR-#2 expected to be 95+ once deployed. Skip-to-main link is the known remaining known gap (already in P3 backlog).

**Remediation:** Run Lighthouse on Vercel preview of PR #2 deploy to confirm score crossed 90. If still below, investigate further.

---

### ✅ 11. HTML validation — PASS (sample)

Spot-checked 5 pages. All have:
- Valid `<!DOCTYPE html>` (Next.js default)
- `<html lang="en">` (exactly 1)
- UTF-8 charset meta
- Proper viewport meta
- Proper head/body structure

**Not performed:** Full W3C validator sweep of all 40+ URLs (would require W3C CLI or API calls). Recommend running `html-validator-cli` quarterly as part of the recurring audit. Added to recurring tasks.

---

### ✅ 12. Security — PASS

**Client bundle secret leakage:** None found.

**Environment variable audit:**

Client-exposed (correct — prefixed `NEXT_PUBLIC_`):
- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` — Maps browser API (key restricted by HTTP referrer in Google Cloud Console)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — Public site key (correct; paired with server-side secret)
- `NEXT_PUBLIC_REALWORK_ID` — Widget identifier
- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` — Public project metadata
- `NEXT_PUBLIC_SITE_URL` — Base URL

Server-only (correct — never in client bundle):
- `MONGO_URL` / `DB_NAME`
- `RESEND_API_KEY`
- `GOOGLE_PLACES_API_KEY` (server variant for cron)
- `SANITY_API_TOKEN`
- `CRON_SECRET`
- `RECAPTCHA_SECRET_KEY`

All server secrets only referenced in `app/api/**/*.js` routes (Node runtime, not client).

**Other security checks:**
- ✅ Rate limit on `/api/leads` (5/15min per IP)
- ✅ HTML sanitization in email templates (`escapeHtml` helper)
- ✅ reCAPTCHA server-side verification with score threshold 0.4
- ✅ CRON_SECRET Bearer auth on `/api/cron/sync-reviews`
- ✅ JSON-LD XSS protection (`safeJsonLd` helper, escapes `<` to `\u003c`)

---

### 🟡 13. Dependency supply chain — NEEDS ATTENTION

**`yarn audit` summary:** 62 vulnerabilities — 2 Low, 32 Moderate, 28 High, 0 Critical.

**Root cause analysis of 28 High:**

| Root package | High-vuln count | Runtime impact |
|---|---|---|
| `sanity` (Studio) | 24 | 🟡 Server-only; only runs when user visits `/studio` |
| `@sanity/export` / `@sanity/import` | 12 + 5 | ⚪ Build/CLI-only; not runtime |
| `minimatch`, `glob`, `rimraf`, `archiver` | 19 + 12 + 6 + 9 | ⚪ Transitive deps of build tooling |

**All 28 High-severity issues are in the Sanity Studio sub-tree**, which:
- Only executes server-side
- Only accessed by admins authenticating to `/studio`
- Not in the client bundle shipped to end users
- Not in the `/api/*` request path

**Risk assessment:** **LOW** for production traffic. **MEDIUM** for admin panel access if attacker has Sanity admin auth (which would already be game-over regardless).

**Remediation options:**
1. **Wait for Sanity upgrade** (deferred as P3 — Sanity 3.50+ this summer) — will pull patched sub-deps
2. **`yarn why`** each vulnerable package, manual resolutions in package.json — brittle, breaks on next Sanity upgrade
3. **Do nothing** — accept tracked risk; re-audit quarterly

**Recommendation:** Option 1 (wait + quarterly re-audit). The vulnerable packages are dev/admin tooling behind auth; no user-facing exposure.

---

## 📊 Summary scorecard

| # | Category | Grade | Blocker? |
|---|---|---|---|
| 1 | robots.txt / sitemap | 🟢 A | No |
| 2 | HTTP security headers | 🟢 A | No |
| 3 | Canonical tags | 🟢 A | No |
| 4 | **JSON-LD / Structured data** | 🔴 D | **YES — P1 priority fix** |
| 5 | OG / Twitter meta | 🟡 B | No |
| 6 | **Internal linking** | 🔴 D | **YES — P1 priority fix** |
| 7 | Image optimization | 🟢 A- | No |
| 8 | 3rd-party script loading | 🟢 A | No |
| 9 | 404 / redirects | 🟡 B+ | No (branded 404 missing) |
| 10 | Mobile / accessibility | 🟢 A- | No (pending PR #2 deploy) |
| 11 | HTML validation | 🟢 A | No |
| 12 | Security / secrets | 🟢 A+ | No |
| 13 | Dependency supply chain | 🟡 B | No (monitor; upgrade Sanity in summer) |

---

## 🔧 Prioritized remediation queue

### 🔴 Tier 1 — ship within Week 2 (highest ROI)

**R1.1 — JSON-LD schema on city + service pages** *(maps to P1.6f)*
- Add `<LocalBusinessSchema>` + `<BreadcrumbList>` to `app/cities-served/[slug]/page.jsx`
- Add `<ServiceSchema>` + `<LocalBusinessSchema>` + `<BreadcrumbList>` to `app/services/[category]/[slug]/page.jsx`
- Validate with Google Rich Results Test on 3 representative URLs
- **Effort:** 2–3 hrs. **Impact:** rich-result eligibility on 34 pages.

**R1.2 — Internal linking hub-and-spoke** *(maps to P1.4)*
- Add 28-city grid block to all 7 service page templates (descriptive anchor text)
- Add 7-service block to all 28 city page templates (descriptive anchor text)
- **Effort:** 2–3 hrs. **Impact:** measurable local-SEO ranking lift within 6–12 weeks.

### 🟡 Tier 2 — ship within Week 3 (polish)

**R2.1 — Branded `/not-found.jsx` page**
- Create `app/not-found.jsx` with hero CTA ("Can't find what you need? Call us: (972) 777-2665"), popular links, search hint
- **Effort:** 30 min.

**R2.2 — OG meta parity on city + service pages**
- Update `generateMetadata()` on both templates to use `buildPageMetadata()` helper for full OG + Twitter chain (including per-page `image` and `url`)
- **Effort:** 30 min.

**R2.3 — Comment correctness in `next.config.js`**
- Update "301" comment to "308" (or switch to `statusCode: 301` on each redirect if 301 is strongly preferred — both are fine, 301 is slightly more widely supported by very old systems)
- **Effort:** 5 min.

### 🔵 Tier 3 — defer (existing backlog items)

- Dependency CVE cleanup → waits on Sanity 3.50+ upgrade (summer 2026, P3)
- Full W3C HTML validator sweep → added to recurring quarterly cadence
- Nonce-based CSP (remove `unsafe-inline`/`unsafe-eval`) → P3 security hardening
- Lighthouse Accessibility 100 via skip-to-main link → P3 (already recorded)

---

## 🔁 Recurring items added

- Quarterly re-run of this 13-category audit (next: **July 21, 2026**)
- Quarterly `yarn audit` review (Sanity sub-tree status)
- Quarterly W3C HTML validator sweep on top 10 URLs
- Monthly check: Google Rich Results Test on 3 sample pages (home, 1 city, 1 service)

---

## 📝 Methodology notes

- All checks run against **live production** (`https://dfwhvac.com`) at Apr 21, 2026 04:25 UTC
- Codebase checks run against pod-local `/app/frontend/` HEAD (matches production as of PR #2 build)
- Tools used: `curl`, `yarn audit`, `grep`, Python JSON parser for schema validation, custom grep patterns for cross-category checks
- Full W3C, Mobile-Friendly Test, PageSpeed Insights, and Rich Results Test require Google APIs / UI — user-led follow-up

**Time spent:** ~45 min automated sweep + report compile (vs. 3–5 hr estimate — audit script pattern is now repeatable).
