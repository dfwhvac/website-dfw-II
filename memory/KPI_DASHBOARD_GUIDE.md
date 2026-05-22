# KPI Dashboard — Owner & Agent Guide

**Last reviewed:** May 22, 2026  
**Live URL:** https://dfwhvac.com/internal/kpi-dashboard.html  
**Data source:** `frontend/public/internal/kpi-snapshot.json` (weekly via `scripts/audit-kpis.mjs`)

---

## What this dashboard is for

Two jobs — **do not merge them**:

| Job | Question | Where on page |
|---|---|---|
| **Phase graduation** | Can we focus on the next roadmap phase? | Top cards (Gate X/Y met) + **Phase exit checklists** |
| **Engineering health** | Anything degrading worth tuning? | Full table, filter **Maintain** |

**Never infer graduation from total green count.** P1 can show 25+ greens while SEC-2 is still red.

---

## Four tags (every metric has one)

| Tag | Meaning | Gates phase? |
|---|---|---|
| **GATE** | Must pass before next phase | **Yes** (when `blocksGraduation: true`) |
| **SIGNAL** | Business progress (GSC, CR, reviews) | No — red is informative, not a blocker |
| **MAINTAIN** | Engineering hygiene (CDN, Observatory, page weight) | No |
| **WATCH** | Not measurable yet (CrUX pending, Clarity baseline) | No — gray is expected |

---

## Graduation policies (owner decisions)

1. **P1 → P2:** All **P1 GATE** rows green. MAINTAIN yellows allowed (e.g. Observatory B+ waiver).
2. **P2 → P3 focus:** **P2-tech** GATE rows green (indexing, sitemap, schema). **P2-growth** (CTR, AEO, GBP) runs in parallel — does not block conversion work.
3. **P3 → P4 build:** **P3-MEASURE** GATE rows green (key events + data window). **P3-OPTIMIZE** reds (low CR) are expected early.
4. **Never optimize MAINTAIN before fixing red SIGNAL** (e.g. don't chase CDN while GSC CTR is flat).

These policies appear in the dashboard banner and match `memory/ROADMAP.md` KPI gates.

---

## P1 GATE checklist (blocks P2)

| ID | Criterion | ROADMAP link |
|---|---|---|
| P1-G1 | Uptime ≥ 99.9% (30d) | — |
| P1-G2 | Gitleaks clean | — |
| P1-G3 | Field mobile LCP < 2.5s (Vercel RUM) | — |
| P1-G4 | Field INP < 200ms | — |
| P1-G5 | Pa11y 0 errors (sample) | — |
| P1-G6 | Main `/api/leads` reCAPTCHA + rate limit | — |
| P1-G7 | Estimator `/api/estimator/lead` hardened | **SEC-2** |
| P1-G8 | Sitemap + robots AI allowlist | — |
| P1-G9 | Post-SEC-1 GSC spot-check | **SEC-1** / A3 |

---

## P2 split

| Track | Examples | Blocks P3? |
|---|---|---|
| **P2-tech** | 51/51 indexed, sitemap health, schema valid | Should be green before trusting SEO learning |
| **P2-growth** | GSC CTR, clicks, reviews, **S3-AEO** (5+/20 by Sep 1) | No — parallel ongoing |

---

## P3 split

| Track | Examples | Blocks P4? |
|---|---|---|
| **P3-MEASURE** | G3–G6 key events, GA4 28d data flowing | **Yes** — see **P3-BASELINE** |
| **P3-OPTIMIZE** | Overall CR, form rate, bounce, estimator funnel | No — drives roadmap priority |

Manual GATE rows (G4–G6, SEC-1 spot-check, S3-AEO) are updated in `MANUAL_GATE_ROWS` inside `scripts/audit-kpis.mjs` when user completes admin tasks.

---

## ROADMAP gate ID sync

| ROADMAP gate | Dashboard KPI IDs |
|---|---|
| **SEC-2** | `sec-2-estimator-lead` |
| **SEC-1** | `sec-1-gsc-indexing` |
| **P3-BASELINE** | `p3-g3-form-key-event` … `p3-g6-estimator-key-event`, `p3-baseline-30d-data` |
| **S3-AEO** | `s3-aeo-citation` |
| **P5-LAUNCH-GATE** | Phase 4/5 WATCH rows (not started) |

When a GATE status changes because work shipped, update **CHANGELOG.md** and remove/adjust **ROADMAP.md** queue items.

---

## Agent rules

1. New KPI rows default to **MAINTAIN** unless justified as GATE with `blocksGraduation: true`.
2. GATE status changes → **CHANGELOG** + **ROADMAP** (per `.cursor/rules/logging.mdc`).
3. Weekly CI updates snapshot; local runs write `kpi-snapshot.local.json` (gitignored).
4. Full classification table: `memory/KPI_DASHBOARD_SCOPE.md`.

---

## Owner weekly ritual (~5 min)

1. Open dashboard → read **Gate X/Y met** on P1 and P3-MEASURE cards.
2. Expand **P1 exit checklist** — any red/yellow blockers?
3. Ignore MAINTAIN reds unless P1 GATE is already clear and you have slack.
4. For P3: confirm G4–G6 key events in GA4 Admin; update manual rows if needed.
