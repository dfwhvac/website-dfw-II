# DFW HVAC — Master Action Items & To-Do List

**Last Updated:** April 20, 2026

---

## High Priority

1. **Next.js upgrade (14→15+) + npm vulnerability fixes** — ✅ **COMPLETED Apr 20, 2026** — Now on `next@15.5.9` + `react@19.2.5`. Resolved 5 Next 14 CVEs + critical CVE-2025-66478 (10.0 RCE) + CVE-2025-67779. 26/26 regression tests pass.

2. **Audit site for speed, SEO, and conversion** — Run Lighthouse audit, analyze Core Web Vitals, review conversion funnel, identify optimization opportunities.

3. **Google Search Console setup** — Verify domain ownership via DNS TXT record, submit sitemap, check indexing status, monitor crawl errors.

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
