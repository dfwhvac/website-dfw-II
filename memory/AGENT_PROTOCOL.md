# Agent Protocol — Read at Session Start

**Purpose:** Prevent the recurring `package.json` / `yarn.lock` / `kpi-snapshot.json` merge-conflict pattern that has cost multiple sessions to recover from.

---

## The Root Cause (Memorize This)

The Emergent pod is **forked from `main` at session start** and **does not auto-pull** during the session. Meanwhile, `main` keeps receiving commits from:

- Dependabot weekly merges (every Monday 8 AM CT)
- KPI Audit workflow snapshot commits (every Monday 7 AM CT)
- Any other PRs merged during the session
- Any agent activity on parallel sessions

By the time a session pushes, the pod's working tree is a "fossilized" snapshot of an old `main`. When GitHub does the 3-way merge, any file the agent touched that *also* changed on `main` produces a conflict.

---

## Mandatory Pre-Edit Sync Ritual

**BEFORE editing any of these files**, the agent must sync pod content from `main` first:

| File pattern | Why it's high-collision |
|---|---|
| `frontend/package.json` | Dependabot edits this weekly |
| `frontend/yarn.lock` | Same — every dep bump rewrites it |
| `.github/dependabot.yml` | Dependabot itself touches scope |
| `.github/workflows/*.yml` | KPI Audit + security workflows |
| `frontend/next.config.js` | Touched by some Dependabot updates |
| `frontend/public/internal/kpi-snapshot.json` | Auto-committed by CI weekly (script now writes `.local.json` in dev mode to avoid this; still verify) |
| `frontend/public/internal/kpi-dashboard.html` | KPI Audit may regenerate |
| `memory/audits/kpi-snapshot-archive/*.json` | Auto-committed by CI weekly |

### Sync command (paste-ready)

```bash
REPO="dfwhvac/website-dfw-II"
for f in frontend/package.json frontend/yarn.lock .github/dependabot.yml frontend/next.config.js ; do
  curl -fsSL "https://raw.githubusercontent.com/${REPO}/main/${f}" -o "/app/${f}"
  echo "synced: ${f}"
done
# Optional but recommended: refresh node_modules to match
cd /app/frontend && rm -rf node_modules && yarn install
```

Run this at the **start** of any task that touches the files above. Takes ~30 seconds.

---

## Resolution Pattern When a Conflict Has Already Formed

If a conflict has already shipped to a PR (you'll see "This branch has conflicts" on GitHub):

1. **Inspect, don't guess** — pull both versions via GitHub raw URLs:
   ```bash
   curl -fsSL "https://raw.githubusercontent.com/dfwhvac/website-dfw-II/main/<file>" -o /tmp/main-version
   curl -fsSL "https://raw.githubusercontent.com/dfwhvac/website-dfw-II/<branch>/<file>" -o /tmp/branch-version
   diff /tmp/main-version /tmp/branch-version
   ```

2. **For auto-generated files** (snapshots, archives) — take `main`'s version. CI will regenerate.

3. **For `package.json` + `yarn.lock`** — the dual-file approach:
   - Copy `main`'s `package.json` into pod
   - Apply the intended delta (e.g., `yarn remove <pkg>` or `yarn add <pkg>`)
   - Copy `main`'s `yarn.lock` into pod
   - `rm -rf node_modules && yarn install` to produce a yarn.lock = `main`'s + the minimal delta
   - Verify with `diff frontend/yarn.lock /tmp/main-lock | wc -l` — should be < 20 lines for typical edits

   **Critical:** Without the `rm -rf node_modules` step, `yarn install` may keep stale transitive resolutions and produce a 100+ line spurious diff. Always nuke `node_modules` for dep edits in a session where the pod was forked stale.

4. **Push.** The 3-way merge becomes trivial because both sides differ from the merge base on disjoint or near-disjoint lines.

---

## Infrastructure Backstop

In addition to the agent protocol above, the repo enforces freshness via:

1. **`.github/workflows/branch-freshness.yml`** — Fails CI on any PR whose `package.json` or `yarn.lock` is more than 25 commits behind `main`. Forces the agent (or human) to refresh before merge.

2. **Branch protection: "Require branches to be up to date before merging"** — Set in GitHub repo Settings → Branches. Requires the user to enable manually one time. Once on, GitHub blocks merge buttons until the branch is fully current.

The CI check is automatic; the branch-protection checkbox is a one-time human action.

---

## Anti-Patterns (Do Not Do)

- ❌ Run `yarn add <pkg>` or `yarn remove <pkg>` on a stale pod without syncing first
- ❌ Manually craft yarn.lock edits — always let `yarn install` do it
- ❌ Push package.json without the matching yarn.lock update (Vercel uses `--frozen-lockfile` and will fail the build)
- ❌ Resolve a conflict by clicking GitHub's web editor "take both" on yarn.lock — produces invalid lockfiles
- ❌ Run `yarn install` against synced lockfile but stale `node_modules` — produces spurious lockfile churn

---

## When in Doubt

Ask the user. Do not push speculative changes to `package.json` / `yarn.lock` without verifying they're a minimal delta against current `main`.
