# 📋 Post-Deploy Action Items — PR #2 (Sprint 1 Completion)

**Created:** April 21, 2026
**Earliest execution date:** 🕐 **On or after 1:00 AM Tuesday, April 22, 2026**
**Reason for delay:** GA4 needs ~24 hours after first event fire before events appear in the Events dashboard. Flipping "Mark as conversion" too early results in an empty events list.

---

## ⚡ What triggered this doc

PR #2 shipped two new GA4 events (`form_submit_lead`, `phone_click`) in code. Once the
PR is merged and Vercel deploys to production, real user traffic will start firing these
events. You then have to go into the GA4 dashboard and mark them as conversions so that
Smart Bidding (once Google Ads launches in ~11 weeks) can optimize on them.

---

## ✅ Checklist (do after 1 AM on Apr 22, 2026)

### Step 0 — Verify the PR is actually live on production
- [ ] Visit `https://dfwhvac.com` → hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- [ ] Open browser DevTools → Network tab → filter for `collect?v=2` (GA4 requests)
- [ ] Click any `tel:` link in the header or footer → you should see a `collect?...&en=phone_click` request fire
- [ ] Submit a test form (fake data is fine — use `(555) 555-5555` and a throwaway email) → you should see a `collect?...&en=form_submit_lead` request fire
- If either event does NOT fire: STOP, something is wrong with the deploy. Do not proceed to Step 1 until fixed.

### Step 1 — Confirm events appear in GA4
- [ ] Log into https://analytics.google.com
- [ ] Select the **DFW HVAC** property (GA4 ID: `G-5MX2NE7C73`)
- [ ] Left sidebar → **Reports** → **Realtime** (top of list)
- [ ] Trigger another test event on the live site (tap a phone link, submit a form)
- [ ] Confirm you see `phone_click` and/or `form_submit_lead` show up within ~30 seconds in the "Event count by Event name" card
- If events show in Realtime but you want to skip waiting 24h, you can proceed to Step 2 immediately. Realtime confirmation means they'll definitely show in the Events dashboard within 24h.

### Step 2 — Mark both as conversions
- [ ] In GA4 left sidebar → click the **gear icon (⚙ Admin)** at bottom left
- [ ] In the **Property** column → **Events**
- [ ] You should see a list of all event names firing. Look for:
  - `form_submit_lead`
  - `phone_click`
- [ ] For each one, find the **"Mark as conversion"** toggle on the right side of the row → flip to **ON** (blue)
- [ ] Wait 2-3 minutes, then refresh. Both events should now appear in the **Conversions** sub-menu as well.

### Step 3 — (Optional but recommended) Set up a custom dashboard
- [ ] GA4 → **Reports** → **Library** (bottom left)
- [ ] **Create new report** → "Lead Conversions Overview"
- [ ] Add widgets:
  - Conversions by event name (time series, last 28 days)
  - Conversions by source/medium (table)
  - Conversions by landing page (table)
- [ ] Save + pin to left sidebar for quick access

### Step 4 — Document the baseline
- [ ] Note today's date in `/app/frontend/internal/DFW_HVAC_Performance_Scorecard.md` as "GA4 Conversion Tracking Live — Day 0"
- [ ] After 7 days, capture: total `form_submit_lead` count + total `phone_click` count → this is your **pre-ad-launch baseline** that Google Ads will lift off
- [ ] After 30 days, repeat. After 60 days, repeat. This rolling baseline is critical for attributing what Google Ads actually adds vs. what organic was already doing.

---

## 🧠 Why this matters for the 12-week ad launch plan

| Metric | Today (Apr 21) | Target by Ad Launch Day (~July 14) |
|---|---|---|
| Days of GA4 conversion data | 0 | 80+ |
| `form_submit_lead` baseline | Unknown | Established rolling avg |
| `phone_click` baseline | Unknown | Established rolling avg |
| Smart Bidding eligibility | Not met (needs 30+ conversions/mo) | Should be met on form alone, definitely met when phone calls included |

**Without Step 2 above:** Google Ads will launch in July with zero conversion history,
Smart Bidding will be flying blind, and CPCs will be 30-50% higher for the first 60 days
as the algorithm learns. **With Step 2:** The algorithm starts optimizing on Day 1 of
spend.

---

## 🗂 Context links (for the next agent or future you)

- Code change that fires `form_submit_lead`: `/app/frontend/components/LeadForm.jsx` + `/app/frontend/components/SimpleContactForm.jsx` — look for `form_submit_lead` string
- Code change that fires `phone_click`: `/app/frontend/components/PhoneClickTracker.jsx` (mounted in `/app/frontend/app/layout.js`)
- GA4 property ID (hardcoded in layout): `G-5MX2NE7C73`
- Full PR #2 summary: `/app/memory/PRD.md` (most recent entry)
- Roadmap sequence: `/app/memory/NEXT_SESSION_PRIORITIES.md` (Week 1 of 12-Week Ad Launch Roadmap)

---

**When completed, delete this file** (`/app/memory/POST_DEPLOY_ACTION_ITEMS_PR2.md`)
or move it to `/app/frontend/internal/` as a historical record.
