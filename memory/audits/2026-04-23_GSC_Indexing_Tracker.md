# GSC Manual Indexing Tracker
**Purpose:** Living record of every URL submitted to Google Search Console URL Inspection → Request Indexing. Updated as submissions happen.

**Total sitemap URLs:** 47
**Submitted so far:** 19 (10 on 4/21 + 9 on 4/23)
**Remaining to submit/verify:** 28
**Currently verified indexed via URL Inspection:** `/cities-served/lewisville` (confirmed 4/23)
**Note:** GSC aggregate "Page Indexing" report is 3–7 days lagged; URL Inspection is real-time ground truth. Always inspect before re-requesting.

---

## ✅ Day 1 — Submitted 4/21/2026 (10 URLs)

| # | URL | Was un-indexed at time of submission? |
|---|---|:-:|
| 1 | `https://dfwhvac.com/` | ❌ Already indexed (reinforcement only) |
| 2 | `https://dfwhvac.com/services/residential/air-conditioning` | ✅ Yes — was in "Discovered" bucket |
| 3 | `https://dfwhvac.com/services/residential/heating` | ✅ Yes — was in "Discovered" bucket |
| 4 | `https://dfwhvac.com/request-service` | ❌ Already indexed |
| 5 | `https://dfwhvac.com/services/residential/indoor-air-quality` | ✅ Yes — was in "Discovered" bucket |
| 6 | `https://dfwhvac.com/services/residential/preventative-maintenance` | ❌ Already indexed |
| 7 | `https://dfwhvac.com/cities-served/coppell` | ❌ Already indexed |
| 8 | `https://dfwhvac.com/estimate` | ❌ Already indexed |
| 9 | `https://dfwhvac.com/cities-served/arlington` | ❌ Already indexed |
| 10 | `https://dfwhvac.com/contact` | ❌ Already indexed |

---

## ✅ Day 2 — Submitted 4/23/2026 @ 2pm (9 URLs — 1 slot remaining unused)

| # | URL | Was un-indexed at time of submission? |
|---|---|:-:|
| 1 | `https://dfwhvac.com/reviews` | ✅ Yes — was in "Discovered" bucket |
| 2 | `https://dfwhvac.com/about` | ✅ Yes — was in "Discovered" bucket |
| 3 | `https://dfwhvac.com/faq` | ✅ Yes — was in "Discovered" bucket |
| 4 | `https://dfwhvac.com/services/commercial/commercial-air-conditioning` | ✅ Yes — was in "Discovered" bucket |
| 5 | `https://dfwhvac.com/cities-served/frisco` | ✅ Yes — was in "Discovered" bucket |
| 6 | `https://dfwhvac.com/cities-served/lewisville` | ✅ Yes — confirmed indexed 4/23 (self-indexed before request) |
| 7 | `https://dfwhvac.com/cities-served/richardson` | ✅ Yes — was in "Discovered" bucket |
| 8 | `https://dfwhvac.com/cities-served/irving` | ✅ Yes — was in "Discovered" bucket |
| 9 | `https://dfwhvac.com/cities-served/mansfield` | ✅ Yes — was in "Discovered" bucket |

> ⚠️ `/services/commercial/commercial-heating` was intended for Day 2 slot 10 — move to Day 3.

---

## 🔴 Day 3 — Next Submission (target: 4/24/2026) — 10 URLs

**HIGHEST priority.** All were in the "Discovered – currently not indexed" bucket OR the "Crawled – currently not indexed" bucket on 4/23 morning. Inspect each via URL Inspection FIRST — if already indexed, skip. Remaining slots should be used on other Day-3 entries.

| Order | URL | Priority reason |
|:-:|---|---|
| 1 | `https://dfwhvac.com/services/commercial/commercial-heating` | 🔥 Missed from Day 2; high-ticket commercial |
| 2 | `https://dfwhvac.com/cities-served/argyle` | 🔥 Only URL in "Crawled – not indexed" bucket; re-evaluate vs current schema-rich content |
| 3 | `https://dfwhvac.com/recent-projects` | 🔥 145+ completed jobs visible; trust asset + AEO target |
| 4 | `https://dfwhvac.com/cities-served/north-richland-hills` | Major mid-cities market |
| 5 | `https://dfwhvac.com/cities-served/hurst` | Major mid-cities market |
| 6 | `https://dfwhvac.com/cities-served/carrollton` | Major market, growing residential |
| 7 | `https://dfwhvac.com/cities-served/flower-mound` | Upscale market, high-ticket installs |
| 8 | `https://dfwhvac.com/cities-served/grapevine` | Tourist + residential overlap |
| 9 | `https://dfwhvac.com/cities-served/euless` | Mid-cities market |
| 10 | `https://dfwhvac.com/cities-served/bedford` | Mid-cities market |

---

## 🟡 Day 4 — Submission (target: 4/25/2026) — 6 URLs

Finishing the "Discovered – currently not indexed" bucket.

| Order | URL | Priority reason |
|:-:|---|---|
| 1 | `https://dfwhvac.com/cities-served/colleyville` | Upscale market |
| 2 | `https://dfwhvac.com/cities-served/the-colony` | Growing N-DFW market |
| 3 | `https://dfwhvac.com/cities-served/lake-dallas` | Small market, captured for completeness |
| 4 | `https://dfwhvac.com/cities-served/haslet` | Small market, captured for completeness |
| 5 | `https://dfwhvac.com/cities-served/roanoke` | Growing market |
| 6 | `https://dfwhvac.com/privacy-policy` | Utility — low conversion value but low cost to submit |

After Day 4 completes, **every URL from the "Discovered – not indexed" bucket + the "Crawled – not indexed" bucket will have been submitted.**

---

## 🟢 Day 5–7 — Spot-Check Batch (target: 4/28–4/30) — 12 URLs

**These are likely already indexed** (weren't in either "not indexed" bucket when we analyzed 4/23). Use URL Inspection only — do NOT submit unless the tool explicitly shows "URL is not on Google". Save your request budget.

### Hubs & utility

| URL | Expected status |
|---|:-:|
| `https://dfwhvac.com/services` | ✅ Likely indexed |
| `https://dfwhvac.com/cities-served` | ✅ Likely indexed |
| `https://dfwhvac.com/terms-of-service` | ✅ Likely indexed |
| `https://dfwhvac.com/services/commercial/commercial-maintenance` | ✅ Likely indexed |

### Already-indexed cities (spot-check to confirm)

| URL | Expected status |
|---|:-:|
| `https://dfwhvac.com/cities-served/allen` | ✅ Likely indexed |
| `https://dfwhvac.com/cities-served/dallas` | ✅ Likely indexed — highest-volume DFW market |
| `https://dfwhvac.com/cities-served/denton` | ✅ Likely indexed |
| `https://dfwhvac.com/cities-served/farmers-branch` | ✅ Likely indexed |
| `https://dfwhvac.com/cities-served/fort-worth` | ✅ Likely indexed — major market |
| `https://dfwhvac.com/cities-served/keller` | ✅ Likely indexed |
| `https://dfwhvac.com/cities-served/plano` | ✅ Likely indexed — highest-volume DFW suburb |
| `https://dfwhvac.com/cities-served/southlake` | ✅ Likely indexed — upscale, high-ticket |

**Protocol:** For each URL — paste in URL Inspection → check status → if "URL is not on Google" = submit. If "URL is on Google" = skip.

---

## 📊 Running Summary

| Status | Count | % of 47 sitemap URLs |
|---|---:|---:|
| Submitted so far (4/21 + 4/23) | 19 | 40% |
| Remaining to submit (Days 3–4, all confirmed un-indexed) | 16 | 34% |
| Remaining to spot-check (Day 5–7, likely already indexed) | 12 | 26% |
| **Total sitemap** | **47** | **100%** |

**At completion of Day 4:** every URL flagged as "not indexed" by GSC will have been requested.
**At completion of Day 7:** every sitemap URL will have been either requested or confirmed-indexed via URL Inspection.

---

## 🎯 After the 7-Day Sprint

1. **Wait 5–7 days** — Google typically processes manual indexing requests within 24–72 hrs; let the queue fully drain.
2. **Check GSC "Page Indexing" aggregate dashboard** — should show indexed rate of 80%+ (target: 38–44 of 47 URLs).
3. **For any URL still un-indexed after the sprint:** the issue is content quality or structural, not crawl-budget. At that point escalate to:
   - P1.17c — Internal linking audit on individual stuck URLs
   - P1.6b — City page body content expansion (300–500 unique words per city)
   - Investigate structured data / canonical tag correctness via GSC Enhancements report

4. **Long-term cadence:** After this sprint, new URLs should index within 7–14 days organically (once crawl budget is re-established). Manual indexing requests become reserved for:
   - New high-value pages (P1.13–P1.16: system-replacement, estimator, financing, repair-or-replace)
   - Major content refreshes that need rapid re-crawl
   - Post-migration fixes

---

## 🔄 Update History

| Date | Change |
|---|---|
| 4/23/2026 | Document created. Day 1 + Day 2 submissions logged. Day 3–7 plan published. |
