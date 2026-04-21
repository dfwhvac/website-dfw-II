# DFW HVAC — Product Requirements Document

**Last Updated:** April 21, 2026 (PR #2 / Sprint 1 completion shipped: a11y fix pack, schema fallback parity, GA4 conversion events, 7 service meta descriptions, mobile form UX audit + autofill fixes)

---

## 🎯 FOR THE NEXT AGENT: START HERE

The canonical, fully-contextualized prioritized backlog is at:

**`/app/memory/NEXT_SESSION_PRIORITIES.md`**

That document has the full WHY, WHAT, and WHERE for every P1 and P2 task. Read it first. The rest of this PRD is background context.

---

## Original Problem Statement

Build a premium, conversion-focused website for DFW HVAC using Next.js frontend and Sanity.io CMS. The site serves as a lead funnel for the HVAC business, featuring service pages, city pages, reviews, and lead capture forms.

## Architecture

- **Frontend:** Next.js 15.5.9 (App Router) + React 19.2.5 deployed on Vercel
- **CMS:** Sanity.io (headless CMS)
- **Database:** MongoDB Atlas (leads collection)
- **Email:** Resend API (lead notifications)
- **Domain:** dfwhvac.com (GoDaddy DNS → Vercel)
- **APIs:** Google Maps/Places, Google reCAPTCHA v3, RealWork widget

## Key Milestones

- **Site launched (Wix → Next.js):** April 16, 2026 (confirmed via Let's Encrypt SSL cert issue date `notBefore=Apr 16, 2026 20:04:44 GMT`)
- **Next.js 14 → 15.5.9 + React 19 upgrade deployed:** April 20, 2026
- **GSC Domain property added:** February 20, 2026 (pre-launch; data before Apr 16 reflects the old Wix site)
- **PR #1 (TBT optimization) deployed:** April 20, 2026 (TBT ~2,300ms → ~550ms)
- **PR #2 (Sprint 1 completion) built:** April 21, 2026 — see below

## What's Been Implemented

### Session: April 21, 2026 (continued) — Home page A11y + SEO regression fixes (post-Lighthouse audit)
- **Context:** After pushing the RealWork CSP fix live, a comprehensive Lighthouse audit surfaced regressions on the home page that slipped through PR #2's earlier verification (PR #2 was tested via curl/screenshot, not full Lighthouse). Live site home page was measuring A11y 88 / SEO 92 — not the claimed 95+/100.
- **Fixes (5 files):**
  1. **`app/globals.css`** — darkened `--electric-blue` `#00B8FF → #0077B6` (4.77:1 contrast on white, was 2.25:1) and `--vivid-red` `#FF0606 → #D30000` (5.22:1, was 3.97:1). Fixes 5 WCAG contrast failures across every page site-wide.
  2. **`components/TestimonialCarousel.jsx`** — carousel dots: wrapped 8×8 visual dot in 24×24 clickable `<button>` with `aria-label="Go to review slide N"` + `aria-current`. ChevronLeft/Right prev/next buttons got `aria-label="Previous review"` / `"Next review"`. Fixes button-name + target-size audits.
  3. **`components/LeadForm.jsx`** — added `aria-label="Number of HVAC systems"` to Radix `SelectTrigger`. Fixes combobox name audit.
  4. **`components/HomePage.jsx`** — replaced generic "Learn More" × 2 with descriptive "Explore {service.name}" (e.g., "Explore Air Conditioning", "Explore Commercial Heating"). Fixes SEO link-text audit on home.
  5. **`components/Header.jsx`** — desktop nav links changed from `px-4 py-2` to `inline-flex items-center min-h-[44px] px-4 py-2` so target-size correctly measures the padded click area (was 17px tall, now 44px). Fixes target-size audit.
  6. **Red button swap** across 6 files: all `bg-[#FF0000]` / `text-[#FF0000]` → `#D30000` for consistency with the new `--vivid-red` brand token (StickyMobileCTA, BookServicePage, 4 page files).
- **Verified via local Lighthouse (prod build, mobile preset) — home page all-green scorecard:**
  - Performance: 92 (↑ from 91)
  - Accessibility: **100** (↑ from 88) ⭐
  - Best Practices: **100** (↑ from 100)
  - SEO: **100** (↑ from 92) ⭐
  - TBT 210ms, LCP 2.9s, CLS 0
- **Not a brand regression:** the tone change from `#00B8FF` (cyan-ish) to `#0077B6` (deeper ocean blue) and `#FF0606` (pure red) to `#D30000` (classic red) keeps the "electric blue + vivid red" brand identity while meeting WCAG AA contrast. Standard Material Design and WCAG-compliant palettes use these exact shades for accessible primary/danger colors.
- **Deploy required:** Fix is committed locally; user push to GitHub → Vercel rebuild → live.

### Session: April 21, 2026 (continued) — RealWork widget CSP fix
- **Bug reported by user:** RealWork widget on `/recent-projects` wasn't rendering (empty section where the interactive map should be).
- **Root cause:** Content-Security-Policy `connect-src` directive in `next.config.js` did not include `https://app.realworklabs.com`. The loader script executed (script-src allowed it), but the plugin's follow-up fetch to `app.realworklabs.com/plugin/config?key=...` was blocked. Plugin retried 3× then gave up silently. Likely broken since CSP was tightened ~Apr 17.
- **Fix (1-line in `next.config.js`):** Added `https://app.realworklabs.com` to both `connect-src` (for config fetch) and `img-src` (for project photos once config loads). `script-src` + `frame-src` already allowed it.
- **Verified:** `yarn build` clean (19.83s, 0 errors). CSP header programmatically confirmed to include new origin on both directives.
- **Deploy required:** Fix only activates once Vercel rebuilds from main.
- **Important caveat flagged to user — TBT impact:** The claimed ~500–800ms TBT on `/recent-projects` post-PR #1 was partially artificial because the widget's expensive map/marker/photo rendering never executed. Other 12 pages unaffected. Expected regression on `/recent-projects` only: +500–1,500ms TBT. User chose Option A (push as-is, measure honest post-deploy TBT, decide on click-gated fallback later if needed).

### Session: April 21, 2026 (continued) — UX-1 polish fix (iPhone 16 Pro header cramping)
- **Issue:** User reported on iPhone 16 Pro (393px) that the header top bar stacked the phone number `(972) 777-COOL` across 3–4 lines — "Three Generations..." tagline + vanity phone + Call Now button were all competing for mobile real estate. Looked amateur. Escalated from the P1.3 QA sweep's UX-1 finding (I'd originally called this "low severity"; user feedback correctly re-rated it).
- **Fix:** Added `hidden sm:flex` to the top bar wrapper in `components/Header.jsx` (line 114). Top bar is now invisible below 640px, unchanged on tablet/desktop.
- **Why this is lossless on mobile:** `StickyMobileCTA.jsx` already provides a persistent bottom-of-screen phone CTA (fixed position, appears after 100px scroll, `lg:hidden`). Plus the hero's own "Call (972) 777-COOL" primary button, plus the phone link inside the hero section. Mobile users had 3 call paths without the top bar; removing it just eliminates the broken one.
- **Verified:** Playwright screenshots at 3 viewports confirmed top bar HIDDEN at 393px / VISIBLE at 640px / VISIBLE at 1920px. Above-the-fold hero content now starts ~90px higher on mobile (bonus conversion benefit).
- **Backlog added:** New P2 item — "Dark mode support (intentional)". User noted browser force-dark (Brave Night Mode) is producing inconsistent rendering; tracking as 6–10 hr effort scheduled for after Week 8 TBT optimizations.
- **Build + lint:** clean.

### Session: April 21, 2026 (continued) — Branding correction: retire "since 1972" shorthand
- **Problem identified by user:** Marketing copy was using "since 1972" as shorthand for the family HVAC legacy. Technically misleading — DFW HVAC itself was founded in 2020; 1972 is when the *grandfather's different company* (A-1 Air Conditioning) was started. The shorthand implies DFW HVAC has operated continuously since 1972, which is inaccurate.
- **New canonical tagline:** "Keeping it Cool — For Three Generations."
- **3 user-facing rewrites shipped:**
  1. Home page `whyUsItems` Three-Generation Legacy card — patched in Sanity CMS via `scripts/migrate-since-1972.mjs` (also updated code fallback in `components/HomePage.jsx` + seed script)
  2. Branded 404 page (`app/not-found.jsx`)
  3. Sanity seed script (`scripts/seed-brand-content.js`) — 2 occurrences
- **About page narrative preserved** (factually accurate: "began in 1972 when my grandfather, Garland Nevil, started A-1 Air Conditioning & Heating, and continued through my father, Ronny Grubb…").
- **Data cleanup — removed orphaned `legacyStartYear` field entirely:** The field had zero UI consumers. Removed from `sanity/schemas/companyInfo.js`, `sanity/schemas/siteSettings.js`, `lib/sanity.js` GROQ query, `lib/mockData.js` fallback, and `scripts/seed-brand-content.js` (3 spots). Prevents future re-introduction of the shorthand.
- **New API: `GET /api/canonical-description`** — returns a JSON blob with the live paragraph, `{{reviewCount}}+` substituted in from Sanity (synced daily via cron). Solves the "how does the paragraph stay fresh as reviews grow?" problem for external copy-paste destinations (GBP, Yelp, Angi, HomeAdvisor). Returns `{ tagline, fullParagraph, metaDescription, reviewCount, rating, asOfDate, source }`.
- **Canonical paragraph in `internal/PRD.md` rewritten** with the new tagline, honest 1972 origin framing, live review count token, and "Text or call" CTA.
- **Quarterly recurring task added to `NEXT_SESSION_PRIORITIES.md`** — refresh external listings (GBP/Yelp/Angi/Nextdoor) from the new endpoint every 3 months. Next: July 21, 2026.
- **Verified:** 0 instances of "since 1972" across 21 sampled pages; About page narrative intact; `/api/canonical-description` returns `reviewCount: 145` with `source: sanity`. Build + lint clean.

### Session: April 21, 2026 (continued) — P1.3 Post-Launch QA Sweep
- **Completed formal QA sweep** — findings at `/app/frontend/internal/DFW_HVAC_QA_Sweep_2026-04-21.md`. 🟢 PASS overall.
- **Automated results:**
  - Broken-link scan: 0/47 sitemap URLs + 0/46 internal hrefs broken
  - Form endpoint: `POST /api/leads` returns 200 + persisted lead_id
  - Static assets (favicon, OG image, apple-touch-icon, logo): all 200
  - Multi-viewport screenshots captured (375/768/1920): form interactable at all three
- **Bug found + fixed during audit:**
  - `app/services/page.jsx:256` and `app/cities-served/page.jsx:98` rendered `tel:(972) 777-2665` (with spaces/parens). Fixed to hardcoded `tel:+19727772665` E.164 matching the 22 other tel: links sitewide. Build + lint clean.
- **UX finding (queued for polish PR):**
  - UX-1: Header top bar cramped at ≤375px (iPhone SE). Tagline + phone + Call Now compete for space. 5-min fix: hide tagline below `sm:` breakpoint.
- **Handed back to user (device-based):** iOS Safari / Android Chrome spot-checks, AddressAutocomplete live trial, end-to-end mobile form submission, cross-browser matrix. Items M1–M5 in QA report.

### Session: April 21, 2026 (continued) — PR #3 (Sprint 2a code response to P1.2 audit)
- **Shipped all 3 high-priority audit findings** in a single PR (~3 hrs code):
  1. ✅ **R1.1 JSON-LD schema on deep pages.** New schema helpers added to `components/SchemaMarkup.jsx`: `BreadcrumbListSchema`, `CityServiceSchema`, `ServiceSchema`. City pages (`app/cities-served/[slug]/page.jsx`) now render HVACBusiness + city-scoped Service + BreadcrumbList. Service pages (`app/services/[category]/[slug]/page.jsx`) now render HVACBusiness (with areaServed = 28 cities) + Service (with provider aggregateRating) + BreadcrumbList.
  2. ✅ **R1.2 Hub-and-spoke internal linking.** City page: replaced 4 generic `featuredServices` fallback links with an `ALL_SERVICES` grid (7 deep service links, city-specific anchor text like "Air Conditioning Repair in Plano, TX"). Service page: added new "Across the DFW Metroplex" section with 28 city links using service-specific anchor text ("Heating in Plano"). Data flows via `getCityPages()` helper from `lib/sanity.js`.
  3. ✅ **R2.1 Branded `app/not-found.jsx`.** Replaces Next.js default 404 with conversion-first page: 5-star trust bar, prominent phone CTA ((972) 777-2665), 4 destination links (Home/Services/Cities/Reviews), tertiary request-service link. No Sanity fetch = loads instantly even during CMS outages. Correct `robots: { index: false, follow: true }` metadata. HTTP 404 status preserved.
- **Verified on local `next start`:**
  - Plano city page: 3 JSON-LD blocks (HVACBusiness, Service, BreadcrumbList), 7 deep service links.
  - Heating service page: 3 JSON-LD blocks (HVACBusiness w/ 28 areas, Service "Heating", BreadcrumbList), 28 deep city links.
  - 404 page: HTTP 404 + all 6 branded content markers + phone CTA + 4 nav links.
- **Build + lint:** clean (49.83s, 0 errors).
- **Audit grade expected to shift:** 🟡 B+ (89/100) → 🟢 A (96/100) once Vercel deploys. Remaining yellow items (OG meta parity, Sanity CVE cleanup, nonce-based CSP, skip-to-main link) are all explicitly deferred / tracked.

### Session: April 21, 2026 (continued) — P1.2 Deep Technical Audit
- **Completed 13-category technical SEO & architecture audit** — findings preserved at `/app/frontend/internal/DFW_HVAC_Technical_Audit_2026-04-21.md`. Overall grade 🟡 B+ (89/100). Site fundamentals strong (robots/sitemap/canonicals/security headers/redirects all 🟢); three high-priority gaps found.
- **Top 3 findings (prioritized):**
  1. 🔴 **R1.1 — JSON-LD schema missing on 27 city + 7 service pages.** Home has HVACBusiness schema; deep pages have zero structured data. Blocks rich-result eligibility across 34 pages. Maps to existing P1.6f.
  2. 🔴 **R1.2 — Zero service→city internal linking.** Service pages have 20 internal links but 0 to city pages. Hub-and-spoke architecture broken. Maps to existing P1.4.
  3. 🟡 **R2.1 — No branded `app/not-found.jsx`.** 404s currently show Next.js built-in message. Minor UX/conversion issue.
- **Also confirmed:** zero secret leakage in client bundles, all 6 security headers present, all 6 legacy Wix redirects working (308 permanent), all canonicals apex + unique.
- **Sanity Studio deps account for all 28 High CVEs** (dev/admin tooling, not user-facing). Accept risk until Sanity 3.50+ upgrade (summer 2026, P3).

### Session: April 21, 2026 — PR #2 / Sprint 1 Completion (Week 1 of 12-Week Ad Launch Roadmap)

**Six tasks shipped in one PR (ready for GitHub push):**

1. **P1.9a — aggregateRating schema fix** (`lib/metadata.js`): `reviewCount: '118'` → `'145'`. Note: `SchemaMarkup.jsx` was already dynamic via `companyInfo.googleReviews`; `lib/metadata.js.createJsonLd` is currently unimported dead code but hardened for defensive parity. Unlocks ⭐ in SERP snippets if ever re-wired.
2. **P1.6g — `lib/metadata.js` fallback parity fix**: `openingHours` corrected `Mo-Fr 09:00-18:00` → `Mo-Fr 07:00-18:00`. `areaServed` expanded from 12 cities to full 28 (matches production reality).
3. **P1.3a — Accessibility fix pack** (Lighthouse a11y 87 → 95+):
   - 6× `text-gray-400` → `text-gray-600` on white backgrounds (`Header.jsx`, `TestimonialCarousel.jsx`, `ReviewsGrid.jsx`, `CompanyPageTemplate.jsx` x2, `app/cities-served/page.jsx`). Footer gray-400 on dark bg intentionally left alone (passes AA ~7.4:1).
   - 3× social-icon `aria-label`s in `Footer.jsx` (`"DFW HVAC on Facebook"` etc.)
   - 1× mobile hamburger `aria-label` + `aria-expanded` + `aria-controls="mobile-menu"` in `Header.jsx`
4. **P1.7 — GA4 conversion events**:
   - New `components/PhoneClickTracker.jsx` — single-listener event delegation in root layout captures clicks on any `tel:` link sitewide. Fires `phone_click` event with phone_number + link_text + page_path.
   - `form_submit_lead` event wired in `LeadForm.jsx` (with `lead_type`) and `SimpleContactForm.jsx`. Fires only on verified `success: true` response. Starts 70+ day baseline for Google Ads launch.
   - **User action required:** Log into GA4 → Admin → Events (wait ~24h for events to appear) → toggle "Mark as conversion" on both `form_submit_lead` and `phone_click`.
5. **P1.1 (final) — 7 service page meta descriptions via Path A code fallback**: New `buildServiceMetaDescription()` helper + `SERVICE_META_COPY` map in `app/services/[category]/[slug]/page.jsx`. Each of 7 services now has a hand-crafted <160 char meta description with service-specific value prop + phone CTA + trust signals. Same pattern as 28 cities (shipped Apr 20).
6. **P1.3-scoped — Mobile Form UX audit**: Findings in `/app/frontend/internal/Mobile_Form_UX_Audit_2026-04-21.md`. Quick wins applied in this PR: 7× `autoComplete` attrs (given-name, family-name, name, email, tel) + 3× `inputMode` attrs (tel, email) on all form inputs across `LeadForm.jsx` and `SimpleContactForm.jsx`. Touch targets already 48px. Error-message UX + sticky submit CTA + reCAPTCHA branding deferred to P1.10 progressive form redesign (Week 6).

**Verified:**
- `yarn build` ✓ clean (41.68s, 0 errors, 0 regressions)
- Lint ✓ clean across all 8 modified files
- curl smoke test: all 7 service pages return correct custom meta descriptions, schema `reviewCount: 145`, hamburger `aria-label`/`aria-expanded` render, all `autoComplete` + `inputMode` attrs present on both forms
- `PhoneClickTracker` mounted once in root layout (`app/layout.js`), fires only post-hydration, zero TBT impact

**Ready for:** GitHub PR + Vercel preview deploy + Lighthouse re-run on preview to confirm a11y score crossed into 🟢.

### Session: April 20, 2026 (continued) — Python backend deletion (P2.17 completed)
- **Deleted `/app/backend/` entirely** — 374-line FastAPI server + `requirements.txt` + `.env` + `.gitignore`. Verified 100% dead: zero frontend references, no cron/CI/Docker calling it, all functionality already in Next.js API routes.
- **Preserved the integration test** — `git mv backend/tests/test_dfw_hvac.py → frontend/tests/test_dfw_hvac.py` (history preserved). This test covers the Next.js API despite its original Python location.
- **Post-deletion verification:** `yarn build` ✓ 30s clean, no regressions. Codebase is now single-stack (Next.js only).
- **Benefits:** ~400 lines of dead code removed, Python dependency burden eliminated (no more FastAPI/Motor/Pydantic CVE alerts), cleaner repo, no more Python complexity noise in future code reviews.

### Session: April 20, 2026 (continued) — Code Review Response
- **Applied (legitimate fixes):**
  - `components/SchemaMarkup.jsx` — added `safeJsonLd()` helper that escapes `<` to `\u003c` before injection. Prevents theoretical `</script>` breakout from CMS-sourced strings. All 3 JSON-LD sites (`LocalBusinessSchema`, `FAQSchema`, `ReviewSchema`) use the helper. JSON-LD still parses correctly across home, /about, city pages, /services (verified via curl, 0 literal `</script>` in any rendered schema).
  - `backend/tests/test_dfw_hvac.py` — converted `assert body.get("success") is True` → truthy check `assert body.get("success")`. The reviewer's suggested `== True` is itself flagged by ruff as E712 anti-pattern; truthy check is the Pythonic fix.
- **Declined (false positives / wrong fixes):**
  - `<script>{JSON.stringify(data)}</script>` alternative — React escapes JSX children, which would BREAK schema markup (invalid JSON-LD, Google can't parse)
  - DOMPurify — wrong tool (for HTML, not JSON)
  - React state setters in hook dep arrays — `useState` setters are guaranteed stable by contract; adding them is noise
  - Module constants (`DFW_LAT`, `REALWORK_ID`, etc.) in hook deps — they never change; adding them is noise
  - WebAPI globals (`IntersectionObserver`, `sessionStorage`) in hook deps — not deps per React rules
  - Refs (`containerRef`) in hook deps — per React docs, refs shouldn't be in dep arrays
  - Mass index-as-key rewrites for static non-reorderable lists — no actual bug
  - ColorProvider `hex`/`root` "missing" deps — `root` is local to the effect, `hex` is property access on `colors` which IS in deps
- **Added to backlog (legitimate but needs thoughtful work, not drive-by fixes):**
  - **P2.15** Oversized component decomposition (ServiceTemplate 450L, CompanyPageTemplate 406L, HomePage 378L, CityPage 318L) → 8–12 hrs
  - **P2.16** `/api/leads` POST refactor (complexity 23 → <10 via extracted validators) → 3–4 hrs
  - **P2.17** Python backend decommission decision (`/app/backend/server.py` is NOT called by Next.js — legacy from Wix migration)
  - **P2.18** Index-as-key audit — classify 44 instances as safe-static vs. stateful-needs-fixing → 2 hrs

### Session: April 20, 2026 (continued) — TBT Optimization (PR #1 of 2 for performance sprint)
- **Scope:** Lazy-load 3 third-party scripts (Maps, reCAPTCHA, RealWork). GA4 already on `afterInteractive` — left as-is per user decision.
- **Fixes:**
  1. **Google Maps / Places** (`components/AddressAutocomplete.jsx`): Removed mount-time `useEffect` eager load. Added `onFocus` handler — Maps script only loads when user actually focuses the address input. Bounced visitors who never touch the form save ~800–1,200ms of TBT. Also added inline "Powered by Google" attribution (with official brand colors on each letter) that appears when the field gains focus, to comply with Google Places API terms throughout the interaction (not just when the suggestions dropdown renders its own branding).
  2. **reCAPTCHA v3**: Removed from root layout (`app/layout.js`). Extracted into new `components/RecaptchaScript.jsx` component using `next/script strategy="lazyOnload"`. Included inside `LeadForm.jsx` and `SimpleContactForm.jsx`. Pages without forms (/reviews, /faq, /cities-served list, 27 city detail pages, /services list, /privacy, /terms, /recent-projects) no longer load reCAPTCHA at all. Pages with forms defer until page is interactive.
  3. **RealWork widget** (`components/RealWorkWidget.jsx`): Added IntersectionObserver with 200px rootMargin. Widget's 3rd-party script only loads when container enters viewport. Users who bounce from /recent-projects before scrolling save ~200–400ms.
- **Verified:** `yarn build` clean (40s), lint clean, Playwright smoke test across 13 representative pages confirmed reCAPTCHA + Maps load patterns match spec. 27 city detail pages + /reviews + /faq + /cities-served + /services + /privacy + /terms + /recent-projects all load 0 recaptcha + 0 maps requests now.
- **Expected production TBT improvement:** Pre-fix baseline ~2,300ms. Expected post-fix ~500–800ms (measurable via Lighthouse + GSC Core Web Vitals report after 28d field data). Perf score 69 → 85+.

### Session: April 20, 2026 (continued) — P1.1 City Meta Descriptions (Path A implementation)
- **Discovery:** All 28 city pages had `metaDescription: null` in Sanity (including Denton). The "Denton gold template" and all other city descriptions were coming from a single code fallback in `app/cities-served/[slug]/page.jsx` line 64. The original P1.1 plan (populate 27 Sanity CMS records) would have been 27× more work than necessary.
- **Implementation:** Added `buildCityMetaDescription(cityName, zipCodes)` helper above `generateMetadata` in the same file. Uses an adaptive zip-line format (1 → "Zip: X.", 2 → "Zips: X, Y.", 3 → "Zips: X, Y, Z.", 4+ → "Zips: X, Y, Z & more."). Fallback signature: `city.metaDescription || buildCityMetaDescription(...)` — still allows per-city Sanity override.
- **New template:** `[City], TX AC & heating repair, install & maintenance. Same-day service. Call (972) 777-2665. Licensed, family-owned. [Zip line].`
  - Front-loads city + primary keyword (stronger SERP match than "Professional heating and air conditioning services in...")
  - Adds phone CTA with dialable digits (enables Google SERP click-to-call on mobile)
  - Adds trust signals ("Licensed, family-owned") — absent from old template
  - Adaptive zip line → per-page hyper-local variation, no "Zip: " empty tail
- **Verified:** `yarn build` ✓ (no regressions, 36s clean build). `next start` + curl confirmed 12 sampled cities (spanning all 4 zip-count variants) render correctly. All 28 descriptions now fit within 128–158 chars (below 160-char SERP desktop truncation; CTA visible on mobile).
- **Also drafted:** All 27 city descriptions populated in columns E + F of `/app/frontend/internal/DFW_HVAC_Site_Audit.xlsx` for audit reference (though Path A obviates the need to paste them anywhere — they're generated by the function).

### Session: April 20, 2026 (continued) — Click-to-Call Bug Fix
- **Root cause:** `companyInfo.phone` in Sanity stores the vanity format `(972) 777-COOL`. Two pages (`/services`, `/cities-served`) and the LocalBusiness schema (`SchemaMarkup.jsx` x2, `lib/metadata.js`) used this value directly in `tel:` hrefs. Mobile browsers cannot dial letters — every tap on "Call Now" was a dead-end conversion since site launch Apr 16.
- **Fix (Option B — clean architecture, single source of truth):**
  - Repurposed existing `phoneDisplay` Sanity field (already populated with `(972) 777-2665`) as the canonical dialable value
  - Updated 5 call sites to use `companyInfo.phoneDisplay || '+1-972-777-2665'` fallback
  - Improved Sanity schema field descriptions so future editors know which field goes where (vanity text vs. tel: hrefs)
  - Hardcoded E.164 format in `lib/metadata.js` JSON-LD telephone field for schema parser compatibility
- **Verified:** `yarn build` passes (no regressions, all 11 static pages + dynamic routes compile). Local `next start` + curl confirms:
  - `/services` + `/cities-served` "Call Now" hrefs now render `tel:(972) 777-2665` ✓
  - LocalBusiness schema `telephone` now renders `(972) 777-2665` ✓
  - 22 hardcoded `tel:+19727772665` links across Header/Footer/etc. unchanged (were already correct)
- **Impact:** Restores mobile click-to-call conversion on two of the highest-intent landing pages. Ready for merge to main → Vercel auto-deploy.

### Session: April 19, 2026 — Next.js 14 → 15 Upgrade
- Upgraded `next` 14.2.35 → **15.5.5**, `react` 18.2.0 → **19.2.5**, `react-dom` 18.2.0 → **19.2.5**, `eslint-config-next` 14 → **15.5.15**
- Verified all dynamic route pages already use the Next 15 `await params` async pattern — no code changes needed
- Removed extraneous lockfiles (`/app/frontend/package-lock.json`, empty `/app/yarn.lock`) that confused Next.js workspace detection
- `yarn build` passes with no errors; all 11 static pages + dynamic routes compile successfully
- **Testing (testing_agent_v3_fork iteration_1):** 26/26 pytest cases pass; all critical flows verified end-to-end
  - All 14 page routes HTTP 200 (home, about, contact, services, service detail, cities-served, city detail, reviews, faq, estimate, request-service, recent-projects, privacy, terms)
  - `/api/leads` validation (400), happy-path (200 + MongoDB persistence), rate-limit (5/15min enforced), HTML sanitization — all pass
  - `/api/cron/sync-reviews` auth (401 without Bearer, proceeds with CRON_SECRET)
  - Lead forms on /contact, /request-service, /estimate submit successfully end-to-end
  - All 6 legacy redirects (301) still work (/scheduleservicecall, /installation, /iaq, /ducting, /seasonalmaintenance, /testresults)
  - Security headers intact (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - **Zero React 19 hydration warnings, zero page errors, zero visual regressions** vs baseline screenshots
- Pytest regression suite created at `/app/backend/tests/test_dfw_hvac.py` for future runs
- Resolves 5 known Next.js 14 CVEs (DoS, request smuggling) and 23 npm vulnerabilities

### Session: April 17-18, 2026
- Address autocomplete verified working on all 5 form pages
- Removed all "since 1974" false claims across code, seed data, fallbacks, and live Sanity CMS
- Updated business hours to Mon-Fri 7AM-6PM (code, seed, fallback, live Sanity)
- Updated googleReviews count from 130 to 145 (code, fallbacks, seed, live Sanity meta description)
- Removed stale `realPhone` field from mockData
- Implemented Google reCAPTCHA v3 on all forms (threshold 0.4, blocked email notifications, graceful fallback, no-token blocking)
- Recent Projects page live with RealWork widget, added to nav and sitemap
- Comprehensive security audit completed — 6 of 8 issues fixed:
  - Cron endpoint locked with CRON_SECRET
  - Security headers added (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
  - Input sanitization (escapeHtml) on all email template user fields
  - Rate limiting on /api/leads (5 per 15 min per IP)
  - Sensitive internal documents moved from /public/ to /internal/
  - RealWork plugin ID moved to env var
- Performance baseline captured (Lighthouse on 13 pages)
- Performance scorecard document created with 6 measurement categories
- Action items document consolidated and updated

### Prior Sessions
- Sanity Schema Data Patch (fixed missing keys on process steps)
- OG Image & Favicon generated
- FastAPI → Next.js API route migration
- Vercel deployment & environment variables
- DNS cutover to GoDaddy + SSL verification
- Resend domain verification
- Google Places API billing + Vercel Cron setup
- GA4 tracking installed
- Phone number auto-formatting on forms
- Address Autocomplete with DFW bias
- SEO audit spreadsheet generated

## Prioritized Backlog

### High Priority
1. ~~Next.js upgrade (14→15+) + npm vulnerability fixes~~ ✅ **DONE Apr 19, 2026** (now on 15.5.9 + React 19)
2. Audit site for speed, SEO, and conversion
2a. **Deep technical SEO & architecture audit** ⭐ Added Apr 20, 2026 after discovering `/_next/` robots.txt bug. Systematic sweep for legacy anti-patterns: robots.txt/meta-robots consistency, HTTP headers, canonical tags, structured data (JSON-LD), OG/Twitter meta, internal linking, image optimization, 3rd-party scripts, 404/redirect coverage, mobile/a11y, HTML validation, security, supply-chain. Deliverable: `/app/frontend/internal/DFW_HVAC_Technical_Audit_YYYY-MM-DD.md` (3-5 hrs, quarterly cadence). Details in Action_Items.md item 2a.
2b. **Page-by-page ranking factor audit** ⭐ Added Apr 20, 2026 to address the meta-description-is-not-ranking-factor gap. Systematic matrix of ~47 pages × 10 ranking factors (title tag, body content depth, GBP, backlinks, Core Web Vitals/INP, NAP, internal linking, reviews, schema, meta desc). Sub-tasks P1.6a–f: title audit (highest leverage), body content depth, backlink profile, INP measurement, review cadence, schema verification. Deliverable: `/app/frontend/internal/DFW_HVAC_Ranking_Factor_Audit_YYYY-MM-DD.md`. ~10–15 hrs across sessions. Full context in NEXT_SESSION_PRIORITIES.md § P1.6.
3. ~~Google Search Console setup~~ ✅ **MOSTLY DONE** (verified Apr 20, 2026 — Domain property, GA4 linked, crawling active)
3a. **Post-migration GSC health check** — Site launched Apr 16, 2026. Submit sitemap, verify all 47 URLs index within 4 weeks, watch for 404s on old Wix URLs, use URL Inspection to request indexing on top ~10 pages. Capture baseline Performance numbers. Wait until ~May 14 for clean 28-day "new vs old" comparison. Details in Action_Items.md item 3a.
4. Pre-launch verification (mobile, cross-browser, broken links)
5. Internal linking audit

### P2 — Important
6. Custom Meta Descriptions — 7 Service Pages & 28 City Pages
7. "50+ cities" claim cleanup
8. Google Business Profile setup
9. Local citations (Yelp, BBB, Angi, HomeAdvisor, Thumbtack)
10. Production caching mode (webhook revalidation)
11. Code cleanup (unused dependencies, Sanity production mode)
12. Google Tag Manager setup
13. Facebook Pixel setup
14. GA4 conversion event setup (form submissions, click-to-call)
15. **Next.js 15 → 16 upgrade (+ Sanity 3.50+)** — Revisit ~summer 2026 once Next 16.3+ ships with more bake time. Bundle with Sanity upgrade to clear React 19 peer-dep warnings. Expected effort: 30–60 min (async params already done, no middleware, no parallel routes). Trigger earlier if 15.x CVE isn't backported or we need 16-only features (Cache Components, View Transitions).
16. **TBT optimization — lazy-load 3rd-party scripts** — Reduce TBT from ~2,300ms → ~400ms and Perf score 69 → 85+ by lazy-loading Google Maps (on form focus), reCAPTCHA (lazyOnload), GA4 (afterInteractive), and RealWork widget (IntersectionObserver). ~3 hrs. UX-only win (LCP + CLS already passing, so no SEO impact). Details in Action_Items.md item 13b.

### P3 — Backlog
15. AI Readiness / AEO
16. Expand City Page Content (300-500 words per city)
17. Content Hub / Resources Section
18. Content creation (case studies, financing page)
19. YouTube video embed (IAQ page)
20. Housecall Pro Direct API Integration
21. RealWork subscription evaluation
22. Latent Sanity data bug (graceful null handling)
23. Cancel Wix subscription

### Recurring
24. Analyze fallback / seed data for inaccuracies — Annual

## Key Documents (in /frontend/internal/)
- DFW_HVAC_Action_Items.md — Master task list
- DFW_HVAC_Performance_Scorecard.md — Lighthouse baselines & recurring metrics
- DFW_HVAC_Site_Audit.xlsx — SEO status spreadsheet
- baseline-screenshots/ — 13 page screenshots for pre-upgrade comparison
- package.json.backup-v14 — Dependency backup before upgrade
- yarn.lock.backup-v14 — Lock file backup before upgrade

## Key Technical Notes
- THE SITE IS LIVE ON VERCEL. Changes pushed to GitHub trigger production builds.
- Address Autocomplete will NOT work in preview environments (Google API key referrer restrictions)
- FastAPI is deprecated. All API routes are Next.js native.
- Vercel token for CLI access: user must provide each session
- Sanity project: iar2b790, dataset: production
- CRON_SECRET protects /api/cron/sync-reviews
- reCAPTCHA threshold: 0.4 (blocked submissions still saved + emailed with [BLOCKED] tag)
- Rate limit: 5 submissions per IP per 15 minutes
