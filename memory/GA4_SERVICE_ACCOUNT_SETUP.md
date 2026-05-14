# GA4 Service Account Setup — ⚠️ SUPERSEDED (kept for historical reference only)

> **🚨 STATUS — Feb 2026:** This document describes the **service-account path** for GA4 + GSC auth that was **abandoned** after the user hit a Google Workspace IAM block (`iam.disableServiceAccountKeyCreation` org policy). The actual working path is **OAuth refresh-token flow**, completed ~3 days before this note was written.
>
> **What's actually deployed and working:**
> - GitHub repo secrets (verified live as of Feb 2026):
>   - `GOOGLE_CLIENT_ID` — OAuth client ID from `dfwhvac-kpi` GCP project's "DFW HVAC KPI Script" OAuth 2.0 client
>   - `GOOGLE_CLIENT_SECRET` — paired OAuth client secret
>   - `GOOGLE_REFRESH_TOKEN` — long-lived refresh token obtained via one-time interactive consent
>   - `GA4_PROPERTY_ID` — GA4 numeric property ID
>   - `GSC_SITE_URL` — `https://dfwhvac.com/` (or `sc-domain:dfwhvac.com`)
>   - `PAGESPEED_API_KEY` — Places-style API key (no OAuth needed for PSI)
> - GCP project housing the OAuth client: `dfwhvac-kpi`
> - Service-account JSON path: **never completed** — `dfwhvac-analytics-readonly` project deleted Feb 14, 2026
>
> **Why OAuth refresh token works where SA didn't:** the Workspace org policy that blocks service-account JSON key creation does NOT block OAuth client creation. The workflow exchanges the refresh token for a short-lived access token at run time, calls GA4/GSC, discards the token. No persistent SA credential anywhere.
>
> **Evidence it's working:** dfwhvac-kpi GCP project shows ~9 GA4 Data API calls + ~6 GSC API calls per day, zero errors. KPI dashboard's Phase 2 + Phase 3 cards populate correctly.
>
> **Do NOT re-attempt the service-account setup below** unless the Workspace IAM policy has been explicitly lifted by your Workspace Admin. If the OAuth refresh token ever expires (~6 months of inactivity per Google policy), re-run the one-time consent flow to mint a new one; don't fall back to this doc.

---

# GA4 Service Account Setup — User Walk-Through (HISTORICAL — DO NOT FOLLOW)

**Purpose:** Authorize the KPI dashboard to read your GA4 property data programmatically. One service account also unlocks Google Search Console (same auth flow), so this single 15-minute setup unblocks **17 of the 22 KPIs** across Phases 2 and 3 of the roadmap.

**Time required:** ~15 minutes (user-led, agent assists)
**Cost:** $0 — Google Cloud free tier
**Skills:** GUI clicks only, no code

---

## Why a Service Account (not OAuth)?

OAuth requires interactive consent every ~7 days — incompatible with a server-side weekly cron job. A service account is a "robot user" with permanent read-only access to specific properties you grant it. It's the standard pattern for analytics dashboards.

**Security posture:**
- Read-only access (the role we'll grant: `Viewer`)
- Scoped to specific GA4 property + GSC property only
- Credentials live in Vercel env vars, never in git
- Already covered by your existing `gitleaks` CI gate

---

## Step 1 — Create Google Cloud Project (3 min)

1. Visit **https://console.cloud.google.com/**
2. Top bar → project picker dropdown → **"New Project"**
3. Project name: `dfwhvac-analytics-readonly`
4. Click **Create** → wait ~10s → switch into it

**No billing required** for this project — service-account auth + Data API are free tier.

---

## Step 2 — Enable the APIs (2 min)

While in your new project:

1. Left nav → **APIs & Services → Library**
2. Search `Google Analytics Data API` → click result → **Enable**
3. Search `Google Search Console API` → click result → **Enable**

(Both share the same service account; no need to create two.)

---

## Step 3 — Create the Service Account (3 min)

1. Left nav → **IAM & Admin → Service Accounts**
2. **+ CREATE SERVICE ACCOUNT** (top button)
3. Name: `dfwhvac-kpi-reader`
4. ID: auto-generated (looks like `dfwhvac-kpi-reader@dfwhvac-analytics-readonly.iam.gserviceaccount.com`) — **copy this email, you'll need it**
5. Description: `Read-only access to GA4 + GSC for internal KPI dashboard`
6. Click **CREATE AND CONTINUE**
7. **Grant this service account access to project** — leave blank (we don't grant project-wide access)
8. Click **CONTINUE → DONE**

---

## Step 4 — Generate the JSON Key (1 min)

1. On the Service Accounts list page, click your new `dfwhvac-kpi-reader` row
2. Top tabs → **KEYS** tab
3. **ADD KEY → Create new key → JSON → CREATE**
4. A JSON file downloads automatically (filename like `dfwhvac-analytics-readonly-abc123.json`)

⚠️ **This file is the credentials.** Treat it like a password:
- Don't email it
- Don't commit it to git
- Don't paste it into Slack/Discord/screenshots

You'll paste its contents into Vercel in Step 7.

---

## Step 5 — Grant the Service Account Access to Your GA4 Property (3 min)

1. Visit **https://analytics.google.com/**
2. Bottom-left ⚙️ **Admin** icon
3. Confirm property dropdown shows your **DFW HVAC** property (not a different account)
4. Center column **"Property settings"** area → **Property access management**
5. Top right **+ → Add users**
6. Email: paste the service account email from Step 3 (the `...iam.gserviceaccount.com` one)
7. Roles: ✅ **Viewer** (this is the only role needed; uncheck anything else)
8. **Notify new users by email** — uncheck (it's a robot, no inbox)
9. Click **ADD**

**Verify:** The service account now appears in the access list with "Viewer" role.

---

## Step 6 — Grant the Service Account Access to Google Search Console (2 min)

1. Visit **https://search.google.com/search-console/**
2. Top-left property selector → ensure `https://dfwhvac.com/` is selected
3. Left nav → ⚙️ **Settings** (bottom)
4. **Users and permissions**
5. **ADD USER** (top right)
6. Email: paste the service account email (same one from Step 3)
7. Permission: **Restricted** (gives read-only — the API call we'll make only needs read)
8. Click **ADD**

---

## Step 7 — Add Credentials to Vercel (2 min)

1. Visit **https://vercel.com/neils-projects/website-dfw-ii-b4zk/settings/environment-variables** (your project)
2. **Add New** environment variable
3. Key: `GA4_SERVICE_ACCOUNT_JSON`
4. Value: open the JSON file from Step 4 → copy the entire file contents → paste into Vercel value field
5. Environments: ✅ Production · ✅ Preview · ✅ Development (all three)
6. Click **Save**

7. Add a second environment variable:
   - Key: `GA4_PROPERTY_ID`
   - Value: your GA4 numeric property ID (find at GA4 → Admin → Property settings → top of right column, looks like `123456789`)
   - All 3 environments → Save

8. Add a third (only if KPI dashboard needs CrUX field data):
   - Key: `CRUX_API_KEY`
   - Value: from `https://console.cloud.google.com/apis/credentials` (in the same project, create an API key, restrict to "Chrome UX Report API")
   - All 3 environments → Save

---

## Step 8 — Tell the Agent You're Done

Reply in chat with: **"GA4 service account configured."**

The agent will then:
1. Verify the env vars exist (without printing their values)
2. Make a test API call to confirm both GA4 + GSC return data
3. Wire `audit-kpis.mjs` to use the credentials
4. Re-run the dashboard build → Phase 2 + Phase 3 cards now light up with real numbers

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `permission denied: 403` on GA4 call | Service account email not added to property, or wrong role | Re-do Step 5; confirm role is "Viewer" |
| `permission denied` on GSC call | Same — not added to GSC property | Re-do Step 6; confirm property URL matches exactly |
| `Cannot read property 'rows' of undefined` | Property ID wrong or service account in wrong project | Confirm `GA4_PROPERTY_ID` matches the property you granted access to |
| `invalid_grant: Token has been expired or revoked` | Old JSON key still in env var; new key generated | Re-paste current JSON to `GA4_SERVICE_ACCOUNT_JSON` |
| Vercel build doesn't see new env var | Variable saved but no new deploy triggered | Trigger a redeploy (Vercel dashboard → Deployments → "..." → Redeploy) |

---

## What This Unlocks

After Step 8:

| KPI | Phase | Source |
|---|---|---|
| GA4 Sessions / Users / Bounce / Time on page (8 metrics) | Phase 3 | GA4 Data API |
| Form submission rate, phone click rate, overall CR | Phase 3 | GA4 events |
| Per-page CR (top 10 entry pages) | Phase 3 | GA4 dimensions |
| Mobile vs desktop CR parity | Phase 3 | GA4 device |
| Estimator funnel (start → complete → opt-in) | Phase 3 | GA4 funnel |
| GSC impressions / clicks / CTR / avg position | Phase 2 | GSC Search Analytics API |
| Sitemap indexing rate (live, not just submitted count) | Phase 2 | GSC URL Inspection API |
| Top 20 query position tracking | Phase 2 | GSC API |

That's **17 KPIs** across Phases 2 and 3 lit up by a single 15-minute setup.

---

## What's NOT covered by this

- **Microsoft Clarity** — separate API, separate token. Wait until May 27 (after 14-day baseline) to set up.
- **GBP** — Google Business Profile API has its own auth and admin requirements. We'll address it as a separate session if/when needed.
- **CallRail / Google Ads / Meta Ads** — Phase 4 / 5; address when ad spend launches.
- **Lead → booked-job rate** — your CRM has no API integration yet; manual entry into the dashboard for v1.
