# AEO Citation Tracking — Baseline (S3, Phase 2)

**Created:** February 28, 2026
**Cadence:** Quarterly (next: May 31, 2026)
**Owner:** User-led runs · Agent logs results
**Source-of-truth file:** this doc

---

## Why this matters

> **AEO is the new SEO.** Answer engines (ChatGPT, Perplexity, Google AI Overviews,
> Gemini, Claude, Apple Intelligence) are an emerging top-of-funnel channel for
> homeowner queries. Unlike Google's 10-blue-link SERP, an AEO citation is a
> winner-take-most outcome — the engine picks 1–3 sources for any given answer.
> This baseline tracks whether DFW HVAC is in that consideration set yet.

Phase 2 KPI target (per ROADMAP.md): **5+ of 20 queries cite DFW HVAC by Sep 1, 2026.**

---

## Methodology

For each query below, run on **all 4 engines** and capture:

1. **Cited?** ✅ / ❌ (was DFW HVAC in the source citations or recommendations?)
2. **Source URL** (if cited — which page on dfwhvac.com did the engine pull from?)
3. **Position** (was it the #1 cited source, or one of N?)
4. **Direct mention** (does the answer mention "DFW HVAC" by brand name in the prose, or only in the citations footer?)
5. **Notes** (any competitor mentioned, any inaccuracy in what the engine said about us, etc.)

**Re-run cadence:** quarterly minimum. Run more often (monthly) for the queries the brand has won — AI engines re-rank constantly.

**Engines to test:**
- 🤖 **ChatGPT** (GPT-5 / "Search the web" mode active)
- 🔮 **Perplexity** (default mode)
- 🟣 **Google AI Overviews** (search the query in google.com from a Texas IP, screenshot the AI Overview)
- 🌟 **Gemini** (gemini.google.com, "Search" tool enabled)

---

## The 20-query baseline set

Categorized by intent. Mix of **transactional, decision-framework, and locational** queries.

### A. Locational + transactional (8 queries)

These are the bread-and-butter — homeowner ready to call someone today.

| # | Query | Why we picked it |
|---|---|---|
| 1 | "best hvac company in dallas tx" | Top-of-funnel category-leader query |
| 2 | "ac repair coppell tx" | Coppell = home base; should be unbeatable |
| 3 | "emergency hvac dallas fort worth" | High-intent night/weekend query |
| 4 | "furnace repair plano tx" | Plano = highest-volume DFW suburb for our service area |
| 5 | "family-owned hvac contractor dfw" | Brand differentiator — three generations |
| 6 | "hvac contractor frisco texas reviews" | Reviews + city — tests whether 145+ reviews surface |
| 7 | "trusted ac repair near me dfw" | "Near me" + trust signal phrasing |
| 8 | "licensed hvac contractor irving tx" | Licensing query — tests trust-signal capture |

### B. Decision-framework (6 queries)

These are the queries our `/repair-or-replace` and `/replacement-estimator`
content was *purpose-built* to win. AI engines love structured answers, tables,
and step-by-step content — and we have all three.

| # | Query | Target page |
|---|---|---|
| 9 | "should i repair or replace my air conditioner" | `/repair-or-replace` |
| 10 | "how much does a new hvac system cost in texas" | `/replacement-estimator` |
| 11 | "hvac replacement cost dallas" | `/replacement-estimator` + `/services/system-replacement` |
| 12 | "is it worth repairing a 15 year old furnace" | `/repair-or-replace` (age-bracket table) |
| 13 | "how to finance a new hvac system" | `/financing` |
| 14 | "what size ac do i need for a 2000 sqft home" | `/replacement-estimator` (sqft → tonnage map) |

### C. Educational / informational (6 queries)

Lower transactional intent but high citation rate (engines love these for "tell me about" prompts).

| # | Query | Target page |
|---|---|---|
| 15 | "how often should i change my hvac filter" | `/faq` |
| 16 | "signs my hvac needs replacement" | `/repair-or-replace` (5-signs list) |
| 17 | "what does seer2 mean" | `/replacement-estimator` (efficiency factor) |
| 18 | "commercial hvac maintenance dallas" | `/services/commercial/commercial-maintenance` |
| 19 | "hvac maintenance plan benefits" | `/services/residential/preventative-maintenance` |
| 20 | "how to choose an hvac contractor" | `/about` (trust + family-business angle) |

---

## Baseline run — _PENDING_

Run all 20 queries on all 4 engines. Use a fresh browser profile (or incognito)
so personalization doesn't taint results. Total time: ~90 minutes.

### Run log template (copy this, fill in)

#### Query 1: "best hvac company in dallas tx"

| Engine | Cited? | Source URL | Position | Direct mention | Notes |
|---|---|---|---|---|---|
| ChatGPT | _____ | _____ | _____ | _____ | _____ |
| Perplexity | _____ | _____ | _____ | _____ | _____ |
| Google AI Overviews | _____ | _____ | _____ | _____ | _____ |
| Gemini | _____ | _____ | _____ | _____ | _____ |

_(repeat for queries 2 through 20)_

---

## What to do with the data

After the baseline run, fill the table at the bottom (Section "Quarterly result
matrix"). Three follow-up actions, prioritized:

1. **🟢 Won queries (we're cited):** add to the monthly-monitor list. Identify
   which page won, double down on the topic cluster around that page.
2. **🟡 Adjacent-cited queries (a competitor is cited and we're not, but our
   content covers the topic):** open a content gap ticket — what does the cited
   competitor have that we don't? Often it's structured content (tables, FAQ,
   step-by-step) that the engines lock onto.
3. **🔴 Lost queries (zero relevance, no DFW HVAC mention):** flag for new content
   in Phase 2b cadence. Don't fight a losing battle on a single query;
   identify if we lack a target page entirely.

---

## Quarterly result matrix (fill after each run)

| Run date | # cited (of 20) | # 1st-position citations | Notes |
|---|---:|---:|---|
| 2026-02-28 _baseline_ | _pending user run_ | _pending_ | Initial run after Phase 2a content shipped |
| _next: May 31_ | _pending_ | _pending_ | _pending_ |
| _next: Aug 31_ | _pending_ | _pending_ | Phase 2 KPI deadline (5+ of 20) |
