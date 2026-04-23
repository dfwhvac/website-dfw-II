# DFW HVAC — Audit Archive

**Last reviewed:** April 23, 2026
**Location rule:** Every new audit artifact (Lighthouse run, technical SEO audit, QA sweep, security scan, accessibility report, bundle analysis, etc.) goes HERE with filename `YYYY-MM-DD_descriptor.{md|csv|xlsx|json}`.

## Naming convention

- ISO-date prefix (`2026-04-21_`) so chronological sort happens naturally via `ls`
- Descriptor should be underscore-separated, concise, lowercase-preferred
- Examples: `2026-04-21_Technical_Audit.md`, `2026-04-21_Lighthouse_Tier1_Production.md`, `2026-05-15_Security_Scan.md`

---

## Current contents

### Technical + SEO Audits

| File | Date | Scope | Grade / Result |
|---|---|---|---|
| [`2026-04-23_GSC_Indexing_Tracker.md`](./2026-04-23_GSC_Indexing_Tracker.md) | Apr 23, 2026 | **Living** — manual indexing request tracker (Days 1–7 sprint plan) | 🟡 19/47 submitted (40%); full plan through 4/30 |
| [`2026-04-23_Legacy_URL_Redirect_Map.md`](./2026-04-23_Legacy_URL_Redirect_Map.md) | Apr 23, 2026 | Full legacy Wix URL inventory → 301 + 410 map (20 URLs) | ✅ Deployed — all 18 curl tests pass |
| [`2026-04-22_Competitor_Title_Audit.md`](./2026-04-22_Competitor_Title_Audit.md) | Apr 22, 2026 | Title-tag + trust-signal competitive audit (A#1 Air, Milestone, Coppell AC, Andy's Sprinkler) | 🎯 Informs P1.6a rewrite — industry-wide review-count blind spot identified |
| [`DFW_HVAC_Technical_Audit_2026-04-21.md`](./DFW_HVAC_Technical_Audit_2026-04-21.md) | Apr 21, 2026 | 13-category technical SEO + architecture sweep | 🟡 B+ (89/100) at capture time → 🟢 A (96/100) expected post-PR#3 |
| [`2026-04-20_DFW_HVAC_Action_Items.md`](./2026-04-20_DFW_HVAC_Action_Items.md) | Apr 20, 2026 | Master task list pre-roadmap migration | Reference archive |
| [`2026-04-20_DFW_HVAC_Site_Audit.xlsx`](./2026-04-20_DFW_HVAC_Site_Audit.xlsx) | Apr 20, 2026 | SEO status spreadsheet (meta desc drafts, cities, services) | Reference archive |

### Performance + Lighthouse

| File | Date | Scope | Result |
|---|---|---|---|
| [`2026-04-21_DFW_HVAC_Performance_Scorecard.md`](./2026-04-21_DFW_HVAC_Performance_Scorecard.md) | Apr 21, 2026 | Lighthouse scorecard (13 pages, Next.js 14/15 comparison) | Post-v15 upgrade baseline |
| [`lighthouse_v15_post_upgrade_2026-04-20.csv`](./lighthouse_v15_post_upgrade_2026-04-20.csv) | Apr 20, 2026 | CSV scorecard after Next 15 upgrade | Pre-optimization baseline |
| [`2026-04-21_Lighthouse_Tier1_Production.md`](./2026-04-21_Lighthouse_Tier1_Production.md) | Apr 21, 2026 | Curated 12-page mobile + desktop Lighthouse on production after all Apr 21 fixes | Site scorecard (full details inside) |
| [`baseline-screenshots-2026-04-18/`](./baseline-screenshots-2026-04-18/) | Apr 18, 2026 | 13-page visual baselines pre-Next 15 upgrade | Regression reference |

### Mobile / UX / QA

| File | Date | Scope | Result |
|---|---|---|---|
| [`DFW_HVAC_QA_Sweep_2026-04-21.md`](./DFW_HVAC_QA_Sweep_2026-04-21.md) | Apr 21, 2026 | Cross-browser + mobile + broken-links QA | 🟢 PASS (0 broken links, 1 minor mobile issue fixed same-day) |
| [`Mobile_Form_UX_Audit_2026-04-21.md`](./Mobile_Form_UX_Audit_2026-04-21.md) | Apr 21, 2026 | LeadForm + SimpleContactForm mobile-first review | Quick wins applied (autocomplete + inputMode) |

---

## Audit cadence (recurring)

- **Quarterly — Technical SEO & Architecture Audit:** re-run the 13-category sweep. Next: July 21, 2026.
- **Quarterly — Post-launch QA Sweep:** cross-browser, mobile, broken-links check. Next: July 21, 2026.
- **Monthly — Lighthouse Scorecard:** mobile + desktop on ~12 curated pages (home, 2 service, 2 city, about, contact, request-service, recent-projects).
- **28-day rolling — CrUX / GSC Core Web Vitals:** field data from real users (no action required — Google auto-collects).

## Non-audit reference docs (intentionally NOT moved here)

These remain in `/app/frontend/internal/` because they're reference material, not audits:
- `DFW_HVAC_Brand_Framework.md` + `.csv` — brand voice + messaging
- `DFW_HVAC_Brand_Framework_3Pillar.md` + `.csv` — Trust/Excellence/Care framework
- `DFW_HVAC_Competitor_Analysis.md` + `.csv` — competitive landscape
- `DFW_HVAC_FAQs.csv` — customer FAQ content
- `DFW_HVAC_Housing_Types.csv`, `Master_Service_Area.csv`, `Service_Area_4Zone.csv`, `Service_Area_Zones.csv` — DFW geo reference
- `package.json.backup-v14`, `yarn.lock.backup-v14` — pre-upgrade dependency snapshots
