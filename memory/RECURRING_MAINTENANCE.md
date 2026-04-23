# 🔁 Recurring Maintenance — Living Checklist

**Purpose:** Single source of truth for every recurring operational task that keeps DFW HVAC healthy, indexed, secure, and converting. Review on the cadence below. Append new items as features ship.

**Owner:** User (strategic) + Agent (execution support)
**Last updated:** April 23, 2026

> How to use: Scan by cadence when you sit down for ops. Check the "Last Done" column before running. Append notes to the run log at the bottom if anything unusual surfaces.

---

## Daily (automated)

| # | Task | How | Last Done |
|---|---|---|---|
| D1 | `/api/cron/sync-reviews` — Google Places API → Sanity → all on-site surfaces | Vercel Cron @ 6 AM UTC | Auto |

---

## Weekly

| # | Task | How | Last Done |
|---|---|---|---|
| W1 | GBP Posts publish (once P1.8 live) | Google Business Profile → Posts | — |
| W2 | GBP review-reply SLA — respond to all new Google reviews within 48h | GBP dashboard → Reviews | — |
| W3 | GSC Core Web Vitals field-data (CrUX) glance — spot regressions early | GSC → Experience → Core Web Vitals | — |

---

## Monthly

| # | Task | How | Last Done |
|---|---|---|---|
| M1 | Lighthouse scorecard — save to `/app/memory/audits/` | Agent run or local CLI | — |
| M2 | `fiveStarReviewCount` / `googleReviews` drift audit in Sanity — re-seed the safety buffer if live count has climbed materially past the seed | Sanity Studio → companyInfo → review current values | April 23, 2026 (seeded 150) |
| M3 | GSC "Discovered – currently not indexed" URL review — resubmit any new stuck URLs via URL Inspect tool | GSC → Pages → not-indexed → cross-ref `/app/memory/audits/2026-04-23_GSC_Indexing_Tracker.md` | — |
| M4 | Google Places API billing / quota check in Google Cloud Console | GCP → Billing → Alerts | — |
| M5 | Physical device QA matrix (M1–M5) — iOS Safari + Android Chrome + Maps autocomplete | Per `/app/memory/audits/DFW_HVAC_QA_Sweep_2026-04-21.md` | — |
| M6 | GA4 conversion events sanity check — confirm `form_submit_lead` + `phone_click` still firing and marked as conversions | GA4 → DebugView → submit real test lead | — |

---

## Quarterly

| # | Task | How | Last Done | Next Due |
|---|---|---|---|---|
| Q1 | P1.2 Technical SEO Audit re-run | Agent + `/app/memory/audits/DFW_HVAC_Technical_Audit_2026-04-21.md` template | April 21, 2026 | July 21, 2026 |
| Q2 | P1.3 Post-launch QA Sweep re-run | Agent + `/app/memory/audits/DFW_HVAC_QA_Sweep_2026-04-21.md` template | April 21, 2026 | July 21, 2026 |
| Q3 | External business listings description refresh (GBP, Yelp, Angi, HomeAdvisor, Nextdoor) via `GET /api/canonical-description` | Fetch endpoint → paste into each listing | — | July 21, 2026 |
| Q4 | GSC title-tag performance review — compare new titles' CTR vs. baseline; re-audit if GSC queries shift | Pull GSC Queries CSV → diff vs. `/app/memory/audits/2026-04-23_Title_Tag_Final.csv` → update titles where data says | — | July 23, 2026 |
| Q5 | JSON-LD Rich Results validation — home + 1 city page + 1 service page | https://search.google.com/test/rich-results | — | — |
| Q6 | Sitemap.xml + robots.txt sanity scan — all canonicals present, no unintended disallows | Fetch `https://dfwhvac.com/sitemap.xml` + `/robots.txt`; manual review | — | — |
| Q7 | Competitor title/content audit refresh — 2–3 top local competitors | Agent + template from `/app/memory/audits/2026-04-22_Competitor_Title_Audit.md` | April 22, 2026 | July 22, 2026 |

---

## Semi-annual

| # | Task | How | Last Done |
|---|---|---|---|
| S1 | NAP (Name/Address/Phone) consistency audit across GBP, Yelp, Angi, HomeAdvisor, Nextdoor, BBB | Manual spot-check each listing — verify name, address, phone, hours match Sanity companyInfo | — |
| S2 | Seasonal title/promo refresh pass — pre-summer (May) and pre-winter (Oct). Emphasize AC vs. heating, emergency, financing | Update affected titles in the CSV + re-ship via `generateMetadata()` | — |
| S3 | Broken internal link crawl — Screaming Frog or equivalent. City × Service cross-link grid (47×28) is drift-prone | SF crawl → export 4xx/5xx → fix | — |

---

## Annual

| # | Task | How | Last Done |
|---|---|---|---|
| A1 | Fallback/seed data review — `lib/mockData.js` vs. Sanity vs. Google reality | Manual diff; update mockData as Sanity evolves | — |
| A2 | API key + secret rotation — Resend, Google Maps, Google Places, reCAPTCHA v3, Sanity token, CRON_SECRET | Rotate in each provider dashboard → update Vercel env vars + `frontend/.env.local` | — |
| A3 | Sanity dataset export / backup | `npx sanity dataset export production backup-YYYY-MM-DD.tar.gz` | — |
| A4 | Legacy 301/410 redirect map prune | Review `next.config.js` redirects + `middleware.js` 410 list; remove any <0.1% traffic destinations | — |
| A5 | MongoDB lead-data retention review — purge/archive old leads per privacy policy | Export archive → delete leads older than retention window | — |
| A6 | Google Maps API referrer allowlist review in Google Cloud Console — confirm all prod/staging domains listed | GCP → APIs & Services → Credentials → Maps JS API key | — |

---

## Ad-hoc / Trigger-based

| # | Trigger | Task |
|---|---|---|
| T1 | After any form edit (LeadForm, SimpleContactForm, `/api/leads`) | Re-verify end-to-end submission + reCAPTCHA score + GA4 event fire. Test via `/app/test_reports/` or curl. |

---

## Run Log

> Append dated entries here when you complete a recurring task or notice something worth remembering. Keeps institutional memory alive.

- **April 23, 2026** — RECURRING_MAINTENANCE.md created. Initial `fiveStarReviewCount` seeded to 150 in Sanity companyInfo.

---

## Cross-references

- Roadmap pointer: `/app/memory/ROADMAP.md` → "🔁 Recurring Maintenance" section
- Title-tag audit source: `/app/memory/audits/2026-04-23_Title_Tag_Final.csv`
- GSC indexing tracker: `/app/memory/audits/2026-04-23_GSC_Indexing_Tracker.md`
- Post-deploy GA4 checklist: `/app/memory/POST_DEPLOY_ACTION_ITEMS_PR2.md`
- Performance scorecard template: `/app/memory/audits/2026-04-21_DFW_HVAC_Performance_Scorecard.md`
