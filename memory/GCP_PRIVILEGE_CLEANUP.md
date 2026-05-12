# GCP Privilege Cleanup — Post-OAuth Migration

**Created:** May 11, 2026
**Status:** 🟡 Pending user action
**Estimated time:** 5–8 minutes
**Risk if skipped:** Low immediate risk; medium long-term (over-privileged state, dormant service accounts are an audit/attack-surface liability)

---

## Background

While attempting to set up the GA4/GSC integration via the Service Account flow (later abandoned in favor of OAuth user-credentials), several Google Cloud changes were made that should now be reverted:

1. **`iam.disableServiceAccountKeyCreation` org policy** was relaxed from "Enforced" → "Not enforced"
2. **A service account** (`dfwhvac-analytics-reader@dfwhvac-kpi.iam.gserviceaccount.com`) was created
3. **A JSON key** was generated for that service account (and possibly downloaded locally)
4. **"Organization Policy Administrator" role** was granted to your user account so you could edit the org policy in step 1

The KPI dashboard is now powered by OAuth refresh tokens (Client ID + Client Secret + Refresh Token stored as GitHub Secrets), **not** by the service account. So all four of the above are dormant and should be cleaned up.

---

## ⚠️ Order matters

Do these in order. **Step 1 deletes secrets that can't be recovered. Step 4 removes privileges you'll need to complete Step 1.** Get the destructive cleanup done before downgrading yourself.

---

## Step 1 — Delete the JSON key file(s) on your local machine

**Where:** Your Downloads folder, Desktop, or wherever you saved the file when Google Cloud showed the "Download JSON" prompt during the Service Account creation walkthrough.

1. Open Finder (Mac) / File Explorer (Windows)
2. Search for files matching this pattern:
   - `dfwhvac-kpi-*.json`
   - `*service*account*.json`
   - Any JSON file with a name containing `dfwhvac` from May 11
3. **Empty the Trash / Recycle Bin** after deleting (a normal delete just moves the file; the secret is still recoverable)
4. If you also pasted the JSON contents into any text editor, password manager note, or scratch document — delete those too

🛑 **Do not skip this.** If this file ever leaks (committed to a public repo, emailed, screen-shared), an attacker with the JSON key gets full read access to your GA4 + GSC data and can potentially escalate from there.

---

## Step 2 — Delete the JSON key inside Google Cloud

Even if you deleted the local file, the key itself is registered server-side at Google and remains valid until revoked.

1. Go to: **https://console.cloud.google.com/iam-admin/serviceaccounts?project=dfwhvac-kpi**
2. Click the service account email: **`dfwhvac-analytics-reader@dfwhvac-kpi.iam.gserviceaccount.com`**
3. Click the **"KEYS"** tab at the top
4. For each key listed (probably 1 with "Key creation date" of May 11, 2026):
   - Click the trash icon 🗑️ at the right of the row
   - Confirm: "Delete key"
5. You should see **"No keys found"** when done

This server-side revokes the key. Even if a copy of the JSON exists somewhere, it cannot authenticate to Google APIs.

---

## Step 3 — Delete the dormant Service Account (optional but recommended)

The service account itself has no keys now, but it still exists with permissions to call GA4/GSC. Best practice: delete it entirely.

1. Same page: **https://console.cloud.google.com/iam-admin/serviceaccounts?project=dfwhvac-kpi**
2. Check the box ☑️ next to `dfwhvac-analytics-reader@dfwhvac-kpi.iam.gserviceaccount.com`
3. Click **"DELETE"** at the top of the page
4. Confirm by typing the service account email (Google requires this to prevent accidents)
5. Click **DELETE**

⚠️ **Side effect:** If you ever revoked GA4 / GSC permissions for the service account specifically (we did this during setup), those grants are now orphaned references. No action needed — they'll show as "Unknown account" in GA4 Property Access Management. You can clean those up manually:
- **GA4 Admin → Property Access Management:** remove any `dfwhvac-analytics-reader@...` entries
- **GSC → Settings → Users and permissions:** remove the same email

---

## Step 4 — Re-enable the `iam.disableServiceAccountKeyCreation` org policy

This is the high-impact one. The policy you relaxed prevents *anyone* in your Google Workspace from creating service account JSON keys. Re-enabling it restores the "always rotated, never raw keys" security posture.

1. Go to: **https://console.cloud.google.com/iam-admin/orgpolicies**
2. Make sure the **organization** is selected at the top (not the `dfwhvac-kpi` project) — the policy lives at the org level
3. In the search box, type: **`Disable service account key creation`**
4. Click the policy row to open it
5. Click **"MANAGE POLICY"** (top right)
6. Two options — pick (a) if you only set this at the org level recently, (b) if you're not sure:
   - **(a) Simplest:** Set **"Applies to"** → **"Inherit parent's policy"**. Save. This reverts to whatever Google's default or your parent org has. _Recommended._
   - **(b) Explicit:** Set **"Policy enforcement"** → **"On"**. Set the rule to **"Enforced"**. Save.
7. Verify: refresh the page. The policy status column should show **"Enforced"** (or "Inherited" if you chose (a) and the parent is enforced).

To sanity-check: go to **https://console.cloud.google.com/iam-admin/serviceaccounts?project=dfwhvac-kpi** → click any service account → KEYS tab → try **"ADD KEY → Create new key"**. You should get a permission error or a notice that the policy blocks this. That confirms the policy is working again.

---

## Step 5 — Remove the elevated role from your user account

You granted yourself **"Organization Policy Administrator"** at the org level so you could edit the policy in Step 4. After that policy edit lands, you don't need this role for normal day-to-day work. Principle of least privilege says: drop it.

1. Go to: **https://console.cloud.google.com/iam-admin/iam**
2. At the very top, make sure the picker shows your **organization name**, NOT the `dfwhvac-kpi` project. (IAM at the org level vs project level are different screens.)
3. Find the row with **your user email**
4. Click the **pencil icon ✏️** at the right of your row to edit
5. Find the role: **"Organization Policy Administrator"** (or `roles/orgpolicy.policyAdmin`)
6. Click the trash icon 🗑️ next to it to remove
7. Click **SAVE**

⚠️ **Important:** Do NOT remove other roles. You likely still have:
- `Organization Administrator` or `Owner` — keep this; it's your normal admin role
- `Project Owner` on `dfwhvac-kpi` — keep this
- `Service Account Admin` (project-level) — keep if present; needed for normal SA management

If anything looks off, **stop and screenshot before saving**. We can adjust on the next session if needed.

---

## Step 6 — Verify the OAuth flow still works

Just to make sure we didn't accidentally break the live KPI dashboard:

1. Go to **GitHub → Actions tab → KPI Audit → Run workflow**
2. Wait ~30 sec for it to start, then watch the log
3. You should still see: `[kpi] google oauth: access token acquired`
4. The 13 unlocked KPI cards should still show real GSC + GA4 data

If something fails after the cleanup, the most likely cause is that you accidentally deleted the OAuth Client (different page from the Service Account, but easy to confuse). To check: **https://console.cloud.google.com/apis/credentials?project=dfwhvac-kpi** should still show "DFW HVAC KPI Script" under "OAuth 2.0 Client IDs". If it does, the OAuth flow is intact.

---

## Optional Step 7 — Audit logs

Google Cloud keeps audit logs of all these changes. If you want a paper trail of who did what (you, on May 11):

- **Activity log:** https://console.cloud.google.com/home/activity?project=dfwhvac-kpi
- Filter by "Service Account" or "Organization Policy" to see the timeline

Useful for compliance/post-mortem; skip if you don't need it.

---

## Summary checklist

- [ ] **Step 1** — Local JSON key file(s) deleted + Trash emptied
- [ ] **Step 2** — JSON key revoked in GCP console
- [ ] **Step 3** — Service account `dfwhvac-analytics-reader` deleted (optional)
- [ ] **Step 4** — `iam.disableServiceAccountKeyCreation` policy back to Enforced/Inherited
- [ ] **Step 5** — "Organization Policy Administrator" role removed from your user
- [ ] **Step 6** — OAuth flow still working (KPI Audit workflow runs green)

When this is all done, mark this file's status at the top as **✅ Complete (May XX, 2026)** and remove the corresponding to-do item from `ROADMAP.md`.
