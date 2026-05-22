# 🟢 START HERE — Agent Standard Operating Procedure

**Last reviewed:** May 21, 2026
**This file is the single entry point for every session.** Read it completely before taking any other action on this project.

---

## One-Sentence Policy (master rule)

**If it is not in `/frontend` (or a named adjacent repo file such as `.github/workflows/*.yml` or `scripts/*.mjs`), it is not “shipped” — label it `PARTIAL`, `USER_ACTION`, or `INFRA` instead.**

Every “✅ Shipped” claim in `CHANGELOG.md` must cite file paths and grep evidence. Event names must match `GA4_EVENTS.md`, not GA4 Admin display names.

---

## 🗺️ Documentation Map

| File | Purpose |
|---|---|
| **`/app/memory/00_START_HERE.md`** (this file) | Agent SOP — session-start and session-end checklists |
| **`/app/memory/ROADMAP.md`** | **Future work only** — open priorities (P1–P6); no shipped tables |
| **`/app/memory/CHANGELOG.md`** | Reverse-chronological record of everything shipped to production (baseline reset May 21, 2026) |
| **`/app/memory/CHANGELOG-legacy-pre-2026-05-21.md`** | Archived pre-reset agent changelog — historical only |
| **`/app/memory/GA4_EVENTS.md`** | Authoritative registry of GA4 events **fired in code** vs GA4 Admin renames / key-event toggles |
| **`/app/memory/PRD.md`** | Minimal shim — original problem statement, architecture, persona. Redirects to ROADMAP + CHANGELOG for live content |
| **`/app/memory/audits/`** | All past audit artifacts (Lighthouse scorecards, technical SEO audits, QA sweeps, mobile UX audits, baseline screenshots). Save new audits HERE with ISO-date filenames. |
| **`/app/memory/audits/README.md`** | Index of all audit files with brief descriptions |
| **`/app/memory/POST_DEPLOY_ACTION_ITEMS_PR2.md`** | User-facing action items (GA4 conversion toggles, etc.) — not an audit, not a roadmap |
| **`/app/memory/KPI_DASHBOARD_GUIDE.md`** | Owner + agent guide — GATE vs SIGNAL vs MAINTAIN; phase graduation policies |
| **`/app/memory/KPI_DASHBOARD_SCOPE.md`** | KPI dashboard build scope + metric classification table (schema v2) |
| **`/app/memory/GA4_SERVICE_ACCOUNT_SETUP.md`** | ⚠️ **SUPERSEDED** — service-account path was abandoned. GA4 + GSC auth runs through OAuth refresh-token flow (secrets `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` / `GA4_PROPERTY_ID` / `GSC_SITE_URL` in GitHub Actions secrets, OAuth client lives in `dfwhvac-kpi` GCP project). The doc is kept for historical context only — do NOT follow its steps. |
| **`/app/memory/P2.18_CACHE_COMPONENTS_SPIKE.md`** | Spike findings for Next.js 16 `cacheComponents` flag — DEFERRED with reopen criteria (Feb 2026) |
| **`/app/memory/P2.20_LCP_OPTIMIZATION_PLAN.md`** | Multi-step playbook for LCP push 2.18s → <1.25s. Step 1 revised after audit: text-LCP optimization (font config + script-strategy demotion) rather than image-LCP (no hero image exists) |

**Non-audit reference docs** (brand framework, service areas, FAQs, competitor analysis, legacy backups) remain in `/app/frontend/internal/`.

---

## 🟢 Session-START Checklist — Run FIRST, before any other work

Verify the following six items. If any fails, STOP and investigate — the documentation loop has drifted:

- [ ] **1. This file exists and you've read it completely.** ✓ by reading you got here.
- [ ] **2. `/app/memory/ROADMAP.md` "Last reviewed" stamp is <7 days old** (or matches the last shipping event). If older than 7 days AND work has shipped, the roadmap is stale — flag it.
- [ ] **3. `/app/memory/CHANGELOG.md` "Last reviewed" stamp is <7 days old.** Same rule.
- [ ] **4. `/app/memory/audits/` folder exists and contains `README.md`.** Confirms audit discipline preserved.
- [ ] **5. No phantom files exist at `/app/memory/`:**
  - ❌ `/app/memory/NEXT_SESSION_PRIORITIES.md` should NOT exist (migrated to ROADMAP.md)
  - ❌ `/app/memory/PRD.md` should be the **30-line shim only** (not a full PRD)
  - If either exists in their old form, an earlier agent drifted — delete/restore per the canonical structure.
- [ ] **6. Read `/app/memory/ROADMAP.md` for current priorities and `/app/memory/CHANGELOG.md` for recent context** before planning any work.

**Why checks #2–#5 matter:** Emergent's platform system prompt hard-codes `/app/memory/PRD.md` as the expected write location during `finish`. Without this SOP, agents may regenerate the old monolithic PRD and drift the structure back. The checklist catches that on session start.

---

## 🔴 Session-END Checklist — Run BEFORE calling `finish`

Before handing off, verify:

- [ ] **1. If I shipped anything → `/app/memory/CHANGELOG.md` has a new entry dated today** with file paths, grep/command evidence, and any `PARTIAL` / `USER_ACTION` caveats. GA4 changes must update `GA4_EVENTS.md` if event names or params changed.
- [ ] **2. If priorities shifted → `/app/memory/ROADMAP.md` is updated** (added/removed/moved items, rescored phases).
- [ ] **3. If I produced audit data** (Lighthouse runs, curl scorecards, manual QA, security scans) → **saved to `/app/memory/audits/`** with ISO-date filename (`YYYY-MM-DD_what_was_audited.md`) AND `/app/memory/audits/README.md` index updated.
- [ ] **4. `Last reviewed` stamp at the top of ROADMAP.md and CHANGELOG.md updated to today's date.**
- [ ] **5. I did NOT recreate `/app/memory/PRD.md` as a full PRD.** The shim is only ~30 lines pointing to ROADMAP and CHANGELOG. If the platform's finish tool expects PRD.md, let the shim stay a shim.
- [ ] **6. I did NOT recreate `/app/memory/NEXT_SESSION_PRIORITIES.md`.** That file is retired.
- [ ] **7. The handoff summary I produce at `finish` explicitly references this file**, e.g.: *"Before any other work, read and follow the checklist in `/app/memory/00_START_HERE.md`."*

**Why the fork-summary reminder matters:** forks get a fresh context. The only persistent artifact they see is the handoff summary text. Linking back to this SOP inside the summary is the ONE mechanism that survives the context discontinuity.

---

## 📏 Size & Hygiene Rules

- **CHANGELOG.md** should stay under ~1,000 lines. When it grows past that, **archive the oldest 90+ days** into `/app/memory/CHANGELOG-legacy-YYYY-MM-DD.md` (or `audits/changelog-archive-YYYYQX.md`) and link from the bottom of CHANGELOG.md.
- **ROADMAP.md** should stay under ~700 lines and contain **no** "✅ SHIPPED" or "Tier X COMPLETE" blocks — when something ships, **delete it from ROADMAP** and add one CHANGELOG entry.
- **Audit filename convention:** `YYYY-MM-DD_descriptor.md` or `YYYY-MM-DD_descriptor.csv` / `.xlsx`. Always ISO-date first so chronological sort happens naturally.

---

## 🧭 Quick Reference — Where does this go?

| I'm about to write... | Goes in |
|---|---|
| What I shipped today | CHANGELOG.md (dated entry) |
| A new future priority / feature idea | ROADMAP.md (appropriate P-tier) |
| Lighthouse run output | audits/ with ISO-date filename |
| Security scan / penetration test result | audits/ with ISO-date filename |
| Technical SEO audit | audits/ with ISO-date filename |
| Bug reproduction notes (temporary) | Nowhere persistent — handle and close |
| A new 3rd-party integration decision | CHANGELOG when shipped; ROADMAP if planned |
| A new or renamed GA4 event | `GA4_EVENTS.md` when code ships; user key-event toggle in `POST_DEPLOY_ACTION_ITEMS_PR2.md` |
| User credentials for testing | `/app/memory/test_credentials.md` (platform convention) |
