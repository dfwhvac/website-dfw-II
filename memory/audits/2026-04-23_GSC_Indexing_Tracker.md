# GSC Manual Indexing Tracker
**Purpose:** Living record of every URL submitted to Google Search Console URL Inspection → Request Indexing. Updated as submissions happen.

**Total sitemap URLs:** 47 (rising to 51 once Apr 24 stack merges: +/financing, /services/system-replacement, /repair-or-replace, /replacement-estimator)
**Submitted so far:** 29 (10 on 4/21 + 9 on 4/23 + 10 on 4/24)
**Remaining to submit/verify:** 22 (5 in Day-4 bucket + 4 brand-new Apr 24 pages awaiting merge + 13 spot-check)
**Currently verified indexed via URL Inspection:** `/cities-served/lewisville` (4/23), `/cities-served/grapevine` (4/24)
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

## ✅ Day 3 — Submitted 4/24/2026 (10 URLs — 9 from Day 3 list + 1 promoted from Day 4)

| # | URL | Result |
|---|---|:-:|
| 1 | `https://dfwhvac.com/services/commercial/commercial-heating` | ✅ Submitted |
| 2 | `https://dfwhvac.com/cities-served/argyle` | ✅ Submitted |
| 3 | `https://dfwhvac.com/recent-projects` | ✅ Submitted |
| 4 | `https://dfwhvac.com/cities-served/north-richland-hills` | ✅ Submitted |
| 5 | `https://dfwhvac.com/cities-served/hurst` | ✅ Submitted |
| 6 | `https://dfwhvac.com/cities-served/carrollton` | ✅ Submitted |
| 7 | `https://dfwhvac.com/cities-served/flower-mound` | ✅ Submitted |
| 8 | `https://dfwhvac.com/cities-served/grapevine` | 🟢 Already indexed — slot freed |
| 9 | `https://dfwhvac.com/cities-served/euless` | ✅ Submitted |
| 10 | `https://dfwhvac.com/cities-served/bedford` | ✅ Submitted |
| ↳ promoted from Day 4 (filled grapevine's slot) | `https://dfwhvac.com/cities-served/colleyville` | ✅ Submitted |

**Net:** 10 URLs submitted to Google, 1 confirmed-indexed (grapevine), 0 daily-quota wasted.

---

## 🟡 Day 4 — Next Submission (target: 4/25/2026) — 5 URLs remaining

Colleyville was promoted into Day 3 slot, leaving 5 in the bucket. Plenty of headroom for the 4 brand-new Apr 24 pages once `preview` merges to `main`.

| Order | URL | Priority reason |
|:-:|---|---|
| 1 | `https://dfwhvac.com/cities-served/the-colony` | Growing N-DFW market |
| 2 | `https://dfwhvac.com/cities-served/lake-dallas` | Small market, captured for completeness |
| 3 | `https://dfwhvac.com/cities-served/haslet` | Small market, captured for completeness |
| 4 | `https://dfwhvac.com/cities-served/roanoke` | Growing market |
| 5 | `https://dfwhvac.com/privacy-policy` | Utility — low conversion value but low cost to submit |

### 🆕 Apr 24 stack — submit AFTER `preview` → `main` merge (4 URLs, fits in same Day 4 budget)

| Order | URL | Priority reason |
|:-:|---|---|
| 6 | `https://dfwhvac.com/services/system-replacement` | 🔥 Replacement revenue center |
| 7 | `https://dfwhvac.com/replacement-estimator` | 🔥 Interactive tool, AEO ammo |
| 8 | `https://dfwhvac.com/repair-or-replace` | 🔥 AEO decision article, schema-rich |
| 9 | `https://dfwhvac.com/financing` | 🟡 Funnel support |

**Day 4 total:** 9 URLs (under the 10-URL daily cap; 1 slot reserved for any fresh "discovered not-indexed" surfacing in GSC overnight).

After Day 4 completes, **every URL from the "Discovered – not indexed" bucket + the "Crawled – not indexed" bucket + the entire Apr 24 release will have been submitted.**

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
| Submitted so far (4/21 + 4/23 + 4/24) | 29 | 62% |
| Confirmed-indexed without submission needed (lewisville 4/23, grapevine 4/24) | 2 | 4% |
| Remaining to submit (Day 4 leftovers + 4 Apr 24 new pages) | 9 | 19%* |
| Remaining to spot-check (Day 5–7, likely already indexed) | 12 | 26% |
| **Total sitemap (47 today, 51 post-merge)** | **47** | **100%** |

*4 of the remaining 9 are not in the 47-URL count yet — they're the Apr 24 stack pending production merge.

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
| 4/24/2026 | Day 3 submitted (10 URLs). `/cities-served/grapevine` was already indexed → freed slot used to promote `/cities-served/colleyville` from Day 4. Day 4 bucket now has 5 URLs + 4 Apr 24 pages awaiting merge. Running indexed-or-submitted = 31 of 47 (66%). |
