# Site-Wide Indexing Audit — 2026-04-27 (Authoritative)

**Data source:** GSC Pages report CSV exports (Apr 27, 2026, ~10:13 AM)
**Sitemap source:** `https://dfwhvac.com/sitemap.xml` (47 URLs)
**Last verified:** 2026-04-27

---

## 🎯 Headline metrics

| Metric | Value |
|---|---:|
| Sitemap URLs total | 47 |
| **Sitemap URLs indexed (per GSC)** | **42** |
| **Sitemap URLs indexed (effective, live-tested)** | **44** |
| Sitemap URLs genuinely needing work | **3** |
| **Effective indexing rate** | **93.6%** |
| Total URLs Google knows about (incl. legacy) | 61 |
| Total indexed (incl. www-prefixed legacy) | 50 |

> "Effective" includes 2 URLs (AC, IAQ) that GSC's aggregate report still lists in "Discovered – not indexed" but live URL Inspection confirms ARE indexed (~7-day report lag).

---

## ✅ Indexed sitemap URLs (42)

### Hub & utility (5/5 indexed)
| URL | Last crawled |
|---|---|
| `/` | 2026-04-21 |
| `/about` | 2026-04-23 |
| `/contact` | 2026-04-20 |
| `/services` | 2026-04-18 |
| `/cities-served` | 2026-04-17 |

### Conversion / transactional (3/3 indexed)
| URL | Last crawled |
|---|---|
| `/estimate` | 2026-04-20 |
| `/request-service` | 2026-04-17 |
| `/reviews` | 2026-04-23 |

### Trust / content (2/2 indexed)
| URL | Last crawled |
|---|---|
| `/faq` | 2026-04-24 |
| `/recent-projects` | 2026-04-24 |

### Legal (2/2 indexed)
| URL | Last crawled |
|---|---|
| `/privacy-policy` | 2026-04-24 |
| `/terms-of-service` | 2026-04-17 |

### Residential services (2/4 in GSC report; 4/4 live-verified)
| URL | Last crawled | GSC bucket | Live status |
|---|---|---|---|
| `/services/residential/heating` | 2026-04-24 | ✅ Indexed | ✅ |
| `/services/residential/preventative-maintenance` | 2026-04-17 | ✅ Indexed | ✅ |
| `/services/residential/air-conditioning` | (never per report) | ❌ Discovered | **✅ Live-confirmed indexed** |
| `/services/residential/indoor-air-quality` | (never per report) | ❌ Discovered | **✅ Live-confirmed indexed** |

> AC and IAQ have stale "never crawled" timestamps (1969-12-31) in the report, but URL Inspection confirms they're indexed. Will refresh in next aggregate update (~5–7 days).

### Commercial services (2/3 indexed)
| URL | Last crawled |
|---|---|
| `/services/commercial/commercial-air-conditioning` | 2026-04-23 ✅ |
| `/services/commercial/commercial-maintenance` | 2026-04-17 ✅ |
| `/services/commercial/commercial-heating` | 2026-04-23 ❌ Crawled-not-indexed (Validation Failed) |

### City pages (26/28 indexed)

| City | Last crawled | Status |
|---|---|---|
| `allen` | 2026-04-18 | ✅ |
| `argyle` | 2026-04-24 | ✅ |
| `arlington` | 2026-04-20 | ✅ |
| `bedford` | 2026-04-24 | ✅ |
| `carrollton` | 2026-04-24 | ✅ |
| `colleyville` | 2026-04-24 | ✅ |
| `coppell` | 2026-04-24 | ✅ |
| `dallas` | 2026-04-17 | ✅ |
| `denton` | 2026-04-18 | ✅ |
| `euless` | 2026-04-24 | ✅ |
| `farmers-branch` | 2026-04-17 | ✅ |
| `flower-mound` | 2026-04-24 | ✅ |
| `fort-worth` | 2026-04-17 | ✅ |
| `frisco` | 2026-04-23 | ✅ |
| `grapevine` | 2026-04-24 | ✅ |
| **`haslet`** | (never) | **❌ Discovered – submitted Apr 27** |
| `hurst` | 2026-04-24 | ✅ |
| `irving` | 2026-04-23 | ✅ |
| `keller` | 2026-04-18 | ✅ |
| `lake-dallas` | 2026-04-24 | ✅ |
| `lewisville` | 2026-04-23 | ✅ |
| `mansfield` | 2026-04-23 | ✅ |
| `north-richland-hills` | 2026-04-24 | ✅ |
| `plano` | 2026-04-18 | ✅ |
| `richardson` | 2026-04-23 | ✅ |
| `roanoke` | 2026-04-24 | ✅ |
| `southlake` | 2026-04-17 | ✅ |
| **`the-colony`** | (never) | **❌ Discovered – not yet submitted** |

---

## ❌ The genuine indexing backlog (3 URLs)

These are the only sitemap URLs that are not on Google AND not already submitted today:

### 1. `https://dfwhvac.com/cities-served/the-colony`
- **Bucket:** Discovered – currently not indexed
- **Action:** Submit via URL Inspection → Request Indexing
- **Risk:** Low. Small market, low traffic priority.

### 2. `https://dfwhvac.com/services/commercial/commercial-heating`
- **Bucket:** Crawled – currently not indexed (Validation FAILED Apr 24)
- **Action:** Re-submit via URL Inspection → Request Indexing
- **Risk:** Medium. Google explicitly rejected this one. Likely thin/duplicate content vs. `commercial-ac`.
- **Long-term fix:** Differentiate body content vs. `/services/commercial/commercial-air-conditioning` to remove duplicate-ish signal.

### 3. `https://dfwhvac.com/cities-served/haslet` *(submitted Apr 27)*
- **Bucket:** Discovered – currently not indexed → 🔄 awaiting Google's response
- **Action:** No further action — wait 3–5 days for Google to crawl.

---

## 📎 Legacy "extras" — indexed but should redirect (8 URLs)

These are old Wix URLs Google still has in its index. **Redirects went live on Apr 23**, so the next time Google recrawls each one it'll reclassify them as "Page with redirect" and demote them. **No manual action needed — natural decay.**

| URL | Last crawled | Redirects to (after Apr 23) |
|---|---|---|
| `https://www.dfwhvac.com/recent-projects` | 2026-04-17 | (canonical via www→apex) |
| `https://www.dfwhvac.com/products` | 2026-04-16 | `/services` |
| `https://www.dfwhvac.com/seasonalmaintenance` | 2026-04-06 | `/services/residential/preventative-maintenance` |
| `https://www.dfwhvac.com/haloled` | 2026-03-26 | `/services/residential/indoor-air-quality` |
| `https://www.dfwhvac.com/ducting` | 2026-02-05 | `/estimate` |
| `https://www.dfwhvac.com/installation` | 2026-01-30 | `/services/system-replacement` (after merge) or `/estimate` (now) |
| `https://www.dfwhvac.com/scheduleservicecall` | 2026-01-16 | `/request-service` |
| `https://www.dfwhvac.com/iaq` | 2026-01-13 | `/services/residential/indoor-air-quality` |

> **Net SEO effect:** these legacy URLs are currently giving you bonus link-equity and SERP coverage for old keywords. Once redirects propagate they'll consolidate into the canonical pages — that's the desired outcome. Don't touch.

---

## 🚫 Confirmed not-on-Google (legitimately)

| URL | Bucket | Action |
|---|---|---|
| `https://www.dfwhvac.com/_files/ugd/5ab42d_…fed80.pdf` | Excluded by 'noindex' tag | None — stale Wix file, will drop |
| `https://www.dfwhvac.com/servicecall` | Not found 404 | None — redirect now in place, will reclassify |
| `https://www.dfwhvac.com/aboutus` | Crawled – not indexed | None — redirect now in place, will reclassify |
| `https://www.dfwhvac.com/` | Page with redirect (→ apex) | None — canonical working |
| `http://dfwhvac.com/` | Page with redirect (→ https) | None — canonical working |
| `http://www.dfwhvac.com/` | Page with redirect (→ https apex) | None — canonical working |

---

## ⏸️ Apr 24 stack (not in sitemap, awaiting `preview` → `main` merge)

| URL | Status |
|---|---|
| `/financing` | Awaiting merge |
| `/services/system-replacement` | Awaiting merge |
| `/repair-or-replace` | Awaiting merge |
| `/replacement-estimator` | Awaiting merge |

Once merged: submit all 4 via URL Inspection on the same day. Sitemap will auto-update.

---

## 📋 Recommended actions (in priority order)

### 🟢 Today (uses 2 indexing requests)
1. ✅ Submit `https://dfwhvac.com/cities-served/the-colony`
2. ✅ Submit `https://dfwhvac.com/services/commercial/commercial-heating`

(That's it. 8 of your 10 daily slots remain unspent — save them for tomorrow's Apr 24 stack.)

### 🟡 Tomorrow (after `preview` → `main` merge)
1. Submit `/financing`
2. Submit `/services/system-replacement`
3. Submit `/repair-or-replace`
4. Submit `/replacement-estimator`

### 🟢 Day 5–7 (no manual action)
- Wait for `haslet` validation to complete (submitted today)
- Wait for legacy URL recrawl to demote them out of "Indexed" into "Page with redirect"
- Re-export GSC reports next Tuesday (May 5) — expect:
  - Indexed: 50 → 54+ (Apr 24 stack lands)
  - Discovered – not indexed: 4 → 0–1
  - Crawled – not indexed: 2 → 0–1 (commercial-heating may stick if duplicate signal isn't fixed)

### 🔵 P1.17c (medium-term, agent task)
**Internal-linking audit on `commercial-heating`** — the only page Google explicitly rejected. Add cross-links from city pages, FAQ, and possibly a body-copy refresh to differentiate from `commercial-ac`.

---

## Update history

| Date | Change |
|---|---|
| 2026-04-27 | File created. Initial sitemap pull. 4 confirmed indexed via spot-checks. |
| 2026-04-27 | **Full audit complete.** All 47 sitemap URLs classified using GSC CSV exports. 42 indexed (89.4%) per report; 44 effective (93.6%); 3 genuine backlog identified. |
