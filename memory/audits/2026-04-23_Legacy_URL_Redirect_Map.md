# Legacy Wix URL Redirect Map — Final Implementation
**Date:** April 23, 2026
**Status:** ✅ Deployed
**Author:** E1 (implementation + verification)

---

## Context

DFW HVAC migrated from Wix (legal entity "Alpine HVAC Pros", now abandoned) to a Next.js + Sanity stack. During GSC indexing analysis on Apr 23, 2026, we discovered that multiple legacy Wix URLs still appear in Google's index or are being actively crawled:

- `/aboutus` → 404 (Google's "Crawled – currently not indexed" bucket)
- `/servicecall` → 404 (Google's "Not Found" bucket)
- `/_files/ugd/*.pdf` → still remembered from Oct 2023 (Google's "Excluded by noindex" bucket)

Root cause: migration did not include a comprehensive 301 redirect map. Some redirects were set up (`/scheduleservicecall`, `/installation`, `/ducting`, `/iaq`, `/testresults`, `/seasonalmaintenance`) but many were missed.

This audit extracted the full legacy page inventory from the Wix admin dashboard (SEO Settings tab showed exact URL slugs for all 14 pages), cross-referenced with the Wix URL Redirect Manager (which had 1 existing entry: `/copy-of-ac-furnace-repair` → `/seasonalmaintenance`), and produced a complete redirect map covering every known legacy slug.

---

## Implementation summary

Two changes shipped in `/app/frontend`:

### 1. `next.config.js` — expanded `async redirects()` block
Added 5 new 301 redirects to cover URLs missing from the prior mapping:
- `/aboutus` → `/about`
- `/servicecall` → `/request-service`
- `/haloled` → `/services/residential/indoor-air-quality`
- `/copy-of-ac-furnace-repair` → `/services/residential/preventative-maintenance` (preserves the intent of a Wix-era redirect, single hop)
- `/products` → `/services`

Kept 6 pre-existing redirects:
- `/scheduleservicecall` → `/request-service`
- `/installation` → `/estimate` *(TODO: update to dedicated install page when P1.13 ships)*
- `/ducting` → `/estimate` *(TODO: update to dedicated ducting page when built)*
- `/iaq` → `/services/residential/indoor-air-quality`
- `/testresults` → `/services/residential/indoor-air-quality`
- `/seasonalmaintenance` → `/services/residential/preventative-maintenance`

Total: **11 permanent (308/301) redirects** covering every legacy Wix page.

### 2. `middleware.js` (new file) — 410 Gone responses
Returns HTTP 410 Gone (stronger signal than 404 — tells Google to remove from index permanently) with a branded helpful HTML body for:

**Exact paths:**
- `/equipment` (non-applicable old Wix page)
- `/signup`, `/login`, `/my-account` (Wix members-area URLs)
- `/copy-of-energy-conservation` (Wix-auto-generated duplicate)

**Prefix patterns:**
- `/_files/ugd/*` (Wix CDN PDF/document phantoms — catches unlimited file URLs)
- `/post/*`, `/blog/*` (Wix blog URLs; site never had a real blog but may have 3 published test posts we want to permanently kill)
- `/copy-of-*` (any Wix-auto-generated duplicate EXCEPT the explicit 301 above, which is processed first)

Response includes: `X-Robots-Tag: noindex, nofollow` header + branded 410 HTML with nav to Home, Services, Request Service, Contact, and the click-to-call phone number.

---

## Full redirect map — tabular

| # | Legacy Wix URL | Action | Target | Status Code | TODO? |
|---|---|---|---|:-:|---|
| 1 | `/` | keep | `/` | 200 | — |
| 2 | `/aboutus` | redirect | `/about` | 308 | — |
| 3 | `/servicecall` | redirect | `/request-service` | 308 | — |
| 4 | `/scheduleservicecall` | redirect | `/request-service` | 308 | — |
| 5 | `/installation` | redirect | `/estimate` | 308 | Update to `/services/system-installation` when P1.13 ships |
| 6 | `/ducting` | redirect | `/estimate` | 308 | Update to dedicated ducting page when built |
| 7 | `/iaq` | redirect | `/services/residential/indoor-air-quality` | 308 | — |
| 8 | `/haloled` | redirect | `/services/residential/indoor-air-quality` | 308 | — |
| 9 | `/testresults` | redirect | `/services/residential/indoor-air-quality` | 308 | — |
| 10 | `/seasonalmaintenance` | redirect | `/services/residential/preventative-maintenance` | 308 | — |
| 11 | `/copy-of-ac-furnace-repair` | redirect | `/services/residential/preventative-maintenance` | 308 | — |
| 12 | `/products` | redirect | `/services` | 308 | — |
| 13 | `/recent-projects` | keep | `/recent-projects` | 200 | identical URL |
| 14 | `/equipment` | **410** | — | 410 | permanently gone |
| 15 | `/copy-of-energy-conservation` | **410** | — | 410 | permanently gone |
| 16 | `/copy-of-*` (any other) | **410** | — | 410 | catch-all |
| 17 | `/signup`, `/login`, `/my-account` | **410** | — | 410 | Wix members-area |
| 18 | `/_files/ugd/*` | **410** | — | 410 | Wix CDN file catch-all |
| 19 | `/post/*`, `/blog/*` | **410** | — | 410 | Wix blog catch-all |
| 20 | `/sc` | ignore | — | — | was external link on old site, not a real page |

---

## Verification (curl test suite — all passed Apr 23, 2026)

### 301/308 redirects
```
/aboutus                          → 308 → /about
/servicecall                      → 308 → /request-service
/scheduleservicecall              → 308 → /request-service
/installation                     → 308 → /estimate
/ducting                          → 308 → /estimate
/iaq                              → 308 → /services/residential/indoor-air-quality
/testresults                      → 308 → /services/residential/indoor-air-quality
/haloled                          → 308 → /services/residential/indoor-air-quality
/seasonalmaintenance              → 308 → /services/residential/preventative-maintenance
/copy-of-ac-furnace-repair        → 308 → /services/residential/preventative-maintenance
/products                         → 308 → /services
```

### 410 Gone (middleware)
```
/equipment                        → 410
/signup                           → 410
/login                            → 410
/my-account                       → 410
/copy-of-energy-conservation      → 410
/copy-of-random-test              → 410  (catch-all works)
/_files/ugd/5ab42d_test.pdf       → 410
/post/old-post                    → 410
/blog/old-post                    → 410
```

### Regression check (untouched URLs)
```
/                                 → 200
/about                            → 200
/services                         → 200
/request-service                  → 200
/cities-served/plano              → 200
/services/residential/air-conditioning → 200
/sitemap.xml                      → 200
/robots.txt                       → 200
```

---

## Source data for this map

1. **Wix Site Menu screenshots** (Apr 23, 10:40 AM) — showed full page structure + hidden pages
2. **Wix SEO Settings screenshots** (Apr 23, 10:42 AM) — source-of-truth for exact URL slugs and legacy title tags
3. **Wix URL Redirect Manager screenshot** (Apr 23, 11:19 AM) — showed 1 existing Wix-era redirect to preserve
4. **User-provided intent decisions** on 6 ambiguous mappings (Apr 23 session conversation)

User decisions applied:
- `/servicecall` → `/request-service` (user choice a)
- `/installation` → `/estimate` then future `/services/system-installation` (fold into P1.13)
- `/ducting` → `/estimate` then future dedicated page (same strategy as installation)
- `/products` → `/services` (user choice a)
- `/copy-of-energy-conservation` → 410 (user: "non-applicable, 410 it")
- `/equipment` → 410 (user: "non-applicable, 410 it")
- Blog → treat as never existed, 410 catch-all (user: "may begin a blog in future")

---

## SEO impact expected

| Metric | Before | Expected after | Mechanism |
|---|---|---|---|
| Missing-redirect 404s on legacy URLs | 5+ URLs | 0 | 301 coverage |
| GSC "Not Found (404)" bucket | 1 (`/servicecall`) | 0 | Now 301 |
| GSC "Crawled – currently not indexed" | 2 (`/aboutus` + Argyle) | 1 (Argyle only) | `/aboutus` now properly redirects to indexable page |
| Wix CDN phantom URLs in GSC memory | Unknown (at least 1 PDF) | Auto-pruned within 6 months | 410 Gone = hard delete signal |
| Backlink equity from legacy URLs | Lost (404) | Recovered (301 target) | Link equity transfers through 301 |
| Branding consistency | Old "Alpine HVAC Pros" titles in Google snippets for legacy URLs | Resolved (legacy URLs 301 to DFW HVAC pages) | Title rewrite happens via destination page |

---

## Next actions depending on this

- **Immediate (user-led):** P1.17a manual indexing requests for the 27 "Discovered – currently not indexed" URLs in GSC. This deploy doesn't address those 27 (they need crawl-budget lift, not redirects).
- **Near-term (code):** When P1.13 `/services/system-replacement` ships, update `/installation` and `/ducting` 308 targets in `next.config.js`.
- **Monitoring:** Revisit GSC "Not Found" + "Excluded" buckets in 2–3 weeks. Expected: 410 URLs drop off GSC entirely within 60–180 days.

---

## Files changed

- `/app/frontend/next.config.js` — 5 new 301s added (`/aboutus`, `/servicecall`, `/haloled`, `/copy-of-ac-furnace-repair`, `/products`) + TODO comments on `/installation` + `/ducting`
- `/app/frontend/middleware.js` — **NEW** file, handles 410 Gone responses for non-applicable URLs + catch-all patterns
- `/app/memory/CHANGELOG.md` — entry added
- `/app/memory/ROADMAP.md` — P1.17d marked complete
- `/app/memory/audits/README.md` — index updated
- `/app/memory/audits/2026-04-23_Legacy_URL_Redirect_Map.md` — this document

No existing content routes, page templates, or API endpoints were modified. Middleware runs on all non-static requests but short-circuits in <1ms for non-matching paths.
