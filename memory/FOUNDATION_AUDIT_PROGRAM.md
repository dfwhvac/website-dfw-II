# Foundation audit program — gap closure tracker

**Created:** May 26, 2026  
**Purpose:** Single plan to close security + performance audit gaps. Replaces scattered “28 high CVE” folklore with **measured** weekly counts.

**Live dashboard:** https://dfwhvac.com/internal/kpi-dashboard.html  
**Weekly automation:** `.github/workflows/kpi-audit.yml` + `security.yml` + `dependabot.yml`

---

## Re-examination: yarn audit & the “28 high” baseline

### What the April 21, 2026 audit said

`memory/audits/DFW_HVAC_Technical_Audit_2026-04-21.md` reported:

| Severity | Count |
|---|---|
| Critical | 0 |
| High | **28** |
| Moderate | 32 |
| Low | 2 |

All **28 high** were attributed to the **Sanity 3.x Studio** dependency subtree (`sanity`, `@sanity/export`, build tooling). Recommendation: wait for Sanity 5 upgrade, re-audit quarterly.

### What changed since then

| Change | Date | Effect on advisories |
|---|---|---|
| **Sanity 3.25 → 5.26** | May 2026 (`sanity@^5.26.0`, `@sanity/vision@^5.26.0`) | Should **materially reduce** Studio transitive CVEs — **must re-measure**, not assume |
| **Next.js 16** | Shipped | Separate from Sanity tree |
| **CI gate** | Feb–May 2026 | Was **critical-only** (JSON parse); comment still cited “28 high accepted” while **not failing on high** |

### What runs today (after May 26, 2026 hardening)

| Layer | Behavior |
|---|---|
| **security.yml** | Fails on **high OR critical** in `yarn audit --groups dependencies` |
| **audit-kpis.mjs** | New row **`dependency-vulns-prod`** (P1-G10) — same counts weekly in CI |
| **Dependabot** | Still opens PRs (e.g. `next-sanity` 12→13); separate from audit workflow |

**Important:** `--groups dependencies` includes `sanity` (it is in `dependencies`, not `devDependencies`). The old mental model “Studio CVEs don’t count because dev-only” was **wrong for yarn’s dependency group** — they always counted in production group; we only **ignored** them in CI by failing on critical alone.

### How to verify right now

1. **GitHub → Actions → Security Audit** on latest `main` — read log line `critical=X high=Y moderate=Z`.
2. After next **KPI Audit** Monday run — dashboard row **Production dependency advisories**.
3. Locally: `cd frontend && yarn audit --groups dependencies` (high/critical must be 0 to pass CI).

If **high > 0** after Sanity 5: merge Dependabot patches, add `resolutions` only as last resort, or document a **time-boxed waiver** with module list (not silent acceptance).

---

## Automation inventory (what exists)

| Job | Schedule | Scope |
|---|---|---|
| Dependabot npm | Mon 8:00 AM CT | Minor/patch groups + security PRs anytime |
| Dependabot Actions | Mon | `actions/*` bumps |
| Security Audit | Mon 7:00 AM CT + every PR/push | gitleaks + **yarn high/critical** |
| KPI Audit | Mon 7:00 AM CT + manual | `audit-kpis.mjs` → snapshot commit |
| Sync Reviews | Daily 9:00 AM CT | Google → Sanity |
| Branch freshness | Every PR | `yarn.lock` / `package.json` ≤25 commits behind |

### KPI script collectors (Phase 1)

| Collector | Auto? | Notes |
|---|---|---|
| Security headers, Observatory, SSL Labs | Yes | |
| PageSpeed + CrUX block | Yes | Single URL `/`; needs `PAGESPEED_API_KEY` for quota |
| Pa11y WCAG2AA | Yes (CI) | 5 routes |
| Gitleaks last run | Yes | GitHub API |
| UptimeRobot 30d | If secrets | |
| **yarn audit counts** | **Yes (CI)** | **NEW P1-G10** |
| **linkinator internal** | **Yes** | **NEW maintain row** |
| Vercel RUM 6 rows | **Manual paste** | Stale risk — see gaps |
| GSC / GA4 | If OAuth secrets | |
| Code scan reCAPTCHA / SEC-2 | Yes | |

---

## Gap closure matrix

Status key: **Done** · **In progress** · **Queued (agent)** · **User** · **Deferred**

### Security

| Gap | Target state | Status | Owner / ref |
|---|---|---|---|
| yarn audit gate (high+critical) | CI + KPI mirror | **Done** May 26 | `security.yml`, `dependency-vulns-prod` |
| Verify post–Sanity 5 advisory count | 0 high, 0 critical | **Done** May 26 | `resolutions` (lodash) + lockfile (picomatch); push to confirm CI |
| gitleaks-action v3 (Node 24) | Before Jun 2, 2026 | **Queued** | `RECURRING_MAINTENANCE.md` AH1 |
| SEC-1 remainder (GA4/Clarity/2FA/GSC) | Admin hygiene | **User** | `ROADMAP.md` SEC-1 |
| SEC-1-B2 edge rate limit | Optional | **Deferred** | App limit exists |
| SEC-1-B3 `/studio` IP allowlist | Optional | **User** | Vercel custom rule |
| GCP-CLEANUP | Keys + org policy | **User** | `GCP_PRIVILEGE_CLEANUP.md` |
| Runtime errors (Sentry) | Alert on 5xx spikes | **Queued** | KPI row or drop scaffold |
| CodeQL / Semgrep | SAST on PR | **Deferred** | Low ROI now |
| DAST (ZAP) | Quarterly | **Deferred** | |
| Bot Protection on Vercel | Off unless attack | **Deferred** | Broke KPI before |

### Performance

| Gap | Target state | Status | Owner / ref |
|---|---|---|---|
| Vercel RUM → KPI auto | No manual paste | **Partial** May 26 | LCP/INP/TTFB auto from **CrUX via PSI** when origin qualifies; RES still paste |
| CrUX as primary gate when qualified | Prefer over paste | **Watch** | `cwv-*-field` rows |
| Multi-URL PSI | Home + request-service + city + financing | **Done** May 26 | `psi-lab-worst-lcp` KPI row |
| Lighthouse CI on PR (F7) | 3 URLs regression gate | **Done** May 26 | `.github/workflows/lighthouse-ci.yml` |
| Quarterly Unlighthouse (F13) | 31 routes | **Scheduled** | Aug 4, 2026 |
| Sanity `useCdn: true` + dedupe fetches | Faster cold TTFB | **Done** May 26 | `lib/sanity.js` React `cache()` |
| Lab LCP &lt;1.25s | Stretch | **Ongoing** | P2.20 — field LCP already good |

### SEO / quality automation

| Gap | Target state | Status | Owner / ref |
|---|---|---|---|
| Broken links weekly | 0 internal 4xx/5xx | **Done** May 26 | `broken-internal-links` KPI |
| HTML W3C validation | 0 errors / 5 URLs | **Queued** | Nu Validator API |
| Schema validity (not just coverage) | 0 invalid JSON-LD | **Queued** | Parser in audit script |

### Process / data honesty

| Gap | Target state | Status | Owner / ref |
|---|---|---|---|
| KPI snapshot only from CI | No local wipe of prod JSON | **Partial** | `GITHUB_ACTIONS` guard; **KPI-DASH-AUTO** archive fallback |
| GSC/GA4 gray when secrets missing | Archive fallback | **Partial** | Exists for uptime/Pa11y |
| P1 gate count | 11 gates with P1-G10 | **Done** | Re-run KPI audit to refresh graduation |
| Dependabot PRs ≠ KPI audit | Owner knows difference | **Doc** | This file |

---

## Recommended execution order

1. **Verify** — Merge or run CI; confirm `high=0 critical=0` (or list modules to fix).
2. **User** — Finish SEC-1 A4/A5/A6 + GSC spot-check.
3. **Agent** — KPI-DASH-AUTO (Vercel drain or documented manual refresh SOP + CrUX-first gates).
4. **Agent** — Sanity CDN + layout fetch dedupe (performance).
5. **Agent** — Lighthouse CI (F7) + multi-URL PSI.
6. **Agent** — gitleaks v3 before June 2.
7. **Optional** — Sentry, edge rate limit, studio IP allowlist.

---

## Dependabot PRs (#117 / #118) — not the weekly audit

| PR | Action |
|---|---|
| **#117** production-deps group | Review CI; merge if `yarn audit` + checks green |
| **#118** next-sanity 13 | Test `/studio` + Sanity fetches; major bump — dedicated QA |

---

## Success criteria (“foundation shored”)

- [ ] `yarn audit --groups dependencies`: **0 high, 0 critical** (CI green 4+ weeks)
- [ ] KPI **P1 graduation** includes P1-G10 green without waiver
- [ ] Vercel RUM KPI rows match dashboard (auto or ≤7d manual SOP)
- [ ] SEC-1 checklist complete (firewall done; filters + 2FA + GSC)
- [ ] gitleaks v3 on Node 24
- [ ] 0 broken internal links in weekly KPI
- [ ] No silent gray on GSC/GA4 when secrets configured

**Cross-ref:** `KPI_DASHBOARD_GUIDE.md` · `RECURRING_MAINTENANCE.md` · `ROADMAP.md` #18 KPI-DASH-AUTO
