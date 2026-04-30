# Backup & Disaster Recovery Checklist

**Created:** February 28, 2026 (Phase 1 P1.D-F4)
**Owner:** Site owner (user)
**Cadence:** Quarterly (verification) · Annually (full DR drill)

The DFW HVAC site has **four independent state stores**, each with its own
recovery profile. This document captures what to back up, what to verify,
and how to recover from each plausible disaster scenario.

---

## 1. Asset inventory

| Store | What's in it | Provider / Owner | RTO target | RPO target |
|---|---|---|---|---|
| **Source code** | All Next.js, components, schemas, scripts, internal docs | GitHub (`dfwhvac/website-dfw-II`) | 1 hr | 0 (every commit) |
| **Sanity dataset** | All CMS content: cities (28), services (7), companyInfo, FAQs, projects, brand colors | Sanity.io (`production` dataset) | 4 hrs | 24 hrs |
| **MongoDB Atlas** | All `leads` collection — every form submission since Apr 2025 | MongoDB Atlas (free or shared cluster) | 4 hrs | 1 hr (Atlas continuous backup) |
| **Vercel project config** | Env vars, domain bindings, deploy hooks, redirects | Vercel | 1 hr | 0 (Vercel-managed) |

**Definitions.**
RTO = Recovery Time Objective (how fast can we recover).
RPO = Recovery Point Objective (how much data we tolerate losing).

---

## 2. Backup procedures

### 2.1 GitHub (source code)

- ✅ **Already automatic.** Every "Save to GitHub" commits to `main`. Full history retained indefinitely on GitHub's infrastructure.
- ✅ **Local clone exists** (this Emergent workspace `/app/`).
- 🟡 **Verify quarterly:** Clone the repo to a separate machine and run `yarn install && yarn build`. Confirm a clean build outside the primary dev environment.

### 2.2 Sanity dataset

- 🔴 **Manual export required.** Sanity does NOT take automated backups on the free tier.
- **Procedure (run quarterly):**
  ```bash
  cd /app/frontend
  npx sanity dataset export production sanity-backup-$(date +%Y-%m-%d).tar.gz
  ```
  Resulting tarball includes all documents + assets. Store outside GitHub (drop to Google Drive, Dropbox, or local archive).
- **Reference docs:** https://www.sanity.io/docs/cli#dataset-management

### 2.3 MongoDB (leads collection)

- ✅ **Atlas automatic backups** if on M10+ tier. Free / shared tiers DO NOT auto-backup.
- 🔴 **If on free/shared tier:** export weekly via cron or Atlas UI. Procedure:
  ```bash
  mongodump --uri="$MONGO_URL" --db=$DB_NAME --collection=leads \
    --out=/tmp/mongo-leads-$(date +%Y-%m-%d)
  ```
  Store the `.bson` files outside Atlas (Google Drive recommended for HVAC PII; encrypt at rest).

### 2.4 Vercel project config

- 🟡 **Manual screenshot once per quarter.**
  - Vercel → Project → Settings → Environment Variables → screenshot all 3 envs (Production, Preview, Development)
  - Vercel → Project → Settings → Domains → screenshot domain bindings
  - Vercel → Project → Deployments → Redirects → record any non-`next.config.js` redirects
- Store screenshots in `/app/memory/audits/vercel-config-snapshots/` (or wherever the owner archives admin docs).

---

## 3. Recovery scenarios

### 3.1 GitHub repo deleted / corrupted

1. The `/app/` Emergent workspace holds the most recent local clone.
2. Push it to a fresh GitHub repo: `git remote set-url origin <new-url> && git push --all`
3. Reconnect Vercel → Settings → Git → connect to the new repo.
4. **Estimated RTO: 1 hour.**

### 3.2 Sanity dataset corrupted / accidentally deleted

1. Most-recent quarterly export → restore via:
   ```bash
   npx sanity dataset import sanity-backup-YYYY-MM-DD.tar.gz production --replace
   ```
2. **Risk:** up to 90 days of CMS edits lost between backups. Mitigation: increase backup cadence to monthly if active content edits resume.
3. **Estimated RTO: 4 hours.**

### 3.3 MongoDB connection lost / data lost

- Production lead notifications go via **Resend email** to the owner, so every lead since Apr 2025 also exists in the owner's email inbox as a fallback ledger.
- Restore from `mongodump` BSON dumps via `mongorestore`.
- **Estimated RTO: 4 hours.**

### 3.4 Vercel project deleted / banned

1. Re-create project on Vercel pointing at the GitHub repo.
2. Re-enter all env vars from the quarterly screenshot.
3. Re-bind domains (`dfwhvac.com` + `www.dfwhvac.com`) — DNS already at GoDaddy, just point Vercel at it.
4. Vercel auto-builds the latest `main` commit; site is live within 5 min of domain re-binding.
5. **Estimated RTO: 1 hour** (assuming env-var snapshot is current).

### 3.5 Domain / DNS lost

- Domain registrar = GoDaddy. Two-factor auth on GoDaddy account is owner's responsibility.
- DNS records documented in `/app/memory/ROADMAP.md` § INFRA-1.
- **Estimated RTO: 1 hour** if registrar access intact; up to 5 business days if registrar account is recovered through GoDaddy support.

---

## 4. Annual DR drill

Once a year, run a **full disaster simulation** on a sandbox/preview environment:

1. Spin up a fresh GitHub repo (or fork) → clone `/app/`.
2. Restore the most recent Sanity export to a new dataset (`production-drill`).
3. Connect a fresh Vercel project to the cloned repo + drill dataset.
4. Verify site builds + renders + form submission persists to a separate MongoDB collection.
5. Document the drill in `/app/memory/audits/YYYY-MM-DD_DR_Drill.md` — note any gaps.
6. **If anything failed**, update this checklist before clearing the drill ticket.

---

## 5. Quick reference card (print + save)

```
DFW HVAC site — emergency contacts
==================================
GitHub repo:         dfwhvac/website-dfw-II
Vercel project:      website-dfw-ii
Sanity project:      <fill in your sanity project ID>
Sanity dataset:      production
MongoDB cluster:     <fill in atlas cluster name>
Domain registrar:    GoDaddy
Hosting provider:    Vercel
Email service:       Resend (transactional)
Lead service:        MongoDB → Resend → owner inbox

If everything is on fire:
  1. Site down: check Vercel status + DNS at dnschecker.org
  2. Forms not submitting: check MongoDB Atlas + Resend dashboard
  3. CMS missing content: restore latest sanity-backup tarball
  4. Owner inbox missing leads: query MongoDB `leads` collection directly
```

---

## 6. Maintenance log

| Date | Action | Outcome | Owner |
|---|---|---|---|
| 2026-02-28 | DR checklist created | Initial baseline | Agent |
| _next entry_ | Quarterly backup verification | _pending_ | Owner |
