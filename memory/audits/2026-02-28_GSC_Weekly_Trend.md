# GSC Weekly Trend Tracker

**Created:** February 28, 2026 (Phase 2 P1.5)
**Cadence:** Weekly (5 min) · Monthly deep-dive (30 min)
**Owner:** User (5-min weekly glance) · Agent (logs trends + flags anomalies)

---

## Why this exists

Before Phase 4 ad spend goes live, we need to know which **organic** queries,
pages, and locations are converting — without ad-attribution muddying the data.
Weekly check-ins catch indexing regressions and SERP volatility early; monthly
deep-dives drive Phase 2b cadence priorities (which city pages need rewriting,
which queries to target with new content).

**Phase 2 KPI source-of-truth:** `ROADMAP.md` § P2.B (impressions +30%, clicks
+50%, top-20 query position +50% branded / +70% city queries).

---

## Weekly glance (5 min, every Monday)

GSC → **Performance** report → set range to **last 7 days vs previous 7 days**.

Capture:

| Week ending | Impressions | Clicks | CTR | Avg position | Trend vs prior wk | Notes |
|---|---:|---:|---:|---:|---|---|
| 2026-02-28 _baseline_ | _ | _ | _ | _ | _ | First entry — establish baseline |
| _2026-03-07_ | _ | _ | _ | _ | _ | _ |
| _2026-03-14_ | _ | _ | _ | _ | _ | _ |
| _2026-03-21_ | _ | _ | _ | _ | _ | _ |
| _2026-03-28_ | _ | _ | _ | _ | _ | _ |

**Red-flag triggers (escalate immediately to agent):**
- 📉 Impressions drop >20% week-over-week (could be indexing regression)
- 📉 Avg position drops >2 places on previously-tracked top-10 query
- 🚨 GSC → Coverage shows newly-flagged "Pages with errors"
- 🚨 GSC → Manual Actions shows anything other than "No issues detected"

---

## Top 10 priority queries (track weekly position)

This list updates **monthly** (after deep-dive review). Snapshot each one's
average position in GSC each Monday. Plotting position over time tells us
whether a page is climbing, holding, or fading.

| # | Query | Target page | Pos 2026-02-28 | Pos +1 wk | Pos +2 wk | Pos +4 wk | Pos +12 wk |
|---|---|---|---:|---:|---:|---:|---:|
| 1 | hvac dallas | `/cities-served/dallas` | _ | _ | _ | _ | _ |
| 2 | hvac coppell | `/cities-served/coppell` | _ | _ | _ | _ | _ |
| 3 | ac repair plano | `/cities-served/plano` | _ | _ | _ | _ | _ |
| 4 | hvac dfw | `/` | _ | _ | _ | _ | _ |
| 5 | dfw hvac | `/` | _ | _ | _ | _ | _ |
| 6 | furnace repair dallas | `/services/residential/heating` | _ | _ | _ | _ | _ |
| 7 | commercial hvac dallas | `/services/commercial/commercial-air-conditioning` | _ | _ | _ | _ | _ |
| 8 | hvac maintenance plan | `/services/residential/preventative-maintenance` | _ | _ | _ | _ | _ |
| 9 | repair or replace hvac | `/repair-or-replace` | _ | _ | _ | _ | _ |
| 10 | hvac financing dallas | `/financing` | _ | _ | _ | _ | _ |

> ⚠️ **Refresh the query list monthly.** The top 10 will shift as new content
> indexes and seasonal queries cycle (e.g., "ac repair" peaks Jun–Aug;
> "furnace repair" peaks Dec–Feb). Always include any query showing 100+
> impressions in the prior 28 days.

---

## Monthly deep-dive (30 min, last Monday of each month)

GSC → **Performance** → set range to **last 28 days vs previous 28 days**.

### 1. Top winners (queries that gained position or impressions)

| Query | Pages | +Impressions | +Clicks | New position | What we did differently |
|---|---|---:|---:|---:|---|
| _ | _ | _ | _ | _ | _ |

### 2. Top losers (queries that dropped position or lost clicks)

| Query | Pages | -Impressions | -Clicks | New position | Hypothesis | Action |
|---|---|---:|---:|---:|---|---|
| _ | _ | _ | _ | _ | _ | _ |

### 3. New queries (queries that appeared this month with >25 impressions)

These are the early signals of new content ranking. Worth identifying
which page surfaced them and whether to double down with related content.

| New query | Page | Impressions | Notes |
|---|---|---:|---|
| _ | _ | _ | _ |

### 4. Pages with declining clicks (>20% drop, >50 baseline clicks)

| Page | Was | Now | % change | Investigation |
|---|---:|---:|---:|---|
| _ | _ | _ | _ | _ |

### 5. Indexing health

GSC → **Pages** report:
- Indexed (submitted in sitemap): _ / 51
- Total indexed (incl. legacy): _
- Not indexed reasons (top 3): _, _, _
- New 404s discovered: _
- Validation status of any open fixes: _

---

## Quarterly comparison anchors

For the Phase 2 KPI dashboard we need the original 28-day window to
compare against. Each entry below records the value at that month's end.

| Month end | 28-day Imp | 28-day Clicks | 28-day CTR | 28-day avg pos | Indexed (sitemap) |
|---|---:|---:|---:|---:|---:|
| Feb 2026 _baseline_ | _ | _ | _ | _ | _ / 51 |
| Mar 2026 | _ | _ | _ | _ | _ / 51 |
| Apr 2026 | _ | _ | _ | _ | _ / 51 |
| May 2026 | _ | _ | _ | _ | _ / 51 |

Phase 2 KPI exit criteria (Sep 1, 2026):
- ✅ Impressions ≥ +30% vs Feb baseline
- ✅ Clicks ≥ +50% vs Feb baseline
- ✅ Indexed = 51 / 51 (currently effectively at parity)

---

## How to actually export GSC data each Monday (5 min)

1. Open GSC → Performance.
2. Set date range: "Last 7 days" vs "Compare to previous period."
3. Filter: "Search type = Web" (default).
4. Total row at top → record Impressions / Clicks / CTR / Position.
5. Click "Queries" tab → screenshot top 10 (or export CSV).
6. Click "Pages" tab → screenshot top 10.
7. Append the row to the weekly-glance table above.
8. Done. Hard stop at 5 minutes — don't analyze, just log.

Monthly deep-dive (last Monday) extends this to 28 days vs prior 28 days
and adds the "new queries" + "pages declining" + "indexing health" sections.
