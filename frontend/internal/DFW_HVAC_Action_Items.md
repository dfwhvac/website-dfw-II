# DFW HVAC — Master Action Items & To-Do List

**Last Updated:** April 20, 2026

---

## High Priority

1. **Next.js upgrade (14→15+) + npm vulnerability fixes** — ✅ **COMPLETED Apr 20, 2026** — Now on `next@15.5.9` + `react@19.2.5`. Resolved 5 Next 14 CVEs + critical CVE-2025-66478 (10.0 RCE) + CVE-2025-67779. 26/26 regression tests pass.

2. **Audit site for speed, SEO, and conversion** — Run Lighthouse audit, analyze Core Web Vitals, review conversion funnel, identify optimization opportunities.

2a. **Deep technical SEO & architecture audit** — ⭐ **ADDED Apr 20, 2026 after discovering the `/_next/` robots.txt bug.** The robots.txt was inherited with a legacy anti-pattern (`Disallow: /_next/`) that silently blocked Googlebot from rendering pages properly. We need a systematic sweep to catch similar issues before they cost us ranking. Scope:
   - **robots.txt / meta robots / sitemap consistency** — verify Googlebot can access all content resources (CSS, JS, fonts, images); confirm no conflicting `noindex` meta tags on pages we want indexed; confirm sitemap URLs all return 200 and match canonical form
   - **HTTP headers audit** — confirm CSP doesn't block resources Googlebot needs; confirm no conflicting `X-Robots-Tag` headers; Referrer-Policy / Permissions-Policy sanity check
   - **Canonical tag audit** — every page should have exactly one `<link rel="canonical">` pointing at the preferred URL form (apex, no trailing slash, lowercase)
   - **Structured data (JSON-LD) audit** — LocalBusiness schema on home + city + service pages, Service schema on service pages, FAQ schema on /faq, BreadcrumbList where appropriate; test in Google's Rich Results Test
   - **OG / Twitter meta audit** — every page has unique og:title, og:description, og:image, og:url; Twitter cards configured; test in Facebook Sharing Debugger + Twitter Card Validator
   - **Internal linking audit** — every service ↔ city combo is linked somewhere; no orphan pages; breadcrumb navigation present; anchor text is descriptive (not "click here")
   - **Image optimization audit** — all images use `next/image`; all have meaningful alt text; no uncompressed originals in /public; hero images have `priority` prop; below-fold images lazy-load
   - **Third-party script audit** — Google Maps, reCAPTCHA, GA4, GTM, RealWork widget — all using `next/script` with appropriate strategy (`afterInteractive` or `lazyOnload`); none blocking render (ties into TBT optimization in item 13b)
   - **404 / redirect audit** — all old Wix URLs either 301 to new equivalents or intentionally 404'd; /404 page is well-designed and offers navigation back; no internal links pointing to redirected URLs
   - **Mobile / accessibility audit** — all touch targets ≥44px; all text meets WCAG AA contrast; keyboard navigation works; ARIA labels on interactive elements; no auto-playing audio/video
   - **HTML validation** — run W3C validator on top 10 pages; no duplicate IDs, unclosed tags, or semantic errors
   - **Security audit follow-up** — confirm no sensitive data in client bundles (search for "secret", "key", "token" in built JS); confirm all env vars prefixed `NEXT_PUBLIC_*` are actually safe to expose
   - **Dependency supply-chain audit** — `yarn audit` clean; no packages flagged with known CVEs; no unmaintained packages (last publish >2 years)
   - **Deliverable:** A markdown report at `/app/frontend/internal/DFW_HVAC_Technical_Audit_YYYY-MM-DD.md` listing every check performed, pass/fail status, and remediation plan for any failures. Re-run quarterly.
   - **Expected effort:** 3-5 hours spread across 1-2 sessions. Many checks are scriptable (can be automated via Playwright/curl for recurring runs).
   - **Trigger for this audit:** Discovered `/_next/` was disallowed in robots.txt (Apr 20, 2026). Blocking Googlebot from rendering CSS/JS is a known SEO anti-pattern; we need to verify no other silent anti-patterns exist.

3. **Google Search Console setup** — ✅ **MOSTLY DONE** (verified Apr 20, 2026). Domain property `dfwhvac.com` added Feb 20, 2026. Ownership verified, GA4 linked, robots.txt valid, 393 crawl requests in last 90 days. **Note:** Site migration from Wix → Next.js happened **Apr 16, 2026** (confirmed via Let's Encrypt SSL issue date). GSC data prior to Apr 16 reflects the old Wix site. **Remaining:** confirm sitemap.xml submitted under Sitemaps tab, baseline Performance numbers (clicks/impressions/CTR/position), review Pages tab for any unexpected "Not indexed" entries.

3a. **Post-migration GSC health check (do within 2 weeks)** — New Next.js site launched Apr 16, 2026. Google needs 2–4 weeks to fully recrawl. Tasks:
   - [ ] **Submit sitemap.xml** in GSC Sitemaps tab if not already submitted (accelerates discovery of all 47 new URLs)
   - [ ] **Check Pages tab** weekly — target: 40–47 of 47 sitemap URLs showing as "Indexed" within 4 weeks
   - [ ] **Look for 404s on old Wix URLs** in "Not indexed" tab. If any old URLs appear that aren't already handled by our 6 legacy 301 redirects in `next.config.js`, add new redirects before the next deploy. Current redirects: `/scheduleservicecall`, `/installation`, `/iaq`, `/ducting`, `/seasonalmaintenance`, `/testresults`.
   - [ ] **Use URL Inspection → Request Indexing** for top ~10 high-value pages (home, top 5 city pages by population, top service pages, /request-service) to accelerate recrawl from weeks → days.
   - [ ] **Capture baseline Performance numbers** (clicks / impressions / avg CTR / avg position) on Apr 20, 2026 into the Performance Scorecard so we can measure meta-description rewrite impact later.
   - [ ] **Clean comparison date** — wait until ~May 14, 2026 (28 days post-launch), then do "May new site vs March Wix site" 28-day comparison. Document in scorecard.
   - **Launch date reference:** Apr 16, 2026 (per Let's Encrypt SSL cert issue date).

4. **Pre-launch verification** — Mobile responsiveness testing, cross-browser testing, all phone links work, check for broken links across all pages.

5. **Internal linking audit** — Cross-link services and city pages for SEO. Ensure proper link structure between related content.

5a. **GA4 conversion event setup** — Configure form submission and click-to-call as conversion events in Google Analytics to enable conversion metric tracking on the scorecard.

---

## P2 — Important

6. **Custom Meta Descriptions** — Update 7 Service Pages and 28 City Pages in Sanity with unique, keyword-rich meta descriptions to replace generic code-generated fallbacks.

7. **"50+ cities" claim cleanup** — Audit remaining files with incorrect city count. Update copy to accurate language reflecting 28 configured cities.

8. **Google Business Profile** — Set up and optimize GBP listing for local search visibility.

9. **Local citations** — List business on Yelp, BBB (Better Business Bureau), Angi, HomeAdvisor, Thumbtack for local SEO and trust signals.

10. **Production caching mode** — Enable webhook revalidation for Sanity content updates instead of force-dynamic on every request.

11. **Code cleanup** — Remove unused dependencies, switch Sanity client to production mode.

12. **Google Tag Manager (GTM) setup** — Install GTM for centralized tag management alongside existing GA4.

13. **Facebook Pixel setup** — Add Facebook tracking pixel for remarketing and conversion tracking.

13a. **Next.js 15 → 16 upgrade (+ Sanity 3.50+)** — Revisit ~summer 2026 once Next 16 hits 16.3+ with more production bake time. Bundle with Sanity upgrade (currently 3.25, has React 19 peer-dep warnings).
   - **Why defer, not skip:** Next 16 adds Cache Components + Partial Pre-Rendering, `updateTag()` caching API, Turbopack stable, View Transitions. Modest perf gains (~50–100ms navigation). Not security-critical — 15.x line gets CVE patches for 12+ months.
   - **Expected effort:** 30–60 min. Breaking changes are small for this codebase: async `params` already done, no middleware → `proxy.ts` migration, no parallel routes, no Sass. Only `next/image` defaults need a quick review.
   - **Prerequisites:** Wait until Next `16.3+` is stable. Upgrade `sanity` 3.25 → 3.50+ in same PR to clear React 19 peer-dep warnings.
   - **Trigger earlier if:** a CVE is disclosed on the 15.x line that isn't backported, OR we want to use View Transitions / Cache Components for a feature.
   - **Process:** same preview-branch workflow used for 14→15 (push to `nextjs-16-upgrade` branch → Vercel preview → smoke test → merge).

13b. **TBT (Total Blocking Time) optimization — lazy-load third-party scripts** — Reduce main-thread blocking from **~2,300ms → ~400ms** (target <200ms). Lighthouse Performance score projected to lift from **69 → 85+**. Pre-existing issue unrelated to Next 15 upgrade.
   - **Why defer, not urgent:** LCP (2.3s) and CLS (0) are both passing Google's Core Web Vitals thresholds, so this does NOT affect SEO rankings. Impact is UX-only (page is visible but unresponsive to clicks/scrolls/form input for ~2 sec on mobile).
   - **Expected effort:** ~3 hours across 4 focused fixes.
   - **Root causes (in priority order):**
     1. **Google Maps JavaScript API** (~1.2 MB gzipped) — loaded eagerly on every form page for Address Autocomplete. Biggest offender.
     2. **Google reCAPTCHA v3** (~150 KB + continuous background fingerprinting) — loaded site-wide.
     3. **Google Analytics 4 / gtag** (~50 KB) — loaded eagerly.
     4. **RealWork widget** (`/recent-projects` only) — third-party React bundle.
   - **Fixes with expected wins:**
     | Fix | Effort | Expected TBT reduction |
     |-----|--------|------------------------|
     | Lazy-load Google Maps script on form focus (not page load) | 1 hr | ~800–1,200ms |
     | `next/script strategy="lazyOnload"` for reCAPTCHA | 30 min | ~300–500ms |
     | `next/script strategy="afterInteractive"` for GA4 | 15 min | ~100–200ms |
     | Load RealWork widget only when it scrolls into view (IntersectionObserver) | 30 min | ~200–400ms (`/recent-projects` only) |
   - **Success criteria:** Post-change Lighthouse run shows TBT < 500ms avg across 13 pages and Performance score ≥ 85. Append measured numbers to scorecard as new "TBT-optimized" column.
   - **Trigger earlier if:** we start paid ads (slow page feel hurts quality score), OR conversion-rate data shows drop-off during first 2 sec of load.

---

## P3 — Backlog

14. **AI Readiness / AEO** — Citation audit, GBP optimization, NAP consistency audit, respond to all reviews.

15. **Expand City Page Content** — Add 300-500 word unique descriptions to each of the 28 city pages for local SEO.

16. **Content Hub / Resources Section** — Create `/resources` page for blog content and authoritative HVAC guides.

17. **Content creation** — Case studies, financing page content.

18. **YouTube video embed** — Embed relevant IAQ video content on the Indoor Air Quality service page.

19. **Housecall Pro Direct API Integration** — Auto-create customers/jobs in HCP from form submissions. No Zapier fees, instant sync. Prerequisite: confirm HCP API access and credentials.

20. **RealWork subscription evaluation** — Owner to decide if subscription cost is justified. Widget has visual trust value but zero SEO value.

21. **Latent Sanity data bug** — Add graceful null handling in `lib/sanity.js` to prevent hydration errors if components become client-side.

22. **Cancel Wix subscription** — After confirming new site is stable (1-2 weeks post-launch).

23. **DNS records upgrade (Vercel-recommended)** — P3 low priority. Vercel dashboard shows "DNS Change Recommended" badge on both `dfwhvac.com` and `www.dfwhvac.com`. Current: apex uses A record `76.76.21.21` (valid but older style), www uses A record to an older Vercel IP. Vercel prefers CNAME → `cname.vercel-dns.com` for www and their updated A records for apex. Site works fine as-is; upgrade only reduces risk of a future outage if Vercel retires the current IPs. Do this next time in the GoDaddy DNS panel for another reason. ~10 min, low risk (5-min cutover, revertible).

---

## Recurring

23. **Analyze fallback / seed data for inaccuracies** — Annual review of all fallback values, seed files, and FAQ content against live Sanity and Google data.

---

## Completed

- Next.js 14.2.35 → 15.5.9 + React 18 → 19.2.5 upgrade (Apr 20, 2026) — 26/26 regression tests pass, resolved CVE-2025-66478, CVE-2025-67779, 5 Next 14 CVEs, 23 npm vulnerabilities
- Resend Domain Verification
- OG Image & Favicon created
- DNS Cutover to GoDaddy + SSL verification
- GA4 Tracking installed (G-5MX2NE7C73)
- 301 Redirects for old Wix URLs
- FastAPI to Next.js API route migration
- Vercel deployment & environment variables
- Google Places API billing + Vercel Cron for review sync
- Phone number auto-formatting on all forms
- Address Autocomplete with DFW bias on all forms
- Removed all "since 1974" false claims (code, seed, fallback, live Sanity)
- Business hours updated to Mon-Fri 7AM-6PM everywhere
- Reviews meta description updated 130→145
- Removed stale `realPhone` field from mockData
- Updated `googleReviews` fallback 130→145 everywhere
- Google reCAPTCHA v3 on all forms (blocked email notifications, graceful fallback, no-token blocking)
- Recent Projects page live with RealWork widget + added to nav and sitemap
- Security audit — cron endpoint locked down, security headers added, input sanitization, rate limiting
- Sensitive internal documents moved out of `/public/`
- RealWork plugin ID moved to env var
- Site audit spreadsheet generated (DFW_HVAC_Site_Audit.xlsx)
